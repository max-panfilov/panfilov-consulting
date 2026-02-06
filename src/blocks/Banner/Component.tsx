'use client'

import type { BannerBlock as BannerBlockProps } from 'src/payload-types'
import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  return (
    <div className={cn('mx-auto my-8 w-full', className)}>
      <div
        className={cn('border-l-2 py-4 px-6 flex items-start rounded-md', {
          'border-border bg-muted text-foreground': style === 'info',
          'border-error bg-error/10 text-foreground': style === 'error',
          'border-success bg-success/10 text-foreground': style === 'success',
          'border-warning bg-warning/10 text-foreground': style === 'warning',
        })}
      >
        <div className="flex-1">
          <RichText data={content} enableGutter={false} enableProse={false} />
        </div>
      </div>
    </div>
  )
}
