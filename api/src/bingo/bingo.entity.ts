import { Column, Entity, Generated, JoinColumn, ManyToOne } from 'typeorm';

import { StrongEntity, StrongEntityParanoid } from '@/db/base.entity';
import { User } from '@/user/user.entity';

@Entity()
export class Bingo extends StrongEntityParanoid {
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

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @ManyToOne(() => User, { nullable: true, lazy: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: Promise<User>;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: Promise<User>;

  @Column({ nullable: true, type: 'timestamptz' })
  startedAt: Date;

  @Column({ name: 'started_by', type: 'int', nullable: true })
  startedById: number | null = null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'started_by' })
  startedBy: Promise<User>;

  @Column({ nullable: true, type: 'timestamptz' })
  endedAt: Date;

  @Column({ name: 'ended_by', type: 'int', nullable: true })
  endedById: number | null = null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'ended_by' })
  endedBy: Promise<User>;

  @Column({ nullable: true, type: 'timestamptz' })
  canceledAt: Date;

  @Column({ name: 'canceled_by', type: 'int', nullable: true })
  canceledById: number | null = null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'canceled_by' })
  canceledBy: Promise<User>;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({name: 'deleted_by'})
  deletedBy: Promise<User>

  @Column({type: 'timestamptz', nullable: true})
  maxRegistrationDate: Date;
}
