"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterModel = void 0;
const mongoose_1 = require("mongoose");
const global_interface_1 = require("../../interface/global/global.interface");
const newsletterSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, trim: true },
    status: {
        type: String,
        enum: Object.values(global_interface_1.Status),
        trim: true,
        default: global_interface_1.Status.ACTIVE,
    },
}, { timestamps: true });
exports.newsletterModel = (0, mongoose_1.model)("newsletter", newsletterSchema);
