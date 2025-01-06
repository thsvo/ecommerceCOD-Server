"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
const handleZodError = (error) => {
    const issues = error.issues;
    if (issues.length === 0)
        return "";
    return issues.map((issue) => issue.message).join(" ");
};
exports.handleZodError = handleZodError;
