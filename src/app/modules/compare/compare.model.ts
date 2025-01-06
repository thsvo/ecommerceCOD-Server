import { ICompare } from "./compare.interface";
import { model, Schema } from "mongoose";
import { Status } from "../../interface/global/global.interface";

const compareSchema = new Schema<ICompare>(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    deviceId: { type: String },
    product: [{ type: Schema.Types.ObjectId, ref: "product", required: true }],
    status: {
      type: String,
      enum: Object.values(Status),
      trim: true,
      default: Status.ACTIVE,
    },
  },
  { timestamps: true }
);

export const compareModel = model<ICompare>("compare", compareSchema);
