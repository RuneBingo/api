import { Command, CommandHandler, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { type User } from '@/user/user.entity';

import { Bingo } from '../bingo.entity';
import { BingoCreatedEvent } from '../events/bingo-created.event';

export type CreateBingoParams = {
  requester: User;
  language: string;
  title: string;
  description: string;
  isPrivate: boolean;
  width: number;
  height: number;
  fullLineValue: number;
  startDate: Date;
  endDate: Date;
};

export type CreateBingoResult = Bingo;

export class CreateBingoCommand extends Command<CreateBingoResult> {
  public readonly requester: User;
  public readonly language: string;
  public readonly title: string;
  public readonly description: string;
  public readonly isPrivate: boolean;
  public readonly width: number;
  public readonly height: number;
  public readonly fullLineValue: number;
  public readonly startDate: Date;
  public readonly endDate: Date;
  constructor({
    requester,
    language,
    title,
    description,
    isPrivate,
    width,
    height,
    fullLineValue,
    startDate,
    endDate,
  }: CreateBingoParams) {
    super();
    this.requester = requester;
    this.language = language;
    this.title = title;
    this.description = description;
    this.isPrivate = isPrivate;
    this.width = width;
    this.height = height;
    this.fullLineValue = fullLineValue;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

@CommandHandler(CreateBingoCommand)
export class CreateBingoHandler {
  constructor(
    @InjectRepository(Bingo)
    private readonly bingoRepository: Repository<Bingo>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateBingoCommand): Promise<CreateBingoResult> {
    const { requester, language, title, description, isPrivate, width, height, fullLineValue, startDate, endDate } =
      command;

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    console.log(formattedStartDate);

    const bingo = new Bingo();
    bingo.createdById = requester.id;
    bingo.language = language;
    bingo.title = title;
    bingo.description = description;
    bingo.private = isPrivate;
    bingo.width = width;
    bingo.height = height;
    bingo.fullLineValue = fullLineValue;
    bingo.startDate = formattedStartDate;
    bingo.endDate = formattedEndDate;
    bingo.createdById = command.requester.id;
    bingo.createdBy = Promise.resolve(requester);
    await this.bingoRepository.save(bingo);

    this.eventBus.publish(
      new BingoCreatedEvent({
        bingoId: bingo.id,
        requesterId: command.requester.id,
        language,
        title,
        description,
        private: isPrivate,
        width,
        height,
        fullLineValue,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      }),
    );

    return bingo;
  }
}
