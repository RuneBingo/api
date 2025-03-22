import { NotFoundException } from '@nestjs/common';
import { QueryBus, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';

import { GetBingoParticipantsQuery } from '@/bingo-participant/queries/get-bingo-participants.query';
import { I18nTranslations } from '@/i18n/types';

import { Bingo } from '../bingo.entity';
import { GetBingoByIdQuery, GetBingoByIdResult } from './get-bingo-by-id.query';

@QueryHandler(GetBingoByIdQuery)
export class GetBingoByIdHandler {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    @InjectRepository(Bingo)
    private readonly bingoRepository: Repository<Bingo>,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(query: GetBingoByIdQuery): Promise<GetBingoByIdResult> {
    const whereCondition = { id: query.params.bingoId };

    if (!query.params.requester) {
      whereCondition['private'] = false;
    }

    const bingo = await this.bingoRepository.findOne({
      where: whereCondition,
    });

    if (!bingo) {
      throw new NotFoundException(this.i18nService.t('bingo.findById.notFound'));
    }

    if (bingo.private === false) {
      return bingo;
    }

    const bingoParticipants = await this.queryBus.execute(new GetBingoParticipantsQuery({ bingoId: bingo.id }));

    const participant = bingoParticipants.find((participant) => {
      return participant.userId === query.params.requester!.id;
    });

    if (!participant) {
      throw new NotFoundException(this.i18nService.t('bingo.findById.notFound'));
    }

    return bingo;
  }
}
