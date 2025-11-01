#!/bin/bash

# Скрипт для восстановления PostgreSQL БД из бэкапа

# Загружаем DATABASE_URI из .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

if [ -z "$DATABASE_URI" ]; then
  echo "❌ DATABASE_URI не найден в .env"
  exit 1
fi

# Проверяем что указан файл бэкапа
if [ -z "$1" ]; then
  echo "❌ Укажите файл бэкапа"
  echo "Использование: ./scripts/db-restore.sh backups/backup_YYYYMMDD_HHMMSS.sql"
  echo ""
  echo "Доступные бэкапы:"
  ls -lh backups/*.sql 2>/dev/null || echo "Нет бэкапов"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Файл не найден: $BACKUP_FILE"
  exit 1
fi

echo "⚠️  ВНИМАНИЕ! Это удалит все текущие данные в БД и восстановит из бэкапа."
read -p "Продолжить? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "❌ Отменено"
  exit 0
fi

echo "🔄 Восстановление БД из $BACKUP_FILE..."
psql "$DATABASE_URI" < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "✅ БД восстановлена из бэкапа"
else
  echo "❌ Ошибка при восстановлении БД"
  exit 1
fi
