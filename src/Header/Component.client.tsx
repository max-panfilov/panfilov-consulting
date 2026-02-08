'use client'

import Link from 'next/link'
import React from 'react'
import type { Header } from '@/payload-types'
import { Logo } from '@/components/Logo/Logo'
import { Button } from '@/components/ui/button'
import { Send, Mail } from 'lucide-react'

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
          <div className="flex items-center gap-6 md:gap-10">
            {/* Группа 1: пункты меню */}
            <div className="flex items-center gap-6">
              <Link
                href="/cases"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Кейсы
              </Link>
              <Link
                href="/posts"
                className="hidden md:block text-sm font-medium hover:text-primary transition-colors"
              >
                Блог
              </Link>
            </div>

            {/* Группа 2: Telegram и Email */}
            <div className="flex items-center gap-5">
              <Link
                href="https://t.me/mpanfilov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </Link>
              <Link
                href="mailto:contact@panfilov.consulting"
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </Link>
            </div>

            {/* Группа 3: CTA (скрыта на мобильных устройствах - она есть в hero блоке) */}
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
