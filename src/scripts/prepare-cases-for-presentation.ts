import fs from 'fs/promises'
import path from 'path'

// Интерфейсы для типизации данных
interface CaseForPresentation {
  slug: string
  title: string
  challenge: string
  solution: string
  results: string
  technologies?: string
  images: string[]
}

// Функция для очистки markdown форматирования
function cleanMarkdown(text: string): string {
  return text
    // Убираем жирный текст ** **
    .replace(/\*\*(.*?)\*\*/g, '$1')
    // Убираем курсив * *
    .replace(/\*(.*?)\*/g, '$1')
    // Убираем ссылки [text](url)
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    // Убираем цитаты >
    .replace(/^>\s*/gm, '')
    // Заменяем маркеры списков на буллет с переносом строки
    .replace(/^[-•]\s+/gm, '\n• ')
    // Заменяем нумерованные списки с переносом строки
    .replace(/^(\d+)\.\s+/gm, '\n$1. ')
    // Убираем лишние переносы строк в начале
    .replace(/^\n+/, '')
    // Заменяем множественные пробелы на один (кроме переносов строк)
    .replace(/[^\S\n]+/g, ' ')
    .trim()
}

// Функция для извлечения и форматирования списков
function extractListItems(text: string): string[] {
  const items: string[] = []
  const lines = text.split('\n')
  
  for (const line of lines) {
    const trimmed = line.trim()
    // Проверяем маркированные списки
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      items.push(trimmed.substring(2).trim())
    }
    // Проверяем нумерованные списки
    else if (/^\d+\.\s/.test(trimmed)) {
      items.push(trimmed.replace(/^\d+\.\s/, '').trim())
    }
  }
  
  return items
}

// Функция для интеллектуального сокращения текста
function smartTruncate(text: string, maxLength: number): string {
  // Сначала очищаем markdown
  text = cleanMarkdown(text)
  
  if (text.length <= maxLength) return text
  
  // Ищем последнее предложение, которое умещается в лимит
  const sentences = text.match(/[^.!?]+[.!?]+/g) || []
  let result = ''
  
  for (const sentence of sentences) {
    if ((result + sentence).length <= maxLength) {
      result += sentence
    } else {
      break
    }
  }
  
  // Если получилось пусто, берем просто обрезку до последней точки
  if (!result.trim()) {
    result = text.substring(0, maxLength)
    const lastPeriod = result.lastIndexOf('.')
    if (lastPeriod > maxLength * 0.7) {
      result = result.substring(0, lastPeriod + 1)
    } else {
      result = result.trim() + '...'
    }
  }
  
  return result.trim()
}

// Функция для чтения и обработки кейсов
async function prepareCasesForPresentation() {
  console.log('📝 Подготовка кейсов для презентации...')
  
  const casesDir = path.join(process.cwd(), 'exported-cases')
  const files = await fs.readdir(casesDir)
  
  const caseFiles = files.filter(f => f.endsWith('.md') && f !== 'INDEX.md' && f !== 'README.md')
  
  const cases: CaseForPresentation[] = []
  
  for (const file of caseFiles) {
    const filePath = path.join(casesDir, file)
    const content = await fs.readFile(filePath, 'utf-8')
    
    // Парсим markdown
    const lines = content.split('\n')
    const title = lines[0].replace(/^#\s*/, '')
    
    let metadata: any = {}
    let challenge = ''
    let solution = ''
    let results = ''
    let images: string[] = []
    
    let currentSection = ''
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Извлекаем метаданные
      if (line.startsWith('**Slug:**')) {
        metadata.slug = line.replace('**Slug:**', '').trim()
      } else if (line.startsWith('**Технологии:**')) {
        metadata.technologies = line.replace('**Технологии:**', '').trim()
      }
      
      // Определяем секции
      if (line.startsWith('## Задача клиента')) {
        currentSection = 'challenge'
      } else if (line.startsWith('## Решение')) {
        currentSection = 'solution'
      } else if (line.startsWith('## Результаты')) {
        currentSection = 'results'
      } else if (currentSection && line.trim() && !line.startsWith('#') && !line.startsWith('**') && !line.startsWith('---')) {
        // Извлекаем изображения
        const imgMatch = line.match(/!\[.*?\]\((.*?)\)/)
        if (imgMatch) {
          images.push(imgMatch[1])
        } else if (!line.startsWith('![') && !line.startsWith('>')) {
          // Добавляем текст к соответствующей секции
          if (currentSection === 'challenge') challenge += line + ' '
          if (currentSection === 'solution') solution += line + ' '
          if (currentSection === 'results') results += line + ' '
        }
      }
    }
    
    // Сокращаем тексты до оптимальных размеров для презентации
    const challengeShort = smartTruncate(challenge.trim(), 350)
    const solutionShort = smartTruncate(solution.trim(), 400)
    const resultsShort = smartTruncate(results.trim(), 300)
    
    cases.push({
      slug: metadata.slug,
      title,
      challenge: challengeShort,
      solution: solutionShort,
      results: resultsShort,
      technologies: metadata.technologies,
      images: images.filter(img => !img.includes('consulting-case.png')).slice(0, 2) // Только первые 2 изображения
    })
    
    console.log(`✓ Обработан: ${title}`)
    console.log(`  Задача: ${challenge.trim().length} → ${challengeShort.length} символов`)
    console.log(`  Решение: ${solution.trim().length} → ${solutionShort.length} символов`)
    console.log(`  Результаты: ${results.trim().length} → ${resultsShort.length} символов`)
  }
  
  // Сохраняем в JSON
  const outputPath = path.join(process.cwd(), 'exported-cases', 'cases-for-presentation.json')
  await fs.writeFile(outputPath, JSON.stringify(cases, null, 2), 'utf-8')
  
  console.log(`\n✅ Подготовлено ${cases.length} кейсов`)
  console.log(`📄 Сохранено в: ${outputPath}`)
  console.log(`\n💡 Теперь запустите: pnpm generate:presentation`)
}

// Запуск
prepareCasesForPresentation().catch((error) => {
  console.error('❌ Ошибка при подготовке:', error)
  process.exit(1)
})
