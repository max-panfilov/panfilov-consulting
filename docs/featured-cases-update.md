# Обновление блока FeaturedCases

## Дата: 02.11.2025

## Описание изменений

Обновлен блок "Избранные кейсы" (FeaturedCases) на главной странице для улучшения визуальной согласованности с другими блоками.

## Изменения в дизайне

### 1. Центрирование заголовка и подзаголовка
- Заголовок и подзаголовок теперь расположены по центру в контейнере с максимальной шириной `max-w-3xl`
- Используется тот же стиль, что и в блоке `SolutionApproach` ("Мы не просто пишем код, мы решаем бизнес-задачи")

### 2. Добавление подзаголовка
- Добавлено новое поле `subheading` в конфигурацию блока
- Подзаголовок отображается под заголовком с классом `text-muted-foreground mt-4 text-lg`
- Содержимое по умолчанию: "Реальные проекты с измеримыми результатами для вашего бизнеса."

### 3. Перемещение кнопки "Все кейсы"
- Кнопка перенесена из шапки блока (до списка кейсов) в конец блока (после списка кейсов)
- Расположена по центру с отступом `mt-8`

### 4. Изменение стиля кнопки "Все кейсы"
- Изменен вариант кнопки с `variant="link"` на `variant="outline"`
- Добавлена иконка `ArrowRight` с анимацией при наведении
- Кнопка теперь соответствует стилю вторичной кнопки в блоке HeroHome ("Посмотреть кейсы")

## Затронутые файлы

### Конфигурация
- `src/blocks/FeaturedCases/config.ts` - добавлено поле `subheading`

### Компоненты
- `src/blocks/FeaturedCases/Component.tsx` - добавлена передача `subheading` в клиентский компонент
- `src/blocks/FeaturedCases/Component.client.tsx` - полностью переработан layout блока

### Seed-данные
- `src/endpoints/seed/homepage-only.ts` - добавлен `subheading` в блок FeaturedCases
- `src/endpoints/seed/homepage-seed.ts` - добавлен `subheading` в блок FeaturedCases
- `src/scripts/content-manager.ts` - добавлен `subheading` в блок FeaturedCases

## Технические детали

### Новая структура блока
```tsx
<section className="py-16 md:py-32" id="cases">
  <div className="container">
    {/* Заголовок секции по центру */}
    <div className="mx-auto mb-16 max-w-3xl text-center">
      <h2>{heading}</h2>
      <p className="text-muted-foreground mt-4 text-lg">{subheading}</p>
    </div>

    {/* Grid с кейсами */}
    <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
      {/* Карточки кейсов */}
    </div>

    {/* Кнопка "Все кейсы" после списка кейсов */}
    <div className="mt-8 flex justify-center">
      <Button variant="outline">
        Все кейсы
        <ArrowRight className="ml-2 size-4" />
      </Button>
    </div>
  </div>
</section>
```

### Тип данных
Обновлен тип `FeaturedCasesClientProps`:
```typescript
type FeaturedCasesClientProps = {
  heading?: string | null
  subheading?: string | null  // НОВОЕ поле
  cases: SerializedCase[]
}
```

## Проверка

После внесения изменений выполнены проверки:
- ✅ `pnpm payload generate:types` - типы успешно сгенерированы
- ✅ `npx tsc --noEmit` - ошибок TypeScript нет
- ✅ `pnpm lint` - код соответствует стандартам (только предупреждения)

## Миграция существующих данных

Если на сайте уже создана главная страница, необходимо:
1. Зайти в админ-панель Payload CMS
2. Открыть главную страницу для редактирования
3. Найти блок "Избранные кейсы"
4. Заполнить поле "Подзаголовок секции" (например: "Реальные проекты с измеримыми результатами для вашего бизнеса.")
5. Сохранить изменения

Либо пересоздать главную страницу с помощью seed-скрипта.

## Совместимость

Изменения обратно совместимы:
- Если поле `subheading` не заполнено, оно просто не отображается
- Старая структура данных без `subheading` продолжит работать
