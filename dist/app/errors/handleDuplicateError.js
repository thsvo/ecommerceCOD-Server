"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateError = void 0;
const handleDuplicateError = (error) => {
    const match = error.message.match(/index: \w+\s+dup key: \{ (\w+): "(.*?)" \}|\{ (\w+): (.*?) \}/);
    if (match) {
        const fieldName = match[1] || match[3];
        return `${fieldName} already exists`;
    }
    return "Duplicate key error occurred";
};
exports.handleDuplicateError = handleDuplicateError;
