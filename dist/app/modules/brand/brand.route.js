"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandRoutes = void 0;
const express_1 = __importDefault(require("express"));
const upload_1 = require("../upload/upload");
const brand_controller_1 = require("./brand.controller");
const router = express_1.default.Router();
router.post("/brand/", upload_1.uploadService.single("attachment"), brand_controller_1.brandControllers.createBrandController);
router.get("/brand/", brand_controller_1.brandControllers.getAllBrandController);
router.get("/brand/:brandId/", brand_controller_1.brandControllers.getSingleBrandController);
router.patch("/brand/:brandId/", upload_1.uploadService.single("attachment"), brand_controller_1.brandControllers.updateSingleBrandController);
router.delete("/brand/:brandId/", brand_controller_1.brandControllers.deleteSingleBrandController);
router.post("/brand/bulk-delete/", brand_controller_1.brandControllers.deleteManyBrandsController);
exports.brandRoutes = router;
