# Интеграция Яндекс.Метрики

## Обзор

В проект интегрирован счетчик Яндекс.Метрики №105076230 с поддержкой Single Page Application (SPA).

## Особенности интеграции для SPA

Поскольку проект использует Next.js App Router, который работает как SPA, была реализована специальная интеграция с учетом рекомендаций Яндекс.Метрики:

### Ключевые настройки

1. **defer: true** - Отключена автоматическая отправка первого хита при загрузке страницы
2. **Ручное отслеживание переходов** - Используется хук `usePathname` для отслеживания изменений маршрута
3. **Метод hit** - При каждом переходе вручную вызывается `ym(counterId, 'hit', url)`

### Включенные функции

- **clickmap: true** - Карта кликов для анализа поведения пользователей
- **trackLinks: true** - Отслеживание внешних ссылок
- **accurateTrackBounce: true** - Точный показатель отказов
- **webvisor: true** - Вебвизор для записи действий пользователей
- **trackHash: true** - Отслеживание изменений хэша в URL

## Структура файлов

```
src/
├── components/
│   └── YandexMetrika/
│       └── index.tsx              # Основной компонент интеграции
├── types/
│   └── yandex-metrika.d.ts        # TypeScript типы для API Яндекс.Метрики
└── app/
    └── (frontend)/
        └── layout.tsx              # Подключение компонента в layout
```

## Компонент YandexMetrika

### Принцип работы

1. Компонент инициализирует счетчик с `defer: true`
2. React хук `useEffect` следит за изменениями `pathname` и `searchParams`
3. При каждом изменении маршрута автоматически отправляется hit с текущим URL и заголовком страницы

```tsx
useEffect(() => {
  const url = searchParams.toString() ? `${pathname}?${searchParams}` : pathname
  
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(YANDEX_METRIKA_ID, 'hit', url, {
      title: document.title,
    })
  }
}, [pathname, searchParams])
```

## TypeScript типы

Созданы полные типы для API Яндекс.Метрики, включая:

- `YandexMetrikaInitOptions` - параметры инициализации
- `YandexMetrikaHitOptions` - параметры отправки хита
- `YandexMetrikaFunction` - типизированная функция `ym`
- Расширение `Window` с полем `ym`

Это обеспечивает:
- Автодополнение в IDE
- Проверку типов на этапе компиляции
- Защиту от ошибок при использовании API

## Использование API в коде

### Отправка цели (goal)

```tsx
'use client'

export function MyComponent() {
  const handleClick = () => {
    if (window.ym) {
      window.ym(105076230, 'reachGoal', 'button_click')
    }
  }

  return <button onClick={handleClick}>Кликни меня</button>
}
```

### Передача параметров визита

```tsx
if (window.ym) {
  window.ym(105076230, 'params', {
    user_type: 'premium',
    page_category: 'services'
  })
}
```

### Передача параметров пользователя

```tsx
if (window.ym) {
  window.ym(105076230, 'userParams', {
    user_id: '12345',
    subscription: 'pro'
  })
}
```

### Получение Client ID

```tsx
if (window.ym) {
  window.ym(105076230, 'getClientID', (clientId) => {
    console.log('Client ID:', clientId)
  })
}
```

## Проверка работоспособности

### В браузере

1. Откройте DevTools → Console
2. Проверьте наличие глобальной функции:
   ```js
   console.log(typeof window.ym) // должно быть 'function'
   ```
3. Перейдите на другую страницу и проверьте отправку хита в Network

### В Яндекс.Метрике

1. Откройте [метрика.яндекс.ру](https://metrika.yandex.ru)
2. Перейдите в счетчик №105076230
3. Проверьте раздел "Посещаемость" → "Онлайн"
4. Должны отображаться текущие посетители в реальном времени

## Отладка

Для включения режима отладки добавьте в инициализацию:

```tsx
ym(105076230, 'init', {
  defer: true,
  // ... другие параметры
  params: {
    __ym: { debug: true }
  }
})
```

После этого в консоли браузера будут выводиться все события Метрики.

## Производительность

- Скрипт Метрики загружается асинхронно через `strategy="afterInteractive"`
- Не блокирует рендеринг страницы
- Минимальное влияние на Core Web Vitals

## Соответствие рекомендациям Яндекса

Реализация полностью соответствует официальной документации Яндекс.Метрики для SPA:

✅ Используется `defer: true` для ручного управления хитами  
✅ Отправляется `hit` при каждом изменении маршрута  
✅ Передается актуальный `title` страницы  
✅ Учитываются query-параметры в URL  
✅ Включены все основные функции отслеживания  

## Источники

- [Официальная документация Яндекс.Метрики для SPA](https://yandex.ru/support/metrica/ru/code/counter-spa-setup)
- [Yandex Metrica Tag GitHub](https://github.com/yandex/metrica-tag)
- [Context7 Documentation](https://context7.com)

## Дополнительные возможности

### E-commerce tracking

Для отслеживания электронной коммерции:

```tsx
if (window.ym) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    ecommerce: {
      purchase: {
        actionField: { id: 'ORDER123' },
        products: [
          {
            id: '123',
            name: 'Услуга консалтинга',
            price: 50000,
            quantity: 1
          }
        ]
      }
    }
  })
  window.ym(105076230, 'hit', window.location.pathname)
}
```

### Работа с формами

Метрика автоматически отслеживает взаимодействие с формами при включенном Вебвизоре.

## Лицензия и конфиденциальность

Использование Яндекс.Метрики регулируется:
- [Пользовательским соглашением Яндекс.Метрики](https://yandex.ru/legal/metrica_termsofuse/)
- Политикой конфиденциальности вашего сайта

Рекомендуется добавить информацию об использовании Метрики в политику конфиденциальности сайта.
