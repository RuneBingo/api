import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBingoAddBingoParticipant1742928433529 implements MigrationInterface {
    name = 'AddBingoAddBingoParticipant1742928433529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_694ca5a10460827a3564e66023"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86550f6be89fca233ac583238a"`);
        await queryRunner.query(`CREATE TABLE "bingo" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" integer, "language" character varying NOT NULL DEFAULT 'en', "title" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying NOT NULL, "private" boolean NOT NULL, "width" integer NOT NULL DEFAULT '5', "height" integer NOT NULL DEFAULT '5', "full_line_value" integer NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "started_at" TIMESTAMP WITH TIME ZONE, "started_by" integer, "ended_at" TIMESTAMP WITH TIME ZONE, "ended_by" integer, "canceled_at" TIMESTAMP WITH TIME ZONE, "canceled_by" integer, "max_registration_date" date, CONSTRAINT "PK_852d0aee265c4f8df4d04873f21" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6aa272dc908ff1a20a3f38d2ce" ON "bingo" ("deleted_at") WHERE "deleted_at" IS NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_ef43e9b55583c5a8c26b0e7d84" ON "bingo" ("deleted_at") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE TABLE "bingo_participant" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" integer, "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" integer, "user_id" integer NOT NULL, "bingo_id" integer NOT NULL, "role" character varying NOT NULL DEFAULT 'participant', "team_id" integer, CONSTRAINT "PK_b70732448e1bfe39415b2d204bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a58d3b32bd780fb8ecb31f34e9" ON "bingo_participant" ("deleted_at") WHERE "deleted_at" IS NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_019a81ca6d8d79f09f58e5c030" ON "bingo_participant" ("deleted_at") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "userId"`);
        await queryRunner.query(`CREATE INDEX "IDX_52f62a9a442b3e45f942f1ff0c" ON "user" ("deleted_at") WHERE "deleted_at" IS NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_f15a1e032b752248437bd1e17b" ON "user" ("deleted_at") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_30e98e8746699fb9af235410aff" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bingo" ADD CONSTRAINT "FK_dbf0d646482b24af7471ea410d4" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bingo" ADD CONSTRAINT "FK_2776f0f7f3f4d716ce0fe126007" FOREIGN KEY ("updated_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bingo" ADD CONSTRAINT "FK_7a5186900bca7e36c353716723e" FOREIGN KEY ("started_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bingo" ADD CONSTRAINT "FK_b8c09a534d6b55512001510e349" FOREIGN KEY ("ended_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bingo" ADD CONSTRAINT "FK_e1492766d93dfc46722ba9688aa" FOREIGN KEY ("canceled_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bingo" ADD CONSTRAINT "FK_c5601c0da9c898c6c0ed96d8c87" FOREIGN KEY ("deleted_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE UNIQUE INDEX unique_slug_not_deleted ON bingo (slug)WHERE DELETED_AT IS NULL;`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bingo" DROP CONSTRAINT "FK_c5601c0da9c898c6c0ed96d8c87"`);
        await queryRunner.query(`ALTER TABLE "bingo" DROP CONSTRAINT "FK_e1492766d93dfc46722ba9688aa"`);
        await queryRunner.query(`ALTER TABLE "bingo" DROP CONSTRAINT "FK_b8c09a534d6b55512001510e349"`);
        await queryRunner.query(`ALTER TABLE "bingo" DROP CONSTRAINT "FK_7a5186900bca7e36c353716723e"`);
        await queryRunner.query(`ALTER TABLE "bingo" DROP CONSTRAINT "FK_2776f0f7f3f4d716ce0fe126007"`);
        await queryRunner.query(`ALTER TABLE "bingo" DROP CONSTRAINT "FK_dbf0d646482b24af7471ea410d4"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_30e98e8746699fb9af235410aff"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f15a1e032b752248437bd1e17b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_52f62a9a442b3e45f942f1ff0c"`);
        await queryRunner.query(`ALTER TABLE "session" ADD "userId" integer`);
        await queryRunner.query(`DROP INDEX "public"."IDX_019a81ca6d8d79f09f58e5c030"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a58d3b32bd780fb8ecb31f34e9"`);
        await queryRunner.query(`DROP TABLE "bingo_participant"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ef43e9b55583c5a8c26b0e7d84"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6aa272dc908ff1a20a3f38d2ce"`);
        await queryRunner.query(`DROP TABLE "bingo"`);
        await queryRunner.query(`CREATE INDEX "IDX_86550f6be89fca233ac583238a" ON "user" ("deleted_at") WHERE (deleted_at IS NULL)`);
        await queryRunner.query(`CREATE INDEX "IDX_694ca5a10460827a3564e66023" ON "user" ("deleted_at") WHERE (deleted_at IS NOT NULL)`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP INDEX unique_slug_not_deleted;`);
    }

}
