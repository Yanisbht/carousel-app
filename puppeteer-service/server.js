import express from 'express'
import cors from 'cors'
import puppeteer from 'puppeteer'

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

function buildSlideHTML(slide, bgImage, themeColor, isBasket) {
  const textColor = isBasket ? '#f5e6c8' : '#FFFFFF'
  const overlay = isBasket ? 'rgba(60,40,10,0.45)' : (themeColor || 'rgba(20,20,20,0.55)')

  const bgStyle = bgImage
    ? `background-image: url('${bgImage}'); background-size: cover; background-position: center;`
    : 'background: #0a0a0a;'

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1080px; height: 1920px; overflow: hidden; }
.slide {
  width: 1080px; height: 1920px;
  position: relative; overflow: hidden;
  ${bgStyle}
  display: flex; align-items: center; justify-content: center;
}
.overlay {
  position: absolute; inset: 0;
  background: ${overlay};
}
.overlay2 {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.2);
}
.num {
  position: absolute; top: 48px; left: 60px;
  font-family: 'Montserrat', sans-serif;
  font-size: 36px; color: rgba(255,255,255,0.4);
  z-index: 3;
}
.content {
  position: relative; z-index: 3;
  text-align: center; padding: 80px 80px;
  display: flex; flex-direction: column;
  align-items: center; gap: 40px;
}
.main {
  font-family: 'Montserrat', sans-serif;
  font-size: 72px; font-weight: 800;
  color: ${textColor};
  line-height: 1.2;
  text-shadow: 0 4px 20px rgba(0,0,0,0.8);
  text-wrap: balance;
}
.sub {
  font-family: 'Montserrat', sans-serif;
  font-size: 40px; font-weight: 400;
  color: rgba(255,255,255,0.75);
  font-style: italic; line-height: 1.4;
}
</style>
</head>
<body>
<div class="slide">
  <div class="overlay"></div>
  <div class="overlay2"></div>
  <div class="num">${slide.index + 1}/${slide.total}</div>
  <div class="content">
    ${slide.main ? `<p class="main">${slide.main}</p>` : ''}
    ${slide.sub ? `<p class="sub">${slide.sub}</p>` : ''}
  </div>
</div>
</body>
</html>`
}

app.post('/screenshot', async (req, res) => {
  const { slides, bgImages, themeColor, isBasket } = req.body

  let browser
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    })

    const pngs = []

    for (let i = 0; i < slides.length; i++) {
      const page = await browser.newPage()
      await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 })

      const html = buildSlideHTML(
        { ...slides[i], index: i, total: slides.length },
        bgImages[i] || null,
        themeColor,
        isBasket
      )

      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 15000 })
      await page.waitForTimeout(500)

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

app.get('/health', (req, res) => res.json({ ok: true }))

app.listen(3001, () => console.log('Puppeteer service running on port 3001'))
