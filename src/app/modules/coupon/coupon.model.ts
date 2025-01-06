import { model, Schema } from "mongoose";
import moment from "moment";
import { Status } from "../../interface/global/global.interface";
import { ICoupon } from "./coupon.interface";

const couponSchema = new Schema<ICoupon>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    count: { type: Number, default: 1 },
    amount: { type: String, required: true, trim: true },
    minimumAmount: { type: Number, required: true, trim: true },
    type: { type: String, default: "fixed" },
    expiredDate: { type: String, required: true, trim: true },
    attachment: { type: String, trim: true },
    user: [{ type: Schema.Types.ObjectId, ref: "user" }],
    status: {
      type: String,
      enum: Object.values(Status),
      trim: true,
      default: Status.ACTIVE,
    },
  },
  { timestamps: true }
);

// Pre-validation hook to generate coupon code and validate amount
couponSchema.pre("validate", function (next) {
  if (!this.code) {
    const randomNumbers = Math.floor(100000 + Math.random() * 900000);
    this.code = `VC-${randomNumbers}`;
  }

  next();
});

export const couponModel = model<ICoupon>("coupon", couponSchema);
