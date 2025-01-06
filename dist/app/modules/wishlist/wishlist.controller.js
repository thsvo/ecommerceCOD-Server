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
exports.wishlistControllers = void 0;
const wishlist_service_1 = require("./wishlist.service");
const createWishlistController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const formData = Object.assign({}, data);
        const result = yield wishlist_service_1.wishlistServices.createWishlistService(formData);
        res.status(200).json({
            success: true,
            message: "Wishlist Created Successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllWishlistController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const pageNumber = page ? parseInt(page, 10) : undefined;
        const pageSize = limit ? parseInt(limit, 10) : undefined;
        const searchText = req.query.searchText;
        const searchFields = ["price", "quantity"];
        const result = yield wishlist_service_1.wishlistServices.getAllWishlistService(pageNumber, pageSize, searchText, searchFields);
        res.status(200).json({
            success: true,
            message: "Wishlists Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Get single Wishlist data
const getSingleWishlistController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { wishlistId } = req.params;
        const result = yield wishlist_service_1.wishlistServices.getSingleWishlistService(wishlistId);
        res.status(200).json({
            success: true,
            message: "Wishlist Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getSingleWishlistBuyUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield wishlist_service_1.wishlistServices.getSingleWishlistByUserService(userId);
        res.status(200).json({
            success: true,
            message: "Wishlist By User Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Update single Wishlist controller
const updateSingleWishlistController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { wishlistId } = req.params;
        const data = req.body;
        const wishlistData = Object.assign({}, data);
        const result = yield wishlist_service_1.wishlistServices.updateSingleWishlistService(wishlistId, wishlistData);
        res.status(200).json({
            success: true,
            message: "Wishlist Updated Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete single Wishlist controller
const deleteSingleWishlistController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { wishlistId } = req.params;
        yield wishlist_service_1.wishlistServices.deleteSingleWishlistService(wishlistId);
        res.status(200).json({
            success: true,
            message: "Wishlist Deleted Successfully!",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete many Wishlist controller
const deleteManyWishlistController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wishlistIds = req.body;
        if (!Array.isArray(wishlistIds) || wishlistIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or empty Wishlist IDs array provided",
                data: null,
            });
        }
        const result = yield wishlist_service_1.wishlistServices.deleteManyWishlistService(wishlistIds);
        res.status(200).json({
            success: true,
            message: `Bulk Wishlist Delete Successful! Deleted ${result.deletedCount} Wishlists.`,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.wishlistControllers = {
    createWishlistController,
    getAllWishlistController,
    getSingleWishlistController,
    getSingleWishlistBuyUserController,
    updateSingleWishlistController,
    deleteSingleWishlistController,
    deleteManyWishlistController,
};
