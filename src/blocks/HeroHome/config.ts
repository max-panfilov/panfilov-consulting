import type { Block } from 'payload'

export const HeroHome: Block = {
  slug: 'heroHome',
  interfaceName: 'HeroHomeBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Основной заголовок',
    },
    {
      name: 'subheading',
      type: 'textarea',
      required: true,
      label: 'Подзаголовок',
    },
    {
      name: 'primaryCTA',
      type: 'group',
      label: 'Основная кнопка',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Текст кнопки',
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          label: 'Ссылка',
          admin: {
            description: 'Якорная ссылка (например, #form) или URL',
          },
        },
      ],
    },
    {
      name: 'secondaryCTA',
      type: 'group',
      label: 'Вторичная кнопка',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Текст кнопки',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Ссылка',
          admin: {
            description: 'Якорная ссылка (например, #cases) или URL',
          },
        },
      ],
    },
    {
      name: 'mediaType',
      type: 'select',
      label: 'Тип фонового медиа',
      defaultValue: 'image',
      options: [
        {
          label: 'Изображение',
          value: 'image',
        },
        {
          label: 'Видео',
          value: 'video',
        },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Фоновое изображение',
      admin: {
        condition: (data, siblingData) => siblingData?.mediaType === 'image',
      },
    },
    {
      name: 'backgroundVideo',
      type: 'upload',
      relationTo: 'media',
      label: 'Фоновое видео',
      admin: {
        description: 'Формат MP4 или WebM',
        condition: (data, siblingData) => siblingData?.mediaType === 'video',
      },
    },
    {
      name: 'backgroundOverlay',
      type: 'checkbox',
      label: 'Затемнение фона',
      defaultValue: true,
      admin: {
        description: 'Добавляет темный оверлей для лучшей читаемости текста',
      },
    },
  ],
  labels: {
    singular: 'Hero - Главный экран',
    plural: 'Hero - Главные экраны',
  },
}
