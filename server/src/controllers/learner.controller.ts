import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";

import {
  saveLearnerProfile,
  getLearnerProfile,
  createSkillAssessment,
  getAssessmentHistory,
  getSkillAssessmentById,
  getLatestSkills,
} from "../services/learner.service.js";

import {
  learnerProfileSchema,
  createSkillAssessmentSchema,
} from "../schemas/learner.schema.js";

import ApiError from "../errors/ApiError.js";

// Create or update the authenticated user's profile.
export const saveProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const parsed = learnerProfileSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new ApiError(
        400,
        parsed.error.issues.map((issue) => issue.message).join(", ")
      );
    }

    const profile = await saveLearnerProfile(userId, parsed.data);

    return res.status(200).json({
      success: true,
      message: "Learner profile saved successfully",
      data: profile,
    });
  }
);

// Retrieve the authenticated user's profile.
export const getMyProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const profile = await getLearnerProfile(userId);

    return res.status(200).json({
      success: true,
      message: "Learner profile retrieved successfully",
      data: profile,
    });
  }
);

// Create a new skill assessment.
export const submitAssessment = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const parsed = createSkillAssessmentSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new ApiError(
        400,
        parsed.error.issues.map((issue) => issue.message).join(", ")
      );
    }

    const assessment = await createSkillAssessment(userId, parsed.data);

    return res.status(201).json({
      success: true,
      message: "Skill assessment submitted successfully",
      data: assessment,
    });
  }
);

// Retrieve all assessments for the authenticated user.
export const getMyAssessmentHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const assessments = await getAssessmentHistory(userId);

    return res.status(200).json({
      success: true,
      message: "Assessment history retrieved successfully",
      data: assessments,
    });
  }
);

// Retrieve a specific assessment belonging to the authenticated user.
export const getMyAssessmentById = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const assessmentId = req.params.id;

    if (typeof assessmentId !== "string") {
    throw new ApiError(400, "Invalid assessment ID");
    }

    const assessment = await getSkillAssessmentById(
    userId,
    assessmentId
    );

    return res.status(200).json({
      success: true,
      message: "Skill assessment retrieved successfully",
      data: assessment,
    });
  }
);

// Retrieve skills from the latest assessment.
export const getMySkills = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const result = await getLatestSkills(userId);

    return res.status(200).json({
      success: true,
      message: "Current skills retrieved successfully",
      data: result,
    });
  }
);
