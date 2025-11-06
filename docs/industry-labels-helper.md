# Хелпер getIndustryLabel

## Описание

Утилита для получения русских названий индустрий из кодов, используемых в коллекции Cases.

## Расположение

```
src/utilities/getIndustryLabel.ts
```

## Использование

### Импорт

```typescript
import { getIndustryLabel, INDUSTRY_LABELS } from '@/utilities/getIndustryLabel'
```

### Функция getIndustryLabel

Преобразует код индустрии в русское название.

**Сигнатура:**
```typescript
function getIndustryLabel(industry: string): string
```

**Параметры:**
- `industry` - код индустрии из коллекции Cases

**Возвращает:**
- Русское название индустрии
- Если перевод не найден, возвращает исходный код

**Пример:**
```typescript
const label = getIndustryLabel('healthcare') // 'Медицина'
const label2 = getIndustryLabel('industry') // 'Промышленность'
const unknown = getIndustryLabel('unknown') // 'unknown'
```

### Константа INDUSTRY_LABELS

Справочник всех доступных индустрий с переводами.

**Тип:**
```typescript
const INDUSTRY_LABELS: Record<string, string>
```

**Доступные значения:**
- `electronics` → 'Электротехника'
- `legal` → 'Юридические услуги'
- `finance` → 'Финансы'
- `retail` → 'Ритейл'
- `logistics` → 'Логистика'
- `industry` → 'Промышленность'
- `healthcare` → 'Медицина'
- `other` → 'Другое'
- `metallurgy` → 'Металлопрокат' (для совместимости)
- `manufacturing` → 'Производство' (для совместимости)

## Где используется

### 1. Список кейсов
`src/app/(frontend)/cases/page.tsx`

```typescript
import { getIndustryLabel } from '@/utilities/getIndustryLabel'

const industryLabel = getIndustryLabel(caseItem.industry || '')
```

### 2. Страница кейса
`src/app/(frontend)/cases/[slug]/page.tsx`

```typescript
import { getIndustryLabel } from '@/utilities/getIndustryLabel'

{caseItem.industry && (
  <Badge variant="outline">{getIndustryLabel(caseItem.industry)}</Badge>
)}
```

### 3. Потенциальное использование в блоке FeaturedCases
Если понадобится отображать теги индустрий в блоке Featured Cases на главной странице.

## Добавление новых индустрий

Когда добавляете новую индустрию в коллекцию Cases:

1. Добавьте опцию в `src/collections/Cases.ts`:
```typescript
{
  label: 'Новая отрасль',
  value: 'new-industry',
}
```

2. Добавьте маппинг в `src/utilities/getIndustryLabel.ts`:
```typescript
export const INDUSTRY_LABELS: Record<string, string> = {
  // ...существующие
  'new-industry': 'Новая отрасль',
}
```

3. Не требуется изменять код компонентов - хелпер используется автоматически.

## Преимущества централизованного подхода

✅ **Единая точка истины** - все переводы в одном месте  
✅ **Легкость поддержки** - изменения вносятся один раз  
✅ **Переиспользуемость** - импортируется в любой компонент  
✅ **Типобезопасность** - TypeScript проверяет использование  
✅ **Документация** - JSDoc комментарии подсказывают параметры  

## История изменений

### 06.11.2025
- Создан хелпер с централизованным справочником индустрий
- Добавлены маппинги для `healthcare` и `industry`
- Рефакторинг страниц `/cases` и `/cases/[slug]` для использования хелпера
