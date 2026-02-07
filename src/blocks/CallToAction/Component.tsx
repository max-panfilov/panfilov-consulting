'use client'

import React from 'react'
import type { CallToActionBlock as CTABlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { motion } from 'framer-motion'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <div className="container my-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true, amount: 0.15 }}
        className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 lg:p-16 flex flex-col gap-8 md:flex-row md:justify-between md:items-center"
      >
        {/* Контент */}
        <div className="max-w-[48rem] flex items-center">
          {richText && (
            <div className="prose prose-invert max-w-none">
              <RichText className="mb-0 [&_*]:text-primary-foreground" data={richText} enableGutter={false} />
            </div>
          )}
        </div>

        {/* Кнопки CTA */}
        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
          {(links || []).map(({ link }, i) => {
            return (
              <CMSLink
                key={i}
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-md transition-all duration-200 hover:-translate-y-px active:translate-y-0"
                size="lg"
                {...link}
              />
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
