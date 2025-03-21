import { Column, Entity, Generated, OneToMany } from 'typeorm';

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

  @Column({ nullable: true })
  @OneToMany(() => User, (user: User) => user.id)
  startedBy: number;

  @Column({ nullable: true })
  endedAt: Date;

  @Column({ nullable: true })
  @OneToMany(() => User, (user: User) => user.id)
  endedBy: number;

  @Column({ nullable: true })
  cancelledAt: Date;

  @Column({ nullable: true })
  @OneToMany(() => User, (user: User) => user.id)
  cancelledBy: number;
}
