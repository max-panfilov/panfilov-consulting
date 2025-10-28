# Переделка Header на шаблон shadcnblocks

## Обзор изменений

Header переделан с использованием готовых компонентов из библиотеки shadcnblocks. Новая навигация имеет современный дизайн, адаптивное мобильное меню и полную поддержку accessibility.

## Ключевые изменения

### 1. Архитектура

**Было**: Простой header с кастомной навигацией
**Стало**: Полноценная навигация с shadcnblocks компонентами

### 2. Новые компоненты

Добавлены shadcn компоненты:
- `NavigationMenu` - для desktop навигации
- `Sheet` - для мобильного sliding menu
- `Accordion` - для раскрывающихся меню (готово для будущего расширения)
- `Button` - для триггера мобильного меню

### 3. Структура

```tsx
<section className="py-4">
  <div className="container">
    {/* Desktop Menu */}
    <nav className="hidden lg:flex">
      <Logo />
      <NavigationMenu>
        <NavigationMenuList>
          {/* Навигационные элементы */}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>

    {/* Mobile Menu */}
    <div className="block lg:hidden">
      <Logo />
      <Sheet>
        <SheetTrigger>
          <Menu icon />
        </SheetTrigger>
        <SheetContent>
          {/* Мобильная навигация */}
        </SheetContent>
      </Sheet>
    </div>
  </div>
</section>
```

## Новые возможности

### 1. Desktop Навигация

Использует `NavigationMenu` от Radix UI:
- Горизонтальное меню
- Hover эффекты
- Плавные переходы
- Полная поддержка клавиатурной навигации

```tsx
<NavigationMenu>
  <NavigationMenuList>
    {navItems.map((item, i) => (
      <NavigationMenuItem key={i}>
        <NavigationMenuLink
          href={item.link?.url || '#'}
          className="hover:bg-muted hover:text-accent-foreground"
        >
          {item.link?.label}
        </NavigationMenuLink>
      </NavigationMenuItem>
    ))}
  </NavigationMenuList>
</NavigationMenu>
```

### 2. Mobile Sheet Menu

Sliding панель справа для мобильных устройств:
- Полноэкранное меню
- Плавная анимация открытия/закрытия
- Overlay фон
- Кнопка закрытия

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline" size="icon">
      <Menu className="size-4" />
    </Button>
  </SheetTrigger>
  <SheetContent className="overflow-y-auto">
    <SheetHeader>
      <SheetTitle>
        <Logo />
      </SheetTitle>
    </SheetHeader>
    {/* Навигация */}
  </SheetContent>
</Sheet>
```

### 3. Адаптивность

- **Desktop** (lg+): Горизонтальная навигация с NavigationMenu
- **Mobile** (<lg): Hamburger меню с Sheet

```tsx
{/* Desktop */}
<nav className="hidden justify-between lg:flex">
  {/* Навигация */}
</nav>

{/* Mobile */}
<div className="block lg:hidden">
  {/* Мобильное меню */}
</div>
```

### 4. Иконки

Используется `Menu` иконка из lucide-react для мобильного триггера.

## Установленные зависимости

```bash
pnpm add @radix-ui/react-navigation-menu  # NavigationMenu
pnpm add @radix-ui/react-dialog           # Sheet (использует Dialog)
pnpm add @radix-ui/react-accordion        # Accordion (для будущего)
```

## Созданные компоненты

- `src/components/ui/navigation-menu.tsx` - NavigationMenu компонент
- `src/components/ui/sheet.tsx` - Sheet компонент
- `src/components/ui/accordion.tsx` - Accordion компонент

## Преимущества нового дизайна

### 1. Accessibility
- ARIA атрибуты из коробки
- Полная клавиатурная навигация
- Screen reader support
- Focus management

### 2. Современный UX
- Плавные анимации
- Мобильное sliding menu
- Hover эффекты
- Responsive дизайн

### 3. Расширяемость
- Легко добавить вложенные меню
- Поддержка mega menu (через NavigationMenuContent)
- Accordion для мобильных подменю

### 4. Производительность
- Оптимизированные компоненты Radix UI
- Минимальный JavaScript
- CSS transitions

### 5. Консистентность
- Единый стиль с shadcnblocks
- Переиспользуемые компоненты
- TailwindCSS классы

## Совместимость с Payload CMS

Header полностью совместим с существующей структурой Payload:

```typescript
// Payload конфигурация (без изменений)
{
  name: 'navItems',
  type: 'array',
  fields: [
    link({
      appearances: false,
    }),
  ],
}
```

Компонент автоматически использует:
- `item.link.url` - ссылка
- `item.link.label` - текст ссылки
- `item.link.type` - тип ссылки (internal/custom)

## Будущие улучшения

### 1. Mega Menu

Можно добавить выпадающие меню для desktop:

```tsx
<NavigationMenuItem>
  <NavigationMenuTrigger>Products</NavigationMenuTrigger>
  <NavigationMenuContent>
    {/* Список подменю */}
  </NavigationMenuContent>
</NavigationMenuItem>
```

### 2. Мобильный Accordion

Для вложенных меню на mobile:

```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="products">
    <AccordionTrigger>Products</AccordionTrigger>
    <AccordionContent>
      {/* Подменю */}
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### 3. Кнопки авторизации

Добавить кнопки Login/Signup справа:

```tsx
<div className="flex gap-2">
  <Button variant="outline" size="sm">Login</Button>
  <Button size="sm">Sign up</Button>
</div>
```

### 4. Search Bar

Интегрировать поиск в header:

```tsx
<div className="flex items-center gap-4">
  <NavigationMenu>...</NavigationMenu>
  <SearchBar />
</div>
```

## Миграция

### Не требуется

Header автоматически работает с существующими данными из Payload CMS. Никаких изменений в админ-панели не требуется.

### Рекомендации

1. **Проверьте навигацию** - убедитесь, что все ссылки работают
2. **Тестируйте на мобильных** - проверьте работу Sheet menu
3. **Accessibility** - проверьте навигацию с клавиатуры

## Удаленные файлы

Следующие файлы больше не используются (можно удалить):
- `src/Header/Nav/index.tsx` - старая навигация
- Связанные утилиты для темы header

## Примеры использования

### Базовая навигация

```typescript
// Payload CMS admin panel
navItems: [
  { link: { label: 'Главная', url: '/', type: 'custom' } },
  { link: { label: 'Услуги', url: '/services', type: 'custom' } },
  { link: { label: 'Кейсы', url: '/cases', type: 'custom' } },
  { link: { label: 'Контакты', url: '/contact', type: 'custom' } },
]
```

## Стилизация

### Desktop меню

```tsx
// Изменить стиль ссылок
<NavigationMenuLink
  className="bg-background hover:bg-muted text-foreground hover:text-accent-foreground"
>
```

### Mobile меню

```tsx
// Изменить позицию Sheet
<SheetContent side="right"> // или "left", "top", "bottom"
```

### Кнопка триггера

```tsx
// Изменить стиль кнопки
<Button variant="outline" size="icon"> // или "ghost", "default"
```

## Keyboard Navigation

- **Tab** - переход между элементами
- **Enter/Space** - открыть меню/перейти по ссылке
- **Escape** - закрыть мобильное меню
- **Arrow keys** - навигация в открытом меню

## Dark Mode

Header полностью поддерживает темную тему через Tailwind CSS переменные:
- `bg-background` - фон
- `text-foreground` - текст
- `hover:bg-muted` - hover состояние
- `text-accent-foreground` - активный цвет

## Совместимость

- ✅ Next.js 15
- ✅ React 19
- ✅ TypeScript
- ✅ Payload CMS 3.x
- ✅ TailwindCSS
- ✅ Mobile responsive
- ✅ Dark mode
- ✅ Accessibility (WCAG 2.1)

## Заключение

Новый Header следует лучшим практикам современного веб-дизайна и использует проверенные компоненты от Radix UI через shadcnblocks. Он обеспечивает отличный пользовательский опыт на всех устройствах и полностью доступен для пользователей с ограниченными возможностями.
