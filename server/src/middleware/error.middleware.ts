import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import ApiError from "../errors/ApiError.js";

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err);

  // Handle application-specific API errors.
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Handle file upload errors from Multer.
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({
        success: false,
        message: "PDF file exceeds the 5 MB upload limit.",
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Handle rejected file types and PDF extraction errors.
  if (
    err.message === "Only PDF files are allowed." ||
    err.message === "No readable text was found in the PDF."
  ) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Handle unexpected errors.
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorHandler;
