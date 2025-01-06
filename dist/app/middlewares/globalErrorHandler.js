"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const zod_1 = require("zod");
const handleZodError_1 = require("../errors/handleZodError");
const handleDuplicateError_1 = require("../errors/handleDuplicateError");
const handleValidationError_1 = require("../errors/handleValidationError");
const handleCastError_1 = require("../errors/handleCastError");
const globalErrorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = "Something went wrong";
    let errorMessage = error === null || error === void 0 ? void 0 : error.message;
    let errorDetails = error;
    if (error instanceof zod_1.ZodError) {
        message = "Validation Error";
        errorMessage = (0, handleZodError_1.handleZodError)(error);
    }
    else if ((error === null || error === void 0 ? void 0 : error.code) === 11000) {
        message = "Duplicate Error";
        errorMessage = (0, handleDuplicateError_1.handleDuplicateError)(error);
    }
    else if ((error === null || error === void 0 ? void 0 : error.name) === "ValidationError") {
        const validationData = (0, handleValidationError_1.handleValidationError)(error);
        message = validationData === null || validationData === void 0 ? void 0 : validationData.message;
        errorMessage = validationData === null || validationData === void 0 ? void 0 : validationData.errorMessage;
        errorDetails = validationData === null || validationData === void 0 ? void 0 : validationData.errorDetails;
    }
    else if ((error === null || error === void 0 ? void 0 : error.name) === "CastError") {
        const castErrorData = (0, handleCastError_1.handleCastError)(error);
        message = castErrorData === null || castErrorData === void 0 ? void 0 : castErrorData.message;
        errorMessage = castErrorData === null || castErrorData === void 0 ? void 0 : castErrorData.errorMessage;
    }
    return res.status(statusCode).json({
        success: false,
        message,
        errorMessage,
        errorDetails,
        stack: error === null || error === void 0 ? void 0 : error.stack,
    });
};
exports.globalErrorHandler = globalErrorHandler;
