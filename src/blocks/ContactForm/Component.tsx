import React from 'react'
import type { ContactFormBlock as ContactFormBlockType } from '@/payload-types'
import { FormBlock } from '@/blocks/Form/Component'

export const ContactFormBlock: React.FC<ContactFormBlockType> = ({
  heading,
  description,
  form,
  htmlId = 'form',
}) => {
  return (
    <div className="py-16 md:py-24" id={htmlId || undefined}>
      <div className="container max-w-3xl">
        {/* Заголовок и описание */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{heading}</h2>
          {description && (
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">{description}</p>
          )}
        </div>

        {/* Форма из Form Builder */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
          {typeof form === 'object' && <FormBlock form={form as any} enableIntro={false} />}
        </div>
      </div>
    </div>
  )
}
