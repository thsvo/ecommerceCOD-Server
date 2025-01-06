"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponModel = void 0;
const mongoose_1 = require("mongoose");
const global_interface_1 = require("../../interface/global/global.interface");
const couponSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    count: { type: Number, default: 1 },
    amount: { type: String, required: true, trim: true },
    minimumAmount: { type: Number, required: true, trim: true },
    type: { type: String, default: "fixed" },
    expiredDate: { type: String, required: true, trim: true },
    attachment: { type: String, trim: true },
    user: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "user" }],
    status: {
        type: String,
        enum: Object.values(global_interface_1.Status),
        trim: true,
        default: global_interface_1.Status.ACTIVE,
    },
}, { timestamps: true });
// Pre-validation hook to generate coupon code and validate amount
couponSchema.pre("validate", function (next) {
    if (!this.code) {
        const randomNumbers = Math.floor(100000 + Math.random() * 900000);
        this.code = `VC-${randomNumbers}`;
    }
    if (this.type === "percentage") {
        const amount = parseFloat(this.amount);
        if (isNaN(amount) || amount < 0 || amount > 100) {
            return next(new Error("Amount must be a valid percentage between 0 and 100."));
        }
        this.amount = `${amount}%`;
    }
    else {
        const fixedAmount = parseFloat(this.amount);
        if (isNaN(fixedAmount) || fixedAmount < 0) {
            return next(new Error("Amount must be a valid number."));
        }
    }
    next();
});
exports.couponModel = (0, mongoose_1.model)("coupon", couponSchema);
