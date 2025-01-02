import { Coffee } from 'src/coffees/entities/coffee.entity';
import { Flavor } from 'src/coffees/entities/flavor.entity/flavor.entity';
import { CoffeeRefactor1735731411194 } from 'src/migrations/1735731411194-CoffeeRefactor';
import {DataSource} from 'typeorm';

export default new DataSource({
    type:'postgres',
    host:'localhost',
    port:5432,
    username:'admin',
    password:'pass123',
    database:'postgres',
    entities:[Coffee,Flavor],
    migrations:[CoffeeRefactor1735731411194],
});