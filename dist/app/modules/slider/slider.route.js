"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sliderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const upload_1 = require("../upload/upload");
const slider_controller_1 = require("./slider.controller");
const router = express_1.default.Router();
router.post("/slider/", upload_1.uploadService.single("attachment"), slider_controller_1.sliderControllers.createSliderController);
router.get("/slider/", slider_controller_1.sliderControllers.getAllSliderController);
router.get("/slider/:sliderId/", slider_controller_1.sliderControllers.getSingleSliderController);
router.patch("/slider/:sliderId/", upload_1.uploadService.single("attachment"), slider_controller_1.sliderControllers.updateSingleSliderController);
router.delete("/slider/:sliderId/", slider_controller_1.sliderControllers.deleteSingleSliderController);
router.post("/slider/bulk-delete/", slider_controller_1.sliderControllers.deleteManySlidersController);
exports.sliderRoutes = router;
