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
exports.sliderControllers = void 0;
const slider_service_1 = require("./slider.service");
const createSliderController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const filePath = req.file ? req.file.path : undefined;
        const formData = Object.assign(Object.assign({}, data), { attachment: filePath });
        const result = yield slider_service_1.sliderServices.createSliderService(formData);
        res.status(200).json({
            success: true,
            message: "Slider Created Successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllSliderController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        const pageNumber = page ? parseInt(page, 10) : undefined;
        const pageSize = limit ? parseInt(limit, 10) : undefined;
        const searchText = req.query.searchText;
        const searchFields = ["rating", "comment"];
        const result = yield slider_service_1.sliderServices.getAllSliderService(pageNumber, pageSize, searchText, searchFields);
        res.status(200).json({
            success: true,
            message: "Sliders Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Get single slider data
const getSingleSliderController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sliderId } = req.params;
        const result = yield slider_service_1.sliderServices.getSingleSliderService(sliderId);
        res.status(200).json({
            success: true,
            message: "Slider Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Update single slider controller
const updateSingleSliderController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sliderId } = req.params;
        const data = req.body;
        const filePath = req.file ? req.file.path : undefined;
        const sliderData = Object.assign(Object.assign({}, data), { attachment: filePath });
        const result = yield slider_service_1.sliderServices.updateSingleSliderService(sliderId, sliderData);
        res.status(200).json({
            success: true,
            message: "Slider Updated Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete single slider controller
const deleteSingleSliderController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sliderId } = req.params;
        yield slider_service_1.sliderServices.deleteSingleSliderService(sliderId);
        res.status(200).json({
            success: true,
            message: "Slider Deleted Successfully!",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
//Delete many slider controller
const deleteManySlidersController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sliderIds = req.body;
        if (!Array.isArray(sliderIds) || sliderIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or empty slider IDs array provided",
                data: null,
            });
        }
        const result = yield slider_service_1.sliderServices.deleteManySlidersService(sliderIds);
        res.status(200).json({
            success: true,
            message: `Bulk slider Delete Successful! Deleted ${result.deletedCount} sliders.`,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.sliderControllers = {
    createSliderController,
    getAllSliderController,
    getSingleSliderController,
    updateSingleSliderController,
    deleteSingleSliderController,
    deleteManySlidersController,
};
