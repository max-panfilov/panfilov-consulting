'use client'

import React from 'react'
import type { SolutionApproachBlock as SolutionApproachBlockType } from '@/payload-types'
import * as LucideIcons from 'lucide-react'
import { Button } from '@/components/ui/button'

export const SolutionApproachBlock: React.FC<SolutionApproachBlockType> = ({
  heading,
  subheading,
  steps,
  buttonText,
  buttonUrl,
}) => {
  // Функция для динамической загрузки иконки Lucide по имени
  const getIcon = (iconName?: string | null) => {
    if (!iconName) {
      const CircleHelp = LucideIcons.CircleHelp
      return <CircleHelp className="size-6" />
    }

    // Динамический доступ к иконкам Lucide
    const Icon = (LucideIcons as any)[iconName]
    if (Icon && typeof Icon === 'function') {
      return <Icon className="size-6" />
    }

    // Fallback на CircleHelp если иконка не найдена
    const CircleHelp = LucideIcons.CircleHelp
    return <CircleHelp className="size-6" />
  }

  return (
    <section className="py-16">
      <div className="container">
        {/* Заголовок секции */}
        {heading && (
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-pretty text-4xl font-medium lg:text-5xl">{heading}</h2>
            {subheading && (
              <p className="text-muted-foreground mt-4 text-lg">{subheading}</p>
            )}
          </div>
        )}

        {/* Grid с этапами/фичами */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {steps?.map((step, idx) => {
            if (!step || typeof step !== 'object') return null

            return (
              <div className="flex flex-col" key={idx}>
                {/* Иконка */}
                <div className="bg-accent mb-5 flex size-16 items-center justify-center rounded-full">
                  {getIcon(step.icon)}
                </div>
                {/* Контент */}
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            )
          })}
        </div>

        {/* CTA кнопка */}
        {buttonUrl && (
          <div className="mt-16 flex justify-center">
            <Button size="lg" asChild>
              <a href={buttonUrl}>{buttonText || 'Узнать больше'}</a>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
