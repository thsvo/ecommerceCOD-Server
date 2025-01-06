import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import config from "../../config";
import appError from "../../errors/appError";
import { Status } from "../../interface/global/global.interface";
import { formatResultImage } from "../../utils/formatResultImage";
import { paginateAndSort } from "../../utils/paginateAndSort";
import { compareHashPassword, hashPassword } from "../../utils/passwordUtils";
import { sendEmail } from "../../utils/sendEmail";
import { createToken } from "./auth.utils";
import { TUser } from "./user.interface";
import { userModel } from "./user.model";

const createUserService = async (userData: TUser) => {
  const result = await userModel.create(userData);
  return result;
};

const loginUserService = async (userData: any) => {
  const query = {
    $or: [{ email: userData.emailNumber }, { number: userData.emailNumber }],
  };

  const user = await userModel
    .findOne(query)
    .select("_id username email number password role status");

  if (!user) {
    throw new Error("User not found!");
  }

  if (user.status !== Status.ACTIVE) {
    throw new Error("Your account is inactive. Please contact support.");
  }

  if (!(await compareHashPassword(userData.password, user.password))) {
    throw new Error("Wrong password! Please try again with a valid password!");
  }

  const expirationTime = Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60);

  const jwtPayload = {
    userId: user._id,
    email: user.email,
    number: user.number,
    role: user.role,
    exp: expirationTime,
  };

  const token = jwt.sign(jwtPayload, config.jwt_access_secret as string);

  return {
    user: {
      _id: user._id,
      name: user.name,
      number: user.number,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const changeUserPasswordService = async (
  userId: string,
  userData: { current_password: string; new_password: string }
) => {
  const user = await userModel
    .findById(userId)
    .select("password previous_passwords");

  if (!user) {
    throw new Error("User not found!");
  }

  // Compare current password
  const matchPassword = await compareHashPassword(
    userData.current_password,
    user.password
  );
  if (!matchPassword) {
    throw new Error("Incorrect current password! Please try again.");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Ensure the new password is not the same as the current password
    const isSameAsCurrent = await compareHashPassword(
      userData.new_password,
      user.password
    );
    if (isSameAsCurrent) {
      throw new Error(
        "New password must be different from the current password."
      );
    }

    const previousPasswords = user.previous_passwords || [];

    // Check only against the last two passwords
    const lastTwoPasswords = previousPasswords;
    for (const previousPasswordObj of lastTwoPasswords) {
      const isSameAsPrevious = await compareHashPassword(
        userData.new_password,
        previousPasswordObj.password
      );
      if (isSameAsPrevious) {
        throw new Error(
          "New password must not match any of the last two used passwords."
        );
      }
    }

    // Hash the new password
    const hashedPassword = await hashPassword(userData.new_password);

    // If there are more than 2 previous passwords, remove the oldest one
    if (previousPasswords.length >= 2) {
      await userModel.findByIdAndUpdate(
        userId,
        {
          $pull: {
            previous_passwords: { password: previousPasswords[0].password },
          },
        },
        { session }
      );
    }

    // Update the user password and add the new password to previous passwords
    await userModel.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
        $push: {
          previous_passwords: {
            password: hashedPassword,
            createdAt: new Date(),
          },
        },
      },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    await session.endSession();

    // Return the updated user
    return await userModel.findById(userId);
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error("Failed to change password. " + error.message);
  }
};

const forgotPasswordService = async (userEmail: string) => {
  const query = { email: userEmail };

  const user = await userModel.findOne(query);

  if (!user) {
    throw new appError(httpStatus.NOT_FOUND, "This user is not found!");
  }

  if (user.status !== Status.ACTIVE) {
    throw new appError(
      httpStatus.FORBIDDEN,
      "This user is inactive! Please contact support."
    );
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "10m"
  );

  const resetUILink = `${config.client_url}?email=${user.email}&token=${resetToken} `;

  sendEmail(user.email, resetUILink);
};

const resetPasswordService = async (
  payload: { email: string; new_password: string },
  token: string
) => {
  // checking if the user is exist
  const query = { email: payload.email };

  const user = await userModel.findOne(query);

  if (!user) {
    throw new appError(httpStatus.NOT_FOUND, "This user is not found!");
  }
  if (user.status !== Status.ACTIVE) {
    throw new appError(
      httpStatus.FORBIDDEN,
      "This user is inactive! Please contact support."
    );
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;

  if (payload.email !== decoded.email) {
    throw new appError(httpStatus.FORBIDDEN, "You are forbidden!");
  }

  //hash new password
  const newHashedPassword = await hashPassword(payload.new_password);

  await userModel.findOneAndUpdate(
    {
      email: decoded.email,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    }
  );
};

// Get all users with optional pagination
const getAllUserService = async (
  page?: number,
  limit?: number,
  searchText?: string,
  searchFields: string[] = []
) => {
  let results;

  if (page && limit) {
    const query = userModel.find();
    const result = await paginateAndSort(
      query,
      page,
      limit,
      searchText,
      searchFields
    );

    result.results = formatResultImage<TUser>(
      result.results,
      "profile_image"
    ) as TUser[];

    return result;
  } else {
    results = await userModel.find().sort({ createdAt: -1 }).exec();

    results = formatResultImage(results, "profile_image");

    return {
      results,
    };
  }
};

//Get single user
const getSingleUserService = async (userId: string) => {
  let query;

  if (mongoose.Types.ObjectId.isValid(userId)) {
    query = {
      $or: [{ _id: userId }, { number: userId }],
    };
  } else {
    query = {
      $or: [{ number: userId }],
    };
  }

  const result = await userModel.find(query).exec();

  if (!result || result.length === 0) {
    throw new Error("User not found for this identifier");
  }

  const user = result[0];

  if (typeof user.profile_image === "string") {
    const formattedAttachment = formatResultImage<TUser>(user.profile_image);
    if (typeof formattedAttachment === "string") {
      user.profile_image = formattedAttachment;
    }
  }

  return user;
};

const updateUserStatusService = async (
  userId: string | number,
  status: string
) => {
  const queryId =
    typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;

  // Check if the user exists
  const userExists = await userModel.exists({ _id: queryId });
  if (!userExists) {
    throw new Error("User not found");
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    queryId,
    { status },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("Failed to update user status");
  }

  return updatedUser;
};

const updateSingleUserService = async (
  userId: string | number,
  userData: Partial<TUser>
) => {
  const queryId =
    typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;

  const result = await userModel
    .findByIdAndUpdate(
      queryId,
      { $set: userData },
      { new: true, runValidators: true }
    )
    .exec();

  if (!result) {
    throw new Error("User not found");
  }

  return result;
};

export const userServices = {
  createUserService,
  loginUserService,
  changeUserPasswordService,
  forgotPasswordService,
  resetPasswordService,
  getAllUserService,
  getSingleUserService,
  updateUserStatusService,
  updateSingleUserService,
};
