import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * Универсальный менеджер контента через Payload Local API
 * Позволяет выполнять CRUD операции с любой коллекцией
 */

// Получаем экземпляр Payload
async function getPayloadInstance() {
  return await getPayload({ config: configPromise })
}

/**
 * Найти документы по запросу
 */
export async function findDocuments(collection: string, where: any = {}) {
  const payload = await getPayloadInstance()
  return await payload.find({
    collection,
    where,
    limit: 100,
  })
}

/**
 * Найти документ по ID
 */
export async function findDocumentById(collection: string, id: string) {
  const payload = await getPayloadInstance()
  return await payload.findByID({
    collection,
    id,
  })
}

/**
 * Создать новый документ
 */
export async function createDocument(collection: string, data: any) {
  const payload = await getPayloadInstance()
  return await payload.create({
    collection,
    data,
  })
}

/**
 * Обновить документ по ID
 */
export async function updateDocument(collection: string, id: string, data: any) {
  const payload = await getPayloadInstance()
  return await payload.update({
    collection,
    id,
    data,
  })
}

/**
 * Удалить документ по ID
 */
export async function deleteDocument(collection: string, id: string) {
  const payload = await getPayloadInstance()
  return await payload.delete({
    collection,
    id,
  })
}

/**
 * Удалить несколько документов по запросу
 */
export async function deleteDocuments(collection: string, where: any) {
  const payload = await getPayloadInstance()
  return await payload.delete({
    collection,
    where,
  })
}

/**
 * Пересоздать главную страницу
 */
export async function recreateHomePage() {
  const payload = await getPayloadInstance()

  // Создаем контекст для отключения ревалидации
  const context = { disableRevalidate: true }

  // Удаляем старую главную страницу
  const existingPages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
    },
  })

  if (existingPages.docs.length > 0) {
    for (const page of existingPages.docs) {
      await payload.delete({
        collection: 'pages',
        id: page.id,
        context,
      })
    }
  }

  // Получаем необходимые зависимости
  const forms = await payload.find({
    collection: 'forms',
    where: {
      title: {
        equals: 'Заявка на консультацию',
      },
    },
    limit: 1,
  })

  const form = forms.docs[0]
  if (!form) {
    throw new Error('Form "Заявка на консультацию" not found!')
  }

  const categories = await payload.find({
    collection: 'categories',
    where: {
      title: {
        equals: 'Экспертиза',
      },
    },
    limit: 1,
  })

  const category = categories.docs[0]
  if (!category) {
    throw new Error('Category "Экспертиза" not found!')
  }

  // Создаем новую главную страницу
  return await payload.create({
    collection: 'pages',
    context,
    data: {
      title: 'Главная',
      slug: 'home',
      _status: 'published',
      meta: {
        title: 'Panfilov Consulting | Внедрение GenAI для бизнеса',
        description:
          'Консалтинг и разработка AI-решений для среднего и крупного бизнеса. Находим точки роста, автоматизируем процессы и создаем интеллектуальные решения.',
      },
      layout: [
        // 1. HeroHome
        {
          blockType: 'heroHome',
          heading: 'Внедряем GenAI для роста и оптимизации вашего бизнеса',
          subheading:
            'Находим точки роста, автоматизируем рутинные процессы и создаем интеллектуальные решения, которые повышают эффективность и сокращают издержки. Консалтинг и разработка AI-решений для среднего и крупного бизнеса.',
          primaryCTA: {
            text: 'Получить бесплатную консультацию',
            link: '#form',
          },
          secondaryCTA: {
            text: 'Посмотреть кейсы',
            link: '#cases',
          },
          mediaType: 'image',
          backgroundOverlay: true,
        },
        // 2. TargetAudience
        {
          blockType: 'targetAudience',
          heading: 'Наши решения созданы для лидеров, которые ищут точки роста',
          audiences: [
            {
              title: 'Для CEO и владельцев бизнеса',
              description:
                'Мы помогаем найти неочевидные источники роста и обойти конкурентов за счет технологического превосходства, а не простого расширения команды.',
              icon: 'TrendingUp',
            },
            {
              title: 'Для руководителей департаментов',
              description:
                'Автоматизируем до 80% рутинных операций, освобождая время вашей команды для решения стратегических задач и повышения качества работы.',
              icon: 'Zap',
            },
            {
              title: 'Для технических директоров (CTO)',
              description:
                'Предоставляем глубокую экспертизу в GenAI для реализации амбициозных проектов, минимизируя риски и затраты на поиск in-house специалистов.',
              icon: 'Code',
            },
            {
              title: 'Для компаний, богатых данными',
              description:
                'Превращаем ваши накопленные данные из пассивного архива в мощный актив, который помогает принимать точные решения и прогнозировать развитие рынка.',
              icon: 'Database',
            },
          ],
        },
        // 3. SolutionApproach
        {
          blockType: 'solutionApproach',
          heading: 'Мы не просто пишем код, мы решаем бизнес-задачи',
          subheading:
            'Наш подход — это комбинация глубокого анализа ваших процессов и передовых AI-технологий.',
          steps: [
            {
              title: 'Анализ и стратегия',
              description:
                'Погружаемся в ваш бизнес, находим процессы, где AI даст максимальный эффект. Формулируем гипотезы и дорожную карту.',
              icon: 'TrendingUp',
            },
            {
              title: 'Разработка и внедрение',
              description:
                'Создаем и интегрируем AI-решения: от чат-ботов и систем распознавания документов до сложных аналитических платформ.',
              icon: 'Settings',
            },
            {
              title: 'Обучение и поддержка',
              description:
                'Обучаем вашу команду работать с новыми инструментами и обеспечиваем поддержку после внедрения.',
              icon: 'GraduationCap',
            },
          ],
        },
        // 4. FeaturedCases
        {
          blockType: 'featuredCases',
          heading: 'Доказанная эффективность на практике',
          casesToShow: 3,
          autoSelect: true,
        },
        // 5. ExpertiseHighlight
        {
          blockType: 'expertiseHighlight',
          heading: 'Делимся знаниями и опытом',
          subheading:
            'Мы не только внедряем, но и глубоко исследуем AI-технологии. Читайте об этом в нашем блоге.',
          category: category.id,
          postsToShow: 3,
          ctaText: 'Перейти в блог',
          ctaLink: '/posts',
        },
        // 6. ContactForm
        {
          blockType: 'contactForm',
          heading: 'Готовы найти точки роста в вашем бизнесе с помощью AI?',
          description:
            'Оставьте заявку, и мы проведем бесплатную онлайн-встречу, где проанализируем ваши задачи и предложим конкретные идеи для внедрения AI.',
          form: form.id,
          htmlId: 'form',
        },
      ],
    },
  })
}

// Экспортируем для использования в endpoint
export { getPayloadInstance }
