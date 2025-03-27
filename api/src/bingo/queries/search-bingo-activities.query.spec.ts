import { Activity } from '@/activity/activity.entity';
import { configModule } from '@/config';
import { dbModule } from '@/db';
import { SeedingService } from '@/db/seeding/seeding.service';
import { i18nModule } from '@/i18n';
import { User } from '@/user/user.entity';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchBingoActivitiesHandler, SearchBingoActivitiesQuery } from './search-bingo-activities.query';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Bingo } from '../bingo.entity';
import { BingoParticipant } from '@/bingo-participant/bingo-participant.entity';

describe('SearchUserActivitiesHandler', () => {
  let module: TestingModule;
  let seedingService: SeedingService;
  let handler: SearchBingoActivitiesHandler;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [configModule, dbModule, i18nModule, TypeOrmModule.forFeature([Activity, Bingo, BingoParticipant])],
      providers: [SearchBingoActivitiesHandler, SeedingService],
    }).compile();

    handler = module.get(SearchBingoActivitiesHandler);
    seedingService = module.get(SeedingService);

    await seedingService.initialize();
  });

  afterAll(async () => {
    await seedingService.clear();
    return module.close();
  });

  it('throws NotFoundException if the user does not exist', async () => {
    const requester = seedingService.getEntity(User, 'char0o');
    const query = new SearchBingoActivitiesQuery({
      bingoId: 999,
      requester,
    });

    await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
  });

  it('throws ForbiddenException if the user is not an organizer or moderator', async () => {
    const requester = seedingService.getEntity(User, 'b0aty');
    const query = new SearchBingoActivitiesQuery({
      bingoId: 1,
      requester,
    });

    await expect(handler.execute(query)).rejects.toThrow(ForbiddenException);
  });

  it('throws ForbiddenException if the user is only a participant', async () => {
    const requester = seedingService.getEntity(User, 'dee420');
    const query = new SearchBingoActivitiesQuery({
      bingoId: 1,
      requester,
    });

    await expect(handler.execute(query)).rejects.toThrow(ForbiddenException);
  });

  
  it('return the user activities if the user is not participant but moderator', async () => {
    const requester = seedingService.getEntity(User, 'zezima');
    const query = new SearchBingoActivitiesQuery({
      bingoId: 1,
      requester,
    });

    await expect(handler.execute(query)).resolves.not.toThrow();
  });

  it('return the user activities if the user is an organizer', async () => {
    const requester = seedingService.getEntity(User, 'didiking');
    const query = new SearchBingoActivitiesQuery({
      bingoId: 1,
      requester,
    });

    await expect(handler.execute(query)).resolves.not.toThrow();
  });

});
