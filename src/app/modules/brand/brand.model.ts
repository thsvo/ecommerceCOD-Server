import { Schema, model } from "mongoose";
import { Status } from "../../interface/global/global.interface";
import { IBrand } from "./brand.interface";

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, unique: true, trim: true },
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

export const brandModel = model<IBrand>("brand", brandSchema);
