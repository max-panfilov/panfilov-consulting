import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cases" ADD COLUMN "sort_order" numeric DEFAULT 9999;
  ALTER TABLE "_cases_v" ADD COLUMN "version_sort_order" numeric DEFAULT 9999;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cases" DROP COLUMN "sort_order";
  ALTER TABLE "_cases_v" DROP COLUMN "version_sort_order";`)
}
