import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { Badge } from '@/components/ui/badge'

import type { Case } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import RichText from '@/components/RichText'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const cases = await payload.find({
    collection: 'cases',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = cases.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function CasePage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Декодируем slug для поддержки специальных символов
  const decodedSlug = decodeURIComponent(slug)
  const url = '/cases/' + decodedSlug
  const caseItem = await queryCaseBySlug({ slug: decodedSlug })

  if (!caseItem) return <PayloadRedirects url={url} />

  // Извлекаем данные для шаблона Blogpost1
  const coverImageUrl =
    typeof caseItem.coverImage === 'object' && caseItem.coverImage?.url
      ? caseItem.coverImage.url
      : null

  return (
    <article>
      <PageClient />

      {/* Разрешает редиректы для валидных страниц */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {/* Hero секция в стиле Blogpost1 */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
            {/* Индустрия */}
            {caseItem.industry && (
              <Badge variant="outline">{getIndustryLabel(caseItem.industry)}</Badge>
            )}

            {/* Заголовок */}
            <h1 className="max-w-3xl text-pretty text-5xl font-semibold md:text-6xl">
              {caseItem.title}
            </h1>

            {/* Краткое описание */}
            {caseItem.shortDescription && (
              <h3 className="text-muted-foreground max-w-3xl text-lg md:text-xl">
                {caseItem.shortDescription}
              </h3>
            )}

            {/* Технологии */}
            {caseItem.technologies && caseItem.technologies.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {caseItem.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {typeof tech === 'object' && tech.technology}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Контент кейса */}
      <div className="container pb-16">
        <div className="prose dark:prose-invert mx-auto max-w-3xl">
          {/* Задача */}
          {caseItem.challenge && (
            <div>
              <h2>Задача</h2>
              <RichText data={caseItem.challenge} enableGutter={false} enableProse={false} />
            </div>
          )}

          {/* Решение */}
          {caseItem.solution && (
            <div>
              <h2>Решение</h2>
              <RichText data={caseItem.solution} enableGutter={false} enableProse={false} />
            </div>
          )}

          {/* Результаты */}
          {caseItem.results && (
            <div>
              <h2>Результаты</h2>
              <RichText data={caseItem.results} enableGutter={false} enableProse={false} />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Декодируем slug для поддержки специальных символов
  const decodedSlug = decodeURIComponent(slug)
  const caseItem = await queryCaseBySlug({ slug: decodedSlug })

  return generateMeta({ doc: caseItem })
}

const queryCaseBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'cases',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

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
