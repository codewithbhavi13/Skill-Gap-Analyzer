
import { z } from "zod";

export const createSkillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Skill name is required")
    .max(100, "Skill name cannot exceed 100 characters"),

  aliases: z
    .array(
      z.string().trim().min(1, "Alias cannot be empty").max(100)
    )
    .optional(),

  category: z.enum([
    "frontend",
    "backend",
    "full_stack",
    "testing",
    "devops",
    "cloud",
    "ai_ml",
    "cybersecurity",
  ]),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});

export const updateSkillSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Skill name is required")
      .max(100, "Skill name cannot exceed 100 characters")
      .optional(),

    aliases: z
      .array(
        z.string().trim().min(1, "Alias cannot be empty").max(100)
      )
      .optional(),

    category: z
      .enum([
        "frontend",
        "backend",
        "full_stack",
        "testing",
        "devops",
        "cloud",
        "ai_ml",
        "cybersecurity",
      ])
      .optional(),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "At least one field must be provided",
    }
  );

export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;
