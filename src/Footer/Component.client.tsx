'use client'

import Link from 'next/link'
import React from 'react'
import { Logo, LogoImage } from '@/components/shadcnblocks/logo'
import { FormBlock } from '@/blocks/Form/Component'
import { motion } from 'framer-motion'
import type { Form } from '@/payload-types'
import { Send, Mail } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

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
  const requisites = {
    name: 'ООО «Панфилов Диджитал»',
    address: 'Москва, Комсомольский пр-т 42с1',
    inn: 'ИНН 7706818190',
  }

  return (
    <>
      {/* Форма обратной связи остается ближе к основному контенту */}
      {contactForm && typeof contactForm === 'object' && (
        <section className="pt-2 pb-40 md:pt-2 md:pb-40">
          <div className="container">
            <motion.div
              id="form"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, amount: 0.15 }}
              className="mx-auto max-w-3xl"
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
          </div>
        </section>
      )}

      {/* Визуально отделяем нижний футер от контента */}
      <section className="pt-12 pb-10 border-t-2 border-border/80 bg-muted/20 md:pt-14 md:pb-12">
        <div className="container">
          <footer>
            {/* Трёхколоночная сетка футера */}
            <div className="grid gap-10 md:grid-cols-3">
            <div className="space-y-5">
              {/* Лого и копирайт в левой колонке */}
              <Logo url="/" className="inline-flex">
                <LogoImage
                  src={logo.src}
                  darkSrc="/logo-dark.svg"
                  alt={logo.alt}
                  title={logo.title}
                  className="h-5"
                />
              </Logo>
              <p className="text-sm text-muted-foreground">{copyright}</p>
            </div>

            <div className="grid gap-6 text-sm text-muted-foreground md:grid-cols-2">
              {/* Список ключевых страниц */}
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="transition-colors hover:text-foreground">Главная</Link>
                </li>
                <li>
                  <Link href="/cases" className="transition-colors hover:text-foreground">Кейсы</Link>
                </li>
                <li>
                  <Link href="/posts" className="transition-colors hover:text-foreground">Блог</Link>
                </li>
              </ul>

              {/* Каналы связи остаются прежними */}
              <ul className="space-y-2">
                <li>
                  <Link
                    href="https://t.me/mpanfilov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 transition-colors hover:text-foreground"
                    aria-label="Telegram"
                  >
                    <Send className="w-4 h-4" />
                    <span>Telegram</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="mailto:contact@panfilov.consulting"
                    className="flex items-center gap-2 transition-colors hover:text-foreground"
                    aria-label="Email"
                  >
                    <Mail className="w-4 h-4" />
                    <span>E-mail</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              {/* Полный блок реквизитов для десктопа */}
              <div className="hidden text-sm text-muted-foreground md:block">
                <p className="font-medium text-foreground">{requisites.name}</p>
                <p className="mt-2 leading-relaxed">{requisites.address}</p>
                <p className="mt-2">{requisites.inn}</p>
              </div>
              {/* На мобилках реквизиты раскрываются в аккордеоне */}
              <div className="md:hidden">
                <Accordion type="single" collapsible>
                  <AccordionItem value="requisites">
                    <AccordionTrigger className="text-sm">Показать реквизиты</AccordionTrigger>
                    <AccordionContent>
                      <p className="font-medium text-foreground">{requisites.name}</p>
                      <p className="mt-2 leading-relaxed">{requisites.address}</p>
                      <p className="mt-2">{requisites.inn}</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
            </div>
          </footer>
        </div>
      </section>
    </>
  )
}
