import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

async function checkHomePage() {
  console.log('🔍 Проверка страницы home...\n')
  
  const payload = await getPayload({ config })
  
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
    console.log('❌ Страница home НЕ найдена в базе данных')
    console.log('Используется статический fallback с пустым layout\n')
  } else {
    const homePage = pages.docs[0]
    console.log('✅ Страница home найдена')
    console.log(`ID: ${homePage.id}`)
    console.log(`Заголовок: ${homePage.title}`)
    console.log(`Количество блоков в layout: ${homePage.layout?.length || 0}\n`)
    
    if (homePage.layout && homePage.layout.length > 0) {
      console.log('Блоки на странице:')
      homePage.layout.forEach((block: any, index: number) => {
        console.log(`  ${index + 1}. ${block.blockType}`)
      })
    } else {
      console.log('⚠️  Layout пустой!')
    }
  }
  
  process.exit(0)
}

checkHomePage()
