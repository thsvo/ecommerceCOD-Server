"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("./category.controller");
const upload_1 = require("../upload/upload");
const router = express_1.default.Router();
router.post("/category/", upload_1.uploadService.single("attachment"), category_controller_1.CategoryControllers.createCategoryController);
router.get("/category/", category_controller_1.CategoryControllers.getAllCategoriesController);
router.get("/category/:categoryId/", category_controller_1.CategoryControllers.getSingleCategoryController);
router.patch("/category/:categoryId/", upload_1.uploadService.single("attachment"), category_controller_1.CategoryControllers.updateSingleCategoryController);
router.delete("/category/:categoryId/", category_controller_1.CategoryControllers.deleteSingleCategoryController);
router.post("/category/bulk-delete/", category_controller_1.CategoryControllers.deleteManyCategoriesController);
exports.categoryRoutes = router;
