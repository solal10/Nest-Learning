import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from './schemas/shop.schema';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { CoffeesModule } from '../coffees/coffees.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }]),
    CoffeesModule, // Ensure CoffeesModule is imported to access CoffeeRepository
  ],
  controllers: [ShopsController],
  providers: [ShopsService], // Register ShopsService as a provider
  exports: [ShopsService],   // Export if needed by other modules
})
export class ShopsModule {}
