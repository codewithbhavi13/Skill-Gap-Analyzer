
import { z } from "zod";

export const createJobDescriptionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Job title must contain at least 3 characters.")
    .max(200, "Job title cannot exceed 200 characters."),

  company: z
    .string()
    .trim()
    .max(200, "Company name cannot exceed 200 characters.")
    .optional(),

  description: z
    .string()
    .trim()
    .min(50, "Job description must contain at least 50 characters.")
    .max(
      20000,
      "Job description cannot exceed 20000 characters."
    ),

  inputType: z.enum(["text", "pdf"]),

  targetRole: z
    .string()
    .regex(
      /^[0-9a-fA-F]{24}$/,
      "Please provide a valid target role ID."
    ),

  sourceUrl: z
    .string()
    .trim()
    .url("Please provide a valid source URL.")
    .max(2000, "Source URL cannot exceed 2000 characters.")
    .optional(),

  originalFileName: z
    .string()
    .trim()
    .max(255, "File name cannot exceed 255 characters.")
    .optional(),
});

export type CreateJobDescriptionInput = z.infer<
  typeof createJobDescriptionSchema
>;
