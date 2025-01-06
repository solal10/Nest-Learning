import { Module } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({
    providers: [
        {
            provide: 'CONNECTION',
            useValue: new DataSource({
                type: 'postgres',
                host: 'localhost',
                port:5432,
                username:'admin',
                password:'pass123',
                database:'postgres',
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
