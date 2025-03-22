import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBingoParticipant1742600909554 implements MigrationInterface {
    name = 'AddBingoParticipant1742600909554'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bingo_participant" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" integer, "user_id" integer NOT NULL, "bingo_id" integer NOT NULL, "role" character varying NOT NULL, "team_id" integer, CONSTRAINT "REL_2000857c368f6de826b909031f" UNIQUE ("user_id"), CONSTRAINT "REL_64b426622b8103171665645d9f" UNIQUE ("bingo_id"), CONSTRAINT "PK_b70732448e1bfe39415b2d204bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bingo_participant" ADD CONSTRAINT "FK_2000857c368f6de826b909031fe" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bingo_participant" ADD CONSTRAINT "FK_64b426622b8103171665645d9f2" FOREIGN KEY ("bingo_id") REFERENCES "bingo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bingo_participant" DROP CONSTRAINT "FK_64b426622b8103171665645d9f2"`);
        await queryRunner.query(`ALTER TABLE "bingo_participant" DROP CONSTRAINT "FK_2000857c368f6de826b909031fe"`);
        await queryRunner.query(`DROP TABLE "bingo_participant"`);
    }

}
