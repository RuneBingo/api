import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Activity } from '@/activity/activity.entity';
import { ActivityDto } from '@/activity/dto/activity.dto';
import { UserDto } from '@/user/dto/user.dto';
import { User } from '@/user/user.entity';

import { Bingo } from '../bingo.entity';
import { FormatBingoActivitiesCommand, FormatBingoActivitiesResult } from './format-bingo-activities.command';
import { BingoDto } from '../dto/bingo.dto';

@CommandHandler(FormatBingoActivitiesCommand)
export class FormatBingoActivitiesHandler {
  private bingosMap = new Map<number, BingoDto>();
  private readonly logger = new Logger(FormatBingoActivitiesHandler.name);

  constructor(
    @InjectRepository(Bingo)
    private readonly bingoRepository: Repository<Bingo>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: FormatBingoActivitiesCommand): Promise<FormatBingoActivitiesResult> {
    await this.preloadBingos(command.activities);
    const activities = await Promise.all(
      command.activities.map(
        async (activity) =>
          new ActivityDto(
            await this.getUserById(activity.createdById!),
            activity.createdAt,
            activity.key,
            this.bingosMap.get(activity.trackableId)!,
            'Bingo created',
          ),
      ),
    );

    return activities;
  }

  private async preloadBingos(activities: Activity[]): Promise<void> {
    const bingoIds = activities.map((activity) => activity.trackableId);
    const bingos = await this.bingoRepository.find({ where: { id: In(bingoIds) } });

    bingos.forEach((bingo) => {
      this.bingosMap.set(bingo.id, new BingoDto(bingo));
    });
  }

  private async getUserById(id: number): Promise<UserDto> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .withDeleted()
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new NotFoundException("No user with id found");
    }

    const userDto = new UserDto(user);

    return userDto;
  }
}
