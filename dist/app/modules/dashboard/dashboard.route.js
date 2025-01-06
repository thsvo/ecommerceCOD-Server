"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = void 0;
const express_1 = __importDefault(require("express"));
const dashboard_controller_1 = require("./dashboard.controller");
const router = express_1.default.Router();
router.get("/dashboard/admin/", dashboard_controller_1.dashboardControllers.getAdminDashboardController);
router.get("/dashboard/user/:userId", dashboard_controller_1.dashboardControllers.getSingleUserDashboardController);
exports.dashboardRoutes = router;
