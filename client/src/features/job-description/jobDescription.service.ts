import { apiRequest } from "../../services/api";

import type {
  ApiResponse,
  JobDescription,
  ExtractedSkillsResult,
} from "./types";

export interface CreateJobDescriptionInput {
  title: string;
  company?: string;
  description: string;
  inputType: "text";
  targetRole: string;
  sourceUrl?: string;
}

// Fetch all saved job descriptions.
export const getAllJobDescriptions = async (): Promise<JobDescription[]> => {
  const response = await apiRequest<ApiResponse<JobDescription[]>>(
    "/job-descriptions"
  );

  return response.data;
};

// Create a job description from text.
export const createJobDescription = async (
  input: CreateJobDescriptionInput
): Promise<JobDescription> => {
  const response = await apiRequest<ApiResponse<JobDescription>>(
    "/job-descriptions",
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );

  return response.data;
};

// Retrieve skills extracted from a saved job description.
export const extractSkillsFromJobDescription = async (
  id: string
): Promise<ExtractedSkillsResult> => {
  const response = await apiRequest<ApiResponse<ExtractedSkillsResult>>(
    `/job-descriptions/${encodeURIComponent(id)}/extracted-skills`
  );

  return response.data;
};
