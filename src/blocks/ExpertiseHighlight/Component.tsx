import React from 'react'
import type { ExpertiseHighlightBlock as ExpertiseHighlightBlockType, Post } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

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

  return (
    <div className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        {/* Заголовок секции */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{heading}</h2>
          {subheading && (
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {subheading}
            </p>
          )}
        </div>

        {/* Grid с постами */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

            return (
              <article
                key={post.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400"
              >
                {/* Изображение поста */}
                {metaImageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={metaImageUrl}
                      alt={post.meta?.title || post.title || 'Post image'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Оверлей */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}

                {/* Контент карточки */}
                <div className="p-6">
                  {/* Дата публикации */}
                  {publishedDate && (
                    <time className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {publishedDate}
                    </time>
                  )}

                  {/* Заголовок */}
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Описание */}
                  {post.meta?.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {post.meta.description}
                    </p>
                  )}

                  {/* Кнопка "Читать далее" */}
                  <a
                    href={`/posts/${post.slug}`}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Читать далее
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>
              </article>
            )
          })}
        </div>

        {/* CTA кнопка */}
        {ctaText && ctaLink && (
          <div className="text-center mt-12">
            <a
              href={ctaLink}
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              {ctaText}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
