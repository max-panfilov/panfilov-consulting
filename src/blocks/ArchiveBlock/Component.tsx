import type { Post, Case, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Media } from '@/components/Media'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, categories, introContent, limit: limitFromProps, populateBy, relationTo, selectedDocs } = props

  const limit = limitFromProps || 3

  let posts: Post[] = []
  let cases: Case[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    // Загружаем данные в зависимости от выбранной коллекции
    if (relationTo === 'posts') {
      const fetchedPosts = await payload.find({
        collection: 'posts',
        depth: 1,
        limit,
        ...(flattenedCategories && flattenedCategories.length > 0
          ? {
              where: {
                categories: {
                  in: flattenedCategories,
                },
              },
            }
          : {}),
      })
      posts = fetchedPosts.docs
    } else if (relationTo === 'cases') {
      const fetchedCases = await payload.find({
        collection: 'cases',
        depth: 1,
        limit,
      })
      cases = fetchedCases.docs
    }
  } else {
    if (selectedDocs?.length) {
      // Разделяем выбранные документы по типу коллекции
      selectedDocs.forEach((doc) => {
        if (typeof doc.value === 'object') {
          if (doc.relationTo === 'posts') {
            posts.push(doc.value as Post)
          } else if (doc.relationTo === 'cases') {
            cases.push(doc.value as Case)
          }
        }
      })
    }
  }

  const items = relationTo === 'cases' ? cases : posts
  const collectionSlug = relationTo === 'cases' ? 'cases' : 'posts'

  return (
    <section className="py-16 md:py-24" id={`block-${id}`}>
      <div className="container">
        {introContent && (
          <div className="mb-10 md:mb-14 max-w-2xl">
            <RichText className="text-pretty text-3xl font-semibold tracking-tight md:text-4xl" data={introContent} enableGutter={false} />
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map((item) => {
            const href = `/${collectionSlug}/${item.slug}`
            const image = relationTo === 'cases'
              ? (item as Case).coverImage
              : (item as Post).meta?.image

            return (
              <Card
                key={item.id}
                className="group grid grid-rows-[auto_auto_1fr_auto] overflow-hidden pt-0 transition-colors hover:bg-card"
              >
                <div className="aspect-16/9 w-full overflow-hidden">
                  <Link
                    href={href}
                    className="block h-full transition-transform duration-300 group-hover:scale-[1.02]"
                  >
                    {image && typeof image === 'object' ? (
                      <Media
                        resource={image}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted" />
                    )}
                  </Link>
                </div>
                <CardHeader>
                  <h3 className="text-lg font-semibold md:text-xl">
                    <Link href={href}>
                      {item.title}
                    </Link>
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.meta?.description || ''}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link
                    href={href}
                    className="text-foreground flex items-center text-sm font-medium hover:text-muted-foreground transition-colors"
                  >
                    Читать далее
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
