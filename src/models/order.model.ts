import mongoose, { Document, Schema, Types } from "mongoose";

export interface OrderItem {
  productId: string;
  categoryId?: string;
  quantity: number;
  unitPrice: number;
}

export interface IAppliedCode {
  type: "voucher" | "promotion";
  code: string;
  appliedAmount: number;
  voucherId?: Types.ObjectId;
  promotionId?: Types.ObjectId;
}

export interface IOrder extends Document {
  userId: string;
  items: OrderItem[];
  subtotal: number;
  appliedCodes: IAppliedCode[];
  total: number;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },

    items: [
      {
        productId: { type: String, required: true },
        categoryId: { type: String },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
      },
    ],

    subtotal: { type: Number, required: true },

    appliedCodes: [
      {
        type: { type: String, enum: ["voucher", "promotion"] },
        code: { type: String },
        appliedAmount: { type: Number },
        voucherId: { type: Schema.Types.ObjectId, ref: "Voucher" },
        promotionId: { type: Schema.Types.ObjectId, ref: "Promotion" },
      },
    ],

    total: { type: Number, required: true },
  },
  { timestamps: true }
);

OrderSchema.index({ userId: 1 });
OrderSchema.index({ createdAt: -1 });

export default mongoose.model<IOrder>("Order", OrderSchema);
