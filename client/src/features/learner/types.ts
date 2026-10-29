export type EducationLevel =
  | "high_school"
  | "diploma"
  | "bachelors"
  | "masters"
  | "doctoral"
  | "other";

export type ProfessionalStatus =
  | "student"
  | "employed"
  | "unemployed"
  | "freelancer"
  | "career_switcher"
  | "other";

export interface Role {
  _id: string;
  name: string;
  normalizedName?: string;
  description?: string;
}

export interface LearnerProfileInput {
  educationLevel: EducationLevel;
  professionalStatus: ProfessionalStatus;
  yearsOfExperience: number;
  targetRole: string;
}


export interface LearnerProfile
  extends Omit<LearnerProfileInput, "targetRole"> {
  _id: string;
  user: string;
  targetRole: Role;
  createdAt: string;
  updatedAt: string;
}

export interface AssessedSkillInput {
  skill: string;
  proficiencyLevel: number;
}

export interface Skill {
  _id: string;
  name: string;
  normalizedName?: string;
  aliases?: string[];
  category?: string;
  description?: string;
}

export interface AssessedSkill {
  skill: Skill;
  proficiencyLevel: number;
}

export interface SkillAssessment {
  _id: string;
  learner: string;
  targetRole: Role;
  skills: AssessedSkill[];
  assessedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}