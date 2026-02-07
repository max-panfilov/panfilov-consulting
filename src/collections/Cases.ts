import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { generatePreviewPath } from '../utilities/generatePreviewPath'
import { revalidateCase, revalidateDelete } from './Cases/hooks/revalidateCase'
import { INDUSTRY_OPTIONS } from '../utilities/getIndustryLabel'
import { caseRichTextEditor } from '../fields/richTextEditor'
import { seoTab } from '../fields/seoTab'
import { slugField } from 'payload'

export const Cases: CollectionConfig<'cases'> = {
  slug: 'cases',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateCase],
    afterDelete: [revalidateDelete],
  },
  defaultPopulate: {
    title: true,
    slug: true,
    industry: true,
    shortDescription: true,
    coverImage: true,
    featured: true,
  },
  admin: {
    defaultColumns: ['sortOrder', 'title', 'industry', 'featured', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'cases',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'cases',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Название кейса',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Контент',
          fields: [
            {
              name: 'industry',
              type: 'select',
              required: true,
              label: 'Отрасль',
              options: INDUSTRY_OPTIONS,
            },
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Изображение для превью',
              required: true,
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              required: true,
              label: 'Краткое описание',
              admin: {
                description: 'Для карточки кейса на главной странице (до 150 символов)',
              },
              maxLength: 150,
            },
            {
              name: 'challenge',
              type: 'richText',
              required: true,
              label: 'Задача клиента',
              admin: {
                description: 'Описание проблемы или задачи, которую нужно было решить',
              },
              editor: caseRichTextEditor,
            },
            {
              name: 'solution',
              type: 'richText',
              label: 'Решение',
              admin: {
                description: 'Подробное описание предложенного решения',
              },
              required: true,
              editor: caseRichTextEditor,
            },
            {
              name: 'results',
              type: 'richText',
              label: 'Результаты',
              admin: {
                description: 'Достигнутые результаты с конкретными метриками',
              },
              required: true,
              editor: caseRichTextEditor,
            },
            {
              name: 'technologies',
              type: 'array',
              label: 'Использованные технологии',
              admin: {
                description: 'Технологии и инструменты, использованные в проекте',
              },
              fields: [
                {
                  name: 'technology',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Настройки',
          fields: [
            {
              name: 'featured',
              type: 'checkbox',
              label: 'Показывать на главной странице',
              defaultValue: false,
              admin: {
                position: 'sidebar',
                description: 'Отметьте, чтобы кейс отображался в блоке Featured Cases',
              },
            },
            {
              name: 'sortOrder',
              type: 'number',
              label: 'Порядок отображения',
              admin: {
                position: 'sidebar',
                description: 'Меньшее число — выше в списке. По умолчанию 9999.',
              },
              min: 0,
              defaultValue: 9999,
            },
            {
              name: 'publishedAt',
              type: 'date',
              label: 'Дата публикации',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
                position: 'sidebar',
              },
              hooks: {
                beforeChange: [
                  ({ siblingData, value }) => {
                    if (siblingData._status === 'published' && !value) {
                      return new Date()
                    }
                    return value
                  },
                ],
              },
            },
          ],
        },
        seoTab,
      ],
    },
    slugField(),
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
