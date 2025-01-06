"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalSettingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const upload_1 = require("../upload/upload");
const globalSetting_controller_1 = require("./globalSetting.controller");
const router = express_1.default.Router();
router.post("/global-setting/", upload_1.uploadService.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
]), globalSetting_controller_1.globalSettingControllers.createGlobalSettingController);
router.get("/global-setting/", globalSetting_controller_1.globalSettingControllers.getAllGlobalSettingController);
router.patch("/global-setting/:globalSettingId/", upload_1.uploadService.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
]), globalSetting_controller_1.globalSettingControllers.updateSingleGlobalSettingController);
exports.globalSettingRoutes = router;
