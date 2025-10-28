import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

async function addArchiveBlocks() {
  console.log('📦 Добавление блоков архива на главную страницу...\n')
  
  const payload = await getPayload({ config })
  
  // Находим страницу home
  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home'
      }
    },
    limit: 1
  })
  
  if (pages.docs.length === 0) {
    console.log('❌ Страница home не найдена')
    process.exit(1)
  }
  
  const homePage = pages.docs[0]
  console.log(`✅ Страница home найдена (ID: ${homePage.id})`)
  console.log(`Текущее количество блоков: ${homePage.layout?.length || 0}\n`)
  
  // Создаем блок архива постов
  const postsArchiveBlock = {
    blockType: 'archive',
    introContent: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Наш блог',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Читайте наши последние статьи о технологиях искусственного интеллекта, внедрении GenAI и лучших практиках разработки.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    populateBy: 'collection',
    relationTo: 'posts',
    limit: 6,
  }
  
  // Создаем блок архива кейсов
  const casesArchiveBlock = {
    blockType: 'archive',
    introContent: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Все наши кейсы',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Ознакомьтесь с реализованными проектами и результатами нашей работы.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    populateBy: 'collection',
    relationTo: 'cases',
    limit: 6,
  }
  
  // Добавляем блоки в layout (после блока featuredCases, перед contactForm)
  const currentLayout = homePage.layout || []
  
  // Находим индекс блока contactForm
  const contactFormIndex = currentLayout.findIndex((block: any) => block.blockType === 'contactForm')
  
  let newLayout
  if (contactFormIndex > -1) {
    // Вставляем блоки перед contactForm
    newLayout = [
      ...currentLayout.slice(0, contactFormIndex),
      casesArchiveBlock,
      postsArchiveBlock,
      ...currentLayout.slice(contactFormIndex),
    ]
  } else {
    // Если contactForm не найден, добавляем в конец
    newLayout = [
      ...currentLayout,
      casesArchiveBlock,
      postsArchiveBlock,
    ]
  }
  
  // Обновляем страницу
  await payload.update({
    collection: 'pages',
    id: homePage.id,
    data: {
      layout: newLayout,
    },
  })
  
  console.log('✅ Блоки архива добавлены!')
  console.log(`  • Архив кейсов (лимит: 6)`)
  console.log(`  • Архив постов (лимит: 6)`)
  console.log(`\nНовое количество блоков: ${newLayout.length}`)
  
  process.exit(0)
}

addArchiveBlocks()
