import { model, Schema, Types } from "mongoose";
import { IAttribute } from "./attribute.interface";
import { Status } from "../../interface/global/global.interface";

const attributeSchema = new Schema<IAttribute>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    options: [
      {
        type: Types.ObjectId,
        ref: "attributeOption",
        required: true,
      },
    ],
    status: {
      type: String,
      enum: Object.values(Status),
      trim: true,
      default: Status.ACTIVE,
    },
  },
  { timestamps: true }
);

export const attributeModel = model<IAttribute>("attribute", attributeSchema);
