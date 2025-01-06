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
exports.testServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paginateAndSort_1 = require("../../utils/paginateAndSort");
const test_model_1 = require("./test.model");
const formatResultImage_1 = require("../../utils/formatResultImage");
//Create a test into database
const createTestService = (testData, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const dataToSave = Object.assign(Object.assign({}, testData), { filePath });
    const result = yield test_model_1.testModel.create(dataToSave);
    return result;
});
// Get all tests with optional pagination
const getAllTestService = (page, limit, searchText, searchFields) => __awaiter(void 0, void 0, void 0, function* () {
    let results;
    if (page && limit) {
        const query = test_model_1.testModel.find();
        const result = yield (0, paginateAndSort_1.paginateAndSort)(query, page, limit, searchText, searchFields);
        result.results = (0, formatResultImage_1.formatResultImage)(result.results, "attachment");
        return result;
    }
    else {
        results = yield test_model_1.testModel.find().sort({ createdAt: -1 }).exec();
        results = (0, formatResultImage_1.formatResultImage)(results, "attachment");
        return {
            results,
        };
    }
});
//Get single test
const getSingleTestService = (testId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof testId === "string" ? new mongoose_1.default.Types.ObjectId(testId) : testId;
    const testExists = yield test_model_1.testModel.isTestExists(queryId);
    if (!testExists) {
        throw new Error("Test not found");
    }
    // Find the test by ID
    const result = yield test_model_1.testModel.findById(queryId).exec();
    if (!result) {
        throw new Error("Test not found");
    }
    if (typeof result.attachment === "string") {
        const formattedAttachment = (0, formatResultImage_1.formatResultImage)(result.attachment);
        if (typeof formattedAttachment === "string") {
            result.attachment = formattedAttachment;
        }
    }
    return result;
});
//Update single test
const updateSingleTestService = (testId, testData) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof testId === "string" ? new mongoose_1.default.Types.ObjectId(testId) : testId;
    const result = yield test_model_1.testModel
        .findByIdAndUpdate(queryId, { $set: testData }, { new: true, runValidators: true })
        .exec();
    if (!result) {
        throw new Error("Test not found");
    }
    return result;
});
//Delete single test
const deleteSingleTestService = (testId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof testId === "string" ? new mongoose_1.default.Types.ObjectId(testId) : testId;
    const result = yield test_model_1.testModel.findByIdAndDelete(queryId).exec();
    if (!result) {
        throw new Error("Test not found");
    }
    return result;
});
//Delete many test
const deleteManyTestsService = (testIds) => __awaiter(void 0, void 0, void 0, function* () {
    const queryIds = testIds.map((id) => {
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
    const result = yield test_model_1.testModel.deleteMany({ _id: { $in: queryIds } }).exec();
    return result;
});
exports.testServices = {
    createTestService,
    getAllTestService,
    getSingleTestService,
    updateSingleTestService,
    deleteSingleTestService,
    deleteManyTestsService,
};
