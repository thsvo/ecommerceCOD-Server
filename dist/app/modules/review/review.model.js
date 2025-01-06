"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewModel = void 0;
const mongoose_1 = require("mongoose");
const global_interface_1 = require("../../interface/global/global.interface");
const reviewSchema = new mongoose_1.Schema({
    comment: { type: String, required: true, trim: true },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    product: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "product",
        },
    ],
    rating: { type: Number, required: true },
    attachment: { type: String },
    status: {
        type: String,
        enum: Object.values(global_interface_1.Status),
        trim: true,
        default: global_interface_1.Status.ACTIVE,
    },
}, { timestamps: true });
exports.reviewModel = (0, mongoose_1.model)("review", reviewSchema);
