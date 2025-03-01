import { BaseEntityParanoid, StrongEntityParanoid } from './base.entity';

class TestBaseEntityParanoid extends BaseEntityParanoid {}

class TestStrongEntityParanoid extends StrongEntityParanoid {}

describe('BaseEntityParanoid', () => {
  it('is not considered deleted when deletedAt is null', () => {
    const entity = new TestBaseEntityParanoid();
    expect(entity.isDeleted).toBe(false);
  });

  it('is considered deleted when deletedAt is not null', () => {
    const entity = new TestBaseEntityParanoid();
    entity.deletedAt = new Date();
    expect(entity.isDeleted).toBe(true);
  });
});

describe('StrongEntityParanoid', () => {
  it('is not considered deleted when deletedAt is null', () => {
    const entity = new TestStrongEntityParanoid();
    expect(entity.isDeleted).toBe(false);
  });

  it('is considered deleted when deletedAt is not null', () => {
    const entity = new TestStrongEntityParanoid();
    entity.deletedAt = new Date();
    expect(entity.isDeleted).toBe(true);
  });
});
