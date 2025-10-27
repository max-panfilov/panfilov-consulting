import type { Block } from 'payload'

export const FeaturedCases: Block = {
  slug: 'featuredCases',
  interfaceName: 'FeaturedCasesBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Заголовок секции',
    },
    {
      name: 'casesToShow',
      type: 'number',
      label: 'Количество кейсов',
      defaultValue: 3,
      min: 1,
      max: 6,
    },
    {
      name: 'autoSelect',
      type: 'checkbox',
      label: 'Автоматически выбрать featured кейсы',
      defaultValue: true,
      admin: {
        description: 'Если включено, автоматически отбираются кейсы с отметкой "featured"',
      },
    },
    {
      name: 'manualCases',
      type: 'relationship',
      relationTo: 'cases',
      hasMany: true,
      label: 'Выбрать кейсы вручную',
      admin: {
        condition: (data, siblingData) => !siblingData?.autoSelect,
        description: 'Выберите конкретные кейсы для отображения',
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Текст кнопки CTA',
      defaultValue: 'Посмотреть все кейсы',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Ссылка кнопки CTA',
      defaultValue: '/cases',
    },
  ],
  labels: {
    singular: 'Избранные кейсы',
    plural: 'Блоки избранных кейсов',
  },
}
