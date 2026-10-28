
import { Router } from "express";

import {
  getRoles,
  getRoleSkills,
  getSkills,
} from "../controllers/roleManagement.controller.js";

const router = Router();

router.get("/", getRoles);

router.get("/skills", getSkills);

router.get("/:roleName/skills", getRoleSkills);

export default router;
