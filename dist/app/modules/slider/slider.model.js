"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sliderModel = void 0;
const mongoose_1 = require("mongoose");
const global_interface_1 = require("../../interface/global/global.interface");
const sliderSchema = new mongoose_1.Schema({
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "category",
        required: true,
    },
    attachment: { type: String, required: true },
    status: {
        type: String,
        enum: Object.values(global_interface_1.Status),
        trim: true,
        default: global_interface_1.Status.ACTIVE,
    },
}, { timestamps: true });
exports.sliderModel = (0, mongoose_1.model)("slider", sliderSchema);
