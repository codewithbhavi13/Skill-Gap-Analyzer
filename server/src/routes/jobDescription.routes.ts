
import { Router } from "express";
import {
  createJobDescriptionController,
  getAllJobDescriptionsController,
  extractSkillsController,
  uploadPdfJobDescriptionController,
} from "../controllers/jobDescription.controller.js";
import { uploadPdf } from "../middleware/upload.middleware.js";

const router = Router();

router.get("/", getAllJobDescriptionsController);
router.post("/", createJobDescriptionController);

router.post(
  "/upload-pdf",
  uploadPdf.single("file"),
  uploadPdfJobDescriptionController
);

router.get("/:id/extracted-skills", extractSkillsController);

export default router;
