import { getPayload } from 'payload'
import config from './src/payload.config.ts'

const payload = await getPayload({ config })

const pages = await payload.find({
  collection: 'pages',
  limit: 100,
  where: {}
})

console.log('Total pages:', pages.totalDocs)
console.log('\nPages list:')
pages.docs.forEach(page => {
  console.log(`- ${page.slug} (${page._status}) - "${page.title}"`)
})

process.exit(0)
