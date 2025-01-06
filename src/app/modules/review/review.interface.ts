import { Types } from "mongoose";

export interface IReview {
  _id?: Types.ObjectId;
  comment: string;
  user: Types.ObjectId;
  product: Types.ObjectId[];
  rating: number;
  attachment?: string;
  status: string;
}
