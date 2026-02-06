# Руководство по экспорту кейсов в Markdown

Этот документ описывает процесс экспорта кейсов из базы данных в локальные markdown файлы.

## Назначение

Скрипты позволяют:
- Экспортировать все опубликованные кейсы из БД в markdown файлы
- Конвертировать Lexical JSON в читаемый Markdown формат
- Автоматически заменить URL изображений на локальные пути (`/media/...`)
- Сохранить всю структуру и метаданные кейсов

## Доступные команды

### 1. Экспорт кейсов

```bash
pnpm export:cases
```

**Что делает:**
- Подключается к базе данных Payload
- Получает все опубликованные кейсы (отсортированные по `sortOrder`)
- Конвертирует Lexical JSON в markdown
- Сохраняет каждый кейс в отдельный файл в директорию `exported-cases/`
- Создает индексный файл `INDEX.md` со списком всех кейсов

**Результат:**
```
exported-cases/
├── INDEX.md                         # Индекс всех кейсов
├── dkc-chatbot.md                  # Кейс №1
├── legal-llm-platform.md           # Кейс №2
├── medical-analysis-platform.md    # Кейс №3
├── metallurgy-bot.md               # Кейс №4
└── digital-cases-platform.md       # Кейс №5
```

### 2. Исправление ссылок на изображения

После экспорта все ссылки на изображения имеют вид `/api/media/file/filename.png`. Чтобы заменить их на локальные пути:

```bash
pnpm tsx src/scripts/fix-exported-cases-images.ts
```

**Что делает:**
- Сканирует все markdown файлы в `exported-cases/`
- Заменяет `/api/media/file/filename.png` на `/media/filename.png`
- Все изображения физически хранятся в `public/media/`

**До:**
```markdown
![Обложка](/api/media/file/consulting-dkc-1.png)
```

**После:**
```markdown
![Обложка](/media/consulting-dkc-1.png)
```

## Структура экспортированного кейса

Каждый markdown файл содержит:

```markdown
# Название кейса

---

**Отрасль:** industry
**Slug:** case-slug
**Технологии:** Tech1, Tech2, Tech3
**Избранный:** Да
**Дата публикации:** 28.10.2025

---

## Обложка

![Название](/media/cover-image.png)

## Краткое описание

Текст краткого описания...

## Задача клиента

Описание задачи с форматированием...

## Решение

Описание решения...

## Результаты

Описание результатов...
```

## Поддерживаемые элементы Lexical

Скрипт конвертирует следующие элементы Lexical в Markdown:

- ✅ Текст с форматированием (жирный, курсив, зачеркнутый, код)
- ✅ Заголовки (h2, h3, h4)
- ✅ Параграфы
- ✅ Упорядоченные списки
- ✅ Неупорядоченные списки
- ✅ Цитаты
- ✅ Горизонтальные линии
- ✅ Ссылки
- ✅ Блоки с изображениями (mediaBlock)

## Расположение файлов

### Скрипты
- `src/scripts/export-cases-to-markdown.ts` - основной скрипт экспорта
- `src/scripts/fix-exported-cases-images.ts` - замена URL на локальные пути

### Результаты экспорта
- `exported-cases/` - директория с экспортированными файлами
- `public/media/` - директория с изображениями

## Полный процесс экспорта

```bash
# 1. Экспортируем кейсы из БД
pnpm export:cases

# 2. Заменяем URL изображений на локальные пути
pnpm tsx src/scripts/fix-exported-cases-images.ts

# 3. Готово! Все файлы в exported-cases/
```

## Настройка экспорта

### Изменить директорию экспорта

В файле `src/scripts/export-cases-to-markdown.ts`:

```typescript
const exportDir = path.join(process.cwd(), 'exported-cases')
// Изменить на:
const exportDir = path.join(process.cwd(), 'my-custom-folder')
```

### Экспорт только избранных кейсов

В файле `src/scripts/export-cases-to-markdown.ts`, изменить запрос:

```typescript
const casesData = await payload.find({
  collection: 'cases',
  depth: 2,
  limit: 1000,
  where: {
    _status: {
      equals: 'published',
    },
    featured: {
      equals: true, // Добавить эту строку
    },
  },
  sort: 'sortOrder',
})
```

### Добавить дополнительные поля

В файле `src/scripts/export-cases-to-markdown.ts`, в разделе формирования markdown:

```typescript
// После метаданных
if (caseItem.customField) {
  markdown += `**Кастомное поле:** ${caseItem.customField}\n\n`
}
```

## Примечания

- Скрипт использует `.env` для подключения к БД
- Изображения должны быть предварительно загружены в `public/media/`
- Экспортируются только опубликованные кейсы (`_status: 'published'`)
- Черновики и неопубликованные кейсы не включаются
- Сортировка соответствует полю `sortOrder` в БД

## Устранение неполадок

### Ошибка "missing secret key"

Убедитесь, что файл `.env` существует и содержит:
```
PAYLOAD_SECRET=your-secret-key
DATABASE_URI=your-database-uri
```

### Изображения не отображаются

Проверьте:
1. Файлы изображений существуют в `public/media/`
2. Имена файлов совпадают с именами в markdown
3. Выполнен скрипт `fix-exported-cases-images.ts`

### Неправильное форматирование markdown

Скрипт поддерживает стандартные элементы Lexical. Если используются кастомные блоки, необходимо добавить их обработку в функцию `lexicalToMarkdown()`.
