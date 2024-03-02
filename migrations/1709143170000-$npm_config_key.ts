import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigKey1709143170000 implements MigrationInterface {
    name = ' $npmConfigKey1709143170000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    }

}
