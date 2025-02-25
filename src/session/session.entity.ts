import { Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from '../user/user.entity';

@Entity()
class Session {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true, type: 'uuid' })
  @Generated('uuid')
  readonly uuid: string;

  @Column({ length: 255 })
  sessionID: string;

  @Column({ length: 255, default: 'credentials' })
  method: string;

  @Column({ length: 64 })
  ipAddress: string;

  @Column({ length: 255 })
  userAgent: string;

  @Column({ length: 255 })
  deviceType: string;

  @Column({ length: 255 })
  os: string;

  @Column({ length: 255 })
  browser: string;

  @Column({ length: 255 })
  location: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  signedOutAt: Date | null = null;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @Column({ type: 'timestamptz' })
  lastSeenAt: Date;

  @ManyToOne(() => User, (user: User) => user.sessions)
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;

  @Column()
  userId: number;

  get isSignedOut() {
    return this.signedOutAt !== null || (this.expiresAt !== null && this.expiresAt < new Date());
  }

  signOut() {
    if (this.signedOutAt) {
      return;
    }

    this.signedOutAt = new Date();
  }
}

export default Session;
