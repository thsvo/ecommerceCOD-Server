import { Types } from "mongoose";

export interface ISlider {
  category: Types.ObjectId;
  attachment: string;
  status: string;
}
