"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productModel = void 0;
const mongoose_1 = require("mongoose");
const global_interface_1 = require("../../interface/global/global.interface");
const variantSchema = new mongoose_1.Schema({
    sku: { type: String, required: true },
    attributeCombination: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "attributeOption",
            required: true,
        },
    ],
    sellingPrice: { type: Number, required: true },
    buyingPrice: { type: Number, required: true },
    offerPrice: { type: Number },
    stock: { type: Number, required: true },
    image: { type: String, required: false },
});
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    video: { type: String },
    brand: { type: mongoose_1.Schema.Types.ObjectId, ref: "brand" },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: "category", required: true },
    mainImage: { type: String, required: false },
    sellingPrice: { type: Number },
    buyingPrice: { type: Number },
    offerPrice: { type: Number },
    stock: { type: Number },
    isVariant: { type: Boolean, default: false },
    variants: {
        type: [variantSchema],
    },
    tags: [String],
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
    },
    reviews: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "review",
            default: undefined,
            required: false,
        },
    ],
    isFeatured: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    isOffer: { type: Boolean, default: false },
    offers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "offer",
            default: undefined,
            required: false,
        },
    ],
    status: {
        type: String,
        enum: Object.values(global_interface_1.Status),
        trim: true,
        default: global_interface_1.Status.ACTIVE,
    },
}, { timestamps: true });
exports.productModel = (0, mongoose_1.model)("product", productSchema);
