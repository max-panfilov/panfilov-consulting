import type { Block } from 'payload'

export const SolutionApproach: Block = {
  slug: 'solutionApproach',
  interfaceName: 'SolutionApproachBlock',
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
      name: 'steps',
      type: 'array',
      label: 'Этапы решения',
      minRows: 3,
      maxRows: 5,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Название этапа',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Описание этапа',
        },
        {
          name: 'icon',
          type: 'text',
          required: true,
          label: 'Иконка',
          admin: {
            description:
              'Название иконки из react-icons (например: FaChartLine, FaCogs, FaGraduationCap)',
          },
        },
      ],
    },
  ],
  labels: {
    singular: 'Подход к решению',
    plural: 'Подходы к решению',
  },
}
