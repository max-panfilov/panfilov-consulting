'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

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
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="py-16 md:py-24"
      id="cases"
    >
      <div className="container">
        {/* Заголовок секции */}
        {heading && (
          <div className="mb-10 md:mb-14 max-w-2xl">
            <Badge variant="outline" className="mb-3">
              Кейсы
            </Badge>
            <h2 className="text-pretty text-3xl font-semibold tracking-tight md:text-4xl">{heading}</h2>
            {subheading && (
              <p className="text-muted-foreground mt-3 text-lg">{subheading}</p>
            )}
          </div>
        )}

        {/* Grid с кейсами */}
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {cases.map((caseItem) => {
            const url = `/cases/${caseItem.slug}`
            return (
              <Link
                key={caseItem.id}
                href={url}
                className="group flex flex-col overflow-clip rounded-lg border border-border transition-colors hover:bg-card"
              >
                {/* Изображение */}
                <div className="relative block aspect-video w-full overflow-hidden">
                  <Image
                    src={
                      caseItem.coverImage ||
                      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg'
                    }
                    alt={caseItem.title || 'Case image'}
                    fill
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {/* Контент карточки */}
                <div className="px-6 py-6 md:px-8 md:py-8">
                  <h3 className="mb-2 text-lg font-semibold md:text-xl">
                    {caseItem.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                    {caseItem.shortDescription || 'Описание кейса'}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Кнопка */}
        <div className="mt-10 md:mt-14">
          <Button asChild variant="outline">
            <Link href="/cases">
              Все кейсы
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.section>
  )
}
