import React from 'react'
import type { SolutionApproachBlock as SolutionApproachBlockType } from '@/payload-types'
import * as FaIcons from 'react-icons/fa'
import { IconType } from 'react-icons'

export const SolutionApproachBlock: React.FC<SolutionApproachBlockType> = ({
  heading,
  subheading,
  steps,
}) => {
  // Функция для динамической загрузки иконки по имени
  const getIcon = (iconName: string): IconType => {
    // @ts-ignore - динамический доступ к иконкам
    const Icon = FaIcons[iconName as keyof typeof FaIcons]
    // Fallback на FaQuestion если иконка не найдена
    return Icon || FaIcons.FaQuestion
  }

  return (
    <div className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        {/* Заголовок секции */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{heading}</h2>
          {subheading && (
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {subheading}
            </p>
          )}
        </div>

        {/* Timeline для desktop, карточки для mobile */}
        <div className="relative">
          {/* Вертикальная линия timeline (скрыта на mobile) */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200 dark:bg-blue-800" />

          {/* Этапы */}
          <div className="space-y-8 md:space-y-12">
            {steps?.map((step, index) => {
              if (!step || typeof step !== 'object') return null

              const Icon = getIcon(step.icon)
              const isEven = index % 2 === 0

              return (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Контент этапа */}
                  <div
                    className={`w-full md:w-5/12 ${
                      isEven ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'
                    }`}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                      {/* Номер этапа */}
                      <div
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold text-sm mb-3 ${
                          isEven ? 'md:ml-auto' : ''
                        }`}
                      >
                        {index + 1}
                      </div>

                      {/* Заголовок этапа */}
                      <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                        {step.title}
                      </h3>

                      {/* Описание */}
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Центральная иконка (только на desktop) */}
                  <div className="hidden md:flex w-2/12 justify-center relative z-10">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 shadow-lg">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Пустое пространство для выравнивания */}
                  <div className="hidden md:block w-5/12" />

                  {/* Иконка для mobile */}
                  <div className="md:hidden flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 shadow-lg mb-4 mt-2">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
