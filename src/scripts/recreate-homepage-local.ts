// @ts-nocheck
#!/usr/bin/env tsx

/**
 * CLI скрипт для пересоздания главной страницы через Payload Local API
 * Запуск: pnpm recreate:homepage:local
 */

import 'dotenv/config'
import { recreateHomePage } from './content-manager'

async function main() {
  console.log('🏠 Starting homepage recreation via Local API...')

  try {
    const result = await recreateHomePage()
    console.log('✅ Homepage created successfully!')
    console.log(`   - Page ID: ${result.id}`)
    console.log(`   - Page slug: ${result.slug}`)
    console.log(`   - Blocks: ${result.layout?.length || 0}`)
    
    // Явно завершаем процесс после успешного выполнения
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error creating homepage:')
    console.error(error.message)
    if (error.stack) {
      console.error('\nStack trace:')
      console.error(error.stack)
    }
    process.exit(1)
  }
}

main()
