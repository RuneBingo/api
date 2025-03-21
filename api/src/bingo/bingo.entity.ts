import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { StrongEntity } from '@/db/base.entity';
import { User } from '@/user/user.entity';

@Entity()
export class Bingo extends StrongEntity {
  @Column({ unique: true, type: 'uuid' })
  @Generated('uuid')
  uuid: string;

  @Column({ default: 'en' })
  language: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  private: boolean;

  @Column({ default: 5 })
  width: number;

  @Column({ default: 5 })
  height: number;

  @Column()
  fullLineValue: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ nullable: true })
  startedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({name: 'started_by'})
  startedBy: Promise<User>;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({name: 'created_by'})
  creator: Promise<User>;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({name: 'updated_by'})
  updater: Promise<User>;

  @Column({ nullable: true })
  endedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({name: 'ended_by'})
  endedBy: Promise<User>;

  @Column({ nullable: true })
  cancelledAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({name: 'cancelled_by'})
  cancelledBy: Promise<User>;
}
