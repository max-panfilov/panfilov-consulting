import type { Metadata } from 'next/types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    where: {
      _status: {
        equals: 'published',
      },
    },
    limit: 100,
    sort: '-publishedAt',
  })

  return (
    <section className="py-32">
      <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
        {/* Заголовок секции */}
        <div className="text-center">
          <Badge variant="secondary" className="mb-6">
            Наш блог
          </Badge>
          <h1 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            Блог
          </h1>
          <p className="text-muted-foreground mb-8 md:text-base lg:max-w-2xl lg:text-lg">
            Экспертные статьи о GenAI, лучшие практики внедрения и реальные примеры
            использования искусственного интеллекта в бизнесе.
          </p>
        </div>

        {/* Сетка с постами */}
        {posts.docs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {posts.docs.map((post) => {
              // Извлекаем изображение
              const metaImageUrl =
                typeof post.meta?.image === 'object' && post.meta.image?.url
                  ? post.meta.image.url
                  : null

              // Извлекаем категории
              const postCategories =
                Array.isArray(post.categories) && post.categories.length > 0
                  ? post.categories
                      .map((cat) => (typeof cat === 'object' ? cat.title : null))
                      .filter(Boolean)
                  : []

              // Форматируем дату
              const publishedDate = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : null

              return (
                <Card key={post.id} className="grid grid-rows-[auto_auto_1fr_auto] pt-0">
                  {/* Изображение */}
                  <div className="aspect-16/9 w-full">
                    <a
                      href={`/posts/${post.slug}`}
                      className="fade-in transition-opacity duration-200 hover:opacity-70"
                    >
                      {metaImageUrl ? (
                        <img
                          src={metaImageUrl}
                          alt={post.title}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground">Нет изображения</span>
                        </div>
                      )}
                    </a>
                  </div>

                  {/* Заголовок */}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {postCategories.length > 0 && (
                        <Badge variant="outline">{postCategories[0]}</Badge>
                      )}
                      {publishedDate && (
                        <span className="text-sm text-muted-foreground">{publishedDate}</span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold hover:underline md:text-xl">
                      <a href={`/posts/${post.slug}`}>{post.title}</a>
                    </h3>
                  </CardHeader>

                  {/* Описание */}
                  <CardContent>
                    {post.meta?.description && (
                      <p className="text-muted-foreground line-clamp-3">
                        {post.meta.description}
                      </p>
                    )}
                  </CardContent>

                  {/* Футер */}
                  <CardFooter>
                    <a
                      href={`/posts/${post.slug}`}
                      className="text-foreground flex items-center hover:underline"
                    >
                      Читать статью
                      <ArrowRight className="ml-2 size-4" />
                    </a>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Статьи скоро появятся</p>
          </div>
        )}
      </div>
    </section>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Блог | Panfilov Consulting',
    description:
      'Экспертные статьи о GenAI, лучшие практики внедрения и реальные примеры использования GenAI в бизнесе',
  }
}
