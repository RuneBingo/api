export type SessionCreatedParams = {
  sessionId: number;
  requesterId?: number | null;
};

export class SessionCreatedEvent {
  public readonly sessionId: number;
  public readonly requesterId: number | null;

  constructor({ sessionId, requesterId = null }: SessionCreatedParams) {
    this.sessionId = sessionId;
    this.requesterId = requesterId;
  }
}
