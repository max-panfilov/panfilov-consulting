# Яндекс.Метрика — Установка завершена ✅

## Что сделано

В проект успешно интегрирован счетчик Яндекс.Метрики **№105076230** с полной поддержкой SPA (Single Page Application).

## Ключевые особенности

✅ **SPA-адаптация** — счетчик корректно отслеживает переходы между страницами в Next.js App Router  
✅ **defer: true** — ручное управление отправкой хитов (рекомендация Яндекса для SPA)  
✅ **Автоматический трекинг** — используется `usePathname` и `useSearchParams` для отслеживания навигации  
✅ **TypeScript** — полная типизация API Яндекс.Метрики  
✅ **Suspense boundary** — правильная обработка серверного рендеринга  
✅ **Производительность** — асинхронная загрузка, не блокирует рендеринг  

## Включенные функции

- 🗺️ **Карта кликов** (clickmap)
- 🔗 **Отслеживание ссылок** (trackLinks)
- 📊 **Точный показатель отказов** (accurateTrackBounce)
- 📹 **Вебвизор** (webvisor) — запись действий пользователей
- #️⃣ **Отслеживание хэша** (trackHash)

## Структура файлов

```
src/
├── components/
│   └── YandexMetrika/
│       └── index.tsx              # Компонент интеграции
├── types/
│   └── yandex-metrika.d.ts        # TypeScript типы
└── app/
    └── (frontend)/
        └── layout.tsx              # Подключен в layout

docs/
├── yandex-metrika-integration.md  # Полная документация
├── yandex-metrika-test.md         # Инструкция по проверке
└── YANDEX_METRIKA_README.md       # Этот файл
```

## Быстрая проверка

### 1. Запустите dev-сервер
```bash
pnpm dev
```

### 2. Откройте http://localhost:3000

### 3. Проверьте в консоли браузера (F12)
```javascript
console.log(typeof window.ym) // должно быть 'function'
```

### 4. Перейдите на другую страницу
Откройте Network → фильтр `yandex`  
Должен отправиться запрос к `mc.yandex.ru/watch/...`

### 5. Проверьте в Метрике
https://metrika.yandex.ru → счетчик №105076230 → "Онлайн"

## Как использовать в коде

### Отправка цели (goal)
```tsx
'use client'

export function MyButton() {
  const handleClick = () => {
    if (window.ym) {
      window.ym(105076230, 'reachGoal', 'button_clicked')
    }
  }

  return <button onClick={handleClick}>Нажми меня</button>
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

### Получение Client ID
```tsx
if (window.ym) {
  window.ym(105076230, 'getClientID', (clientId) => {
    console.log('Client ID:', clientId)
  })
}
```

## Документация

📚 **Подробная документация:** `docs/yandex-metrika-integration.md`  
🧪 **Инструкция по тестированию:** `docs/yandex-metrika-test.md`

## Соответствие официальной документации

Реализация **полностью соответствует** рекомендациям Яндекса для SPA:

- ✅ [Официальная документация Яндекс.Метрики для SPA](https://yandex.ru/support/metrica/ru/code/counter-spa-setup)
- ✅ [Yandex Metrica Tag GitHub](https://github.com/yandex/metrica-tag)
- ✅ Использован Context7 для получения актуальной документации

## Технические детали

### Принцип работы
1. При инициализации `defer: true` отключает автоматическую отправку первого хита
2. React-хук отслеживает изменения `pathname` и `searchParams`
3. При каждом изменении маршрута вызывается `ym(counterId, 'hit', url)`
4. Передаётся актуальный URL и заголовок страницы

### TypeScript типизация
Все методы API полностью типизированы:
- `YandexMetrikaInitOptions`
- `YandexMetrikaHitOptions`
- `YandexMetrikaFunction`
- Расширение `Window` интерфейса

## Производительность

- ⚡ Загрузка скрипта: `strategy="afterInteractive"`
- 🚀 Не блокирует First Contentful Paint
- 📦 Минимальное влияние на bundle size
- 💯 Не ухудшает Core Web Vitals

## Проверки пройдены

✅ TypeScript компиляция без ошибок  
✅ Next.js build успешно завершён  
✅ Suspense boundary корректно настроен  
✅ Нет ошибок линтинга (критичных)  

## Поддержка

Если возникнут вопросы:
1. Проверьте `docs/yandex-metrika-test.md` — частые проблемы и их решения
2. Включите debug-режим (инструкция в документации)
3. Проверьте консоль браузера на наличие ошибок

---

**Счетчик установлен и готов к работе!** 🎉

Следующий шаг: запустите сайт и проверьте отслеживание в реальном времени через интерфейс Яндекс.Метрики.
