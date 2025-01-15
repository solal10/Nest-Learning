import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Flavor } from './entities/flavor-entity/flavor.entity';
import { get } from 'http';
import { Coffee } from './entities/coffee.entity';
import{ DataSource } from 'typeorm';

describe('CoffeesService', () => {
  let service: CoffeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
      { provide: DataSource, useValue: {} },
      { provide: getRepositoryToken(Flavor), useValue: {} },
      {provide: getRepositoryToken(Coffee), useValue: {}},

      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
