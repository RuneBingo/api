import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;
}
