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
exports.attributeControllers = void 0;
const attribute_service_1 = require("./attribute.service");
const createAttributeController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const formData = Object.assign({}, data);
        const result = yield attribute_service_1.attributeServices.createAttributeService(formData);
        res.status(200).json({
            success: true,
            message: "Attribute Created Successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllAttributeController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const pageNumber = page ? parseInt(page, 10) : undefined;
        const pageSize = limit ? parseInt(limit, 10) : undefined;
        const searchText = req.query.searchText;
        const searchFields = ["name", "options"];
        const result = yield attribute_service_1.attributeServices.getAllAttributeService(pageNumber, pageSize, searchText, searchFields);
        res.status(200).json({
            success: true,
            message: "Attributes Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Get single Attribute data
const getSingleAttributeController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { attributeId } = req.params;
        const result = yield attribute_service_1.attributeServices.getSingleAttributeService(attributeId);
        res.status(200).json({
            success: true,
            message: "Attribute Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Update single Attribute controller
const updateSingleAttributeController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { attributeId } = req.params;
        const data = req.body;
        const attributeData = Object.assign({}, data);
        const result = yield attribute_service_1.attributeServices.updateSingleAttributeService(attributeId, attributeData);
        res.status(200).json({
            success: true,
            message: "Attribute Updated Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete single Attribute controller
const deleteSingleAttributeController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { attributeId } = req.params;
        yield attribute_service_1.attributeServices.deleteSingleAttributeService(attributeId);
        res.status(200).json({
            success: true,
            message: "Attribute Deleted Successfully!",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete many Attribute controller
const deleteManyAttributesController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const attributeIds = req.body;
        if (!Array.isArray(attributeIds) || attributeIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or empty Attribute IDs array provided",
                data: null,
            });
        }
        const result = yield attribute_service_1.attributeServices.deleteManyAttributesService(attributeIds);
        res.status(200).json({
            success: true,
            message: `Bulk Attribute Delete Successful! Deleted ${result.deletedCount} Attributes.`,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.attributeControllers = {
    createAttributeController,
    getAllAttributeController,
    getSingleAttributeController,
    updateSingleAttributeController,
    deleteSingleAttributeController,
    deleteManyAttributesController,
};
