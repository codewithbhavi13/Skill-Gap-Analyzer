export interface Role {
  _id: string;
  name: string;
  normalizedName: string;
  description?: string;
}

export interface Skill {
  _id: string;
  name: string;
  normalizedName: string;
  aliases?: string[];
  category?: string;
  description?: string;
}

export interface RoleSkillRequirement {
  _id: string;
  role: string;
  skill: Skill;
  requirementType: string;
  sourceType?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}
