import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function run() {
  try {
    const payload = await getPayload({ config: configPromise })
    console.log("Payload initialized, fetching pages...")
    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      limit: 1,
    })
    console.log("Successfully fetched pages", pages.docs.length)
  }    catch (error) {
    console.error("CAUGHT ERROR:")
    if (error instanceof Error) {
      console.error(error.message)
      
      // We check for 'cause' safely and cast it
      // in case your TS config doesn't include ES2022 Error.cause yet
      if ('cause' in error) {
        console.error("CAUSE:", (error as any).cause)
      }
    } else {
      // Fallback if 'error' is a string or something else
      console.error(error)
    }
  }

  process.exit(0)
}

run()
