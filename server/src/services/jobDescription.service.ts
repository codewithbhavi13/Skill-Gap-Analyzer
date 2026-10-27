import Role from "../models/Role.model.js";
import JobDescription, {
  JobDescriptionInputType,
} from "../models/JobDescription.model.js";

import type { CreateJobDescriptionInput } from "../schemas/jobDescription.schema.js";
import {
  getActiveSkills,
  matchSkillsInText,
} from "./skillExtraction.service.js";

export const createJobDescription = async (
  data: CreateJobDescriptionInput
) => {
  const role = await Role.findOne({
    _id: data.targetRole,
    isActive: true,
  });

  if (!role) {
    throw new Error("Target role not found or inactive.");
  }

  const jobDescription = await JobDescription.create({
    title: data.title,
    company: data.company,
    description: data.description,
    inputType:
  data.inputType === "text"
    ? JobDescriptionInputType.TEXT
    : JobDescriptionInputType.PDF,
    targetRole: role._id,
    sourceUrl: data.sourceUrl,
    originalFileName: data.originalFileName,
  });

  return jobDescription;
};


export const getAllJobDescriptions = async () => {
  const jobDescriptions = await JobDescription.find()
    .sort({ createdAt: -1 })
    .populate("targetRole", "name")
    .lean();

  return jobDescriptions;
};


export const extractSkillsFromJobDescription = async (
  jobDescriptionId: string
) => {
  const jobDescription = await JobDescription.findById(
    jobDescriptionId
  ).lean();

  if (!jobDescription) {
    throw new Error("Job description not found.");
  }

  const skills = await getActiveSkills();

  const matchedSkills = matchSkillsInText(
    jobDescription.description,
    skills
  );

  return {
    jobDescriptionId: jobDescription._id,
    title: jobDescription.title,
    matchedSkills: matchedSkills.map((skill) => ({
      id: skill._id,
      name: skill.name,
      category: skill.category,
    })),
    totalMatchedSkills: matchedSkills.length,
  };
};


