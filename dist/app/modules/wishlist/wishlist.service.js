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
exports.wishlistServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paginateAndSort_1 = require("../../utils/paginateAndSort");
const wishlist_model_1 = require("./wishlist.model");
//Create a wishlist into database
const createWishlistService = (wishlistData) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, product } = wishlistData;
    const existingWishlist = yield wishlist_model_1.wishlistModel.findOne({ user, product });
    if (existingWishlist) {
        throw new Error("This product is already in your wishlist.");
    }
    const dataToSave = Object.assign({}, wishlistData);
    const result = yield wishlist_model_1.wishlistModel.create(dataToSave);
    return result;
});
// Get all wishlist with optional pagination
const getAllWishlistService = (page, limit, searchText, searchFields) => __awaiter(void 0, void 0, void 0, function* () {
    let results;
    if (page && limit) {
        const query = wishlist_model_1.wishlistModel.find().populate("product").populate("user");
        const result = yield (0, paginateAndSort_1.paginateAndSort)(query, page, limit, searchText, searchFields);
        return result;
    }
    else {
        results = yield wishlist_model_1.wishlistModel
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
//Get single wishlist
const getSingleWishlistService = (wishlistId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof wishlistId === "string"
        ? new mongoose_1.default.Types.ObjectId(wishlistId)
        : wishlistId;
    const result = yield wishlist_model_1.wishlistModel
        .findById(queryId)
        .populate("product")
        .populate("user")
        .exec();
    if (!result) {
        throw new Error("wishlist not found");
    }
    return result;
});
const getSingleWishlistByUserService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield wishlist_model_1.wishlistModel
        .find(query)
        .populate("product")
        .populate("user")
        .exec();
    if (!result || result.length === 0) {
        throw new Error("Wishlist not found for this identifier");
    }
    return result;
});
//Update single wishlist
const updateSingleWishlistService = (wishlistId, wishlistData) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof wishlistId === "string"
        ? new mongoose_1.default.Types.ObjectId(wishlistId)
        : wishlistId;
    const result = yield wishlist_model_1.wishlistModel
        .findByIdAndUpdate(queryId, { $set: wishlistData }, { new: true, runValidators: true })
        .exec();
    if (!result) {
        throw new Error("wishlist not found");
    }
    return result;
});
//Delete single wishlist
const deleteSingleWishlistService = (wishlistId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof wishlistId === "string"
        ? new mongoose_1.default.Types.ObjectId(wishlistId)
        : wishlistId;
    const result = yield wishlist_model_1.wishlistModel.findByIdAndDelete(queryId).exec();
    if (!result) {
        throw new Error("wishlist not found");
    }
    return result;
});
//Delete many wishlist
const deleteManyWishlistService = (wishlistIds) => __awaiter(void 0, void 0, void 0, function* () {
    const queryIds = wishlistIds.map((id) => {
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
    const result = yield wishlist_model_1.wishlistModel
        .deleteMany({ _id: { $in: queryIds } })
        .exec();
    return result;
});
exports.wishlistServices = {
    createWishlistService,
    getAllWishlistService,
    getSingleWishlistService,
    getSingleWishlistByUserService,
    updateSingleWishlistService,
    deleteSingleWishlistService,
    deleteManyWishlistService,
};
