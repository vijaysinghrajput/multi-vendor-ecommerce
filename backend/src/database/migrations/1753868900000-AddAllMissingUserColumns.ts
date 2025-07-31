import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAllMissingUserColumns1753868900000 implements MigrationInterface {
    name = 'AddAllMissingUserColumns1753868900000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create enum types first
        await queryRunner.query(`CREATE TYPE "auth_provider_enum" AS ENUM('local', 'google', 'facebook', 'apple')`);
        
        // Add missing columns to users table
        await queryRunner.query(`ALTER TABLE "users" ADD "authProvider" "auth_provider_enum" NOT NULL DEFAULT 'local'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "providerId" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "two_factor_enabled" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "two_factor_secret" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "language" character varying NOT NULL DEFAULT 'en'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "currency" character varying NOT NULL DEFAULT 'USD'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "timezone" character varying NOT NULL DEFAULT 'UTC'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "marketing_consent" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "push_notifications" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email_notifications" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" ADD "sms_notifications" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_login_ip" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "refresh_token" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "reset_password_token" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "reset_password_expires" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email_verification_token" character varying`);
        
        // Add foreign key columns for relations
        await queryRunner.query(`ALTER TABLE "users" ADD "cartId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD "wishlistId" uuid`);
        
        // Add unique constraints
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_users_cartId" UNIQUE ("cartId")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_users_wishlistId" UNIQUE ("wishlistId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove constraints first
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_users_wishlistId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_users_cartId"`);
        
        // Remove columns
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "wishlistId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "cartId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email_verification_token"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reset_password_expires"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reset_password_token"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refresh_token"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_login_ip"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "sms_notifications"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email_notifications"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "push_notifications"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "marketing_consent"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "timezone"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "currency"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "language"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "two_factor_secret"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "two_factor_enabled"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "providerId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "authProvider"`);
        
        // Drop enum type
        await queryRunner.query(`DROP TYPE "auth_provider_enum"`);
    }
}