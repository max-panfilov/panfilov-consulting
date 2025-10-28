'use client'

import Link from 'next/link'
import React from 'react'
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
  copyright: string
}

export const FooterClient: React.FC<FooterClientProps> = ({ logo, copyright }) => {
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
