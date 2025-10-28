import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <>
      {/* Логотип для светлой темы */}
      <img
        alt="Panfilov Consulting"
        width={200}
        height={40}
        loading={loading}
        fetchPriority={priority}
        decoding="async"
        className={clsx('w-auto h-7 md:h-10 block dark:hidden', className)}
        src="/logo.svg"
      />
      {/* Логотип для тёмной темы */}
      <img
        alt="Panfilov Consulting"
        width={200}
        height={40}
        loading={loading}
        fetchPriority={priority}
        decoding="async"
        className={clsx('w-auto h-7 md:h-10 hidden dark:block', className)}
        src="/logo-dark.svg"
      />
    </>
  )
}
