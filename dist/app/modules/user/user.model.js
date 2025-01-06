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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = require("mongoose");
const user_constants_1 = require("./user.constants");
const passwordUtils_1 = require("../../utils/passwordUtils");
const global_interface_1 = require("../../interface/global/global.interface");
const previousPasswordsSchema = new mongoose_1.Schema({
    password: {
        type: "string",
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
});
const userSchema = new mongoose_1.Schema({
    number: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false,
    },
    name: {
        type: String,
        required: false,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
    },
    role: {
        type: String,
        enum: user_constants_1.userRole,
        default: "user",
        trim: true,
    },
    status: {
        type: String,
        enum: Object.values(global_interface_1.Status),
        trim: true,
        default: global_interface_1.Status.ACTIVE,
    },
    profile_image: {
        type: String,
        required: false,
        trim: true,
    },
    address: {
        type: String,
        required: false,
        trim: true,
    },
    previous_passwords: {
        type: [previousPasswordsSchema],
        select: 0,
        trim: true,
    },
}, { timestamps: true });
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = yield (0, passwordUtils_1.hashPassword)(this.password);
        next();
    });
});
// Define a static method for the model
userSchema.statics.isUserExists = function (userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield this.findOne({ _id: userId });
        return !!existingUser;
    });
};
exports.userModel = (0, mongoose_1.model)("user", userSchema);
