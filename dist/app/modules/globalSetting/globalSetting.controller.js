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
exports.globalSettingControllers = void 0;
const globalSetting_service_1 = require("./globalSetting.service");
const createGlobalSettingController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const data = req.body;
        const files = req.files;
        const logoFile = (_a = files === null || files === void 0 ? void 0 : files.logo) === null || _a === void 0 ? void 0 : _a[0];
        const faviconFile = (_b = files === null || files === void 0 ? void 0 : files.favicon) === null || _b === void 0 ? void 0 : _b[0];
        const formData = Object.assign(Object.assign({}, data), { logo: logoFile === null || logoFile === void 0 ? void 0 : logoFile.path, favicon: faviconFile === null || faviconFile === void 0 ? void 0 : faviconFile.path });
        const result = yield globalSetting_service_1.globalSettingServices.createGlobalSettingService(formData);
        res.status(200).json({
            success: true,
            message: "Global Setting Created Successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllGlobalSettingController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield globalSetting_service_1.globalSettingServices.getAllGlobalSettingService();
        res.status(200).json({
            success: true,
            message: "Global Settings Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Update single GlobalSetting controller
const updateSingleGlobalSettingController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { globalSettingId } = req.params;
        const data = req.body;
        const files = req.files;
        const logoFilePath = (_b = (_a = files === null || files === void 0 ? void 0 : files.logo) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path;
        const faviconFilePath = (_d = (_c = files === null || files === void 0 ? void 0 : files.favicon) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.path;
        const globalSettingData = Object.assign(Object.assign({}, data), { logo: logoFilePath, favicon: faviconFilePath });
        const result = yield globalSetting_service_1.globalSettingServices.updateSingleGlobalSettingService(globalSettingId, globalSettingData);
        res.status(200).json({
            success: true,
            message: "Global Setting Data Updated Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.globalSettingControllers = {
    createGlobalSettingController,
    getAllGlobalSettingController,
    updateSingleGlobalSettingController,
};
