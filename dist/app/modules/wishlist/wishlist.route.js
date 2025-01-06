"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistRoutes = void 0;
const express_1 = __importDefault(require("express"));
const wishlist_controller_1 = require("./wishlist.controller");
const router = express_1.default.Router();
router.post("/wishlist/", wishlist_controller_1.wishlistControllers.createWishlistController);
router.get("/wishlist/", wishlist_controller_1.wishlistControllers.getAllWishlistController);
router.get("/wishlist/:wishlistId/", wishlist_controller_1.wishlistControllers.getSingleWishlistController);
router.get("/wishlist/user/:userId/", wishlist_controller_1.wishlistControllers.getSingleWishlistBuyUserController);
router.patch("/wishlist/:wishlistId/", wishlist_controller_1.wishlistControllers.updateSingleWishlistController);
router.delete("/wishlist/:wishlistId/", wishlist_controller_1.wishlistControllers.deleteSingleWishlistController);
router.post("/wishlist/bulk-delete/", wishlist_controller_1.wishlistControllers.deleteManyWishlistController);
exports.wishlistRoutes = router;
