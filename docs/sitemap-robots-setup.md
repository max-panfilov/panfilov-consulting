# Настройка Sitemap и Robots.txt

## Обзор

Проект использует динамическую генерацию sitemap для всех коллекций (Pages, Posts, Cases) и статический robots.txt для управления индексацией поисковыми роботами.

## Структура файлов

### Динамические sitemap-маршруты

```
src/app/(frontend)/
├── sitemap.xml/route.ts                     # Главный sitemap (все страницы)
└── (sitemaps)/
    ├── pages-sitemap.xml/route.ts          # Sitemap для страниц
    ├── posts-sitemap.xml/route.ts          # Sitemap для постов
    └── cases-sitemap.xml/route.ts          # Sitemap для кейсов (НОВЫЙ)
```

### Статические файлы

```
public/
├── robots.txt          # Правила для поисковых роботов
└── sitemap.xml         # Индексный sitemap (ссылки на другие sitemaps)
```

## Настройка sitemap

### 1. Главный sitemap (`/sitemap.xml`)

Собирает все опубликованные записи из коллекций:
- **Pages**: приоритет 1.0 для главной, 0.8 для остальных
- **Posts**: приоритет 0.7, частота обновления weekly
- **Cases**: приоритет 0.8-0.9 (зависит от featured), частота monthly

**Ключевые особенности:**
- Автоматически обновляется при публикации контента
- Использует `updatedAt` для `<lastmod>`
- Кэшируется на 1 час (`s-maxage=3600`)
- Поддержка stale-while-revalidate

### 2. Отдельные sitemaps

#### Pages Sitemap (`/pages-sitemap.xml`)
- Только опубликованные страницы (`_status: 'published'`)
- Главная страница (`slug: 'home'`) имеет приоритет 1.0
- Остальные страницы: приоритет 0.8

#### Posts Sitemap (`/posts-sitemap.xml`)
- Блог-посты по URL `/blog/{slug}`
- Приоритет 0.7
- Частота обновления: weekly

#### Cases Sitemap (`/cases-sitemap.xml`) ✨ **НОВЫЙ**
- Кейсы по URL `/cases/{slug}`
- Приоритет 0.9 для featured кейсов
- Приоритет 0.8 для обычных кейсов
- Частота обновления: monthly
- Сортировка по дате обновления (новые первыми)

### 3. Индексный sitemap (`/public/sitemap.xml`)

XML-файл, который объединяет все отдельные sitemaps:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>http://localhost:3000/pages-sitemap.xml</loc>
    <lastmod>2025-01-01T00:00:00.000Z</lastmod>
  </sitemap>
  <sitemap>
    <loc>http://localhost:3000/posts-sitemap.xml</loc>
    <lastmod>2025-01-01T00:00:00.000Z</lastmod>
  </sitemap>
  <sitemap>
    <loc>http://localhost:3000/cases-sitemap.xml</loc>
    <lastmod>2025-01-01T00:00:00.000Z</lastmod>
  </sitemap>
</sitemapindex>
```

## Настройка Robots.txt

### Структура файла

```txt
# robots.txt для Panfilov Consulting

User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/
Disallow: /_next/
Disallow: /static/

# Специальные правила для Яндекса
User-agent: Yandex
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/

# Специальные правила для Google
User-agent: Googlebot
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/

# Host
Host: http://localhost:3000

# Sitemaps
Sitemap: http://localhost:3000/sitemap.xml
Sitemap: http://localhost:3000/pages-sitemap.xml
Sitemap: http://localhost:3000/posts-sitemap.xml
Sitemap: http://localhost:3000/cases-sitemap.xml
```

### Правила индексации

#### Разрешено для индексации:
- ✅ Все страницы (`/`)
- ✅ Блог (`/blog/*`)
- ✅ Кейсы (`/cases/*`)
- ✅ Статические ресурсы (изображения, CSS)

#### Запрещено для индексации:
- ❌ Админ-панель (`/admin`, `/admin/*`)
- ❌ API эндпоинты (`/api/*`)
- ❌ Внутренние ресурсы Next.js (`/_next/*`)
- ❌ Статические служебные файлы (`/static/*`)

## Конфигурация next-sitemap

Файл `next-sitemap.config.cjs` используется для автоматической генерации robots.txt после билда:

```javascript
const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: [
    '/posts-sitemap.xml', 
    '/pages-sitemap.xml', 
    '/cases-sitemap.xml', 
    '/*', 
    '/posts/*', 
    '/cases/*'
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/'],
      },
    ],
    additionalSitemaps: [
      `${SITE_URL}/pages-sitemap.xml`, 
      `${SITE_URL}/posts-sitemap.xml`,
      `${SITE_URL}/cases-sitemap.xml`
    ],
  },
}
```

## Автоматическая ревалидация

При изменении контента sitemap автоматически обновляется благодаря хукам:

### revalidateCase.ts
```typescript
// После публикации/обновления кейса
await fetch(`${serverUrl}/cases-sitemap.xml`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/xml',
  },
})
```

### revalidatePost.ts
```typescript
// После публикации/обновления поста
await fetch(`${serverUrl}/posts-sitemap.xml`, {
  method: 'GET',
})
```

### revalidatePage.ts
```typescript
// После публикации/обновления страницы
await fetch(`${serverUrl}/pages-sitemap.xml`, {
  method: 'GET',
})
```

## Deployment

### Переменные окружения

Перед деплоем убедитесь, что установлена правильная переменная:

```env
NEXT_PUBLIC_SERVER_URL=https://your-domain.com
```

### Build процесс

1. **Сборка проекта**:
   ```bash
   pnpm build
   ```

2. **Автоматическая генерация sitemap** (через postbuild):
   ```bash
   pnpm postbuild
   # Выполняется: next-sitemap --config next-sitemap.config.cjs
   ```

3. **Проверка сгенерированных файлов**:
   - `public/robots.txt` - обновлен с правильным URL
   - `public/sitemap.xml` - индексный sitemap
   - Динамические роуты доступны через API

## Проверка работоспособности

### Локальная разработка

1. Запустите dev-сервер:
   ```bash
   pnpm dev
   ```

2. Проверьте URL в браузере:
   - http://localhost:3000/robots.txt
   - http://localhost:3000/sitemap.xml
   - http://localhost:3000/pages-sitemap.xml
   - http://localhost:3000/posts-sitemap.xml
   - http://localhost:3000/cases-sitemap.xml

### Проверка в Google Search Console

1. Откройте [Google Search Console](https://search.google.com/search-console)
2. Перейдите в раздел "Sitemaps"
3. Добавьте URL sitemap: `https://your-domain.com/sitemap.xml`
4. Проверьте статус индексации

### Проверка в Яндекс.Вебмастер

1. Откройте [Яндекс.Вебмастер](https://webmaster.yandex.ru/)
2. Выберите сайт
3. Перейдите в "Индексирование" → "Файлы Sitemap"
4. Добавьте sitemap и проверьте статус

## Тестирование robots.txt

### Онлайн валидаторы:
- [Google Robots Testing Tool](https://www.google.com/webmasters/tools/robots-testing-tool)
- [Validator.nu Robots.txt Validator](https://validator.nu/)

### Проверка через curl:
```bash
curl http://localhost:3000/robots.txt
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/cases-sitemap.xml
```

## Лучшие практики

### SEO оптимизация

1. **Частота обновления**:
   - Главная страница: `daily`
   - Блог-посты: `weekly`
   - Кейсы: `monthly`
   - Статические страницы: `monthly`

2. **Приоритеты** (0.0 - 1.0):
   - 1.0: Главная страница
   - 0.9: Featured кейсы
   - 0.8: Обычные кейсы и важные страницы
   - 0.7: Блог-посты
   - 0.5: Архивные страницы

3. **Размер sitemap**:
   - Максимум 50,000 URL на файл
   - Максимум 50 МБ несжатый
   - Используйте sitemap index при превышении лимитов

### Мониторинг

- Проверяйте robots.txt после каждого деплоя
- Отслеживайте индексацию в Google Search Console
- Проверяйте актуальность lastmod дат в sitemap
- Используйте Google Analytics для отслеживания органического трафика

## Troubleshooting

### Проблема: Sitemap не обновляется

**Решение:**
1. Очистите кеш Next.js: `rm -rf .next`
2. Пересоберите проект: `pnpm build`
3. Проверьте хуки ревалидации в коллекциях

### Проблема: Неправильный URL в sitemap

**Решение:**
1. Проверьте переменную `NEXT_PUBLIC_SERVER_URL` в `.env`
2. Убедитесь, что в URL нет завершающего слеша
3. Пересоберите проект после изменений

### Проблема: Robots.txt блокирует нужные страницы

**Решение:**
1. Проверьте правила в `public/robots.txt`
2. Используйте Google Robots Testing Tool для проверки
3. Убедитесь, что `Allow: /` указан для нужных user-agents

## Дополнительные ресурсы

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Google Search Central - Sitemaps](https://developers.google.com/search/docs/advanced/sitemaps/overview)
- [Robots.txt Specifications](https://developers.google.com/search/docs/advanced/robots/intro)
- [next-sitemap Documentation](https://github.com/iamvishnusankar/next-sitemap)
