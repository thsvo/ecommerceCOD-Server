"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidationSchemas = void 0;
const zod_1 = require("zod");
const user_constants_1 = require("./user.constants");
const createUserValidationSchema = zod_1.z.object({
    number: zod_1.z.string({
        required_error: "Number is required",
    }),
    password: zod_1.z
        .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    })
        .min(6, {
        message: "Password must be at least 6 characters long",
    }),
    role: zod_1.z.enum(user_constants_1.userRole).optional(),
});
const userLoginValidationSchema = zod_1.z.object({
    emailNumber: zod_1.z.string({
        required_error: "Email Or Number is required",
    }),
    password: zod_1.z
        .string({
        required_error: "Password is required",
        invalid_type_error: "Password mus be a string",
    })
        .min(6, {
        message: "Password must be at least 6 characters long",
    }),
});
const changePasswordValidationSchema = zod_1.z.object({
    current_password: zod_1.z
        .string({
        required_error: "Current password is required",
        invalid_type_error: "Current password must be a string",
    })
        .min(6, {
        message: "Current password must be at least 6 characters long",
    }),
    new_password: zod_1.z
        .string({
        required_error: "New password is required",
        invalid_type_error: "New password must be a string",
    })
        .min(6, {
        message: "New password must be at least 6 characters long",
    }),
});
const forgetPasswordValidationSchema = zod_1.z.object({
    email: zod_1.z.string({
        required_error: "Email is required!",
    }),
});
const resetPasswordValidationSchema = zod_1.z.object({
    email: zod_1.z.string({
        required_error: "Email is required!",
    }),
    new_password: zod_1.z.string({
        required_error: "User password is required!",
    }),
});
exports.userValidationSchemas = {
    createUserValidationSchema,
    userLoginValidationSchema,
    changePasswordValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema,
};
