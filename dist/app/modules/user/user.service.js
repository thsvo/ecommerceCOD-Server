"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const appError_1 = __importDefault(require("../../errors/appError"));
const global_interface_1 = require("../../interface/global/global.interface");
const formatResultImage_1 = require("../../utils/formatResultImage");
const paginateAndSort_1 = require("../../utils/paginateAndSort");
const passwordUtils_1 = require("../../utils/passwordUtils");
const sendEmail_1 = require("../../utils/sendEmail");
const auth_utils_1 = require("./auth.utils");
const user_model_1 = require("./user.model");
const createUserService = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.userModel.create(userData);
    return result;
});
const loginUserService = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
        $or: [{ email: userData.emailNumber }, { number: userData.emailNumber }],
    };
    const user = yield user_model_1.userModel
        .findOne(query)
        .select("_id username email number password role status");
    if (!user) {
        throw new Error("User not found!");
    }
    if (user.status !== global_interface_1.Status.ACTIVE) {
        throw new Error("Your account is inactive. Please contact support.");
    }
    if (!(yield (0, passwordUtils_1.compareHashPassword)(userData.password, user.password))) {
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
    const token = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret);
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
});
const changeUserPasswordService = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel
        .findById(userId)
        .select("password previous_passwords");
    if (!user) {
        throw new Error("User not found!");
    }
    // Compare current password
    const matchPassword = yield (0, passwordUtils_1.compareHashPassword)(userData.current_password, user.password);
    if (!matchPassword) {
        throw new Error("Incorrect current password! Please try again.");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Ensure the new password is not the same as the current password
        const isSameAsCurrent = yield (0, passwordUtils_1.compareHashPassword)(userData.new_password, user.password);
        if (isSameAsCurrent) {
            throw new Error("New password must be different from the current password.");
        }
        const previousPasswords = user.previous_passwords || [];
        // Check only against the last two passwords
        const lastTwoPasswords = previousPasswords;
        for (const previousPasswordObj of lastTwoPasswords) {
            const isSameAsPrevious = yield (0, passwordUtils_1.compareHashPassword)(userData.new_password, previousPasswordObj.password);
            if (isSameAsPrevious) {
                throw new Error("New password must not match any of the last two used passwords.");
            }
        }
        // Hash the new password
        const hashedPassword = yield (0, passwordUtils_1.hashPassword)(userData.new_password);
        // If there are more than 2 previous passwords, remove the oldest one
        if (previousPasswords.length >= 2) {
            yield user_model_1.userModel.findByIdAndUpdate(userId, {
                $pull: {
                    previous_passwords: { password: previousPasswords[0].password },
                },
            }, { session });
        }
        // Update the user password and add the new password to previous passwords
        yield user_model_1.userModel.findByIdAndUpdate(userId, {
            password: hashedPassword,
            $push: {
                previous_passwords: {
                    password: hashedPassword,
                    createdAt: new Date(),
                },
            },
        }, { session });
        // Commit the transaction
        yield session.commitTransaction();
        yield session.endSession();
        // Return the updated user
        return yield user_model_1.userModel.findById(userId);
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error("Failed to change password. " + error.message);
    }
});
const forgotPasswordService = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const query = { email: userEmail };
    const user = yield user_model_1.userModel.findOne(query);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "This user is not found!");
    }
    if (user.status !== global_interface_1.Status.ACTIVE) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "This user is inactive! Please contact support.");
    }
    const jwtPayload = {
        email: user.email,
        role: user.role,
    };
    const resetToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, "10m");
    const resetUILink = `${config_1.default.client_url}?email=${user.email}&token=${resetToken} `;
    (0, sendEmail_1.sendEmail)(user.email, resetUILink);
});
const resetPasswordService = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const query = { email: payload.email };
    const user = yield user_model_1.userModel.findOne(query);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "This user is not found!");
    }
    if (user.status !== global_interface_1.Status.ACTIVE) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "This user is inactive! Please contact support.");
    }
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    if (payload.email !== decoded.email) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "You are forbidden!");
    }
    //hash new password
    const newHashedPassword = yield (0, passwordUtils_1.hashPassword)(payload.new_password);
    yield user_model_1.userModel.findOneAndUpdate({
        email: decoded.email,
        role: decoded.role,
    }, {
        password: newHashedPassword,
        passwordChangedAt: new Date(),
    });
});
// Get all users with optional pagination
const getAllUserService = (page_1, limit_1, searchText_1, ...args_1) => __awaiter(void 0, [page_1, limit_1, searchText_1, ...args_1], void 0, function* (page, limit, searchText, searchFields = []) {
    let results;
    if (page && limit) {
        const query = user_model_1.userModel.find();
        const result = yield (0, paginateAndSort_1.paginateAndSort)(query, page, limit, searchText, searchFields);
        result.results = (0, formatResultImage_1.formatResultImage)(result.results, "profile_image");
        return result;
    }
    else {
        results = yield user_model_1.userModel.find().sort({ createdAt: -1 }).exec();
        results = (0, formatResultImage_1.formatResultImage)(results, "profile_image");
        return {
            results,
        };
    }
});
//Get single user
const getSingleUserService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    let query;
    if (mongoose_1.default.Types.ObjectId.isValid(userId)) {
        query = {
            $or: [{ _id: userId }, { number: userId }],
        };
    }
    else {
        query = {
            $or: [{ number: userId }],
        };
    }
    const result = yield user_model_1.userModel.find(query).exec();
    if (!result || result.length === 0) {
        throw new Error("User not found for this identifier");
    }
    const user = result[0];
    if (typeof user.profile_image === "string") {
        const formattedAttachment = (0, formatResultImage_1.formatResultImage)(user.profile_image);
        if (typeof formattedAttachment === "string") {
            user.profile_image = formattedAttachment;
        }
    }
    return user;
});
const updateUserStatusService = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof userId === "string" ? new mongoose_1.default.Types.ObjectId(userId) : userId;
    // Check if the user exists
    const userExists = yield user_model_1.userModel.exists({ _id: queryId });
    if (!userExists) {
        throw new Error("User not found");
    }
    const updatedUser = yield user_model_1.userModel.findByIdAndUpdate(queryId, { status }, { new: true });
    if (!updatedUser) {
        throw new Error("Failed to update user status");
    }
    return updatedUser;
});
const updateSingleUserService = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof userId === "string" ? new mongoose_1.default.Types.ObjectId(userId) : userId;
    const result = yield user_model_1.userModel
        .findByIdAndUpdate(queryId, { $set: userData }, { new: true, runValidators: true })
        .exec();
    if (!result) {
        throw new Error("User not found");
    }
    return result;
});
exports.userServices = {
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
