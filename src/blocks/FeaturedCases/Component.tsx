import React from 'react'
import type { FeaturedCasesBlock as FeaturedCasesBlockType, Case } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { FeaturedCasesClient } from './Component.client'

export const FeaturedCasesBlock: React.FC<FeaturedCasesBlockType> = async ({
  heading,
  subheading,
  casesToShow = 4,
  autoSelect = true,
  manualCases,
}) => {
  // Получаем Payload instance
  const payload = await getPayload({ config: configPromise })

  let cases: Case[] = []

  // Получаем кейсы в зависимости от настроек
  if (autoSelect) {
    // Автоматический выбор featured кейсов
    const result = await payload.find({
      collection: 'cases',
      where: {
        featured: {
          equals: true,
        },
        _status: {
          equals: 'published',
        },
      },
      limit: casesToShow || undefined,
      // Сортируем по настраиваемому порядку, затем по дате публикации (новые выше)
      sort: ['sortOrder', '-publishedAt'],
    })
    cases = result.docs
  } else if (manualCases && Array.isArray(manualCases)) {
    // Ручной выбор кейсов
    // Фильтруем только объекты (исключаем ID)
    cases = manualCases.filter((c): c is Case => typeof c === 'object') as Case[]
    // Ограничиваем количество
    cases = cases.slice(0, casesToShow || undefined)
  }

  // Если кейсов нет, не рендерим блок
  if (cases.length === 0) {
    return null
  }

  // Преобразуем кейсы в сериализуемый формат для передачи клиенту
  const serializedCases = cases.map(caseItem => ({
    id: caseItem.id,
    title: caseItem.title,
    slug: caseItem.slug,
    industry: caseItem.industry,
    shortDescription: caseItem.shortDescription,
    coverImage: typeof caseItem.coverImage === 'object' && caseItem.coverImage?.url
      ? caseItem.coverImage.url
      : null,
  }))

  return (
    <FeaturedCasesClient 
      heading={heading}
      subheading={subheading}
      cases={serializedCases}
    />
  )
}
