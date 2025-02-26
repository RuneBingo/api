import { MigrationInterface, QueryRunner } from "typeorm";

export class AddActivitiesSessionsAndUsers1740533852929 implements MigrationInterface {
    name = 'AddActivitiesSessionsAndUsers1740533852929'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "activity" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" integer, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedBy" integer, "trackableType" character varying NOT NULL, "trackableId" integer NOT NULL, "key" character varying NOT NULL, "parameters" jsonb, CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_83aeb8193e1e98de29e2be2205" ON "activity" ("trackableType", "trackableId", "key") `);
        await queryRunner.query(`CREATE INDEX "IDX_915108ba20912c6119c621f760" ON "activity" ("trackableType", "trackableId") `);
        await queryRunner.query(`CREATE INDEX "IDX_52e2c65f649c102c81c4b4facc" ON "activity" ("key") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" integer, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedBy" integer, "deletedAt" TIMESTAMP WITH TIME ZONE, "deletedBy" integer, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "disabledAt" TIMESTAMP WITH TIME ZONE, "disabledBy" integer, "email" character varying(255) NOT NULL, "emailNormalized" character varying(255) NOT NULL, "emailVerified" boolean NOT NULL DEFAULT false, "isSuperAdmin" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_a95e949168be7b7ece1a2382fed" UNIQUE ("uuid"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_1889d3aecbe55fcf0c45ab233d4" UNIQUE ("emailNormalized"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e84d87037ff1274918c7b2f871" ON "user" ("deletedAt") WHERE "deletedAt" IS NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_a61cb8d191cd7e21cbce349a03" ON "user" ("deletedAt") WHERE "deletedAt" IS NULL`);
        await queryRunner.query(`CREATE TABLE "session" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" integer, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedBy" integer, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "sessionID" character varying(255) NOT NULL, "method" character varying(255) NOT NULL DEFAULT 'credentials', "ipAddress" character varying(64) NOT NULL, "userAgent" character varying(255) NOT NULL, "deviceType" character varying(255) NOT NULL, "os" character varying(255) NOT NULL, "browser" character varying(255) NOT NULL, "location" character varying(255) NOT NULL, "signedOutAt" TIMESTAMP WITH TIME ZONE, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "lastSeenAt" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" integer NOT NULL, CONSTRAINT "UQ_aa8b10fce4746369616ff6a5978" UNIQUE ("uuid"), CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_67ce0ac571b48623338209708b" ON "session" ("userId", "lastSeenAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_a0b80835e18d19fe988fb99a73" ON "session" ("userId", "expiresAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_eb67bfc6f7b8045d4498e37b7d" ON "session" ("userId", "signedOutAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_564f72e973c25fff816ea6cb34" ON "session" ("userId", "signedOutAt", "expiresAt") `);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_564f72e973c25fff816ea6cb34"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eb67bfc6f7b8045d4498e37b7d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a0b80835e18d19fe988fb99a73"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_67ce0ac571b48623338209708b"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a61cb8d191cd7e21cbce349a03"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e84d87037ff1274918c7b2f871"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_52e2c65f649c102c81c4b4facc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_915108ba20912c6119c621f760"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_83aeb8193e1e98de29e2be2205"`);
        await queryRunner.query(`DROP TABLE "activity"`);
    }

}
