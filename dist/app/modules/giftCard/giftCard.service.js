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
exports.giftCardServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paginateAndSort_1 = require("../../utils/paginateAndSort");
const formatResultImage_1 = require("../../utils/formatResultImage");
const giftCard_model_1 = require("./giftCard.model");
const moment_1 = __importDefault(require("moment"));
const global_interface_1 = require("../../interface/global/global.interface");
const node_cron_1 = __importDefault(require("node-cron"));
//Create a GiftCard into database
const createGiftCardService = (giftCardData, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const dataToSave = Object.assign(Object.assign({}, giftCardData), { filePath });
    const result = yield giftCard_model_1.giftCardModel.create(dataToSave);
    return result;
});
// Get all GiftCard with optional pagination
const getAllGiftCardService = (page, limit, searchText, searchFields) => __awaiter(void 0, void 0, void 0, function* () {
    let results;
    if (page && limit) {
        const query = giftCard_model_1.giftCardModel.find().populate("user");
        const result = yield (0, paginateAndSort_1.paginateAndSort)(query, page, limit, searchText, searchFields);
        result.results = (0, formatResultImage_1.formatResultImage)(result.results, "attachment");
        return result;
    }
    else {
        results = yield giftCard_model_1.giftCardModel
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
//Get single GiftCard
const getSingleGiftCardService = (giftCardId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof giftCardId === "string"
        ? new mongoose_1.default.Types.ObjectId(giftCardId)
        : giftCardId;
    const result = yield giftCard_model_1.giftCardModel.findById(queryId).populate("user").exec();
    if (!result) {
        throw new Error("Gift Card not found");
    }
    if (typeof result.attachment === "string") {
        const formattedAttachment = (0, formatResultImage_1.formatResultImage)(result.attachment);
        if (typeof formattedAttachment === "string") {
            result.attachment = formattedAttachment;
        }
    }
    return result;
});
const getSingleGiftCardByCodeService = (giftCardCode) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield giftCard_model_1.giftCardModel
        .findOne({ code: giftCardCode })
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
//Update single GiftCard
const updateSingleGiftCardService = (giftCardId, giftCardData) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof giftCardId === "string"
        ? new mongoose_1.default.Types.ObjectId(giftCardId)
        : giftCardId;
    const currentDate = (0, moment_1.default)();
    const expiredDate = (0, moment_1.default)(giftCardData.expiredDate).endOf("day");
    if (expiredDate.isAfter(currentDate)) {
        giftCardData.status = global_interface_1.Status.ACTIVE;
    }
    else {
        giftCardData.status = global_interface_1.Status.INACTIVE;
    }
    const result = yield giftCard_model_1.giftCardModel
        .findByIdAndUpdate(queryId, { $set: giftCardData }, { new: true, runValidators: true })
        .exec();
    if (!result) {
        throw new Error("Gift Card not found");
    }
    return result;
});
//Delete single GiftCard
const deleteSingleGiftCardService = (giftCardId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof giftCardId === "string"
        ? new mongoose_1.default.Types.ObjectId(giftCardId)
        : giftCardId;
    const result = yield giftCard_model_1.giftCardModel.findByIdAndDelete(queryId).exec();
    if (!result) {
        throw new Error("Gift Card not found");
    }
    return result;
});
//Delete many GiftCard
const deleteManyGiftCardService = (giftCardIds) => __awaiter(void 0, void 0, void 0, function* () {
    const queryIds = giftCardIds.map((id) => {
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
    const result = yield giftCard_model_1.giftCardModel
        .deleteMany({ _id: { $in: queryIds } })
        .exec();
    return result;
});
node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentDate = (0, moment_1.default)();
        const coupons = yield giftCard_model_1.giftCardModel.find({ status: global_interface_1.Status.ACTIVE });
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
exports.giftCardServices = {
    createGiftCardService,
    getAllGiftCardService,
    getSingleGiftCardService,
    getSingleGiftCardByCodeService,
    updateSingleGiftCardService,
    deleteSingleGiftCardService,
    deleteManyGiftCardService,
};
