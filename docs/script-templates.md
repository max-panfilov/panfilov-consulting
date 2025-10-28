# Готовые шаблоны скриптов Content Manager

Набор готовых шаблонов для типичных задач управления контентом.

## Массовая публикация черновиков

```typescript
#!/usr/bin/env tsx
import 'dotenv/config'
import { findDocuments, updateDocument } from './content-manager'

async function publishAllDrafts() {
  console.log('📝 Publishing all draft posts...')
  
  const drafts = await findDocuments('posts', {
    _status: { equals: 'draft' }
  })
  
  for (const post of drafts.docs) {
    await updateDocument('posts', post.id, {
      _status: 'published'
    })
    console.log(`✅ Published: ${post.title}`)
  }
  
  console.log(`\n🎉 Total published: ${drafts.docs.length}`)
  process.exit(0)
}

publishAllDrafts()
```

## Резервное копирование контента

```typescript
#!/usr/bin/env tsx
import 'dotenv/config'
import { findDocuments } from './content-manager'
import fs from 'fs'
import path from 'path'

async function backupContent() {
  console.log('💾 Creating backup...')
  
  const collections = ['pages', 'posts', 'cases']
  const backupDir = `backup/${new Date().toISOString().split('T')[0]}`
  
  fs.mkdirSync(backupDir, { recursive: true })
  
  for (const collection of collections) {
    const docs = await findDocuments(collection, {})
    
    fs.writeFileSync(
      path.join(backupDir, `${collection}.json`),
      JSON.stringify(docs.docs, null, 2)
    )
    
    console.log(`✅ Backed up ${docs.docs.length} ${collection}`)
  }
  
  console.log(`\n💾 Backup saved to: ${backupDir}`)
  process.exit(0)
}

backupContent()
```

## Обновление SEO мета-тегов

```typescript
#!/usr/bin/env tsx
import 'dotenv/config'
import { findDocuments, updateDocument } from './content-manager'

async function updateSEO() {
  console.log('🔍 Updating SEO meta tags...')
  
  const pages = await findDocuments('pages', {})
  const siteName = 'Panfilov Consulting'
  
  for (const page of pages.docs) {
    await updateDocument('pages', page.id, {
      meta: {
        title: `${page.title} | ${siteName}`,
        description: page.meta?.description || `${page.title} - профессиональные AI-решения`,
        keywords: page.meta?.keywords || 'AI, GenAI, консалтинг, автоматизация',
      }
    })
    console.log(`✅ Updated SEO: ${page.title}`)
  }
  
  process.exit(0)
}

updateSEO()
```

## Очистка старых черновиков

```typescript
#!/usr/bin/env tsx
import 'dotenv/config'
import { findDocuments, deleteDocument } from './content-manager'

async function cleanOldDrafts() {
  console.log('🧹 Cleaning old drafts...')
  
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const oldDrafts = await findDocuments('posts', {
    _status: { equals: 'draft' },
    updatedAt: { less_than: thirtyDaysAgo.toISOString() }
  })
  
  for (const draft of oldDrafts.docs) {
    await deleteDocument('posts', draft.id)
    console.log(`🗑️  Deleted: ${draft.title}`)
  }
  
  console.log(`\n✅ Cleaned ${oldDrafts.docs.length} old drafts`)
  process.exit(0)
}

cleanOldDrafts()
```

## Генерация тестовых данных

```typescript
#!/usr/bin/env tsx
import 'dotenv/config'
import { createDocument } from './content-manager'

async function generateTestData() {
  console.log('🧪 Generating test data...')
  
  const testPosts = [
    {
      title: 'Тестовый пост 1',
      slug: 'test-post-1',
      excerpt: 'Это тестовый пост для разработки',
    },
    {
      title: 'Тестовый пост 2',
      slug: 'test-post-2',
      excerpt: 'Еще один тестовый пост',
    },
    {
      title: 'Тестовый пост 3',
      slug: 'test-post-3',
      excerpt: 'Третий тестовый пост',
    },
  ]
  
  for (const post of testPosts) {
    await createDocument('posts', {
      ...post,
      _status: 'draft',
      content: [
        {
          children: [
            { text: 'Это тестовое содержание поста. ' },
            { text: 'Используйте для разработки и тестирования.', bold: true }
          ]
        }
      ]
    })
    console.log(`✅ Created: ${post.title}`)
  }
  
  console.log(`\n🎉 Created ${testPosts.docs.length} test posts`)
  process.exit(0)
}

generateTestData()
```

## Массовое добавление категорий

```typescript
#!/usr/bin/env tsx
import 'dotenv/config'
import { findDocuments, updateDocument } from './content-manager'

async function assignCategories() {
  console.log('🏷️  Assigning categories to posts...')
  
  // Находим категорию "Экспертиза"
  const categories = await findDocuments('categories', {
    title: { equals: 'Экспертиза' }
  })
  
  if (categories.docs.length === 0) {
    console.error('❌ Category "Экспертиза" not found')
    process.exit(1)
  }
  
  const category = categories.docs[0]
  
  // Находим посты без категорий
  const posts = await findDocuments('posts', {
    categories: { exists: false }
  })
  
  for (const post of posts.docs) {
    await updateDocument('posts', post.id, {
      categories: [category.id]
    })
    console.log(`✅ Added category to: ${post.title}`)
  }
  
  console.log(`\n🎉 Updated ${posts.docs.length} posts`)
  process.exit(0)
}

assignCategories()
```

## Статистика контента

```typescript
#!/usr/bin/env tsx
import 'dotenv/config'
import { findDocuments } from './content-manager'

async function contentStats() {
  console.log('📊 Gathering content statistics...\n')
  
  const collections = ['pages', 'posts', 'cases', 'categories']
  
  for (const collection of collections) {
    const all = await findDocuments(collection, {})
    const published = await findDocuments(collection, {
      _status: { equals: 'published' }
    })
    const drafts = await findDocuments(collection, {
      _status: { equals: 'draft' }
    })
    
    console.log(`📁 ${collection.toUpperCase()}:`)
    console.log(`   Total: ${all.docs.length}`)
    console.log(`   Published: ${published.docs.length}`)
    console.log(`   Drafts: ${drafts.docs.length}`)
    console.log('')
  }
  
  process.exit(0)
}

contentStats()
```

## Клонирование страницы

```typescript
#!/usr/bin/env tsx
import 'dotenv/config'
import { findDocumentById, createDocument } from './content-manager'

async function clonePage(sourceId: string, newSlug: string, newTitle: string) {
  console.log(`📋 Cloning page ${sourceId}...`)
  
  const source = await findDocumentById('pages', sourceId)
  
  // Удаляем поля, которые должны быть уникальными
  const { id, createdAt, updatedAt, ...cloneData } = source
  
  const cloned = await createDocument('pages', {
    ...cloneData,
    title: newTitle,
    slug: newSlug,
    _status: 'draft',
  })
  
  console.log(`✅ Cloned page: ${cloned.slug}`)
  console.log(`   New ID: ${cloned.id}`)
  
  process.exit(0)
}

// Использование: замените параметры
clonePage('10', 'new-page', 'Новая страница')
```

## Поиск и замена в контенте

```typescript
#!/usr/bin/env tsx
import 'dotenv/config'
import { findDocuments, updateDocument } from './content-manager'

async function findAndReplace(searchTerm: string, replacement: string) {
  console.log(`🔄 Replacing "${searchTerm}" with "${replacement}"...`)
  
  const posts = await findDocuments('posts', {})
  let updatedCount = 0
  
  for (const post of posts.docs) {
    let hasChanges = false
    
    // Проверяем заголовок
    if (post.title?.includes(searchTerm)) {
      post.title = post.title.replace(new RegExp(searchTerm, 'g'), replacement)
      hasChanges = true
    }
    
    // Проверяем excerpt
    if (post.excerpt?.includes(searchTerm)) {
      post.excerpt = post.excerpt.replace(new RegExp(searchTerm, 'g'), replacement)
      hasChanges = true
    }
    
    if (hasChanges) {
      await updateDocument('posts', post.id, {
        title: post.title,
        excerpt: post.excerpt,
      })
      updatedCount++
      console.log(`✅ Updated: ${post.title}`)
    }
  }
  
  console.log(`\n🎉 Updated ${updatedCount} posts`)
  process.exit(0)
}

// Использование
findAndReplace('старый текст', 'новый текст')
```

## Как использовать эти шаблоны

1. Создайте новый файл в `src/scripts/`
2. Скопируйте нужный шаблон
3. Настройте под свои нужды
4. Добавьте npm скрипт в `package.json`:
   ```json
   "your-script": "cross-env NODE_OPTIONS=--no-deprecation tsx src/scripts/your-script.ts"
   ```
5. Запустите: `pnpm your-script`

## Важные напоминания

- ✅ Всегда добавляйте `import 'dotenv/config'` в начало
- ✅ Завершайте скрипт с `process.exit(0)`
- ✅ Используйте `for...of` вместо `forEach` для async операций
- ✅ Добавляйте обработку ошибок с `try/catch`
- ✅ Выводите прогресс в консоль для удобства отладки

## Дополнительная помощь

См. полную документацию: [Content Manager Guide](./content-manager-guide.md)
