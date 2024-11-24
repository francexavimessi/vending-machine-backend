import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MachineInventory extends Document {
  @Prop({ required: true, enum: ['coin', 'banknote'] })
  type: string; // "coin" or "banknote"

  @Prop({ required: true })
  denomination: number;

  @Prop({ required: true, min: 0 })
  quantity: number;
}

export const MachineInventorySchema =
  SchemaFactory.createForClass(MachineInventory);
