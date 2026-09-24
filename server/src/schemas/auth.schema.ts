import { z } from "zod";
import { Gender } from "../models/User.model.js";

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters long")
    .max(100, "Full name cannot exceed 100 characters"),

  email: z
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),

 password: z
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters long")
  .max(20, "Password cannot exceed 20 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  ),

  confirmPassword: z
  .string()
  .trim()
  .min(1, "Confirm Password is required"),

  dateOfBirth: z
  .coerce
  .date()
  .refine((date) => {
    const today = new Date();

    let age = today.getFullYear() - date.getFullYear();

    const monthDifference = today.getMonth() - date.getMonth();

    if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < date.getDate())
    ) {
      age--;
    }

    return age >= 16;
  }, {
    message: "You must be at least 16 years old",
  }),
  gender: z.enum(Gender),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;