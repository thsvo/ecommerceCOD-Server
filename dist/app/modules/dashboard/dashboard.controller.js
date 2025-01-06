"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardControllers = void 0;
const dashboard_service_1 = require("./dashboard.service");
const getAdminDashboardController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dashboard_service_1.dashboardService.getAdminDashboardService();
        res.status(200).json({
            success: true,
            message: "Admin Dashboard Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getSingleUserDashboardController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield dashboard_service_1.dashboardService.getSingleUserDashboardService(userId);
        res.status(200).json({
            success: true,
            message: "User Dashboard Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.dashboardControllers = {
    getAdminDashboardController,
    getSingleUserDashboardController,
};
