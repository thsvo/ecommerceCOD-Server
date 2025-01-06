import mongoose from "mongoose";
import { paginateAndSort } from "../../utils/paginateAndSort";
import { formatResultImage } from "../../utils/formatResultImage";
import { IAttributeOption } from "./attributeOption.interface";
import { attributeOptionModel } from "./attributeOption.model";
import { attributeModel } from "../attribute/attribute.model";

//Create a AttributeOption into database
const createAttributeOptionService = async (
  attributeOptionData: IAttributeOption,
  filePath?: string
) => {
  const dataToSave = { ...attributeOptionData, filePath };
  const result = await attributeOptionModel.create(dataToSave);

  return result;
};

// Get all AttributeOptions with optional pagination
const getAllAttributeOptionService = async (
  page?: number,
  limit?: number,
  searchText?: string,
  searchFields?: string[]
) => {
  let results;

  if (page && limit) {
    const query = attributeOptionModel.find();
    const result = await paginateAndSort(
      query,
      page,
      limit,
      searchText,
      searchFields
    );

    result.results = formatResultImage<IAttributeOption>(
      result.results,
      "attachment"
    ) as IAttributeOption[];

    return result;
  } else {
    results = await attributeOptionModel.find().sort({ createdAt: -1 }).exec();

    results = formatResultImage(results, "attachment");

    return {
      results,
    };
  }
};

// Get single AttributeOption
const getSingleAttributeOptionService = async (
  attributeOptionId: number | string
) => {
  const queryId =
    typeof attributeOptionId === "string"
      ? new mongoose.Types.ObjectId(attributeOptionId)
      : attributeOptionId;

  const result = await attributeOptionModel.findById(queryId).exec();
  if (!result) {
    throw new Error("Attribute Option not found");
  }

  if (typeof result.attachment === "string") {
    const formattedAttachment = formatResultImage<IAttributeOption>(
      result.attachment
    );
    if (typeof formattedAttachment === "string") {
      result.attachment = formattedAttachment;
    }
  }

  return result;
};

//Update single AttributeOption
const updateSingleAttributeOptionService = async (
  attributeOptionId: string | number,
  attributeOptionData: IAttributeOption
) => {
  const queryId =
    typeof attributeOptionId === "string"
      ? new mongoose.Types.ObjectId(attributeOptionId)
      : attributeOptionId;

  const result = await attributeOptionModel
    .findByIdAndUpdate(
      queryId,
      { $set: attributeOptionData },
      { new: true, runValidators: true }
    )
    .exec();

  if (!result) {
    throw new Error("Failed to update Attribute Option");
  }

  return result;
};

//Delete single AttributeOption
const deleteSingleAttributeOptionService = async (
  attributeOptionId: string | number
) => {
  const queryId =
    typeof attributeOptionId === "string"
      ? new mongoose.Types.ObjectId(attributeOptionId)
      : attributeOptionId;

  const result = await attributeOptionModel.findByIdAndDelete(queryId).exec();

  if (!result) {
    throw new Error("Attribute Option not found");
  }

  return result;
};

//Delete many AttributeOption
const deleteManyAttributeOptionsService = async (
  attributeOptionIds: (string | number)[]
) => {
  const queryIds = attributeOptionIds.map((id) => {
    if (typeof id === "string" && mongoose.Types.ObjectId.isValid(id)) {
      return new mongoose.Types.ObjectId(id);
    } else if (typeof id === "number") {
      return id;
    } else {
      throw new Error(`Invalid ID format: ${id}`);
    }
  });

  const result = await attributeOptionModel
    .deleteMany({ _id: { $in: queryIds } })
    .exec();

  return result;
};

export const attributeOptionServices = {
  createAttributeOptionService,
  getAllAttributeOptionService,
  getSingleAttributeOptionService,
  updateSingleAttributeOptionService,
  deleteSingleAttributeOptionService,
  deleteManyAttributeOptionsService,
};
