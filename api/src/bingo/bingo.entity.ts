import { IsDate, IsNotEmpty, IsPositive } from 'class-validator';
import { Column, Entity, Generated, OneToOne } from 'typeorm';

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
  @IsPositive()
  width: number;

  @Column({ default: 5 })
  @IsPositive()
  height: number;

  @Column()
  @IsPositive()
  @IsNotEmpty()
  fullLineValue: number;

  @Column()
  @IsDate()
  startDate: Date;

  @Column()
  @IsDate()
  endDate: Date;

  @Column({ nullable: true })
  @IsDate()
  startedAt: Date;

  @OneToOne(() => User, (user: User) => user.id)
  startedBy: number;

  @Column({ nullable: true })
  @IsDate()
  endedAt: Date;

  @OneToOne(() => User, (user: User) => user.id)
  endedBy: number;

  @Column({ nullable: true })
  @IsDate()
  cancelledAt: Date;

  @OneToOne(() => User, (user: User) => user.id)
  cancelledBy: number;
}
