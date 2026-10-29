
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

export interface UploadPdfJobDescriptionInput {
  title: string;
  company?: string;
  targetRole: string;
  file: File;
}

export const getAllJobDescriptions = async (): Promise<JobDescription[]> => {
  const response = await apiRequest<ApiResponse<JobDescription[]>>(
    "/job-descriptions",
  );

  return response.data;
};

export const createJobDescription = async (
  input: CreateJobDescriptionInput,
): Promise<JobDescription> => {
  const response = await apiRequest<ApiResponse<JobDescription>>(
    "/job-descriptions",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );

  return response.data;
};

export const uploadPdfJobDescription = async (
  input: UploadPdfJobDescriptionInput,
): Promise<JobDescription> => {
  const formData = new FormData();

  formData.append("file", input.file);
  formData.append("title", input.title);
  formData.append("targetRole", input.targetRole);
  formData.append("inputType", "pdf");

  if (input.company?.trim()) {
    formData.append("company", input.company.trim());
  }

  const response = await apiRequest<ApiResponse<JobDescription>>(
    "/job-descriptions/upload-pdf",
    {
      method: "POST",
      body: formData,
    },
  );

  return response.data;
};

export const extractSkillsFromJobDescription = async (
  id: string,
): Promise<ExtractedSkillsResult> => {
  const response = await apiRequest<ApiResponse<ExtractedSkillsResult>>(
    `/job-descriptions/${encodeURIComponent(id)}/extracted-skills`,
  );

  return response.data;
};
