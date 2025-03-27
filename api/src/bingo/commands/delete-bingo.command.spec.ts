import { BingoParticipant } from '@/bingo-participant/bingo-participant.entity';
import { configModule } from '@/config';
import { dbModule } from '@/db';
import { SeedingService } from '@/db/seeding/seeding.service';
import { i18nModule } from '@/i18n';
import { User } from '@/user/user.entity';
import { EventBus } from '@nestjs/cqrs';
import { TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bingo } from '../bingo.entity';
import { DeleteBingoCommand, DeleteBingoHandler } from './delete-bingo.command';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BingoDeletedEvent } from '../events/bingo-deleted.event';

describe('DeleteBingoHandler', () => {
  let module: TestingModule;
  let seedingService: SeedingService;
  let eventBus: jest.Mocked<EventBus>;
  let handler: DeleteBingoHandler;
  let dataSource: DataSource;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [configModule, dbModule, i18nModule, TypeOrmModule.forFeature([Bingo, User, BingoParticipant])],
      providers: [
        DeleteBingoHandler,
        SeedingService,
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(DeleteBingoHandler);
    eventBus = module.get(EventBus);
    seedingService = module.get(SeedingService);
    dataSource = module.get(DataSource);
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

  it('throws ForbiddenException if the requester is not a participant or a moderator', async () => {
    const requester = seedingService.getEntity(User, 'b0aty');

    const command = new DeleteBingoCommand({
      requester,
      bingoId: 1,
    });

    await expect(handler.execute(command)).rejects.toThrow(ForbiddenException);
  });

  it('throws ForbiddenException if the requester is a bingo participant without owner role', async () => {
    const requester = seedingService.getEntity(User, 'didiking');

    const command = new DeleteBingoCommand({
      requester,
      bingoId: 1,
    });

    await expect(handler.execute(command)).rejects.toThrow(ForbiddenException);
  });

  it('throws NotFound if the bingo doesnt exist', async () => {
    const requester = seedingService.getEntity(User, 'dee420');

    const command = new DeleteBingoCommand({
      requester,
      bingoId: 999,
    });

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('throws NotFound if the bingo is already deleted', async () => {
    const requester = seedingService.getEntity(User, 'dee420');

    const command = new DeleteBingoCommand({
      requester,
      bingoId: 5,
    });

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('deletes the bingo if user at least moderator and emits DeletedBingo event', async () => {
    const requester = seedingService.getEntity(User, 'zezima');

    const bingoId = 1;

    const command = new DeleteBingoCommand({
      requester,
      bingoId: bingoId,
    });

    const bingo = await handler.execute(command);
    expect(bingo).toBeDefined();
    expect(bingo.deletedAt).toBeDefined();
    expect(bingo.deletedById).toBe(requester.id);

    const updatedBingoParticipants = await dataSource.getRepository(BingoParticipant).find({
      where: {
        bingoId,
      },
      withDeleted: true,
    });
    expect(updatedBingoParticipants.length).toBe(3);
    updatedBingoParticipants.forEach((participant) => {
      expect(participant.deletedAt).toBeDefined();
      expect(participant.deletedById).toBe(requester.id);
    });

    expect(eventBus.publish).toHaveBeenCalledWith(
      new BingoDeletedEvent({
        bingoId: bingo.id,
        requesterId: requester.id,
      }),
    );
  });

  it('deletes the bingo if user is owner', async () => {
    const requester = seedingService.getEntity(User, 'didiking');

    const bingoId = 2;

    const command = new DeleteBingoCommand({
      requester,
      bingoId: bingoId,
    });

    const bingo = await handler.execute(command);
    expect(bingo).toBeDefined();
    expect(bingo.deletedAt).toBeDefined();
    expect(bingo.deletedById).toBe(requester.id);
    const updatedBingoParticipant = await dataSource.getRepository(BingoParticipant).findOne({
      where: {
        bingoId,
        userId: requester.id,
      },
      withDeleted: true,
    });
    if (updatedBingoParticipant) {
      expect(updatedBingoParticipant.deletedAt).toBeDefined();
      expect(updatedBingoParticipant.deletedById).toBe(requester.id);
    } else {
      fail('BingoParticipant was not found, but it was expected to exist.');
    }
  });
});
