"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const http_status_1 = __importDefault(require("http-status"));
const notFound = (req, res, next) => {
    const { method, originalUrl } = req;
    return res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        statusCode: http_status_1.default.NOT_FOUND,
        message: `API Route ${method} ${originalUrl} not found`,
        error: "The route you are trying to access does not exist.",
    });
};
exports.notFound = notFound;
