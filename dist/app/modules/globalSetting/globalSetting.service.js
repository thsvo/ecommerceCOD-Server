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
exports.globalSettingServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const formatResultImage_1 = require("../../utils/formatResultImage");
const globalSetting_model_1 = require("./globalSetting.model");
//Create a globalSetting into database
const createGlobalSettingService = (globalSettingData, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const dataToSave = Object.assign(Object.assign({}, globalSettingData), { filePath });
    const result = yield globalSetting_model_1.globalSettingModel.create(dataToSave);
    return result;
});
// Get all globalSetting with optional pagination
const getAllGlobalSettingService = () => __awaiter(void 0, void 0, void 0, function* () {
    let results;
    results = yield globalSetting_model_1.globalSettingModel.find().exec();
    results = (0, formatResultImage_1.formatResultImage)(results, "logo");
    results = (0, formatResultImage_1.formatResultImage)(results, "favicon");
    return {
        result: results[0] || null,
    };
});
//Update single globalSetting
const updateSingleGlobalSettingService = (globalSettingId, globalSettingData) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof globalSettingId === "string"
        ? new mongoose_1.default.Types.ObjectId(globalSettingId)
        : globalSettingId;
    const result = yield globalSetting_model_1.globalSettingModel
        .findByIdAndUpdate(queryId, { $set: globalSettingData }, { new: true, runValidators: true })
        .exec();
    if (!result) {
        throw new Error("Global Setting not found");
    }
    return result;
});
exports.globalSettingServices = {
    createGlobalSettingService,
    getAllGlobalSettingService,
    updateSingleGlobalSettingService,
};
