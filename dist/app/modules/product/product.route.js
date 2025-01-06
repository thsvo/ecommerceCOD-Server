"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const upload_1 = require("../upload/upload");
const product_controller_1 = require("./product.controller");
const router = express_1.default.Router();
router.post("/product/", upload_1.uploadService.any(), product_controller_1.ProductControllers.createProductController);
router.get("/product/", product_controller_1.ProductControllers.getAllProductController);
router.get("/product/:productId/", product_controller_1.ProductControllers.getSingleProductController);
router.get("/product/sku/:sku/", product_controller_1.ProductControllers.getSingleProductBySkuController);
router.get("/product/slug/:productSlug/", product_controller_1.ProductControllers.getSingleProductBySlugController);
router.patch("/product/:productId/", upload_1.uploadService.single("mainImage"), product_controller_1.ProductControllers.updateSingleProductController);
router.delete("/product/:productId/", product_controller_1.ProductControllers.deleteSingleProductController);
router.post("/product/bulk-delete/", product_controller_1.ProductControllers.deleteManyProductsController);
exports.productRoutes = router;
