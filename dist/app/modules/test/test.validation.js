"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testValidationSchemas = void 0;
const zod_1 = require("zod");
const createTestValidationSchema = zod_1.z.object({
    name: zod_1.z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
    }),
    email: zod_1.z
        .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    })
        .email({ message: "Invalid email address" }),
    number: zod_1.z
        .string({
        required_error: "Number is required",
    })
        .min(11, { message: "Number must be exactly 11 digits" })
        .max(11, { message: "Number must be exactly 11 digits" }),
    attachment: zod_1.z.string().optional(),
});
exports.testValidationSchemas = {
    createTestSchema: createTestValidationSchema,
};
