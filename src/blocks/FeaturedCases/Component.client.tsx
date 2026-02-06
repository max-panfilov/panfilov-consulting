'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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
  subheading?: string | null
  cases: SerializedCase[]
}

export const FeaturedCasesClient: React.FC<FeaturedCasesClientProps> = ({
  heading,
  subheading,
  cases,
}) => {
  return (
    <section className="py-16 md:py-32" id="cases">
      <div className="container">
        {/* Заголовок секции по центру */}
        {heading && (
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <Badge variant="outline" className="mb-4">
              Кейсы
            </Badge>
            <h2 className="text-pretty text-3xl font-semibold md:text-4xl lg:text-5xl">{heading}</h2>
            {subheading && (
              <p className="text-muted-foreground mt-4 text-lg">{subheading}</p>
            )}
          </div>
        )}

        {/* Grid с кейсами */}
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {cases.map((caseItem) => {
            const url = `/cases/${caseItem.slug}`
            return (
              <div
                key={caseItem.id}
                className="border-border flex flex-col overflow-clip rounded-xl border"
              >
                {/* Изображение */}
                <Link href={url} className="relative block aspect-16/9 w-full">
                  <Image
                    src={
                      caseItem.coverImage ||
                      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg'
                    }
                    alt={caseItem.title || 'Case image'}
                    fill
                    className="object-cover object-center transition-opacity hover:opacity-80"
                    sizes="(max-width: 768px) 100vw, 50vw"
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

        {/* Кнопка "Все кейсы" после списка кейсов */}
        <div className="mt-14 flex justify-center">
          <Button asChild>
            <Link href="/cases">
              Все кейсы
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
