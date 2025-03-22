import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBingoParticipants1742606635431 implements MigrationInterface {
    name = 'AddBingoParticipants1742606635431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bingo_participant" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" integer, "user_id" integer NOT NULL, "bingo_id" integer NOT NULL, "role" character varying NOT NULL, "team_id" integer, CONSTRAINT "PK_b70732448e1bfe39415b2d204bc" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "bingo_participant"`);
    }

}
