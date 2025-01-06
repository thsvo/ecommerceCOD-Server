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
exports.attributeOptionServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paginateAndSort_1 = require("../../utils/paginateAndSort");
const formatResultImage_1 = require("../../utils/formatResultImage");
const attributeOption_model_1 = require("./attributeOption.model");
//Create a AttributeOption into database
const createAttributeOptionService = (attributeOptionData, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const dataToSave = Object.assign(Object.assign({}, attributeOptionData), { filePath });
    const result = yield attributeOption_model_1.attributeOptionModel.create(dataToSave);
    return result;
});
// Get all AttributeOptions with optional pagination
const getAllAttributeOptionService = (page, limit, searchText, searchFields) => __awaiter(void 0, void 0, void 0, function* () {
    let results;
    if (page && limit) {
        const query = attributeOption_model_1.attributeOptionModel.find();
        const result = yield (0, paginateAndSort_1.paginateAndSort)(query, page, limit, searchText, searchFields);
        result.results = (0, formatResultImage_1.formatResultImage)(result.results, "attachment");
        return result;
    }
    else {
        results = yield attributeOption_model_1.attributeOptionModel.find().sort({ createdAt: -1 }).exec();
        results = (0, formatResultImage_1.formatResultImage)(results, "attachment");
        return {
            results,
        };
    }
});
// Get single AttributeOption
const getSingleAttributeOptionService = (attributeOptionId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof attributeOptionId === "string"
        ? new mongoose_1.default.Types.ObjectId(attributeOptionId)
        : attributeOptionId;
    const result = yield attributeOption_model_1.attributeOptionModel.findById(queryId).exec();
    if (!result) {
        throw new Error("Attribute Option not found");
    }
    if (typeof result.attachment === "string") {
        const formattedAttachment = (0, formatResultImage_1.formatResultImage)(result.attachment);
        if (typeof formattedAttachment === "string") {
            result.attachment = formattedAttachment;
        }
    }
    return result;
});
//Update single AttributeOption
const updateSingleAttributeOptionService = (attributeOptionId, attributeOptionData) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof attributeOptionId === "string"
        ? new mongoose_1.default.Types.ObjectId(attributeOptionId)
        : attributeOptionId;
    const result = yield attributeOption_model_1.attributeOptionModel
        .findByIdAndUpdate(queryId, { $set: attributeOptionData }, { new: true, runValidators: true })
        .exec();
    if (!result) {
        throw new Error("Failed to update Attribute Option");
    }
    return result;
});
//Delete single AttributeOption
const deleteSingleAttributeOptionService = (attributeOptionId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof attributeOptionId === "string"
        ? new mongoose_1.default.Types.ObjectId(attributeOptionId)
        : attributeOptionId;
    const result = yield attributeOption_model_1.attributeOptionModel.findByIdAndDelete(queryId).exec();
    if (!result) {
        throw new Error("Attribute Option not found");
    }
    return result;
});
//Delete many AttributeOption
const deleteManyAttributeOptionsService = (attributeOptionIds) => __awaiter(void 0, void 0, void 0, function* () {
    const queryIds = attributeOptionIds.map((id) => {
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
    const result = yield attributeOption_model_1.attributeOptionModel
        .deleteMany({ _id: { $in: queryIds } })
        .exec();
    return result;
});
exports.attributeOptionServices = {
    createAttributeOptionService,
    getAllAttributeOptionService,
    getSingleAttributeOptionService,
    updateSingleAttributeOptionService,
    deleteSingleAttributeOptionService,
    deleteManyAttributeOptionsService,
};
