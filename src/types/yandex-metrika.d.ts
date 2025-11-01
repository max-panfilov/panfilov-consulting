/**
 * TypeScript типы для Яндекс.Метрики
 * Описывает глобальную функцию ym и её методы
 */

interface YandexMetrikaHitOptions {
  /** Функция обратного вызова после отправки данных */
  callback?: () => void
  /** Контекст для callback функции */
  ctx?: any
  /** Параметры визита */
  params?: Record<string, any>
  /** URL страницы, с которой пользователь перешел на текущую */
  referer?: string
  /** Заголовок текущей страницы */
  title?: string
}

interface YandexMetrikaInitOptions {
  /** Откладывание отправки первого хита (важно для SPA) */
  defer?: boolean
  /** Карта кликов */
  clickmap?: boolean
  /** Отслеживание внешних ссылок */
  trackLinks?: boolean
  /** Точный показатель отказов */
  accurateTrackBounce?: boolean | number
  /** Вебвизор */
  webvisor?: boolean
  /** Отслеживание изменений хэша */
  trackHash?: boolean
  /** Ecommerce */
  ecommerce?: boolean | string
  /** Параметры визита */
  params?: Record<string, any>
  /** Параметры пользователя */
  userParams?: Record<string, any>
  /** Childframe (для iframe) */
  childIframe?: boolean
  /** Триггер события */
  triggerEvent?: boolean
}

interface YandexMetrikaFunction {
  /**
   * Инициализация счетчика
   * @param counterId - ID счетчика Яндекс.Метрики
   * @param method - Метод 'init'
   * @param options - Параметры инициализации
   */
  (counterId: number, method: 'init', options?: YandexMetrikaInitOptions): void

  /**
   * Отправка хита (просмотра страницы)
   * @param counterId - ID счетчика Яндекс.Метрики
   * @param method - Метод 'hit'
   * @param url - URL страницы
   * @param options - Дополнительные параметры
   */
  (counterId: number, method: 'hit', url?: string, options?: YandexMetrikaHitOptions): void

  /**
   * Достижение цели
   * @param counterId - ID счетчика Яндекс.Метрики
   * @param method - Метод 'reachGoal'
   * @param target - Название цели
   * @param params - Дополнительные параметры
   * @param callback - Функция обратного вызова
   * @param ctx - Контекст для callback
   */
  (
    counterId: number,
    method: 'reachGoal',
    target: string,
    params?: Record<string, any>,
    callback?: () => void,
    ctx?: any,
  ): void

  /**
   * Установка параметров визита
   * @param counterId - ID счетчика Яндекс.Метрики
   * @param method - Метод 'params'
   * @param params - Параметры визита
   */
  (counterId: number, method: 'params', params: Record<string, any>): void

  /**
   * Установка параметров пользователя
   * @param counterId - ID счетчика Яндекс.Метрики
   * @param method - Метод 'userParams'
   * @param params - Параметры пользователя
   */
  (counterId: number, method: 'userParams', params: Record<string, any>): void

  /**
   * Уничтожение счетчика
   * @param counterId - ID счетчика Яндекс.Метрики
   * @param method - Метод 'destruct'
   */
  (counterId: number, method: 'destruct'): void

  /**
   * Получение ID клиента
   * @param counterId - ID счетчика Яндекс.Метрики
   * @param method - Метод 'getClientID'
   * @param callback - Функция обратного вызова с ID клиента
   */
  (counterId: number, method: 'getClientID', callback: (clientId: string) => void): void

  /**
   * Отложенный вызов методов
   * @param counterId - ID счетчика Яндекс.Метрики
   * @param method - Метод 'setUserID'
   * @param userId - ID пользователя
   */
  (counterId: number, method: 'setUserID', userId: string): void

  /**
   * Общий вариант для других методов
   */
  (counterId: number, method: string, ...args: any[]): void
}

// Расширение глобального объекта Window
declare global {
  interface Window {
    ym?: YandexMetrikaFunction
  }
}

export {}
