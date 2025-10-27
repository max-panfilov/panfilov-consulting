#!/usr/bin/env node

/**
 * Скрипт для исправления типа колонки form_id в таблицах ContactForm
 * Запуск: node scripts/fix-form-id.js
 */

import { config } from 'dotenv'
import pg from 'pg'

config()

const { Client } = pg

async function fixFormId() {
  const client = new Client({
    connectionString: process.env.DATABASE_URI,
  })

  try {
    console.log('🔧 Подключение к БД...')
    await client.connect()

    console.log('🗑️  Удаляем старые данные из ContactForm блоков...')
    await client.query('DELETE FROM pages_blocks_contact_form;')
    await client.query('DELETE FROM _pages_v_blocks_contact_form;')

    console.log('🔄 Изменяем тип колонки form_id на integer...')
    await client.query(
      'ALTER TABLE pages_blocks_contact_form ALTER COLUMN form_id TYPE integer USING NULL;',
    )
    await client.query(
      'ALTER TABLE _pages_v_blocks_contact_form ALTER COLUMN form_id TYPE integer USING NULL;',
    )

    console.log('✅ Готово! Тип колонки form_id изменен на integer')
    console.log('\n📝 Дальнейшие шаги:')
    console.log('1. Перезапустите dev-сервер: pnpm dev')
    console.log('2. Запустите seed через админку: http://localhost:3000/admin')
    console.log('3. Проверьте главную страницу: http://localhost:3000/home')
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
    console.error('\n📖 См. docs/FIX_FORM_ID.md для альтернативных решений')
    process.exit(1)
  } finally {
    await client.end()
  }
}

fixFormId()
