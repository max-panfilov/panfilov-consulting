#!/usr/bin/env tsx

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import fs from 'fs'
import path from 'path'

// SVG иконки из lucide-react в виде path данных
const icons = {
  'dks-chatbot': {
    name: 'MessageSquareBot',
    path: 'M12 6V2H8v4m8 12v4h-4v-4M5.45 5.11L2.75 2.41M18.55 5.11l2.7-2.7M2.75 21.59l2.7-2.7M21.25 21.59l-2.7-2.7M12 12h.01M8 16h8M9 20h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z',
    color: '#3b82f6',
  },
  'legal-llm-platform': {
    name: 'Scale',
    path: 'M16 11h4m-4 0V7m0 4l3-3m-3 3l-3-3M3 20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-1.528c-.388 0-.76-.154-1.035-.428l-1.914-1.914A2 2 0 0 0 13.528 3H10.472a2 2 0 0 0-1.495.664L7.063 5.578A1.5 1.5 0 0 1 6.028 6H5a2 2 0 0 0-2 2v12z',
    color: '#8b5cf6',
  },
  'metallurgy-bot': {
    name: 'Bot',
    path: 'M12 8V4m0 4h.01M16 8h.01M8 8h.01M8.35 15.65L6 18m10.35-2.35L18 18M3 12a9 9 0 0 0 9 9 9 9 0 0 0 9-9 9 9 0 0 0-9-9 9 9 0 0 0-9 9z',
    color: '#f59e0b',
  },
  'digital-cases-platform': {
    name: 'Sparkles',
    path: 'm12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3ZM5 3v4M3 5h4M6 17v4M4 19h4',
    color: '#ec4899',
  },
  'medical-analysis-platform': {
    name: 'Activity',
    path: 'M22 12h-4l-3 9L9 3l-3 9H2',
    color: '#10b981',
  },
}

function generateSVG(slug: string): string {
  const icon = icons[slug as keyof typeof icons]
  if (!icon) return ''

  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <!-- Gradient background -->
  <defs>
    <linearGradient id="grad-${slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#grad-${slug})"/>
  
  <!-- Pattern overlay -->
  <g opacity="0.1">
    <circle cx="200" cy="100" r="100" fill="${icon.color}" />
    <circle cx="1000" cy="500" r="150" fill="${icon.color}" />
    <circle cx="600" cy="50" r="80" fill="${icon.color}" />
  </g>
  
  <!-- Icon -->
  <g transform="translate(600, 315)" filter="url(#glow)">
    <g transform="translate(-80, -80) scale(6.67)">
      <path d="${icon.path}" 
            fill="none" 
            stroke="${icon.color}" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"/>
    </g>
  </g>
</svg>`
}

async function main() {
  console.log('🎨 Генерация placeholder изображений...')

  try {
    const payload = await getPayload({ config: configPromise })
    const context = { disableRevalidate: true }

    // Получаем все кейсы
    const cases = await payload.find({
      collection: 'cases',
      limit: 100,
    })

    console.log(`\nНайдено ${cases.docs.length} кейсов`)

    const tempDir = path.join(process.cwd(), 'temp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    for (const caseItem of cases.docs) {
      const slug = caseItem.slug
      if (!slug || !icons[slug as keyof typeof icons]) {
        console.log(`⏭️  Пропуск кейса без slug или иконки: ${caseItem.title}`)
        continue
      }

      console.log(`\n📝 Обработка: ${caseItem.title}`)

      // Генерируем SVG
      const svgContent = generateSVG(slug)
      const tempFilePath = path.join(tempDir, `${slug}.svg`)
      fs.writeFileSync(tempFilePath, svgContent)

      // Загружаем в media
      const uploadedImage = await payload.create({
        collection: 'media',
        data: {
          alt: `${caseItem.title} cover`,
        },
        filePath: tempFilePath,
        context,
      })

      console.log(`  ✅ Создано изображение с ID: ${uploadedImage.id}`)

      // Обновляем кейс
      await payload.update({
        collection: 'cases',
        id: caseItem.id,
        data: {
          coverImage: uploadedImage.id,
        },
        context,
      })

      console.log(`  ✅ Обновлен кейс`)

      // Удаляем временный файл
      fs.unlinkSync(tempFilePath)
    }

    // Удаляем temp директорию
    if (fs.existsSync(tempDir)) {
      fs.rmdirSync(tempDir)
    }

    console.log('\n✅ Все placeholder изображения созданы!')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Ошибка:', error.message)
    if (error.stack) console.error(error.stack)
    process.exit(1)
  }
}

main()
