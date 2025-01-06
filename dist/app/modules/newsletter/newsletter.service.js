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
exports.newsletterServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paginateAndSort_1 = require("../../utils/paginateAndSort");
const newsletter_model_1 = require("./newsletter.model");
//Create a newsletter into database
const createNewsletterService = (newsletterData, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const dataToSave = Object.assign(Object.assign({}, newsletterData), { filePath });
    const result = yield newsletter_model_1.newsletterModel.create(dataToSave);
    return result;
});
// Get all newsletter with optional pagination
const getAllNewsletterService = (page, limit, searchText, searchFields) => __awaiter(void 0, void 0, void 0, function* () {
    let results;
    if (page && limit) {
        const query = newsletter_model_1.newsletterModel.find();
        const result = yield (0, paginateAndSort_1.paginateAndSort)(query, page, limit, searchText, searchFields);
        return result;
    }
    else {
        results = yield newsletter_model_1.newsletterModel.find().sort({ createdAt: -1 }).exec();
        return {
            results,
        };
    }
});
//Get single newsletter
const getSingleNewsletterService = (newsletterId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof newsletterId === "string"
        ? new mongoose_1.default.Types.ObjectId(newsletterId)
        : newsletterId;
    const result = yield newsletter_model_1.newsletterModel
        .findById(queryId)
        .populate("user")
        .exec();
    if (!result) {
        throw new Error("Newsletter not found");
    }
    return result;
});
//Update single newsletter
const updateSingleNewsletterService = (newsletterId, newsletterData) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof newsletterId === "string"
        ? new mongoose_1.default.Types.ObjectId(newsletterId)
        : newsletterId;
    const result = yield newsletter_model_1.newsletterModel
        .findByIdAndUpdate(queryId, { $set: newsletterData }, { new: true, runValidators: true })
        .exec();
    if (!result) {
        throw new Error("Newsletter not found");
    }
    return result;
});
//Delete single newsletter
const deleteSingleNewsletterService = (newsletterId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof newsletterId === "string"
        ? new mongoose_1.default.Types.ObjectId(newsletterId)
        : newsletterId;
    const result = yield newsletter_model_1.newsletterModel.findByIdAndDelete(queryId).exec();
    if (!result) {
        throw new Error("Newsletter not found");
    }
    return result;
});
//Delete many newsletter
const deleteManyNewsletterService = (newsletterIds) => __awaiter(void 0, void 0, void 0, function* () {
    const queryIds = newsletterIds.map((id) => {
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
    const result = yield newsletter_model_1.newsletterModel
        .deleteMany({ _id: { $in: queryIds } })
        .exec();
    return result;
});
exports.newsletterServices = {
    createNewsletterService,
    getAllNewsletterService,
    getSingleNewsletterService,
    updateSingleNewsletterService,
    deleteSingleNewsletterService,
    deleteManyNewsletterService,
};
