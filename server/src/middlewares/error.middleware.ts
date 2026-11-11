import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error.js";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
    return;
  }

  res.status(500).json({
    message: "Internal server error",
  });
};
