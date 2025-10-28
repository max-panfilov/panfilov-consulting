import type { Block } from 'payload'

export const TargetAudience: Block = {
  slug: 'targetAudience',
  interfaceName: 'TargetAudienceBlock',
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Метка (Badge)',
      admin: {
        description: 'Небольшой лейбл над заголовком (необязательно)',
      },
    },
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
      name: 'audiences',
      type: 'array',
      label: 'Целевые аудитории',
      minRows: 2,
      maxRows: 6,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Заголовок карточки',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Описание',
        },
        {
          name: 'icon',
          type: 'text',
          required: true,
          label: 'Иконка',
          admin: {
            description:
              'Название иконки из lucide-react (например: UserRound, Briefcase, Code, Database)',
          },
        },
      ],
    },
  ],
  labels: {
    singular: 'Целевая аудитория',
    plural: 'Целевые аудитории',
  },
}
