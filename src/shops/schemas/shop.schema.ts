import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ShopDocument = HydratedDocument<Shop>;

@Schema()
export class Shop {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  location: string;

  @Prop({ type: [Number], default: [] }) // Store Coffee IDs (from PostgreSQL)
  coffees: number[];
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
