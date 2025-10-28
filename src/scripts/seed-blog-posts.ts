// @ts-nocheck
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

// Данные для постов блога
const blogPosts = [
  {
    title: 'Как GenAI трансформирует бизнес-процессы в 2024 году',
    slug: 'genai-business-transformation-2024',
    excerpt: 'Разбираем реальные кейсы применения генеративного ИИ в бизнесе и измеряем ROI внедрения.',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Генеративный искусственный интеллект становится ключевым драйвером цифровой трансформации. По данным McKinsey, компании, внедрившие GenAI, сообщают о росте производительности на 20-40%.',
                version: 1,
              },
            ],
            version: 1,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                text: 'Основные области применения',
                version: 1,
              },
            ],
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Автоматизация клиентской поддержки, генерация контента, анализ данных и персонализация — это лишь некоторые из направлений, где GenAI показывает впечатляющие результаты.',
                version: 1,
              },
            ],
            version: 1,
          },
        ],
        version: 1,
      },
    },
  },
  {
    title: '5 ошибок при внедрении ИИ, которых стоит избегать',
    slug: '5-ai-implementation-mistakes',
    excerpt: 'От выбора неправильной модели до игнорирования человеческого фактора — разбираем типичные проблемы.',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Внедрение ИИ-решений может принести огромную пользу бизнесу, но только при правильном подходе. Вот пять критических ошибок, которых следует избегать.',
                version: 1,
              },
            ],
            version: 1,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                text: '1. Отсутствие четкой бизнес-цели',
                version: 1,
              },
            ],
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Многие компании начинают с технологии, а не с проблемы. Это путь к провалу.',
                version: 1,
              },
            ],
            version: 1,
          },
        ],
        version: 1,
      },
    },
  },
  {
    title: 'RAG vs Fine-tuning: что выбрать для вашего проекта',
    slug: 'rag-vs-fine-tuning',
    excerpt: 'Сравниваем два подхода к адаптации LLM под конкретные задачи и помогаем определиться с выбором.',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'При работе с большими языковыми моделями возникает вопрос: использовать RAG (Retrieval-Augmented Generation) или дообучать модель? У каждого подхода свои преимущества.',
                version: 1,
              },
            ],
            version: 1,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                text: 'RAG: быстро и гибко',
                version: 1,
              },
            ],
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'RAG позволяет быстро добавлять знания без дообучения модели, что идеально для динамично меняющихся данных.',
                version: 1,
              },
            ],
            version: 1,
          },
        ],
        version: 1,
      },
    },
  },
  {
    title: 'Промпт-инжиниринг: искусство общения с ИИ',
    slug: 'prompt-engineering-guide',
    excerpt: 'Практическое руководство по созданию эффективных промптов для получения лучших результатов от LLM.',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Качество ответов LLM напрямую зависит от того, как вы формулируете запросы. Промпт-инжиниринг — это навык, который можно освоить.',
                version: 1,
              },
            ],
            version: 1,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                text: 'Базовые принципы',
                version: 1,
              },
            ],
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Четкость, контекст и примеры — три кита успешного промпта.',
                version: 1,
              },
            ],
            version: 1,
          },
        ],
        version: 1,
      },
    },
  },
  {
    title: 'Безопасность ИИ: защита от prompt injection и других угроз',
    slug: 'ai-security-guide',
    excerpt: 'Как обезопасить ваши ИИ-системы от атак и обеспечить конфиденциальность данных.',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'С ростом популярности ИИ растут и угрозы безопасности. Prompt injection, утечки данных, adversarial attacks — эти термины должен знать каждый, кто работает с LLM.',
                version: 1,
              },
            ],
            version: 1,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                text: 'Что такое Prompt Injection',
                version: 1,
              },
            ],
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Prompt injection — это атака, при которой злоумышленник пытается изменить поведение модели через специально сформированные запросы.',
                version: 1,
              },
            ],
            version: 1,
          },
        ],
        version: 1,
      },
    },
  },
  {
    title: 'Мультимодальные модели: будущее ИИ уже здесь',
    slug: 'multimodal-ai-models',
    excerpt: 'GPT-4V, Gemini и другие модели, которые понимают не только текст, но и изображения, видео и аудио.',
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Мультимодальные модели открывают новые возможности для бизнеса: от анализа медицинских снимков до автоматического создания видеоконтента.',
                version: 1,
              },
            ],
            version: 1,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                text: 'Практические применения',
                version: 1,
              },
            ],
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'От распознавания документов до генерации дизайна — возможности ограничены только фантазией.',
                version: 1,
              },
            ],
            version: 1,
          },
        ],
        version: 1,
      },
    },
  },
]

async function seedBlogPosts() {
  console.log('📝 Создание постов блога...\n')
  
  const payload = await getPayload({ config })
  
  // Создаем placeholder изображение для постов, если его еще нет
  let placeholderMedia
  const existingMedia = await payload.find({
    collection: 'media',
    where: {
      alt: {
        equals: 'Blog Post Placeholder'
      }
    },
    limit: 1
  })
  
  if (existingMedia.docs.length > 0) {
    placeholderMedia = existingMedia.docs[0]
    console.log(`✅ Найдено существующее placeholder изображение (ID: ${placeholderMedia.id})\n`)
  } else {
    // Создаем SVG placeholder для постов
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#grad1)"/>
      <text x="600" y="315" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" font-weight="bold">
        Blog Post
      </text>
    </svg>`
    
    const buffer = Buffer.from(svg)
    placeholderMedia = await payload.create({
      collection: 'media',
      data: {
        alt: 'Blog Post Placeholder',
      },
      file: {
        data: buffer,
        mimetype: 'image/svg+xml',
        name: 'blog-placeholder.svg',
        size: buffer.length,
      },
    })
    console.log(`✅ Создано placeholder изображение (ID: ${placeholderMedia.id})\n`)
  }
  
  // Создаем посты
  for (const postData of blogPosts) {
    try {
      const post = await payload.create({
        collection: 'posts',
        data: {
          title: postData.title,
          slug: postData.slug,
          meta: {
            title: postData.title,
            description: postData.excerpt,
          },
          hero: {
            type: 'lowImpact',
            richText: postData.content,
          },
          populatedAuthors: [
            {
              name: 'Александр Панфилов',
            },
          ],
          _status: 'published',
          publishedAt: new Date().toISOString(),
        },
      })
      
      console.log(`✅ Создан пост: ${postData.title}`)
    } catch (error) {
      console.error(`❌ Ошибка при создании поста "${postData.title}":`, error)
    }
  }
  
  console.log(`\n✅ Создано ${blogPosts.length} постов блога!`)
  process.exit(0)
}

seedBlogPosts()
