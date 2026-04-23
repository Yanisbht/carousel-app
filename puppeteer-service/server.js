import express from 'express'
import cors from 'cors'
import puppeteer from 'puppeteer'

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))

function getFontSize(text, index) {
  const chars = (text || '').length
  const baseSize = chars <= 8 ? 200 : chars <= 14 ? 160 : chars <= 20 ? 120 : chars <= 30 ? 90 : 70
  const multiplier = index === 0 ? 1 : index === 1 ? 0.82 : 0.55
  return Math.round(baseSize * multiplier)
}

function buildSlideHTML(slide, bgImage, index, total) {
  const main = (slide.main || '').toUpperCase()
  const sub = (slide.sub || '').toUpperCase()
  const fontSize = getFontSize(main, index)

  const bgStyle = bgImage
    ? `background-image: url('${bgImage}'); background-size: cover; background-position: center;`
    : 'background: #111;'

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1080px; height: 1920px; overflow: hidden; background: #111; }
.bg {
  position: absolute; inset: 0;
  ${bgStyle}
  filter: brightness(0.5) saturate(0.7);
}
.overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.35); }
.num {
  position: absolute; top: 48px; left: 56px;
  font-family: 'Montserrat', sans-serif;
  font-size: 36px; font-weight: 900;
  color: rgba(255,255,255,0.3); z-index: 3;
}
.content {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  justify-content: center; align-items: flex-start;
  padding: 160px 56px 100px;
  z-index: 3; gap: 40px;
}
.main {
  font-family: 'Montserrat', sans-serif;
  font-size: ${fontSize}px; font-weight: 900;
  color: #FFFFFF; line-height: 0.95;
  letter-spacing: -2px; text-transform: uppercase;
  word-break: break-word; width: 100%;
}
.sub {
  font-family: 'Montserrat', sans-serif;
  font-size: 36px; font-weight: 400;
  color: rgba(255,255,255,0.6);
  letter-spacing: 4px; text-transform: uppercase;
}
</style>
</head>
<body>
<div style="position:relative;width:1080px;height:1920px;overflow:hidden;">
  <div class="bg"></div>
  <div class="overlay"></div>
  <div class="num">${index + 1}/${total}</div>
  <div class="content">
    ${main ? `<p class="main">${main}</p>` : ''}
    ${sub ? `<p class="sub">${sub}</p>` : ''}
  </div>
</div>
</body>
</html>`
}

app.post('/screenshot', async (req, res) => {
  const { slides, bgImages } = req.body
  let browser
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-web-security']
    })
    const pngs = []
    for (let i = 0; i < slides.length; i++) {
      const page = await browser.newPage()
      await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 })
      const html = buildSlideHTML(slides[i], bgImages?.[i] || null, i, slides.length)
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 })
      await new Promise(r => setTimeout(r, 2000))
      const screenshot = await page.screenshot({ type: 'png', encoding: 'base64' })
      pngs.push(screenshot)
      await page.close()
    }
    res.json({ images: pngs })
  } catch (e) {
    res.status(500).json({ error: e.message })
  } finally {
    if (browser) await browser.close()
  }
})

app.get('/health', (_, res) => res.json({ ok: true }))
app.listen(3001, () => console.log('Puppeteer ready on port 3001'))
