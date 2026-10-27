
import { Router } from "express";
import {
  getAllRoles,
  getSkillsByRole,
  getAllSkills,
} from "../services/roleManagement.service.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const roles = await getAllRoles();

    res.status(200).json({
      success: true,
      count: roles.length,
      data: roles,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:roleName/skills", async (req, res, next) => {
  try {
    const requirements = await getSkillsByRole(req.params.roleName);

    if (!requirements) {
      res.status(404).json({
        success: false,
        message: "Role not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      count: requirements.length,
      data: requirements,
    });
  } catch (error) {
    next(error);
  }
});


router.get("/skills", async (_req, res, next) => {
  try {
    const skills = await getAllSkills();

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
});


export default router;
