import mongoose from "mongoose";
import { paginateAndSort } from "../../utils/paginateAndSort";
import { formatResultImage } from "../../utils/formatResultImage";
import { IReview } from "./review.interface";
import { reviewModel } from "./review.model";
import { productModel } from "../product/product.model";

//Create a review into database
const createReviewService = async (reviewData: IReview, filePath?: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { product, rating, user, ...rest } = reviewData;

    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const [review] = await reviewModel.create(
      [{ ...rest, product, user, rating, attachment: filePath }],
      { session }
    );

    if (!review || !review._id) {
      throw new Error("Failed to create review");
    }

    for (const productId of product) {
      const productDoc = await productModel
        .findById(productId)
        .session(session);

      if (!productDoc) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      if (!productDoc.reviews.includes(review._id)) {
        productDoc.reviews.push(review._id);
      }

      const currentAverage = productDoc.ratings.average || 0;
      const currentCount = productDoc.ratings.count || 0;

      const updatedCount = currentCount + 1;
      const newAverageRating =
        (currentAverage * currentCount + rating) / updatedCount;

      productDoc.ratings.average = Math.min(
        5,
        parseFloat(newAverageRating.toFixed(2))
      );
      productDoc.ratings.count = updatedCount;

      await productDoc.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return review;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Get all reviews with optional pagination
const getAllReviewService = async (
  page?: number,
  limit?: number,
  searchText?: string,
  searchFields?: string[]
) => {
  let results;

  if (page && limit) {
    const query = reviewModel.find().populate("user").populate("product");
    const result = await paginateAndSort(
      query,
      page,
      limit,
      searchText,
      searchFields
    );

    result.results = formatResultImage<IReview>(
      result.results,
      "attachment"
    ) as IReview[];

    return result;
  } else {
    results = await reviewModel
      .find()
      .populate("user")
      .populate("product")
      .sort({ createdAt: -1 })
      .exec();

    results = formatResultImage(results, "attachment");

    return {
      results,
    };
  }
};

// Get single review
const getSingleReviewService = async (reviewId: number | string) => {
  const queryId =
    typeof reviewId === "string"
      ? new mongoose.Types.ObjectId(reviewId)
      : reviewId;

  const result = await reviewModel
    .findById(queryId)
    .populate("user")
    .populate("product")
    .exec();
  if (!result) {
    throw new Error("Review not found");
  }

  if (typeof result.attachment === "string") {
    const formattedAttachment = formatResultImage<IReview>(result.attachment);
    if (typeof formattedAttachment === "string") {
      result.attachment = formattedAttachment;
    }
  }

  return result;
};

const getSingleReviewByUserService = async (userId: number | string) => {
  const result = await reviewModel
    .find({ user: userId })
    .populate("user")
    .populate("product")
    .exec();

  if (result.length === 0) {
    throw new Error("Review for user not found");
  }

  return result;
};

//Update single review
const updateSingleReviewService = async (
  reviewId: string | number,
  reviewData: IReview
) => {
  const queryId =
    typeof reviewId === "string"
      ? new mongoose.Types.ObjectId(reviewId)
      : reviewId;

  const result = await reviewModel
    .findByIdAndUpdate(
      queryId,
      { $set: reviewData },
      { new: true, runValidators: true }
    )
    .exec();

  if (!result) {
    throw new Error("Review not found");
  }

  return result;
};

//Delete single review
const deleteSingleReviewService = async (reviewId: string | number) => {
  const queryId =
    typeof reviewId === "string"
      ? new mongoose.Types.ObjectId(reviewId)
      : reviewId;

  const result = await reviewModel.findByIdAndDelete(queryId).exec();

  if (!result) {
    throw new Error("Review not found");
  }

  return result;
};

//Delete many review
const deleteManyReviewsService = async (reviewIds: (string | number)[]) => {
  const queryIds = reviewIds.map((id) => {
    if (typeof id === "string" && mongoose.Types.ObjectId.isValid(id)) {
      return new mongoose.Types.ObjectId(id);
    } else if (typeof id === "number") {
      return id;
    } else {
      throw new Error(`Invalid ID format: ${id}`);
    }
  });

  const result = await reviewModel
    .deleteMany({ _id: { $in: queryIds } })
    .exec();

  return result;
};

export const reviewServices = {
  createReviewService,
  getAllReviewService,
  getSingleReviewService,
  getSingleReviewByUserService,
  updateSingleReviewService,
  deleteSingleReviewService,
  deleteManyReviewsService,
};
