import React from 'react'
import type { TargetAudienceBlock as TargetAudienceBlockType } from '@/payload-types'
import * as FaIcons from 'react-icons/fa'
import { IconType } from 'react-icons'

export const TargetAudienceBlock: React.FC<TargetAudienceBlockType> = ({ heading, audiences }) => {
  // Функция для динамической загрузки иконки по имени
  const getIcon = (iconName: string): IconType => {
    // @ts-ignore - динамический доступ к иконкам
    const Icon = FaIcons[iconName as keyof typeof FaIcons]
    // Fallback на FaQuestion если иконка не найдена
    return Icon || FaIcons.FaQuestion
  }

  return (
    <div className="py-16 md:py-24">
      <div className="container">
        {/* Заголовок секции */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16">
          {heading}
        </h2>

        {/* Сетка с карточками аудиторий */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {audiences?.map((audience, index) => {
            if (!audience || typeof audience !== 'object') return null

            const Icon = getIcon(audience.icon)

            return (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400"
              >
                {/* Иконка */}
                <div className="mb-4 inline-flex p-4 bg-blue-100 dark:bg-blue-900 rounded-xl group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-8 h-8 text-blue-600 dark:text-blue-300 group-hover:text-white" />
                </div>

                {/* Заголовок карточки */}
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {audience.title}
                </h3>

                {/* Описание */}
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {audience.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
