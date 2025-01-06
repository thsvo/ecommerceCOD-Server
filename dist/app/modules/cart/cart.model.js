"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartModel = void 0;
const mongoose_1 = require("mongoose");
const global_interface_1 = require("../../interface/global/global.interface");
const cartSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "user" },
    deviceId: { type: String, trim: true },
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: "product", required: true },
    sku: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true },
    price: { type: Number, trim: true, required: true },
    status: {
        type: String,
        enum: Object.values(global_interface_1.Status),
        trim: true,
        default: global_interface_1.Status.ACTIVE,
    },
}, { timestamps: true });
exports.cartModel = (0, mongoose_1.model)("cart", cartSchema);
