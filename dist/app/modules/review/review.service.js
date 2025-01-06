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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paginateAndSort_1 = require("../../utils/paginateAndSort");
const formatResultImage_1 = require("../../utils/formatResultImage");
const review_model_1 = require("./review.model");
const product_model_1 = require("../product/product.model");
//Create a review into database
const createReviewService = (reviewData, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { product, rating, user } = reviewData, rest = __rest(reviewData, ["product", "rating", "user"]);
        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }
        const [review] = yield review_model_1.reviewModel.create([Object.assign(Object.assign({}, rest), { product, user, rating, attachment: filePath })], { session });
        if (!review || !review._id) {
            throw new Error("Failed to create review");
        }
        for (const productId of product) {
            const productDoc = yield product_model_1.productModel
                .findById(productId)
                .session(session);
            if (!productDoc) {
                throw new Error(`Product with ID ${productId} not found`);
            }
            if (!productDoc.reviews.includes(review._id)) {
                productDoc.reviews.push(review._id);
            }
            const currentAverage = productDoc.ratings.average || 0;
            const currentCount = productDoc.ratings.count || 0;
            const updatedCount = currentCount + 1;
            const newAverageRating = (currentAverage * currentCount + rating) / updatedCount;
            productDoc.ratings.average = Math.min(5, parseFloat(newAverageRating.toFixed(2)));
            productDoc.ratings.count = updatedCount;
            yield productDoc.save({ session });
        }
        yield session.commitTransaction();
        session.endSession();
        return review;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// Get all reviews with optional pagination
const getAllReviewService = (page, limit, searchText, searchFields) => __awaiter(void 0, void 0, void 0, function* () {
    let results;
    if (page && limit) {
        const query = review_model_1.reviewModel.find().populate("user").populate("product");
        const result = yield (0, paginateAndSort_1.paginateAndSort)(query, page, limit, searchText, searchFields);
        result.results = (0, formatResultImage_1.formatResultImage)(result.results, "attachment");
        return result;
    }
    else {
        results = yield review_model_1.reviewModel
            .find()
            .populate("user")
            .populate("product")
            .sort({ createdAt: -1 })
            .exec();
        results = (0, formatResultImage_1.formatResultImage)(results, "attachment");
        return {
            results,
        };
    }
});
// Get single review
const getSingleReviewService = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof reviewId === "string"
        ? new mongoose_1.default.Types.ObjectId(reviewId)
        : reviewId;
    const result = yield review_model_1.reviewModel
        .findById(queryId)
        .populate("user")
        .populate("product")
        .exec();
    if (!result) {
        throw new Error("Review not found");
    }
    if (typeof result.attachment === "string") {
        const formattedAttachment = (0, formatResultImage_1.formatResultImage)(result.attachment);
        if (typeof formattedAttachment === "string") {
            result.attachment = formattedAttachment;
        }
    }
    return result;
});
const getSingleReviewByUserService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.reviewModel
        .find({ user: userId })
        .populate("user")
        .populate("product")
        .exec();
    if (result.length === 0) {
        throw new Error("Review for user not found");
    }
    return result;
});
//Update single review
const updateSingleReviewService = (reviewId, reviewData) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof reviewId === "string"
        ? new mongoose_1.default.Types.ObjectId(reviewId)
        : reviewId;
    const result = yield review_model_1.reviewModel
        .findByIdAndUpdate(queryId, { $set: reviewData }, { new: true, runValidators: true })
        .exec();
    if (!result) {
        throw new Error("Review not found");
    }
    return result;
});
//Delete single review
const deleteSingleReviewService = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const queryId = typeof reviewId === "string"
        ? new mongoose_1.default.Types.ObjectId(reviewId)
        : reviewId;
    const result = yield review_model_1.reviewModel.findByIdAndDelete(queryId).exec();
    if (!result) {
        throw new Error("Review not found");
    }
    return result;
});
//Delete many review
const deleteManyReviewsService = (reviewIds) => __awaiter(void 0, void 0, void 0, function* () {
    const queryIds = reviewIds.map((id) => {
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
    const result = yield review_model_1.reviewModel
        .deleteMany({ _id: { $in: queryIds } })
        .exec();
    return result;
});
exports.reviewServices = {
    createReviewService,
    getAllReviewService,
    getSingleReviewService,
    getSingleReviewByUserService,
    updateSingleReviewService,
    deleteSingleReviewService,
    deleteManyReviewsService,
};
