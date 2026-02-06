import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { Badge } from '@/components/ui/badge'

import { generateMeta } from '@/utilities/generateMeta'
import { getIndustryLabel } from '@/utilities/getIndustryLabel'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import RichText from '@/components/RichText'

export async function generateStaticParams() {
  try {
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

    return cases.docs.map(({ slug }) => ({ slug }))
  } catch (error) {
    console.warn('Unable to generate static params for cases:', error)
    return []
  }
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function CasePage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/cases/' + decodedSlug
  const caseItem = await queryCaseBySlug({ slug: decodedSlug })

  if (!caseItem) return <PayloadRedirects url={url} />

  return (
    <article>
      <PageClient />

      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
            {caseItem.industry && (
              <Badge variant="outline">{getIndustryLabel(caseItem.industry)}</Badge>
            )}

            <h1 className="max-w-3xl text-pretty text-3xl font-semibold md:text-4xl">
              {caseItem.title}
            </h1>

            {caseItem.shortDescription && (
              <h3 className="text-muted-foreground max-w-3xl text-lg md:text-xl">
                {caseItem.shortDescription}
              </h3>
            )}

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

      <div className="container pb-16">
        <div className="prose dark:prose-invert mx-auto max-w-3xl">
          {caseItem.challenge && (
            <div>
              <h2>Задача</h2>
              <RichText data={caseItem.challenge} enableGutter={false} enableProse={false} />
            </div>
          )}

          {caseItem.solution && (
            <div>
              <h2>Решение</h2>
              <RichText data={caseItem.solution} enableGutter={false} enableProse={false} />
            </div>
          )}

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
  const decodedSlug = decodeURIComponent(slug)
  const caseItem = await queryCaseBySlug({ slug: decodedSlug })

  return generateMeta({ doc: caseItem })
}

const queryCaseBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  try {
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
  } catch (error) {
    console.warn(`Unable to query case by slug "${slug}":`, error)
    return null
  }
})
