import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigKey1709062418966 implements MigrationInterface {
    name = ' $npmConfigKey1709062418966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "isSuerAdmin" TO "isSuperAdmin"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "isSuperAdmin" TO "isSuerAdmin"`);
    }

}
