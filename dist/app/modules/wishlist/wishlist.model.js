"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistModel = void 0;
const mongoose_1 = require("mongoose");
const global_interface_1 = require("../../interface/global/global.interface");
const wishlistSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "user" },
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: "product", required: true },
    deviceId: { type: String },
    status: {
        type: String,
        enum: Object.values(global_interface_1.Status),
        trim: true,
        default: global_interface_1.Status.ACTIVE,
    },
}, { timestamps: true });
exports.wishlistModel = (0, mongoose_1.model)("wishlist", wishlistSchema);
