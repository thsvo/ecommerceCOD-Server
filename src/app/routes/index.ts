import { Router } from "express";

import { uploadRoutes } from "../modules/upload/upload.route";
import { userRoutes } from "../modules/user/user.route";
import { attributeRoutes } from "../modules/attribute/attribute.route";
import { attributeOptionRoutes } from "../modules/attributeOption/attributeOption.route";
import { brandRoutes } from "../modules/brand/brand.route";
import { categoryRoutes } from "../modules/category/category.route";
import { productRoutes } from "../modules/product/product.route";
import { giftCardRoutes } from "../modules/giftCard/giftCard.route";
import { couponRoutes } from "../modules/coupon/coupon.route";
import { reviewRoutes } from "../modules/review/review.route";
import { globalSettingRoutes } from "../modules/globalSetting/globalSetting.route";
import { cartRoutes } from "../modules/cart/cart.route";
import { wishlistRoutes } from "../modules/wishlist/wishlist.route";
import { offerRoutes } from "../modules/offer/offer.route";
import { newsletterRoutes } from "../modules/newsletter/newsletter.route";
import { orderRoutes } from "../modules/order/order.route";
import { sliderRoutes } from "../modules/slider/slider.route";
import { dashboardRoutes } from "../modules/dashboard/dashboard.route";
import { compareRoutes } from "../modules/compare/compare.route";

const router = Router();

const routes = [
  uploadRoutes,
  userRoutes,
  attributeRoutes,
  attributeOptionRoutes,
  brandRoutes,
  categoryRoutes,
  productRoutes,
  giftCardRoutes,
  couponRoutes,
  reviewRoutes,
  cartRoutes,
  wishlistRoutes,
  offerRoutes,
  newsletterRoutes,
  orderRoutes,
  sliderRoutes,
  compareRoutes,
  dashboardRoutes,
  globalSettingRoutes,
];

routes.forEach((route) => {
  router.use(route);
});

export default router;
