"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.offerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const upload_1 = require("../upload/upload");
const offer_controller_1 = require("./offer.controller");
const router = express_1.default.Router();
router.post("/offer/", upload_1.uploadService.single("attachment"), offer_controller_1.offerControllers.createOfferController);
router.get("/offer/", offer_controller_1.offerControllers.getAllOfferController);
router.get("/offer/:offerId/", offer_controller_1.offerControllers.getSingleOfferController);
router.patch("/offer/:offerId/", upload_1.uploadService.single("attachment"), offer_controller_1.offerControllers.updateSingleOfferController);
router.delete("/offer/:offerId/", offer_controller_1.offerControllers.deleteSingleOfferController);
router.post("/offer/bulk-delete/", offer_controller_1.offerControllers.deleteManyOfferController);
exports.offerRoutes = router;
