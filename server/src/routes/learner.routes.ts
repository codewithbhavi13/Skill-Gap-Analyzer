import { Router } from "express";

import authenticateUser from "../middleware/auth.middleware.js";

import {
  saveProfile,
  getMyProfile,
  submitAssessment,
  getMyAssessmentHistory,
  getMyAssessmentById,
  getMySkills,
} from "../controllers/learner.controller.js";

const router = Router();

// All learner endpoints require authentication.
router.use(authenticateUser);

// Learner profile
router.get("/me", getMyProfile);
router.put("/me", saveProfile);

// Current skills and assessment history
router.get("/me/skills", getMySkills);
router.post("/me/assessments", submitAssessment);
router.get("/me/assessments", getMyAssessmentHistory);
router.get("/me/assessments/:id", getMyAssessmentById);

export default router;
