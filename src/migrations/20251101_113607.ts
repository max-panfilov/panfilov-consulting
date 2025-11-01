import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Конвертирует текстовое поле в Lexical JSON формат
 */
function textToLexical(text: string | null): any {
  if (!text) return null
  
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: text,
              version: 1
            }
          ],
          direction: 'ltr',
          textFormat: 0
        }
      ],
      direction: 'ltr'
    }
  }
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Шаг 1: Создаём временные колонки для конвертированных данных
  await db.execute(sql`
    ALTER TABLE "cases" ADD COLUMN IF NOT EXISTS "challenge_temp" jsonb;
    ALTER TABLE "cases" ADD COLUMN IF NOT EXISTS "solution_temp" jsonb;
    ALTER TABLE "cases" ADD COLUMN IF NOT EXISTS "results_temp" jsonb;
    ALTER TABLE "_cases_v" ADD COLUMN IF NOT EXISTS "version_challenge_temp" jsonb;
    ALTER TABLE "_cases_v" ADD COLUMN IF NOT EXISTS "version_solution_temp" jsonb;
    ALTER TABLE "_cases_v" ADD COLUMN IF NOT EXISTS "version_results_temp" jsonb;
  `)

  // Шаг 2: Получаем все записи из cases
  const casesResult = await db.execute(sql`
    SELECT id, challenge, solution, results FROM "cases"
  `)

  // Шаг 3: Конвертируем текст в Lexical JSON и обновляем временные колонки
  for (const row of casesResult.rows) {
    const challengeJson = textToLexical(row.challenge as string)
    const solutionJson = textToLexical(row.solution as string)
    const resultsJson = textToLexical(row.results as string)

    await db.execute(sql`
      UPDATE "cases" 
      SET 
        "challenge_temp" = ${JSON.stringify(challengeJson)}::jsonb,
        "solution_temp" = ${JSON.stringify(solutionJson)}::jsonb,
        "results_temp" = ${JSON.stringify(resultsJson)}::jsonb
      WHERE id = ${row.id}
    `)
  }

  // Шаг 4: То же для версионной таблицы
  const casesVersionResult = await db.execute(sql`
    SELECT id, version_challenge, version_solution, version_results FROM "_cases_v"
  `)

  for (const row of casesVersionResult.rows) {
    const challengeJson = textToLexical(row.version_challenge as string)
    const solutionJson = textToLexical(row.version_solution as string)
    const resultsJson = textToLexical(row.version_results as string)

    await db.execute(sql`
      UPDATE "_cases_v" 
      SET 
        "version_challenge_temp" = ${JSON.stringify(challengeJson)}::jsonb,
        "version_solution_temp" = ${JSON.stringify(solutionJson)}::jsonb,
        "version_results_temp" = ${JSON.stringify(resultsJson)}::jsonb
      WHERE id = ${row.id}
    `)
  }

  // Шаг 5: Удаляем старые колонки и переименовываем временные
  await db.execute(sql`
    ALTER TABLE "cases" DROP COLUMN "challenge";
    ALTER TABLE "cases" DROP COLUMN "solution";
    ALTER TABLE "cases" DROP COLUMN "results";
    ALTER TABLE "cases" RENAME COLUMN "challenge_temp" TO "challenge";
    ALTER TABLE "cases" RENAME COLUMN "solution_temp" TO "solution";
    ALTER TABLE "cases" RENAME COLUMN "results_temp" TO "results";

    ALTER TABLE "_cases_v" DROP COLUMN "version_challenge";
    ALTER TABLE "_cases_v" DROP COLUMN "version_solution";
    ALTER TABLE "_cases_v" DROP COLUMN "version_results";
    ALTER TABLE "_cases_v" RENAME COLUMN "version_challenge_temp" TO "version_challenge";
    ALTER TABLE "_cases_v" RENAME COLUMN "version_solution_temp" TO "version_solution";
    ALTER TABLE "_cases_v" RENAME COLUMN "version_results_temp" TO "version_results";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cases" ALTER COLUMN "challenge" SET DATA TYPE varchar;
  ALTER TABLE "cases" ALTER COLUMN "solution" SET DATA TYPE varchar;
  ALTER TABLE "cases" ALTER COLUMN "results" SET DATA TYPE varchar;
  ALTER TABLE "_cases_v" ALTER COLUMN "version_challenge" SET DATA TYPE varchar;
  ALTER TABLE "_cases_v" ALTER COLUMN "version_solution" SET DATA TYPE varchar;
  ALTER TABLE "_cases_v" ALTER COLUMN "version_results" SET DATA TYPE varchar;`)
}
