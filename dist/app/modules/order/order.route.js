"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const upload_1 = require("../upload/upload");
const order_controller_1 = require("./order.controller");
const router = express_1.default.Router();
router.post("/order/initiate/", upload_1.uploadService.none(), order_controller_1.orderControllers.initiateOrderController);
router.post("/order/ssl/success/:tranId/", order_controller_1.orderControllers.sslOrderSuccessController);
router.get("/order/", order_controller_1.orderControllers.getAllOrderController);
router.get("/order/user/:userId/", order_controller_1.orderControllers.getAllOrderByUserController);
router.get("/order/:orderId/", order_controller_1.orderControllers.getSingleOrderController);
router.patch("/order/:orderId/", upload_1.uploadService.none(), order_controller_1.orderControllers.updateSingleOrderController);
router.delete("/order/:orderId/", order_controller_1.orderControllers.deleteSingleOrderController);
router.post("/order/bulk-delete/", order_controller_1.orderControllers.deleteManyOrdersController);
exports.orderRoutes = router;
