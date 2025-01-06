"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attributeModel = void 0;
const mongoose_1 = require("mongoose");
const global_interface_1 = require("../../interface/global/global.interface");
const attributeSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    options: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "attributeOption",
            required: true,
        },
    ],
    status: {
        type: String,
        enum: Object.values(global_interface_1.Status),
        trim: true,
        default: global_interface_1.Status.ACTIVE,
    },
}, { timestamps: true });
exports.attributeModel = (0, mongoose_1.model)("attribute", attributeSchema);
