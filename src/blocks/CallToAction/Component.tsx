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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-2xl border-2 border-blue-500/20 p-8 md:p-12 flex flex-col gap-8 md:flex-row md:justify-between md:items-center overflow-hidden shadow-2xl"
      >
        {/* Декоративный градиентный оверлей */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
        
        {/* Контент */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-[48rem] flex items-center relative z-10 text-white"
        >
          {richText && (
            <div className="prose prose-invert max-w-none">
              <RichText className="mb-0 [&_*]:text-white" data={richText} enableGutter={false} />
            </div>
          )}
        </motion.div>
        
        {/* Кнопки CTA с анимацией */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 relative z-10"
        >
          {(links || []).map(({ link }, i) => {
            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CMSLink 
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  size="lg" 
                  {...link} 
                />
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>
    </div>
  )
}
