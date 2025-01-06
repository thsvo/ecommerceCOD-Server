import express from "express";
import { uploadService } from "../upload/upload";
import { reviewControllers } from "./review.controller";

const router = express.Router();

router.post(
  "/review/",
  uploadService.single("attachment"),
  reviewControllers.createReviewController
);

router.get("/review/", reviewControllers.getAllReviewController);

router.get("/review/:reviewId/", reviewControllers.getSingleReviewController);

router.get(
  "/review/user/:userId/",
  reviewControllers.getSingleReviewByUserController
);

router.patch(
  "/review/:reviewId/",
  uploadService.single("attachment"),
  reviewControllers.updateSingleReviewController
);

router.delete(
  "/review/:reviewId/",
  reviewControllers.deleteSingleReviewController
);

router.post(
  "/review/bulk-delete/",
  reviewControllers.deleteManyReviewsController
);

export const reviewRoutes = router;
