import { BadRequestException } from '@nestjs/common';
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

  @Column({ nullable: false, default: false })
  isSuperAdmin: boolean;

  @OneToMany(() => Session, (session: Session) => session.user)
  sessions: Promise<Session[]>;

  get isDisabled() {
    return this.disabledAt !== null;
  }

  static normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  changeEmail(email: string) {
    const emailNormalized = User.normalizeEmail(email);

    if (!User.isValidEmail(emailNormalized)) {
      throw new BadRequestException('Invalid email');
    }

    this.email = email;
    this.emailNormalized = emailNormalized;
    this.emailVerified = false;
  }

  disable() {
    if (this.disabledAt) {
      throw new BadRequestException('User is already disabled');
    }

    this.disabledAt = new Date();
  }

  enable() {
    if (!this.disabledAt) {
      throw new BadRequestException('User is not disabled');
    }

    this.disabledAt = null;
  }

  verifyEmail() {
    if (this.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    this.emailVerified = true;
  }
}
