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
exports.ProductControllers = void 0;
const product_service_1 = require("./product.service");
const createProductController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const files = req.files;
        const mainImage = (_a = files.find((file) => file.fieldname === "mainImage")) === null || _a === void 0 ? void 0 : _a.path;
        const variants = [];
        if (req.body.variants) {
            for (const [index] of Object.keys(req.body.variants).entries()) {
                const variant = req.body.variants[index];
                const variantImage = (_b = files.find((file) => file.fieldname === `variants[${index}][image]`)) === null || _b === void 0 ? void 0 : _b.path;
                variants.push(Object.assign(Object.assign({}, variant), { image: variantImage }));
            }
        }
        const productData = Object.assign(Object.assign({}, req.body), { mainImage,
            variants });
        const result = yield product_service_1.productServices.createProductService(productData);
        res.status(200).json({
            success: true,
            message: "Product Created Successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllProductController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const pageNumber = page ? parseInt(page, 10) : undefined;
        const pageSize = limit ? parseInt(limit, 10) : undefined;
        const searchText = req.query.searchText;
        const searchFields = ["name"];
        const result = yield product_service_1.productServices.getAllProductService(pageNumber, pageSize, searchText, searchFields);
        res.status(200).json({
            success: true,
            message: "Products Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Get single Product data
const getSingleProductController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const result = yield product_service_1.productServices.getSingleProductService(productId);
        res.status(200).json({
            success: true,
            message: "Product Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getSingleProductBySkuController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sku } = req.params;
        const result = yield product_service_1.productServices.getSingleProductBySkuService(sku);
        res.status(200).json({
            success: true,
            message: "Product By SkU Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Get single Product data by slug
const getSingleProductBySlugController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productSlug } = req.params;
        const result = yield product_service_1.productServices.getSingleProductBySlugService(productSlug);
        res.status(200).json({
            success: true,
            message: "Product Fetched by Slug Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Update single Product controller
const updateSingleProductController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const data = req.body;
        const filePath = req.file ? req.file.path : undefined;
        const productData = Object.assign(Object.assign({}, data), { attachment: filePath });
        const result = yield product_service_1.productServices.updateSingleProductService(productId, productData);
        res.status(200).json({
            success: true,
            message: "Product Updated Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete single Product controller
const deleteSingleProductController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        yield product_service_1.productServices.deleteSingleProductService(productId);
        res.status(200).json({
            success: true,
            message: "Product Deleted Successfully!",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete many Product controller
const deleteManyProductsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productIds = req.body;
        if (!Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or empty Product IDs array provided",
                data: null,
            });
        }
        const result = yield product_service_1.productServices.deleteManyProductsService(productIds);
        res.status(200).json({
            success: true,
            message: `Bulk Product Delete Successful! Deleted ${result.deletedCount} Products.`,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.ProductControllers = {
    createProductController,
    getAllProductController,
    getSingleProductController,
    getSingleProductBySkuController,
    getSingleProductBySlugController,
    updateSingleProductController,
    deleteSingleProductController,
    deleteManyProductsController,
};
