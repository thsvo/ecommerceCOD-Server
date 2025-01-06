"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const upload_1 = require("../upload/upload");
const review_controller_1 = require("./review.controller");
const router = express_1.default.Router();
router.post("/review/", upload_1.uploadService.single("attachment"), review_controller_1.reviewControllers.createReviewController);
router.get("/review/", review_controller_1.reviewControllers.getAllReviewController);
router.get("/review/:reviewId/", review_controller_1.reviewControllers.getSingleReviewController);
router.get("/review/user/:userId/", review_controller_1.reviewControllers.getSingleReviewByUserController);
router.patch("/review/:reviewId/", upload_1.uploadService.single("attachment"), review_controller_1.reviewControllers.updateSingleReviewController);
router.delete("/review/:reviewId/", review_controller_1.reviewControllers.deleteSingleReviewController);
router.post("/review/bulk-delete/", review_controller_1.reviewControllers.deleteManyReviewsController);
exports.reviewRoutes = router;
