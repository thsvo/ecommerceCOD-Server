import { Types } from "mongoose";
import { Status } from "../../interface/global/global.interface";

export interface IWishlist {
  product: Types.ObjectId;
  user: Types.ObjectId;
  deviceId: string;
  status: Status;
}
