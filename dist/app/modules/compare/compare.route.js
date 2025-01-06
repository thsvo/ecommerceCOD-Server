"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareRoutes = void 0;
const express_1 = __importDefault(require("express"));
const compare_controller_1 = require("./compare.controller");
const router = express_1.default.Router();
router.post("/compare/", compare_controller_1.compareControllers.createCompareController);
router.get("/compare/", compare_controller_1.compareControllers.getAllCompareController);
router.get("/compare/:compareId/", compare_controller_1.compareControllers.getSingleCompareController);
router.get("/compare/user/:userId/", compare_controller_1.compareControllers.getSingleCompareBuyUserController);
router.patch("/compare/:compareId/", compare_controller_1.compareControllers.updateSingleCompareController);
router.delete("/compare/:compareId/", compare_controller_1.compareControllers.deleteSingleCompareController);
router.post("/compare/bulk-delete/", compare_controller_1.compareControllers.deleteManyCompareController);
exports.compareRoutes = router;
