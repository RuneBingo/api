import { BadRequestException } from '@nestjs/common';

import { User } from './user.entity';

describe('User', () => {
  it('normalizes emails adequately', () => {
    expect(User.normalizeEmail('jOHn.dOe@gmaIL.com')).toBe('john.doe@gmail.com');
  });

  it('changes email if it is valid', () => {
    const user = new User();
    expect(() => user.changeEmail('john.doe@gmail.com')).not.toThrow();
    expect(user.email).toBe('john.doe@gmail.com');
  });

  it('verifies the email if it is not already verified', () => {
    const user = new User();
    expect(() => user.verifyEmail()).not.toThrow();
    expect(user.emailVerified).toBe(true);
  });

  it('throws an error when changing email to an invalid one', () => {
    const user = new User();
    expect(() => user.changeEmail('invalid')).toThrow(BadRequestException);
    expect(() => user.changeEmail('invalid@')).toThrow(BadRequestException);
    expect(() => user.changeEmail('invalid.com')).toThrow(BadRequestException);
  });

  it('throws an error when verifying an already verified email', () => {
    const user = new User();
    user.emailVerified = true;
    expect(() => user.verifyEmail()).toThrow(BadRequestException);
  });
});
