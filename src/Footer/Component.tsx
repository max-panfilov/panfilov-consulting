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
  
  const copyright = footerData?.copyright || `© ${new Date().getFullYear()} Panfilov Consulting. Все права защищены.`

  return (
    <FooterClient
      logo={logo}
      copyright={copyright}
    />
  )
}
