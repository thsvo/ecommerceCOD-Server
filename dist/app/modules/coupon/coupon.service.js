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
exports.couponServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paginateAndSort_1 = require("../../utils/paginateAndSort");
const formatResultImage_1 = require("../../utils/formatResultImage");
const coupon_model_1 = require("./coupon.model");
const global_interface_1 = require("../../interface/global/global.interface");
const moment_1 = __importDefault(require("moment"));
const node_cron_1 = __importDefault(require("node-cron"));
//Create a coupon into database
const createCouponService = (couponData, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const dataToSave = Object.assign(Object.assign({}, couponData), { filePath });
    const result = yield coupon_model_1.couponModel.create(dataToSave);
    return result;
});
// Get all coupon with optional pagination
const getAllCouponService = (page, limit, searchText, searchFields) => __awaiter(void 0, void 0, void 0, function* () {
    let results;
    if (page && limit) {
        const query = coupon_model_1.couponModel.find().populate("user");
        const result = yield (0, paginateAndSort_1.paginateAndSort)(query, page, limit, searchText, searchFields);
        result.results = (0, formatResultImage_1.formatResultImage)(result.results, "attachment");
        return result;
    }
    else {
        results = yield coupon_model_1.couponModel
            .find()
            .populate("user")
            .sort({ createdAt: -1 })
            .exec();
        results = (0, formatResultImage_1.formatResultImage)(results, "attachment");
        return {
            results,
        };
    }
});
//Get single coupon
const getSingleCouponService = (couponId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof couponId === "string"
        ? new mongoose_1.default.Types.ObjectId(couponId)
        : couponId;
    const result = yield coupon_model_1.couponModel.findById(queryId).populate("user").exec();
    if (!result) {
        throw new Error("Coupon not found");
    }
    if (typeof result.attachment === "string") {
        const formattedAttachment = (0, formatResultImage_1.formatResultImage)(result.attachment);
        if (typeof formattedAttachment === "string") {
            result.attachment = formattedAttachment;
        }
    }
    return result;
});
const getSingleCouponByCodeService = (couponCode) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupon_model_1.couponModel
        .findOne({ code: couponCode })
        .populate("user")
        .exec();
    if (!result) {
        throw new Error("Coupon not found");
    }
    if (typeof result.attachment === "string") {
        const formattedAttachment = (0, formatResultImage_1.formatResultImage)(result.attachment);
        if (typeof formattedAttachment === "string") {
            result.attachment = formattedAttachment;
        }
    }
    return result;
});
//Update single coupon
const updateSingleCouponService = (couponId, couponData) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof couponId === "string"
        ? new mongoose_1.default.Types.ObjectId(couponId)
        : couponId;
    if (couponData.type === "percentage") {
        const amount = parseFloat(couponData.amount);
        if (isNaN(amount) || amount < 0 || amount > 100) {
            throw new Error("Amount must be a valid percentage between 0 and 100.");
        }
        couponData.amount = `${amount}%`;
    }
    else if (couponData.type === "fixed") {
        const fixedAmount = parseFloat(couponData.amount);
        if (isNaN(fixedAmount) || fixedAmount < 0) {
            throw new Error("Amount must be a valid number.");
        }
        couponData.amount = fixedAmount.toString();
    }
    const currentDate = (0, moment_1.default)();
    const expiredDate = (0, moment_1.default)(couponData.expiredDate).endOf("day");
    if (couponData.count > 0 && expiredDate.isAfter(currentDate)) {
        couponData.status = global_interface_1.Status.ACTIVE;
    }
    else {
        couponData.status = global_interface_1.Status.INACTIVE;
    }
    const result = yield coupon_model_1.couponModel
        .findByIdAndUpdate(queryId, { $set: couponData }, { new: true, runValidators: true })
        .exec();
    if (!result) {
        throw new Error("Coupon not found");
    }
    return result;
});
//Delete single coupon
const deleteSingleCouponService = (couponId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof couponId === "string"
        ? new mongoose_1.default.Types.ObjectId(couponId)
        : couponId;
    const result = yield coupon_model_1.couponModel.findByIdAndDelete(queryId).exec();
    if (!result) {
        throw new Error("Coupon not found");
    }
    return result;
});
//Delete many coupon
const deleteManyCouponService = (couponIds) => __awaiter(void 0, void 0, void 0, function* () {
    const queryIds = couponIds.map((id) => {
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
    const result = yield coupon_model_1.couponModel
        .deleteMany({ _id: { $in: queryIds } })
        .exec();
    return result;
});
node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentDate = (0, moment_1.default)();
        const coupons = yield coupon_model_1.couponModel.find({ status: global_interface_1.Status.ACTIVE });
        for (const coupon of coupons) {
            const expiredDate = (0, moment_1.default)(coupon.expiredDate).endOf("day");
            if (expiredDate.isBefore(currentDate) || coupon.count <= 0) {
                coupon.status = global_interface_1.Status.INACTIVE;
                yield coupon.save();
            }
        }
    }
    catch (error) {
        console.error("Error running coupon expiration check:", error);
    }
}));
exports.couponServices = {
    createCouponService,
    getAllCouponService,
    getSingleCouponService,
    getSingleCouponByCodeService,
    updateSingleCouponService,
    deleteSingleCouponService,
    deleteManyCouponService,
};
