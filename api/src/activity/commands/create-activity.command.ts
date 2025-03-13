import { Command } from '@nestjs/cqrs';

import type { Activity, ActivityParameters } from '../activity.entity';

export type CreateActivityParams = {
  key: string;
  requesterId: number | null;
  trackableType: string;
  trackableId: number;
  parameters?: ActivityParameters | null;
};

export type CreateActivityResult = Activity;

export class CreateActivityCommand extends Command<CreateActivityResult> {
  public readonly key: string;
  public readonly requesterId: number | null;
  public readonly trackableType: string;
  public readonly trackableId: number;
  public readonly parameters: ActivityParameters | null;

  constructor({ key, requesterId, trackableType, trackableId, parameters = null }: CreateActivityParams) {
    super();

    this.key = key;
    this.requesterId = requesterId;
    this.trackableType = trackableType;
    this.trackableId = trackableId;
    this.parameters = parameters;
  }
}
