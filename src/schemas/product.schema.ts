import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0 })
  stock: number;

  // Add img as a string for the image path
  @Prop({ required: false })
  img: string;

  // Add kind as a string for the type/category of the product
  @Prop({ required: true, enum: ['snack', 'drink'] })
  kind: string;

  _id: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
