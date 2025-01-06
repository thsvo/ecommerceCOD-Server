import { brandModel } from "../brand/brand.model";
import { cartModel } from "../cart/cart.model";
import { categoryModel } from "../category/category.model";
import { couponModel } from "../coupon/coupon.model";
import { giftCardModel } from "../giftCard/giftCard.model";
import { orderModel } from "../order/order.model";
import { productModel } from "../product/product.model";
import { sliderModel } from "../slider/slider.model";
import { userModel } from "../user/user.model";
import { wishlistModel } from "../wishlist/wishlist.model";

const getAdminDashboardService = async () => {
  const brandCount = await brandModel.countDocuments().exec();
  const categoryCount = await categoryModel.countDocuments().exec();
  const productCount = await productModel.countDocuments().exec();
  const userCount = await userModel.countDocuments().exec();
  const orderCount = await orderModel.countDocuments().exec();
  const couponCount = await couponModel.countDocuments().exec();
  const giftCardCount = await giftCardModel.countDocuments().exec();
  const sliderCount = await sliderModel.countDocuments().exec();
  const wishlistCount = await wishlistModel.countDocuments().exec();
  const cartCount = await cartModel.countDocuments().exec();

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
};

const getSingleUserDashboardService = async (userId: string) => {
  const orderCount = await orderModel.countDocuments({ user: userId }).exec();
  const couponCount = await couponModel.countDocuments({ user: userId }).exec();
  const giftCardCount = await giftCardModel
    .countDocuments({ user: userId })
    .exec();
  const wishlistCount = await wishlistModel
    .countDocuments({ user: userId })
    .exec();
  const cartCount = await cartModel.countDocuments({ user: userId }).exec();

  const result = {
    orders: orderCount,
    coupons: couponCount,
    giftCards: giftCardCount,
    wishlists: wishlistCount,
    carts: cartCount,
  };

  return result;
};

export const dashboardService = {
  getAdminDashboardService,
  getSingleUserDashboardService,
};
