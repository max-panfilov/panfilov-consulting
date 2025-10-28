'use client'

import React from 'react'
import type { Footer } from '@/payload-types'
import { Logo, LogoImage } from '@/components/shadcnblocks/logo'

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
  tagline: string
  menuItems: MenuItem[]
  copyright: string
  bottomLinks: {
    text: string
    url: string
  }[]
}

export const FooterClient: React.FC<FooterClientProps> = ({
  logo,
  tagline,
  menuItems,
  copyright,
  bottomLinks,
}) => {
  return (
    <section className="py-8">
      <div className="container">
        <footer>
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
                <a href="/">Главная</a>
              </li>
              <li className="hover:text-primary">
                <a href="/cases">Кейсы</a>
              </li>
              <li className="hover:text-primary">
                <a href="/posts">Блог</a>
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
