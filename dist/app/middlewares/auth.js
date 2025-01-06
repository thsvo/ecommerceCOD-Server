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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const user_model_1 = require("../modules/user/user.model");
const http_status_1 = __importDefault(require("http-status"));
const auth = (...requiredRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(http_status_1.default.UNAUTHORIZED).json({
                    success: false,
                    status: http_status_1.default.UNAUTHORIZED,
                    message: "No token provided",
                });
            }
            const token = authHeader.startsWith("Bearer ")
                ? authHeader.slice(7)
                : authHeader;
            const decode = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
            const { userId, role } = decode;
            const user = yield user_model_1.userModel.findById(userId);
            if (!user) {
                return res.status(http_status_1.default.UNAUTHORIZED).json({
                    success: false,
                    status: http_status_1.default.UNAUTHORIZED,
                    message: "User not found",
                });
            }
            if (requiredRoles.length && !requiredRoles.includes(role)) {
                return res.status(http_status_1.default.FORBIDDEN).json({
                    success: false,
                    status: http_status_1.default.FORBIDDEN,
                    message: "Unauthorized Access",
                });
            }
            req.user = decode;
            next();
        }
        catch (error) {
            return res.status(http_status_1.default.UNAUTHORIZED).json({
                success: false,
                status: http_status_1.default.UNAUTHORIZED,
                message: "Invalid token",
            });
        }
    });
};
exports.default = auth;
