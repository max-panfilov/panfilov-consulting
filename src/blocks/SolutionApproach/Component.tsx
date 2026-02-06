'use client'

import React from 'react'
import type { SolutionApproachBlock as SolutionApproachBlockType } from '@/payload-types'
import {
  CircleHelp,
  TrendingUp,
  Settings,
  GraduationCap,
  Lightbulb,
  Zap,
  Code,
  Database,
  BarChart3,
  Brain,
  Cog,
  Shield,
  Rocket,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const iconMap: Record<string, LucideIcon> = {
  CircleHelp,
  TrendingUp,
  Settings,
  GraduationCap,
  Lightbulb,
  Zap,
  Code,
  Database,
  BarChart3,
  Brain,
  Cog,
  Shield,
  Rocket,
  Target,
  Users,
}

export const SolutionApproachBlock: React.FC<SolutionApproachBlockType> = ({
  heading,
  subheading,
  steps,
  buttonText,
  buttonUrl,
}) => {
  const getIcon = (iconName?: string | null) => {
    if (!iconName) {
      return <CircleHelp className="size-6" />
    }

    const Icon = iconMap[iconName]
    if (Icon) {
      return <Icon className="size-6" />
    }

    return <CircleHelp className="size-6" />
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {heading && (
          <div className="mb-12 md:mb-16 max-w-2xl">
            <h2 className="text-pretty text-3xl font-semibold tracking-tight md:text-4xl">{heading}</h2>
            {subheading && (
              <p className="text-muted-foreground mt-4 text-lg">{subheading}</p>
            )}
          </div>
        )}

        <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {steps?.map((step, idx) => {
            if (!step || typeof step !== 'object') return null

            return (
              <div className="flex flex-col" key={idx}>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  {getIcon(step.icon)}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            )
          })}
        </div>

        {buttonUrl && (
          <div className="mt-12 md:mt-16">
            <Button size="lg" asChild>
              <Link href={buttonUrl}>{buttonText || 'Узнать больше'}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
