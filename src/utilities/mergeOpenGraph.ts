import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Консалтинг и разработка AI-решений для среднего и крупного бизнеса. Находим точки роста, автоматизируем процессы и создаем интеллектуальные решения.',
  images: [
    {
      url: `${getServerSideURL()}/panfilov-consulting-meta.png`,
    },
  ],
  siteName: 'panfilov.consulting',
  title: 'panfilov.consulting',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
