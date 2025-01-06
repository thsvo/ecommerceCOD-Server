import express from "express";
import { CategoryControllers } from "./category.controller";
import { uploadService } from "../upload/upload";

const router = express.Router();

router.post(
  "/category/",
  uploadService.single("attachment"),
  CategoryControllers.createCategoryController
);

router.get("/category/", CategoryControllers.getAllCategoriesController);

router.get(
  "/category/:categoryId/",
  CategoryControllers.getSingleCategoryController
);

router.patch(
  "/category/:categoryId/",
  uploadService.single("attachment"),
  CategoryControllers.updateSingleCategoryController
);

router.delete(
  "/category/:categoryId/",
  CategoryControllers.deleteSingleCategoryController
);

router.post(
  "/category/bulk-delete/",
  CategoryControllers.deleteManyCategoriesController
);

export const categoryRoutes = router;
