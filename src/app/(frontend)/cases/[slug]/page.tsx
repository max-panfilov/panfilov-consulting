import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Case } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

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

  return (
    <article className="pb-16">
      <PageClient />

      {/* Разрешает редиректы для валидных страниц */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {/* Hero секция кейса */}
      <div className="relative">
        <div className="container">
          <div className="pt-16 pb-8">
            {/* Индустрия */}
            {caseItem.industry && (
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-800 rounded-full">
                  {getIndustryLabel(caseItem.industry)}
                </span>
              </div>
            )}
            
            {/* Заголовок */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {caseItem.title}
            </h1>

            {/* Краткое описание */}
            {caseItem.shortDescription && (
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl">
                {caseItem.shortDescription}
              </p>
            )}

            {/* Технологии */}
            {caseItem.technologies && caseItem.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {caseItem.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full"
                  >
                    {typeof tech === 'object' && tech.technology}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Изображение обложки */}
        {caseItem.coverImage && typeof caseItem.coverImage === 'object' && (
          <div className="w-full h-[400px] md:h-[500px] relative mb-12">
            <img
              src={caseItem.coverImage.url || ''}
              alt={caseItem.coverImage.alt || caseItem.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Контент кейса */}
      <div className="flex flex-col items-center gap-12">
        <div className="container max-w-4xl">
          {/* Задача */}
          {caseItem.challenge && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Задача</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {caseItem.challenge}
              </p>
            </div>
          )}

          {/* Решение */}
          {caseItem.solution && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Решение</h2>
              <RichText
                className="prose dark:prose-invert max-w-none"
                data={caseItem.solution}
                enableGutter={false}
              />
            </div>
          )}

          {/* Результаты */}
          {caseItem.results && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Результаты</h2>
              <RichText
                className="prose dark:prose-invert max-w-none"
                data={caseItem.results}
                enableGutter={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* CTA секция */}
      <div className="container max-w-4xl mt-16">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Хотите похожий результат?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Давайте обсудим, как AI может помочь вашему бизнесу
          </p>
          <a
            href="/#form"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Получить консультацию
          </a>
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
