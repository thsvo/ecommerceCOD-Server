"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attributeOptionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const upload_1 = require("../upload/upload");
const attributeOption_controller_1 = require("./attributeOption.controller");
const router = express_1.default.Router();
router.post("/attribute-option/", upload_1.uploadService.single("attachment"), attributeOption_controller_1.attributeOptionControllers.createAttributeOptionController);
router.get("/attribute-option/", attributeOption_controller_1.attributeOptionControllers.getAllAttributeOptionController);
router.get("/attribute-option/:attributeOptionId/", attributeOption_controller_1.attributeOptionControllers.getSingleAttributeOptionController);
router.patch("/attribute-option/:attributeOptionId/", upload_1.uploadService.single("attachment"), attributeOption_controller_1.attributeOptionControllers.updateSingleAttributeOptionController);
router.delete("/attribute-option/:attributeOptionId/", attributeOption_controller_1.attributeOptionControllers.deleteSingleAttributeOptionController);
router.post("/attribute-option/bulk-delete/", attributeOption_controller_1.attributeOptionControllers.deleteManyAttributeOptionsController);
exports.attributeOptionRoutes = router;
