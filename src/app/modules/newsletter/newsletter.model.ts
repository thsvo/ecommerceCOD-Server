import { model, Schema } from "mongoose";
import { Status } from "../../interface/global/global.interface";
import { INewsletter } from "./newsletter.interface";

const newsletterSchema = new Schema<INewsletter>(
  {
    email: { type: String, required: true, unique: true, trim: true },
    status: {
      type: String,
      enum: Object.values(Status),
      trim: true,
      default: Status.ACTIVE,
    },
  },
  { timestamps: true }
);

export const newsletterModel = model<INewsletter>(
  "newsletter",
  newsletterSchema
);
