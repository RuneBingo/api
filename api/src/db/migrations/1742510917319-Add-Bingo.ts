import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBingo1742510917319 implements MigrationInterface {
    name = 'AddBingo1742510917319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_694ca5a10460827a3564e66023"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86550f6be89fca233ac583238a"`);
        await queryRunner.query(`CREATE TABLE "bingo" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" integer, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "language" character varying NOT NULL DEFAULT 'en', "title" character varying NOT NULL, "description" character varying NOT NULL, "private" boolean NOT NULL, "width" integer NOT NULL DEFAULT '5', "height" integer NOT NULL DEFAULT '5', "full_line_value" integer NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "started_at" TIMESTAMP, "ended_at" TIMESTAMP, "cancelled_at" TIMESTAMP, CONSTRAINT "UQ_f60383e8ca8d750a8bf7a45f7b6" UNIQUE ("uuid"), CONSTRAINT "PK_852d0aee265c4f8df4d04873f21" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "userId"`);
        await queryRunner.query(`CREATE INDEX "IDX_52f62a9a442b3e45f942f1ff0c" ON "user" ("deleted_at") WHERE "deleted_at" IS NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_f15a1e032b752248437bd1e17b" ON "user" ("deleted_at") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_30e98e8746699fb9af235410aff" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_30e98e8746699fb9af235410aff"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f15a1e032b752248437bd1e17b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_52f62a9a442b3e45f942f1ff0c"`);
        await queryRunner.query(`ALTER TABLE "session" ADD "userId" integer`);
        await queryRunner.query(`DROP TABLE "bingo"`);
        await queryRunner.query(`CREATE INDEX "IDX_86550f6be89fca233ac583238a" ON "user" ("deleted_at") WHERE (deleted_at IS NULL)`);
        await queryRunner.query(`CREATE INDEX "IDX_694ca5a10460827a3564e66023" ON "user" ("deleted_at") WHERE (deleted_at IS NOT NULL)`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
