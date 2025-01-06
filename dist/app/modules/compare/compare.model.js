"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareModel = void 0;
const mongoose_1 = require("mongoose");
const global_interface_1 = require("../../interface/global/global.interface");
const compareSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "user" },
    deviceId: { type: String },
    product: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "product", required: true }],
    status: {
        type: String,
        enum: Object.values(global_interface_1.Status),
        trim: true,
        default: global_interface_1.Status.ACTIVE,
    },
}, { timestamps: true });
exports.compareModel = (0, mongoose_1.model)("compare", compareSchema);
