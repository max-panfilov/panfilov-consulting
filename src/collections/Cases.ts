import type { CollectionConfig } from 'payload'

import { 
  lexicalEditor,
  HeadingFeature,
  OrderedListFeature,
  UnorderedListFeature,
  BlockquoteFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  LinkFeature,
  ChecklistFeature,
  HorizontalRuleFeature,
  InlineCodeFeature,
  BlocksFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { generatePreviewPath } from '../utilities/generatePreviewPath'
import { revalidateCase, revalidateDelete } from './Cases/hooks/revalidateCase'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
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
  // Определяем что будет подтягиваться при связях с Cases
  defaultPopulate: {
    title: true,
    slug: true,
    industry: true,
    shortDescription: true,
    coverImage: true,
    featured: true,
  },
  admin: {
    // Добавляем колонку sortOrder для удобного редактирования порядка в админке
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
              options: [
                {
                  label: 'Электротехника',
                  value: 'electronics',
                },
                {
                  label: 'Юридические услуги',
                  value: 'legal',
                },
                {
                  label: 'Финансы',
                  value: 'finance',
                },
                {
                  label: 'Ритейл',
                  value: 'retail',
                },
                {
                  label: 'Логистика',
                  value: 'logistics',
                },
                {
                  label: 'Промышленность',
                  value: 'industry',
                },
                {
                  label: 'Другое',
                  value: 'other',
                },
              ],
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
              editor: lexicalEditor({
                features: () => [
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  BoldFeature(),
                  ItalicFeature(),
                  UnderlineFeature(),
                  StrikethroughFeature(),
                  InlineCodeFeature(),
                  OrderedListFeature(),
                  UnorderedListFeature(),
                  ChecklistFeature(),
                  LinkFeature({
                    enabledCollections: ['pages', 'posts'],
                  }),
                  BlockquoteFeature(),
                  HorizontalRuleFeature(),
                  BlocksFeature({
                    blocks: [
                      {
                        slug: 'mediaBlock',
                        interfaceName: 'MediaBlock',
                        fields: [
                          {
                            name: 'media',
                            type: 'upload',
                            relationTo: 'media',
                            required: true,
                            label: 'Изображение',
                          },
                          {
                            name: 'caption',
                            type: 'text',
                            label: 'Подпись',
                          },
                        ],
                      },
                    ],
                  }),
                  // Панели форматирования
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                ],
              }),
            },
            {
              name: 'solution',
              type: 'richText',
              label: 'Решение',
              admin: {
                description: 'Подробное описание предложенного решения',
              },
              required: true,
              editor: lexicalEditor({
                features: () => [
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  BoldFeature(),
                  ItalicFeature(),
                  UnderlineFeature(),
                  StrikethroughFeature(),
                  InlineCodeFeature(),
                  OrderedListFeature(),
                  UnorderedListFeature(),
                  ChecklistFeature(),
                  LinkFeature({
                    enabledCollections: ['pages', 'posts'],
                  }),
                  BlockquoteFeature(),
                  HorizontalRuleFeature(),
                  BlocksFeature({
                    blocks: [
                      {
                        slug: 'mediaBlock',
                        interfaceName: 'MediaBlock',
                        fields: [
                          {
                            name: 'media',
                            type: 'upload',
                            relationTo: 'media',
                            required: true,
                            label: 'Изображение',
                          },
                          {
                            name: 'caption',
                            type: 'text',
                            label: 'Подпись',
                          },
                        ],
                      },
                    ],
                  }),
                  // Панели форматирования
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                ],
              }),
            },
            {
              name: 'results',
              type: 'richText',
              label: 'Результаты',
              admin: {
                description: 'Достигнутые результаты с конкретными метриками',
              },
              required: true,
              editor: lexicalEditor({
                features: () => [
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  BoldFeature(),
                  ItalicFeature(),
                  UnderlineFeature(),
                  StrikethroughFeature(),
                  InlineCodeFeature(),
                  OrderedListFeature(),
                  UnorderedListFeature(),
                  ChecklistFeature(),
                  LinkFeature({
                    enabledCollections: ['pages', 'posts'],
                  }),
                  BlockquoteFeature(),
                  HorizontalRuleFeature(),
                  BlocksFeature({
                    blocks: [
                      {
                        slug: 'mediaBlock',
                        interfaceName: 'MediaBlock',
                        fields: [
                          {
                            name: 'media',
                            type: 'upload',
                            relationTo: 'media',
                            required: true,
                            label: 'Изображение',
                          },
                          {
                            name: 'caption',
                            type: 'text',
                            label: 'Подпись',
                          },
                        ],
                      },
                    ],
                  }),
                  // Панели форматирования
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                ],
              }),
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
              // Поле порядка сортировки: меньшее число — выше в списках (главная и /cases)
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
                    // Автоматически устанавливаем дату при первой публикации
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
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    slugField(),
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100, // Оптимальный интервал для live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
