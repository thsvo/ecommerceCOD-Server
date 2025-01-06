"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
const handleCastError = (error) => {
    const message = `invalid ${error.path}`;
    const errorMessage = `${error.value} is not valid in ${error.path}`;
    return {
        message,
        errorMessage,
    };
};
exports.handleCastError = handleCastError;
