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
exports.productServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paginateAndSort_1 = require("../../utils/paginateAndSort");
const formatResultImage_1 = require("../../utils/formatResultImage");
const product_model_1 = require("./product.model");
const generateSlug_1 = require("../../utils/generateSlug");
//Create a product into database
const createProductService = (productData, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = (0, generateSlug_1.productSlug)(productData.name, productData.sku);
    const totalStock = productData.isVariant && Array.isArray(productData.variants)
        ? productData.variants.reduce((sum, variant) => sum + (Number(variant.stock) || 0), 0)
        : productData.stock || 0;
    const dataToSave = Object.assign(Object.assign({}, productData), { slug, filePath, stock: totalStock });
    return yield product_model_1.productModel.create(dataToSave);
});
// Get all products with optional pagination
const getAllProductService = (page, limit, searchText, searchFields) => __awaiter(void 0, void 0, void 0, function* () {
    let results;
    if (page && limit) {
        const query = product_model_1.productModel
            .find()
            .populate("category")
            .populate("brand")
            .populate("offers")
            .populate("reviews")
            .populate({
            path: "variants.attributeCombination",
            model: "attributeOption",
        });
        const result = yield (0, paginateAndSort_1.paginateAndSort)(query, page, limit, searchText, searchFields);
        result.results = (0, formatResultImage_1.formatResultImage)(result.results, "mainImage");
        return result;
    }
    else {
        results = yield product_model_1.productModel
            .find()
            .populate("category")
            .populate("brand")
            .populate("offers")
            .populate("reviews")
            .populate({
            path: "variants.attributeCombination",
            model: "attributeOption",
        })
            .sort({ createdAt: -1 })
            .exec();
        return {
            results,
        };
    }
});
// Get single product
const getSingleProductService = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof productId === "string"
        ? new mongoose_1.default.Types.ObjectId(productId)
        : productId;
    const result = yield product_model_1.productModel
        .findById(queryId)
        .populate("category")
        .populate("brand")
        .populate("offers")
        .populate("reviews")
        .populate({
        path: "variants.attributeCombination",
        model: "attributeOption",
        populate: {
            path: "attribute",
            model: "attribute",
            populate: {
                path: "options",
                model: "attributeOption",
            },
        },
    })
        .exec();
    if (!result) {
        throw new Error("product not found");
    }
    if (typeof result.mainImage === "string") {
        const formattedAttachment = (0, formatResultImage_1.formatResultImage)(result.mainImage);
        if (typeof formattedAttachment === "string") {
            result.mainImage = formattedAttachment;
        }
    }
    return result;
});
const getSingleProductBySkuService = (sku) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield product_model_1.productModel
        .findOne({ $or: [{ sku }, { "variants.sku": sku }] })
        .select("name _id variants sku")
        .populate({
        path: "variants.attributeCombination",
        model: "attributeOption",
        populate: {
            path: "attribute",
            model: "attribute",
            populate: {
                path: "options",
                model: "attributeOption",
            },
        },
    })
        .exec();
    if (!result) {
        throw new Error("Product not found");
    }
    if (!result.variants) {
        throw new Error("Variants not found for the product");
    }
    let matchingVariant = null;
    if (result.sku === sku) {
        if (result.variants.length > 0) {
            matchingVariant = result.variants[0];
        }
    }
    else {
        matchingVariant = result.variants.find((variant) => variant.sku === sku);
    }
    return {
        productId: result._id,
        productName: result.name,
        sku: (_a = matchingVariant === null || matchingVariant === void 0 ? void 0 : matchingVariant.sku) !== null && _a !== void 0 ? _a : result.sku,
        variant: matchingVariant || null,
    };
});
// Get single product by slug
const getSingleProductBySlugService = (productSlug) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.productModel
        .findOne({ slug: productSlug })
        .populate("category")
        .populate("brand")
        .populate("offers")
        .populate("reviews")
        .populate({
        path: "variants.attributeCombination",
        model: "attributeOption",
    })
        .exec();
    if (!result) {
        throw new Error("Product not found");
    }
    if (typeof result.mainImage === "string") {
        const formattedAttachment = (0, formatResultImage_1.formatResultImage)(result.mainImage);
        if (typeof formattedAttachment === "string") {
            result.mainImage = formattedAttachment;
        }
    }
    return result;
});
//Update single product
const updateSingleProductService = (productId, productData) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof productId === "string"
        ? new mongoose_1.default.Types.ObjectId(productId)
        : productId;
    const slug = (0, generateSlug_1.productSlug)(productData.name, productData.sku);
    const result = yield product_model_1.productModel
        .findByIdAndUpdate(queryId, { $set: Object.assign(Object.assign({}, productData), { slug }) }, { new: true, runValidators: true })
        .exec();
    if (!result) {
        throw new Error("product not found");
    }
    return result;
});
//Delete single product
const deleteSingleProductService = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof productId === "string"
        ? new mongoose_1.default.Types.ObjectId(productId)
        : productId;
    const result = yield product_model_1.productModel.findByIdAndDelete(queryId).exec();
    if (!result) {
        throw new Error("product not found");
    }
    return result;
});
//Delete many product
const deleteManyProductsService = (productIds) => __awaiter(void 0, void 0, void 0, function* () {
    const queryIds = productIds.map((id) => {
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
    const result = yield product_model_1.productModel
        .deleteMany({ _id: { $in: queryIds } })
        .exec();
    return result;
});
exports.productServices = {
    createProductService,
    getAllProductService,
    getSingleProductService,
    getSingleProductBySkuService,
    getSingleProductBySlugService,
    updateSingleProductService,
    deleteSingleProductService,
    deleteManyProductsService,
};
