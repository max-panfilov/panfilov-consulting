import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import fs from 'fs/promises'
import path from 'path'
import type { Page, Media } from '../payload-types'

// Функция для получения URL изображения
function getMediaUrl(media: string | Media | null | undefined): string {
  if (!media) return ''
  
  if (typeof media === 'string') {
    return media
  }
  
  if (typeof media === 'object' && 'url' in media) {
    return media.url || ''
  }
  
  return ''
}

// Функция для извлечения текста из Lexical JSON
function extractTextFromLexical(lexicalData: any): string {
  if (!lexicalData || !lexicalData.root || !lexicalData.root.children) {
    return ''
  }

  let text = ''

  const processNode = (node: any): string => {
    // Обработка текстовых нод
    if (node.type === 'text') {
      return node.text || ''
    }

    // Обработка параграфов и других контейнерных элементов
    if (node.children && Array.isArray(node.children)) {
      return node.children.map(processNode).join(' ')
    }

    return ''
  }

  // Обрабатываем все дочерние элементы корневого узла
  lexicalData.root.children.forEach((child: any) => {
    const childText = processNode(child)
    if (childText) {
      text += childText + '\n\n'
    }
  })

  return text.trim()
}

async function exportHomepageToMarkdown() {
  const payload = await getPayload({ config: configPromise })

  console.log('🔍 Получаем данные главной страницы...')

  // Получаем главную страницу (slug: 'home')
  const pagesData = await payload.find({
    collection: 'pages',
    depth: 3, // Подгружаем связанные данные
    where: {
      slug: {
        equals: 'home',
      },
    },
  })

  if (pagesData.docs.length === 0) {
    console.error('❌ Главная страница не найдена')
    process.exit(1)
  }

  const homePage = pagesData.docs[0] as Page

  console.log(`📄 Найдена страница: ${homePage.title}`)

  // Создаем директорию для экспорта
  const exportDir = path.join(process.cwd(), 'exported-homepage')
  await fs.mkdir(exportDir, { recursive: true })

  // Начинаем формировать markdown
  let markdown = `# ${homePage.title}\n\n`
  markdown += `**Slug:** ${homePage.slug}\n\n`
  markdown += `**Дата публикации:** ${homePage.publishedAt ? new Date(homePage.publishedAt).toLocaleDateString('ru-RU') : 'Не указана'}\n\n`
  markdown += `---\n\n`

  // Обрабатываем layout блоки
  if (homePage.layout && Array.isArray(homePage.layout)) {
    console.log(`\n📦 Обрабатываем ${homePage.layout.length} блоков...`)

    for (const block of homePage.layout) {
      const blockType = block.blockType

      markdown += `## Блок: ${blockType}\n\n`

      switch (blockType) {
        case 'heroHome':
          markdown += `### Hero (Главная)\n\n`
          if (block.badge) markdown += `**Значок:** ${block.badge}\n\n`
          if (block.heading) markdown += `**Заголовок:** ${block.heading}\n\n`
          if (block.subheading) markdown += `**Подзаголовок:** ${block.subheading}\n\n`
          if (block.primaryCTA) {
            markdown += `**Кнопка 1:** [${block.primaryCTA.text}](${block.primaryCTA.link})\n\n`
          }
          if (block.secondaryCTA) {
            markdown += `**Кнопка 2:** [${block.secondaryCTA.text}](${block.secondaryCTA.link})\n\n`
          }
          break

        case 'targetAudience':
          markdown += `### Целевая аудитория\n\n`
          if (block.heading) markdown += `**Заголовок:** ${block.heading}\n\n`
          if (block.subheading) markdown += `**Подзаголовок:** ${block.subheading}\n\n`
          if (block.audiences && Array.isArray(block.audiences)) {
            markdown += `**Аудитории:**\n\n`
            block.audiences.forEach((audience: any, index: number) => {
              markdown += `${index + 1}. **${audience.title}**\n`
              if (audience.description) markdown += `   - ${audience.description}\n`
            })
            markdown += `\n`
          }
          break

        case 'solutionApproach':
          markdown += `### Подход к решениям\n\n`
          if (block.heading) markdown += `**Заголовок:** ${block.heading}\n\n`
          if (block.subheading) markdown += `**Подзаголовок:** ${block.subheading}\n\n`
          if (block.steps && Array.isArray(block.steps)) {
            markdown += `**Этапы:**\n\n`
            block.steps.forEach((step: any, index: number) => {
              markdown += `${index + 1}. **${step.title}**\n`
              if (step.description) markdown += `   - ${step.description}\n`
            })
            markdown += `\n`
          }
          break

        case 'featuredCases':
          markdown += `### Избранные кейсы\n\n`
          if (block.heading) markdown += `**Заголовок:** ${block.heading}\n\n`
          if (block.subheading) markdown += `**Подзаголовок:** ${block.subheading}\n\n`
          markdown += `*(Кейсы подгружаются автоматически из коллекции Cases)*\n\n`
          break

        case 'expertiseHighlight':
          markdown += `### Экспертиза\n\n`
          if (block.heading) markdown += `**Заголовок:** ${block.heading}\n\n`
          if (block.subheading) markdown += `**Подзаголовок:** ${block.subheading}\n\n`
          if (block.expertiseAreas && Array.isArray(block.expertiseAreas)) {
            markdown += `**Области экспертизы:**\n\n`
            block.expertiseAreas.forEach((area: any, index: number) => {
              markdown += `${index + 1}. **${area.title}**\n`
              if (area.description) markdown += `   - ${area.description}\n`
            })
            markdown += `\n`
          }
          break

        case 'contactForm':
          markdown += `### Форма контакта\n\n`
          if (block.heading) markdown += `**Заголовок:** ${block.heading}\n\n`
          if (block.subheading) markdown += `**Подзаголовок:** ${block.subheading}\n\n`
          break

        case 'cta':
          markdown += `### Call to Action\n\n`
          if (block.richText) {
            const ctaText = extractTextFromLexical(block.richText)
            if (ctaText) markdown += `${ctaText}\n\n`
          }
          if (block.links && Array.isArray(block.links)) {
            markdown += `**Ссылки:**\n\n`
            block.links.forEach((link: any) => {
              if (link.link && link.link.label) {
                markdown += `- [${link.link.label}](${link.link.url || '#'})\n`
              }
            })
            markdown += `\n`
          }
          break

        case 'content':
          markdown += `### Контент\n\n`
          if (block.richText) {
            const contentText = extractTextFromLexical(block.richText)
            if (contentText) markdown += `${contentText}\n\n`
          }
          break

        case 'mediaBlock':
          markdown += `### Медиа блок\n\n`
          if (block.media) {
            const mediaUrl = getMediaUrl(block.media)
            if (mediaUrl) {
              markdown += `![Медиа](${mediaUrl})\n\n`
            }
          }
          if (block.caption) markdown += `*${block.caption}*\n\n`
          break

        default:
          markdown += `*(Блок типа ${blockType} не обрабатывается)*\n\n`
      }

      markdown += `---\n\n`
    }
  }

  // Сохраняем файл
  const filePath = path.join(exportDir, 'homepage-content.md')
  await fs.writeFile(filePath, markdown, 'utf-8')

  console.log(`\n✅ Данные главной страницы экспортированы в: ${filePath}`)

  // Создаем дополнительный JSON файл для программного использования
  const jsonData = {
    title: homePage.title,
    slug: homePage.slug,
    publishedAt: homePage.publishedAt,
    blocks: homePage.layout?.map((block: any) => ({
      blockType: block.blockType,
      ...block,
    })) || [],
  }

  const jsonFilePath = path.join(exportDir, 'homepage-data.json')
  await fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf-8')

  console.log(`✅ JSON данные сохранены в: ${jsonFilePath}`)
  console.log(`\n🎉 Экспорт завершен!`)

  process.exit(0)
}

exportHomepageToMarkdown().catch((error) => {
  console.error('❌ Ошибка при экспорте:', error)
  process.exit(1)
})
