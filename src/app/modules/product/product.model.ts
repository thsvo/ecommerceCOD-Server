import { model, Schema, Types } from "mongoose";
import { Status } from "../../interface/global/global.interface";
import { IProduct, IVariant } from "./product.interface";

const variantSchema = new Schema<IVariant>({
  sku: { type: String, required: true },
  attributeCombination: [
    {
      type: Types.ObjectId,
      ref: "attributeOption",
      required: true,
    },
  ],
  sellingPrice: { type: Number, required: true },
  buyingPrice: { type: Number, required: true },
  offerPrice: { type: Number },
  stock: { type: Number, required: true },
  image: { type: String, required: false },
});

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    video: { type: String },
    brand: { type: Schema.Types.ObjectId, ref: "brand" },
    category: { type: Schema.Types.ObjectId, ref: "category", required: true },
    mainImage: { type: String, required: false },
    sellingPrice: { type: Number },
    buyingPrice: { type: Number },
    offerPrice: { type: Number },
    stock: { type: Number },
    isVariant: { type: Boolean, default: false },
    variants: {
      type: [variantSchema],
    },
    tags: [String],
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "review",
        default: undefined,
        required: false,
      },
    ],
    isFeatured: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    isOffer: { type: Boolean, default: false },
    offers: [
      {
        type: Schema.Types.ObjectId,
        ref: "offer",
        default: undefined,
        required: false,
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

export const productModel = model("product", productSchema);
