import { Types } from "mongoose";
import { Status } from "../../interface/global/global.interface";

export interface ICoupon {
  name: string;
  code: string;
  user?: Types.ObjectId[];
  count: number;
  amount: string;
  minimumAmount: number;
  expiredDate: string;
  type: string;
  attachment?: string;
  status?: Status;
}
