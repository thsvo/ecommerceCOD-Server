import { Schema, model } from "mongoose";
import { Status } from "../../interface/global/global.interface";
import { IReview } from "./review.interface";

const reviewSchema = new Schema<IReview>(
  {
    comment: { type: String, required: true, trim: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    product: [
      {
        type: Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    rating: { type: Number, required: true },
    attachment: { type: String },
    status: {
      type: String,
      enum: Object.values(Status),
      trim: true,
      default: Status.ACTIVE,
    },
  },
  { timestamps: true }
);

export const reviewModel = model<IReview>("review", reviewSchema);
