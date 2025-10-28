import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'group',
      label: 'Логотип',
      fields: [
        {
          name: 'src',
          type: 'text',
          label: 'URL изображения логотипа',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt текст',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Название компании',
          required: true,
        },
      ],
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Слоган',
      required: true,
    },
    {
      name: 'menuItems',
      type: 'array',
      label: 'Меню секций',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Название секции',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          label: 'Ссылки',
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Текст ссылки',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL',
              required: true,
            },
          ],
        },
      ],
      maxRows: 4,
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: 'copyright',
      type: 'text',
      label: 'Копирайт текст',
      required: true,
    },
    {
      name: 'bottomLinks',
      type: 'array',
      label: 'Нижние ссылки',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Текст',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
        },
      ],
      maxRows: 3,
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
