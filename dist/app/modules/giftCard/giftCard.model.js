"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.giftCardModel = void 0;
const mongoose_1 = require("mongoose");
const global_interface_1 = require("../../interface/global/global.interface");
const giftCardSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    user: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "user" }],
    count: { type: Number, default: 1 },
    amount: { type: String, required: true, trim: true },
    attachment: { type: String, trim: true },
    expiredDate: { type: String, required: true, trim: true },
    status: {
        type: String,
        enum: Object.values(global_interface_1.Status),
        trim: true,
        default: global_interface_1.Status.ACTIVE,
    },
}, { timestamps: true });
giftCardSchema.pre("validate", function (next) {
    if (!this.code) {
        const randomNumbers = Math.floor(100000 + Math.random() * 900000);
        this.code = `VGC-${randomNumbers}`;
    }
    next();
});
exports.giftCardModel = (0, mongoose_1.model)("giftCard", giftCardSchema);
