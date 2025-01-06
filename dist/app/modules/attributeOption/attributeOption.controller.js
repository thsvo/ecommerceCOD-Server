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
exports.attributeOptionControllers = void 0;
const attributeOption_service_1 = require("./attributeOption.service");
const createAttributeOptionController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const filePath = req.file ? req.file.path : undefined;
        const formData = Object.assign(Object.assign({}, data), { attachment: filePath });
        const result = yield attributeOption_service_1.attributeOptionServices.createAttributeOptionService(formData);
        res.status(200).json({
            success: true,
            message: "Attribute Option Created Successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllAttributeOptionController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const pageNumber = page ? parseInt(page, 10) : undefined;
        const pageSize = limit ? parseInt(limit, 10) : undefined;
        const searchText = req.query.searchText;
        const searchFields = ["name", "label"];
        const result = yield attributeOption_service_1.attributeOptionServices.getAllAttributeOptionService(pageNumber, pageSize, searchText, searchFields);
        res.status(200).json({
            success: true,
            message: "Attribute Options Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Get single AttributeOption data
const getSingleAttributeOptionController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { attributeOptionId } = req.params;
        const result = yield attributeOption_service_1.attributeOptionServices.getSingleAttributeOptionService(attributeOptionId);
        res.status(200).json({
            success: true,
            message: "Attribute Option Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Update single AttributeOption controller
const updateSingleAttributeOptionController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { attributeOptionId } = req.params;
        const data = req.body;
        const filePath = req.file ? req.file.path : undefined;
        const attributeOptionData = Object.assign(Object.assign({}, data), { attachment: filePath });
        const result = yield attributeOption_service_1.attributeOptionServices.updateSingleAttributeOptionService(attributeOptionId, attributeOptionData);
        res.status(200).json({
            success: true,
            message: "Attribute Option Updated Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete single AttributeOption controller
const deleteSingleAttributeOptionController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { attributeOptionId } = req.params;
        yield attributeOption_service_1.attributeOptionServices.deleteSingleAttributeOptionService(attributeOptionId);
        res.status(200).json({
            success: true,
            message: "Attribute Option Deleted Successfully!",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete many AttributeOption controller
const deleteManyAttributeOptionsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const attributeOptionIds = req.body;
        if (!Array.isArray(attributeOptionIds) || attributeOptionIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or empty Attribute Option IDs array provided",
                data: null,
            });
        }
        const result = yield attributeOption_service_1.attributeOptionServices.deleteManyAttributeOptionsService(attributeOptionIds);
        res.status(200).json({
            success: true,
            message: `Bulk Attribute Option Delete Successful! Deleted ${result.deletedCount} AttributeOptions.`,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.attributeOptionControllers = {
    createAttributeOptionController,
    getAllAttributeOptionController,
    getSingleAttributeOptionController,
    updateSingleAttributeOptionController,
    deleteSingleAttributeOptionController,
    deleteManyAttributeOptionsController,
};
