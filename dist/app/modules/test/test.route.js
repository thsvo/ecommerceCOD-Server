"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const test_validation_1 = require("./test.validation");
const test_controller_1 = require("./test.controller");
const upload_1 = require("../upload/upload");
const router = express_1.default.Router();
router.post("/test/", upload_1.uploadService.single("attachment"), (0, validateRequest_1.validateRequest)(test_validation_1.testValidationSchemas.createTestSchema), test_controller_1.testControllers.createTestController);
router.get("/test/", test_controller_1.testControllers.getAllTestController);
router.get("/test/:testId/", test_controller_1.testControllers.getSingleTestController);
router.patch("/test/:testId/", upload_1.uploadService.single("attachment"), test_controller_1.testControllers.updateSingleTestController);
router.delete("/test/:testId/", test_controller_1.testControllers.deleteSingleTestController);
router.post("/test/bulk-delete/", test_controller_1.testControllers.deleteManyTestsController);
exports.testRoutes = router;
