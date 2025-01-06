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
exports.attributeServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paginateAndSort_1 = require("../../utils/paginateAndSort");
const attribute_model_1 = require("./attribute.model");
const attributeOption_model_1 = require("../attributeOption/attributeOption.model");
//Create a Attribute into database
const createAttributeService = (attributeData) => __awaiter(void 0, void 0, void 0, function* () {
    const attributeResult = yield attribute_model_1.attributeModel.create(attributeData);
    if (attributeData.options && attributeData.options.length > 0) {
        yield Promise.all(attributeData.options.map((optionId) => __awaiter(void 0, void 0, void 0, function* () {
            yield attributeOption_model_1.attributeOptionModel.findByIdAndUpdate(optionId, { attribute: attributeResult._id }, { new: true, upsert: false });
        })));
    }
    return attributeResult;
});
// Get all Attributes with optional pagination
const getAllAttributeService = (page, limit, searchText, searchFields) => __awaiter(void 0, void 0, void 0, function* () {
    let results;
    if (page && limit) {
        const query = attribute_model_1.attributeModel.find().populate("options");
        const result = yield (0, paginateAndSort_1.paginateAndSort)(query, page, limit, searchText, searchFields);
        return result;
    }
    else {
        results = yield attribute_model_1.attributeModel
            .find()
            .populate("options")
            .sort({ createdAt: -1 })
            .exec();
        return {
            results,
        };
    }
});
//Get single Attribute
const getSingleAttributeService = (AttributeId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof AttributeId === "string"
        ? new mongoose_1.default.Types.ObjectId(AttributeId)
        : AttributeId;
    // Find the Attribute by ID
    const result = yield attribute_model_1.attributeModel
        .findById(queryId)
        .populate("options")
        .exec();
    if (!result) {
        throw new Error("Attribute not found");
    }
    return result;
});
//Update single Attribute
const updateSingleAttributeService = (attributeId, attributeData) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof attributeId === "string"
        ? new mongoose_1.default.Types.ObjectId(attributeId)
        : attributeId;
    const result = yield attribute_model_1.attributeModel
        .findByIdAndUpdate(queryId, { $set: attributeData }, { new: true, runValidators: true })
        .exec();
    if (!result) {
        throw new Error("Attribute not found");
    }
    if (attributeData.options && attributeData.options.length > 0) {
        yield Promise.all(attributeData.options.map((optionId) => __awaiter(void 0, void 0, void 0, function* () {
            yield attributeOption_model_1.attributeOptionModel.findByIdAndUpdate(optionId, { attribute: result._id }, { new: true, upsert: false });
        })));
    }
    return result;
});
//Delete single Attribute
const deleteSingleAttributeService = (attributeId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof attributeId === "string"
        ? new mongoose_1.default.Types.ObjectId(attributeId)
        : attributeId;
    const result = yield attribute_model_1.attributeModel.findByIdAndDelete(queryId).exec();
    if (!result) {
        throw new Error("Attribute not found");
    }
    return result;
});
//Delete many Attribute
const deleteManyAttributesService = (attributeIds) => __awaiter(void 0, void 0, void 0, function* () {
    const queryIds = attributeIds.map((id) => {
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
    const result = yield attribute_model_1.attributeModel
        .deleteMany({ _id: { $in: queryIds } })
        .exec();
    return result;
});
exports.attributeServices = {
    createAttributeService,
    getAllAttributeService,
    getSingleAttributeService,
    updateSingleAttributeService,
    deleteSingleAttributeService,
    deleteManyAttributesService,
};
