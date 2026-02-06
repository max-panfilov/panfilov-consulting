'use client'

import React from 'react'
import type { TargetAudienceBlock as TargetAudienceBlockType } from '@/payload-types'
import {
  CircleHelp,
  TrendingUp,
  Zap,
  Code,
  Database,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// Маппинг иконок
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  Zap,
  Code,
  Database,
  CircleHelp,
}

export const TargetAudienceBlock: React.FC<TargetAudienceBlockType> = ({
  label,
  heading,
  subheading,
  audiences,
}) => {
  // Функция для получения иконки
  const getIcon = (iconName?: string | null) => {
    if (!iconName) {
      return <CircleHelp className="size-4 md:size-6" />
    }

    const Icon = iconMap[iconName]
    if (Icon) {
      return <Icon className="size-4 md:size-6" />
    }

    // Fallback на CircleHelp если иконка не найдена
    console.warn(`Icon "${iconName}" not found in iconMap`)
    return <CircleHelp className="size-4 md:size-6" />
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Заголовок секции */}
        {(label || heading) && (
          <div className="mb-10 md:mb-14 max-w-2xl">
            {label && <Badge variant="secondary" className="mb-3">{label}</Badge>}
            {heading && (
              <h2 className="text-pretty text-3xl font-semibold tracking-tight md:text-4xl">{heading}</h2>
            )}
            {subheading && <p className="text-muted-foreground mt-3 text-lg">{subheading}</p>}
          </div>
        )}

        {/* Grid с карточками аудиторий */}
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {audiences?.map((audience, idx) => {
            if (!audience || typeof audience !== 'object') return null

            return (
              <div className="flex gap-5" key={idx}>
                {/* Иконка */}
                <span className="bg-accent flex size-10 shrink-0 items-center justify-center rounded-lg md:size-11">
                  {getIcon(audience.icon)}
                </span>
                {/* Контент */}
                <div>
                  <h3 className="font-medium mb-1.5 md:text-lg">{audience.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                    {audience.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
