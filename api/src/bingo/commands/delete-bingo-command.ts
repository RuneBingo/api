import { User } from '@/user/user.entity';
import { Command, CommandHandler, QueryBus } from '@nestjs/cqrs';
import { Bingo } from '../bingo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/i18n/types';
import { GetBingoParticipantsQuery } from '@/bingo-participant/queries/get-bingo-participants.query';
import { userHasRole } from '@/auth/roles/roles.utils';
import { Roles } from '@/auth/roles/roles.constants';

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
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: DeleteBingoCommand): Promise<DeleteBingoResult> {
    const { requester, bingoId } = command.params;

    const bingo = await this.bingoRepository.findOneBy({id: bingoId});

    if (!bingo) {
        throw new NotFoundException(this.i18nService.t('bingo.deleteBingo.bingoNotFound'));
    }

    const bingoParticipants = await this.queryBus.execute(new GetBingoParticipantsQuery({bingoId: bingoId}));

    const participant = bingoParticipants.find((participant) => {
        return participant.userId === requester.id;
    });

    const requesterIsModerator = userHasRole(requester, Roles.Moderator);

    if (!requesterIsModerator && (!participant || participant.role !== 'owner')) {
        throw new UnauthorizedException(this.i18nService.t('bingo.deleteBingo.notAuthorized'));
    }

    bingo.deletedAt = new Date();
    bingo.deletedById = requester.id;

    const deletedBingo = await this.bingoRepository.save(bingo);

    return deletedBingo;
  }
}
