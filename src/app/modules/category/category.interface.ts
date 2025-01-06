import { Types } from "mongoose";

export interface ICategory {
  name: string;
  categories?: Types.ObjectId[];
  parentCategory?: Types.ObjectId;
  subcategories?: Types.ObjectId[];
  level: string;
  attachment?: string;
  status: string;
}
