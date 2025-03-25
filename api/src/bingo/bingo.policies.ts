import { User } from '@/user/user.entity';
import { Bingo } from './bingo.entity';
import { BingoParticipant } from '@/bingo-participant/bingo-participant.entity';
import { userHasRole } from '@/auth/roles/roles.utils';
import { Roles } from '@/auth/roles/roles.constants';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { userHasBingoRole } from '@/bingo-participant/roles/bingo-roles.utils';
import { BingoRoles } from '@/bingo-participant/roles/bingo-roles.constants';

export class BingoPolicies {
  constructor(
    private readonly requester: User
  ) {}

  async canCreate(bingoRepository: Repository<Bingo>) {
    const existingBingo = await bingoRepository.findOne({
      where: {
        createdById: this.requester.id,
        endedAt: undefined,
      },
    });
    if (existingBingo) {
      return false;
    }
    return true;
  }
  canUpdate(participant: BingoParticipant | undefined, bingo: Bingo) {
    const requesterIsModerator = userHasRole(this.requester, Roles.Moderator);

    if (!requesterIsModerator && (!participant || bingo.startedAt)) {
      return false;
    }

    return true;
  }

  canDelete(participant: BingoParticipant | undefined) {
    const requesterIsModerator = userHasRole(this.requester, Roles.Moderator);

    if (!requesterIsModerator && (!participant || !userHasBingoRole(participant, BingoRoles.Owner))) {
      return false;
    }

    return true;
  }

  canCancel(participant: BingoParticipant | undefined, bingo: Bingo) {
    const requesterIsModerator = userHasRole(this.requester, Roles.Moderator);

    if (bingo.canceledAt || bingo.endedAt) {
      return false;
    }

    if (!requesterIsModerator && (!participant || !userHasBingoRole(participant, BingoRoles.Organizer))) {
      return false;
    }

    return true;
  }

  canViewActivities(participant: BingoParticipant | undefined) {
    const requesterIsModerator = userHasRole(this.requester, Roles.Moderator);

    if (!participant || (!userHasBingoRole(participant, BingoRoles.Organizer) && !requesterIsModerator)) {
        return false;
    }

    return true;
  }

}
