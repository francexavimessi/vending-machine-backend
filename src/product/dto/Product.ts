import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  kind: string;

  // Define _id explicitly
  _id: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
