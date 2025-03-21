import { NotFoundException } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';

import { I18nTranslations } from '@/i18n/types';

import { Bingo } from '../bingo.entity';
import { FindBingoByIdQuery, FindBingoByIdResult } from './find-bingo-by-id.query';

@QueryHandler(FindBingoByIdQuery)
export class FindBingoByIdHandler {
  constructor(
    private readonly i18nService: I18nService<I18nTranslations>,
    @InjectRepository(Bingo)
    private readonly bingoRepository: Repository<Bingo>,
  ) { }

  async execute(query: FindBingoByIdQuery): Promise<FindBingoByIdResult> {
    const bingo = await this.bingoRepository.findOne({
      where: { id: query.bingoId },
      relations: [
        'creator',
        'updater',
        'cancelledBy',
        'startedBy',
        'endedBy']
    });

    if (!bingo) {
      throw new NotFoundException(this.i18nService.t('bingo.findById.notFound'));
    }

    return bingo;
  }
}
