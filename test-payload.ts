import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function run() {
  try {
    const payload = await getPayload({ config: configPromise })
    const pages = await payload.find({
      collection: 'pages',
      limit: 100,
      draft: true,
    })
    for (const doc of pages.docs) {
      console.log(`PAGE ID: ${doc.id}, TITLE: ${doc.title}, SLUG: ${doc.slug}`)
      console.log(`LAYOUT: ${JSON.stringify(doc.layout, null, 2)}`)
      console.log('----------------------------------------------------')
    }
  } catch (error) {
    console.error('CAUGHT ERROR:', error)
  }
  process.exit(0)
}

run()
