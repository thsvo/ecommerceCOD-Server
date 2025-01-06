"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.offerServices = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const paginateAndSort_1 = require("../../utils/paginateAndSort");
const formatResultImage_1 = require("../../utils/formatResultImage");
const offer_model_1 = require("./offer.model");
const product_model_1 = require("../product/product.model");
//Create a offer into database
const createOfferService = (offerData, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const dataToSave = Object.assign(Object.assign({}, offerData), { filePath });
    const result = yield offer_model_1.offerModel.create(dataToSave);
    if (offerData.product && offerData.product.length > 0) {
        yield product_model_1.productModel.updateMany({ _id: { $in: offerData.product } }, {
            $set: { isOffer: true },
            $push: { offers: new mongoose_1.Types.ObjectId(result._id) },
        });
    }
    return result;
});
// Get all offer with optional pagination
const getAllOfferService = (page, limit, searchText, searchFields) => __awaiter(void 0, void 0, void 0, function* () {
    let results;
    if (page && limit) {
        const query = offer_model_1.offerModel.find().populate("product");
        const result = yield (0, paginateAndSort_1.paginateAndSort)(query, page, limit, searchText, searchFields);
        result.results = (0, formatResultImage_1.formatResultImage)(result.results, "attachment");
        return result;
    }
    else {
        results = yield offer_model_1.offerModel
            .find()
            .populate("product")
            .sort({ createdAt: -1 })
            .exec();
        results = (0, formatResultImage_1.formatResultImage)(results, "attachment");
        return {
            results,
        };
    }
});
//Get single offer
const getSingleOfferService = (offerId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof offerId === "string"
        ? new mongoose_1.default.Types.ObjectId(offerId)
        : offerId;
    const result = yield offer_model_1.offerModel.findById(queryId).populate("product").exec();
    if (!result) {
        throw new Error("Offer not found");
    }
    if (typeof result.attachment === "string") {
        const formattedAttachment = (0, formatResultImage_1.formatResultImage)(result.attachment);
        if (typeof formattedAttachment === "string") {
            result.attachment = formattedAttachment;
        }
    }
    return result;
});
//Update single offer
const updateSingleOfferService = (offerId, offerData) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof offerId === "string"
        ? new mongoose_1.default.Types.ObjectId(offerId)
        : offerId;
    // Find the existing offer before updating
    const existingOffer = yield offer_model_1.offerModel.findById(queryId).exec();
    if (!existingOffer) {
        throw new Error("Offer not found");
    }
    // Update the offer
    const result = yield offer_model_1.offerModel
        .findByIdAndUpdate(queryId, { $set: offerData }, { new: true, runValidators: true })
        .exec();
    if (!result) {
        throw new Error("Failed to update offer");
    }
    if (offerData.product && offerData.product.length > 0) {
        yield product_model_1.productModel.updateMany({ _id: { $in: existingOffer.product } }, {
            $pull: { offers: queryId },
            $set: { isOffer: false },
        });
        yield product_model_1.productModel.updateMany({ _id: { $in: offerData.product } }, {
            $set: { isOffer: true },
            $push: { offers: queryId },
        });
    }
    return result;
});
//Delete single offer
const deleteSingleOfferService = (offerId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof offerId === "string"
        ? new mongoose_1.default.Types.ObjectId(offerId)
        : offerId;
    const result = yield offer_model_1.offerModel.findByIdAndDelete(queryId).exec();
    if (!result) {
        throw new Error("Offer not found");
    }
    return result;
});
//Delete many offer
const deleteManyOfferService = (offerIds) => __awaiter(void 0, void 0, void 0, function* () {
    const queryIds = offerIds.map((id) => {
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
    const result = yield offer_model_1.offerModel.deleteMany({ _id: { $in: queryIds } }).exec();
    return result;
});
exports.offerServices = {
    createOfferService,
    getAllOfferService,
    getSingleOfferService,
    updateSingleOfferService,
    deleteSingleOfferService,
    deleteManyOfferService,
};
