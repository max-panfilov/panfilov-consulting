'use client'

import Link from 'next/link'
import React from 'react'
import { Logo, LogoImage } from '@/components/shadcnblocks/logo'
import { FormBlock } from '@/blocks/Form/Component'
import { motion } from 'framer-motion'
import type { Form } from '@/payload-types'
import { Send, Mail } from 'lucide-react'

type FooterClientProps = {
  logo: {
    src: string
    alt: string
    title: string
  }
  copyright: string
  contactFormHeading?: string | null
  contactFormDescription?: string | null
  contactForm?: string | number | Form | null
}

export const FooterClient: React.FC<FooterClientProps> = ({ 
  logo, 
  copyright,
  contactFormHeading,
  contactFormDescription,
  contactForm,
}) => {
  return (
    <section className="pt-0 pb-8 md:pt-8">
      <div className="container">
        <footer>
          {/* Форма обратной связи */}
          {contactForm && typeof contactForm === 'object' && (
            <motion.div
              id="form"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mx-auto max-w-3xl mb-16"
            >
              {/* Заголовок и описание */}
              <div className="mb-8 text-center">
                {contactFormHeading && (
                  <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                    {contactFormHeading}
                  </h2>
                )}

                {contactFormDescription && (
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    {contactFormDescription}
                  </p>
                )}
              </div>

              {/* Карточка с формой */}
              <div className="bg-card border border-border rounded-lg p-6 md:p-8">
                <FormBlock form={contactForm as any} enableIntro={false} />
              </div>
            </motion.div>
          )}

          {/* Логотип по центру */}
          <div className="flex justify-center mb-6">
            <Logo url="/">
              <LogoImage
                src={logo.src}
                darkSrc="/logo-dark.svg"
                alt={logo.alt}
                title={logo.title}
                className="h-5"
              />
            </Logo>
          </div>

          {/* Навигационные ссылки по центру */}
          <div className="flex justify-center mb-6">
            <ul className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">Главная</Link>
              </li>
              <li>
                <Link href="/cases" className="transition-colors hover:text-foreground">Кейсы</Link>
              </li>
              <li>
                <Link href="/posts" className="transition-colors hover:text-foreground">Блог</Link>
              </li>
              <li>
                <Link
                  href="https://t.me/mpanfilov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 transition-colors hover:text-foreground"
                  aria-label="Telegram"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden md:inline">Telegram</span>
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:contact@panfilov.consulting"
                  className="flex items-center gap-1 transition-colors hover:text-foreground"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                  <span className="hidden md:inline">E-mail</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Копирайт */}
          <div className="text-muted-foreground flex flex-col items-center gap-3 border-t pt-6 text-sm">
            <p className="text-center">{copyright}</p>
          </div>
        </footer>
      </div>
    </section>
  )
}
