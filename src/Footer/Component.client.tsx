'use client'

import Link from 'next/link'
import React from 'react'
import { Logo, LogoImage } from '@/components/shadcnblocks/logo'
import { FormBlock } from '@/blocks/Form/Component'
import { motion } from 'framer-motion'
import type { Form } from '@/payload-types'

interface MenuItem {
  title: string
  links: {
    text: string
    url: string
  }[]
}

type FooterClientProps = {
  logo: {
    src: string
    alt: string
    title: string
  }
  copyright: string
  contactFormHeading?: string | null
  contactFormDescription?: string | null
  contactForm?: string | Form | null
}

export const FooterClient: React.FC<FooterClientProps> = ({ 
  logo, 
  copyright,
  contactFormHeading,
  contactFormDescription,
  contactForm,
}) => {
  return (
    <section className="py-8">
      <div className="container">
        <footer>
          {/* Форма обратной связи */}
          {contactForm && typeof contactForm === 'object' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mx-auto max-w-3xl mb-16"
            >
              {/* Заголовок и описание */}
              <div className="mb-8 text-center">
                {contactFormHeading && (
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
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
              <div className="bg-card rounded-lg shadow-md p-6 md:p-8">
                <FormBlock form={contactForm as Form} enableIntro={false} />
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

          {/* Три ссылки по центру */}
          <div className="flex justify-center mb-6">
            <ul className="flex gap-8 text-sm font-medium">
              <li className="hover:text-primary">
                <Link href="/">Главная</Link>
              </li>
              <li className="hover:text-primary">
                <Link href="/cases">Кейсы</Link>
              </li>
              <li className="hover:text-primary">
                <Link href="/posts">Блог</Link>
              </li>
            </ul>
          </div>

          {/* Копирайт по центру */}
          <div className="text-muted-foreground flex flex-col items-center gap-3 border-t pt-6 text-sm font-medium">
            <p className="text-center">{copyright}</p>
          </div>
        </footer>
      </div>
    </section>
  )
}
