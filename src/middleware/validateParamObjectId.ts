import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export function validateParamObjectId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID format",
    });
  }

  next();
}
