import { Column, Entity, Index } from 'typeorm';

import { StrongEntity } from '@/db/base.entity';

export type ActivityParameters = {
  [key: string]: string | number | boolean | object | null;
};

@Entity()
@Index(['trackableType', 'trackableId'])
export class Activity extends StrongEntity {
  @Column()
  trackableType: string;

  @Column()
  trackableId: number;

  @Column()
  key: string;

  @Column({ type: 'jsonb', nullable: true })
  parameters: ActivityParameters | null;
}
