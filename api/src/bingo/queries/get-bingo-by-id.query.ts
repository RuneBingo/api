import { Query, QueryBus, QueryHandler } from '@nestjs/cqrs';

import { type User } from '@/user/user.entity';

import { Bingo } from '../bingo.entity';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/i18n/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

export type GetBingoByIdParams = {
  bingoId: number;
  requester: User | undefined;
};

export type GetBingoByIdResult = Bingo;

export class GetBingoByIdQuery extends Query<GetBingoByIdResult> {
  constructor(public readonly params: GetBingoByIdParams) {
    super();
  }
}

@QueryHandler(GetBingoByIdQuery)
export class GetBingoByIdHandler {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    @InjectRepository(Bingo)
    private readonly bingoRepository: Repository<Bingo>,

    private readonly queryBus: QueryBus,
  ) {}

  async execute(query: GetBingoByIdQuery): Promise<GetBingoByIdResult> {
    console.log("Requester id:", query.params.requester!.id)
    console.log("Requester role", query.params.requester!.role)
    const bingoId = Number(query.params.bingoId);
    const q = this.bingoRepository
      .createQueryBuilder('bingo')
      .where('bingo.id = :bingoId', { bingoId: bingoId })
      .leftJoin('bingo_participant', 'bingoParticipant', 'bingoParticipant.bingo_id = bingo.id')
    if (!query.params.requester) {
      q.andWhere('bingo.private = false');
    } else {
      q.andWhere('(bingo.private = false OR :requesterRole IN (:...roles) OR bingoParticipant.user_id = :requesterId)', {
        requesterId: query.params.requester.id,
        requesterRole: query.params.requester.role,
        roles: ['moderator', 'admin']
      });
    }

    const bingo = await q.getOne();
    console.log("Found bingo:", bingo);
    if (!bingo) {
      throw new NotFoundException();
    }

    return bingo;
  }
}
