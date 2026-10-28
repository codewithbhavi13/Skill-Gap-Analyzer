import mongoose from "mongoose";

import LearnerProfile from "../models/LearnerProfile.model.js";
import SkillAssessment from "../models/SkillAssessment.model.js";
import Role from "../models/Role.model.js";
import Skill from "../models/Skill.model.js";
import ApiError from "../errors/ApiError.js";

import type {
  LearnerProfileInput,
  CreateSkillAssessmentInput,
} from "../schemas/learner.schema.js";

// Create or update the authenticated user's learner profile.
export const saveLearnerProfile = async (
  userId: string,
  data: LearnerProfileInput
) => {
  const role = await Role.findOne({
    _id: data.targetRole,
    isActive: true,
  });

  if (!role) {
    throw new ApiError(400, "Target role does not exist or is inactive");
  }

  const profile = await LearnerProfile.findOneAndUpdate(
    { user: userId },
    {
      $set: {
        educationLevel: data.educationLevel,
        professionalStatus: data.professionalStatus,
        yearsOfExperience: data.yearsOfExperience,
        targetRole: data.targetRole,
      },
      $setOnInsert: { user: userId },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  ).populate("targetRole", "name description");

  return profile;
};

// Retrieve the authenticated user's profile.
export const getLearnerProfile = async (userId: string) => {
  const profile = await LearnerProfile.findOne({
    user: userId,
  }).populate("targetRole", "name description");

  if (!profile) {
    throw new ApiError(404, "Learner profile not found");
  }

  return profile;
};

// Save a new assessment without overwriting previous assessments.
export const createSkillAssessment = async (
  userId: string,
  data: CreateSkillAssessmentInput
) => {
  const learner = await LearnerProfile.findOne({
    user: userId,
  });

  if (!learner) {
    throw new ApiError(
      404,
      "Create your learner profile before submitting an assessment"
    );
  }

  const skillIds = data.skills.map((item) => item.skill);
  const uniqueSkillIds = new Set(skillIds);

  if (uniqueSkillIds.size !== skillIds.length) {
    throw new ApiError(
      400,
      "A skill can only appear once in an assessment"
    );
  }

  if (skillIds.length > 0) {
    const activeSkills = await Skill.find({
      _id: { $in: skillIds },
      isActive: true,
    }).select("_id");

    if (activeSkills.length !== uniqueSkillIds.size) {
      throw new ApiError(
        400,
        "One or more skills do not exist or are inactive"
      );
    }
  }

  const assessment = await SkillAssessment.create({
    learner: learner._id,
    targetRole: learner.targetRole,
    skills: data.skills,
  });

  return SkillAssessment.findById(assessment._id)
    .populate("targetRole", "name description")
    .populate("skills.skill", "name category description");
};

// Retrieve assessment history, newest first.
export const getAssessmentHistory = async (userId: string) => {
  const learner = await LearnerProfile.findOne({
    user: userId,
  }).select("_id");

  if (!learner) {
    throw new ApiError(404, "Learner profile not found");
  }

  return SkillAssessment.find({
    learner: learner._id,
  })
    .sort({ assessedAt: -1 })
    .populate("targetRole", "name description")
    .populate("skills.skill", "name category description");
};

// Retrieve one assessment belonging to the authenticated user.
export const getSkillAssessmentById = async (
  userId: string,
  assessmentId: string
) => {
  if (!mongoose.isValidObjectId(assessmentId)) {
    throw new ApiError(400, "Invalid assessment ID");
  }

  const learner = await LearnerProfile.findOne({
    user: userId,
  }).select("_id");

  if (!learner) {
    throw new ApiError(404, "Learner profile not found");
  }

  const assessment = await SkillAssessment.findOne({
    _id: assessmentId,
    learner: learner._id,
  })
    .populate("targetRole", "name description")
    .populate("skills.skill", "name category description");

  if (!assessment) {
    throw new ApiError(404, "Skill assessment not found");
  }

  return assessment;
};

// Retrieve the skills from the latest assessment.
export const getLatestSkills = async (userId: string) => {
  const learner = await LearnerProfile.findOne({
    user: userId,
  }).select("_id");

  if (!learner) {
    throw new ApiError(404, "Learner profile not found");
  }

  const latestAssessment = await SkillAssessment.findOne({
    learner: learner._id,
  })
    .sort({ assessedAt: -1 })
    .populate("skills.skill", "name category description");

  if (!latestAssessment) {
    return { skills: [] };
  }

  return {
    assessmentId: latestAssessment._id,
    assessedAt: latestAssessment.assessedAt,
    skills: latestAssessment.skills,
  };
};
