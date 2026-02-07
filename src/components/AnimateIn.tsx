'use client'

import React from 'react'
import { motion } from 'framer-motion'

type AnimateInProps = {
  children: React.ReactNode
  className?: string
  /** Delay in seconds */
  delay?: number
  as?: 'div' | 'section'
}

export const AnimateIn: React.FC<AnimateInProps> = ({
  children,
  className,
  delay = 0,
  as = 'div',
}) => {
  const Component = as === 'section' ? motion.section : motion.div

  return (
    <Component
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </Component>
  )
}
