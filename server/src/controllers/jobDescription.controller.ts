
import type { Request, Response, NextFunction } from "express";
import { createJobDescriptionSchema } from "../schemas/jobDescription.schema.js";
import { createJobDescription, getAllJobDescriptions,extractSkillsFromJobDescription} from "../services/jobDescription.service.js";



export const createJobDescriptionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validationResult = createJobDescriptionSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: "Invalid job description data.",
        errors: validationResult.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const jobDescription = await createJobDescription(validationResult.data);

    res.status(201).json({
      success: true,
      message: "Job description created successfully.",
      data: jobDescription,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllJobDescriptionsController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const jobDescriptions = await getAllJobDescriptions();

    res.status(200).json({
      success: true,
      count: jobDescriptions.length,
      data: jobDescriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const extractSkillsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await extractSkillsFromJobDescription(
      req.params.id as string
    );

    res.status(200).json({
      success: true,
      message: "Skills extracted successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};