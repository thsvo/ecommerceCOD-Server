import { Types } from "mongoose";
import { Status } from "../../interface/global/global.interface";

export interface IGiftCard {
  name: string;
  code: string;
  user?: Types.ObjectId[];
  count: number;
  amount: string;
  expiredDate: string;
  attachment?: string;
  status?: Status;
}
