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
      name: 'subheading',
      type: 'text',
      label: 'Подзаголовок секции',
      admin: {
        description: 'Дополнительное описание под заголовком',
      },
    },
    {
      name: 'casesToShow',
      type: 'number',
      label: 'Количество кейсов',
      defaultValue: 4,
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
  ],
  labels: {
    singular: 'Избранные кейсы',
    plural: 'Блоки избранных кейсов',
  },
}
