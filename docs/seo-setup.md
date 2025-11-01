# Настройка SEO, Sitemap и Robots.txt

## Обзор

Проект использует встроенный SEO плагин Payload CMS (`@payloadcms/plugin-seo`) для управления метаданными и динамическую генерацию sitemap через Next.js API Routes.

## robots.txt

### Расположение
`public/robots.txt`

### Конфигурация
Файл автоматически доступен по адресу `https://yourdomain.com/robots.txt`.

Основные правила:
- ❌ **Запрещена индексация** админ-панели (`/admin/`)
- ❌ **Запрещена индексация** API endpoints (`/api/`)
- ✅ **Разрешена индексация** всего остального контента
- 🗺️ **Указан путь** к sitemap

### Перед деплоем

Замените в `robots.txt` переменную `${NEXT_PUBLIC_SERVER_URL}` на ваш реальный домен:
```txt
Sitemap: https://yourdomain.com/sitemap.xml
```

## Sitemap.xml

### Расположение
`src/app/(frontend)/sitemap.xml/route.ts`

### Как работает

1. **Динамическая генерация** - sitemap генерируется на лету при каждом запросе
2. **Кеширование** - результат кешируется на 1 час (3600 секунд)
3. **Данные** - собирает все опубликованные страницы и посты из Payload CMS

### Структура URL

**Страницы (Pages):**
- Главная: `/`
- Остальные: `/{slug}`
- Priority: 1.0 (главная), 0.8 (остальные)
- Changefreq: weekly

**Посты (Posts):**
- URL: `/blog/{slug}`
- Priority: 0.7
- Changefreq: weekly

### Доступ

После деплоя sitemap будет доступен по адресу:
```
https://yourdomain.com/sitemap.xml
```

### Кастомизация

Чтобы добавить другие коллекции в sitemap, отредактируйте `route.ts`:

```typescript
// Пример добавления коллекции "cases"
const casesResult = await payload.find({
  collection: 'cases',
  where: {
    _status: { equals: 'published' },
  },
  limit: 1000,
  depth: 0,
})

const casesXml = casesResult.docs
  .map((caseItem) => {
    const lastmod = caseItem.updatedAt 
      ? new Date(caseItem.updatedAt).toISOString() 
      : new Date().toISOString()
    
    return `
  <url>
    <loc>${baseUrl}/cases/${caseItem.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
  })
  .join('')

// Добавьте в финальный sitemap
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset ...>
${pagesXml}
${postsXml}
${casesXml}
</urlset>`
```

## SEO Plugin

### Конфигурация

SEO плагин уже настроен в `src/payload.config.ts`:

```typescript
seoPlugin({
  collections: ['pages', 'posts'],
  uploadsCollection: 'media',
  generateTitle: ({ doc }) => `Website.com — ${doc.title}`,
  generateDescription: ({ doc }) => doc.excerpt,
})
```

### Использование в коллекциях

Каждая коллекция с включенным SEO плагином автоматически получает группу полей `meta`:
- **meta.title** - заголовок страницы
- **meta.description** - описание для поисковиков
- **meta.image** - изображение для социальных сетей
- **meta.preview** - превью в админ-панели

### Рендеринг на фронтенде

В компонентах страниц используйте компонент `Metadata` из Next.js:

```typescript
import type { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const page = await getPageData(params.slug)
  
  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description,
    openGraph: {
      title: page.meta?.title || page.title,
      description: page.meta?.description,
      images: page.meta?.image ? [{ url: page.meta.image.url }] : [],
    },
  }
}
```

## Регистрация в поисковых системах

### Google Search Console

1. Зайдите в [Google Search Console](https://search.google.com/search-console)
2. Добавьте свой сайт
3. Отправьте sitemap: `https://yourdomain.com/sitemap.xml`

### Яндекс.Вебмастер

1. Зайдите в [Яндекс.Вебмастер](https://webmaster.yandex.ru/)
2. Добавьте свой сайт
3. В разделе "Индексирование" → "Файлы Sitemap" добавьте: `https://yourdomain.com/sitemap.xml`

## Проверка

### Локально

1. Запустите dev-сервер: `pnpm dev`
2. Откройте в браузере:
   - `http://localhost:3000/robots.txt`
   - `http://localhost:3000/sitemap.xml`

### После деплоя

1. Проверьте доступность:
   - `https://yourdomain.com/robots.txt`
   - `https://yourdomain.com/sitemap.xml`

2. Проверьте валидность sitemap:
   - [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

## Автоматическое обновление

Sitemap обновляется автоматически при каждом запросе (с кешированием на 1 час).

Чтобы поисковые системы быстрее узнавали об изменениях, можно добавить webhook в Payload CMS:

```typescript
// src/collections/Pages.ts
{
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'update' && doc._status === 'published') {
          // Уведомляем Google о новом контенте
          await fetch(
            `https://www.google.com/ping?sitemap=${process.env.NEXT_PUBLIC_SERVER_URL}/sitemap.xml`
          )
        }
      },
    ],
  },
}
```

## Чеклист перед запуском

- [ ] Обновить домен в `robots.txt`
- [ ] Проверить `NEXT_PUBLIC_SERVER_URL` в `.env`
- [ ] Протестировать sitemap локально
- [ ] Зарегистрировать сайт в Google Search Console
- [ ] Зарегистрировать сайт в Яндекс.Вебмастер
- [ ] Отправить sitemap в обе поисковые системы
- [ ] Проверить валидность sitemap после деплоя
