import React from 'react'
import type { HeroHomeBlock as HeroHomeBlockType } from '@/payload-types'

export const HeroHomeBlock: React.FC<HeroHomeBlockType> = ({
  heading,
  subheading,
  primaryCTA,
  secondaryCTA,
  mediaType,
  backgroundImage,
  backgroundVideo,
  backgroundOverlay,
}) => {
  // Функция для определения типа медиа объекта
  const getMediaUrl = (media: any): string | null => {
    if (!media) return null
    if (typeof media === 'string') return media
    return media.url || null
  }

  const bgImageUrl = getMediaUrl(backgroundImage)
  const bgVideoUrl = getMediaUrl(backgroundVideo)

  return (
    <div className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex items-center overflow-hidden">
      {/* Фоновое медиа */}
      {mediaType === 'video' && bgVideoUrl ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={bgVideoUrl} type="video/mp4" />
        </video>
      ) : mediaType === 'image' && bgImageUrl ? (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImageUrl})` }}
        />
      ) : (
        // Градиентный фон по умолчанию если медиа не указано
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800" />
      )}

      {/* Оверлей для затемнения */}
      {backgroundOverlay && (
        <div className="absolute inset-0 bg-black/50" />
      )}

      {/* Контент */}
      <div className="container relative z-10">
        <div className="max-w-4xl">
          {/* Заголовок */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
            {heading}
          </h1>

          {/* Подзаголовок */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-100 mb-8 max-w-3xl leading-relaxed">
            {subheading}
          </p>

          {/* Кнопки CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            {primaryCTA?.text && primaryCTA?.link && (
              <a
                href={primaryCTA.link}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                {primaryCTA.text}
              </a>
            )}

            {secondaryCTA?.text && secondaryCTA?.link && (
              <a
                href={secondaryCTA.link}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white hover:bg-white hover:text-blue-600 rounded-lg transition-colors"
              >
                {secondaryCTA.text}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Декоративный элемент внизу (волна) */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 md:h-24"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            className="fill-white dark:fill-gray-950"
          />
        </svg>
      </div>
    </div>
  )
}
