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
exports.cartControllers = void 0;
const cart_service_1 = require("./cart.service");
const createCartController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const formData = Object.assign({}, data);
        const result = yield cart_service_1.cartServices.createCartService(formData);
        res.status(200).json({
            success: true,
            message: "Cart Created Successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllCartController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const pageNumber = page ? parseInt(page, 10) : undefined;
        const pageSize = limit ? parseInt(limit, 10) : undefined;
        const searchText = req.query.searchText;
        const searchFields = ["price", "quantity"];
        const result = yield cart_service_1.cartServices.getAllCartService(pageNumber, pageSize, searchText, searchFields);
        res.status(200).json({
            success: true,
            message: "Carts Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Get single Cart data
const getSingleCartController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cartId } = req.params;
        const result = yield cart_service_1.cartServices.getSingleCartService(cartId);
        res.status(200).json({
            success: true,
            message: "Cart Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getSingleCartBuyUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield cart_service_1.cartServices.getSingleCartByUserService(userId);
        res.status(200).json({
            success: true,
            message: "Cart By User Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Update single Cart controller
const updateSingleCartController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cartId } = req.params;
        const data = req.body;
        const cartData = Object.assign({}, data);
        const result = yield cart_service_1.cartServices.updateSingleCartService(cartId, cartData);
        res.status(200).json({
            success: true,
            message: "Cart Updated Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete single Cart controller
const deleteSingleCartController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cartId } = req.params;
        yield cart_service_1.cartServices.deleteSingleCartService(cartId);
        res.status(200).json({
            success: true,
            message: "Cart Deleted Successfully!",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete many Cart controller
const deleteManyCartController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartIds = req.body;
        if (!Array.isArray(cartIds) || cartIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or empty Cart IDs array provided",
                data: null,
            });
        }
        const result = yield cart_service_1.cartServices.deleteManyCartService(cartIds);
        res.status(200).json({
            success: true,
            message: `Bulk Cart Delete Successful! Deleted ${result.deletedCount} Carts.`,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.cartControllers = {
    createCartController,
    getAllCartController,
    getSingleCartController,
    getSingleCartBuyUserController,
    updateSingleCartController,
    deleteSingleCartController,
    deleteManyCartController,
};
