# Исправления при интеграции shadcn

## Проблемы и решения

### 1. Module not found: Can't resolve 'fs'

**Проблема**: Ошибка при сборке из-за использования `'use client'` в компонентах, которые вызывают серверные функции.

**Причина**: 
- `FeaturedCases` и `Footer` были помечены как клиентские компоненты (`'use client'`)
- Но при этом использовали серверные функции (`getPayload`, `getCachedGlobal`)
- Это вызывало конфликт, так как клиентские компоненты не могут использовать Node.js модули

**Решение**: Разделение на серверные и клиентские компоненты

#### FeaturedCases

**Было**:
- `Component.tsx` - один файл с `'use client'` и серверными функциями

**Стало**:
- `Component.tsx` - серверный компонент, получает данные из Payload
- `Component.client.tsx` - клиентский компонент с анимациями и 3D эффектами

**Изменения**:
```typescript
// Component.tsx (серверный)
export const FeaturedCasesBlock: React.FC<FeaturedCasesBlockType> = async ({...}) => {
  const payload = await getPayload({ config: configPromise })
  const cases = await payload.find({...})
  
  // Сериализация данных для передачи клиенту
  const serializedCases = cases.map(caseItem => ({
    id: caseItem.id,
    title: caseItem.title,
    // ...другие поля
  }))
  
  return <FeaturedCasesClient cases={serializedCases} {...props} />
}

// Component.client.tsx (клиентский)
'use client'
export const FeaturedCasesClient: React.FC<Props> = ({ cases, ...props }) => {
  // Только анимации и интерактивность
  return <motion.div>...</motion.div>
}
```

#### Footer

**Было**:
- `Component.tsx` - один файл с `'use client'` и `getCachedGlobal`

**Стало**:
- `Component.tsx` - серверный компонент, получает данные из CMS
- `Component.client.tsx` - клиентский компонент с анимациями

**Изменения**:
```typescript
// Component.tsx (серверный)
export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const navItems = footerData?.navItems || []
  
  return <FooterClient navItems={navItems} />
}

// Component.client.tsx (клиентский)
'use client'
export const FooterClient: React.FC<{ navItems }> = ({ navItems }) => {
  return <motion.footer>...</motion.footer>
}
```

### 2. Type error: id should be string | number

**Проблема**: TypeScript ошибка - `id` в Payload может быть `number`, но тип был определен как `string`

**Решение**:
```typescript
type SerializedCase = {
  id: string | number  // Было: id: string
  // ...
}
```

## Архитектурный паттерн

### Разделение Server/Client компонентов

Для всех блоков с анимациями используется следующий паттерн:

1. **Серверный компонент** (`Component.tsx`):
   - Получает данные из Payload/CMS
   - Выполняет серверную логику
   - Сериализует данные
   - Передает данные клиентскому компоненту

2. **Клиентский компонент** (`Component.client.tsx`):
   - Помечен `'use client'`
   - Принимает сериализованные данные
   - Рендерит UI с анимациями
   - Обрабатывает интерактивность

### Преимущества подхода

1. **Безопасность**: Серверные секреты и логика не попадают в клиентский бандл
2. **Производительность**: Серверные вычисления не нагружают клиент
3. **Совместимость**: Нет конфликтов с Node.js модулями
4. **SEO**: Контент рендерится на сервере
5. **Гибкость**: Легко добавлять анимации без изменения серверной логики

## Проверка работоспособности

```bash
# Проверка TypeScript
pnpm exec tsc --noEmit

# Результат: ✅ Нет ошибок

# Сборка проекта
pnpm build

# Результат: ✅ Успешная сборка
```

## Файлы, требующие этого паттерна

✅ Исправлено:
- `src/blocks/FeaturedCases/Component.tsx` + `Component.client.tsx`
- `src/Footer/Component.tsx` + `Component.client.tsx`

✅ Уже правильно (только клиент):
- `src/blocks/HeroHome/Component.tsx` - `'use client'`, не использует серверные функции
- `src/blocks/CallToAction/Component.tsx` - `'use client'`, не использует серверные функции
- `src/blocks/Banner/Component.tsx` - `'use client'`, не использует серверные функции
- `src/blocks/Content/Component.tsx` - `'use client'`, не использует серверные функции

## Рекомендации для будущих блоков

При создании новых блоков с анимациями:

1. **Если блок НЕ использует серверные функции**:
   - Можно использовать `'use client'` в одном файле
   - Примеры: `HeroHome`, `CallToAction`, `Banner`

2. **Если блок использует серверные функции** (getPayload, getCachedGlobal и т.д.):
   - Разделять на два файла: `Component.tsx` (сервер) и `Component.client.tsx` (клиент)
   - Сериализовать данные перед передачей клиенту
   - Примеры: `FeaturedCases`, `Footer`

## Важные моменты

1. **Сериализация данных**: 
   - Передавать только примитивные типы и простые объекты
   - Избегать функций, классов, Date объектов
   - Извлекать URL из медиа-объектов

2. **TypeScript типы**:
   - Создавать отдельные типы для сериализованных данных
   - Учитывать, что `id` в Payload может быть `string | number`

3. **Производительность**:
   - Минимизировать объем передаваемых данных
   - Передавать только необходимые поля

## Заключение

Все проблемы успешно исправлены. Проект собирается без ошибок и готов к использованию.
