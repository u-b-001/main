import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function run() {
  try {
    console.log('Initializing payload...')
    const payload = await getPayload({ config: configPromise })
    
    console.log('Fetching page 65...')
    const page = await payload.findByID({
      collection: 'pages',
      id: 65,
    })
    
    console.log('Attempting to update page 65 data...')
    const updatedPage = await payload.update({
      collection: 'pages',
      id: 65,
      data: {
        // Just touch the title or a simple field to trigger hooks
        title: page.title,
      },
    })
    console.log('Update successful!')
  } catch (error: any) {
    console.error('UPDATE FAILED:', error.message || error)
    if (error.stack) {
      console.error(error.stack)
    }
  }
  process.exit(0)
}

run()
