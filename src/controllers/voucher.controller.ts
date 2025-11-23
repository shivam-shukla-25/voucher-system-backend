import { Request, Response } from "express";
import voucherService from "../services/voucher.service";
import {
  createVoucherSchema,
  updateVoucherSchema,
} from "../validators/voucher.validator";

class VoucherController {
  async create(req: Request, res: Response) {
    const parsed = createVoucherSchema.safeParse(req.body);
    if (!parsed.success) {
      throw parsed.error;
    }

    const voucher = await voucherService.create({
      ...parsed.data,
      expiresAt: new Date(parsed.data.expiresAt),
    });

    return res.status(201).json(voucher);
  }

  async getAll(req: Request, res: Response) {
    const vouchers = await voucherService.getAll();
    return res.json(vouchers);
  }

  async getByCode(req: Request, res: Response) {
    const voucher = await voucherService.getByCode(req.params.code);

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found or inactive" });
    }

    return res.json(voucher);
  }

  async update(req: Request, res: Response) {
    const parsed = updateVoucherSchema.safeParse(req.body);
    if (!parsed.success) {
      throw parsed.error;
    }

    const updated = await voucherService.update(req.params.code, parsed.data);

    if (!updated) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    return res.json(updated);
  }

  async delete(req: Request, res: Response) {
    const deleted = await voucherService.delete(req.params.code);

    if (!deleted) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    return res.json({ message: "Voucher disabled successfully" });
  }
}

export default new VoucherController();
