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
exports.brandControllers = void 0;
const brand_service_1 = require("./brand.service");
const createBrandController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const filePath = req.file ? req.file.path : undefined;
        const formData = Object.assign(Object.assign({}, data), { attachment: filePath });
        const result = yield brand_service_1.brandServices.createBrandService(formData);
        res.status(200).json({
            success: true,
            message: "Brand Created Successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllBrandController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const pageNumber = page ? parseInt(page, 10) : undefined;
        const pageSize = limit ? parseInt(limit, 10) : undefined;
        const searchText = req.query.searchText;
        const searchFields = ["name"];
        const result = yield brand_service_1.brandServices.getAllBrandService(pageNumber, pageSize, searchText, searchFields);
        res.status(200).json({
            success: true,
            message: "Brands Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Get single Brand data
const getSingleBrandController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { brandId } = req.params;
        const result = yield brand_service_1.brandServices.getSingleBrandService(brandId);
        res.status(200).json({
            success: true,
            message: "Brand Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Update single Brand controller
const updateSingleBrandController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { brandId } = req.params;
        const data = req.body;
        const filePath = req.file ? req.file.path : undefined;
        const brandData = Object.assign(Object.assign({}, data), { attachment: filePath });
        const result = yield brand_service_1.brandServices.updateSingleBrandService(brandId, brandData);
        res.status(200).json({
            success: true,
            message: "Brand Updated Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete single Brand controller
const deleteSingleBrandController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { brandId } = req.params;
        yield brand_service_1.brandServices.deleteSingleBrandService(brandId);
        res.status(200).json({
            success: true,
            message: "Brand Deleted Successfully!",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete many Brand controller
const deleteManyBrandsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brandIds = req.body;
        if (!Array.isArray(brandIds) || brandIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or empty Brand IDs array provided",
                data: null,
            });
        }
        const result = yield brand_service_1.brandServices.deleteManyBrandsService(brandIds);
        res.status(200).json({
            success: true,
            message: `Bulk Brand Delete Successful! Deleted ${result.deletedCount} Brands.`,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.brandControllers = {
    createBrandController,
    getAllBrandController,
    getSingleBrandController,
    updateSingleBrandController,
    deleteSingleBrandController,
    deleteManyBrandsController,
};
