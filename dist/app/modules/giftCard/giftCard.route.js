"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.giftCardRoutes = void 0;
const express_1 = __importDefault(require("express"));
const upload_1 = require("../upload/upload");
const giftCard_controller_1 = require("./giftCard.controller");
const router = express_1.default.Router();
router.post("/gift-card/", upload_1.uploadService.single("attachment"), giftCard_controller_1.giftCardControllers.createGiftCardController);
router.get("/gift-card/", giftCard_controller_1.giftCardControllers.getAllGiftCardController);
router.get("/gift-card/:giftCardId/", giftCard_controller_1.giftCardControllers.getSingleGiftCardController);
router.get("/gift-card/code/:giftCardCode/", giftCard_controller_1.giftCardControllers.getSingleCouponByCodeController);
router.patch("/gift-card/:giftCardId/", upload_1.uploadService.single("attachment"), giftCard_controller_1.giftCardControllers.updateSingleGiftCardController);
router.delete("/gift-card/:giftCardId/", giftCard_controller_1.giftCardControllers.deleteSingleGiftCardController);
router.post("/gift-card/bulk-delete/", giftCard_controller_1.giftCardControllers.deleteManyGiftCardController);
exports.giftCardRoutes = router;
