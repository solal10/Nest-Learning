import { Module } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({
    providers: [
        {
            provide: 'CONNECTION',
            useValue: new DataSource({
                type: 'postgres',
                host: process.env.DATABASE_HOST || 'localhost',
                port: +process.env.DATABASE_PORT || 5432,
                username: process.env.DATABASE_USER || 'admin',
                password: process.env.DATABASE_PASSWORD || 'pass123',
                database: process.env.DATABASE_NAME || 'postgres',

            }).initialize(),
        },
    ],
})
export class DatabaseModule {
    static register(options: DataSourceOptions): any {
        return {
            module: DatabaseModule,
            providers: [
                {
                    provide: 'CONNECTION',
                    useValue: new DataSource(options).initialize(),
                },
            ],
        };
    }
}
