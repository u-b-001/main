import { getPayload } from 'payload'
import configPromise from './payload.config'
import { seed } from './endpoints/seed/index'
import 'dotenv/config'

const runSeed = async () => {
  try {
    const payload = await getPayload({ config: configPromise })
    await seed({ payload, req: { context: { disableRevalidate: true, disableSyncNav: true } } as any })
    console.log('Seed completed successfully')
    process.exit(0)
  } catch (err) {
    console.error('Seed failed:', err)
    process.exit(1)
  }
}

runSeed()
