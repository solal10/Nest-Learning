import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ShopDocument = HydratedDocument<Shop>;

@Schema()
export class Shop {
  @ApiProperty({ example: 'Cafe Mocha', description: 'Name of the shop' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: '123 Coffee Lane', description: 'Address or location of the shop' })
  @Prop({ required: true })
  location: string;

  @ApiProperty({ 
    example: [1, 2, 3], 
    description: 'List of Coffee IDs associated with the shop', 
    type: [Number],
  })
  @Prop({ type: [Number], default: [] }) // Store Coffee IDs (from PostgreSQL)
  coffees: number[];
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
