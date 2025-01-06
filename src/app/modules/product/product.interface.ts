import { Document, Types } from "mongoose";
import { Status } from "../../interface/global/global.interface";

export interface IAttribute {
  name: string;
  options: string[];
}

export interface IVariant {
  sku: string;
  attributeCombination: Types.ObjectId[];
  buyingPrice: number;
  sellingPrice: number;
  offerPrice?: number;
  stock: number;
  image: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku: string;
  description: string;
  video: string;
  brand?: Types.ObjectId;
  category: Types.ObjectId;
  mainImage: string;
  images: string[];
  buyingPrice: number;
  sellingPrice: number;
  offerPrice?: number;
  stock: number;
  isVariant: boolean;
  variants?: IVariant[];
  tags?: string[];
  ratings: {
    average: number;
    count: number;
  };
  reviews: Types.ObjectId[];
  offers: Types.ObjectId[];
  isFeatured: boolean;
  isOffer: boolean;
  isAvailable: boolean;
  status: Status;
}
