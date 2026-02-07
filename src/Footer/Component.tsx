import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import type { Footer as FooterType } from '@/payload-types'
import { FooterClient } from './Component.client'

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 1)()) as FooterType
  
  const logo = footerData?.logo || {
    src: '/logo.svg',
    alt: 'Panfilov Consulting',
    title: 'Panfilov Consulting',
  }
  
  const currentYear = new Date().getFullYear()
  const yearRange = `2025${currentYear > 2025 ? `–${currentYear}` : ''}`
  const baseCopyright =
    footerData?.copyright ||
    `© ${yearRange} Panfilov Consulting. Все права защищены.`
  // Нормализуем год или диапазон лет к формату 2025–<текущий>.
  const copyright = baseCopyright.replace(/\b\d{4}(?:\s*–\s*\d{4})?\b/, yearRange)

  // Данные формы обратной связи
  const contactFormHeading = footerData?.contactFormHeading
  const contactFormDescription = footerData?.contactFormDescription
  const contactForm = footerData?.contactForm

  return (
    <FooterClient
      logo={logo}
      copyright={copyright}
      contactFormHeading={contactFormHeading}
      contactFormDescription={contactFormDescription}
      contactForm={contactForm}
    />
  )
}
