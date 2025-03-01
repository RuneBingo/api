export type UserCreatedParams = {
  userId: number;
  requesterId?: number | null;
  email: string;
  emailVerified: boolean;
};

export class UserCreatedEvent {
  public readonly userId: number;
  public readonly requesterId: number | null;
  public readonly email: string;
  public readonly emailVerified: boolean;

  constructor({ userId, requesterId = null, email, emailVerified }: UserCreatedParams) {
    this.userId = userId;
    this.requesterId = requesterId;
    this.email = email;
    this.emailVerified = emailVerified;
  }
}
