export type JobDescriptionInputType = "text" | "pdf";

export interface Role {
  _id: string;
  name: string;
}

export interface JobDescription {
  _id: string;
  title: string;
  company?: string;
  description: string;
  inputType: JobDescriptionInputType;
  targetRole: Role | string;
  sourceUrl?: string;
  originalFileName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchedSkill {
  id: string;
  name: string;
  category?: string;
}

export interface ExtractedSkillsResult {
  jobDescriptionId: string;
  title: string;
  matchedSkills: MatchedSkill[];
  totalMatchedSkills: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}
