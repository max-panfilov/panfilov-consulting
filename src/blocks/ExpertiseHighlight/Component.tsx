import React from 'react'
import type { ExpertiseHighlightBlock as ExpertiseHighlightBlockType } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ArrowRightIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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

  // Формируем условия для запроса
  const whereConditions: any = {
    _status: {
      equals: 'published',
    },
  }

  // Если выбрана категория, добавляем фильтр
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
    <section className="py-32">
      <div className="container">
        {/* Заголовок секции */}
        <div className="mb-14">
          {categoryName && (
            <Badge className="mb-4" variant="outline">
              {categoryName}
            </Badge>
          )}
          <h2 className="mb-3 text-4xl font-semibold md:mb-4 md:text-5xl lg:mb-6">
            {heading}
          </h2>
          {subheading && (
            <p className="text-lg text-muted-foreground md:text-xl">{subheading}</p>
          )}
        </div>

        {/* Grid с постами */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              <a
                key={post.id}
                href={`/posts/${post.slug}`}
                className="flex flex-col overflow-clip rounded-xl border border-border bg-background"
              >
                {/* Изображение поста */}
                {metaImageUrl && (
                  <div>
                    <img
                      src={metaImageUrl}
                      alt={post.meta?.title || post.title || 'Post image'}
                      className="aspect-video size-full object-cover object-center"
                    />
                  </div>
                )}

                {/* Контент карточки */}
                <div className="flex flex-1 flex-col gap-4 p-6">
                  {/* Категории и дата */}
                  <div className="flex items-center justify-between gap-4">
                    {postCategories.length > 0 && (
                      <Badge variant="outline">{postCategories[0]}</Badge>
                    )}
                    {publishedDate && (
                      <span className="text-sm text-muted-foreground">{publishedDate}</span>
                    )}
                  </div>

                  {/* Заголовок */}
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-semibold">{post.title}</h3>
                    {/* Описание */}
                    {post.meta?.description && (
                      <p className="text-muted-foreground line-clamp-3">
                        {post.meta.description}
                      </p>
                    )}
                  </div>
                </div>
              </a>
            )
          })}
        </div>

        {/* CTA кнопка */}
        {ctaText && ctaLink && (
          <div className="mt-14 flex justify-center">
            <Button asChild>
              <a href={ctaLink}>
                {ctaText}
                <ArrowRightIcon className="ml-2 size-4" />
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
