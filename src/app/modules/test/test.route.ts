import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { testValidationSchemas } from "./test.validation";
import { testControllers } from "./test.controller";
import { uploadService } from "../upload/upload";

const router = express.Router();

router.post(
  "/test/",
  uploadService.single("attachment"),
  validateRequest(testValidationSchemas.createTestSchema),
  testControllers.createTestController
);

router.get("/test/", testControllers.getAllTestController);

router.get("/test/:testId/", testControllers.getSingleTestController);

router.patch(
  "/test/:testId/",
  uploadService.single("attachment"),
  testControllers.updateSingleTestController
);

router.delete("/test/:testId/", testControllers.deleteSingleTestController);

router.post("/test/bulk-delete/", testControllers.deleteManyTestsController);

export const testRoutes = router;
