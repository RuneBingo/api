export type SessionSignedOutParams = {
  sessionId: number;
  requesterId?: number | null;
};

export class SessionSignedOutEvent {
  public readonly sessionId: number;
  public readonly requesterId: number | null;
  public readonly method: string;
  public readonly emailVerified: boolean;

  constructor({ sessionId, requesterId = null }: SessionSignedOutParams) {
    this.sessionId = sessionId;
    this.requesterId = requesterId;
  }
}
