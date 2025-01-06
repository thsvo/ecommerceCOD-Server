"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryModel = exports.CategoryLevel = void 0;
const mongoose_1 = require("mongoose");
const global_interface_1 = require("../../interface/global/global.interface");
var CategoryLevel;
(function (CategoryLevel) {
    CategoryLevel["PARENT_CATEGORY"] = "parentCategory";
    CategoryLevel["CATEGORY"] = "category";
    CategoryLevel["SUB_CATEGORY"] = "subCategory";
})(CategoryLevel || (exports.CategoryLevel = CategoryLevel = {}));
const categorySchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    parentCategory: { type: mongoose_1.Schema.Types.ObjectId, ref: "category" },
    categories: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "category" }],
    subcategories: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "category" }],
    level: {
        type: String,
        enum: Object.values(CategoryLevel),
        default: CategoryLevel.PARENT_CATEGORY,
    },
    attachment: { type: String, trim: true },
    status: {
        type: String,
        enum: Object.values(global_interface_1.Status),
        trim: true,
        default: global_interface_1.Status.ACTIVE,
    },
}, { timestamps: true });
exports.categoryModel = (0, mongoose_1.model)("category", categorySchema);
