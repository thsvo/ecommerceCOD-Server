import mongoose from "mongoose";
import { paginateAndSort } from "../../utils/paginateAndSort";
import { compareModel } from "./compare.model";
import { ICompare } from "./compare.interface";

//Create a Compare into database
const createCompareService = async (compareData: ICompare) => {
  const { user, deviceId, product } = compareData;

  if (!user && !deviceId) {
    throw new Error("Either user or deviceId must be provided.");
  }

  const query: any = {};
  if (user) query.user = user;
  if (deviceId) query.deviceId = deviceId;

  const existingCompare = await compareModel.findOne(query);

  if (existingCompare) {
    if (existingCompare.product.length >= 2) {
      throw new Error("You can only compare up to two products.");
    }

    const productId = new mongoose.Types.ObjectId(product[0]);

    if (existingCompare.product.some((p) => p.equals(productId))) {
      throw new Error("This product is already in your compare list.");
    }

    existingCompare.product.push(productId);
    await existingCompare.save();
    return existingCompare;
  }

  const formattedData = {
    ...compareData,
    product: compareData.product.map((p) => new mongoose.Types.ObjectId(p)),
  };

  const result = await compareModel.create(formattedData);
  return result;
};

// Get all Compare with optional pagination
const getAllCompareService = async (
  page?: number,
  limit?: number,
  searchText?: string,
  searchFields?: string[]
) => {
  let results;

  if (page && limit) {
    const query = compareModel.find().populate("product").populate("user");

    const result = await paginateAndSort(
      query,
      page,
      limit,
      searchText,
      searchFields
    );

    return result;
  } else {
    results = await compareModel
      .find()
      .populate("product")
      .populate("user")
      .sort({ createdAt: -1 })
      .exec();

    return {
      results,
    };
  }
};

//Get single Compare
const getSingleCompareService = async (compareId: number | string) => {
  const queryId =
    typeof compareId === "string"
      ? new mongoose.Types.ObjectId(compareId)
      : compareId;

  const result = await compareModel
    .findById(queryId)
    .populate("product")
    .populate("user")
    .exec();

  if (!result) {
    throw new Error("Compare not found");
  }

  return result;
};

const getSingleCompareByUserService = async (userId: string) => {
  let query;

  if (mongoose.Types.ObjectId.isValid(userId)) {
    query = {
      $or: [{ user: userId }, { deviceId: userId }],
    };
  } else {
    query = {
      $or: [{ deviceId: userId }],
    };
  }

  const result = await compareModel
    .find(query)
    .populate("product")
    .populate("user")
    .exec();

  if (!result || result.length === 0) {
    throw new Error("Compare not found for this identifier");
  }

  return result;
};

//Update single Compare
const updateSingleCompareService = async (
  compareId: string | number,
  compareData: ICompare
) => {
  const queryId =
    typeof compareId === "string"
      ? new mongoose.Types.ObjectId(compareId)
      : compareId;

  const result = await compareModel
    .findByIdAndUpdate(
      queryId,
      { $set: compareData },
      { new: true, runValidators: true }
    )
    .exec();

  if (!result) {
    throw new Error("Compare not found");
  }

  return result;
};

//Delete single Compare
const deleteSingleCompareService = async (compareId: string | number) => {
  const queryId =
    typeof compareId === "string"
      ? new mongoose.Types.ObjectId(compareId)
      : compareId;

  const result = await compareModel.findByIdAndDelete(queryId).exec();

  if (!result) {
    throw new Error("Compare not found");
  }

  return result;
};

//Delete many Compare
const deleteManyCompareService = async (compareIds: (string | number)[]) => {
  const queryIds = compareIds.map((id) => {
    if (typeof id === "string" && mongoose.Types.ObjectId.isValid(id)) {
      return new mongoose.Types.ObjectId(id);
    } else if (typeof id === "number") {
      return id;
    } else {
      throw new Error(`Invalid ID format: ${id}`);
    }
  });

  const result = await compareModel
    .deleteMany({ _id: { $in: queryIds } })
    .exec();

  return result;
};

export const compareServices = {
  createCompareService,
  getAllCompareService,
  getSingleCompareService,
  getSingleCompareByUserService,
  updateSingleCompareService,
  deleteSingleCompareService,
  deleteManyCompareService,
};
