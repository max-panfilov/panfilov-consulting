import type { Block } from 'payload'

export const ExpertiseHighlight: Block = {
  slug: 'expertiseHighlight',
  interfaceName: 'ExpertiseHighlightBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Заголовок секции',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Подзаголовок',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Категория для фильтрации',
      admin: {
        description: 'Оставьте пустым для показа всех постов, или выберите категорию (например, "Экспертиза")',
      },
    },
    {
      name: 'postsToShow',
      type: 'number',
      label: 'Количество постов',
      defaultValue: 3,
      min: 1,
      max: 6,
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Текст кнопки CTA',
      defaultValue: 'Перейти в блог',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Ссылка кнопки CTA',
      defaultValue: '/posts',
    },
  ],
  labels: {
    singular: 'Экспертиза/Блог',
    plural: 'Блоки экспертизы',
  },
}
