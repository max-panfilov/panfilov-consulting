'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

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
  const prefersReducedMotion = useReducedMotion()
  const Component = as === 'section' ? motion.section : motion.div

  if (prefersReducedMotion) {
    const Tag = as === 'section' ? 'section' : 'div'
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <Component
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, amount: 0.15 }}
      className={className}
    >
      {children}
    </Component>
  )
}
