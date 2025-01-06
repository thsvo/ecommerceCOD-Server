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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderServices = void 0;
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const mongoose_1 = __importDefault(require("mongoose"));
const paginateAndSort_1 = require("../../utils/paginateAndSort");
const order_model_1 = require("./order.model");
const config_1 = __importDefault(require("../../config"));
const coupon_model_1 = require("../coupon/coupon.model");
const giftCard_model_1 = require("../giftCard/giftCard.model");
const product_model_1 = require("../product/product.model");
const storeId = config_1.default.store_id;
const storePassword = config_1.default.store_pass;
const base_url = config_1.default.base_url;
const isLive = false;
//Create a order into database
const initiateOrderService = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(orderData.user)) {
        throw new Error("Invalid User ID format.");
    }
    if (orderData === null || orderData === void 0 ? void 0 : orderData.tranId) {
        const tranIdExists = yield order_model_1.orderModel.findOne({
            tranId: orderData.tranId,
        });
        if (tranIdExists) {
            throw new Error("Transaction ID already exists.");
        }
    }
    const orderCommonData = Object.assign(Object.assign({}, orderData), { paymentStatus: "PENDING", deliveryStatus: "pending" });
    if (orderData.paymentType === "ssl") {
        const tran_id = `tran_${Date.now()}`;
        const successUrl = `${base_url}/api/v1/order/ssl/success/${tran_id}/`;
        const failUrl = `${base_url}/api/v1/order/ssl/fail/`;
        const cancelUrl = `${base_url}/api/v1/order/ssl/cancel/`;
        const paymentData = {
            total_amount: Number(orderData === null || orderData === void 0 ? void 0 : orderData.grandTotal),
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
        const sslcommerz = new sslcommerz_lts_1.default(storeId, storePassword, isLive);
        try {
            const response = yield sslcommerz.init(paymentData);
            if (response.status === "SUCCESS" && response.GatewayPageURL) {
                yield order_model_1.orderModel.create(Object.assign(Object.assign({}, orderCommonData), { tranId: tran_id, paymentMethod: "SSLCommerz" }));
                return {
                    gatewayUrl: response.GatewayPageURL,
                    tran_id: tran_id,
                };
            }
            else {
                throw new Error(`Payment initiation failed: ${response.failedreason || "Unknown error"}`);
            }
        }
        catch (error) {
            throw new Error(`Payment initiation error: ${error.message}`);
        }
    }
    else if (orderData.paymentType === "manual" ||
        orderData.paymentType === "cod") {
        yield order_model_1.orderModel.create(Object.assign({}, orderCommonData));
        return {};
    }
    else {
        throw new Error("Unsupported payment type");
    }
});
const handleSSLOrderSuccessService = (tranId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.orderModel.findOne({ tranId });
    if (!order) {
        throw new Error("Order not found");
    }
    yield order_model_1.orderModel.findOneAndUpdate({ tranId }, { paymentStatus: "SUCCESS" });
    const productDetails = order.products.map((item) => ({
        productId: typeof item === "object" && item.product ? item.product : item,
        quantity: item.quantity,
        sku: item.sku,
    }));
    for (const { productId, quantity, sku } of productDetails) {
        const product = yield product_model_1.productModel.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }
        if (product.isVariant && product.variants) {
            const variant = product.variants.find((v) => v.sku === sku);
            if (variant) {
                yield product_model_1.productModel.findOneAndUpdate({ _id: productId, "variants.sku": sku }, { $inc: { "variants.$.stock": -quantity } });
                const totalVariantStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
                yield product_model_1.productModel.findByIdAndUpdate(productId, {
                    $set: { stock: totalVariantStock },
                });
            }
            else {
                throw new Error(`Variant with SKU ${sku} not found`);
            }
        }
        else {
            yield product_model_1.productModel.findByIdAndUpdate(productId, {
                $inc: { stock: -quantity },
            });
        }
    }
    if (order === null || order === void 0 ? void 0 : order.code) {
        yield coupon_model_1.couponModel.findOneAndUpdate({ code: order.code }, { $inc: { count: -1 } });
        yield giftCard_model_1.giftCardModel.findOneAndUpdate({ code: order.code }, { $inc: { count: -1 } });
    }
    return order;
});
// Get all orders with optional pagination
const getAllOrderService = (page, limit, searchText, searchFields) => __awaiter(void 0, void 0, void 0, function* () {
    let results;
    if (page && limit) {
        const query = order_model_1.orderModel.find().populate("products.product");
        const result = yield (0, paginateAndSort_1.paginateAndSort)(query, page, limit, searchText, searchFields);
        return result;
    }
    else {
        results = yield order_model_1.orderModel
            .find()
            .sort({ createdAt: -1 })
            .populate("products.product")
            .exec();
        return {
            results,
        };
    }
});
const getAllOrderByUserService = (userId, page, limit, searchText, searchFields) => __awaiter(void 0, void 0, void 0, function* () {
    const query = order_model_1.orderModel.find({ user: userId }).populate("products.product");
    if (page && limit) {
        const results = yield (0, paginateAndSort_1.paginateAndSort)(query, page, limit, searchText, searchFields);
        return results;
    }
    else {
        const results = yield query
            .sort({ createdAt: -1 })
            .populate("products.product")
            .exec();
        return {
            results,
        };
    }
});
//Get single order
const getSingleOrderService = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof orderId === "string"
        ? new mongoose_1.default.Types.ObjectId(orderId)
        : orderId;
    // Find the order by ID
    const result = yield order_model_1.orderModel
        .findById(queryId)
        .populate("products.product")
        .exec();
    if (!result) {
        throw new Error("order not found");
    }
    return result;
});
//Update single order
const updateSingleOrderService = (orderId, orderData) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof orderId === "string"
        ? new mongoose_1.default.Types.ObjectId(orderId)
        : orderId;
    const order = yield order_model_1.orderModel.findById(orderId);
    if (!order) {
        throw new Error("Order not found");
    }
    if (order.paymentStatus !== "SUCCESS" &&
        orderData.paymentStatus === "SUCCESS") {
        const productDetails = order.products.map((item) => ({
            productId: typeof item === "object" && item.product ? item.product : item,
            quantity: item.quantity,
            sku: item.sku,
        }));
        for (const { productId, quantity, sku } of productDetails) {
            const product = yield product_model_1.productModel.findById(productId);
            if (!product) {
                throw new Error("Product not found");
            }
            if (product.isVariant && product.variants) {
                const variant = product.variants.find((v) => v.sku === sku);
                if (variant) {
                    yield product_model_1.productModel.findOneAndUpdate({ _id: productId, "variants.sku": sku }, { $inc: { "variants.$.stock": -quantity } });
                    const totalVariantStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
                    yield product_model_1.productModel.findByIdAndUpdate(productId, {
                        $set: { stock: totalVariantStock },
                    });
                }
                else {
                    throw new Error(`Variant with SKU ${sku} not found`);
                }
            }
            else {
                yield product_model_1.productModel.findByIdAndUpdate(productId, {
                    $inc: { stock: -quantity },
                });
            }
        }
        if (order.code) {
            yield coupon_model_1.couponModel.findOneAndUpdate({ code: order.code }, { $inc: { count: -1 } });
            yield giftCard_model_1.giftCardModel.findOneAndUpdate({ code: order.code }, { $inc: { count: -1 } });
        }
    }
    // Update the order data
    const result = yield order_model_1.orderModel
        .findByIdAndUpdate(queryId, { $set: orderData }, { new: true, runValidators: true })
        .exec();
    if (!result) {
        throw new Error("Order not found during update");
    }
    return result;
});
//Delete single order
const deleteSingleOrderService = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof orderId === "string"
        ? new mongoose_1.default.Types.ObjectId(orderId)
        : orderId;
    const result = yield order_model_1.orderModel.findByIdAndDelete(queryId).exec();
    if (!result) {
        throw new Error("order not found");
    }
    return result;
});
//Delete many order
const deleteManyOrdersService = (orderIds) => __awaiter(void 0, void 0, void 0, function* () {
    const queryIds = orderIds.map((id) => {
        if (typeof id === "string" && mongoose_1.default.Types.ObjectId.isValid(id)) {
            return new mongoose_1.default.Types.ObjectId(id);
        }
        else if (typeof id === "number") {
            return id;
        }
        else {
            throw new Error(`Invalid ID format: ${id}`);
        }
    });
    const result = yield order_model_1.orderModel.deleteMany({ _id: { $in: queryIds } }).exec();
    return result;
});
exports.orderServices = {
    initiateOrderService,
    handleSSLOrderSuccessService,
    getAllOrderService,
    getAllOrderByUserService,
    getSingleOrderService,
    updateSingleOrderService,
    deleteSingleOrderService,
    deleteManyOrdersService,
};
