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
exports.compareServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paginateAndSort_1 = require("../../utils/paginateAndSort");
const compare_model_1 = require("./compare.model");
//Create a Compare into database
const createCompareService = (compareData) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, deviceId, product } = compareData;
    if (!user && !deviceId) {
        throw new Error("Either user or deviceId must be provided.");
    }
    const query = {};
    if (user)
        query.user = user;
    if (deviceId)
        query.deviceId = deviceId;
    const existingCompare = yield compare_model_1.compareModel.findOne(query);
    if (existingCompare) {
        if (existingCompare.product.length >= 2) {
            throw new Error("You can only compare up to two products.");
        }
        const productId = new mongoose_1.default.Types.ObjectId(product[0]);
        if (existingCompare.product.some((p) => p.equals(productId))) {
            throw new Error("This product is already in your compare list.");
        }
        existingCompare.product.push(productId);
        yield existingCompare.save();
        return existingCompare;
    }
    const formattedData = Object.assign(Object.assign({}, compareData), { product: compareData.product.map((p) => new mongoose_1.default.Types.ObjectId(p)) });
    const result = yield compare_model_1.compareModel.create(formattedData);
    return result;
});
// Get all Compare with optional pagination
const getAllCompareService = (page, limit, searchText, searchFields) => __awaiter(void 0, void 0, void 0, function* () {
    let results;
    if (page && limit) {
        const query = compare_model_1.compareModel.find().populate("product").populate("user");
        const result = yield (0, paginateAndSort_1.paginateAndSort)(query, page, limit, searchText, searchFields);
        return result;
    }
    else {
        results = yield compare_model_1.compareModel
            .find()
            .populate("product")
            .populate("user")
            .sort({ createdAt: -1 })
            .exec();
        return {
            results,
        };
    }
});
//Get single Compare
const getSingleCompareService = (compareId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof compareId === "string"
        ? new mongoose_1.default.Types.ObjectId(compareId)
        : compareId;
    const result = yield compare_model_1.compareModel
        .findById(queryId)
        .populate("product")
        .populate("user")
        .exec();
    if (!result) {
        throw new Error("Compare not found");
    }
    return result;
});
const getSingleCompareByUserService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    let query;
    if (mongoose_1.default.Types.ObjectId.isValid(userId)) {
        query = {
            $or: [{ user: userId }, { deviceId: userId }],
        };
    }
    else {
        query = {
            $or: [{ deviceId: userId }],
        };
    }
    const result = yield compare_model_1.compareModel
        .find(query)
        .populate("product")
        .populate("user")
        .exec();
    if (!result || result.length === 0) {
        throw new Error("Compare not found for this identifier");
    }
    return result;
});
//Update single Compare
const updateSingleCompareService = (compareId, compareData) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof compareId === "string"
        ? new mongoose_1.default.Types.ObjectId(compareId)
        : compareId;
    const result = yield compare_model_1.compareModel
        .findByIdAndUpdate(queryId, { $set: compareData }, { new: true, runValidators: true })
        .exec();
    if (!result) {
        throw new Error("Compare not found");
    }
    return result;
});
//Delete single Compare
const deleteSingleCompareService = (compareId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof compareId === "string"
        ? new mongoose_1.default.Types.ObjectId(compareId)
        : compareId;
    const result = yield compare_model_1.compareModel.findByIdAndDelete(queryId).exec();
    if (!result) {
        throw new Error("Compare not found");
    }
    return result;
});
//Delete many Compare
const deleteManyCompareService = (compareIds) => __awaiter(void 0, void 0, void 0, function* () {
    const queryIds = compareIds.map((id) => {
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
    const result = yield compare_model_1.compareModel
        .deleteMany({ _id: { $in: queryIds } })
        .exec();
    return result;
});
exports.compareServices = {
    createCompareService,
    getAllCompareService,
    getSingleCompareService,
    getSingleCompareByUserService,
    updateSingleCompareService,
    deleteSingleCompareService,
    deleteManyCompareService,
};
