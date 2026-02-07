'use client'

import React from 'react'
import type { HeroHomeBlock as HeroHomeBlockType } from '@/payload-types'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const NeuralNetworkScene = dynamic(
  () => import('@/components/NeuralNetworkScene').then((mod) => mod.NeuralNetworkScene),
  { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-muted rounded-md" /> },
)

export const HeroHomeBlock: React.FC<HeroHomeBlockType> = ({
  heading,
  subheading,
  primaryCTA,
  secondaryCTA,
  mediaType,
  backgroundImage,
  backgroundVideo,
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

  const getMediaUrl = (media: HeroHomeBlockType['backgroundImage']): string | null => {
    if (!media) return null
    if (typeof media === 'number' || typeof media === 'string') return null
    return media.url || null
  }

  const bgImageUrl = getMediaUrl(backgroundImage)
  const bgVideoUrl = getMediaUrl(backgroundVideo)

  return (
    <section className="pt-0 pb-16 md:pb-24 -mt-12 md:-mt-8">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            {/* Заголовок */}
            <h1 className="my-6 text-pretty text-4xl font-semibold tracking-tight lg:text-5xl xl:text-6xl">
              {heading}
            </h1>

            {/* Подзаголовок */}
            <p className="text-muted-foreground mb-8 max-w-xl lg:text-lg">
              {subheading}
            </p>

            {/* Кнопки CTA */}
            <div className="flex w-full flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              {primaryCTA?.text && primaryCTA?.link && (
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a
                    href={primaryCTA.link}
                    onClick={(e) => scrollToElement(e, primaryCTA.link)}
                  >
                    {primaryCTA.text}
                  </a>
                </Button>
              )}
              {secondaryCTA?.text && secondaryCTA?.link && (
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
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
          </motion.div>

          {/* 3D Neural Network Animation или видео/изображение */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
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
              <div className="relative max-h-96 w-full aspect-video">
                <Image
                  src={bgImageUrl}
                  alt={heading || 'Hero image'}
                  fill
                  className="rounded-md object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            ) : (
              // 3D анимация нейронной сети вместо placeholder изображения
              <div className="relative h-96 w-full rounded-md overflow-hidden">
                <NeuralNetworkScene />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
