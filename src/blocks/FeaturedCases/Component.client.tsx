'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
}

export const FeaturedCasesClient: React.FC<FeaturedCasesClientProps> = ({
  heading,
  cases,
}) => {
  return (
    <section className="py-16 md:py-32" id="cases">
      <div className="container">
        {/* Заголовок и кнопка в стиле Feature72 */}
        <div className="mb-8 lg:max-w-sm">
          {heading && (
            <h2 className="text-pretty text-3xl font-semibold md:text-4xl lg:text-5xl mb-3 md:mb-4 lg:mb-6">
              {heading}
            </h2>
          )}
          {/* Кнопка "Все кейсы" */}
          <Button variant="link" asChild>
            <Link
              href="/cases"
              className="group flex items-center font-medium md:text-base lg:text-lg"
            >
              Все кейсы
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Grid с кейсами в стиле Feature72 */}
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {cases.map((caseItem) => {
            const url = `/cases/${caseItem.slug}`
            return (
              <div
                key={caseItem.id}
                className="border-border flex flex-col overflow-clip rounded-xl border"
              >
                {/* Изображение */}
                <Link href={url}>
                  <img
                    src={
                      caseItem.coverImage ||
                      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg'
                    }
                    alt={caseItem.title || 'Case image'}
                    className="aspect-16/9 h-full w-full object-cover object-center transition-opacity hover:opacity-80"
                  />
                </Link>
                {/* Контент карточки */}
                <div className="px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
                  <h3 className="mb-3 text-lg font-semibold md:mb-4 md:text-2xl lg:mb-6">
                    <Link href={url} className="hover:text-primary transition-colors">
                      {caseItem.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground lg:text-lg">
                    {caseItem.shortDescription || 'Описание кейса'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
