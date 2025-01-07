import { Coffee } from 'src/coffees/entities/coffee.entity';
import { Flavor } from 'src/coffees/entities/flavor.entity/flavor.entity';
import { CoffeeRefactor1735731411194 } from 'src/migrations/1735731411194-CoffeeRefactor';
import {DataSource} from 'typeorm';

export default new DataSource({
    type:'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER || 'admin',
    password: process.env.DATABASE_PASSWORD || 'pass123',
    database: process.env.DATABASE_NAME || 'postgres',
    entities:[Coffee,Flavor],
    migrations:[CoffeeRefactor1735731411194],
});