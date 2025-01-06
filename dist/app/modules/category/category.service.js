"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paginateAndSort_1 = require("../../utils/paginateAndSort");
const category_model_1 = require("./category.model");
const formatResultImage_1 = require("../../utils/formatResultImage");
//Create a category into database
const createCategoryService = (categoryData, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const dataToSave = Object.assign(Object.assign({}, categoryData), { filePath });
    // Create the new category
    const newCategory = yield category_model_1.categoryModel.create(dataToSave);
    if (categoryData.level === category_model_1.CategoryLevel.CATEGORY &&
        categoryData.parentCategory) {
        yield category_model_1.categoryModel.findByIdAndUpdate(categoryData.parentCategory, { $addToSet: { categories: newCategory._id } }, { new: true });
    }
    if (categoryData.level === category_model_1.CategoryLevel.SUB_CATEGORY &&
        categoryData.categories) {
        const parentCategory = yield category_model_1.categoryModel.findById(categoryData.categories);
        if (parentCategory && parentCategory.level === category_model_1.CategoryLevel.CATEGORY) {
            // Add the new subcategory to the parent category
            yield category_model_1.categoryModel.findByIdAndUpdate(parentCategory._id, { $addToSet: { subcategories: newCategory._id } }, { new: true });
            if (parentCategory.parentCategory) {
                yield category_model_1.categoryModel.findByIdAndUpdate(parentCategory.parentCategory, { $addToSet: { subcategories: newCategory._id } }, { new: true });
            }
        }
    }
    // Return the newly created category
    return newCategory;
});
// Get all categories with optional pagination
const getAllCategoriesService = (page, limit, searchText, searchFields) => __awaiter(void 0, void 0, void 0, function* () {
    let results;
    if (page && limit) {
        const query = category_model_1.categoryModel
            .find()
            .populate({
            path: "categories",
            populate: { path: "subcategories" },
        })
            .populate("subcategories")
            .populate("parentCategory");
        const result = yield (0, paginateAndSort_1.paginateAndSort)(query, page, limit, searchText, searchFields);
        result.results = (0, formatResultImage_1.formatResultImage)(result.results, "attachment");
        return result;
    }
    else {
        results = yield category_model_1.categoryModel
            .find()
            .sort({ createdAt: -1 })
            .populate({
            path: "categories",
            populate: { path: "subcategories" },
        })
            .populate("subcategories")
            .populate("parentCategory")
            .exec();
        results = (0, formatResultImage_1.formatResultImage)(results, "attachment");
        return {
            results,
        };
    }
});
//Get single category
const getSingleCategoryService = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof categoryId === "string"
        ? new mongoose_1.default.Types.ObjectId(categoryId)
        : categoryId;
    const result = yield category_model_1.categoryModel
        .findById(queryId)
        .populate("categories")
        .populate("subcategories")
        .populate("parentCategory")
        .exec();
    if (!result) {
        throw new Error("category not found");
    }
    if (typeof result.attachment === "string") {
        const formattedAttachment = (0, formatResultImage_1.formatResultImage)(result.attachment);
        if (typeof formattedAttachment === "string") {
            result.attachment = formattedAttachment;
        }
    }
    return result;
});
//Update single category
const updateSingleCategoryService = (categoryId, categoryData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const queryId = typeof categoryId === "string"
        ? new mongoose_1.default.Types.ObjectId(categoryId)
        : categoryId;
    const existingCategory = yield category_model_1.categoryModel.findById(queryId);
    if (!existingCategory) {
        throw new Error("Category not found");
    }
    const updatedCategory = yield category_model_1.categoryModel
        .findByIdAndUpdate(queryId, { $set: categoryData }, { new: true, runValidators: true })
        .exec();
    if (!updatedCategory) {
        throw new Error("Category not found after update");
    }
    if (updatedCategory.level === category_model_1.CategoryLevel.CATEGORY &&
        updatedCategory.parentCategory &&
        updatedCategory.parentCategory.toString() !==
            ((_a = existingCategory.parentCategory) === null || _a === void 0 ? void 0 : _a.toString())) {
        if (existingCategory.parentCategory) {
            yield category_model_1.categoryModel.findByIdAndUpdate(existingCategory.parentCategory, {
                $pull: { subcategories: updatedCategory._id },
            });
        }
        yield category_model_1.categoryModel.findByIdAndUpdate(updatedCategory.parentCategory, {
            $addToSet: { subcategories: updatedCategory._id },
        });
    }
    if (updatedCategory.level === category_model_1.CategoryLevel.SUB_CATEGORY &&
        updatedCategory.categories &&
        updatedCategory.categories.toString() !==
            ((_b = existingCategory.categories) === null || _b === void 0 ? void 0 : _b.toString())) {
        const parentCategory = yield category_model_1.categoryModel.findById(updatedCategory.categories);
        if (parentCategory && parentCategory.level === category_model_1.CategoryLevel.CATEGORY) {
            if (existingCategory.categories) {
                yield category_model_1.categoryModel.findByIdAndUpdate(existingCategory.categories, {
                    $pull: { subcategories: updatedCategory._id },
                });
            }
            yield category_model_1.categoryModel.findByIdAndUpdate(parentCategory._id, {
                $addToSet: { subcategories: updatedCategory._id },
            });
            if (parentCategory.parentCategory) {
                yield category_model_1.categoryModel.findByIdAndUpdate(parentCategory.parentCategory, {
                    $addToSet: { subcategories: updatedCategory._id },
                });
            }
        }
    }
    return updatedCategory;
});
//Delete single category
const deleteSingleCategoryService = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof categoryId === "string"
        ? new mongoose_1.default.Types.ObjectId(categoryId)
        : categoryId;
    const result = yield category_model_1.categoryModel.findByIdAndDelete(queryId).exec();
    if (!result) {
        throw new Error("category not found");
    }
    return result;
});
//Delete many category
const deleteManyCategoriesService = (categoryIds) => __awaiter(void 0, void 0, void 0, function* () {
    const queryIds = categoryIds.map((id) => {
        if (typeof id === "string" && mongoose_1.default.Types.ObjectId.isValid(id)) {
            return new mongoose_1.default.Types.ObjectId(id);
        }
        else if (typeof id === "number") {
            return id;
        }
        else {
            throw new Error(`Invalid ID format: ${id}`);
        }
    });
    const result = yield category_model_1.categoryModel
        .deleteMany({ _id: { $in: queryIds } })
        .exec();
    return result;
});
exports.categoryServices = {
    createCategoryService,
    getAllCategoriesService,
    getSingleCategoryService,
    updateSingleCategoryService,
    deleteSingleCategoryService,
    deleteManyCategoriesService,
};
