import { Command, CommandHandler } from '@nestjs/cqrs';

import { type Activity } from '@/activity/activity.entity';
import { ActivityDto } from '@/activity/dto/activity.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/user/user.entity';
import { In, Repository } from 'typeorm';
import { UserDto } from '@/user/dto/user.dto';

export type FormatBingoActivitiesResult = ActivityDto[];

export class FormatBingoActivitiesCommand extends Command<FormatBingoActivitiesResult> {
  constructor(public readonly activities: Activity[]) {
    super();
  }
}

@CommandHandler(FormatBingoActivitiesCommand)
export class FormatBingoActivitiesHandler {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private readonly usersMap = new Map<number, UserDto>();

  async execute(command: FormatBingoActivitiesCommand): Promise<FormatBingoActivitiesResult> {
    await this.preloadUsers(command.activities);

    const activities = command.activities.map((activity) => {
      const userId = activity.createdById;
      const userDto = userId ? (this.usersMap.get(userId) ?? null) : null;
      const action = activity.key.split('bingo.')[1];
      return new ActivityDto(userDto, activity.createdAt, activity.key, `Bingo ${action} by ${userDto?.username}`);
    });

    return activities;
  }

  private async preloadUsers(activities: Activity[]): Promise<void> {
    const userIds = activities.map((activity) => activity.createdById).filter(Boolean) as number[];

    const users = await this.userRepository.find({ where: { id: In(userIds) } });

    users.forEach((user) => {
      this.usersMap.set(user.id, new UserDto(user));
    });
  }
}