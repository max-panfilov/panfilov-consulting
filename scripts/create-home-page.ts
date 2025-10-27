/**
 * Скрипт для создания главной страницы через Payload REST API
 * Использование: 
 * 1. Установите переменные окружения:
 *    export PAYLOAD_EMAIL="your@email.com"
 *    export PAYLOAD_PASSWORD="your_password"
 * 2. Запустите: tsx scripts/create-home-page.ts
 */

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://panfilov.consulting'
const API_ENDPOINT = `${API_URL}/api/pages`
const LOGIN_ENDPOINT = `${API_URL}/api/users/login`

// Учетные данные из переменных окружения
const EMAIL = process.env.PAYLOAD_EMAIL
const PASSWORD = process.env.PAYLOAD_PASSWORD

// Данные для главной страницы
const homePageData = {
  title: 'Главная',
  slug: 'home',
  // Hero секция (Lexical формат)
  hero: {
    type: 'lowImpact', // 'lowImpact' не требует media, для 'highImpact' и 'mediumImpact' нужно media
    richText: {
      root: {
        type: 'root',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Добро пожаловать на сайт Panfilov Consulting',
                type: 'text',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
          },
        ],
      },
    },
  },
  // Контентные блоки (Lexical формат)
  layout: [
    {
      blockType: 'content',
      columns: [
        {
          size: 'full',
          richText: {
            root: {
              type: 'root',
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: 'Мы предоставляем профессиональные консалтинговые услуги для вашего бизнеса.',
                      type: 'text',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  type: 'paragraph',
                  version: 1,
                },
              ],
            },
          },
        },
      ],
    },
    {
      blockType: 'cta',
      richText: {
        root: {
          type: 'root',
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Готовы начать работу?',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'paragraph',
              version: 1,
            },
          ],
        },
      },
      links: [
        {
          link: {
            type: 'custom',
            url: '/contact',
            label: 'Свяжитесь с нами',
          },
        },
      ],
    },
  ],
  // SEO метаданные
  meta: {
    title: 'Panfilov Consulting - Главная',
    description: 'Профессиональные консалтинговые услуги для вашего бизнеса',
  },
  publishedAt: new Date().toISOString(),
  _status: 'published', // публикуем сразу
}

// Функция для логина и получения токена
async function login(): Promise<string> {
  if (!EMAIL || !PASSWORD) {
    throw new Error('❌ Не указаны PAYLOAD_EMAIL или PAYLOAD_PASSWORD в переменных окружения')
  }

  console.log('🔐 Выполняется вход...')
  
  const response = await fetch(LOGIN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: EMAIL,
      password: PASSWORD,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Ошибка входа: ${response.status}, ${errorText}`)
  }

  const result = await response.json()
  console.log('✅ Вход выполнен успешно')
  return result.token
}

async function createHomePage() {
  // Получаем токен аутентификации
  const token = await login()
  try {
    console.log('🚀 Создание главной страницы...')
    console.log(`📍 API URL: ${API_ENDPOINT}`)

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`,
      },
      body: JSON.stringify(homePageData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const result = await response.json()
    console.log('✅ Главная страница успешно создана!')
    console.log('📄 ID страницы:', result.doc.id)
    console.log('🔗 Slug:', result.doc.slug)
    console.log('\n📋 Полный ответ:')
    console.log(JSON.stringify(result, null, 2))

    return result
  } catch (error) {
    console.error('❌ Ошибка при создании страницы:', error)
    throw error
  }
}

// Запуск скрипта
createHomePage()
  .then(() => {
    console.log('\n🎉 Скрипт успешно завершен!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Скрипт завершился с ошибкой:', error)
    process.exit(1)
  })
