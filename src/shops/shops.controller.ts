import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ShopsService } from './shops.service';
import { Shop } from './schemas/shop.schema';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('shops') // Group all routes under "shops" in Swagger
@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all shops' })
  @ApiResponse({
    status: 200,
    description: 'Array of shops with coffee details populated',
    type: [Shop],
  })
  async getAllShops() {
    return this.shopsService.getAllShops();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a shop by ID' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the shop' })
  @ApiResponse({ status: 200, description: 'Returns a shop by ID.' })
  async getShopById(@Param('id') id: string) {
    return await this.shopsService.getShopById(id);
  }
  
  @Post()
  @ApiOperation({ summary: 'Create a new shop' })
  @ApiBody({
    description: 'Shop creation payload',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Cafe Mocha' },
        location: { type: 'string', example: '123 Coffee Lane' },
        coffeeIds: {
          type: 'array',
          items: { type: 'number' },
          example: [1, 2, 3],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The created shop',
    type: Shop,
  })
  async createShop(
    @Body('name') name: string,
    @Body('location') location: string,
    @Body('coffeeIds') coffeeIds: number[],
  ) {
    return this.shopsService.createShop(name, location, coffeeIds);
  }

  @Post(':id/add-coffee')
  @ApiOperation({ summary: 'Add a coffee to a shop' })
  @ApiParam({ name: 'id', type: 'string', example: '60d21b4867d0d8992e610c85' })
  @ApiBody({
    description: 'Coffee addition payload',
    schema: {
      type: 'object',
      properties: {
        coffeeId: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The updated shop',
    type: Shop,
  })
  async addCoffeeToShop(
    @Param('id') shopId: string,
    @Body('coffeeId') coffeeId: number,
  ) {
    return this.shopsService.addCoffeeToShop(shopId, coffeeId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shop by ID' })
  @ApiParam({ name: 'id', type: 'string', example: '60d21b4867d0d8992e610c85' })
  @ApiResponse({
    status: 200,
    description: 'Deletion confirmation message',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Shop with ID 60d21b4867d0d8992e610c85 has been deleted successfully' },
      },
    },
  })
  async deleteShopById(@Param('id') shopId: string) {
    return this.shopsService.deleteShopById(shopId);
  }
}
