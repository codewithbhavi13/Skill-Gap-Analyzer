
import { Router } from "express";
import {
  createJobDescriptionController,
   getAllJobDescriptionsController,
  extractSkillsController
} from "../controllers/jobDescription.controller.js";

const router = Router();

router.get("/", getAllJobDescriptionsController);
router.post("/", createJobDescriptionController);
router.get("/:id/extracted-skills", extractSkillsController);

export default router;
