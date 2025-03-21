import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBingoColumns1742523524826 implements MigrationInterface {
    name = 'AddBingoColumns1742523524826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bingo" ADD "started_by" integer`);
        await queryRunner.query(`ALTER TABLE "bingo" ADD "ended_by" integer`);
        await queryRunner.query(`ALTER TABLE "bingo" ADD "cancelled_by" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bingo" DROP COLUMN "cancelled_by"`);
        await queryRunner.query(`ALTER TABLE "bingo" DROP COLUMN "ended_by"`);
        await queryRunner.query(`ALTER TABLE "bingo" DROP COLUMN "started_by"`);
    }

}
