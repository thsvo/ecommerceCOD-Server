import { model, Schema } from "mongoose";
import { ICategory } from "./category.interface";
import { Status } from "../../interface/global/global.interface";

export enum CategoryLevel {
  PARENT_CATEGORY = "parentCategory",
  CATEGORY = "category",
  SUB_CATEGORY = "subCategory",
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    parentCategory: { type: Schema.Types.ObjectId, ref: "category" },
    categories: [{ type: Schema.Types.ObjectId, ref: "category" }],
    subcategories: [{ type: Schema.Types.ObjectId, ref: "category" }],
    level: {
      type: String,
      enum: Object.values(CategoryLevel),
      default: CategoryLevel.PARENT_CATEGORY,
    },
    attachment: { type: String, trim: true },
    status: {
      type: String,
      enum: Object.values(Status),
      trim: true,
      default: Status.ACTIVE,
    },
  },
  { timestamps: true }
);

export const categoryModel = model<ICategory>("category", categorySchema);
