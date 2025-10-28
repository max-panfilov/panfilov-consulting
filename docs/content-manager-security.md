# Безопасность Content Manager

## Обзор угроз

Content Manager предоставляет мощные возможности управления контентом, но с этим приходит ответственность за безопасность:

- ⚠️ **Local API скрипты** — обходят все проверки доступа (access control)
- ⚠️ **HTTP endpoints** — могут быть доступны извне без защиты
- ⚠️ **Seed endpoints** — могут удалять и пересоздавать контент

## Защита HTTP Endpoints

### Текущая реализация

HTTP endpoint `/api/seed-homepage` защищен:

```typescript
// Проверка токена авторизации
const authHeader = req.headers.get('authorization')
const expectedToken = process.env.SEED_SECRET || process.env.CRON_SECRET

// В production endpoint отключен без SEED_SECRET
if (process.env.NODE_ENV === 'production' && !expectedToken) {
  return Response.json(
    { success: false, error: 'Endpoint disabled in production' },
    { status: 403 }
  )
}

// Проверяем токен
if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
  return Response.json(
    { success: false, error: 'Unauthorized' },
    { status: 401 }
  )
}
```

### Настройка переменных окружения

Добавьте в `.env`:

```bash
# Для development (опционально)
SEED_SECRET=your-development-secret-key

# Для production (обязательно!)
SEED_SECRET=your-strong-production-secret-key
```

**Генерация безопасного ключа:**

```bash
# Используйте один из способов
openssl rand -base64 32
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Использование с токеном

```bash
# HTTP запрос с токеном
curl -X POST http://localhost:3002/api/seed-homepage \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SEED_SECRET"

# Через скрипт (автоматически читает из .env)
pnpm recreate:homepage
```

## Рекомендации по безопасности

### Development окружение

✅ **Допустимо:**
- Использовать Local API скрипты напрямую
- Иметь слабый или отсутствующий SEED_SECRET
- Запускать без токена авторизации

❌ **Не рекомендуется:**
- Коммитить `.env` в репозиторий
- Использовать production данные локально

### Production окружение

✅ **Обязательно:**
- Установить сильный `SEED_SECRET`
- Ограничить доступ к endpoints на уровне firewall/proxy
- Использовать HTTPS для всех запросов
- Логировать все вызовы seed endpoints

❌ **Запрещено:**
- Публиковать SEED_SECRET в коде
- Оставлять endpoints без защиты
- Использовать слабые пароли

### Дополнительная защита

#### 1. Ограничение по IP

В Vercel/Netlify можно ограничить доступ к endpoint:

```typescript
// В handler endpoint
const allowedIPs = process.env.ALLOWED_IPS?.split(',') || []
const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')

if (process.env.NODE_ENV === 'production' && !allowedIPs.includes(clientIP)) {
  return Response.json({ error: 'Forbidden' }, { status: 403 })
}
```

#### 2. Rate Limiting

Ограничьте количество запросов:

```typescript
// Простой in-memory rate limiter (для примера)
const rateLimits = new Map<string, number>()

const clientIP = req.headers.get('x-forwarded-for')
const lastCall = rateLimits.get(clientIP || 'unknown')

if (lastCall && Date.now() - lastCall < 60000) {
  return Response.json({ error: 'Rate limit exceeded' }, { status: 429 })
}

rateLimits.set(clientIP || 'unknown', Date.now())
```

#### 3. Webhook вместо прямого endpoint

Используйте сервис типа Vercel Cron или GitHub Actions:

```yaml
# .github/workflows/seed-homepage.yml
name: Recreate Homepage
on:
  workflow_dispatch: # Ручной запуск

jobs:
  seed:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: |
          curl -X POST ${{ secrets.SITE_URL }}/api/seed-homepage \
            -H "Authorization: Bearer ${{ secrets.SEED_SECRET }}"
```

## Отключение HTTP Endpoints в Production

Если хотите полностью отключить HTTP endpoints в production:

```typescript
export const seedHomepageEndpoint: Endpoint = {
  path: '/seed-homepage',
  method: 'post',
  handler: async (req) => {
    // Полностью блокируем в production
    if (process.env.NODE_ENV === 'production') {
      return Response.json(
        { success: false, error: 'This endpoint is disabled in production' },
        { status: 403 }
      )
    }
    
    // Остальная логика...
  }
}
```

Или удалите endpoint из конфига:

```typescript
// src/payload.config.ts
export default buildConfig({
  // ...
  endpoints: process.env.NODE_ENV === 'production' 
    ? [] 
    : [seedHomepageEndpoint],
})
```

## Безопасность Local API

### Прямые скрипты (Local API)

Local API скрипты (`pnpm recreate:homepage:local`) **НЕ требуют токена**, так как:

1. Выполняются напрямую на сервере
2. Требуют доступа к файловой системе
3. Требуют наличия `.env` файла
4. Не доступны через HTTP

**Защита:**
- Ограничьте SSH доступ к серверу
- Используйте правильные права доступа к файлам
- Не давайте доступ к серверу недоверенным пользователям

### Context и Access Control

Local API обходит access control по умолчанию. Чтобы включить проверки:

```typescript
import { getPayloadInstance } from './content-manager'

const payload = await getPayloadInstance()

// С проверкой прав доступа
const post = await payload.create({
  collection: 'posts',
  overrideAccess: false, // Проверять права
  user: authenticatedUser, // Передать пользователя
  data: { /* ... */ }
})
```

## Логирование и Аудит

### Добавление логирования

```typescript
export const seedHomepageEndpoint: Endpoint = {
  path: '/seed-homepage',
  method: 'post',
  handler: async (req) => {
    const clientIP = req.headers.get('x-forwarded-for')
    const timestamp = new Date().toISOString()
    
    // Логируем попытку доступа
    console.log(`[${timestamp}] Seed endpoint called from IP: ${clientIP}`)
    
    // Проверка токена...
    
    try {
      const result = await recreateHomePage()
      console.log(`[${timestamp}] Homepage recreated successfully by IP: ${clientIP}`)
      return Response.json({ success: true })
    } catch (error) {
      console.error(`[${timestamp}] Seed failed from IP ${clientIP}:`, error)
      throw error
    }
  }
}
```

### Интеграция с monitoring

Отправляйте алерты при подозрительной активности:

```typescript
// Например, через Discord webhook
async function sendAlert(message: string) {
  await fetch(process.env.DISCORD_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: `🚨 ${message}` })
  })
}

// В handler
if (authHeader !== `Bearer ${expectedToken}`) {
  await sendAlert(`Unauthorized seed attempt from ${clientIP}`)
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}
```

## Checklist безопасности

### Перед деплоем в production

- [ ] Установлен сильный `SEED_SECRET` (минимум 32 символа)
- [ ] SEED_SECRET добавлен в переменные окружения хостинга
- [ ] SEED_SECRET НЕ закоммичен в репозиторий
- [ ] Проверен `.gitignore` — `.env` в нем присутствует
- [ ] Настроено логирование вызовов seed endpoints
- [ ] Настроен мониторинг подозрительных запросов
- [ ] Документация обновлена для команды

### Регулярные проверки

- [ ] Ротация SEED_SECRET каждые 90 дней
- [ ] Проверка логов на подозрительную активность
- [ ] Аудит доступа к production серверу
- [ ] Обновление зависимостей (npm audit)

## FAQ

**Q: Нужен ли SEED_SECRET в development?**  
A: Нет, в development он опционален. Но рекомендуется использовать для практики.

**Q: Что делать если SEED_SECRET утек?**  
A: Немедленно сгенерировать новый, обновить в .env и на хостинге, проверить логи на подозрительную активность.

**Q: Можно ли использовать один секрет для всех окружений?**  
A: Нет! У каждого окружения (dev, staging, production) должен быть свой уникальный секрет.

**Q: Безопасно ли использовать CRON_SECRET как fallback?**  
A: Да, если у вас уже есть CRON_SECRET. Но лучше иметь отдельный SEED_SECRET для гранулярного контроля.

**Q: Как проверить что endpoint защищен?**  
A: Попробуйте вызвать без токена: должен вернуться 401 Unauthorized.

## Дополнительные ресурсы

- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [Payload Security Best Practices](https://payloadcms.com/docs/access-control/overview)
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
