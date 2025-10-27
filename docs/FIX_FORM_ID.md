# Исправление ошибки form_id

## Проблема

Ошибка: `column "form_id" cannot be cast automatically to type integer`

Это произошло из-за изменения типа поля `form` в ContactForm block с text на relationship.

## Решение 1: SQL (рекомендуется)

Подключитесь к PostgreSQL и выполните:

```sql
-- Удаляем старые данные
DELETE FROM pages_blocks_contact_form;
DELETE FROM _pages_v_blocks_contact_form;

-- Изменяем тип колонки
ALTER TABLE pages_blocks_contact_form 
ALTER COLUMN form_id TYPE integer USING NULL;

ALTER TABLE _pages_v_blocks_contact_form 
ALTER COLUMN form_id TYPE integer USING NULL;
```

### Как выполнить:

1. Найдите строку подключения в `.env`: `DATABASE_URI`
2. Подключитесь к БД:
   ```bash
   psql "ваша_строка_подключения"
   ```
3. Скопируйте и выполните SQL выше

## Решение 2: Удалить таблицы через SQL

```sql
DROP TABLE IF EXISTS pages_blocks_contact_form CASCADE;
DROP TABLE IF EXISTS _pages_v_blocks_contact_form CASCADE;
```

После этого перезапустите dev-сервер — Payload пересоздаст таблицы с правильным типом.

## Решение 3: Пересоздать всю БД (самое радикальное)

⚠️ **Внимание: удалит ВСЕ данные!**

1. Остановите dev-сервер
2. Удалите БД и создайте заново:
   ```bash
   dropdb your_database_name
   createdb your_database_name
   ```
3. Запустите dev-сервер: `pnpm dev`
4. Запустите seed через админку

## После исправления

После того как исправите БД:

1. Перезапустите dev-сервер: `pnpm dev`
2. Проверьте админку: http://localhost:3000/admin
3. Запустите seed через "seed database"
4. Проверьте главную страницу: http://localhost:3000/home
