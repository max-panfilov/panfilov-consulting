import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Обновление ядра Payload 3.61 → 3.89: таблица payload_kv и уход связи locked_documents → payload_jobs.
// Сгенерированная версия также пыталась добавить users.api_key и enum healthcare — они уже есть в базе
// (ручная миграция 20260208 без drizzle-снапшота), поэтому здесь только изменения ядра, идемпотентно.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "payload_kv" (
   	"id" serial PRIMARY KEY NOT NULL,
   	"key" varchar NOT NULL,
   	"data" jsonb NOT NULL
   );
   CREATE UNIQUE INDEX IF NOT EXISTS "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_payload_jobs_fk";
   DROP INDEX IF EXISTS "payload_locked_documents_rels_payload_jobs_id_idx";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payload_jobs_id";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "payload_kv" CASCADE;
   ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "payload_jobs_id" integer;
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk" FOREIGN KEY ("payload_jobs_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
   CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_payload_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_jobs_id");`)
}
