import { CommandHandler } from '@nestjs/cqrs';
import { UpdateBingoCommand, UpdateBingoParams, UpdateBingoResult } from './update-bingo-command';
import { InjectRepository } from '@nestjs/typeorm';
import { Bingo } from '../bingo.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/i18n/types';

@CommandHandler(UpdateBingoCommand)
export class UpdateBingoHandler {
  constructor(
    @InjectRepository(Bingo)
    private readonly bingoRepository: Repository<Bingo>,
    private readonly i18nService: I18nService<I18nTranslations>
  ) {}

  async execute(command: UpdateBingoCommand): Promise<UpdateBingoResult> {
    const { requester, bingoId, updateBingoDto } = command.params;

    let bingo = await this.bingoRepository.findOneBy({id: bingoId});

    if (!bingo) {
        throw new NotFoundException(this.i18nService.t('bingo.updateBingo.bingoNotFound'));
    }

    if (bingo.startedAt) {
        throw new BadRequestException(this.i18nService.t('bingo.updateBingo.bingoNotPending'));
    }

    // Todo
    // Verify that the user is the owner of the bingo

    const updates = Object.fromEntries(
        Object.entries(updateBingoDto).filter(([key, value]) => value !== undefined && value !== bingo![key])
    ) as UpdateBingoParams['updateBingoDto'];

    if (updates.description) {
        bingo.description = updates.description;
    }

    if (updates.startDate) {
        bingo.startDate = updates.startDate;
    }

    if (updates.endDate) {
        bingo.endDate = updates.endDate;
    }

    if (updates.language) {
        bingo.language = updates.language;
    }

    if (updates.private) {
        bingo.private = updates.private;
    }

    if (updates.title) {
        bingo.title = updates.title;
    }

    if (updates.fullLineValue) {
        bingo.fullLineValue = updates.fullLineValue;
    }

    bingo = await this.bingoRepository.save(bingo)

    return bingo;
  }
}
