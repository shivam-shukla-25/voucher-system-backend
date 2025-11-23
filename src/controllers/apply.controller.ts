import { Request, Response } from "express";
import { applySchema } from "../validators/apply.validator";
import applyService from "../services/apply.service";

class ApplyController {
  async apply(req: Request, res: Response) {
    const parsed = applySchema.safeParse(req.body);
    if (!parsed.success) {
      throw parsed.error;
    }

    try {
      const result = await applyService.applyCode(parsed.data);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }
}

export default new ApplyController();
