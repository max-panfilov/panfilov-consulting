import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import type { Footer as FooterType } from '@/payload-types'
import { FooterClient } from './Component.client'

export async function Footer() {
  const footerData: FooterType = await getCachedGlobal('footer', 1)()
  
  const logo = footerData?.logo || {
    src: '/logo.svg',
    alt: 'Panfilov Consulting',
    title: 'Panfilov Consulting',
  }
  
  const tagline = footerData?.tagline || 'Профессиональные решения для вашего бизнеса'
  const menuItems = footerData?.menuItems || []
  const copyright = footerData?.copyright || `© ${new Date().getFullYear()} Panfilov Consulting. Все права защищены.`
  const bottomLinks = footerData?.bottomLinks || []

  return (
    <FooterClient
      logo={logo}
      tagline={tagline}
      menuItems={menuItems}
      copyright={copyright}
      bottomLinks={bottomLinks}
    />
  )
}
