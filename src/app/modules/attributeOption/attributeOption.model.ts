import { Schema, model } from "mongoose";
import { IAttributeOption } from "./attributeOption.interface";
import { Status } from "../../interface/global/global.interface";

const attributeOptionSchema = new Schema<IAttributeOption>(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["color", "other"] },
    attribute: { type: Schema.Types.ObjectId, ref: "attribute" },
    label: { type: String, trim: true },
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

export const attributeOptionModel = model<IAttributeOption>(
  "attributeOption",
  attributeOptionSchema
);
