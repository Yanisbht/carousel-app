import { useState, useEffect } from 'react'
import './App.css'

const THEMES = [
  'philosophie stoïcienne',
  'sagesse africaine',
  'philosophie orientale',
  'leaders et révolutionnaires',
  'philosophie arabe et islamique',
  'développement personnel moderne',
  'sagesse amérindienne',
  'philosophie japonaise (Musashi, Mishima)',
  'citations de prison et résilience (Mandela, Malcolm X)',
  'femmes philosophes (Beauvoir, Angelou)',
  'sagesse berbère et maghrébine',
  'citations de guerriers (Sun Tzu, Spartiate)',
  'spiritualité soufie (Rumi, Ibn Arabi)',
  'philosophie grecque antique (Socrate, Platon)',
]

const PHILO_QUESTIONS = [
  "Pourquoi le monde n'a pas de sens — selon Camus",
  "Pourquoi souffrons-nous — selon les stoïciens",
  "C'est quoi la liberté vraiment — selon Sartre",
  "Pourquoi l'argent ne rend pas heureux — selon Épictète",
  "Pourquoi on a peur de la mort — selon Marc Aurèle",
  "C'est quoi l'amour selon les Grecs",
  "Pourquoi l'homme cherche toujours plus — selon les bouddhistes",
]

const AUTEURS = [
  'Marc Aurèle', 'Épictète', 'Sénèque', 'Socrate', 'Platon',
  'Aristote', 'Rumi', 'Ibn Khaldoun', 'Confucius', 'Lao Tseu',
  'Sun Tzu', 'Miyamoto Musashi', 'Nelson Mandela', 'Malcolm X',
  'Simone de Beauvoir', 'Maya Angelou', 'Nietzsche', 'Camus', 'Sartre',
]

const PEXELS_KEY = 'UHgkq1JFa5yzly6gsz5SIYIacRwUqwnTVRBeKzo99Jw4pzH5ovRoMr10'
const API_BASE = import.meta.env.VITE_API_URL || ''
const FORMATS = ['Carrousel', "Devine l'auteur", 'Philo Express', 'Citation moderne', 'Top 3 auteur']

const THEME_KEYWORDS = {
  'philosophie stoïcienne': 'ancient greece ruins dramatic',
  'sagesse africaine': 'africa savanna golden hour',
  'philosophie orientale': 'japan misty mountain temple',
  'leaders et révolutionnaires': 'dramatic crowd protest light',
  'philosophie arabe et islamique': 'arabic mosque dramatic light',
  'développement personnel moderne': 'dramatic sunrise mountain',
  'sagesse amérindienne': 'native american forest dramatic',
  'philosophie japonaise (Musashi, Mishima)': 'japan forest fog samurai',
  'citations de prison et résilience (Mandela, Malcolm X)': 'dramatic light prison bars',
  'femmes philosophes (Beauvoir, Angelou)': 'woman dramatic portrait light',
  'sagesse berbère et maghrébine': 'sahara desert dramatic dusk',
  'citations de guerriers (Sun Tzu, Spartiate)': 'battle warrior dramatic fog',
  'spiritualité soufie (Rumi, Ibn Arabi)': 'mystical light spiritual fog',
  'philosophie grecque antique (Socrate, Platon)': 'ancient ruins dramatic sky',
}

async function fetchPexelsImage(query) {
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=8&orientation=portrait`, {
      headers: { Authorization: PEXELS_KEY }
    })
    const data = await res.json()
    if (data.photos && data.photos.length > 0) {
      const idx = Math.floor(Math.random() * data.photos.length)
      return data.photos[idx].src.large
    }
  } catch (e) {}
  return null
}

function getSlideText(slide) {
  if (slide.type === 'hook') return { top: slide.origine?.toUpperCase(), bottom: `"${slide.citation}"`, author: `— ${slide.auteur}` }
  if (slide.type === 'intrigue') return { bottom: slide.question, sub: slide.teaser }
  if (slide.type === 'context' || slide.type === 'lesson') return { top: slide.titre?.toUpperCase(), bottom: slide.corps }
  if (slide.type === 'cta') return { bottom: slide.texte, sub: slide.question }
  if (slide.type === 'devine_question') return { top: slide.intro, bottom: slide.question }
  if (slide.type === 'devine_citation') return { top: 'QUI A DIT...', bottom: `"${slide.citation}"`, sub: slide.indice }
  if (slide.type === 'devine_revelation') return { top: "C'ÉTAIT...", bottom: slide.auteur, sub: slide.bio }
  if (slide.type === 'philo_question') return { top: 'LA QUESTION', bottom: slide.question, sub: slide.teaser }
  if (slide.type === 'philo_citation') return { top: slide.penseur?.toUpperCase(), bottom: `"${slide.citation}"`, sub: slide.explication }
  if (slide.type === 'context') return { top: 'SA PENSÉE', bottom: slide.corps }
  if (slide.type === 'philo_conclusion') return { top: 'LA RÉPONSE', bottom: slide.conclusion, sub: slide.question_cta }
  if (slide.type === 'moderne_original') return { top: `${slide.auteur} DISAIT...`, bottom: `"${slide.citation}"` }
  if (slide.type === 'moderne_traduction') return { top: 'EN 2024 ÇA DONNE...', bottom: `"${slide.moderne}"`, sub: slide.contexte }
  if (slide.type === 'moderne_cta') return { bottom: slide.texte, sub: slide.question }
  if (slide.type === 'top3_intro') return { top: 'TOP 3', bottom: slide.auteur, sub: slide.description }
  if (slide.type === 'top3_citation') return { top: `#${slide.numero}`, bottom: `"${slide.citation}"`, sub: slide.explication }
  if (slide.type === 'top3_cta') return { bottom: slide.texte, sub: slide.question }
  return { bottom: '' }
}

function Slide({ slide, index, total, bgImage, id }) {
  const { top, bottom, sub, author } = getSlideText(slide)

  return (
    <div id={id} style={{
      flexShrink: 0, width: 180, height: 320, borderRadius: 10,
      position: 'relative', overflow: 'hidden', background: '#0a0a0a',
      border: '0.5px solid rgba(255,255,255,0.1)',
    }}>
      {bgImage && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          zIndex: 0,
        }} />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.75) 75%, rgba(0,0,0,0.92) 100%)',
        zIndex: 1,
      }} />
      <span style={{ position: 'absolute', top: 10, left: 12, fontSize: 9, color: 'rgba(255,255,255,0.5)', zIndex: 3 }}>{index + 1}/{total}</span>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 14px 18px', zIndex: 2, textAlign: 'center' }}>
        {top && (
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.15em', marginBottom: 6, fontWeight: 400 }}>{top}</p>
        )}
        {bottom && (
          <p style={{ fontSize: 13, fontWeight: 500, color: '#f0e040', lineHeight: 1.4, marginBottom: author || sub ? 6 : 0, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{bottom}</p>
        )}
        {author && (
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>{author}</p>
        )}
        {sub && (
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', lineHeight: 1.4, marginTop: 4 }}>{sub}</p>
        )}
      </div>
    </div>
  )
}

async function callAPI(endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Erreur serveur')
  return typeof json.data === 'string' ? JSON.parse(json.data) : json.data
}

export default function App() {
  const [format, setFormat] = useState(0)
  const [theme, setTheme] = useState(THEMES[0])
  const [philoQ, setPhiloQ] = useState(PHILO_QUESTIONS[0])
  const [auteur, setAuteur] = useState(AUTEURS[0])
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [data, setData] = useState(null)
  const [bgImages, setBgImages] = useState([])
  const [error, setError] = useState(null)

  const generate = async () => {
    setLoading(true)
    setError(null)
    setData(null)
    setBgImages([])
    try {
      let result
      if (format === 0) result = await callAPI('/api/generate', { theme, style: 'sombre et épuré' })
      else if (format === 1) result = await callAPI('/api/generate-devine', { theme, style: 'sombre et épuré' })
      else if (format === 2) result = await callAPI('/api/generate-philo', { question: philoQ, style: 'sombre et épuré' })
      else if (format === 3) result = await callAPI('/api/generate-moderne', { theme, style: 'sombre et épuré' })
      else result = await callAPI('/api/generate-top3', { auteur, style: 'sombre et épuré' })

      setData(result)
      const keyword = THEME_KEYWORDS[theme] || theme
      const imgs = await Promise.all((result.slides || []).map(() => fetchPexelsImage(keyword)))
      setBgImages(imgs)
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  const downloadAll = async () => {
    setExporting(true)
    try {
      const { default: html2canvas } = await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js')
      const slides = data?.slides || []
      for (let i = 0; i < slides.length; i++) {
        const el = document.getElementById(`slide-${i}`)
        if (!el) continue
        const canvas = await html2canvas(el, { scale: 2, useCORS: true, allowTaint: true })
        const link = document.createElement('a')
        link.download = `slide-${i + 1}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
        await new Promise(r => setTimeout(r, 400))
      }
    } catch (e) { alert('Erreur export: ' + e.message) }
    setExporting(false)
  }

  useEffect(() => { generate() }, [])

  const slides = data?.slides || []

  return (
    <div className="app">
      <header>
        <h1>Carousel Generator</h1>
        <p className="subtitle">@citationmonde5 — optimisé TikTok</p>
      </header>

      <div className="format-tabs">
        {FORMATS.map((f, i) => (
          <button key={i} className={`ftab${format === i ? ' active' : ''}`}
            onClick={() => { setFormat(i); setData(null); setError(null); setBgImages([]) }}>
            {f}
          </button>
        ))}
      </div>

      <div className="controls">
        {(format === 0 || format === 1 || format === 3) && (
          <div className="ctrl">
            <label>Thème</label>
            <select value={theme} onChange={e => setTheme(e.target.value)}>
              {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        )}
        {format === 2 && (
          <div className="ctrl">
            <label>Question philo</label>
            <select value={philoQ} onChange={e => setPhiloQ(e.target.value)}>
              {PHILO_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>
        )}
        {format === 4 && (
          <div className="ctrl">
            <label>Auteur</label>
            <select value={auteur} onChange={e => setAuteur(e.target.value)}>
              {AUTEURS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        )}
        <button className="gen-btn" onClick={generate} disabled={loading}>
          {loading ? 'Génération...' : 'Générer'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="status">Création du carrousel...</div>}

      {data && (
        <>
          <div className="slides-row">
            {slides.map((slide, i) => (
              <Slide key={i} id={`slide-${i}`} slide={slide} index={i}
                total={slides.length} bgImage={bgImages[i]} />
            ))}
          </div>
          <div className="hashtags">
            {(data.hashtags || []).map(tag => (
              <span key={tag} className="tag">#{tag.replace(/^#+/, '')}</span>
            ))}
          </div>
          <button className="dl-btn" onClick={downloadAll} disabled={exporting}>
            {exporting ? 'Export en cours...' : 'Télécharger les slides (PNG)'}
          </button>
        </>
      )}
    </div>
  )
}
