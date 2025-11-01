'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import Script from 'next/script'

// ID счетчика Яндекс.Метрики
const YANDEX_METRIKA_ID = 105076230

/**
 * Внутренний компонент для отслеживания маршрутов
 * Обернут в Suspense для использования useSearchParams
 */
function YandexMetrikaTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Отслеживаем изменения маршрута для SPA
  useEffect(() => {
    // Формируем полный URL с query параметрами
    const url = searchParams.toString() ? `${pathname}?${searchParams}` : pathname

    // Отправляем hit в Яндекс.Метрику при переходе на новую страницу
    if (typeof window !== 'undefined' && window.ym) {
      window.ym(YANDEX_METRIKA_ID, 'hit', url, {
        title: document.title,
      })
    }
  }, [pathname, searchParams])

  return null
}

/**
 * Компонент для интеграции Яндекс.Метрики в Next.js App Router (SPA)
 * 
 * Особенности для SPA:
 * - Автоматически отслеживает переходы между страницами через usePathname
 * - Использует defer: true для ручного управления отправкой хитов
 * - Отправляет hit при каждом изменении URL
 * - Включает карты кликов, отслеживание ссылок и точный отказ
 */
export function YandexMetrika() {

  return (
    <>
      {/* Трекер маршрутов обернут в Suspense */}
      <Suspense fallback={null}>
        <YandexMetrikaTracker />
      </Suspense>

      {/* Инициализация Яндекс.Метрики */}
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) { return; }
              }
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(${YANDEX_METRIKA_ID}, "init", {
              defer: true, // Отключаем автоматическую отправку первого хита (важно для SPA)
              clickmap: true, // Карта кликов
              trackLinks: true, // Отслеживание внешних ссылок
              accurateTrackBounce: true, // Точный показатель отказов
              webvisor: true, // Вебвизор для записи действий пользователей
              trackHash: true // Отслеживание изменений хэша в URL
            });
          `,
        }}
      />

      {/* Noscript fallback для Яндекс.Метрики */}
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  )
}
