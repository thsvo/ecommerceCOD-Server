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
exports.dashboardService = void 0;
const brand_model_1 = require("../brand/brand.model");
const cart_model_1 = require("../cart/cart.model");
const category_model_1 = require("../category/category.model");
const coupon_model_1 = require("../coupon/coupon.model");
const giftCard_model_1 = require("../giftCard/giftCard.model");
const order_model_1 = require("../order/order.model");
const product_model_1 = require("../product/product.model");
const slider_model_1 = require("../slider/slider.model");
const user_model_1 = require("../user/user.model");
const wishlist_model_1 = require("../wishlist/wishlist.model");
const getAdminDashboardService = () => __awaiter(void 0, void 0, void 0, function* () {
    const brandCount = yield brand_model_1.brandModel.countDocuments().exec();
    const categoryCount = yield category_model_1.categoryModel.countDocuments().exec();
    const productCount = yield product_model_1.productModel.countDocuments().exec();
    const userCount = yield user_model_1.userModel.countDocuments().exec();
    const orderCount = yield order_model_1.orderModel.countDocuments().exec();
    const couponCount = yield coupon_model_1.couponModel.countDocuments().exec();
    const giftCardCount = yield giftCard_model_1.giftCardModel.countDocuments().exec();
    const sliderCount = yield slider_model_1.sliderModel.countDocuments().exec();
    const wishlistCount = yield wishlist_model_1.wishlistModel.countDocuments().exec();
    const cartCount = yield cart_model_1.cartModel.countDocuments().exec();
    const result = {
        brands: brandCount,
        categories: categoryCount,
        products: productCount,
        users: userCount,
        orders: orderCount,
        coupons: couponCount,
        giftCards: giftCardCount,
        sliders: sliderCount,
        wishlists: wishlistCount,
        carts: cartCount,
    };
    return result;
});
const getSingleUserDashboardService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const orderCount = yield order_model_1.orderModel.countDocuments({ user: userId }).exec();
    const couponCount = yield coupon_model_1.couponModel.countDocuments({ user: userId }).exec();
    const giftCardCount = yield giftCard_model_1.giftCardModel
        .countDocuments({ user: userId })
        .exec();
    const wishlistCount = yield wishlist_model_1.wishlistModel
        .countDocuments({ user: userId })
        .exec();
    const cartCount = yield cart_model_1.cartModel.countDocuments({ user: userId }).exec();
    const result = {
        orders: orderCount,
        coupons: couponCount,
        giftCards: giftCardCount,
        wishlists: wishlistCount,
        carts: cartCount,
    };
    return result;
});
exports.dashboardService = {
    getAdminDashboardService,
    getSingleUserDashboardService,
};
