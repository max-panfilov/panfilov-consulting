#!/usr/bin/env tsx

/**
 * Скрипт для удаления старых таблиц БД
 * Запуск: pnpm tsx src/scripts/drop-old-tables.ts
 */

import 'dotenv/config'
import { Client } from 'pg'

async function main() {
  console.log('🗑️  Удаление старых таблиц БД...')

  const client = new Client({
    connectionString: process.env.DATABASE_URI || '',
  })

  try {
    await client.connect()
    
    // Удаляем проблемную таблицу
    await client.query('DROP TABLE IF EXISTS "_pages_v_blocks_expertise_highlight" CASCADE;')
    console.log('✅ Таблица "_pages_v_blocks_expertise_highlight" удалена')
    
    await client.end()
    console.log('✅ Готово!')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Ошибка:')
    console.error(error.message)
    await client.end()
    process.exit(1)
  }
}

main()
