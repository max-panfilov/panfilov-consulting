import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React from 'react'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Кейсы | Panfilov Consulting',
  description: 'Примеры успешных проектов внедрения GenAI решений для бизнеса',
}

export default async function CasesPage() {
  const payload = await getPayload({ config: configPromise })

  // Получаем опубликованные кейсы
  const casesResult = await payload.find({
    collection: 'cases',
    where: {
      _status: {
        equals: 'published',
      },
    },
    limit: 100,
    sort: '-createdAt',
  })

  const cases = casesResult.docs

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
        {/* Заголовок секции */}
        <div className="text-center">
          <Badge variant="secondary" className="mb-6">
            Наши проекты
          </Badge>
          <h1 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl">
            Кейсы
          </h1>
          <p className="text-muted-foreground mb-8 md:text-base lg:max-w-2xl lg:text-lg">
            Примеры успешных проектов внедрения GenAI решений. От автоматизации процессов до
            создания интеллектуальных систем для среднего и крупного бизнеса.
          </p>
        </div>

        {/* Сетка с кейсами */}
        {cases.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {cases.map((caseItem) => {
              // Извлекаем изображение обложки
              const coverImageUrl =
                typeof caseItem.coverImage === 'object' && caseItem.coverImage?.url
                  ? caseItem.coverImage.url
                  : null

              // Получаем метку индустрии
              const industryLabel = getIndustryLabel(caseItem.industry || '')

              return (
                <Card key={caseItem.id} className="grid grid-rows-[auto_auto_1fr_auto] pt-0">
                  {/* Изображение */}
                  <div className="aspect-16/9 w-full">
                    <a
                      href={`/cases/${caseItem.slug}`}
                      className="fade-in transition-opacity duration-200 hover:opacity-70"
                    >
                      {coverImageUrl ? (
                        <img
                          src={coverImageUrl}
                          alt={caseItem.title}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground">Нет изображения</span>
                        </div>
                      )}
                    </a>
                  </div>

                  {/* Заголовок */}
                  <CardHeader>
                    {industryLabel && (
                      <Badge variant="outline" className="mb-2 w-fit">
                        {industryLabel}
                      </Badge>
                    )}
                    <h3 className="text-lg font-semibold hover:underline md:text-xl">
                      <a href={`/cases/${caseItem.slug}`}>{caseItem.title}</a>
                    </h3>
                  </CardHeader>

                  {/* Описание */}
                  <CardContent>
                    {caseItem.shortDescription && (
                      <p className="text-muted-foreground">
                        {caseItem.shortDescription}
                      </p>
                    )}
                  </CardContent>

                  {/* Футер */}
                  <CardFooter>
                    <a
                      href={`/cases/${caseItem.slug}`}
                      className="text-foreground flex items-center hover:underline"
                    >
                      Читать кейс
                      <ArrowRight className="ml-2 size-4" />
                    </a>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Кейсы скоро появятся</p>
          </div>
        )}
      </div>
    </section>
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
  return labels[industry] || ''
}
