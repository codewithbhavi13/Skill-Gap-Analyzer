
import type { Request, Response, NextFunction } from "express";

import {
  getAllRoles,
  getSkillsByRole,
  getAllSkills,
} from "../services/roleManagement.service.js";

export const getRoles = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
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
};

export const getRoleSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roleName = String(req.params.roleName);

const requirements = await getSkillsByRole(roleName);

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
};

export const getSkills = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
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
};
