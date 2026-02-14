import fs from 'fs/promises'
import path from 'path'
import puppeteer from 'puppeteer'

// Use esbuild-register to import TypeScript `snippets.ts` at runtime
try {
  // eslint-disable-next-line no-unused-expressions
  await import('esbuild-register/register')
} catch (e) {
  // if import fails, we'll fallback to file parsing below
}

async function extractSnippetCode(slug) {
  try {
    const { snippets } = await import('../src/data/snippets.ts')
    const s = (snippets || []).find((x) => x.id === slug)
    return s?.code ?? null
  } catch (err) {
    // fallback to text parsing if import fails
  }

  const snippetsPath = path.resolve(process.cwd(), 'src/data/snippets.ts')
  const txt = await fs.readFile(snippetsPath, 'utf8')
  const idRegex = new RegExp(`id\s*:\s*['\"]${slug}['\"]`)
  const idMatch = txt.search(idRegex)
  if (idMatch === -1) return null
  const codeRegex = /code:\s*`([\s\S]*?)`/g
  codeRegex.lastIndex = idMatch
  const m = codeRegex.exec(txt)
  if (!m) return null
  return m[1]
}

function buildHTMLFromSnippet(code) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      html,body{height:100%;margin:0;background:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif}
      #container{padding:40px;display:flex;align-items:center;justify-content:center}
    </style>
  </head>
  <body>
    <div id="container">${code}</div>
  </body>
</html>`
}

async function render(html, outPath, width = 1200, height = 800) {
  const launchOpts = { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
  if (process.env.PUPPETEER_EXECUTABLE_PATH) launchOpts.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH
  const browser = await puppeteer.launch(launchOpts)
  const page = await browser.newPage()
  await page.setViewport({ width, height })
  await page.setContent(html, { waitUntil: 'networkidle0' })
  await page.waitForTimeout(300)
  await fs.mkdir(path.dirname(outPath), { recursive: true })
  await page.screenshot({ path: outPath, type: 'png', clip: { x: 0, y: 0, width, height } })
  await browser.close()
}

async function main() {
  const slug = process.argv[2] || 'css-gradient-hero'
  console.log('Generating screenshot for', slug)
  let code = null
  try {
    code = await extractSnippetCode(slug)
  } catch (err) {
    console.error('Error reading snippets:', err.message)
  }

  if (!code) {
    console.warn('Snippet not found — using fallback sample HTML')
    code = `<section style="padding:48px;text-align:center;border-radius:12px;background:linear-gradient(180deg,rgba(14,165,164,0.12),rgba(99,102,241,0.06)),linear-gradient(135deg,#06b6d4 0%,#8b5cf6 100%);max-width:900px;margin:40px auto;color:#000"><div><h1 style="font-size:40px;margin:0">Craft beautiful storefronts</h1><p style="margin:.5rem 0;color:rgba(0,0,0,0.6)">Small components, big impact.</p></div></section>`
  }

  const html = buildHTMLFromSnippet(code)
  const out = path.resolve(process.cwd(), 'public/snippets', slug, 'preview-desktop.png')
  await render(html, out)
  console.log('Saved:', out)
}

if (process.argv[1] && process.argv[1].endsWith('screenshot-generator.js')) {
  main().catch(err => { console.error(err); process.exit(1) })
}

export { extractSnippetCode, buildHTMLFromSnippet, render }
