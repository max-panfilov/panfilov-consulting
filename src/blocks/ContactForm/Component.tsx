'use client'

import React from 'react'
import type { ContactFormBlock as ContactFormBlockType } from '@/payload-types'
import { FormBlock } from '@/blocks/Form/Component'
import { motion } from 'framer-motion'

export const ContactFormBlock: React.FC<ContactFormBlockType> = ({
  heading,
  description,
  form,
  htmlId = 'form',
}) => {
  return (
    <section className="container py-16" id={htmlId || undefined}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto max-w-3xl"
      >
        {/* Заголовок и описание */}
        <div className="mb-8 text-center">
          {heading && (
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              {heading}
            </h2>
          )}

          {description && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Карточка с формой */}
        <div className="bg-card border border-border rounded-lg p-6 md:p-8">
          {typeof form === 'object' && <FormBlock form={form as any} enableIntro={false} />}
        </div>
      </motion.div>
    </section>
  )
}
