import { SeedingService } from '@/db/seeding/seeding.service';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateBingoCommand, UpdateBingoHandler } from './update-bingo.command';
import { configModule } from '@/config';
import { dbModule } from '@/db';
import { i18nModule } from '@/i18n';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bingo } from '../bingo.entity';
import { User } from '@/user/user.entity';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { BingoParticipant } from '@/bingo-participant/bingo-participant.entity';
import { BingoUpdatedEvent } from '../events/bingo-updated.event';

describe('UpdateBingoHandler', () => {
  let module: TestingModule;
  let seedingService: SeedingService;
  let eventBus: jest.Mocked<EventBus>;
  let handler: UpdateBingoHandler;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [configModule, dbModule, i18nModule, TypeOrmModule.forFeature([Bingo, User, BingoParticipant])],
      providers: [
        UpdateBingoHandler,
        SeedingService,
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(UpdateBingoHandler);
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

  it('throws ForbiddenException if the requester is not a participant or a moderator', async () => {
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

  it('throws BadRequest if the end date is before the start date', async () => {
    const requester = seedingService.getEntity(User, 'char0o');

    const command = new UpdateBingoCommand({
      requester,
      bingoId: 1,
      updates: {
        endDate: '2025-03-01',
      },
    });

    await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequest if the start date is after the end date during same update', async () => {
    const requester = seedingService.getEntity(User, 'char0o');

    const command = new UpdateBingoCommand({
      requester,
      bingoId: 1,
      updates: {
        startDate: '2025-04-10',
        endDate: '2025-04-05',
      },
    });

    await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequest if the start date is after the end date', async () => {
    const requester = seedingService.getEntity(User, 'char0o');

    const command = new UpdateBingoCommand({
      requester,
      bingoId: 1,
      updates: {
        startDate: '2025-05-01',
      },
    });

    await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequest if the registration date is after the start date', async () => {
    const requester = seedingService.getEntity(User, 'char0o');

    const command = new UpdateBingoCommand({
      requester,
      bingoId: 1,
      updates: {
        maxRegistrationDate: '2025-04-10',
      },
    });

    await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequest if the registration date is after the start date during the same update', async () => {
    const requester = seedingService.getEntity(User, 'char0o');

    const command = new UpdateBingoCommand({
      requester,
      bingoId: 1,
      updates: {
        startDate: '2025-03-05',
        maxRegistrationDate: '2025-03-25',
      },
    });

    await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
  });

  it('updates the bingo user has at least moderator and emits UpdatedBingo event', async () => {
    const requester = seedingService.getEntity(User, 'zezima');

    const command = new UpdateBingoCommand({
      requester,
      bingoId: 1,
      updates: {
        description: 'Test description',
      },
    });

    const bingo = await handler.execute(command);
    expect(bingo).toBeDefined();
    expect(bingo.title).toBe('OSRS QC');
    expect(bingo.slug).toBe('osrs-qc');
    expect(bingo.description).toBe('Test description');
    expect(bingo.private).toBe(true);
    expect(bingo.width).toBe(5);
    expect(bingo.createdById).toBe(1);
    expect(bingo.height).toBe(5);
    expect(bingo.fullLineValue).toBe(100);
    expect(bingo.startDate).toBe('2025-04-01');
    expect(bingo.endDate).toBe('2025-04-30');
    expect(bingo.language).toBe('en');
    expect(bingo.isDeleted).toBe(false);
    expect(bingo.createdAt).toBeDefined();
    expect(bingo.updatedAt).toBeDefined();
    expect(bingo.updatedById).toBe(requester.id);
    expect(bingo.maxRegistrationDate).toBe('2025-03-31');

    expect(eventBus.publish).toHaveBeenCalledWith(
      new BingoUpdatedEvent({
        bingoId: bingo.id,
        requesterId: requester.id,
        updates: {
          description: bingo.description,
        },
      }),
    );
  });

  it('updates the bingo if user is at least organizer', async () => {
    const requester = seedingService.getEntity(User, 'didiking');

    const command = new UpdateBingoCommand({
      requester,
      bingoId: 1,
      updates: {
        description: 'Test description',
      },
    });

    const bingo = await handler.execute(command);
    expect(bingo).toBeDefined();
    expect(bingo.title).toBe('OSRS QC');
    expect(bingo.slug).toBe('osrs-qc');
    expect(bingo.description).toBe('Test description');
    expect(bingo.private).toBe(true);
    expect(bingo.width).toBe(5);
    expect(bingo.createdById).toBe(1);
    expect(bingo.height).toBe(5);
    expect(bingo.fullLineValue).toBe(100);
    expect(bingo.startDate).toBe('2025-04-01');
    expect(bingo.endDate).toBe('2025-04-30');
    expect(bingo.language).toBe('en');
    expect(bingo.isDeleted).toBe(false);
    expect(bingo.createdAt).toBeDefined();
    expect(bingo.updatedAt).toBeDefined();
    expect(bingo.updatedById).toBe(requester.id);
    expect(bingo.maxRegistrationDate).toBe('2025-03-31');
  });

  it('throws ForbiddenException if the requester is a bingo participant without organizer role', async () => {
    const requester = seedingService.getEntity(User, 'dee420');

    const command = new UpdateBingoCommand({
      requester,
      bingoId: 1,
      updates: {
        title: 'New title',
      },
    });

    await expect(handler.execute(command)).rejects.toThrow(ForbiddenException);
  });

  it('throws NotFound if the bingo is not found', async () => {
    const requester = seedingService.getEntity(User, 'dee420');

    const command = new UpdateBingoCommand({
      requester,
      bingoId: 999,
      updates: {
        title: 'New title',
      },
    });

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('throws BadRequest if slug collides with existing bingo', async () => {
    const requester = seedingService.getEntity(User, 'char0o');

    const command = new UpdateBingoCommand({
      requester,
      bingoId: 1,
      updates: {
        title: 'German OSRS',
      },
    });

    await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
  });

  it('change title even tho slug collides with deleted bingo', async () => {
    const requester = seedingService.getEntity(User, 'char0o');

    const command = new UpdateBingoCommand({
      requester,
      bingoId: 1,
      updates: {
        title: 'Deleted bingo',
      },
    });

    const bingo = await handler.execute(command);
    expect(bingo).toBeDefined();
    expect(bingo.title).toBe('Deleted bingo');
    expect(bingo.slug).toBe('deleted-bingo');
    expect(bingo.description).toBe('Les quebec');
    expect(bingo.private).toBe(true);
    expect(bingo.width).toBe(5);
    expect(bingo.createdById).toBe(1);
    expect(bingo.height).toBe(5);
    expect(bingo.fullLineValue).toBe(100);
    expect(bingo.startDate).toBe('2025-04-01');
    expect(bingo.endDate).toBe('2025-04-30');
    expect(bingo.language).toBe('en');
    expect(bingo.isDeleted).toBe(false);
    expect(bingo.createdAt).toBeDefined();
    expect(bingo.updatedAt).toBeDefined();
    expect(bingo.updatedById).toBe(requester.id);
    expect(bingo.maxRegistrationDate).toBe('2025-03-31');
  });

  it('should update every value', async () => {
    const requester = seedingService.getEntity(User, 'char0o');

    const command = new UpdateBingoCommand({
      requester,
      bingoId: 1,
      updates: {
        title: 'Mon bingo',
        language: 'fr',
        description: 'My custom bingo',
        private: false,
        fullLineValue: 25,
        startDate: '2025-01-01',
        endDate: '2025-02-01',
        maxRegistrationDate: '2024-12-31',
      },
    });

    const bingo = await handler.execute(command);
    expect(bingo).toBeDefined();
    expect(bingo.title).toBe('Mon bingo');
    expect(bingo.slug).toBe('mon-bingo');
    expect(bingo.description).toBe('My custom bingo');
    expect(bingo.private).toBe(false);
    expect(bingo.width).toBe(5);
    expect(bingo.createdById).toBe(1);
    expect(bingo.height).toBe(5);
    expect(bingo.fullLineValue).toBe(25);
    expect(bingo.startDate).toBe('2025-01-01');
    expect(bingo.endDate).toBe('2025-02-01');
    expect(bingo.language).toBe('fr');
    expect(bingo.isDeleted).toBe(false);
    expect(bingo.createdAt).toBeDefined();
    expect(bingo.updatedAt).toBeDefined();
    expect(bingo.updatedById).toBe(requester.id);
    expect(bingo.maxRegistrationDate).toBe('2024-12-31');
  });
});
