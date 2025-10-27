#!/bin/bash

# Скрипт для создания или обновления главной страницы через Payload API
# Проверяет существование страницы и обновляет её, если она уже есть
# Использование: ./scripts/upsert-home-page.sh your@email.com your_password

API_URL="https://panfilov.consulting"
EMAIL="${1}"
PASSWORD="${2}"
SLUG="home"

if [ -z "$EMAIL" ] || [ -z "$PASSWORD" ]; then
  echo "❌ Использование: $0 <email> <password>"
  exit 1
fi

echo "🔐 Выполняется вход..."

# Логин и получение токена
TOKEN=$(curl -s -X POST "${API_URL}/api/users/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}" | jq -r '.token')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Ошибка входа. Проверьте email и пароль."
  exit 1
fi

echo "✅ Вход выполнен успешно"
echo "🔍 Проверка существования страницы с slug='${SLUG}'..."

# Проверяем, существует ли страница с таким slug
EXISTING_PAGE=$(curl -s -X GET "${API_URL}/api/pages?limit=100" \
  -H "Authorization: JWT ${TOKEN}")

PAGE_ID=$(echo "$EXISTING_PAGE" | jq -r ".docs[] | select(.slug == \"${SLUG}\") | .id" | head -1)

# JSON данные для страницы
PAGE_DATA='{
  "title": "Главная",
  "slug": "home",
  "hero": {
    "type": "lowImpact",
    "richText": {
      "root": {
        "type": "root",
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "version": 1,
        "children": [
          {
            "children": [
              {
                "detail": 0,
                "format": 0,
                "mode": "normal",
                "style": "",
                "text": "Добро пожаловать на сайт Panfilov Consulting",
                "type": "text",
                "version": 1
              }
            ],
            "direction": "ltr",
            "format": "",
            "indent": 0,
            "type": "paragraph",
            "version": 1
          }
        ]
      }
    }
  },
  "layout": [
    {
      "blockType": "content",
      "columns": [
        {
          "size": "full",
          "richText": {
            "root": {
              "type": "root",
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "children": [
                {
                  "children": [
                    {
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "text": "Мы предоставляем профессиональные консалтинговые услуги для вашего бизнеса.",
                      "type": "text",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "type": "paragraph",
                  "version": 1
                }
              ]
            }
          }
        }
      ]
    },
    {
      "blockType": "cta",
      "richText": {
        "root": {
          "type": "root",
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "version": 1,
          "children": [
            {
              "children": [
                {
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "text": "Готовы начать работу?",
                  "type": "text",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "type": "paragraph",
              "version": 1
            }
          ]
        }
      },
      "links": [
        {
          "link": {
            "type": "custom",
            "url": "/contact",
            "label": "Свяжитесь с нами"
          }
        }
      ]
    }
  ],
  "meta": {
    "title": "Panfilov Consulting - Главная",
    "description": "Профессиональные консалтинговые услуги для вашего бизнеса"
  },
  "_status": "published"
}'

if [ -n "$PAGE_ID" ]; then
  echo "📝 Страница найдена (ID: ${PAGE_ID}). Обновляем..."
  
  # Обновляем существующую страницу
  RESPONSE=$(curl -s -X PATCH "${API_URL}/api/pages/${PAGE_ID}" \
    -H "Content-Type: application/json" \
    -H "Authorization: JWT ${TOKEN}" \
    -d "$PAGE_DATA")
  
  if echo "$RESPONSE" | jq -e '.doc.id' > /dev/null 2>&1; then
    echo "✅ Главная страница успешно обновлена!"
    echo "📄 ID страницы: $(echo "$RESPONSE" | jq -r '.doc.id')"
    echo "🔗 Slug: $(echo "$RESPONSE" | jq -r '.doc.slug')"
    echo "🌐 URL: ${API_URL}/$(echo "$RESPONSE" | jq -r '.doc.slug')"
  else
    echo "❌ Ошибка при обновлении страницы:"
    echo "$RESPONSE" | jq '.'
    exit 1
  fi
else
  echo "➕ Страница не найдена. Создаём новую..."
  
  # Создаём новую страницу
  RESPONSE=$(curl -s -X POST "${API_URL}/api/pages" \
    -H "Content-Type: application/json" \
    -H "Authorization: JWT ${TOKEN}" \
    -d "$PAGE_DATA")
  
  if echo "$RESPONSE" | jq -e '.doc.id' > /dev/null 2>&1; then
    echo "✅ Главная страница успешно создана!"
    echo "📄 ID страницы: $(echo "$RESPONSE" | jq -r '.doc.id')"
    echo "🔗 Slug: $(echo "$RESPONSE" | jq -r '.doc.slug')"
    echo "🌐 URL: ${API_URL}/$(echo "$RESPONSE" | jq -r '.doc.slug')"
  else
    echo "❌ Ошибка при создании страницы:"
    echo "$RESPONSE" | jq '.'
    exit 1
  fi
fi
