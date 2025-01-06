"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponRoutes = void 0;
const express_1 = __importDefault(require("express"));
const upload_1 = require("../upload/upload");
const coupon_controller_1 = require("./coupon.controller");
const router = express_1.default.Router();
router.post("/coupon/", upload_1.uploadService.single("attachment"), coupon_controller_1.couponControllers.createCouponController);
router.get("/coupon/", coupon_controller_1.couponControllers.getAllCouponController);
router.get("/coupon/:couponId/", coupon_controller_1.couponControllers.getSingleCouponController);
router.get("/coupon/code/:couponCode/", coupon_controller_1.couponControllers.getSingleCouponByCodeController);
router.patch("/coupon/:couponId/", upload_1.uploadService.single("attachment"), coupon_controller_1.couponControllers.updateSingleCouponController);
router.delete("/coupon/:couponId/", coupon_controller_1.couponControllers.deleteSingleCouponController);
router.post("/coupon/bulk-delete/", coupon_controller_1.couponControllers.deleteManyCouponController);
exports.couponRoutes = router;
