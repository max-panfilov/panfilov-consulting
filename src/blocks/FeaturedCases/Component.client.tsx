'use client'

import React from 'react'

// Тип для сериализованного кейса
type SerializedCase = {
  id: string | number
  title?: string | null
  slug?: string | null
  industry?: string | null
  shortDescription?: string | null
  coverImage: string | null
}

type FeaturedCasesClientProps = {
  heading?: string | null
  cases: SerializedCase[]
  ctaText?: string | null
  ctaLink?: string | null
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

export const FeaturedCasesClient: React.FC<FeaturedCasesClientProps> = ({
  heading,
  cases,
}) => {
  return (
    <section className="py-16 md:py-32" id="cases">
      <div className="container">
        {/* Заголовок секции */}
        {heading && (
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-pretty text-3xl font-semibold md:text-4xl lg:text-5xl">{heading}</h2>
          </div>
        )}

        {/* Grid с кейсами */}
        <div className="grid gap-8 lg:grid-cols-2">
          {cases.map((caseItem) => {
            const url = `/cases/${caseItem.slug}`
            return (
              <div
                key={caseItem.id}
                className="bg-muted flex flex-col justify-between rounded-lg"
              >
                <div className="flex justify-between gap-10 border-b">
                  <div className="flex flex-col justify-start justify-between gap-8 py-6 pl-4 md:gap-14 md:py-10 md:pl-8 lg:justify-normal">
                    {/* Индустрия */}
                    <span className="text-muted-foreground font-mono text-xs uppercase">
                      {caseItem.industry ? getIndustryLabel(caseItem.industry) : 'Кейс'}
                    </span>
                    {/* Заголовок */}
                    <a href={url}>
                      <h3 className="hover:text-primary text-2xl transition-all hover:opacity-80 sm:text-3xl lg:text-4xl">
                        {caseItem.title}
                      </h3>
                    </a>
                  </div>
                  {/* Изображение */}
                  <div className="md:1/3 w-2/5 shrink-0 rounded-r-lg border-l">
                    <a href={url}>
                      <img
                        src={
                          caseItem.coverImage ||
                          'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg'
                        }
                        alt={caseItem.title || 'Case image'}
                        className="h-full w-full rounded-t-lg object-cover transition-opacity hover:opacity-80"
                      />
                    </a>
                  </div>
                </div>
                {/* Описание */}
                <p className="text-muted-foreground p-4 md:p-8">
                  {caseItem.shortDescription || 'Описание кейса'}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
