import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/**
 * **Do not use this class directly, only extend it!**
 *
 * A base entity is the default entity structure any entity in the database should follow.
 */
export abstract class BaseEntity {
  @CreateDateColumn({ type: 'timestamptz' })
  readonly createdAt: Date;

  /**
   * The ID of the user who created the entity.
   *
   * - If the entity was created by the system, this field is `null`.
   */
  @Column({ type: 'int', nullable: true })
  readonly createdBy: number | null;

  @UpdateDateColumn({ type: 'timestamptz' })
  readonly updatedAt: Date;

  /**
   * The ID of the user who last updated the entity.
   *
   * - If the entity was updated by the system, this field is `null`.
   */
  @Column({ type: 'int', nullable: true })
  updatedBy: number | null;
}

/**
 * **Do not use this class directly, only extend it!**
 *
 * A base entity with soft delete functionality.
 */
export abstract class BaseEntityParanoid extends BaseEntity {
  /**
   * The date when the entity was deleted.
   *
   * - If the entity is not deleted, this field is `null`.
   */
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  /**
   * The ID of the user who deleted the entity.
   *
   * - If the entity was deleted by the system, this field is `null`.
   * - If the entity is not deleted, this field is `null`.
   */
  @Column({ type: 'int', nullable: true })
  deletedBy: number | null;
}

/**
 * **Do not use this class directly, only extend it!**
 *
 * A strong entity is a base entity with a generated primary key.
 */
export abstract class StrongEntity extends BaseEntity {
  /**
   * **Do not expose this field to the client!**
   *
   * This generated id is used as the primary key for the entity, as well as the foreign key in other entities in the database.
   *
   * If you need to expose a unique identifier to the client, you should instead add a UUID field to this entity.
   */
  @PrimaryGeneratedColumn()
  readonly id: number;
}

/**
 * **Do not use this class directly, only extend it!**
 *
 * A strong entity with soft delete functionality.
 */
export abstract class StrongEntityParanoid extends BaseEntityParanoid {
  /**
   * **Do not expose this field to the client!**
   *
   * This generated id is used as the primary key for the entity, as well as the foreign key in other entities in the database.
   *
   * If you need to expose a unique identifier to the client, you should instead add a UUID field to this entity.
   */
  @PrimaryGeneratedColumn()
  readonly id: number;
}
