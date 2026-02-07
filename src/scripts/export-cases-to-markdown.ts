import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import fs from 'fs/promises'
import path from 'path'
import type { Case, Media } from '../payload-types'

// Функция для конвертации Lexical JSON в Markdown
function lexicalToMarkdown(lexicalData: any): string {
  if (!lexicalData || !lexicalData.root || !lexicalData.root.children) {
    return ''
  }

  let markdown = ''

  const processNode = (node: any): string => {
    let text = ''

    // Обработка текстовых нод
    if (node.type === 'text') {
      let nodeText = node.text || ''
      
      // Применяем форматирование
      if (node.format) {
        if (node.format & 1) nodeText = `**${nodeText}**` // bold
        if (node.format & 2) nodeText = `*${nodeText}*` // italic
        if (node.format & 8) nodeText = `~~${nodeText}~~` // strikethrough
        if (node.format & 16) nodeText = `\`${nodeText}\`` // code
      }
      
      return nodeText
    }

    // Обработка параграфов
    if (node.type === 'paragraph') {
      const children = node.children?.map(processNode).join('') || ''
      return children ? `${children}\n\n` : ''
    }

    // Обработка заголовков
    if (node.type === 'heading') {
      const level = node.tag?.replace('h', '') || '2'
      const children = node.children?.map(processNode).join('') || ''
      return `${'#'.repeat(parseInt(level))} ${children}\n\n`
    }

    // Обработка списков
    if (node.type === 'list') {
      const listType = node.listType || 'bullet'
      const items = node.children || []
      
      return items.map((item: any, index: number) => {
        const itemText = item.children?.map(processNode).join('') || ''
        const prefix = listType === 'number' ? `${index + 1}.` : '-'
        return `${prefix} ${itemText}\n`
      }).join('') + '\n'
    }

    // Обработка элементов списка
    if (node.type === 'listitem') {
      return node.children?.map(processNode).join('') || ''
    }

    // Обработка цитат
    if (node.type === 'quote') {
      const children = node.children?.map(processNode).join('') || ''
      return `> ${children}\n\n`
    }

    // Обработка горизонтальной линии
    if (node.type === 'horizontalrule') {
      return '---\n\n'
    }

    // Обработка ссылок
    if (node.type === 'link') {
      const children = node.children?.map(processNode).join('') || ''
      const url = node.fields?.url || '#'
      return `[${children}](${url})`
    }

    // Обработка блоков (например, mediaBlock)
    if (node.type === 'block') {
      const blockType = node.fields?.blockType
      
      if (blockType === 'mediaBlock') {
        const media = node.fields?.media
        const caption = node.fields?.caption || ''
        
        if (media && typeof media === 'object' && 'url' in media) {
          const imageUrl = media.url || ''
          const imageAlt = media.alt || caption || 'Image'
          return `![${imageAlt}](${imageUrl})\n${caption ? `*${caption}*\n` : ''}\n`
        }
      }
    }

    // Обработка дочерних элементов для неизвестных типов
    if (node.children && Array.isArray(node.children)) {
      return node.children.map(processNode).join('')
    }

    return ''
  }

  // Обрабатываем все дочерние элементы корневого узла
  lexicalData.root.children.forEach((child: any) => {
    markdown += processNode(child)
  })

  return markdown.trim()
}

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

async function exportCasesToMarkdown() {
  const payload = await getPayload({ config: configPromise })

  console.log('🔍 Получаем кейсы из базы данных...')

  // Получаем все опубликованные кейсы
  const casesData = await payload.find({
    collection: 'cases',
    depth: 2, // Подгружаем связанные данные (изображения)
    limit: 1000,
    where: {
      _status: {
        equals: 'published',
      },
    },
    sort: 'sortOrder',
  })

  const cases = casesData.docs as Case[]

  console.log(`📦 Найдено кейсов: ${cases.length}`)

  // Создаем директорию для экспорта
  const exportDir = path.join(process.cwd(), 'exported-cases')
  await fs.mkdir(exportDir, { recursive: true })

  // Экспортируем каждый кейс
  for (const caseItem of cases) {
    console.log(`\n📝 Экспортируем: ${caseItem.title}`)

    const coverImageUrl = getMediaUrl(caseItem.coverImage)
    const shortDescription = caseItem.shortDescription || ''
    const industry = caseItem.industry || 'other'
    const technologies = caseItem.technologies || []
    
    // Конвертируем Lexical в Markdown
    const challengeMarkdown = lexicalToMarkdown(caseItem.challenge)
    const solutionMarkdown = lexicalToMarkdown(caseItem.solution)
    const resultsMarkdown = lexicalToMarkdown(caseItem.results)

    // Формируем содержимое markdown файла
    let markdown = `# ${caseItem.title}\n\n`
    
    // Метаданные
    markdown += `---\n\n`
    markdown += `**Отрасль:** ${industry}\n\n`
    markdown += `**Slug:** ${caseItem.slug}\n\n`
    
    if (technologies.length > 0) {
      markdown += `**Технологии:** ${technologies.map(t => t.technology).join(', ')}\n\n`
    }
    
    if (caseItem.featured) {
      markdown += `**Избранный:** Да\n\n`
    }
    
    if (caseItem.publishedAt) {
      markdown += `**Дата публикации:** ${new Date(caseItem.publishedAt).toLocaleDateString('ru-RU')}\n\n`
    }
    
    markdown += `---\n\n`

    // Обложка
    if (coverImageUrl) {
      markdown += `## Обложка\n\n`
      markdown += `![${caseItem.title}](${coverImageUrl})\n\n`
    }

    // Краткое описание
    if (shortDescription) {
      markdown += `## Краткое описание\n\n`
      markdown += `${shortDescription}\n\n`
    }

    // Задача клиента
    if (challengeMarkdown) {
      markdown += `## Задача клиента\n\n`
      markdown += `${challengeMarkdown}\n\n`
    }

    // Решение
    if (solutionMarkdown) {
      markdown += `## Решение\n\n`
      markdown += `${solutionMarkdown}\n\n`
    }

    // Результаты
    if (resultsMarkdown) {
      markdown += `## Результаты\n\n`
      markdown += `${resultsMarkdown}\n\n`
    }

    // Сохраняем файл
    const fileName = `${caseItem.slug || 'case'}.md`
    const filePath = path.join(exportDir, fileName)
    
    await fs.writeFile(filePath, markdown, 'utf-8')
    console.log(`✅ Сохранено: ${fileName}`)
  }

  console.log(`\n🎉 Экспорт завершен! Файлы сохранены в директории: ${exportDir}`)
  
  // Создаем индексный файл со списком всех кейсов
  let indexMarkdown = `# Экспортированные кейсы\n\n`
  indexMarkdown += `Всего кейсов: ${cases.length}\n\n`
  indexMarkdown += `Дата экспорта: ${new Date().toLocaleString('ru-RU')}\n\n`
  indexMarkdown += `---\n\n`
  
  for (const caseItem of cases) {
    const fileName = `${caseItem.slug || 'case'}.md`
    indexMarkdown += `- [${caseItem.title}](./${fileName})\n`
  }
  
  await fs.writeFile(path.join(exportDir, 'INDEX.md'), indexMarkdown, 'utf-8')
  console.log(`📋 Создан индексный файл: INDEX.md`)

  process.exit(0)
}

exportCasesToMarkdown().catch((error) => {
  console.error('❌ Ошибка при экспорте:', error)
  process.exit(1)
})
