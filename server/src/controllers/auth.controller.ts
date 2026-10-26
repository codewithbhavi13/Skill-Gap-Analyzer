import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
} from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const register = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const user = await registerUser(req.body);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
});


export const login = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const { accessToken, user } = await loginUser(req.body);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: { user },
  });
});

export const logout = asyncHandler(async (
  _req: Request,
  res: Response
) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});
