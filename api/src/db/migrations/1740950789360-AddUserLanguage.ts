import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserLanguage1740950789360 implements MigrationInterface {
    name = 'AddUserLanguage1740950789360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "language" character varying NOT NULL DEFAULT 'en'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "language"`);
    }

}
