import { Column, Entity, Generated, OneToMany } from 'typeorm';

import { StrongEntityParanoid } from '@/db/base.entity';
import { Session } from '@/session/session.entity';

@Entity()
export class User extends StrongEntityParanoid {
  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'timestamptz', nullable: true })
  disabledAt: Date | null = null;

  @Column({ type: 'int', nullable: true })
  disabledBy: number | null = null;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ unique: true, length: 255 })
  emailNormalized: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ default: false })
  isSuperAdmin: boolean;

  @Column({ default: 'en' })
  language: string;

  @OneToMany(() => Session, (session: Session) => session.user)
  sessions: Promise<Session[]>;

  get isDisabled() {
    return this.disabledAt !== null;
  }

  static normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }
}
