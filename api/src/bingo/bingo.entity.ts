import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { StrongEntityParanoid } from '@/db/base.entity';
import { User } from '@/user/user.entity';

@Entity()
export class Bingo extends StrongEntityParanoid {
  @Column({ default: 'en' })
  language: string;

  @Column()
  title: string;

  @Column()
  slug: string;

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

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @ManyToOne(() => User, { nullable: true, lazy: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: Promise<User>;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: Promise<User>;

  @Column({ nullable: true, type: 'timestamptz' })
  startedAt: Date | null;

  @Column({ name: 'started_by', type: 'int', nullable: true })
  startedById: number | null = null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'started_by' })
  startedBy: Promise<User>;

  @Column({ nullable: true, type: 'timestamptz' })
  endedAt: Date | null;

  @Column({ name: 'ended_by', type: 'int', nullable: true })
  endedById: number | null = null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'ended_by' })
  endedBy: Promise<User>;

  @Column({ nullable: true, type: 'timestamptz' })
  canceledAt: Date | null;

  @Column({ name: 'canceled_by', type: 'int', nullable: true })
  canceledById: number | null = null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'canceled_by' })
  canceledBy: Promise<User>;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'deleted_by' })
  deletedBy: Promise<User>;

  @Column({ type: 'date', nullable: true })
  maxRegistrationDate: string;
}
