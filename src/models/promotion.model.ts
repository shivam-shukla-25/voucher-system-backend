import mongoose, { Document, Schema } from "mongoose";
import { DiscountType } from "./enums";

export interface IPromotion extends Document {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  expiresAt: Date;
  totalUsesAllowed?: number;
  usesCount: number;
  eligibleProductIds?: string[];
  eligibleCategoryIds?: string[];
  minOrderValue?: number;
  isActive: boolean;
}

const PromotionSchema = new Schema<IPromotion>(
  {
    code: { type: String, unique: true, required: true },

    discountType: {
      type: String,
      enum: Object.values(DiscountType),
      required: true,
    },
    discountValue: { type: Number, required: true },
    maxDiscountAmount: { type: Number },

    expiresAt: { type: Date, required: true },
    totalUsesAllowed: { type: Number },
    usesCount: { type: Number, default: 0 },

    eligibleProductIds: [{ type: String }],
    eligibleCategoryIds: [{ type: String }],

    minOrderValue: { type: Number },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PromotionSchema.index({ expiresAt: 1 });
PromotionSchema.index({ isActive: 1 });

export default mongoose.model<IPromotion>("Promotion", PromotionSchema);
