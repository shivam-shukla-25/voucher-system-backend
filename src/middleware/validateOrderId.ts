import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export function validateOrderId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { orderId } = req.body;

  if (orderId && !mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID format",
    });
  }

  next();
}
