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
exports.reviewControllers = void 0;
const review_service_1 = require("./review.service");
const createReviewController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const filePath = req.file ? req.file.path : undefined;
        const formData = Object.assign(Object.assign({}, data), { attachment: filePath });
        const result = yield review_service_1.reviewServices.createReviewService(formData);
        res.status(200).json({
            success: true,
            message: "Review Created Successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllReviewController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const pageNumber = page ? parseInt(page, 10) : undefined;
        const pageSize = limit ? parseInt(limit, 10) : undefined;
        const searchText = req.query.searchText;
        const searchFields = ["rating", "comment"];
        const result = yield review_service_1.reviewServices.getAllReviewService(pageNumber, pageSize, searchText, searchFields);
        res.status(200).json({
            success: true,
            message: "Reviews Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Get single Review data
const getSingleReviewController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reviewId } = req.params;
        const result = yield review_service_1.reviewServices.getSingleReviewService(reviewId);
        res.status(200).json({
            success: true,
            message: "Review Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getSingleReviewByUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield review_service_1.reviewServices.getSingleReviewByUserService(userId);
        res.status(200).json({
            success: true,
            message: "Review By User Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Update single Review controller
const updateSingleReviewController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reviewId } = req.params;
        const data = req.body;
        const filePath = req.file ? req.file.path : undefined;
        const reviewData = Object.assign(Object.assign({}, data), { attachment: filePath });
        const result = yield review_service_1.reviewServices.updateSingleReviewService(reviewId, reviewData);
        res.status(200).json({
            success: true,
            message: "Review Updated Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete single Review controller
const deleteSingleReviewController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reviewId } = req.params;
        yield review_service_1.reviewServices.deleteSingleReviewService(reviewId);
        res.status(200).json({
            success: true,
            message: "Review Deleted Successfully!",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete many Review controller
const deleteManyReviewsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewIds = req.body;
        if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or empty Review IDs array provided",
                data: null,
            });
        }
        const result = yield review_service_1.reviewServices.deleteManyReviewsService(reviewIds);
        res.status(200).json({
            success: true,
            message: `Bulk Review Delete Successful! Deleted ${result.deletedCount} Reviews.`,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.reviewControllers = {
    createReviewController,
    getAllReviewController,
    getSingleReviewController,
    getSingleReviewByUserController,
    updateSingleReviewController,
    deleteSingleReviewController,
    deleteManyReviewsController,
};
