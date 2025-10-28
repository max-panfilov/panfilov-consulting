// @ts-nocheck
#!/usr/bin/env tsx

import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function main() {
  console.log('📦 Создание кейсов...')

  try {
    const payload = await getPayload({ config: configPromise })
    const context = { disableRevalidate: true }

    // Удаляем существующие кейсы
    const existing = await payload.find({ collection: 'cases', limit: 100 })
    if (existing.docs.length > 0) {
      console.log(`🗑️  Удаление ${existing.docs.length} кейсов...`)
      for (const c of existing.docs) {
        await payload.delete({ collection: 'cases', id: c.id, context })
      }
    }

    // Получаем ID placeholder
    const media = await payload.find({
      collection: 'media',
      where: { alt: { equals: 'Case placeholder' } },
      limit: 1,
    })
    const placeholderImageId = media.docs[0]?.id || '5'

    const cases = [
      {
        title: 'ИИ-чатбот для обслуживания клиентов АО «ДКС»',
        slug: 'dks-chatbot',
        industry: 'manufacturing',
        shortDescription: 'Интеллектуальный чат-бот для автоматизации ответов',
        challenge: 'Высокая нагрузка на операторов из-за повторяющихся вопросов.',
        coverImage: placeholderImageId,
        solution: `Разработан интеллектуальный чат-бот на основе LLM (GPT).

Ключевые особенности:
- Анализ 4000 реальных диалогов для выявления частотных тем
- Реализация 4 приоритетных сценариев
- Интеграция с внутренним API DKC
- Автоматическое выявление кода товара`,
        results: `- Рост доли автоматизированных ответов с 30% до 60%
- Снижение нагрузки на операторов на 40%
- Масштабируемая архитектура`,
        technologies: [{ technology: 'GPT-4' }, { technology: 'LangChain' }, { technology: 'Python' }],
        _status: 'published',
      },
      {
        title: 'Внутренняя платформа для работы с LLM',
        slug: 'legal-llm-platform',
        industry: 'legal',
        coverImage: placeholderImageId,
        shortDescription: 'Защищенная on-premise платформа',
        challenge: 'Необходимость работы с LLM при обработке конфиденциальных документов.',
        solution: `Развернута собственная платформа с защищенным доступом.

Реализованный функционал:
- Установка платформы на базе Nvidia H200
- Развертывание on-premise модели Qwen32B
- Разработка скриптов автоматизации анализа Due Diligence
- Создание чат-интерфейса для взаимодействия с LLM`,
        results: `- Ускорение анализа документов в 5 раз
- 100% конфиденциальность данных
- Снижение времени подготовки заключений на 60%`,
        technologies: [{ technology: 'Qwen32B' }, { technology: 'Nvidia H200' }, { technology: 'Python' }],
        _status: 'published',
      },
      {
        title: 'ИИ-бот для обработки заявок на металлопрокат',
        slug: 'metallurgy-bot',
        industry: 'metallurgy',
        coverImage: placeholderImageId,
        shortDescription: 'Telegram-бот для распознавания прайс-листов',
        challenge: 'Ручная обработка прайс-листов занимала много времени.',
        solution: `Разработан интеллектуальный Telegram-бот для автоматического распознавания данных.

Технические решения:
- Интеграция Telegram-бота с n8n
- Использование OpenAI и LangChain для OCR
- Поддержка .xlsx, .pdf, .jpg файлов
- Автоматическое извлечение табличных данных`,
        results: `- Время обработки сократилось с 2 часов до 5 минут
- Снижение ошибок на 95%
- Увеличение скорости отклика в 24 раза`,
        technologies: [{ technology: 'Telegram Bot' }, { technology: 'n8n' }, { technology: 'OpenAI' }],
        _status: 'published',
      },
      {
        title: 'ИИ-платформа для сбора кейсов digital-агентств',
        slug: 'digital-cases-platform',
        industry: 'other',
        coverImage: placeholderImageId,
        shortDescription: 'B2B-система с ИИ-ассистентом для автоматического создания портфолио',
        challenge: 'Агентства тратят много времени на оформление портфолио.',
        solution: `Разработана B2B-платформа с ИИ-ассистентом.

Архитектура решения:
- Интеграция Google Gemini 2.5 Flash с Function Calling
- Публичный чат на лендинге с SSE-стримингом
- Механизм claim/handoff для передачи диалога
- Дашборд на Refine + Next.js App Router с RBAC`,
        results: `- Сокращение времени создания кейса с 4 часов до 15 минут
- Автоматическая структуризация информации с точностью 90%
- Увеличение количества опубликованных кейсов на 300%`,
        technologies: [{ technology: 'Google Gemini' }, { technology: 'Next.js' }, { technology: 'PostgreSQL' }],
        _status: 'published',
      },
      {
        title: 'Платформа для распознавания медицинских анализов',
        slug: 'medical-analysis-platform',
        industry: 'other',
        coverImage: placeholderImageId,
        shortDescription: 'Веб-платформа и Telegram-бот для распознавания лабораторных показателей',
        challenge: 'Интерпретация результатов анализов требует специальных знаний.',
        solution: `Создана комплексная система с веб-интерфейсом и Telegram-ботом.

Реализованный функционал:
- OCR и парсинг: GPT-4o для изображений
- Интеллектуальное сопоставление показателей с БД
- Полозависимая фильтрация индикаторов
- Автоматическая нормализация единиц измерения
- Веб-интерфейс с интерактивными графиками (Recharts)`,
        results: `- Распознавание показателей с точностью 95%
- Автоматическая нормализация 98% единиц измерения
- Сокращение времени интерпретации с 30 минут до 2 минут
- Визуализация динамики показателей для отслеживания изменений`,
        technologies: [{ technology: 'GPT-4o' }, { technology: 'React' }, { technology: 'Express.js' }],
        _status: 'published',
      },
    ]

    console.log(`\n📝 Создание ${cases.length} кейсов...`)
    for (const caseData of cases) {
      const result = await payload.create({
        collection: 'cases',
        context,
        data: caseData,
      })
      console.log(`✅ Создан: "${result.title}"`)
    }

    console.log(`\n✅ Успешно создано ${cases.length} кейсов!`)
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Ошибка:', error.message)
    if (error.stack) console.error(error.stack)
    process.exit(1)
  }
}

main()
