# Руководство по использованию Content Manager (Payload Local API)

## Обзор

Content Manager — это набор утилит для управления контентом через Payload Local API. Позволяет выполнять CRUD операции (создание, чтение, обновление, удаление) с любыми коллекциями без необходимости использования админ-панели или HTTP запросов.

## Основные файлы

- **`src/scripts/content-manager.ts`** — универсальный менеджер с CRUD функциями
- **`src/scripts/recreate-homepage-local.ts`** — пример CLI скрипта для пересоздания главной страницы
- **`src/scripts/recreate-homepage.ts`** — версия через HTTP API (требует запущенного сервера)

## Быстрый старт

### Пересоздание главной страницы

```bash
pnpm recreate:homepage:local
```

Эта команда:
1. Удаляет существующую главную страницу (slug: 'home')
2. Создает новую страницу со всеми блоками
3. Автоматически завершается после выполнения

## Доступные функции Content Manager

### 1. Поиск документов

```typescript
import { findDocuments } from '@/scripts/content-manager'

// Найти все опубликованные посты
const posts = await findDocuments('posts', {
  _status: { equals: 'published' }
})

// Найти кейсы определенной индустрии
const cases = await findDocuments('cases', {
  industry: { equals: 'electronics' }
})
```

### 2. Поиск по ID

```typescript
import { findDocumentById } from '@/scripts/content-manager'

const page = await findDocumentById('pages', '507f1f77bcf86cd799439011')
```

### 3. Создание документа

```typescript
import { createDocument } from '@/scripts/content-manager'

const newPost = await createDocument('posts', {
  title: 'Новый пост',
  slug: 'novyy-post',
  _status: 'draft',
  content: [
    {
      children: [
        {
          text: 'Содержание поста',
        },
      ],
    },
  ],
})
```

### 4. Обновление документа

```typescript
import { updateDocument } from '@/scripts/content-manager'

const updatedPage = await updateDocument(
  'pages',
  '507f1f77bcf86cd799439011',
  {
    title: 'Обновленный заголовок',
    _status: 'published',
  }
)
```

### 5. Удаление документа

```typescript
import { deleteDocument } from '@/scripts/content-manager'

await deleteDocument('pages', '507f1f77bcf86cd799439011')
```

### 6. Массовое удаление

```typescript
import { deleteDocuments } from '@/scripts/content-manager'

// Удалить все черновики постов
await deleteDocuments('posts', {
  _status: { equals: 'draft' }
})
```

## Создание собственных скриптов

### Шаблон CLI скрипта

Создайте файл `src/scripts/your-script.ts`:

```typescript
#!/usr/bin/env tsx

/**
 * Описание вашего скрипта
 * Запуск: pnpm your-script
 */

import 'dotenv/config'
import { findDocuments, updateDocument } from './content-manager'

async function main() {
  console.log('🚀 Starting script...')

  try {
    // Ваша логика здесь
    const posts = await findDocuments('posts', {
      _status: { equals: 'draft' }
    })

    console.log(`Found ${posts.docs.length} draft posts`)

    // Обновляем все черновики
    for (const post of posts.docs) {
      await updateDocument('posts', post.id, {
        _status: 'published'
      })
      console.log(`✅ Published: ${post.title}`)
    }

    // Явно завершаем процесс
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

main()
```

### Добавление npm скрипта

Добавьте в `package.json`:

```json
{
  "scripts": {
    "your-script": "cross-env NODE_OPTIONS=--no-deprecation tsx src/scripts/your-script.ts"
  }
}
```

Запуск:

```bash
pnpm your-script
```

## Примеры использования

### Пример 1: Массовое обновление мета-тегов

```typescript
import 'dotenv/config'
import { findDocuments, updateDocument } from './content-manager'

async function updateMetaTags() {
  const pages = await findDocuments('pages', {})

  for (const page of pages.docs) {
    await updateDocument('pages', page.id, {
      meta: {
        title: `${page.title} | Panfilov Consulting`,
        description: page.meta?.description || 'Консалтинг и разработка AI-решений',
      },
    })
    console.log(`✅ Updated meta for: ${page.title}`)
  }

  process.exit(0)
}

updateMetaTags()
```

### Пример 2: Экспорт контента в JSON

```typescript
import 'dotenv/config'
import { findDocuments } from './content-manager'
import fs from 'fs'

async function exportPosts() {
  const posts = await findDocuments('posts', {
    _status: { equals: 'published' }
  })

  fs.writeFileSync(
    'backup/posts.json',
    JSON.stringify(posts.docs, null, 2)
  )

  console.log(`✅ Exported ${posts.docs.length} posts`)
  process.exit(0)
}

exportPosts()
```

### Пример 3: Создание тестовых данных

```typescript
import 'dotenv/config'
import { createDocument } from './content-manager'

async function seedTestData() {
  const testPosts = [
    { title: 'Тест 1', slug: 'test-1' },
    { title: 'Тест 2', slug: 'test-2' },
    { title: 'Тест 3', slug: 'test-3' },
  ]

  for (const post of testPosts) {
    await createDocument('posts', {
      ...post,
      _status: 'draft',
      content: [
        {
          children: [{ text: 'Тестовое содержание' }],
        },
      ],
    })
    console.log(`✅ Created: ${post.title}`)
  }

  process.exit(0)
}

seedTestData()
```

## Важные особенности

### Отключение ревалидации

При работе вне Next.js runtime необходимо отключать автоматическую ревалидацию страниц. Для этого передавайте `context` в операции:

```typescript
const context = { disableRevalidate: true }

await payload.create({
  collection: 'pages',
  context,
  data: { /* ... */ }
})
```

Все функции в `content-manager.ts` уже настроены с правильным контекстом.

### Явное завершение процесса

Всегда добавляйте `process.exit(0)` в конце успешного выполнения скрипта:

```typescript
try {
  // ваш код
  process.exit(0)
} catch (error) {
  console.error(error)
  process.exit(1)
}
```

Это необходимо, так как Payload держит открытым соединение с БД.

### Загрузка переменных окружения

Всегда импортируйте `dotenv/config` в начале скрипта:

```typescript
import 'dotenv/config'
```

## Отладка

### Включение подробного логирования

```typescript
const payload = await getPayloadInstance()
payload.logger.level = 'debug'
```

### Просмотр структуры документа

```typescript
const doc = await findDocumentById('pages', 'id')
console.log(JSON.stringify(doc, null, 2))
```

### Проверка подключения к БД

```bash
# Проверьте DATABASE_URI в .env
cat .env | grep DATABASE_URI
```

## Типизация

Все функции используют TypeScript и автоматически генерируемые типы из Payload:

```typescript
import type { Page, Post, Case } from '@/payload-types'

// Типизированное создание
const newPage: Partial<Page> = {
  title: 'Новая страница',
  slug: 'new-page',
  _status: 'published',
}

await createDocument('pages', newPage)
```

## Безопасность

⚠️ **Важно:**

- Скрипты выполняются с полным доступом к БД (bypass access control)
- Никогда не коммитьте `.env` файл в репозиторий
- Используйте эти скрипты только в development окружении
- Для production используйте API endpoints с аутентификацией

## Дополнительные ресурсы

- [Content Manager Security Guide](./content-manager-security.md) - Безопасность и защита endpoints
- [Script Templates](./script-templates.md) - Готовые шаблоны скриптов
- [Payload Local API Documentation](https://payloadcms.com/docs/local-api/overview)
- [Payload Collections](https://payloadcms.com/docs/configuration/collections)
- [Payload Queries](https://payloadcms.com/docs/queries/overview)

## FAQ

**Q: Можно ли запускать скрипты на production?**  
A: Да, но рекомендуется использовать их только в development. Для production лучше создать защищенные API endpoints.

**Q: Скрипт завис и не завершается**  
A: Добавьте `process.exit(0)` в конце функции `main()`.

**Q: Ошибка "missing secret key"**  
A: Убедитесь, что импортировали `dotenv/config` и в `.env` есть `PAYLOAD_SECRET`.

**Q: Ошибка "revalidatePath"**  
A: Добавьте `context: { disableRevalidate: true }` в операции Payload или используйте функции из `content-manager.ts`.

**Q: Как обновить несколько документов одновременно?**  
A: Используйте цикл `for...of` (не `forEach`) для последовательного выполнения.

## Поддержка

При возникновении проблем проверьте:

1. ✅ `.env` файл загружен
2. ✅ База данных доступна
3. ✅ `process.exit(0)` добавлен в конец
4. ✅ Все зависимости установлены (`pnpm install`)
5. ✅ TypeScript типы сгенерированы (`pnpm generate:types`)
