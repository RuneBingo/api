import { Column, Entity, Index } from 'typeorm';

import { StrongEntity } from '@/db/base.entity';

export type ActivityParameters = {
  [key: string]: string | number | boolean | object | null;
};

@Entity()
@Index(['key'])
@Index(['trackableType', 'trackableId'])
@Index(['trackableType', 'trackableId', 'key'])
export class Activity extends StrongEntity {
  @Column()
  trackableType: string;

  @Column()
  trackableId: number;

  @Column()
  key: string;

  @Column({ type: 'jsonb', nullable: true })
  parameters: ActivityParameters | null = null;
}
