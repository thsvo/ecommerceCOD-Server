"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRoutes = void 0;
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("./cart.controller");
const router = express_1.default.Router();
router.post("/cart/", cart_controller_1.cartControllers.createCartController);
router.get("/cart/", cart_controller_1.cartControllers.getAllCartController);
router.get("/cart/:cartId/", cart_controller_1.cartControllers.getSingleCartController);
router.get("/cart/user/:userId/", cart_controller_1.cartControllers.getSingleCartBuyUserController);
router.patch("/cart/:cartId/", cart_controller_1.cartControllers.updateSingleCartController);
router.delete("/cart/:cartId/", cart_controller_1.cartControllers.deleteSingleCartController);
router.post("/cart/bulk-delete/", cart_controller_1.cartControllers.deleteManyCartController);
exports.cartRoutes = router;
