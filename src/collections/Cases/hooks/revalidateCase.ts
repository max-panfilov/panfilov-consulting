import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Case } from '../../../payload-types'

// Хук для ревалидации после изменения кейса
export const revalidateCase: CollectionAfterChangeHook<Case> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/cases/${doc.slug}`

      payload.logger.info(`Revalidating case at path: ${path}`)

      // Ревалидируем страницу конкретного кейса
      revalidatePath(path)
      
      // Ревалидируем главную страницу, если кейс отмечен как featured
      if (doc.featured) {
        payload.logger.info(`Revalidating home page for featured case`)
        revalidatePath('/')
      }
      
      // Ревалидируем тег для sitemap
      revalidateTag('cases-sitemap')
    }

    // Если кейс был опубликован ранее, ревалидируем старый путь
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/cases/${previousDoc.slug}`

      payload.logger.info(`Revalidating unpublished case at path: ${oldPath}`)

      revalidatePath(oldPath)
      
      // Если кейс был featured, ревалидируем главную
      if (previousDoc.featured) {
        revalidatePath('/')
      }
      
      revalidateTag('cases-sitemap')
    }
    
    // Если изменился статус featured, ревалидируем главную страницу
    if (
      doc._status === 'published' &&
      previousDoc?.featured !== doc.featured
    ) {
      payload.logger.info(`Featured status changed, revalidating home page`)
      revalidatePath('/')
    }
  }
  return doc
}

// Хук для ревалидации после удаления кейса
export const revalidateDelete: CollectionAfterDeleteHook<Case> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/cases/${doc?.slug}`
    revalidatePath(path)
    
    // Если удаленный кейс был featured, ревалидируем главную
    if (doc?.featured) {
      revalidatePath('/')
    }
    
    revalidateTag('cases-sitemap')
  }

  return doc
}
