import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1774803232075 implements MigrationInterface {
    name = 'InitDatabase1774803232075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "milestone" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "dueDate" date NOT NULL, "projectId" integer, CONSTRAINT "PK_f8372abce331f60ba7b33fe23a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "daily_log" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "notes" text NOT NULL, "hoursWorked" integer NOT NULL, "activityId" integer, CONSTRAINT "PK_688636c7fe6fdfce901613c20b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "material" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" numeric(12,2) NOT NULL, CONSTRAINT "PK_0343d0d577f3effc2054cbaca7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "labor_usage" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "rate" numeric(12,2) NOT NULL, CONSTRAINT "PK_a00e6b17590b826db64ea7522be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "equipment" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "dailyRate" numeric(12,2) NOT NULL, CONSTRAINT "PK_0722e1b9d6eb19f5874c1678740" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "resource_usage" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "unitCost" numeric(10,2) NOT NULL, "activityId" integer, "materialId" integer, "laborUsageId" integer, "equipmentId" integer, CONSTRAINT "PK_a8579e659abf174dda72abfec96" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying, "projectId" integer, CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subcontractor_cost" ("id" SERIAL NOT NULL, "subcontractorName" character varying NOT NULL, "total" numeric(12,2) NOT NULL, "projectId" integer, CONSTRAINT "PK_9cd8613f8d32f85e41c058fec6e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "budget" numeric(12,2) NOT NULL, "currentSpend" numeric(12,2) NOT NULL, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity_milestones_milestone" ("activityId" integer NOT NULL, "milestoneId" integer NOT NULL, CONSTRAINT "PK_51f251590389af5655202b762cd" PRIMARY KEY ("activityId", "milestoneId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_918de23a795ecd5cbff0b0c3ad" ON "activity_milestones_milestone" ("activityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d49cf71b1f04adc6bf68c57957" ON "activity_milestones_milestone" ("milestoneId") `);
        await queryRunner.query(`ALTER TABLE "milestone" ADD CONSTRAINT "FK_edc28a2e0442554afe5eef2bdcb" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "daily_log" ADD CONSTRAINT "FK_7be94d19ad3b761526328425330" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "resource_usage" ADD CONSTRAINT "FK_3e84a0ac98cb5052b7ba96652f4" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "resource_usage" ADD CONSTRAINT "FK_8080e2d66792c3209854d302406" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "resource_usage" ADD CONSTRAINT "FK_2a91cdabb50eb7d27c9bdd7bf68" FOREIGN KEY ("laborUsageId") REFERENCES "labor_usage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "resource_usage" ADD CONSTRAINT "FK_8bd090c737c79f83d4538263867" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_5a898f44fa31ef7916f0c38b016" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subcontractor_cost" ADD CONSTRAINT "FK_c5bce8a9d174c77dedec2f37d03" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity_milestones_milestone" ADD CONSTRAINT "FK_918de23a795ecd5cbff0b0c3ad5" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "activity_milestones_milestone" ADD CONSTRAINT "FK_d49cf71b1f04adc6bf68c57957a" FOREIGN KEY ("milestoneId") REFERENCES "milestone"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity_milestones_milestone" DROP CONSTRAINT "FK_d49cf71b1f04adc6bf68c57957a"`);
        await queryRunner.query(`ALTER TABLE "activity_milestones_milestone" DROP CONSTRAINT "FK_918de23a795ecd5cbff0b0c3ad5"`);
        await queryRunner.query(`ALTER TABLE "subcontractor_cost" DROP CONSTRAINT "FK_c5bce8a9d174c77dedec2f37d03"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_5a898f44fa31ef7916f0c38b016"`);
        await queryRunner.query(`ALTER TABLE "resource_usage" DROP CONSTRAINT "FK_8bd090c737c79f83d4538263867"`);
        await queryRunner.query(`ALTER TABLE "resource_usage" DROP CONSTRAINT "FK_2a91cdabb50eb7d27c9bdd7bf68"`);
        await queryRunner.query(`ALTER TABLE "resource_usage" DROP CONSTRAINT "FK_8080e2d66792c3209854d302406"`);
        await queryRunner.query(`ALTER TABLE "resource_usage" DROP CONSTRAINT "FK_3e84a0ac98cb5052b7ba96652f4"`);
        await queryRunner.query(`ALTER TABLE "daily_log" DROP CONSTRAINT "FK_7be94d19ad3b761526328425330"`);
        await queryRunner.query(`ALTER TABLE "milestone" DROP CONSTRAINT "FK_edc28a2e0442554afe5eef2bdcb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d49cf71b1f04adc6bf68c57957"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_918de23a795ecd5cbff0b0c3ad"`);
        await queryRunner.query(`DROP TABLE "activity_milestones_milestone"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "subcontractor_cost"`);
        await queryRunner.query(`DROP TABLE "activity"`);
        await queryRunner.query(`DROP TABLE "resource_usage"`);
        await queryRunner.query(`DROP TABLE "equipment"`);
        await queryRunner.query(`DROP TABLE "labor_usage"`);
        await queryRunner.query(`DROP TABLE "material"`);
        await queryRunner.query(`DROP TABLE "daily_log"`);
        await queryRunner.query(`DROP TABLE "milestone"`);
    }

}
