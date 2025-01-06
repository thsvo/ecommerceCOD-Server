import mongoose, { Types } from "mongoose";
import { paginateAndSort } from "../../utils/paginateAndSort";
import { formatResultImage } from "../../utils/formatResultImage";
import { IOffer } from "./offer.interface";
import { offerModel } from "./offer.model";
import { productModel } from "../product/product.model";

//Create a offer into database
const createOfferService = async (offerData: IOffer, filePath?: string) => {
  const dataToSave = { ...offerData, filePath };
  const result = await offerModel.create(dataToSave);

  if (offerData.product && offerData.product.length > 0) {
    await productModel.updateMany(
      { _id: { $in: offerData.product } },
      {
        $set: { isOffer: true },
        $push: { offers: new Types.ObjectId(result._id) },
      }
    );
  }
  return result;
};

// Get all offer with optional pagination
const getAllOfferService = async (
  page?: number,
  limit?: number,
  searchText?: string,
  searchFields?: string[]
) => {
  let results;

  if (page && limit) {
    const query = offerModel.find().populate("product");

    const result = await paginateAndSort(
      query,
      page,
      limit,
      searchText,
      searchFields
    );

    result.results = formatResultImage<IOffer>(
      result.results,
      "attachment"
    ) as IOffer[];

    return result;
  } else {
    results = await offerModel
      .find()
      .populate("product")
      .sort({ createdAt: -1 })
      .exec();

    results = formatResultImage(results, "attachment");

    return {
      results,
    };
  }
};

//Get single offer
const getSingleOfferService = async (offerId: number | string) => {
  const queryId =
    typeof offerId === "string"
      ? new mongoose.Types.ObjectId(offerId)
      : offerId;

  const result = await offerModel.findById(queryId).populate("product").exec();

  if (!result) {
    throw new Error("Offer not found");
  }

  if (typeof result.attachment === "string") {
    const formattedAttachment = formatResultImage<IOffer>(result.attachment);
    if (typeof formattedAttachment === "string") {
      result.attachment = formattedAttachment;
    }
  }

  return result;
};

//Update single offer
const updateSingleOfferService = async (
  offerId: string | number,
  offerData: IOffer
) => {
  const queryId =
    typeof offerId === "string"
      ? new mongoose.Types.ObjectId(offerId)
      : offerId;

  // Find the existing offer before updating
  const existingOffer = await offerModel.findById(queryId).exec();

  if (!existingOffer) {
    throw new Error("Offer not found");
  }

  // Update the offer
  const result = await offerModel
    .findByIdAndUpdate(
      queryId,
      { $set: offerData },
      { new: true, runValidators: true }
    )
    .exec();

  if (!result) {
    throw new Error("Failed to update offer");
  }

  if (offerData.product && offerData.product.length > 0) {
    await productModel.updateMany(
      { _id: { $in: existingOffer.product } },
      {
        $pull: { offers: queryId },
        $set: { isOffer: false },
      }
    );

    await productModel.updateMany(
      { _id: { $in: offerData.product } },
      {
        $set: { isOffer: true },
        $push: { offers: queryId },
      }
    );
  }

  return result;
};

//Delete single offer
const deleteSingleOfferService = async (offerId: string | number) => {
  const queryId =
    typeof offerId === "string"
      ? new mongoose.Types.ObjectId(offerId)
      : offerId;

  const result = await offerModel.findByIdAndDelete(queryId).exec();

  if (!result) {
    throw new Error("Offer not found");
  }

  return result;
};

//Delete many offer
const deleteManyOfferService = async (offerIds: (string | number)[]) => {
  const queryIds = offerIds.map((id) => {
    if (typeof id === "string" && mongoose.Types.ObjectId.isValid(id)) {
      return new mongoose.Types.ObjectId(id);
    } else if (typeof id === "number") {
      return id;
    } else {
      throw new Error(`Invalid ID format: ${id}`);
    }
  });

  const result = await offerModel.deleteMany({ _id: { $in: queryIds } }).exec();

  return result;
};

export const offerServices = {
  createOfferService,
  getAllOfferService,
  getSingleOfferService,
  updateSingleOfferService,
  deleteSingleOfferService,
  deleteManyOfferService,
};
