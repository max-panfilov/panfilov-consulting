import React from 'react'
import type { FeaturedCasesBlock as FeaturedCasesBlockType, Case } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const FeaturedCasesBlock: React.FC<FeaturedCasesBlockType> = async ({
  heading,
  casesToShow = 3,
  autoSelect = true,
  manualCases,
  ctaText,
  ctaLink,
}) => {
  // Получаем Payload instance
  const payload = await getPayload({ config: configPromise })

  let cases: Case[] = []

  // Получаем кейсы в зависимости от настроек
  if (autoSelect) {
    // Автоматический выбор featured кейсов
    const result = await payload.find({
      collection: 'cases',
      where: {
        featured: {
          equals: true,
        },
        _status: {
          equals: 'published',
        },
      },
      limit: casesToShow || undefined,
      sort: '-publishedAt',
    })
    cases = result.docs
  } else if (manualCases && Array.isArray(manualCases)) {
    // Ручной выбор кейсов
    // Фильтруем только объекты (исключаем ID)
    cases = manualCases.filter((c): c is Case => typeof c === 'object') as Case[]
    // Ограничиваем количество
    cases = cases.slice(0, casesToShow || undefined)
  }

  // Если кейсов нет, не рендерим блок
  if (cases.length === 0) {
    return null
  }

  return (
    <div className="py-16 md:py-24" id="cases">
      <div className="container">
        {/* Заголовок секции */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16">
          {heading}
        </h2>

        {/* Grid с кейсами */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((caseItem) => {
            // Извлекаем URL изображения
            const coverImageUrl =
              typeof caseItem.coverImage === 'object' && caseItem.coverImage?.url
                ? caseItem.coverImage.url
                : null

            return (
              <div
                key={caseItem.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400"
              >
                {/* Изображение кейса */}
                {coverImageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={coverImageUrl}
                      alt={caseItem.title || 'Case image'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Оверлей */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}

                {/* Контент карточки */}
                <div className="p-6">
                  {/* Индустрия */}
                  {caseItem.industry && (
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full mb-3">
                      {getIndustryLabel(caseItem.industry)}
                    </span>
                  )}

                  {/* Заголовок */}
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {caseItem.title}
                  </h3>

                  {/* Краткое описание */}
                  {caseItem.shortDescription && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {caseItem.shortDescription}
                    </p>
                  )}

                  {/* Кнопка "Подробнее" */}
                  <a
                    href={`/cases/${caseItem.slug}`}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Подробнее
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA кнопка */}
        {ctaText && ctaLink && (
          <div className="text-center mt-12">
            <a
              href={ctaLink}
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              {ctaText}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

// Вспомогательная функция для получения русского названия индустрии
function getIndustryLabel(industry: string): string {
  const labels: Record<string, string> = {
    electronics: 'Электротехника',
    metallurgy: 'Металлопрокат',
    legal: 'Юридические услуги',
    finance: 'Финансы',
    retail: 'Ритейл',
    logistics: 'Логистика',
    manufacturing: 'Производство',
    other: 'Другое',
  }
  return labels[industry] || industry
}
