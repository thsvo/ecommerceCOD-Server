"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offerModel = exports.OfferType = void 0;
const mongoose_1 = require("mongoose");
const global_interface_1 = require("../../interface/global/global.interface");
var OfferType;
(function (OfferType) {
    OfferType["FLASH_DEAL"] = "flash deal";
    OfferType["HOT_DEAL"] = "hot deal";
    OfferType["SPECIAL_OFFERS"] = "special offer";
})(OfferType || (exports.OfferType = OfferType = {}));
const offerSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    product: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "product", required: true }],
    price: { type: Number },
    discount: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    attachment: { type: String, trim: true },
    backgroundColor: { type: String, trim: true },
    type: {
        type: String,
        enum: Object.values(OfferType),
        trim: true,
    },
    status: {
        type: String,
        enum: Object.values(global_interface_1.Status),
        trim: true,
        default: global_interface_1.Status.ACTIVE,
    },
}, { timestamps: true });
exports.offerModel = (0, mongoose_1.model)("offer", offerSchema);
