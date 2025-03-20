import { Test, type TestingModule } from '@nestjs/testing';

import { BingoController } from './bingo.controller';

describe('BingoController', () => {
  let controller: BingoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BingoController],
    }).compile();

    controller = module.get<BingoController>(BingoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
