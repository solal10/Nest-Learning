import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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
    const existingShop = await this.shopModel.findOne({ name, location }).exec();
    if (existingShop) {
      throw new Error(`Shop with name "${name}" and location "${location}" already exists`);
    }

    const coffees = await this.coffeeRepository.find({
      where: { id: In(coffeeIds) },
      relations: ['flavors'],  // Ensure flavors are fetched correctly
    });

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
        const coffees = await this.coffeeRepository.find({
          where: { id: In(shop.coffees) },
          relations: ['flavors'],  // Load the flavors properly
        });
        return { ...shop.toObject(), coffees };
      }),
    );
    return populatedShops;
  }

  // Get a single shop by ID with coffee details
  async getShopById(shopId: string): Promise<any> {
    const shop = await this.shopModel.findById(shopId).exec();
    if (!shop) {
      throw new Error(`Shop with ID ${shopId} not found`);
    }

    const coffees = await this.coffeeRepository
    .createQueryBuilder('coffee')
    .leftJoinAndSelect('coffee.flavors', 'flavor')
    .where('coffee.id IN (:...ids)', { ids: shop.coffees })
    .getMany();


    return { ...shop.toObject(), coffees };
  }

  // Add a coffee to a shop
  async addCoffeeToShop(shopId: string, coffeeId: number): Promise<Shop> {
    const coffee = await this.coffeeRepository.findOne({
      where: { id: coffeeId },
      relations: ['flavors'],  // Ensure flavors are loaded when verifying coffee
    });

    if (!coffee) {
      throw new Error(`Coffee with ID ${coffeeId} not found`);
    }

    const shop = await this.shopModel.findById(shopId).exec();
    if (!shop) {
      throw new Error(`Shop with ID ${shopId} not found`);
    }
    if (shop.coffees.includes(coffeeId)) {
      throw new Error(`Coffee with ID ${coffeeId} is already in the shop`);
    }

    return this.shopModel.findByIdAndUpdate(
      shopId,
      { $push: { coffees: coffee.id } }, 
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
