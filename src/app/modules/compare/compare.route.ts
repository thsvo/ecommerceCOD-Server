import express from "express";
import { compareControllers } from "./compare.controller";

const router = express.Router();

router.post("/compare/", compareControllers.createCompareController);

router.get("/compare/", compareControllers.getAllCompareController);

router.get(
  "/compare/:compareId/",
  compareControllers.getSingleCompareController
);

router.get(
  "/compare/user/:userId/",
  compareControllers.getSingleCompareBuyUserController
);

router.patch(
  "/compare/:compareId/",
  compareControllers.updateSingleCompareController
);

router.delete(
  "/compare/:compareId/",
  compareControllers.deleteSingleCompareController
);

router.post(
  "/compare/bulk-delete/",
  compareControllers.deleteManyCompareController
);

export const compareRoutes = router;
