import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ExpertiseHighlightBlock as ExpertiseHighlightBlockType } from '@/payload-types'
import type { Where } from 'payload'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ArrowRightIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AnimateIn } from '@/components/AnimateIn'

export const ExpertiseHighlightBlock: React.FC<ExpertiseHighlightBlockType> = async ({
  heading,
  subheading,
  category,
  postsToShow = 3,
  ctaText,
  ctaLink,
}) => {
  // Получаем Payload instance
  const payload = await getPayload({ config: configPromise })

  const whereConditions: Where = {
    _status: {
      equals: 'published',
    },
  }

  if (category && typeof category === 'object' && category.id) {
    whereConditions.categories = {
      contains: category.id,
    }
  }

  // Получаем посты
  const result = await payload.find({
    collection: 'posts',
    where: whereConditions,
    limit: postsToShow || undefined,
    sort: '-publishedAt',
  })

  const posts = result.docs

  // Если постов нет, не рендерим блок
  if (posts.length === 0) {
    return null
  }

  // Получаем имя категории для Badge
  const categoryName = category && typeof category === 'object' ? category.title : null

  return (
    <AnimateIn as="section" className="py-16 md:py-24">
      <div className="container">
        {/* Заголовок секции */}
        <div className="mb-10 md:mb-14 max-w-2xl">
          {categoryName && (
            <Badge className="mb-3" variant="outline">
              {categoryName}
            </Badge>
          )}
          <h2 className="mb-3 text-pretty text-3xl font-semibold tracking-tight md:text-4xl">
            {heading}
          </h2>
          {subheading && (
            <p className="text-lg text-muted-foreground">{subheading}</p>
          )}
        </div>

        {/* Grid с постами */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {posts.map((post) => {
            // Извлекаем мета-изображение
            const metaImageUrl =
              typeof post.meta?.image === 'object' && post.meta.image?.url
                ? post.meta.image.url
                : null

            // Форматируем дату
            const publishedDate = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : null

            // Извлекаем категории поста
            const postCategories =
              Array.isArray(post.categories) && post.categories.length > 0
                ? post.categories
                    .map((cat) => (typeof cat === 'object' ? cat.title : null))
                    .filter(Boolean)
                : []

            return (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="group flex flex-col overflow-clip rounded-lg border border-border bg-background transition-colors hover:bg-card"
              >
                {metaImageUrl && (
                  <div className="relative aspect-video w-full">
                    <Image
                      src={metaImageUrl}
                      alt={post.meta?.title || post.title || 'Post image'}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex items-center justify-between gap-4">
                    {postCategories.length > 0 && (
                      <Badge variant="outline">{postCategories[0]}</Badge>
                    )}
                    {publishedDate && (
                      <span className="text-sm text-muted-foreground">{publishedDate}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-semibold">{post.title}</h3>
                    {post.meta?.description && (
                      <p className="text-muted-foreground">
                        {post.meta.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* CTA кнопка */}
        {ctaText && ctaLink && (
          <div className="mt-10 md:mt-14">
            <Button asChild variant="outline">
              <Link href={ctaLink}>
                {ctaText}
                <ArrowRightIcon className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </AnimateIn>
  )
}
