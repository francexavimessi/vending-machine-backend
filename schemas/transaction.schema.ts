import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema()
class ProductItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true, min: 0 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  price: number; // Price per unit of the product
}

@Schema()
export class Transaction extends Document {
  @Prop({
    type: [ProductItem],
    required: true,
    default: [],
  })
  products: ProductItem[];

  @Prop({ required: true, min: 0 })
  totalPaid: number;

  @Prop({
    type: [{ denomination: { type: Number }, quantity: { type: Number } }],
    default: [],
  })
  changeReturned: { denomination: number; quantity: number }[];

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ required: true })
  status: string; // e.g., "completed" or "canceled"
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
