import { Types } from "mongoose";

export interface IOffer {
  name: string;
  description: string;
  attachment: string;
  price: number;
  startDate: string;
  endDate: string;
  backgroundColor: string;
  discount: string;
  product: Types.ObjectId[];
  type: string;
  status: string;
}
