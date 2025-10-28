import React, { Fragment } from 'react'

import type { Props } from './types'

import { ImageMedia } from './ImageMedia'
import { VideoMedia } from './VideoMedia'

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource } = props

  const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video')
  const content = isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />

  // Если htmlElement null, используем Fragment
  if (htmlElement === null) {
    return <>{content}</>
  }

  const Tag = htmlElement as React.ElementType

  return (
    // @ts-expect-error - Dynamic tag may have varying children requirements
    <Tag className={className}>{content}</Tag>
  )
}
