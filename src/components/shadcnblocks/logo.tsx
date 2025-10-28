import React from 'react'
import { cn } from '@/utilities/ui'

interface LogoProps {
  url?: string
  children: React.ReactNode
  className?: string
}

export const Logo: React.FC<LogoProps> = ({ url = '/', children, className }) => {
  return (
    <a href={url} className={cn('flex items-center gap-2', className)}>
      {children}
    </a>
  )
}

interface LogoImageProps {
  src: string
  alt: string
  title?: string
  className?: string
  darkSrc?: string // Опциональная версия для тёмной темы
}

export const LogoImage: React.FC<LogoImageProps> = ({ src, alt, title, className, darkSrc }) => {
  return (
    <>
      {/* Логотип для светлой темы */}
      <img 
        src={src} 
        alt={alt} 
        title={title} 
        className={cn('h-8 block dark:hidden', className)} 
      />
      {/* Логотип для тёмной темы */}
      <img 
        src={darkSrc || src} 
        alt={alt} 
        title={title} 
        className={cn('h-8 hidden dark:block', className)} 
      />
    </>
  )
}

interface LogoTextProps {
  children: React.ReactNode
  className?: string
}

export const LogoText: React.FC<LogoTextProps> = ({ children, className }) => {
  return <span className={cn('font-semibold', className)}>{children}</span>
}
