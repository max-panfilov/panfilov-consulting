#!/usr/bin/env tsx

/*
 * CLI для добавления/редактирования постов и кейсов из Markdown
 * Запуск через pnpm:
 *   - pnpm content post:new --slug my-post --title "Заголовок" --md docs/posts/my-post.md --publish
 *   - pnpm content post:update --slug my-post --md docs/posts/my-post.md
 *   - pnpm content case:new --slug my-case --title "Кейс" \
 *       --challenge md/cases/my-case.challenge.md --solution md/cases/my-case.solution.md --results md/cases/my-case.results.md --publish
 *   - pnpm content case:update --slug my-case --challenge ... --solution ... --results ...
 */

/* eslint-disable no-console */
import 'dotenv/config'
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { editorConfigFactory, convertMarkdownToLexical } from '@payloadcms/richtext-lexical'

// Общие аргументы для постов/кейсов
type Common = { slug: string; title?: string; publish?: boolean }
// Аргументы для поста
type PostArgs = Common & { md: string }
// Аргументы для кейса: три отдельных Markdown-файла для трёх richText-полей
type CaseArgs = Common & { challenge: string; solution: string; results: string }

// Чтение Markdown и конвертация в Lexical JSON с учётом актуальной конфигурации редактора проекта
async function getEditorConfig() {
  const config = await configPromise // Берём реальный Payload config проекта
  return editorConfigFactory.default({ config }) // Строим editorConfig, чтобы конвертация соответствовала включённым фичам
}

async function mdToLexical(markdownPath: string) {
  const raw = await fs.readFile(path.resolve(markdownPath), 'utf8')
  const { content, data: fm } = matter(raw) // Отделяем frontmatter и берём только тело для конвертации
  const editorConfig = await getEditorConfig()
  // Конвертируем Markdown в SerializedEditorState JSON (Lexical)
  const lexical = convertMarkdownToLexical({ editorConfig, markdown: content })
  return { lexical, frontmatter: fm as Record<string, unknown> }
}

// Создание/обновление поста по slug (id не требуется)
async function upsertPost(args: PostArgs) {
  const payload = await getPayload({ config: configPromise }) // Работаем через Local API
  const { lexical, frontmatter } = await mdToLexical(args.md)

  // Поддержка title/_status из frontmatter, если не переданы флагами
  const title = args.title ?? (frontmatter.title as string | undefined)
  const publish = args.publish ?? (Boolean(frontmatter.publish) as boolean)

  const data: any = { content: lexical }
  if (title) data.title = title
  if (publish) data._status = 'published'

  // Пытаемся обновить по slug, иначе создаём
  const existing = await payload.find({ collection: 'posts', where: { slug: { equals: args.slug } }, limit: 1 })
  if (existing.docs[0]) {
    return payload.update({ collection: 'posts', id: existing.docs[0].id, data })
  }
  return payload.create({ collection: 'posts', data: { ...data, slug: args.slug } })
}

// Создание/обновление кейса по slug
async function upsertCase(args: CaseArgs) {
  const payload = await getPayload({ config: configPromise })

  // Три отдельных Markdown-файла конвертируем независимо в richText
  const [challengeRes, solutionRes, resultsRes] = await Promise.all([
    mdToLexical(args.challenge),
    mdToLexical(args.solution),
    mdToLexical(args.results),
  ])

  // Поддержка title/_status из любого frontmatter, если не переданы флагами
  const title =
    args.title ??
    (challengeRes.frontmatter.title as string | undefined) ??
    (solutionRes.frontmatter.title as string | undefined) ??
    (resultsRes.frontmatter.title as string | undefined)
  const publish =
    args.publish ??
    Boolean(
      challengeRes.frontmatter.publish || solutionRes.frontmatter.publish || resultsRes.frontmatter.publish,
    )

  const data: any = {
    challenge: challengeRes.lexical,
    solution: solutionRes.lexical,
    results: resultsRes.lexical,
  }
  if (title) data.title = title
  if (publish) data._status = 'published'

  const existing = await payload.find({ collection: 'cases', where: { slug: { equals: args.slug } }, limit: 1 })
  if (existing.docs[0]) {
    return payload.update({ collection: 'cases', id: existing.docs[0].id, data })
  }
  return payload.create({ collection: 'cases', data: { ...data, slug: args.slug } })
}

// Утилиты для парсинга CLI-аргументов (без сторонних зависимостей)
function arg(key: string) {
  const i = process.argv.indexOf(`--${key}`)
  return i > -1 ? process.argv[i + 1] : undefined
}
function flag(key: string) {
  return process.argv.includes(`--${key}`)
}

async function main() {
  const cmd = process.argv[2] // post:new | post:update | case:new | case:update
  if (!cmd) throw new Error('Укажите команду')

  switch (cmd) {
    case 'post:new':
    case 'post:update': {
      const slug = arg('slug')
      const md = arg('md')
      if (!slug || !md) throw new Error('--slug и --md обязательны для постов')
      await upsertPost({
        slug,
        title: arg('title'),
        md,
        publish: flag('publish'),
      })
      break
    }
    case 'case:new':
    case 'case:update': {
      const slug = arg('slug')
      const challenge = arg('challenge')
      const solution = arg('solution')
      const results = arg('results')
      if (!slug || !challenge || !solution || !results)
        throw new Error('--slug, --challenge, --solution, --results обязательны для кейсов')
      await upsertCase({
        slug,
        title: arg('title'),
        challenge,
        solution,
        results,
        publish: flag('publish'),
      })
      break
    }
    default:
      throw new Error(`Неизвестная команда: ${cmd}`)
  }

  console.log('✅ Готово')
  process.exit(0)
}

main().catch((e) => {
  console.error('❌', e?.message || e)
  if (e?.stack) console.error(e.stack)
  process.exit(1)
})
