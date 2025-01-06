import { z } from "zod";

const createTestValidationSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Invalid email address" }),
  number: z
    .string({
      required_error: "Number is required",
    })
    .min(11, { message: "Number must be exactly 11 digits" })
    .max(11, { message: "Number must be exactly 11 digits" }),
  attachment: z.string().optional(),
});

export const testValidationSchemas = {
  createTestSchema: createTestValidationSchema,
};
