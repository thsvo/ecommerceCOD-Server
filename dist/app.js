"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const notFound_1 = require("./app/middlewares/notFound");
const http_status_1 = __importDefault(require("http-status"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (origin) {
            callback(null, origin);
        }
        else {
            callback(null, "*");
        }
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express_1.default.json());
const uploadsPath = path_1.default.resolve("uploads");
if (!fs_1.default.existsSync(uploadsPath)) {
    fs_1.default.mkdirSync(uploadsPath);
}
app.use("/uploads", express_1.default.static(uploadsPath));
// API routes
app.use("/api/v1", routes_1.default);
app.get("/api/v1", (req, res) => {
    res.send({
        success: true,
        status: `${http_status_1.default.OK},"Connected"`,
        message: "This Is The Starting Of All The Routes In This Server!",
    });
});
app.get("/", (req, res) => {
    res.send({
        success: true,
        status: http_status_1.default.OK,
        message: "Welcome to Your Secured Server!",
    });
});
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(notFound_1.notFound);
exports.default = app;
