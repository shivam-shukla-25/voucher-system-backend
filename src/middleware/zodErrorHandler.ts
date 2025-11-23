import { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export function zodErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ZodError) {
    const formatted = err.issues.map((issue) => {
      const field = issue.path.join(".");

      let message = "";

      switch (issue.code) {
        case "invalid_type":
          message = `${field} must be of type ${issue.expected}`;
          break;

        case "too_small":
          message = `${field} must be greater than ${issue.minimum}`;
          break;

        case "too_big":
          message = `${field} must be less than ${issue.maximum}`;
          break;

        case "invalid_format":
          message = `${field} has invalid format`;
          break;

        case "invalid_union":
          message = `${field} does not match any allowed types`;
          break;

        case "invalid_value":
          message = `${field} has an invalid value`;
          break;

        default:
          message = issue.message || "Invalid input";
      }

      return { field, message };
    });

    return res.status(400).json({
      status: "error",
      errors: formatted,
    });
  }

  next(err);
}
