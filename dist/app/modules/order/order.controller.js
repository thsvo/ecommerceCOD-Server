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
exports.orderControllers = void 0;
const order_service_1 = require("./order.service");
const config_1 = __importDefault(require("../../config"));
const initiateOrderController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const formData = Object.assign({}, data);
        const result = yield order_service_1.orderServices.initiateOrderService(formData);
        res.status(200).json({
            success: true,
            message: "Order Created Successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const sslOrderSuccessController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tranId } = req.params;
        if (!tranId) {
            throw new Error("Transaction ID not provided");
        }
        yield order_service_1.orderServices.handleSSLOrderSuccessService(tranId);
        res.redirect(`${config_1.default.client_url}/success`);
    }
    catch (error) {
        next(error);
    }
});
const getAllOrderController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const pageNumber = page ? parseInt(page, 10) : undefined;
        const pageSize = limit ? parseInt(limit, 10) : undefined;
        const searchText = req.query.searchText;
        const searchFields = ["name", "options"];
        const result = yield order_service_1.orderServices.getAllOrderService(pageNumber, pageSize, searchText, searchFields);
        res.status(200).json({
            success: true,
            message: "Orders Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllOrderByUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const { userId } = req.params;
        const pageNumber = page ? parseInt(page, 10) : undefined;
        const pageSize = limit ? parseInt(limit, 10) : undefined;
        const searchText = req.query.searchText;
        const searchFields = ["name", "options"];
        const result = yield order_service_1.orderServices.getAllOrderByUserService(userId, pageNumber, pageSize, searchText, searchFields);
        res.status(200).json({
            success: true,
            message: "Orders By User Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Get single Order data
const getSingleOrderController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const result = yield order_service_1.orderServices.getSingleOrderService(orderId);
        res.status(200).json({
            success: true,
            message: "Order Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Update single Order controller
const updateSingleOrderController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const data = req.body;
        const orderData = Object.assign({}, data);
        const result = yield order_service_1.orderServices.updateSingleOrderService(orderId, orderData);
        res.status(200).json({
            success: true,
            message: "Order Updated Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete single Order controller
const deleteSingleOrderController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        yield order_service_1.orderServices.deleteSingleOrderService(orderId);
        res.status(200).json({
            success: true,
            message: "Order Deleted Successfully!",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete many Order controller
const deleteManyOrdersController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderIds = req.body;
        if (!Array.isArray(orderIds) || orderIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or empty Order IDs array provided",
                data: null,
            });
        }
        const result = yield order_service_1.orderServices.deleteManyOrdersService(orderIds);
        res.status(200).json({
            success: true,
            message: `Bulk Order Delete Successful! Deleted ${result.deletedCount} Orders.`,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.orderControllers = {
    initiateOrderController,
    sslOrderSuccessController,
    getAllOrderController,
    getAllOrderByUserController,
    getSingleOrderController,
    updateSingleOrderController,
    deleteSingleOrderController,
    deleteManyOrdersController,
};
