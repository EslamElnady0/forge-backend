import { Request, Response, NextFunction } from "express";
import { AppError } from "./appError";

export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(`[ERROR] ${err.message}`);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
      },
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      message: "Internal Server Error",
    },
  });
}
