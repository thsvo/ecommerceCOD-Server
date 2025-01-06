import SSLCommerz from "sslcommerz-lts";
import mongoose from "mongoose";
import { paginateAndSort } from "../../utils/paginateAndSort";
import { IOrder } from "./order.interface";
import { orderModel } from "./order.model";
import config from "../../config";
import { cartModel } from "../cart/cart.model";
import { couponModel } from "../coupon/coupon.model";
import { giftCardModel } from "../giftCard/giftCard.model";
import { productModel } from "../product/product.model";

const storeId = config.store_id;
const storePassword = config.store_pass;
const base_url = config.base_url;
const isLive = false;

//Create a order into database
const initiateOrderService = async (
  orderData: IOrder
): Promise<{ gatewayUrl?: string; tran_id?: string }> => {
  if (!mongoose.Types.ObjectId.isValid(orderData.user)) {
    throw new Error("Invalid User ID format.");
  }

  if (orderData?.tranId) {
    const tranIdExists = await orderModel.findOne({
      tranId: orderData.tranId,
    });
    if (tranIdExists) {
      throw new Error("Transaction ID already exists.");
    }
  }

  const orderCommonData = {
    ...orderData,
    paymentStatus: "PENDING",
    deliveryStatus: "pending",
  };

  if (orderData.paymentType === "ssl") {
    const tran_id = `tran_${Date.now()}`;
    const successUrl = `${base_url}/api/v1/order/ssl/success/${tran_id}/`;
    const failUrl = `${base_url}/api/v1/order/ssl/fail/`;
    const cancelUrl = `${base_url}/api/v1/order/ssl/cancel/`;

    const paymentData = {
      total_amount: Number(orderData?.grandTotal),
      currency: "BDT",
      tran_id: tran_id,
      success_url: successUrl,
      fail_url: failUrl,
      cancel_url: cancelUrl,
      cus_name: orderData.name,
      cus_email: orderData.email,
      product_name: "Order Payment",
      shipping_method: "Courier",
      ship_name: "Test",
      product_category: "General",
      ship_add1: "add1",
      ship_city: "Dhaka",
      ship_postcode: "1207",
      ship_country: "Bangladesh",
      product_profile: "general",
      cus_add1: orderData.address,
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      cus_phone: orderData.number,
    };

    const sslcommerz = new SSLCommerz(storeId, storePassword, isLive);

    try {
      const response = await sslcommerz.init(paymentData);

      if (response.status === "SUCCESS" && response.GatewayPageURL) {
        await orderModel.create({
          ...orderCommonData,
          tranId: tran_id,
          paymentMethod: "SSLCommerz",
        });

        return {
          gatewayUrl: response.GatewayPageURL,
          tran_id: tran_id,
        };
      } else {
        throw new Error(
          `Payment initiation failed: ${
            response.failedreason || "Unknown error"
          }`
        );
      }
    } catch (error: any) {
      throw new Error(`Payment initiation error: ${error.message}`);
    }
  } else if (
    orderData.paymentType === "manual" ||
    orderData.paymentType === "cod"
  ) {
    await orderModel.create({
      ...orderCommonData,
    });

    return {};
  } else {
    throw new Error("Unsupported payment type");
  }
};

const handleSSLOrderSuccessService = async (
  tranId: string
): Promise<IOrder> => {
  const order = await orderModel.findOne({ tranId });

  if (!order) {
    throw new Error("Order not found");
  }

  await orderModel.findOneAndUpdate({ tranId }, { paymentStatus: "SUCCESS" });

  const productDetails = order.products.map((item) => ({
    productId: typeof item === "object" && item.product ? item.product : item,
    quantity: item.quantity,
    sku: item.sku,
  }));

  for (const { productId, quantity, sku } of productDetails) {
    const product = await productModel.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.isVariant && product.variants) {
      const variant = product.variants.find((v) => v.sku === sku);

      if (variant) {
        await productModel.findOneAndUpdate(
          { _id: productId, "variants.sku": sku },
          { $inc: { "variants.$.stock": -quantity } }
        );

        const totalVariantStock = product.variants.reduce(
          (acc, v) => acc + v.stock,
          0
        );

        await productModel.findByIdAndUpdate(productId, {
          $set: { stock: totalVariantStock },
        });
      } else {
        throw new Error(`Variant with SKU ${sku} not found`);
      }
    } else {
      await productModel.findByIdAndUpdate(productId, {
        $inc: { stock: -quantity },
      });
    }
  }

  if (order?.code) {
    await couponModel.findOneAndUpdate(
      { code: order.code },
      { $inc: { count: -1 } }
    );
    await giftCardModel.findOneAndUpdate(
      { code: order.code },
      { $inc: { count: -1 } }
    );
  }

  return order;
};

// Get all orders with optional pagination
const getAllOrderService = async (
  page?: number,
  limit?: number,
  searchText?: string,
  searchFields?: string[]
) => {
  let results;

  if (page && limit) {
    const query = orderModel.find().populate("products.product");

    const result = await paginateAndSort(
      query,
      page,
      limit,
      searchText,
      searchFields
    );

    return result;
  } else {
    results = await orderModel
      .find()
      .sort({ createdAt: -1 })
      .populate("products.product")
      .exec();

    return {
      results,
    };
  }
};

const getAllOrderByUserService = async (
  userId: string,
  page?: number,
  limit?: number,
  searchText?: string,
  searchFields?: string[]
) => {
  const query = orderModel.find({ user: userId }).populate("products.product");

  if (page && limit) {
    const results = await paginateAndSort(
      query,
      page,
      limit,
      searchText,
      searchFields
    );

    return results;
  } else {
    const results = await query
      .sort({ createdAt: -1 })
      .populate("products.product")
      .exec();

    return {
      results,
    };
  }
};

//Get single order
const getSingleOrderService = async (orderId: number | string) => {
  const queryId =
    typeof orderId === "string"
      ? new mongoose.Types.ObjectId(orderId)
      : orderId;

  // Find the order by ID
  const result = await orderModel
    .findById(queryId)
    .populate("products.product")
    .exec();
  if (!result) {
    throw new Error("order not found");
  }

  return result;
};

//Update single order
const updateSingleOrderService = async (
  orderId: string | number,
  orderData: IOrder
) => {
  const queryId =
    typeof orderId === "string"
      ? new mongoose.Types.ObjectId(orderId)
      : orderId;

  const order = await orderModel.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (
    order.paymentStatus !== "SUCCESS" &&
    orderData.paymentStatus === "SUCCESS"
  ) {
    const productDetails = order.products.map((item) => ({
      productId: typeof item === "object" && item.product ? item.product : item,
      quantity: item.quantity,
      sku: item.sku,
    }));

    for (const { productId, quantity, sku } of productDetails) {
      const product = await productModel.findById(productId);

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.isVariant && product.variants) {
        const variant = product.variants.find((v) => v.sku === sku);

        if (variant) {
          await productModel.findOneAndUpdate(
            { _id: productId, "variants.sku": sku },
            { $inc: { "variants.$.stock": -quantity } }
          );

          const totalVariantStock = product.variants.reduce(
            (acc, v) => acc + v.stock,
            0
          );

          await productModel.findByIdAndUpdate(productId, {
            $set: { stock: totalVariantStock },
          });
        } else {
          throw new Error(`Variant with SKU ${sku} not found`);
        }
      } else {
        await productModel.findByIdAndUpdate(productId, {
          $inc: { stock: -quantity },
        });
      }
    }

    if (order.code) {
      await couponModel.findOneAndUpdate(
        { code: order.code },
        { $inc: { count: -1 } }
      );

      await giftCardModel.findOneAndUpdate(
        { code: order.code },
        { $inc: { count: -1 } }
      );
    }
  }

  // Update the order data
  const result = await orderModel
    .findByIdAndUpdate(
      queryId,
      { $set: orderData },
      { new: true, runValidators: true }
    )
    .exec();

  if (!result) {
    throw new Error("Order not found during update");
  }

  return result;
};

//Delete single order
const deleteSingleOrderService = async (orderId: string | number) => {
  const queryId =
    typeof orderId === "string"
      ? new mongoose.Types.ObjectId(orderId)
      : orderId;

  const result = await orderModel.findByIdAndDelete(queryId).exec();

  if (!result) {
    throw new Error("order not found");
  }

  return result;
};

//Delete many order
const deleteManyOrdersService = async (orderIds: (string | number)[]) => {
  const queryIds = orderIds.map((id) => {
    if (typeof id === "string" && mongoose.Types.ObjectId.isValid(id)) {
      return new mongoose.Types.ObjectId(id);
    } else if (typeof id === "number") {
      return id;
    } else {
      throw new Error(`Invalid ID format: ${id}`);
    }
  });

  const result = await orderModel.deleteMany({ _id: { $in: queryIds } }).exec();

  return result;
};

export const orderServices = {
  initiateOrderService,
  handleSSLOrderSuccessService,
  getAllOrderService,
  getAllOrderByUserService,
  getSingleOrderService,
  updateSingleOrderService,
  deleteSingleOrderService,
  deleteManyOrdersService,
};
