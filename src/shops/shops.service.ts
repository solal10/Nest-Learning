import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop, ShopDocument } from './schemas/shop.schema';
import { Coffee } from '../coffees/entities/coffee.entity';

@Injectable()
export class ShopsService {
  constructor(
    @InjectModel(Shop.name) private readonly shopModel: Model<ShopDocument>, // MongoDB Shop schema
    @InjectRepository(Coffee) private readonly coffeeRepository: Repository<Coffee>, // TypeORM Coffee entity
  ) {}

  // Create a new shop and link coffees by IDs
  async createShop(name: string, location: string, coffeeIds: number[]): Promise<Shop> {
    // Verify if the shop already exists
    const existingShop = await this.shopModel.findOne({ name, location }).exec();
    if (existingShop) {
      throw new Error(`Shop with name "${name}" and location "${location}" already exists`);
    }

    // Verify the existence of the coffees in the PostgreSQL database
    const coffees = await this.coffeeRepository.findByIds(coffeeIds);
    const shop = new this.shopModel({
      name,
      location,
      coffees: coffees.map(coffee => coffee.id), // Store Coffee IDs in the shop schema
    });
    return shop.save();
  }

  // Get all shops, with coffee details populated from PostgreSQL
  async getAllShops(): Promise<any[]> {
    const shops = await this.shopModel.find().exec();
    const populatedShops = await Promise.all(
      shops.map(async shop => {
        const coffees = await this.coffeeRepository.findByIds(shop.coffees);
        return { ...shop.toObject(), coffees }; // Combine MongoDB and PostgreSQL data
      }),
    );
    return populatedShops;
  }

  // Add a coffee to a shop
  async addCoffeeToShop(shopId: string, coffeeId: number): Promise<Shop> {
    // Verify the existence of the coffee in PostgreSQL
    const coffee = await this.coffeeRepository.findOne({ where: { id: coffeeId } });
    if (!coffee) {
      throw new Error(`Coffee with ID ${coffeeId} not found`);
    }

    // Verify if the coffee is already in the shop
    const shop = await this.shopModel.findById(shopId).exec();
    if (!shop) {
      throw new Error(`Shop with ID ${shopId} not found`);
    }
    if (shop.coffees.includes(coffeeId)) {
      throw new Error(`Coffee with ID ${coffeeId} is already in the shop`);
    }

    return this.shopModel.findByIdAndUpdate(
      shopId,
      { $push: { coffees: coffee.id } }, // Push the coffee ID into the MongoDB shop schema
      { new: true },
    ).exec();
  }

  // Delete a shop by ID
  async deleteShopById(shopId: string): Promise<{ message: string }> {
    const shop = await this.shopModel.findById(shopId).exec();
    if (!shop) {
      throw new Error(`Shop with ID ${shopId} not found`);
    }

    await this.shopModel.findByIdAndDelete(shopId).exec();
    return { message: `Shop with ID ${shopId} has been deleted successfully` };
  }
}
