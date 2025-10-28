// @ts-nocheck
#!/usr/bin/env tsx

/**
 * CLI скрипт для пересоздания главной страницы
 * Запуск: pnpm recreate:homepage
 * Требует запущенного dev сервера
 */

import 'dotenv/config'

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL?.replace(':3000', ':3002') || 'http://localhost:3002'
const SEED_SECRET = process.env.SEED_SECRET || process.env.CRON_SECRET

async function main() {
  console.log('🏠 Starting homepage recreation...')
  console.log(`   API URL: ${API_URL}`)

  if (!SEED_SECRET) {
    console.warn('⚠️  No SEED_SECRET found in .env - endpoint may be protected')
  }

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    // Добавляем токен авторизации если есть
    if (SEED_SECRET) {
      headers['Authorization'] = `Bearer ${SEED_SECRET}`
    }

    const response = await fetch(`${API_URL}/api/seed-homepage`, {
      method: 'POST',
      headers,
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Unknown error occurred')
    }

    console.log('✅ Homepage created successfully!')
    console.log(`   - Page ID: ${data.pageId}`)
  } catch (error: any) {
    console.error('❌ Error creating homepage:')
    console.error(error.message)
    console.log('\n🔍 Убедитесь, что dev сервер запущен: pnpm dev')
    process.exit(1)
  }
}

main()
