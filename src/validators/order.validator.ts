import { z } from "zod";

export const createOrderSchema = z.object({
  userId: z.string(),
  items: z.array(
    z.object({
      productId: z.string(),
      categoryId: z.string().optional(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().positive()
    })
  ),
  code: z.string().optional()  // voucher or promotion code
});
