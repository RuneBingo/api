import { addWeeks } from 'date-fns';

import { Session } from './session.entity';

describe('Session', () => {
  it('is signed out when signedOutAt is not null', () => {
    const session = new Session();
    session.signedOutAt = new Date();

    expect(session.isSignedOut).toBe(true);
  });

  it('is signed out when expiresAt is in the past', () => {
    const session = new Session();
    session.expiresAt = addWeeks(new Date(), -1);

    expect(session.isSignedOut).toBe(true);
  });

  it('is not signed out when signedOutAt is null and expiresAt is in the future', () => {
    const session = new Session();
    session.expiresAt = addWeeks(new Date(), 1);

    expect(session.isSignedOut).toBe(false);
  });

  it('signs out the session', () => {
    const session = new Session();
    session.signOut();

    expect(session.signedOutAt).not.toBeNull();
  });
});
