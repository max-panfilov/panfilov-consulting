# Генерация презентации компании

## Описание

Автоматическая генерация HTML-презентации компании Panfilov Consulting на основе данных из CMS.

## Процесс генерации

### Шаг 1: Экспорт данных

Перед генерацией презентации необходимо экспортировать актуальные данные из БД:

```bash
# Экспорт главной страницы
pnpm export:homepage

# Экспорт кейсов (если еще не экспортированы)
pnpm export:cases
```

Результат:
- `exported-homepage/homepage-data.json` — данные главной страницы
- `exported-homepage/homepage-content.md` — читаемый текст
- `exported-cases/*.md` — файлы кейсов в markdown

### Шаг 2: Подготовка кейсов для презентации

Этот скрипт сокращает тексты кейсов до оптимальной длины для слайдов:

```bash
pnpm prepare:cases
```

Результат:
- `exported-cases/cases-for-presentation.json` — кейсы с сокращенными текстами

Скрипт автоматически:
- Сокращает Задачу до ~350 символов
- Сокращает Решение до ~400 символов
- Сокращает Результаты до ~300 символов
- Обрезает по последнему предложению (интеллектуальное сокращение)

### Шаг 3: Генерация HTML

```bash
pnpm generate:presentation
```

Результат: файл `presentation.html` в корне проекта.

## Структура презентации

Презентация состоит из следующих слайдов:

1. **Титульный слайд**
   - Логотип компании
   - Заголовок и подзаголовок (из блока heroHome)
   - Контакты: panfilov.consulting, contact@panfilov.consulting

2. **Целевая аудитория**
   - Заголовок блока targetAudience
   - 4 карточки с сегментами аудитории

3. **Кейсы** (для каждого кейса 2 слайда)
   - Слайд 1: Название + Задача + Решение + Результаты (текст)
   - Слайд 2: Название + 2 скриншота рядом

4. **Услуги**
   - Заголовок и подзаголовок блока solutionApproach
   - 3 этапа работы с описаниями

5. **Итоговый слайд**
   - Логотип
   - Призыв к действию
   - Контакты

## Сохранение в PDF

### Вариант 1: Через браузер (рекомендуется)

1. Откройте `presentation.html` в браузере (Chrome/Safari)
2. Нажмите `Cmd+P` (Mac) или `Ctrl+P` (Windows)
3. Настройки печати:
   - **Принтер**: Сохранить как PDF
   - **Ориентация**: Альбомная (Landscape)
   - **Размер**: A4
   - **Поля**: Без полей (None)
   - **Масштаб**: 100%
   - **Фон**: ✅ Включить фоновую графику
4. Нажмите "Сохранить"

### Вариант 2: Puppeteer (автоматически)

Если нужна полная автоматизация, можно добавить скрипт с Puppeteer:

```bash
pnpm add -D puppeteer
```

```typescript
// Пример скрипта (не реализовано)
import puppeteer from 'puppeteer'

const browser = await puppeteer.launch()
const page = await browser.newPage()
await page.goto('file://' + path.join(process.cwd(), 'presentation.html'))
await page.pdf({
  path: 'presentation.pdf',
  format: 'A4',
  landscape: true,
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 }
})
```

## Кастомизация

### Изменение дизайна

Отредактируйте CSS в файле `src/scripts/generate-presentation-html.ts`:
- Цвета градиентов
- Размеры шрифтов
- Отступы и padding

### Изменение структуры

В том же файле:
- Добавьте/удалите слайды
- Измените порядок блоков
- Настройте сокращение текста (функция `truncateText`)

### Изменение контента

Контент берется автоматически из:
- `exported-homepage/homepage-data.json` — данные главной
- `exported-cases/cases-for-presentation.json` — сокращенные кейсы

Чтобы изменить контент — отредактируйте данные в CMS и повторите экспорт.

## Технические детали

### Технологии
- TypeScript
- Node.js fs/promises
- CSS Grid & Flexbox
- CSS Print Media Queries

### Особенности дизайна
- Темная тема с градиентами
- Современная типографика (system fonts)
- Стеклянный эффект (glassmorphism) для карточек
- Адаптация под формат A4 landscape (297mm × 210mm)
- Автоматическое разделение на страницы (`page-break-after`)

### Обработка изображений
- Изображения загружаются из `/media/` директории
- Фильтруются обложки кейсов (`consulting-case.png`)
- На слайд со скриншотами берутся первые 2 изображения
- Изображения масштабируются с сохранением пропорций

## Обновление презентации

При изменении контента на сайте:

```bash
# 1. Экспортируем обновленные данные
pnpm export:homepage
pnpm export:cases

# 2. Подготавливаем сокращенные версии кейсов
pnpm prepare:cases

# 3. Генерируем новую презентацию
pnpm generate:presentation

# 4. Сохраняем в PDF через браузер
open presentation.html
```

## Troubleshooting

### Изображения не отображаются
- Убедитесь, что изображения есть в `public/media/`
- Проверьте пути к изображениям в markdown файлах
- Пути должны начинаться с `/media/`

### Текст обрезается
- Отредактируйте лимиты в `prepare-cases-for-presentation.ts`
- Уменьшите размер шрифта в CSS
- Перегенерируйте кейсы: `pnpm prepare:cases`

### PDF выглядит иначе
- Проверьте настройки печати (масштаб 100%, фон включен)
- Используйте Chrome для лучшей совместимости
- Убедитесь что margins = 0

## Файлы

- `src/scripts/generate-presentation-html.ts` — основной скрипт генерации
- `src/scripts/export-homepage-to-markdown.ts` — экспорт главной страницы
- `src/scripts/export-cases-to-markdown.ts` — экспорт кейсов
- `src/scripts/prepare-cases-for-presentation.ts` — подготовка сокращенных текстов кейсов
- `exported-cases/cases-for-presentation.json` — кейсы для презентации
- `presentation.html` — итоговый HTML файл
- `public/logo.svg` — логотип компании
