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
exports.offerControllers = void 0;
const offer_service_1 = require("./offer.service");
const createOfferController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const filePath = req.file ? req.file.path : undefined;
        const formData = Object.assign(Object.assign({}, data), { attachment: filePath });
        const result = yield offer_service_1.offerServices.createOfferService(formData);
        res.status(200).json({
            success: true,
            message: "Offer Created Successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllOfferController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const pageNumber = page ? parseInt(page, 10) : undefined;
        const pageSize = limit ? parseInt(limit, 10) : undefined;
        const searchText = req.query.searchText;
        const searchFields = [
            "name",
            "description",
            "price",
            "discount",
            "startDate",
            "endDate",
        ];
        const result = yield offer_service_1.offerServices.getAllOfferService(pageNumber, pageSize, searchText, searchFields);
        res.status(200).json({
            success: true,
            message: "Offers Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Get single Offer data
const getSingleOfferController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { offerId } = req.params;
        const result = yield offer_service_1.offerServices.getSingleOfferService(offerId);
        res.status(200).json({
            success: true,
            message: "Offer Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Update single Offer controller
const updateSingleOfferController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { offerId } = req.params;
        const data = req.body;
        const filePath = req.file ? req.file.path : undefined;
        const offerData = Object.assign(Object.assign({}, data), { attachment: filePath });
        const result = yield offer_service_1.offerServices.updateSingleOfferService(offerId, offerData);
        res.status(200).json({
            success: true,
            message: "Offer Updated Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete single Offer controller
const deleteSingleOfferController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { offerId } = req.params;
        yield offer_service_1.offerServices.deleteSingleOfferService(offerId);
        res.status(200).json({
            success: true,
            message: "Offer Deleted Successfully!",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete many Offer controller
const deleteManyOfferController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const offerIds = req.body;
        if (!Array.isArray(offerIds) || offerIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or empty Offer IDs array provided",
                data: null,
            });
        }
        const result = yield offer_service_1.offerServices.deleteManyOfferService(offerIds);
        res.status(200).json({
            success: true,
            message: `Bulk Offer Delete Successful! Deleted ${result.deletedCount} Offer.`,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.offerControllers = {
    createOfferController,
    getAllOfferController,
    getSingleOfferController,
    updateSingleOfferController,
    deleteSingleOfferController,
    deleteManyOfferController,
};
