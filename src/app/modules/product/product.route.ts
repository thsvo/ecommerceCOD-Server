import express from "express";
import { uploadService } from "../upload/upload";
import { ProductControllers } from "./product.controller";

const router = express.Router();

router.post(
  "/product/",
  uploadService.any(),
  ProductControllers.createProductController
);

router.get("/product/", ProductControllers.getAllProductController);

router.get(
  "/product/:productId/",
  ProductControllers.getSingleProductController
);

router.get(
  "/product/sku/:sku/",
  ProductControllers.getSingleProductBySkuController
);

router.get(
  "/product/slug/:productSlug/",
  ProductControllers.getSingleProductBySlugController
);

router.patch(
  "/product/:productId/",
  uploadService.single("mainImage"),
  ProductControllers.updateSingleProductController
);

router.delete(
  "/product/:productId/",
  ProductControllers.deleteSingleProductController
);

router.post(
  "/product/bulk-delete/",
  ProductControllers.deleteManyProductsController
);

export const productRoutes = router;
