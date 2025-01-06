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
exports.couponControllers = void 0;
const coupon_service_1 = require("./coupon.service");
const createCouponController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const filePath = req.file ? req.file.path : undefined;
        const formData = Object.assign(Object.assign({}, data), { attachment: filePath });
        const result = yield coupon_service_1.couponServices.createCouponService(formData);
        res.status(200).json({
            success: true,
            message: "Coupon Created Successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllCouponController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const pageNumber = page ? parseInt(page, 10) : undefined;
        const pageSize = limit ? parseInt(limit, 10) : undefined;
        const searchText = req.query.searchText;
        const searchFields = ["name", "code"];
        const result = yield coupon_service_1.couponServices.getAllCouponService(pageNumber, pageSize, searchText, searchFields);
        res.status(200).json({
            success: true,
            message: "Coupons Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Get single Coupon data
const getSingleCouponController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { couponId } = req.params;
        const result = yield coupon_service_1.couponServices.getSingleCouponService(couponId);
        res.status(200).json({
            success: true,
            message: "Coupon Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getSingleCouponByCodeController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { couponCode } = req.params;
        const result = yield coupon_service_1.couponServices.getSingleCouponByCodeService(couponCode);
        res.status(200).json({
            success: true,
            message: "Coupon By Code Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Update single Coupon controller
const updateSingleCouponController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { couponId } = req.params;
        const data = req.body;
        const filePath = req.file ? req.file.path : undefined;
        const couponData = Object.assign(Object.assign({}, data), { attachment: filePath });
        const result = yield coupon_service_1.couponServices.updateSingleCouponService(couponId, couponData);
        res.status(200).json({
            success: true,
            message: "Coupon Updated Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete single Coupon controller
const deleteSingleCouponController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { couponId } = req.params;
        yield coupon_service_1.couponServices.deleteSingleCouponService(couponId);
        res.status(200).json({
            success: true,
            message: "Coupon Deleted Successfully!",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete many Coupon controller
const deleteManyCouponController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const couponIds = req.body;
        if (!Array.isArray(couponIds) || couponIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or empty Coupon IDs array provided",
                data: null,
            });
        }
        const result = yield coupon_service_1.couponServices.deleteManyCouponService(couponIds);
        res.status(200).json({
            success: true,
            message: `Bulk Coupon Delete Successful! Deleted ${result.deletedCount} Coupon.`,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.couponControllers = {
    createCouponController,
    getAllCouponController,
    getSingleCouponController,
    getSingleCouponByCodeController,
    updateSingleCouponController,
    deleteSingleCouponController,
    deleteManyCouponController,
};
