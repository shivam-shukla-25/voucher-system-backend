import Voucher from "../models/voucher.model";
import Promotion from "../models/promotion.model";
import Order from "../models/order.model";
import { calculateSubtotal } from "../utils/order.utils";

class ApplyService {
  async applyCode(input: any) {
    const { code, items, orderId } = input;

    const subtotal = calculateSubtotal(items);
    const { ref, isVoucher } = await this.findCode(code);

    this.validateBaseRules(ref, subtotal);
    await this.validateOrderReuse(orderId, code);

    if (!isVoucher) {
      this.validatePromotionEligibility(ref, items);
    }

    const discount = this.calculateDiscount(ref, subtotal);
    const total = subtotal - discount;

    await this.incrementUsage(ref);

    return {
      type: isVoucher ? "voucher" : "promotion",
      code: ref.code,
      subtotal,
      discount,
      total,
    };
  }

  /** -------------------- HELPERS ---------------------- **/

  private async findCode(code: string) {
    const normalized = code.toUpperCase();

    const voucher = await Voucher.findOne({
      code: normalized,
      isActive: true,
    });

    if (voucher) return { ref: voucher, isVoucher: true };

    const promotion = await Promotion.findOne({
      code: normalized,
      isActive: true,
    });

    if (!promotion) throw new Error("Code not found or inactive");

    return { ref: promotion, isVoucher: false };
  }

  private validateBaseRules(ref: any, subtotal: number) {
    if (new Date(ref.expiresAt) < new Date()) {
      throw new Error("Code expired");
    }

    if (ref.totalUsesAllowed && ref.usesCount >= ref.totalUsesAllowed) {
      throw new Error("Usage limit exceeded");
    }

    if (ref.minOrderValue && subtotal < ref.minOrderValue) {
      throw new Error("Minimum order value not met");
    }
  }

  private async validateOrderReuse(orderId?: string, code?: string) {
    if (!orderId) return;

    const order = await Order.findById(orderId);
    if (!order) return;

    const isUsed = order.appliedCodes.some(
      (x) => x.code === code?.toUpperCase()
    );

    if (isUsed) throw new Error("Code already applied to this order");
  }

  private validatePromotionEligibility(ref: any, items: any[]) {
    const { eligibleProductIds, eligibleCategoryIds } = ref;

    if (Array.isArray(eligibleProductIds) && eligibleProductIds.length > 0) {
      const match = items.some((i) => eligibleProductIds.includes(i.productId));
      if (!match) throw new Error("Code not applicable to any products");
    }

    if (Array.isArray(eligibleCategoryIds) && eligibleCategoryIds.length > 0) {
      const match = items.some(
        (i) => i.categoryId && eligibleCategoryIds.includes(i.categoryId)
      );
      if (!match) throw new Error("Code not applicable to any categories");
    }
  }

  private calculateDiscount(ref: any, subtotal: number) {
    let discount =
      ref.discountType === "percentage"
        ? (subtotal * ref.discountValue) / 100
        : ref.discountValue;

    if (ref.maxDiscountAmount && discount > ref.maxDiscountAmount) {
      discount = ref.maxDiscountAmount;
    }

    const maxAllowedDiscount = subtotal * 0.5;
    return Math.min(discount, maxAllowedDiscount);
  }

  private async incrementUsage(ref: any) {
    ref.usesCount += 1;
    await ref.save();
  }
}

export default new ApplyService();
