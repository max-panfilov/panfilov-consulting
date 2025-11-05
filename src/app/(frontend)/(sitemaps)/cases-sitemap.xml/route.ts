import { getPayload } from 'payload'
import config from '@payload-config'
import type { Case } from '@/payload-types'

/**
 * Генерация sitemap для кейсов
 * Создает отдельный sitemap для коллекции cases
 */
export async function GET() {
  const payload = await getPayload({ config })
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  try {
    // Получаем все опубликованные кейсы
    const casesResult = await payload.find({
      collection: 'cases',
      where: {
        _status: {
          equals: 'published',
        },
      },
      limit: 1000,
      depth: 0,
      sort: '-updatedAt', // Сортируем по дате обновления (новые первыми)
    })

    // Генерируем XML для кейсов
    const casesXml = casesResult.docs
      .map((caseItem: Case) => {
        const lastmod = caseItem.updatedAt 
          ? new Date(caseItem.updatedAt).toISOString() 
          : new Date().toISOString()
        
        // Приоритет зависит от featured статуса
        const priority = caseItem.featured ? '0.9' : '0.8'
        
        return `
  <url>
    <loc>${baseUrl}/cases/${caseItem.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`
      })
      .join('')

    // Собираем sitemap для кейсов
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${casesXml}
</urlset>`

    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    })
  } catch (error) {
    console.error('Error generating cases sitemap:', error)
    return new Response('Error generating cases sitemap', { status: 500 })
  }
}
