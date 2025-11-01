import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import type { Post } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  // Извлекаем данные для шаблона Blogpost1
  const heroImageUrl =
    typeof post.meta?.image === 'object' && post.meta.image?.url ? post.meta.image.url : null

  const authorName =
    post.populatedAuthors && post.populatedAuthors.length > 0
      ? typeof post.populatedAuthors[0] === 'object'
        ? post.populatedAuthors[0].name || 'Автор'
        : 'Автор'
      : 'Автор'

  const publishDate = post.publishedAt ? new Date(post.publishedAt) : new Date()

  return (
    <article>
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {/* Hero секция в стиле Blogpost1 */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
            <h1 className="max-w-3xl text-pretty text-3xl font-semibold md:text-4xl">
              {post.title}
            </h1>
            {post.meta?.description && (
              <h3 className="text-muted-foreground max-w-3xl text-lg md:text-xl">
                {post.meta.description}
              </h3>
            )}
            <div className="flex items-center gap-3 text-sm md:text-base">
              <Avatar className="h-8 w-8 border">
                <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>
                <span className="font-semibold">{authorName}</span>
                <span className="ml-1">• {format(publishDate, 'd MMMM yyyy', { locale: ru })}</span>
              </span>
            </div>
            {heroImageUrl && (
              <img
                src={heroImageUrl}
                alt={post.meta?.title || post.title}
                className="mb-8 mt-4 aspect-video w-full rounded-lg border object-cover"
              />
            )}
          </div>
        </div>
      </section>

      {/* Контент поста */}
      <div className="container">
        <div className="prose dark:prose-invert mx-auto max-w-3xl">
          <RichText data={post.content} enableGutter={false} />
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
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
