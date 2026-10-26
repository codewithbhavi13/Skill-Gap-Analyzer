import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../errors/ApiError.js";
import User from "../models/User.model.js";

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.userId) {
      throw new ApiError(401, "Authentication required");
    }

    const user = await User.findById(req.userId).select(
      "-password"
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  }
);
