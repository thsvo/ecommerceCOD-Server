"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderModel = void 0;
const mongoose_1 = require("mongoose");
const global_interface_1 = require("../../interface/global/global.interface");
const orderSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "user" },
    products: [
        {
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "product",
                required: true,
            },
            productName: { type: String, trim: true },
            quantity: { type: Number, required: true, min: 1 },
            sku: { type: String, trim: true },
        },
    ],
    name: { type: String, required: true, trim: true },
    email: { type: String },
    deviceId: { type: String },
    number: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    paymentType: {
        type: String,
        enum: ["manual", "cod", "ssl"],
        required: true,
    },
    paymentMethod: { type: String, trim: true },
    code: { type: String, trim: true },
    deliverOption: { type: String, trim: true },
    subTotal: { type: mongoose_1.Schema.Types.Mixed, trim: true },
    shippingFee: { type: mongoose_1.Schema.Types.Mixed, trim: true },
    invoice: { type: String, trim: true },
    trackingCode: { type: String, trim: true },
    discount: { type: mongoose_1.Schema.Types.Mixed, trim: true },
    grandTotal: { type: mongoose_1.Schema.Types.Mixed, trim: true },
    tranId: { type: String, trim: true },
    paymentStatus: { type: String, trim: true },
    deliveryStatus: { type: String, trim: true, default: "pending" },
    status: {
        type: String,
        enum: Object.values(global_interface_1.Status),
        trim: true,
        default: global_interface_1.Status.ACTIVE,
    },
}, { timestamps: true });
exports.orderModel = (0, mongoose_1.model)("order", orderSchema);
