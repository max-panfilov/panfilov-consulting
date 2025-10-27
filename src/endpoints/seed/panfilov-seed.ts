import type { Payload, PayloadRequest } from 'payload'

// Seed-скрипт для заполнения контента сайта Panfilov Consulting
export const panfilovSeed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('🌱 Starting Panfilov Consulting seed...')

  try {
    // 1. Создаём категорию "Экспертиза"
    payload.logger.info('📁 Creating category "Экспертиза"...')
    const expertiseCategory = await payload.create({
      collection: 'categories',
      data: {
        title: 'Экспертиза',
        slug: 'ekspertiza',
      },
    })

    // 2. Создаём кейсы
    payload.logger.info('💼 Creating cases...')
    
    const case1 = await payload.create({
      collection: 'cases',
      draft: true,
      data: {
        title: 'AI-чатбот для ДКС',
        slug: 'dks-chatbot',
        industry: 'electronics',
        challenge: 'Снизить нагрузку на службу поддержки и ускорить консультацию клиентов по широкому ассортименту электротехнической продукции.',
        solution: {
          root: {
            type: 'root',
            version: 1,
            direction: 'ltr',
            format: '',
            indent: 0,
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: 'Разработали интеллектуального чат-бота на базе RAG-архитектуры, который консультирует клиентов по техническим характеристикам продукции, помогает с подбором аналогов и отвечает на типовые вопросы.',
                  },
                ],
              },
            ],
          },
        },
        results: {
          root: {
            type: 'root',
            version: 1,
            direction: 'ltr',
            format: '',
            indent: 0,
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: 'Целевой рост автоматизации ответов с 30% до 70%+. Сокращение времени ответа на запросы клиентов с 4 часов до 2 минут. Освобождено 40% времени специалистов поддержки для решения сложных задач.',
                  },
                ],
              },
            ],
          },
        },
        shortDescription: 'AI-чатбот для консультации клиентов по продукции с автоматизацией 70%+ ответов',
        technologies: [
          { technology: 'OpenAI GPT-4' },
          { technology: 'RAG' },
          { technology: 'Python' },
          { technology: 'FastAPI' },
          { technology: 'PostgreSQL' },
        ],
        featured: true,
        _status: 'published',
      },
    })

    const case2 = await payload.create({
      collection: 'cases',
      draft: true,
      data: {
        title: 'Автоматизация обработки заявок для компании по металлопрокату',
        slug: 'metalloprokat-telegram-bot',
        industry: 'metallurgy',
        challenge: 'Обработка заявок клиентов поступала в разных форматах (фото, PDF, Excel), требовала ручной обработки и занимала до 2 часов на одну заявку.',
        solution: {
          root: {
            type: 'root',
            version: 1,
            direction: 'ltr',
            format: '',
            indent: 0,
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: 'Создали Telegram-бота с интеграцией OCR и LLM для распознавания заявок в любом формате. Бот автоматически извлекает данные, формирует структурированную заявку и генерирует коммерческое предложение.',
                  },
                ],
              },
            ],
          },
        },
        results: {
          root: {
            type: 'root',
            version: 1,
            direction: 'ltr',
            format: '',
            indent: 0,
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: 'Время обработки заявки сократилось с 2 часов до 10 минут. Устранены ошибки при ручном вводе данных. Увеличена пропускная способность отдела продаж в 3 раза.',
                  },
                ],
              },
            ],
          },
        },
        shortDescription: 'Telegram-бот с OCR для обработки заявок: от 2 часов до 10 минут',
        technologies: [
          { technology: 'Telegram Bot API' },
          { technology: 'OCR' },
          { technology: 'YandexGPT' },
          { technology: 'Python' },
          { technology: 'PostgreSQL' },
        ],
        featured: true,
        _status: 'published',
      },
    })

    const case3 = await payload.create({
      collection: 'cases',
      draft: true,
      data: {
        title: 'On-premise AI-платформа для юридической компании',
        slug: 'law-firm-onpremise-ai',
        industry: 'legal',
        challenge: 'Необходимость безопасной работы с конфиденциальными документами клиентов при проведении Due Diligence без передачи данных сторонним LLM-провайдерам.',
        solution: {
          root: {
            type: 'root',
            version: 1,
            direction: 'ltr',
            format: '',
            indent: 0,
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: 'Развернули on-premise AI-платформу на базе открытых LLM моделей в закрытом контуре компании. Система анализирует договоры, выявляет риски и формирует резюме по документам.',
                  },
                ],
              },
            ],
          },
        },
        results: {
          root: {
            type: 'root',
            version: 1,
            direction: 'ltr',
            format: '',
            indent: 0,
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: '100% конфиденциальность данных клиентов. Ускорение анализа документов в 5 раз. Юристы получили инструмент для быстрой и безопасной работы с большими объемами документов.',
                  },
                ],
              },
            ],
          },
        },
        shortDescription: 'On-premise AI для безопасной работы с конфиденциальными документами',
        technologies: [
          { technology: 'LLaMA 3' },
          { technology: 'Docker' },
          { technology: 'Kubernetes' },
          { technology: 'Python' },
          { technology: 'MinIO' },
        ],
        featured: true,
        _status: 'published',
      },
    })

    // 3. Создаём посты в блоге
    payload.logger.info('📝 Creating blog posts...')
    
    const post1 = await payload.create({
      collection: 'posts',
      data: {
        title: 'RAG для среднего и крупного бизнеса в РФ: обзор решений и лучшие практики',
        slug: 'rag-for-business-russia',
        content: {
          root: {
            type: 'root',
            version: 1,
            direction: 'ltr',
            format: '',
            indent: 0,
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: 'Подробный обзор технологии RAG (Retrieval-Augmented Generation) и её применения в российском бизнесе.',
                  },
                ],
              },
            ],
          },
        },
        categories: [expertiseCategory.id],
        meta: {
          title: 'RAG для бизнеса в России',
          description: 'Подробный обзор технологии RAG (Retrieval-Augmented Generation) и её применения в российском бизнесе. Сравнение готовых решений и практические рекомендации.',
        },
        _status: 'published',
      },
    })

    const post2 = await payload.create({
      collection: 'posts',
      data: {
        title: 'Сравнение on-prem AI-моделей для использования в бизнесе',
        slug: 'onprem-ai-models-comparison',
        content: {
          root: {
            type: 'root',
            version: 1,
            direction: 'ltr',
            format: '',
            indent: 0,
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: 'Анализ открытых LLM-моделей для развертывания внутри компании: LLaMA, Mistral, Qwen и другие.',
                  },
                ],
              },
            ],
          },
        },
        categories: [expertiseCategory.id],
        meta: {
          title: 'Сравнение on-premise AI моделей',
          description: 'Анализ открытых LLM-моделей для развертывания внутри компании: LLaMA, Mistral, Qwen и другие. Производительность, требования к ресурсам, кейсы использования.',
        },
        _status: 'published',
      },
    })

    const post3 = await payload.create({
      collection: 'posts',
      data: {
        title: 'Обзор GenAI в ключевых отраслях: от финансов до транспорта',
        slug: 'genai-industry-overview',
        content: {
          root: {
            type: 'root',
            version: 1,
            direction: 'ltr',
            format: '',
            indent: 0,
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    text: 'Как генеративный AI трансформирует различные отрасли экономики.',
                  },
                ],
              },
            ],
          },
        },
        categories: [expertiseCategory.id],
        meta: {
          title: 'GenAI в ключевых отраслях',
          description: 'Как генеративный AI трансформирует различные отрасли экономики. Реальные кейсы применения, ожидаемые эффекты и подводные камни внедрения.',
        },
        _status: 'published',
      },
    })

    // 4. Создаём форму обратной связи
    payload.logger.info('📋 Creating contact form...')
    
    const contactForm = await payload.create({
      collection: 'forms',
      data: {
        title: 'Заявка на консультацию',
        fields: [
          {
            blockType: 'text',
            name: 'name',
            label: 'Ваше имя',
            required: true,
          },
          {
            blockType: 'text',
            name: 'company',
            label: 'Название компании',
            required: false,
          },
          {
            blockType: 'email',
            name: 'email',
            label: 'Email для связи',
            required: true,
          },
          {
            blockType: 'text',
            name: 'phone',
            label: 'Телефон',
            required: false,
          },
          {
            blockType: 'textarea',
            name: 'message',
            label: 'Опишите вашу задачу или вопрос',
            required: true,
          },
        ],
        submitButtonLabel: 'Отправить заявку',
        confirmationType: 'redirect',
        redirect: {
          url: '/thank-you',
        },
        emails: [
          {
            emailTo: 'start@panfilov.consulting',
            subject: 'Новая заявка с сайта',
            message: {
              root: {
                type: 'root',
                version: 1,
                direction: 'ltr',
                format: '',
                indent: 0,
                children: [
                  {
                    type: 'paragraph',
                    version: 1,
                    children: [
                      {
                        type: 'text',
                        text: 'Получена новая заявка с сайта panfilov.consulting',
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
      },
    })

    payload.logger.info('✅ Panfilov Consulting seed completed successfully!')
    payload.logger.info(`   - Category created: ${expertiseCategory.id}`)
    payload.logger.info(`   - Cases created: 3`)
    payload.logger.info(`   - Posts created: 3`)
    payload.logger.info(`   - Form created: ${contactForm.id}`)
  } catch (error) {
    payload.logger.error('❌ Error seeding Panfilov Consulting data:')
    payload.logger.error(error)
    throw error
  }
}
