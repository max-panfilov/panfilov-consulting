'use client'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props
  const [mounted, setMounted] = useState(false)

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  // Ждём клиентскую гидратацию перед применением темы
  useEffect(() => {
    setMounted(true)
  }, [])

  // На сервере и до гидратации рендерим светлую тему
  if (!mounted) {
    return (
      /* eslint-disable @next/next/no-img-element */
      <img
        alt="Panfilov Consulting"
        width={200}
        height={40}
        loading={loading}
        fetchPriority={priority}
        decoding="async"
        className={clsx('w-auto h-5 md:h-10', className)}
        src="/logo.svg"
      />
    )
  }

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
        className={clsx('w-auto h-5 md:h-10 block dark:hidden', className)}
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
        className={clsx('w-auto h-5 md:h-10 hidden dark:block', className)}
        src="/logo-dark.svg"
      />
    </>
  )
}
