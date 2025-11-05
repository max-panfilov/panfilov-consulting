import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   -- Конвертируем колонки в text для безопасного изменения
  ALTER TABLE "cases" ALTER COLUMN "industry" SET DATA TYPE text;
  ALTER TABLE "_cases_v" ALTER COLUMN "version_industry" SET DATA TYPE text;
  
  -- Обновляем старые значения на новые (metallurgy и manufacturing -> industry)
  UPDATE "cases" SET "industry" = 'industry' WHERE "industry" IN ('metallurgy', 'manufacturing');
  UPDATE "_cases_v" SET "version_industry" = 'industry' WHERE "version_industry" IN ('metallurgy', 'manufacturing');
  
  -- Удаляем старые enum типы
  DROP TYPE "public"."enum_cases_industry";
  DROP TYPE "public"."enum__cases_v_version_industry";
  
  -- Создаем новые enum типы с обновленным списком
  CREATE TYPE "public"."enum_cases_industry" AS ENUM('electronics', 'legal', 'finance', 'retail', 'logistics', 'industry', 'other');
  CREATE TYPE "public"."enum__cases_v_version_industry" AS ENUM('electronics', 'legal', 'finance', 'retail', 'logistics', 'industry', 'other');
  
  -- Применяем новые enum типы к колонкам
  ALTER TABLE "cases" ALTER COLUMN "industry" SET DATA TYPE "public"."enum_cases_industry" USING "industry"::"public"."enum_cases_industry";
  ALTER TABLE "_cases_v" ALTER COLUMN "version_industry" SET DATA TYPE "public"."enum__cases_v_version_industry" USING "version_industry"::"public"."enum__cases_v_version_industry";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cases" ALTER COLUMN "industry" SET DATA TYPE text;
  DROP TYPE "public"."enum_cases_industry";
  CREATE TYPE "public"."enum_cases_industry" AS ENUM('electronics', 'metallurgy', 'legal', 'finance', 'retail', 'logistics', 'manufacturing', 'other');
  ALTER TABLE "cases" ALTER COLUMN "industry" SET DATA TYPE "public"."enum_cases_industry" USING "industry"::"public"."enum_cases_industry";
  ALTER TABLE "_cases_v" ALTER COLUMN "version_industry" SET DATA TYPE text;
  DROP TYPE "public"."enum__cases_v_version_industry";
  CREATE TYPE "public"."enum__cases_v_version_industry" AS ENUM('electronics', 'metallurgy', 'legal', 'finance', 'retail', 'logistics', 'manufacturing', 'other');
  ALTER TABLE "_cases_v" ALTER COLUMN "version_industry" SET DATA TYPE "public"."enum__cases_v_version_industry" USING "version_industry"::"public"."enum__cases_v_version_industry";`)
}
