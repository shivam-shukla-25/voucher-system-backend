import { Request, Response } from "express";
import promotionService from "../services/promotion.service";
import {
  createPromotionSchema,
  updatePromotionSchema,
} from "../validators/promotion.validator";

class PromotionController {
  async create(req: Request, res: Response) {
    const parsed = createPromotionSchema.safeParse(req.body);
    if (!parsed.success) {
      throw parsed.error;
    }

    const promo = await promotionService.create(parsed.data);
    return res.status(201).json(promo);
  }

  async getAll(req: Request, res: Response) {
    const promos = await promotionService.getAll();
    return res.json(promos);
  }

  async getByCode(req: Request, res: Response) {
    const promo = await promotionService.getByCode(req.params.code);

    if (!promo) {
      return res
        .status(404)
        .json({ message: "Promotion not found or inactive" });
    }

    return res.json(promo);
  }

  async update(req: Request, res: Response) {
    const parsed = updatePromotionSchema.safeParse(req.body);
    if (!parsed.success) {
      throw parsed.error;
    }

    const updated = await promotionService.update(req.params.code, parsed.data);

    if (!updated) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    return res.json(updated);
  }

  async delete(req: Request, res: Response) {
    const deleted = await promotionService.delete(req.params.code);

    if (!deleted) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    return res.json({ message: "Promotion disabled successfully" });
  }
}

export default new PromotionController();
