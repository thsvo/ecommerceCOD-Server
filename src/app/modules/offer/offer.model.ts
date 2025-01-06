import { model, Schema } from "mongoose";
import { Status } from "../../interface/global/global.interface";
import { IOffer } from "./offer.interface";

export enum OfferType {
  FLASH_DEAL = "flash deal",
  HOT_DEAL = "hot deal",
  SPECIAL_OFFERS = "special offer",
}

const offerSchema = new Schema<IOffer>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    product: [{ type: Schema.Types.ObjectId, ref: "product", required: true }],
    price: { type: Number },
    discount: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    attachment: { type: String, trim: true },
    backgroundColor: { type: String, trim: true },
    type: {
      type: String,
      enum: Object.values(OfferType),
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      trim: true,
      default: Status.ACTIVE,
    },
  },
  { timestamps: true }
);

export const offerModel = model<IOffer>("offer", offerSchema);
