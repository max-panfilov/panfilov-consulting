'use client'

import Link from 'next/link'
import React from 'react'
import type { Header } from '@/payload-types'
import { Logo } from '@/components/Logo/Logo'
import { Button } from '@/components/ui/button'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = () => {
  // Обработчик плавного скролла к форме
  const handleScrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const formElement = document.getElementById('form')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="pt-8 pb-0">
      <div className="container">
        <nav className="flex items-center justify-between">
          {/* Логотип слева */}
          <Link href="/" className="flex items-center">
            <Logo loading="eager" priority="high" />
          </Link>

          {/* Меню справа */}
          <div className="flex items-center gap-6">
            <Link
              href="/cases"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Кейсы
            </Link>
            <Link
              href="/posts"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Блог
            </Link>
            {/* CTA кнопка скрыта на мобильных устройствах - она есть в hero блоке */}
            <Link href="/#form" onClick={handleScrollToForm}>
              <Button size="sm" className="hidden md:inline-flex">
                Связаться
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </section>
  )
}
