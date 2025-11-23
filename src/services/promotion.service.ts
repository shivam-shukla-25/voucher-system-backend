import Promotion, { IPromotion } from "../models/promotion.model";

class PromotionService {
  async create(data: Partial<IPromotion>): Promise<IPromotion> {
    if (!data.code) {
      data.code = this.generateCode();
    }

    data.code = data.code.toUpperCase();

    return Promotion.create(data);
  }

  async getAll(): Promise<IPromotion[]> {
    return Promotion.find({ isActive: true }).sort({ createdAt: -1 });
  }

  async getByCode(code: string): Promise<IPromotion | null> {
    return Promotion.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });
  }

  async update(
    code: string,
    updates: Partial<IPromotion>
  ): Promise<IPromotion | null> {
    return Promotion.findOneAndUpdate({ code: code.toUpperCase() }, updates, {
      new: true,
    });
  }

  async delete(code: string): Promise<IPromotion | null> {
    return Promotion.findOneAndUpdate(
      { code: code.toUpperCase() },
      { isActive: false },
      { new: true }
    );
  }

  private generateCode(): string {
    return "PROMO-" + Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}

export default new PromotionService();
