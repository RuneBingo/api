import { Command } from '@nestjs/cqrs';

import { type Activity } from '@/activity/activity.entity';
import { type ActivityDto } from '@/activity/dto/activity.dto';

import { type BingoDto } from '../dto/bingo.dto';

export type FormatBingoActivitiesResult = ActivityDto<BingoDto>[];

export class FormatBingoActivitiesCommand extends Command<FormatBingoActivitiesResult> {
  constructor(public readonly activities: Activity[]) {
    super();
  }
}
