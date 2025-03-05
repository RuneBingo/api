import { User } from './user.entity';

describe('User', () => {
  it('normalizes emails adequately', () => {
    expect(User.normalizeEmail('jOHn.dOe@gmaIL.com')).toBe('john.doe@gmail.com');
  });
});
