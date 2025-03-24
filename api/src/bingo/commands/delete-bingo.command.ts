import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Command, CommandHandler, EventBus, QueryBus } from '@nestjs/cqrs';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { DataSource, Repository } from 'typeorm';

import { Roles } from '@/auth/roles/roles.constants';
import { userHasRole } from '@/auth/roles/roles.utils';
import { GetBingoParticipantsQuery } from '@/bingo-participant/queries/get-bingo-participants.query';
import { BingoRoles } from '@/bingo-participant/roles/bingo-roles.constants';
import { userHasBingoRole } from '@/bingo-participant/roles/bingo-roles.utils';
import { I18nTranslations } from '@/i18n/types';
import { User } from '@/user/user.entity';

import { Bingo } from '../bingo.entity';
import { BingoDeletedEvent } from '../events/bingo-deleted.event';

export type DeleteBingoParams = {
  requester: User;
  bingoId: number;
};

export type DeleteBingoResult = Bingo;

export class DeleteBingoCommand extends Command<DeleteBingoResult> {
  constructor(public readonly params: DeleteBingoParams) {
    super();
  }
}

@CommandHandler(DeleteBingoCommand)
export class DeleteBingoHandler {
  constructor(
    @InjectRepository(Bingo)
    private readonly bingoRepository: Repository<Bingo>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteBingoCommand): Promise<DeleteBingoResult> {
    const { requester, bingoId } = command.params;

    const bingo = await this.bingoRepository.findOneBy({ id: bingoId });

    if (!bingo) {
      throw new NotFoundException(this.i18nService.t('bingo.deleteBingo.bingoNotFound'));
    }

    const bingoParticipants = await this.queryBus.execute(new GetBingoParticipantsQuery({ bingoId: bingoId }));

    const participant = bingoParticipants.find((participant) => {
      return participant.userId === requester.id;
    });

    const requesterIsModerator = userHasRole(requester, Roles.Moderator);

    if (!requesterIsModerator && (!participant || !userHasBingoRole(participant, BingoRoles.Owner))) {
      throw new UnauthorizedException(this.i18nService.t('bingo.deleteBingo.notAuthorized'));
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .update('bingo_participant')
        .set({
          deletedAt: () => 'CURRENT_TIMESTAMP',
          deletedById: requester.id,
        })
        .where('bingoId = :bingoId', { bingoId })
        .execute();

      bingo.deletedAt = new Date();
      bingo.deletedById = requester.id;

      await queryRunner.manager.save(bingo);
      await queryRunner.commitTransaction();

      this.eventBus.publish(new BingoDeletedEvent({ bingoId, requesterId: requester.id }));
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return bingo;
  }
}
