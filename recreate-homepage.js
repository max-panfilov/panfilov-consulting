#!/usr/bin/env node
/**
 * Скрипт для пересоздания главной страницы без удаления остального контента
 */

// Загружаем переменные окружения
import('dotenv/config')

async function recreateHomePage() {
  console.log('🏠 Starting homepage recreation...\n')

  try {
    // Импортируем необходимые модули
    const { homePageSeed } = await import('./src/endpoints/seed/homepage-seed.ts')
    const configPromise = await import('./src/payload.config.ts')
    const { getPayload } = await import('payload')

    const payload = await getPayload({ config: configPromise.default })

    // Проверяем существует ли уже страница home
    const existingPage = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'home',
        },
      },
      limit: 1,
    })

    if (existingPage.docs.length > 0) {
      console.log('⚠️  Home page already exists. Deleting old version...')
      await payload.delete({
        collection: 'pages',
        id: existingPage.docs[0].id,
        context: {
          disableRevalidate: true,
        },
      })
      console.log('✅ Old home page deleted\n')
    }

    // Создаем новую главную страницу
    console.log('📄 Creating new home page...')
    await homePageSeed({ payload, req: {} })

    console.log('\n✅ Homepage recreation completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error recreating homepage:')
    console.error(error)
    process.exit(1)
  }
}

recreateHomePage()
