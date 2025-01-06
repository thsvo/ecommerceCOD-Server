import { Types } from "mongoose";

export interface ICompare {
  product: Types.ObjectId[];
  user: Types.ObjectId;
  deviceId: string;
  status: String;
}
