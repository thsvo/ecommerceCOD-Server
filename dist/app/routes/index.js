"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_route_1 = require("../modules/upload/upload.route");
const user_route_1 = require("../modules/user/user.route");
const attribute_route_1 = require("../modules/attribute/attribute.route");
const attributeOption_route_1 = require("../modules/attributeOption/attributeOption.route");
const brand_route_1 = require("../modules/brand/brand.route");
const category_route_1 = require("../modules/category/category.route");
const product_route_1 = require("../modules/product/product.route");
const giftCard_route_1 = require("../modules/giftCard/giftCard.route");
const coupon_route_1 = require("../modules/coupon/coupon.route");
const review_route_1 = require("../modules/review/review.route");
const globalSetting_route_1 = require("../modules/globalSetting/globalSetting.route");
const cart_route_1 = require("../modules/cart/cart.route");
const wishlist_route_1 = require("../modules/wishlist/wishlist.route");
const offer_route_1 = require("../modules/offer/offer.route");
const newsletter_route_1 = require("../modules/newsletter/newsletter.route");
const order_route_1 = require("../modules/order/order.route");
const slider_route_1 = require("../modules/slider/slider.route");
const dashboard_route_1 = require("../modules/dashboard/dashboard.route");
const compare_route_1 = require("../modules/compare/compare.route");
const router = (0, express_1.Router)();
const routes = [
    upload_route_1.uploadRoutes,
    user_route_1.userRoutes,
    attribute_route_1.attributeRoutes,
    attributeOption_route_1.attributeOptionRoutes,
    brand_route_1.brandRoutes,
    category_route_1.categoryRoutes,
    product_route_1.productRoutes,
    giftCard_route_1.giftCardRoutes,
    coupon_route_1.couponRoutes,
    review_route_1.reviewRoutes,
    cart_route_1.cartRoutes,
    wishlist_route_1.wishlistRoutes,
    offer_route_1.offerRoutes,
    newsletter_route_1.newsletterRoutes,
    order_route_1.orderRoutes,
    slider_route_1.sliderRoutes,
    compare_route_1.compareRoutes,
    dashboard_route_1.dashboardRoutes,
    globalSetting_route_1.globalSettingRoutes,
];
routes.forEach((route) => {
    router.use(route);
});
exports.default = router;
