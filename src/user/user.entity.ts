import { Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import Session from '../session/session.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  readonly uuid: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ unique: true, length: 255 })
  emailNormalized: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: false, default: false })
  isSuperAdmin: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  disabledAt: Date | null;

  @OneToMany(() => Session, (session: Session) => session.user)
  sessions: Promise<Session[]>;

  get isDisabled() {
    return this.disabledAt !== null;
  }

  static normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  static normalizeUsername(username: string) {
    return username.trim().toLowerCase();
  }

  changeEmail(email: string) {
    const emailNormalized = User.normalizeEmail(email);

    this.email = email;
    this.emailNormalized = emailNormalized;
    this.emailVerified = false;
  }

  disable() {
    if (this.disabledAt) {
      throw new Error('User is already disabled');
    }

    this.disabledAt = new Date();
  }

  enable() {
    if (!this.disabledAt) {
      throw new Error('User is not disabled');
    }

    this.disabledAt = null;
  }

  verifyEmail() {
    if (this.emailVerified) {
      throw new Error('Email is already verified');
    }

    this.emailVerified = true;
  }
}

export default User;
