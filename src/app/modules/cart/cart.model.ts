import { model, Schema } from "mongoose";
import { Status } from "../../interface/global/global.interface";
import { ICart } from "./cart.interface";

const cartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    deviceId: { type: String, trim: true },
    product: { type: Schema.Types.ObjectId, ref: "product", required: true },
    sku: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true },
    price: { type: Number, trim: true, required: true },
    status: {
      type: String,
      enum: Object.values(Status),
      trim: true,
      default: Status.ACTIVE,
    },
  },
  { timestamps: true }
);

export const cartModel = model<ICart>("cart", cartSchema);
