"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attributeOptionModel = void 0;
const mongoose_1 = require("mongoose");
const global_interface_1 = require("../../interface/global/global.interface");
const attributeOptionSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["color", "other"] },
    attribute: { type: mongoose_1.Schema.Types.ObjectId, ref: "attribute" },
    label: { type: String, trim: true },
    attachment: { type: String },
    status: {
        type: String,
        enum: Object.values(global_interface_1.Status),
        trim: true,
        default: global_interface_1.Status.ACTIVE,
    },
}, { timestamps: true });
exports.attributeOptionModel = (0, mongoose_1.model)("attributeOption", attributeOptionSchema);
