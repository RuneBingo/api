import { NotFoundException } from '@nestjs/common';
import { Query, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';

import { I18nTranslations } from '@/i18n/types';
import { type User } from '@/user/user.entity';

import { Bingo } from '../bingo.entity';

export type FindBingoByIdParams = {
  bingoId: number;
  requester: User | undefined;
};

export type FindBingoByIdResult = Bingo;

export class FindBingoByIdQuery extends Query<FindBingoByIdResult> {
  constructor(public readonly params: FindBingoByIdParams) {
    super();
  }
}

@QueryHandler(FindBingoByIdQuery)
export class FindBingoByIdHandler {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    @InjectRepository(Bingo)
    private readonly bingoRepository: Repository<Bingo>,

    private readonly queryBus: QueryBus,
  ) {}

  async execute(query: FindBingoByIdQuery): Promise<FindBingoByIdResult> {
    const bingoId = Number(query.params.bingoId);
    const q = this.bingoRepository
      .createQueryBuilder('bingo')
      .where('bingo.id = :bingoId', { bingoId: bingoId })
      .leftJoin('bingo_participant', 'bingoParticipant', 'bingoParticipant.bingo_id = bingo.id');
    if (!query.params.requester) {
      q.andWhere('bingo.private = false');
    } else {
      q.andWhere(
        '(bingo.private = false OR :requesterRole IN (:...roles) OR bingoParticipant.user_id = :requesterId)',
        {
          requesterId: query.params.requester.id,
          requesterRole: query.params.requester.role,
          roles: ['moderator', 'admin'],
        },
      );
    }
    const bingo = await q.getOne();
    if (!bingo) {
      throw new NotFoundException(this.i18nService.t('bingo.findById.notFound'));
    }

    return bingo;
  }
}
