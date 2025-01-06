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
exports.newsletterControllers = void 0;
const newsletter_service_1 = require("./newsletter.service");
const createNewsletterController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const formData = Object.assign({}, data);
        const result = yield newsletter_service_1.newsletterServices.createNewsletterService(formData);
        res.status(200).json({
            success: true,
            message: "Newsletter Created Successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllNewsletterController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const pageNumber = page ? parseInt(page, 10) : undefined;
        const pageSize = limit ? parseInt(limit, 10) : undefined;
        const searchText = req.query.searchText;
        const searchFields = ["email"];
        const result = yield newsletter_service_1.newsletterServices.getAllNewsletterService(pageNumber, pageSize, searchText, searchFields);
        res.status(200).json({
            success: true,
            message: "Newsletters Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Get single Newsletter data
const getSingleNewsletterController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newsletterId } = req.params;
        const result = yield newsletter_service_1.newsletterServices.getSingleNewsletterService(newsletterId);
        res.status(200).json({
            success: true,
            message: "Newsletter Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Update single Newsletter controller
const updateSingleNewsletterController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newsletterId } = req.params;
        const data = req.body;
        const newsletterData = Object.assign({}, data);
        const result = yield newsletter_service_1.newsletterServices.updateSingleNewsletterService(newsletterId, newsletterData);
        res.status(200).json({
            success: true,
            message: "Newsletter Updated Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete single Newsletter controller
const deleteSingleNewsletterController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newsletterId } = req.params;
        yield newsletter_service_1.newsletterServices.deleteSingleNewsletterService(newsletterId);
        res.status(200).json({
            success: true,
            message: "Newsletter Deleted Successfully!",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete many Newsletter controller
const deleteManyNewsletterController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newsletterIds = req.body;
        if (!Array.isArray(newsletterIds) || newsletterIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or empty Newsletter IDs array provided",
                data: null,
            });
        }
        const result = yield newsletter_service_1.newsletterServices.deleteManyNewsletterService(newsletterIds);
        res.status(200).json({
            success: true,
            message: `Bulk Newsletter Delete Successful! Deleted ${result.deletedCount} Newsletter.`,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.newsletterControllers = {
    createNewsletterController,
    getAllNewsletterController,
    getSingleNewsletterController,
    updateSingleNewsletterController,
    deleteSingleNewsletterController,
    deleteManyNewsletterController,
};
