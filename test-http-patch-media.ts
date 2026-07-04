import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function run() {
  try {
    const payload = await getPayload({ config: configPromise })
    const page = await payload.findByID({
      collection: 'pages',
      id: 65,
      draft: true,
      depth: 0,
    })
    
    // We update Page 65's backgroundSettings to point to media ID 140 (which exists)
    const updatedData = {
      ...page,
      backgroundSettings: {
        theme: 'default',
        backgroundImage: 140,
      }
    }
    
    console.log('Sending HTTP PATCH request with media relationship...')
    const response = await fetch('http://localhost:3000/api/pages/65?autosave=true&depth=0&draft=true&fallback-locale=null', {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
    
    console.log(`Response Status: ${response.status} ${response.statusText}`)
    const text = await response.text()
    console.log('Response Body:', text.slice(0, 2000))
  } catch (error) {
    console.error('HTTP request failed:', error)
  }
  process.exit(0)
}

run()
