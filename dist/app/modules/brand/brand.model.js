"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandModel = void 0;
const mongoose_1 = require("mongoose");
const global_interface_1 = require("../../interface/global/global.interface");
const brandSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    attachment: { type: String },
    status: {
        type: String,
        enum: Object.values(global_interface_1.Status),
        trim: true,
        default: global_interface_1.Status.ACTIVE,
    },
}, { timestamps: true });
exports.brandModel = (0, mongoose_1.model)("brand", brandSchema);
