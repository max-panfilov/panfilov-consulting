import type { Block } from 'payload'

export const ContactForm: Block = {
  slug: 'contactForm',
  interfaceName: 'ContactFormBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Заголовок секции',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      admin: {
        description: 'Пояснительный текст над формой',
      },
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      label: 'Форма',
      admin: {
        description: 'Выберите форму, созданную через Form Builder',
      },
    },
    {
      name: 'htmlId',
      type: 'text',
      label: 'HTML ID для якорной ссылки',
      defaultValue: 'form',
      admin: {
        description: 'ID для якорных ссылок (например, #form). По умолчанию: "form"',
      },
    },
  ],
  labels: {
    singular: 'Форма обратной связи',
    plural: 'Формы обратной связи',
  },
}
