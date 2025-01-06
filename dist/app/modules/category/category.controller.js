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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryControllers = void 0;
const category_service_1 = require("./category.service");
const createCategoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const filePath = req.file ? req.file.path : undefined;
        const formData = Object.assign(Object.assign({}, data), { attachment: filePath });
        const result = yield category_service_1.categoryServices.createCategoryService(formData);
        res.status(200).json({
            success: true,
            message: "Category Created Successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllCategoriesController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const pageNumber = page ? parseInt(page, 10) : undefined;
        const pageSize = limit ? parseInt(limit, 10) : undefined;
        const searchText = req.query.searchText;
        const searchFields = ["name", "level"];
        const result = yield category_service_1.categoryServices.getAllCategoriesService(pageNumber, pageSize, searchText, searchFields);
        res.status(200).json({
            success: true,
            message: "Categories Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Get single Category data
const getSingleCategoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        const result = yield category_service_1.categoryServices.getSingleCategoryService(categoryId);
        res.status(200).json({
            success: true,
            message: "Category Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Update single Category controller
const updateSingleCategoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        const data = req.body;
        const filePath = req.file ? req.file.path : undefined;
        const categoryData = Object.assign(Object.assign({}, data), { attachment: filePath });
        const result = yield category_service_1.categoryServices.updateSingleCategoryService(categoryId, categoryData);
        res.status(200).json({
            success: true,
            message: "Category Updated Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete single Category controller
const deleteSingleCategoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        yield category_service_1.categoryServices.deleteSingleCategoryService(categoryId);
        res.status(200).json({
            success: true,
            message: "Category Deleted Successfully!",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete many Category controller
const deleteManyCategoriesController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryIds = req.body;
        if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or empty Category IDs array provided",
                data: null,
            });
        }
        const result = yield category_service_1.categoryServices.deleteManyCategoriesService(categoryIds);
        res.status(200).json({
            success: true,
            message: `Bulk Categories Delete Successful! Deleted ${result.deletedCount} Categories.`,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.CategoryControllers = {
    createCategoryController,
    getAllCategoriesController,
    getSingleCategoryController,
    updateSingleCategoryController,
    deleteSingleCategoryController,
    deleteManyCategoriesController,
};
