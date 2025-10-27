import type { Payload, PayloadRequest } from 'payload'

// Seed-скрипт для создания главной страницы согласно docs/homepage-content.md
export const homePageSeed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('🏠 Creating home page with all blocks...')

  try {
    // Получаем ID формы "Заявка на консультацию"
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
      payload.logger.error('Form "Заявка на консультацию" not found. Run panfilov-seed first!')
      return
    }

    // Получаем категорию "Экспертиза"
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
      payload.logger.error('Category "Экспертиза" not found. Run panfilov-seed first!')
      return
    }

    // Создаем главную страницу с блоками
    const homePage = await payload.create({
      collection: 'pages',
      draft: true,
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
                icon: 'FaUserTie',
              },
              {
                title: 'Для руководителей департаментов',
                description:
                  'Автоматизируем до 80% рутинных операций, освобождая время вашей команды для решения стратегических задач и повышения качества работы.',
                icon: 'FaBriefcase',
              },
              {
                title: 'Для технических директоров (CTO)',
                description:
                  'Предоставляем глубокую экспертизу в GenAI для реализации амбициозных проектов, минимизируя риски и затраты на поиск in-house специалистов.',
                icon: 'FaCode',
              },
              {
                title: 'Для компаний, богатых данными',
                description:
                  'Превращаем ваши накопленные данные из пассивного архива в мощный актив, который помогает принимать точные решения и прогнозировать развитие рынка.',
                icon: 'FaDatabase',
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
                icon: 'FaChartLine',
              },
              {
                title: 'Разработка и внедрение',
                description:
                  'Создаем и интегрируем AI-решения: от чат-ботов и систем распознавания документов до сложных аналитических платформ.',
                icon: 'FaCogs',
              },
              {
                title: 'Обучение и поддержка',
                description:
                  'Обучаем вашу команду работать с новыми инструментами и обеспечиваем поддержку после внедрения.',
                icon: 'FaGraduationCap',
              },
            ],
          },
          // 4. FeaturedCases
          {
            blockType: 'featuredCases',
            heading: 'Доказанная эффективность на практике',
            casesToShow: 3,
            autoSelect: true,
            ctaText: 'Посмотреть все кейсы',
            ctaLink: '/cases',
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

    payload.logger.info('✅ Home page created successfully!')
    payload.logger.info(`   - Page ID: ${homePage.id}`)
    payload.logger.info(`   - Page slug: ${homePage.slug}`)
    payload.logger.info(`   - Blocks: ${homePage.layout?.length || 0}`)
  } catch (error) {
    payload.logger.error('❌ Error creating home page:')
    payload.logger.error(error)
    throw error
  }
}
