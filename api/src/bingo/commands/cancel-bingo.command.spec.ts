import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { type TestingModule, Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BingoParticipant } from '@/bingo-participant/bingo-participant.entity';
import { configModule } from '@/config';
import { dbModule } from '@/db';
import { SeedingService } from '@/db/seeding/seeding.service';
import { i18nModule } from '@/i18n';
import { User } from '@/user/user.entity';

import { Bingo } from '../bingo.entity';
import { CancelBingoCommand, CancelBingoHandler } from './cancel-bingo.command';
import { BingoCanceledEvent } from '../events/bingo-canceled.event';

describe('CancelBingoHandler', () => {
  let module: TestingModule;
  let seedingService: SeedingService;
  let eventBus: jest.Mocked<EventBus>;
  let handler: CancelBingoHandler;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [configModule, dbModule, i18nModule, TypeOrmModule.forFeature([Bingo, User, BingoParticipant])],
      providers: [
        CancelBingoHandler,
        SeedingService,
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(CancelBingoHandler);
    eventBus = module.get(EventBus);
    seedingService = module.get(SeedingService);
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

  it('throws ForbiddenException if the requester is not a participant or a at least moderator', async () => {
    const requester = seedingService.getEntity(User, 'b0aty');

    const command = new CancelBingoCommand({
      requester,
      bingoId: 1,
    });

    await expect(handler.execute(command)).rejects.toThrow(ForbiddenException);
  });

  it('throws ForbiddenException if the requester is a bingo participant without organizer role', async () => {
    const requester = seedingService.getEntity(User, 'dee420');

    const command = new CancelBingoCommand({
      requester,
      bingoId: 1,
    });

    await expect(handler.execute(command)).rejects.toThrow(ForbiddenException);
  });

  it('throws BadRequest if bingo is already canceled', async () => {
    const requester = seedingService.getEntity(User, 'char0o');

    const command = new CancelBingoCommand({
      requester,
      bingoId: 6,
    });

    await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
  });

  it('cancels the bingo if user is at least organizer and emits BingoCanceledEvent', async () => {
    const requester = seedingService.getEntity(User, 'didiking');

    const command = new CancelBingoCommand({
      requester,
      bingoId: 1,
    });

    const bingo = await handler.execute(command);
    expect(bingo).toBeDefined();
    expect(bingo.canceledAt).toBeDefined();
    expect(bingo.canceledById).toBe(requester.id);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(eventBus.publish).toHaveBeenCalledWith(
      new BingoCanceledEvent({
        bingoId: bingo.id,
        requesterId: requester.id,
      }),
    );
  });

  it('cancels the bingo if user is at least moderator', async () => {
    const requester = seedingService.getEntity(User, 'zezima');

    const command = new CancelBingoCommand({
      requester,
      bingoId: 1,
    });

    const bingo = await handler.execute(command);
    expect(bingo).toBeDefined();
    expect(bingo.canceledAt).toBeDefined();
    expect(bingo.canceledById).toBe(requester.id);
  });

  it('throws NotFound if the bingo doesnt exist', async () => {
    const requester = seedingService.getEntity(User, 'dee420');

    const command = new CancelBingoCommand({
      requester,
      bingoId: 999,
    });

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });
});
