import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Public()
  @Get()
  async getAllShops() {
    return this.shopsService.getAllShops();
  }

  @Post()
  async createShop(
    @Body('name') name: string,
    @Body('location') location: string,
    @Body('coffeeIds') coffeeIds: number[],
  ) {
    return this.shopsService.createShop(name, location, coffeeIds);
  }

  @Post(':id/add-coffee')
  async addCoffeeToShop(
    @Param('id') shopId: string,
    @Body('coffeeId') coffeeId: number,
  ) {
    return this.shopsService.addCoffeeToShop(shopId, coffeeId);
  }

  @Delete(':id')
  async deleteShopById(@Param('id') shopId: string) {
    return this.shopsService.deleteShopById(shopId);
  }
}
