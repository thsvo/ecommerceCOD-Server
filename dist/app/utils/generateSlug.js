"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSlug = exports.generateSlug = void 0;
const slugify_1 = __importDefault(require("slugify"));
const generateSlug = (input) => {
    const baseSlug = (0, slugify_1.default)(input, {
        lower: true,
        strict: true,
        replacement: "-",
    });
    const dateSuffix = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    return `${baseSlug}-${dateSuffix}`;
};
exports.generateSlug = generateSlug;
const productSlug = (name, sku) => {
    const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    return `${slug}-${sku}`;
};
exports.productSlug = productSlug;
