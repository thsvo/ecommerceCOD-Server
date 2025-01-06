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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sliderServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paginateAndSort_1 = require("../../utils/paginateAndSort");
const formatResultImage_1 = require("../../utils/formatResultImage");
const slider_model_1 = require("./slider.model");
//Create a Slider into database
const createSliderService = (SliderData, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const dataToSave = Object.assign(Object.assign({}, SliderData), { filePath });
    const result = yield slider_model_1.sliderModel.create(dataToSave);
    return result;
});
// Get all Sliders withal pagination
const getAllSliderService = (page, limit, searchText, searchFields) => __awaiter(void 0, void 0, void 0, function* () {
    let results;
    if (page && limit) {
        const query = slider_model_1.sliderModel.find().populate("category");
        const result = yield (0, paginateAndSort_1.paginateAndSort)(query, page, limit, searchText, searchFields);
        result.results = (0, formatResultImage_1.formatResultImage)(result.results, "attachment");
        return result;
    }
    else {
        results = yield slider_model_1.sliderModel
            .find()
            .populate("category")
            .sort({ createdAt: -1 })
            .exec();
        results = (0, formatResultImage_1.formatResultImage)(results, "attachment");
        return {
            results,
        };
    }
});
// Get single Slider
const getSingleSliderService = (SliderId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof SliderId === "string"
        ? new mongoose_1.default.Types.ObjectId(SliderId)
        : SliderId;
    const result = yield slider_model_1.sliderModel
        .findById(queryId)
        .populate("category")
        .exec();
    if (!result) {
        throw new Error("Slider not found");
    }
    if (typeof result.attachment === "string") {
        const formattedAttachment = (0, formatResultImage_1.formatResultImage)(result.attachment);
        if (typeof formattedAttachment === "string") {
            result.attachment = formattedAttachment;
        }
    }
    return result;
});
//Update single Slider
const updateSingleSliderService = (SliderId, SliderData) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof SliderId === "string"
        ? new mongoose_1.default.Types.ObjectId(SliderId)
        : SliderId;
    const result = yield slider_model_1.sliderModel
        .findByIdAndUpdate(queryId, { $set: SliderData }, { new: true, runValidators: true })
        .exec();
    if (!result) {
        throw new Error("Slider not found");
    }
    return result;
});
//Delete single Slider
const deleteSingleSliderService = (SliderId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof SliderId === "string"
        ? new mongoose_1.default.Types.ObjectId(SliderId)
        : SliderId;
    const result = yield slider_model_1.sliderModel.findByIdAndDelete(queryId).exec();
    if (!result) {
        throw new Error("Slider not found");
    }
    return result;
});
//Delete many Slider
const deleteManySlidersService = (SliderIds) => __awaiter(void 0, void 0, void 0, function* () {
    const queryIds = SliderIds.map((id) => {
        if (typeof id === "string" && mongoose_1.default.Types.ObjectId.isValid(id)) {
            return new mongoose_1.default.Types.ObjectId(id);
        }
        else if (typeof id === "number") {
            return id;
        }
        else {
            throw new Error(`Invalid ID format: ${id}`);
        }
    });
    const result = yield slider_model_1.sliderModel
        .deleteMany({ _id: { $in: queryIds } })
        .exec();
    return result;
});
exports.sliderServices = {
    createSliderService,
    getAllSliderService,
    getSingleSliderService,
    updateSingleSliderService,
    deleteSingleSliderService,
    deleteManySlidersService,
};
