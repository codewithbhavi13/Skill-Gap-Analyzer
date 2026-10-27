import { z } from "zod";

export const createRoleRequirementSchema = z.object({
  roleId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid role ID"),

  skillId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid skill ID"),

  requirementType: z.enum(["required", "preferred"]),
});

export const updateRoleRequirementSchema = z
  .object({
    requirementType: z
      .enum(["required", "preferred"])
      .optional(),
  })
  .refine(
    (data) => data.requirementType !== undefined,
    {
      message: "At least one field must be provided",
    }
  );

export type CreateRoleRequirementInput = z.infer<
  typeof createRoleRequirementSchema
>;

export type UpdateRoleRequirementInput = z.infer<
  typeof updateRoleRequirementSchema
>;
