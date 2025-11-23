import { Request, Response, NextFunction } from "express";

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // This will handle MongoDB duplicate key error
  if (err.code === 11000) {
    const duplicatedField = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      status: "error",
      message: `${duplicatedField} already exists`,
      value: err.keyValue[duplicatedField],
    });
  }

  // General fallback
  return res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
}
