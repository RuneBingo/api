import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { Bingo } from '@/bingo/bingo.entity';
import { StrongEntity } from '@/db/base.entity';
import { User } from '@/user/user.entity';

@Entity()
export class BingoParticipant extends StrongEntity {
  @Column({ name: 'user_id', type: 'int', nullable: false })
  userId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: Promise<User>;

  @Column({ name: 'bingo_id', type: 'int', nullable: false })
  bingoId: number;

  @OneToOne(() => Bingo)
  @JoinColumn({ name: 'bingo_id' })
  bingo: Promise<Bingo>;

  @Column()
  role: string;

  // To implement when bingoTeam is done
  @Column({ name: 'team_id', type: 'int', nullable: true })
  teamId: number | null;
}
