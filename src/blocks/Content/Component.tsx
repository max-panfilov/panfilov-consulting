'use client'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'
import type { ContentBlock as ContentBlockProps } from '@/payload-types'
import { CMSLink } from '../../components/Link'
import { motion } from 'framer-motion'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className="container my-16">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                viewport={{ once: true, amount: 0.15 }}
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                  'md:col-span-2': size !== 'full',
                })}
                key={index}
              >
                <div className="relative">
                  {richText && (
                    <div className="border-l-2 border-border pl-6 py-2">
                      <RichText data={richText} enableGutter={false} />
                    </div>
                  )}

                  {enableLink && (
                    <div className="mt-4">
                      <CMSLink
                        className="inline-flex items-center font-medium text-foreground hover:text-muted-foreground transition-colors"
                        {...link}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
      </div>
    </div>
  )
}
