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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userControllers = void 0;
const user_service_1 = require("./user.service");
const http_status_1 = __importDefault(require("http-status"));
const upload_1 = require("../upload/upload");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const appError_1 = __importDefault(require("../../errors/appError"));
const createUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        const result = yield user_service_1.userServices.createUserService(userData);
        res.status(200).json({
            success: true,
            statusCode: http_status_1.default.OK,
            message: "User registered successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const loginUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        const result = yield user_service_1.userServices.loginUserService(userData);
        res.status(200).json({
            success: true,
            statusCode: http_status_1.default.OK,
            message: "User login successful!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const changeUserPasswordController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        const { userId } = req.user;
        const result = yield user_service_1.userServices.changeUserPasswordService(userId, userData);
        res.status(200).json({
            success: true,
            statusCode: http_status_1.default.OK,
            message: "Password Changed successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const forgetPasswordController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = req.body.email;
    const result = yield user_service_1.userServices.forgotPasswordService(userEmail);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Reset link is generated successfully! Please check your email.",
        data: result,
    });
}));
const resetPasswordController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (!token) {
        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access!");
    }
    const result = yield user_service_1.userServices.resetPasswordService(req.body, token);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password reset successful!",
        data: result,
    });
}));
const getAllUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = req.query.page
            ? parseInt(req.query.page, 10)
            : undefined;
        const limit = req.query.limit
            ? parseInt(req.query.limit, 10)
            : undefined;
        const searchText = req.query.searchText;
        const searchFields = ["name", "email"];
        const result = yield user_service_1.userServices.getAllUserService(page, limit, searchText, searchFields);
        res.status(200).json({
            success: true,
            message: "All Users Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
//Get single test data
const getSingleUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield user_service_1.userServices.getSingleUserService(userId);
        res.status(200).json({
            success: true,
            message: "User Fetched Successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateUserStatusController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { status } = req.body;
        const result = yield user_service_1.userServices.updateUserStatusService(userId, status);
        res.status(200).json({
            success: true,
            message: "User Status Updated Successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateSingleUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    upload_1.uploadService.single("profile_image")(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(400).json({
                success: false,
                message: "File upload failed",
                error: err.message,
            });
        }
        try {
            const { userId } = req.params;
            const data = req.body;
            const filePath = req.file ? req.file.path : undefined;
            const userData = Object.assign(Object.assign({}, data), { profile_image: filePath });
            const result = yield user_service_1.userServices.updateSingleUserService(userId, userData);
            res.status(200).json({
                success: true,
                message: "User Updated Successfully",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }));
});
exports.userControllers = {
    createUserController,
    loginUserController,
    changeUserPasswordController,
    forgetPasswordController,
    resetPasswordController,
    getAllUserController,
    getSingleUserController,
    updateUserStatusController,
    updateSingleUserController,
};
