"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attributeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const attribute_controller_1 = require("./attribute.controller");
const upload_1 = require("../upload/upload");
const router = express_1.default.Router();
router.post("/attribute/", upload_1.uploadService.none(), attribute_controller_1.attributeControllers.createAttributeController);
router.get("/attribute/", attribute_controller_1.attributeControllers.getAllAttributeController);
router.get("/attribute/:attributeId/", attribute_controller_1.attributeControllers.getSingleAttributeController);
router.patch("/attribute/:attributeId/", upload_1.uploadService.none(), attribute_controller_1.attributeControllers.updateSingleAttributeController);
router.delete("/attribute/:attributeId/", attribute_controller_1.attributeControllers.deleteSingleAttributeController);
router.post("/attribute/bulk-delete/", attribute_controller_1.attributeControllers.deleteManyAttributesController);
exports.attributeRoutes = router;
