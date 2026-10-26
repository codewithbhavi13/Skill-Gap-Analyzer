import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../errors/ApiError.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const authenticateUser = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new ApiError(401, "Access token is required");
    }

    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (
      typeof decoded === "string" ||
      typeof decoded.sub !== "string"
    ) {
      throw new ApiError(401, "Invalid access token");
    }

    req.userId = decoded.sub;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, "Invalid or expired access token"));
      return;
    }

    next(error);
  }
};
export default authenticateUser;
