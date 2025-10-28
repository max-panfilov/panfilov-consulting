/**
 * Скрипт для обновления количества кейсов в блоке FeaturedCases
 * с 3 до 4 для всех существующих страниц
 * 
 * Запуск: npx ts-node src/scripts/updateFeaturedCasesLimit.ts
 */

import { getPayload } from 'payload'
import config from '@payload-config'

async function updateFeaturedCasesLimit() {
  const payload = await getPayload({ config })

  console.log('Начинаем обновление страниц...')

  // Получаем все страницы
  const pages = await payload.find({
    collection: 'pages',
    limit: 1000,
  })

  let updatedCount = 0

  for (const page of pages.docs) {
    let needsUpdate = false
    const updatedLayout = page.layout?.map((block: any) => {
      // Проверяем, является ли это блоком FeaturedCases
      if (block.blockType === 'featuredCases' && block.casesToShow === 3) {
        console.log(`Обновляем страницу: ${page.title} (ID: ${page.id})`)
        needsUpdate = true
        return {
          ...block,
          casesToShow: 4,
        }
      }
      return block
    })

    // Если блок требует обновления, сохраняем страницу
    if (needsUpdate) {
      await payload.update({
        collection: 'pages',
        id: page.id,
        data: {
          layout: updatedLayout,
        },
      })
      updatedCount++
    }
  }

  console.log(`\nГотово! Обновлено страниц: ${updatedCount}`)
  process.exit(0)
}

updateFeaturedCasesLimit().catch((error) => {
  console.error('Ошибка при обновлении:', error)
  process.exit(1)
})
