import express from "express";
import { uploadService } from "../upload/upload";
import { offerControllers } from "./offer.controller";

const router = express.Router();

router.post(
  "/offer/",
  uploadService.single("attachment"),
  offerControllers.createOfferController
);

router.get("/offer/", offerControllers.getAllOfferController);

router.get("/offer/:offerId/", offerControllers.getSingleOfferController);

router.patch(
  "/offer/:offerId/",
  uploadService.single("attachment"),
  offerControllers.updateSingleOfferController
);

router.delete("/offer/:offerId/", offerControllers.deleteSingleOfferController);

router.post("/offer/bulk-delete/", offerControllers.deleteManyOfferController);

export const offerRoutes = router;
