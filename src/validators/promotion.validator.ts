import { z } from "zod";
import { DiscountType } from "../models/enums";

export const createPromotionSchema = z.object({
  code: z.string().optional(),
  discountType: z.enum(DiscountType),
  discountValue: z.number().positive(),
  maxDiscountAmount: z.number().positive().optional(),

  expiresAt: z.coerce.date(),

  totalUsesAllowed: z.number().int().positive().optional(),
  minOrderValue: z.number().positive().optional(),

  eligibleProductIds: z.array(z.string()).optional(),
  eligibleCategoryIds: z.array(z.string()).optional(),

  metadata: z.record(z.string(), z.any()).optional()
});

// Update schema supports partial updates + allow isActive
export const updatePromotionSchema = createPromotionSchema.partial().extend({
  isActive: z.boolean().optional(),
});
