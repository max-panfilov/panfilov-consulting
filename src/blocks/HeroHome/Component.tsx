'use client'

import React from 'react'
import type { HeroHomeBlock as HeroHomeBlockType } from '@/payload-types'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NeuralNetworkScene } from '@/components/NeuralNetworkScene'

export const HeroHomeBlock: React.FC<HeroHomeBlockType> = ({
  badge,
  heading,
  subheading,
  primaryCTA,
  secondaryCTA,
  mediaType,
  backgroundImage,
  backgroundVideo,
  backgroundOverlay,
}) => {
  // Функция для плавной прокрутки к элементу
  const scrollToElement = (e: React.MouseEvent<HTMLAnchorElement>, href?: string | null) => {
    if (!href) return
    // Проверяем, является ли это якорной ссылкой (начинается с #)
    if (href.startsWith('#')) {
      e.preventDefault()
      const targetId = href.substring(1)
      const targetElement = document.getElementById(targetId)
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }
  }

  // Функция для определения типа медиа объекта
  const getMediaUrl = (media: any): string | null => {
    if (!media) return null
    if (typeof media === 'string') return media
    return media.url || null
  }

  const bgImageUrl = getMediaUrl(backgroundImage)
  const bgVideoUrl = getMediaUrl(backgroundVideo)

  return (
    <section className="pt-0 pb-16 md:pb-32 -mt-12 md:-mt-8">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* Заголовок */}
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
              {heading}
            </h1>

            {/* Подзаголовок */}
            <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
              {subheading}
            </p>

            {/* Кнопки CTA */}
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {primaryCTA?.text && primaryCTA?.link && (
                <Button asChild className="w-full sm:w-auto">
                  <a 
                    href={primaryCTA.link}
                    onClick={(e) => scrollToElement(e, primaryCTA.link)}
                  >
                    {primaryCTA.text}
                  </a>
                </Button>
              )}
              {secondaryCTA?.text && secondaryCTA?.link && (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a 
                    href={secondaryCTA.link}
                    onClick={(e) => scrollToElement(e, secondaryCTA.link)}
                  >
                    {secondaryCTA.text}
                    <ArrowRight className="ml-2 size-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* 3D Neural Network Animation или видео/изображение */}
          {mediaType === 'video' && bgVideoUrl ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="max-h-96 w-full rounded-md object-cover"
            >
              <source src={bgVideoUrl} type="video/mp4" />
            </video>
          ) : bgImageUrl ? (
            <img
              src={bgImageUrl}
              alt={heading || 'Hero image'}
              className="max-h-96 w-full rounded-md object-cover"
            />
          ) : (
            // 3D анимация нейронной сети вместо placeholder изображения
            <div className="relative h-96 w-full rounded-md overflow-hidden">
              <NeuralNetworkScene />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
