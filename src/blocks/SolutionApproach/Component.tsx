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
    <section className="py-16">
      <div className="container">
        {heading && (
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-pretty text-3xl font-semibold md:text-4xl lg:text-5xl">{heading}</h2>
            {subheading && (
              <p className="text-muted-foreground mt-4 text-lg">{subheading}</p>
            )}
          </div>
        )}

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {steps?.map((step, idx) => {
            if (!step || typeof step !== 'object') return null

            return (
              <div className="flex flex-col" key={idx}>
                <div className="bg-accent mb-5 flex size-16 items-center justify-center rounded-full">
                  {getIcon(step.icon)}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            )
          })}
        </div>

        {buttonUrl && (
          <div className="mt-16 flex justify-center">
            <Button size="lg" asChild>
              <Link href={buttonUrl}>{buttonText || 'Узнать больше'}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
