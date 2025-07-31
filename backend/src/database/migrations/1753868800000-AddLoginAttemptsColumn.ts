import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLoginAttemptsColumn1753868800000 implements MigrationInterface {
    name = 'AddLoginAttemptsColumn1753868800000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add login_attempts column to users table
        await queryRunner.query(`ALTER TABLE "users" ADD "login_attempts" integer NOT NULL DEFAULT '0'`);
        
        // Add locked_until column to users table
        await queryRunner.query(`ALTER TABLE "users" ADD "locked_until" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove the columns
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "locked_until"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "login_attempts"`);
    }
}