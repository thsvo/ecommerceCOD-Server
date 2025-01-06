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
exports.testControllers = void 0;
const test_service_1 = require("./test.service");
const createTestController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const filePath = req.file ? req.file.path : undefined;
        const formData = Object.assign(Object.assign({}, data), { attachment: filePath });
        const result = yield test_service_1.testServices.createTestService(formData);
        res.status(200).json({
            success: true,
            message: "Test Created Successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllTestController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const pageNumber = page ? parseInt(page, 10) : undefined;
        const pageSize = limit ? parseInt(limit, 10) : undefined;
        const searchText = req.query.searchText;
        const searchFields = ["name", "email", "number"];
        const result = yield test_service_1.testServices.getAllTestService(pageNumber, pageSize, searchText, searchFields);
        res.status(200).json({
            success: true,
            message: "Tests Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Get single test data
const getSingleTestController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { testId } = req.params;
        const result = yield test_service_1.testServices.getSingleTestService(testId);
        res.status(200).json({
            success: true,
            message: "Test Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Update single test controller
const updateSingleTestController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { testId } = req.params;
        const data = req.body;
        const filePath = req.file ? req.file.path : undefined;
        const testData = Object.assign(Object.assign({}, data), { attachment: filePath });
        const result = yield test_service_1.testServices.updateSingleTestService(testId, testData);
        res.status(200).json({
            success: true,
            message: "Test Updated Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete single test controller
const deleteSingleTestController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { testId } = req.params;
        yield test_service_1.testServices.deleteSingleTestService(testId);
        res.status(200).json({
            success: true,
            message: "Test Deleted Successfully!",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete many test controller
const deleteManyTestsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const testIds = req.body;
        if (!Array.isArray(testIds) || testIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or empty test IDs array provided",
                data: null,
            });
        }
        const result = yield test_service_1.testServices.deleteManyTestsService(testIds);
        res.status(200).json({
            success: true,
            message: `Bulk Test Delete Successful! Deleted ${result.deletedCount} Tests.`,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.testControllers = {
    createTestController,
    getAllTestController,
    getSingleTestController,
    updateSingleTestController,
    deleteSingleTestController,
    deleteManyTestsController,
};
