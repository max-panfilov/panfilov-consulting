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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                  'md:col-span-2': size !== 'full',
                })}
                key={index}
              >
                <div className="relative">
                  {/* Декоративная линия слева */}
                  {richText && (
                    <div className="border-l-2 border-blue-500/20 pl-6 py-2">
                      <RichText data={richText} enableGutter={false} />
                    </div>
                  )}

                  {enableLink && (
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="mt-4"
                    >
                      <CMSLink 
                        className="inline-flex items-center font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        {...link} 
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
      </div>
    </div>
  )
}
