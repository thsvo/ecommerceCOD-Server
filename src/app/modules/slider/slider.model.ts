import { Schema, model } from "mongoose";
import { Status } from "../../interface/global/global.interface";
import { ISlider } from "./slider.interface";

const sliderSchema = new Schema<ISlider>(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    attachment: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(Status),
      trim: true,
      default: Status.ACTIVE,
    },
  },
  { timestamps: true }
);

export const sliderModel = model<ISlider>("slider", sliderSchema);
