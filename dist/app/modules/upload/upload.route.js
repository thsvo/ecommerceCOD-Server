"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRoutes = void 0;
const express_1 = __importDefault(require("express"));
const upload_1 = require("./upload");
const config_1 = __importDefault(require("../../config"));
const router = express_1.default.Router();
router.post("/upload/", upload_1.uploadService.single("file"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }
        const filePath = req.file.path.replace(/\\/g, "/");
        const fileUrl = `${config_1.default.base_url}/${filePath}`;
        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            file: Object.assign(Object.assign({}, req.file), { url: fileUrl }),
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to upload file",
            error: error.message,
        });
    }
});
exports.uploadRoutes = router;
