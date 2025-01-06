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
exports.brandServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paginateAndSort_1 = require("../../utils/paginateAndSort");
const formatResultImage_1 = require("../../utils/formatResultImage");
const brand_model_1 = require("./brand.model");
//Create a brand into database
const createBrandService = (brandData, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const dataToSave = Object.assign(Object.assign({}, brandData), { filePath });
    const result = yield brand_model_1.brandModel.create(dataToSave);
    return result;
});
// Get all brands with optional pagination
const getAllBrandService = (page, limit, searchText, searchFields) => __awaiter(void 0, void 0, void 0, function* () {
    let results;
    if (page && limit) {
        const query = brand_model_1.brandModel.find();
        const result = yield (0, paginateAndSort_1.paginateAndSort)(query, page, limit, searchText, searchFields);
        result.results = (0, formatResultImage_1.formatResultImage)(result.results, "attachment");
        return result;
    }
    else {
        results = yield brand_model_1.brandModel.find().sort({ createdAt: -1 }).exec();
        results = (0, formatResultImage_1.formatResultImage)(results, "attachment");
        return {
            results,
        };
    }
});
// Get single brand
const getSingleBrandService = (brandId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof brandId === "string"
        ? new mongoose_1.default.Types.ObjectId(brandId)
        : brandId;
    const result = yield brand_model_1.brandModel.findById(queryId).exec();
    if (!result) {
        throw new Error("Brand not found");
    }
    if (typeof result.attachment === "string") {
        const formattedAttachment = (0, formatResultImage_1.formatResultImage)(result.attachment);
        if (typeof formattedAttachment === "string") {
            result.attachment = formattedAttachment;
        }
    }
    return result;
});
//Update single brand
const updateSingleBrandService = (brandId, brandData) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof brandId === "string"
        ? new mongoose_1.default.Types.ObjectId(brandId)
        : brandId;
    const result = yield brand_model_1.brandModel
        .findByIdAndUpdate(queryId, { $set: brandData }, { new: true, runValidators: true })
        .exec();
    if (!result) {
        throw new Error("Brand not found");
    }
    return result;
});
//Delete single brand
const deleteSingleBrandService = (brandId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof brandId === "string"
        ? new mongoose_1.default.Types.ObjectId(brandId)
        : brandId;
    const result = yield brand_model_1.brandModel.findByIdAndDelete(queryId).exec();
    if (!result) {
        throw new Error("Brand not found");
    }
    return result;
});
//Delete many brand
const deleteManyBrandsService = (brandIds) => __awaiter(void 0, void 0, void 0, function* () {
    const queryIds = brandIds.map((id) => {
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
    const result = yield brand_model_1.brandModel.deleteMany({ _id: { $in: queryIds } }).exec();
    return result;
});
exports.brandServices = {
    createBrandService,
    getAllBrandService,
    getSingleBrandService,
    updateSingleBrandService,
    deleteSingleBrandService,
    deleteManyBrandsService,
};
