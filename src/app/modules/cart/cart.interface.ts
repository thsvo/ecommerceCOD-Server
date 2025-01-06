import { Types } from "mongoose";
import { Status } from "../../interface/global/global.interface";

export interface ICart {
  product: Types.ObjectId;
  sku: string;
  user: Types.ObjectId;
  deviceId?: string;
  quantity: number;
  price: number;
  status: Status;
}
