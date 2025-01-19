import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { REQUEST } from '@nestjs/core';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('coffees') // Group all routes under "coffees" in Swagger
@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all coffees' })
  @ApiResponse({ status: 200, description: 'Returns all coffees.' })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.coffeesService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a coffee by ID' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the coffee' })
  @ApiResponse({ status: 200, description: 'Returns a coffee by ID.' })
  findOne(@Param('id') id: string) {
    return this.coffeesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new coffee' })
  @ApiBody({ type: CreateCoffeeDto })
  @ApiResponse({ status: 201, description: 'The coffee has been successfully created.' })
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a coffee by ID' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the coffee to update' })
  @ApiBody({ type: UpdateCoffeeDto })
  @ApiResponse({ status: 200, description: 'The coffee has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a coffee by ID' })
  @ApiParam({ name: 'id', required: true, description: 'The ID of the coffee to delete' })
  @ApiResponse({ status: 200, description: 'The coffee has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(id);
  }
}
