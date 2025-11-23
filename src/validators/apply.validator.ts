import { z } from "zod";

export const applySchema = z.object({
  code: z.string(),   // voucher or promotion code
  items: z.array(
    z.object({
      productId: z.string(),
      categoryId: z.string().optional(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().positive()
    })
  ),
  orderId: z.string().optional() // optional for reuse check
});
