# Переделка HeroHome на шаблон shadcnblocks

## Обзор изменений

Hero блок переделан с использованием готовых компонентов из библиотеки shadcnblocks. Новый дизайн следует современным паттернам UI и улучшает пользовательский опыт.

## Ключевые изменения

### 1. Архитектура

**Было**: Полноэкранный Hero с фоном и наложением
**Стало**: Двухколоночный layout с контентом слева и изображением справа

### 2. Компоненты

Добавлены новые shadcn компоненты:
- `Badge` - для маленькой метки над заголовком
- `Button` - для кнопок CTA с вариантами стилей
- `lucide-react` - иконки `ArrowRight` и `ArrowUpRight`

### 3. Структура

```tsx
<section className="py-32">
  <div className="container">
    <div className="grid items-center gap-8 lg:grid-cols-2">
      {/* Левая колонка - контент */}
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
        <Badge>✨ Добро пожаловать</Badge>
        <h1>Заголовок</h1>
        <p>Подзаголовок</p>
        <div className="flex gap-2">
          <Button>Primary CTA</Button>
          <Button variant="outline">Secondary CTA</Button>
        </div>
      </div>
      
      {/* Правая колонка - изображение */}
      <img src="..." alt="..." className="max-h-96 w-full rounded-md object-cover" />
    </div>
  </div>
</section>
```

## Новые возможности

### 1. Badge (Бейдж)

Маленькая метка над заголовком для привлечения внимания:

**Поле в CMS**: `badge` (текст, необязательное)
**Дефолтное значение**: "✨ Добро пожаловать"
**Иконка**: `ArrowUpRight` справа

```tsx
<Badge variant="outline" className="mb-6">
  {badge}
  <ArrowUpRight className="ml-2 size-4" />
</Badge>
```

### 2. Кнопки с иконками

**Primary Button**:
- Solid стиль (по умолчанию)
- Без иконки

**Secondary Button**:
- Outline стиль
- С иконкой `ArrowRight` справа

```tsx
<Button asChild className="w-full sm:w-auto">
  <a href={primaryCTA.link}>{primaryCTA.text}</a>
</Button>

<Button asChild variant="outline" className="w-full sm:w-auto">
  <a href={secondaryCTA.link}>
    {secondaryCTA.text}
    <ArrowRight className="ml-2 size-4" />
  </a>
</Button>
```

### 3. Адаптивный layout

- **Mobile**: Вертикальная компоновка, центрированный контент
- **Desktop**: Двухколоночный grid, контент слева, изображение справа

```tsx
<div className="grid items-center gap-8 lg:grid-cols-2">
  <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
    {/* Контент */}
  </div>
  {/* Изображение */}
</div>
```

### 4. Изображение/Видео справа

Поддержка различных типов медиа:
- Изображение (из CMS)
- Видео (из CMS)
- Placeholder (если ничего не выбрано)

```tsx
{mediaType === 'video' && bgVideoUrl ? (
  <video autoPlay loop muted playsInline className="max-h-96 w-full rounded-md object-cover">
    <source src={bgVideoUrl} type="video/mp4" />
  </video>
) : bgImageUrl ? (
  <img src={bgImageUrl} alt={heading || 'Hero image'} className="max-h-96 w-full rounded-md object-cover" />
) : (
  <img src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg" alt="Hero section placeholder" />
)}
```

## Обновленная конфигурация блока

### Новое поле

```typescript
{
  name: 'badge',
  type: 'text',
  label: 'Бейдж (необязательно)',
  defaultValue: '✨ Добро пожаловать',
  admin: {
    description: 'Маленькая метка над заголовком',
  },
}
```

### Убранные поля

Следующие поля больше не используются (но оставлены в конфиге для обратной совместимости):
- `backgroundOverlay` - больше нет фонового наложения

## Установленные зависимости

```bash
pnpm add lucide-react  # Иконки
```

## Созданные компоненты

- `src/components/ui/badge.tsx` - Badge компонент
- `src/components/ui/button.tsx` - Button компонент (уже существовал)

## Преимущества нового дизайна

### 1. Улучшенная читаемость
- Чистый белый фон
- Контент не перекрывается изображением
- Четкая типографика

### 2. Современный вид
- Минималистичный дизайн
- Использование стандартных паттернов shadcn/ui
- Иконки lucide-react

### 3. Лучшая адаптивность
- Mobile-first подход
- Responsive grid layout
- Оптимизация для разных размеров экрана

### 4. Производительность
- Убраны тяжелые анимации framer-motion
- Простой HTML/CSS layout
- Быстрая отрисовка

### 5. Консистентность
- Единый стиль с другими shadcnblocks компонентами
- Переиспользуемые компоненты
- Легкая кастомизация

## Миграция с предыдущей версии

### Автоматическая миграция

Не требуется - блок работает с существующими данными:
- `heading` → используется
- `subheading` → используется
- `primaryCTA` → используется
- `secondaryCTA` → используется
- `backgroundImage` → используется как главное изображение
- `backgroundVideo` → поддерживается

### Рекомендации

1. **Добавьте badge** в админ-панели для существующих блоков
2. **Загрузите качественное изображение** для правой колонки (рекомендуется 600x400px)
3. **Проверьте длину текста** - короткие заголовки работают лучше

## Примеры использования

### Базовый пример

```typescript
{
  badge: "✨ Новинка",
  heading: "Создайте современный сайт за минуты",
  subheading: "Используйте готовые блоки из shadcnblocks для быстрой разработки красивых интерфейсов",
  primaryCTA: {
    text: "Начать бесплатно",
    link: "/signup"
  },
  secondaryCTA: {
    text: "Узнать больше",
    link: "/about"
  },
  mediaType: "image",
  backgroundImage: { url: "/hero-image.jpg" }
}
```

### С видео

```typescript
{
  badge: "🎥 Демо",
  heading: "Посмотрите как это работает",
  subheading: "Видео демонстрация всех возможностей платформы",
  mediaType: "video",
  backgroundVideo: { url: "/demo.mp4" }
}
```

## Кастомизация

### Изменение цветов Badge

```tsx
<Badge variant="outline">  // Outline стиль
<Badge variant="default">  // Solid стиль
<Badge variant="secondary"> // Secondary цвет
```

### Изменение стиля кнопок

```tsx
<Button variant="default">   // Primary
<Button variant="outline">   // Outline
<Button variant="secondary"> // Secondary
<Button variant="ghost">     // Ghost
```

### Изменение размера кнопок

```tsx
<Button size="default">  // Стандартный
<Button size="sm">       // Маленький
<Button size="lg">       // Большой
```

## Совместимость

- ✅ Next.js 15
- ✅ React 19
- ✅ TypeScript
- ✅ Payload CMS 3.x
- ✅ TailwindCSS
- ✅ Dark mode (через CSS переменные)

## Заключение

Новый Hero блок следует лучшим практикам современного веб-дизайна и использует проверенные паттерны из shadcnblocks. Он легче, быстрее и проще в использовании, чем предыдущая версия с анимациями.
