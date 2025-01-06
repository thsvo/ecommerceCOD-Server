import mongoose from "mongoose";
import { paginateAndSort } from "../../utils/paginateAndSort";
import { formatResultImage } from "../../utils/formatResultImage";
import { IBrand } from "./brand.interface";
import { brandModel } from "./brand.model";

//Create a brand into database
const createBrandService = async (brandData: IBrand, filePath?: string) => {
  const dataToSave = { ...brandData, filePath };
  const result = await brandModel.create(dataToSave);
  return result;
};

// Get all brands with optional pagination
const getAllBrandService = async (
  page?: number,
  limit?: number,
  searchText?: string,
  searchFields?: string[]
) => {
  let results;

  if (page && limit) {
    const query = brandModel.find();
    const result = await paginateAndSort(
      query,
      page,
      limit,
      searchText,
      searchFields
    );

    result.results = formatResultImage<IBrand>(
      result.results,
      "attachment"
    ) as IBrand[];

    return result;
  } else {
    results = await brandModel.find().sort({ createdAt: -1 }).exec();

    results = formatResultImage(results, "attachment");

    return {
      results,
    };
  }
};

// Get single brand
const getSingleBrandService = async (brandId: number | string) => {
  const queryId =
    typeof brandId === "string"
      ? new mongoose.Types.ObjectId(brandId)
      : brandId;

  const result = await brandModel.findById(queryId).exec();
  if (!result) {
    throw new Error("Brand not found");
  }

  if (typeof result.attachment === "string") {
    const formattedAttachment = formatResultImage<IBrand>(result.attachment);
    if (typeof formattedAttachment === "string") {
      result.attachment = formattedAttachment;
    }
  }

  return result;
};

//Update single brand
const updateSingleBrandService = async (
  brandId: string | number,
  brandData: IBrand
) => {
  const queryId =
    typeof brandId === "string"
      ? new mongoose.Types.ObjectId(brandId)
      : brandId;

  const result = await brandModel
    .findByIdAndUpdate(
      queryId,
      { $set: brandData },
      { new: true, runValidators: true }
    )
    .exec();

  if (!result) {
    throw new Error("Brand not found");
  }

  return result;
};

//Delete single brand
const deleteSingleBrandService = async (brandId: string | number) => {
  const queryId =
    typeof brandId === "string"
      ? new mongoose.Types.ObjectId(brandId)
      : brandId;

  const result = await brandModel.findByIdAndDelete(queryId).exec();

  if (!result) {
    throw new Error("Brand not found");
  }

  return result;
};

//Delete many brand
const deleteManyBrandsService = async (brandIds: (string | number)[]) => {
  const queryIds = brandIds.map((id) => {
    if (typeof id === "string" && mongoose.Types.ObjectId.isValid(id)) {
      return new mongoose.Types.ObjectId(id);
    } else if (typeof id === "number") {
      return id;
    } else {
      throw new Error(`Invalid ID format: ${id}`);
    }
  });

  const result = await brandModel.deleteMany({ _id: { $in: queryIds } }).exec();

  return result;
};

export const brandServices = {
  createBrandService,
  getAllBrandService,
  getSingleBrandService,
  updateSingleBrandService,
  deleteSingleBrandService,
  deleteManyBrandsService,
};
