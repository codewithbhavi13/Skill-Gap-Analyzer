import { apiRequest } from "../../services/api";

import type {
  ApiResponse,
  Role,
  Skill,
  RoleSkillRequirement,
} from "./types";

// Get all active roles.
export const getAllRoles = async (): Promise<Role[]> => {
  const response = await apiRequest<ApiResponse<Role[]>>("/roles");
  return response.data;
};

// Get all active skills.
export const getAllSkills = async (): Promise<Skill[]> => {
  const response = await apiRequest<ApiResponse<Skill[]>>("/roles/skills");
  return response.data;
};

// Get the skills and requirements for a selected role.
export const getSkillsByRole = async (
  roleName: string
): Promise<RoleSkillRequirement[]> => {
  const response = await apiRequest<ApiResponse<RoleSkillRequirement[]>>(
    `/roles/${encodeURIComponent(roleName)}/skills`
  );

  return response.data;
};
