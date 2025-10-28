#!/usr/bin/env tsx

/**
 * CLI скрипт для обновления логотипа в футере через Payload Local API
 * Запуск: pnpm update:footer
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function main() {
  console.log('🔄 Обновление футера через Local API...')

  try {
    const payload = await getPayload({ config: configPromise })

    // Создаем контекст для отключения ревалидации
    const context = { disableRevalidate: true }

    const result = await payload.updateGlobal({
      slug: 'footer',
      context,
      data: {
        logo: {
          src: '/logo.svg',
          alt: 'Panfilov Consulting',
          title: 'Panfilov Consulting',
        },
        tagline: 'Профессиональные решения для вашего бизнеса',
        copyright: `© ${new Date().getFullYear()} Panfilov Consulting. Все права защищены.`,
        menuItems: [
          {
            title: 'Продукт',
            links: [
              { text: 'Главная', url: '/' },
              { text: 'Кейсы', url: '/#cases' },
              { text: 'Блог', url: '/posts' },
            ],
          },
          {
            title: 'Компания',
            links: [
              { text: 'О нас', url: '/#about' },
              { text: 'Контакты', url: '/#form' },
            ],
          },
        ],
        bottomLinks: [
          { text: 'Политика конфиденциальности', url: '/privacy' },
        ],
      },
    })

    console.log('✅ Футер успешно обновлён!')
    console.log(`   - Логотип: ${result.logo?.src}`)
    console.log(`   - Слоган: ${result.tagline}`)
    console.log(`   - Секций меню: ${result.menuItems?.length || 0}`)

    // Явно завершаем процесс после успешного выполнения
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Ошибка при обновлении футера:')
    console.error(error.message)
    if (error.stack) {
      console.error('\n\nStack trace:')
      console.error(error.stack)
    }
    process.exit(1)
  }
}

main()
