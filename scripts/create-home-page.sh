#!/bin/bash

# Скрипт для создания главной страницы через Payload API
# Использование: ./scripts/create-home-page.sh your@email.com your_password

API_URL="https://panfilov.consulting"
EMAIL="${1}"
PASSWORD="${2}"

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
echo "🚀 Создание главной страницы..."

# Создание главной страницы
RESPONSE=$(curl -s -X POST "${API_URL}/api/pages" \
  -H "Content-Type: application/json" \
  -H "Authorization: JWT ${TOKEN}" \
  -d '{
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
  }')

# Проверка результата
if echo "$RESPONSE" | jq -e '.doc.id' > /dev/null 2>&1; then
  PAGE_ID=$(echo "$RESPONSE" | jq -r '.doc.id')
  PAGE_SLUG=$(echo "$RESPONSE" | jq -r '.doc.slug')
  echo "✅ Главная страница успешно создана!"
  echo "📄 ID страницы: $PAGE_ID"
  echo "🔗 Slug: $PAGE_SLUG"
  echo "🌐 URL: ${API_URL}/${PAGE_SLUG}"
else
  echo "❌ Ошибка при создании страницы:"
  echo "$RESPONSE" | jq '.'
  exit 1
fi
