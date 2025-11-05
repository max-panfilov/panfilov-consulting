import { getPayload } from 'payload'
import config from '@payload-config'
import type { Page, Post, Case } from '@/payload-types'

/**
 * Генерация динамического sitemap.xml
 * Собирает все опубликованные страницы, посты и кейсы
 */
export async function GET() {
  const payload = await getPayload({ config })
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  try {
    // Получаем все опубликованные страницы
    const pagesResult = await payload.find({
      collection: 'pages',
      where: {
        _status: {
          equals: 'published',
        },
      },
      limit: 1000,
      depth: 0,
    })

    // Получаем все опубликованные посты
    const postsResult = await payload.find({
      collection: 'posts',
      where: {
        _status: {
          equals: 'published',
        },
      },
      limit: 1000,
      depth: 0,
    })

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
    })

    // Генерируем XML для страниц
    const pagesXml = pagesResult.docs
      .map((page: Page) => {
        const slug = page.slug === 'home' ? '' : page.slug
        const lastmod = page.updatedAt ? new Date(page.updatedAt).toISOString() : new Date().toISOString()
        
        return `
  <url>
    <loc>${baseUrl}/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.slug === 'home' ? '1.0' : '0.8'}</priority>
  </url>`
      })
      .join('')

    // Генерируем XML для постов
    const postsXml = postsResult.docs
      .map((post: Post) => {
        const lastmod = post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date().toISOString()
        
        return `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
      })
      .join('')

    // Генерируем XML для кейсов
    const casesXml = casesResult.docs
      .map((caseItem: Case) => {
        const lastmod = caseItem.updatedAt ? new Date(caseItem.updatedAt).toISOString() : new Date().toISOString()
        
        return `
  <url>
    <loc>${baseUrl}/cases/${caseItem.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
      })
      .join('')

    // Собираем полный sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${pagesXml}
${postsXml}
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
    console.error('Error generating sitemap:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
}
