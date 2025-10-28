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
    <section className="py-32" id={`block-${id}`}>
      <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
        {introContent && (
          <div className="text-center">
            <RichText className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl" data={introContent} enableGutter={false} />
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map((item) => {
            const href = `/${collectionSlug}/${item.slug}`
            // Получаем изображение для поста или кейса
            const image = relationTo === 'cases' 
              ? (item as Case).coverImage 
              : (item as Post).meta?.image
            
            return (
              <Card
                key={item.id}
                className="grid grid-rows-[auto_auto_1fr_auto] overflow-hidden pt-0"
              >
                <div className="aspect-16/9 w-full">
                  <Link
                    href={href}
                    className="fade-in transition-opacity duration-200 hover:opacity-70"
                  >
                    {image && typeof image === 'object' ? (
                      <Media
                        resource={image}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600" />
                    )}
                  </Link>
                </div>
                <CardHeader>
                  <h3 className="text-lg font-semibold hover:underline md:text-xl">
                    <Link href={href}>
                      {item.title}
                    </Link>
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {item.meta?.description || ''}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link
                    href={href}
                    className="text-foreground flex items-center hover:underline"
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
