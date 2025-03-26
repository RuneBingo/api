import { SeedingService } from '@/db/seeding/seeding.service';
import { EventBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateBingoCommand, UpdateBingoHandler } from './update-bingo.command';
import { configModule } from '@/config';
import { dbModule } from '@/db';
import { i18nModule } from '@/i18n';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bingo } from '../bingo.entity';
import { User } from '@/user/user.entity';
import { ForbiddenException } from '@nestjs/common';
import { BingoParticipant } from '@/bingo-participant/bingo-participant.entity';

describe('UpdateBingoHandler', () => {
  let module: TestingModule;
  let seedingService: SeedingService;
  let eventBus: jest.Mocked<EventBus>;
  let queryBus: jest.Mocked<QueryBus>;
  let handler: UpdateBingoHandler;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [configModule, dbModule, i18nModule, TypeOrmModule.forFeature([Bingo, User])],
      providers: [
        UpdateBingoHandler,
        SeedingService,
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn().mockResolvedValue([
                { bingoId: 1, userId: 4, role: 'participant' } as BingoParticipant]
            ),
          },
        },
      ],
    }).compile();

    handler = module.get(UpdateBingoHandler);
    eventBus = module.get(EventBus);
    seedingService = module.get(SeedingService);
    queryBus = module.get(QueryBus);
  });

  beforeEach(async () => {
    await seedingService.initialize();
  });

  afterEach(async () => {
    await seedingService.clear();
  });

  afterAll(() => {
    return module.close();
  });

  it('throws ForbiddenException if the requester is not a bingo participant with role owner or organizer', async () => {
    const requester = seedingService.getEntity(User, 'b0aty');

    const command = new UpdateBingoCommand({
      requester,
      bingoId: 1,
      updates: {
        title: 'New title',
      },
    });

    await expect(handler.execute(command)).rejects.toThrow(ForbiddenException);
  });
});
