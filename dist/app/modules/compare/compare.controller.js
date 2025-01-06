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
exports.compareControllers = void 0;
const compare_service_1 = require("./compare.service");
const createCompareController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const formData = Object.assign({}, data);
        const result = yield compare_service_1.compareServices.createCompareService(formData);
        res.status(200).json({
            success: true,
            message: "Compare Created Successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllCompareController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const pageNumber = page ? parseInt(page, 10) : undefined;
        const pageSize = limit ? parseInt(limit, 10) : undefined;
        const searchText = req.query.searchText;
        const searchFields = ["price", "quantity"];
        const result = yield compare_service_1.compareServices.getAllCompareService(pageNumber, pageSize, searchText, searchFields);
        res.status(200).json({
            success: true,
            message: "Compares Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Get single Compare data
const getSingleCompareController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { compareId } = req.params;
        const result = yield compare_service_1.compareServices.getSingleCompareService(compareId);
        res.status(200).json({
            success: true,
            message: "Compare Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getSingleCompareBuyUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield compare_service_1.compareServices.getSingleCompareByUserService(userId);
        res.status(200).json({
            success: true,
            message: "Compare By User Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Update single Compare controller
const updateSingleCompareController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { compareId } = req.params;
        const data = req.body;
        const compareData = Object.assign({}, data);
        const result = yield compare_service_1.compareServices.updateSingleCompareService(compareId, compareData);
        res.status(200).json({
            success: true,
            message: "Compare Updated Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete single Compare controller
const deleteSingleCompareController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { compareId } = req.params;
        yield compare_service_1.compareServices.deleteSingleCompareService(compareId);
        res.status(200).json({
            success: true,
            message: "Compare Deleted Successfully!",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete many Compare controller
const deleteManyCompareController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const compareIds = req.body;
        if (!Array.isArray(compareIds) || compareIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or empty Compare IDs array provided",
                data: null,
            });
        }
        const result = yield compare_service_1.compareServices.deleteManyCompareService(compareIds);
        res.status(200).json({
            success: true,
            message: `Bulk Compare Delete Successful! Deleted ${result.deletedCount} Compares.`,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.compareControllers = {
    createCompareController,
    getAllCompareController,
    getSingleCompareController,
    getSingleCompareBuyUserController,
    updateSingleCompareController,
    deleteSingleCompareController,
    deleteManyCompareController,
};
