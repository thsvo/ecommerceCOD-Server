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
exports.giftCardControllers = void 0;
const giftCard_service_1 = require("./giftCard.service");
const createGiftCardController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const filePath = req.file ? req.file.path : undefined;
        const formData = Object.assign(Object.assign({}, data), { attachment: filePath });
        const result = yield giftCard_service_1.giftCardServices.createGiftCardService(formData);
        res.status(200).json({
            success: true,
            message: "Gift Card Created Successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllGiftCardController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const pageNumber = page ? parseInt(page, 10) : undefined;
        const pageSize = limit ? parseInt(limit, 10) : undefined;
        const searchText = req.query.searchText;
        const searchFields = ["name", "code"];
        const result = yield giftCard_service_1.giftCardServices.getAllGiftCardService(pageNumber, pageSize, searchText, searchFields);
        res.status(200).json({
            success: true,
            message: "Gift Cards Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Get single GiftCard data
const getSingleGiftCardController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { giftCardId } = req.params;
        const result = yield giftCard_service_1.giftCardServices.getSingleGiftCardService(giftCardId);
        res.status(200).json({
            success: true,
            message: "Gift Card Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getSingleCouponByCodeController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { giftCardCode } = req.params;
        const result = yield giftCard_service_1.giftCardServices.getSingleGiftCardByCodeService(giftCardCode);
        res.status(200).json({
            success: true,
            message: "Gift Card By Code Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Update single GiftCard controller
const updateSingleGiftCardController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { giftCardId } = req.params;
        const data = req.body;
        const filePath = req.file ? req.file.path : undefined;
        const giftCardData = Object.assign(Object.assign({}, data), { attachment: filePath });
        const result = yield giftCard_service_1.giftCardServices.updateSingleGiftCardService(giftCardId, giftCardData);
        res.status(200).json({
            success: true,
            message: "Gift Card Updated Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete single GiftCard controller
const deleteSingleGiftCardController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { giftCardId } = req.params;
        yield giftCard_service_1.giftCardServices.deleteSingleGiftCardService(giftCardId);
        res.status(200).json({
            success: true,
            message: "Gift Card Deleted Successfully!",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete many GiftCard controller
const deleteManyGiftCardController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const giftCardIds = req.body;
        if (!Array.isArray(giftCardIds) || giftCardIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or empty GiftCard IDs array provided",
                data: null,
            });
        }
        const result = yield giftCard_service_1.giftCardServices.deleteManyGiftCardService(giftCardIds);
        res.status(200).json({
            success: true,
            message: `Bulk Gift Card Delete Successful! Deleted ${result.deletedCount} Gift Card.`,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.giftCardControllers = {
    createGiftCardController,
    getAllGiftCardController,
    getSingleGiftCardController,
    getSingleCouponByCodeController,
    updateSingleGiftCardController,
    deleteSingleGiftCardController,
    deleteManyGiftCardController,
};
