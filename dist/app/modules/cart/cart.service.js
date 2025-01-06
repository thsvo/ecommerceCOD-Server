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
exports.cartServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paginateAndSort_1 = require("../../utils/paginateAndSort");
const cart_model_1 = require("./cart.model");
//Create a cart into database
const createCartService = (cartData) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, deviceId, sku } = cartData;
    const existingCart = yield cart_model_1.cartModel.findOne({
        $or: [
            { user, sku },
            { deviceId, sku },
        ],
    });
    if (existingCart) {
        throw new Error("This product is already in your cart.");
    }
    const result = yield cart_model_1.cartModel.create(cartData);
    return result;
});
// Get all cart with optional pagination
const getAllCartService = (page, limit, searchText, searchFields) => __awaiter(void 0, void 0, void 0, function* () {
    let results;
    if (page && limit) {
        const query = cart_model_1.cartModel.find().populate("product").populate("user");
        const result = yield (0, paginateAndSort_1.paginateAndSort)(query, page, limit, searchText, searchFields);
        return result;
    }
    else {
        results = yield cart_model_1.cartModel
            .find()
            .populate("product")
            .populate("user")
            .sort({ createdAt: -1 })
            .exec();
        return {
            results,
        };
    }
});
//Get single cart
const getSingleCartService = (cartId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof cartId === "string" ? new mongoose_1.default.Types.ObjectId(cartId) : cartId;
    const result = yield cart_model_1.cartModel
        .findById(queryId)
        .populate("product")
        .populate("user")
        .exec();
    if (!result) {
        throw new Error("Cart not found");
    }
    return result;
});
const getSingleCartByUserService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = mongoose_1.default.Types.ObjectId.isValid(userId)
        ? { $or: [{ user: userId }, { deviceId: userId }] }
        : { deviceId: userId };
    const result = yield cart_model_1.cartModel
        .find(query)
        .populate({
        path: "product",
        select: "name price sku variants mainImage slug",
        populate: {
            path: "variants.attributeCombination",
            model: "attributeOption",
            populate: {
                path: "attribute",
                model: "attribute",
                populate: {
                    path: "options",
                    model: "attributeOption",
                },
            },
        },
    })
        .populate({
        path: "user",
        select: "name email",
    })
        .exec();
    if (!result || result.length === 0) {
        throw new Error("Cart not found for this identifier");
    }
    const cartDetails = result.map((cartItem) => {
        var _a, _b, _c;
        const product = cartItem.product;
        let matchingVariant = null;
        if (product.sku === cartItem.sku) {
            if (((_a = product.variants) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                matchingVariant = product.variants[0];
            }
        }
        else {
            matchingVariant = (_b = product.variants) === null || _b === void 0 ? void 0 : _b.find((variant) => variant.sku === cartItem.sku);
        }
        return {
            _id: cartItem._id,
            user: cartItem.user,
            productId: product._id,
            slug: product.slug,
            productName: product.name,
            sku: cartItem.sku,
            price: cartItem.price,
            image: (_c = matchingVariant === null || matchingVariant === void 0 ? void 0 : matchingVariant.image) !== null && _c !== void 0 ? _c : product === null || product === void 0 ? void 0 : product.mainImage,
            quantity: cartItem.quantity,
            variant: matchingVariant || null,
        };
    });
    return cartDetails;
});
//Update single cart
const updateSingleCartService = (cartId, cartData) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof cartId === "string" ? new mongoose_1.default.Types.ObjectId(cartId) : cartId;
    const result = yield cart_model_1.cartModel
        .findByIdAndUpdate(queryId, { $set: cartData }, { new: true, runValidators: true })
        .exec();
    if (!result) {
        throw new Error("Cart not found");
    }
    return result;
});
//Delete single cart
const deleteSingleCartService = (cartId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof cartId === "string" ? new mongoose_1.default.Types.ObjectId(cartId) : cartId;
    const result = yield cart_model_1.cartModel.findByIdAndDelete(queryId).exec();
    if (!result) {
        throw new Error("Cart not found");
    }
    return result;
});
//Delete many cart
const deleteManyCartService = (cartIds) => __awaiter(void 0, void 0, void 0, function* () {
    const queryIds = cartIds.map((id) => {
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
    const result = yield cart_model_1.cartModel.deleteMany({ _id: { $in: queryIds } }).exec();
    return result;
});
exports.cartServices = {
    createCartService,
    getAllCartService,
    getSingleCartService,
    getSingleCartByUserService,
    updateSingleCartService,
    deleteSingleCartService,
    deleteManyCartService,
};
