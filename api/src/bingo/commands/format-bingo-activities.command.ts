import { Command, CommandHandler } from '@nestjs/cqrs';

import { type Activity } from '@/activity/activity.entity';
import { ActivityDto } from '@/activity/dto/activity.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/user/user.entity';
import { In, Repository } from 'typeorm';
import { UserDto } from '@/user/dto/user.dto';
import { I18nService, I18nTranslation } from 'nestjs-i18n';
import { I18nTranslations } from '@/i18n/types';

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
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {}

  private readonly usersMap = new Map<number, UserDto>();

  async execute(command: FormatBingoActivitiesCommand): Promise<FormatBingoActivitiesResult> {
    await this.preloadUsers(command.activities);

    const activities = command.activities.map((activity) => {
      const userId = activity.createdById;
      const userDto = userId ? (this.usersMap.get(userId) ?? null) : null;
      const action = this.i18nService.t('bingo.activityActions.'+ activity.key.split('bingo.')[1] as keyof I18nTranslations);
      const title = this.i18nService.t('bingo.formatBingoActivities.title', {args: {action: action, username: userDto?.username}})
      return new ActivityDto(userDto, activity.createdAt, activity.key, title);
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
