import { chromium } from 'playwright'

const url = process.argv[2] || 'http://localhost:3000/'

const browser = await chromium.launch()
const page = await browser.newPage()

page.on('console', (msg) => {
  const text = msg.text()
  if (
    text.includes("hasn't mounted") ||
    text.includes('side-effect in your render') ||
    text.includes('Cannot update a component')
  ) {
    const loc = msg.location()
    console.log('=== CAPTURED CONSOLE ERROR ===')
    console.log('TEXT:', text)
    console.log('LOCATION:', JSON.stringify(loc))
    Promise.resolve(msg.args().map((a) => a.jsonValue().catch(() => null)))
  }
})

page.on('pageerror', (err) => {
  console.log('=== PAGE ERROR ===')
  console.log(err.stack || err.message)
})

await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch((e) => console.log('goto err', e.message))
await page.waitForTimeout(8000)
await browser.close()
console.log('DONE')
