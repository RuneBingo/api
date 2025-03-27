import { Column, Entity, JoinColumn, ManyToMany } from 'typeorm';

import { Bingo } from '@/bingo/bingo.entity';
import { StrongEntityParanoid } from '@/db/base.entity';
import { User } from '@/user/user.entity';

import { BingoRoles } from './roles/bingo-roles.constants';

@Entity()
export class BingoParticipant extends StrongEntityParanoid {
  @Column({ name: 'user_id', type: 'int', nullable: false })
  userId: number;

  @ManyToMany(() => User)
  @JoinColumn({ name: 'user_id' })
  user: Promise<User>;

  @Column({ name: 'bingo_id', type: 'int', nullable: false })
  bingoId: number;

  @ManyToMany(() => Bingo)
  @JoinColumn({ name: 'bingo_id' })
  bingo: Promise<Bingo>;

  @Column({ type: 'varchar', default: 'participant' })
  role: BingoRoles;

  // To implement when bingoTeam is done
  @Column({ name: 'team_id', type: 'int', nullable: true })
  teamId: number | null;
}
