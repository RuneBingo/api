import { NotFoundException } from '@nestjs/common';
import { Query, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';

import { I18nTranslations } from '@/i18n/types';
import { User } from '@/user/user.entity';

import { Bingo } from '../bingo.entity';

export type FindBingoBySlugParams = {
  titleSlug: string;
  requester: User | undefined;
};

export type FindBingoBySlugResult = Bingo;

export class FindBingoBySlugQuery extends Query<FindBingoBySlugResult> {
  constructor(public readonly params: FindBingoBySlugParams) {
    super();
  }
}

@QueryHandler(FindBingoBySlugQuery)
export class FindBingoBySlugHandler {
  constructor(
    @InjectRepository(Bingo)
    private readonly bingoRepository: Repository<Bingo>,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {}

  async execute(query: FindBingoBySlugQuery): Promise<FindBingoBySlugResult> {
    const { titleSlug, requester } = query.params;
    const q = this.bingoRepository
      .createQueryBuilder('bingo')
      .where('bingo.title_slug = :titleSlug', { titleSlug: titleSlug })
      .leftJoin('bingo_participant', 'bingoParticipant', 'bingoParticipant.bingo_id = bingo.id');
    if (!requester) {
      q.andWhere('bingo.private = false');
    } else {
      q.andWhere(
        '(bingo.private = false OR :requesterRole IN (:...roles) OR bingoParticipant.user_id = :requesterId)',
        {
          requesterId: requester.id,
          requesterRole: requester.role,
          roles: ['moderator', 'admin'],
        },
      );
    }

    const bingo = await q.getOne();
    if (!bingo) {
      throw new NotFoundException(this.i18nService.t('bingo.findBingoByTitleSlug.bingoNotFound'));
    }

    return bingo;
  }
}
