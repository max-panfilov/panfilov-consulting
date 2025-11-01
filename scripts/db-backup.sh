#!/bin/bash

# Скрипт для создания бэкапа PostgreSQL БД

# Загружаем DATABASE_URI из .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

if [ -z "$DATABASE_URI" ]; then
  echo "❌ DATABASE_URI не найден в .env"
  exit 1
fi

# Создаём директорию для бэкапов
mkdir -p backups

# Создаём бэкап с timestamp
BACKUP_FILE="backups/backup_$(date +%Y%m%d_%H%M%S).sql"

echo "🔄 Создание бэкапа БД..."
pg_dump "$DATABASE_URI" > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  echo "✅ Бэкап создан: $BACKUP_FILE ($FILE_SIZE)"
else
  echo "❌ Ошибка при создании бэкапа"
  exit 1
fi
