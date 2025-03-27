import { Scope } from '@/db/scope';

import { type Bingo } from '../bingo.entity';

export class ViewBingoScope extends Scope<Bingo> {
  resolve() {
    if (!this.requester) {
      return this.query.andWhere('bingo.private = false');
    }

    return this.query
      .leftJoin('bingo_participant', 'bingoParticipant', 'bingoParticipant.bingo_id = bingo.id')
      .andWhere('(bingo.private = false OR (:requesterRole IN (:...roles) OR bingoParticipant.user_id = :requesterId))', {
        requesterId: this.requester.id,
        requesterRole: this.requester.role,
        roles: ['moderator', 'admin'],
      });
  }
}
