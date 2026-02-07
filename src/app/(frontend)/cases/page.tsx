import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { getIndustryLabel } from '@/utilities/getIndustryLabel'

export const metadata: Metadata = {
  title: 'Кейсы | Panfilov Consulting',
  description: 'Примеры успешных проектов внедрения GenAI решений для бизнеса',
}

export default async function CasesPage() {
  const payload = await getPayload({ config: configPromise })

  const casesResult = await payload.find({
    collection: 'cases',
    where: {
      _status: {
        equals: 'published',
      },
    },
    limit: 100,
    sort: ['sortOrder', '-publishedAt'],
  })

  const cases = casesResult.docs

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
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

        {cases.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {cases.map((caseItem) => {
              const coverImage =
                typeof caseItem.coverImage === 'object' ? caseItem.coverImage : null
              const coverImageUrl = coverImage?.sizes?.medium?.url || coverImage?.url || null
              const industryLabel = getIndustryLabel(caseItem.industry || '')

              return (
                <Card key={caseItem.id} className="grid grid-rows-[auto_auto_1fr_auto] pt-0">
                  <div className="aspect-16/9 w-full">
                    <Link
                      href={`/cases/${caseItem.slug}`}
                      className="fade-in transition-opacity duration-200 hover:opacity-70"
                    >
                      {coverImageUrl ? (
                        <div className="relative h-full w-full">
                          <Image
                            src={coverImageUrl}
                            alt={caseItem.title}
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground">Нет изображения</span>
                        </div>
                      )}
                    </Link>
                  </div>

                  <CardHeader>
                    {industryLabel && (
                      <Badge variant="outline" className="mb-2 w-fit">
                        {industryLabel}
                      </Badge>
                    )}
                    <h3 className="text-lg font-semibold hover:underline md:text-xl">
                      <Link href={`/cases/${caseItem.slug}`}>{caseItem.title}</Link>
                    </h3>
                  </CardHeader>

                  <CardContent>
                    {caseItem.shortDescription && (
                      <p className="text-muted-foreground">
                        {caseItem.shortDescription}
                      </p>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Link
                      href={`/cases/${caseItem.slug}`}
                      className="text-foreground flex items-center hover:underline"
                    >
                      Читать кейс
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
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
