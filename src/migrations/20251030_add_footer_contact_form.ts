import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "contact_form_heading" varchar DEFAULT 'Свяжитесь с нами';
  ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "contact_form_description" varchar;
  ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "contact_form_id" integer;
  
  DO $$ BEGIN
    ALTER TABLE "footer" ADD CONSTRAINT "footer_contact_form_id_forms_id_fk" 
      FOREIGN KEY ("contact_form_id") REFERENCES "public"."forms"("id") 
      ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "footer_contact_form_idx" ON "footer" USING btree ("contact_form_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer" DROP CONSTRAINT IF EXISTS "footer_contact_form_id_forms_id_fk";
  DROP INDEX IF EXISTS "footer_contact_form_idx";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "contact_form_heading";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "contact_form_description";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "contact_form_id";`)
}
