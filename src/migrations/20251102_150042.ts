import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_featured_cases" ADD COLUMN "subheading" varchar;
  ALTER TABLE "_pages_v_blocks_featured_cases" ADD COLUMN "subheading" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_featured_cases" DROP COLUMN "subheading";
  ALTER TABLE "_pages_v_blocks_featured_cases" DROP COLUMN "subheading";`)
}
