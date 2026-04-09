import { useState, useEffect } from 'react'
import './App.css'

const PALETTES = {
  'sombre et épuré':    { overlay: 'rgba(0,0,0,0.72)', text: '#f5f5f5', accent: '#d4af37', sub: 'rgba(255,255,255,0.55)' },
  'minimaliste blanc':  { overlay: 'rgba(255,255,255,0.82)', text: '#111', accent: '#333', sub: 'rgba(0,0,0,0.45)' },
  'doré et luxueux':    { overlay: 'rgba(10,7,0,0.78)', text: '#f5e6a0', accent: '#d4af37', sub: 'rgba(212,175,55,0.6)' },
  'coloré et énergique':{ overlay: 'rgba(26,5,51,0.80)', text: '#fff', accent: '#b24bf3', sub: 'rgba(178,75,243,0.6)' },
}

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
const STYLES = Object.keys(PALETTES)
const API_BASE = import.meta.env.VITE_API_URL || ''
const FORMATS = ['Carrousel', "Devine l'auteur", 'Philo Express', 'Citation moderne', 'Top 3 auteur']

const THEME_KEYWORDS = {
  'philosophie stoïcienne': 'ancient greece philosophy',
  'sagesse africaine': 'africa landscape sunset',
  'philosophie orientale': 'japan zen temple',
  'leaders et révolutionnaires': 'revolution crowd power',
  'philosophie arabe et islamique': 'arabic architecture mosque',
  'développement personnel moderne': 'mindset motivation sunrise',
  'sagesse amérindienne': 'native nature forest',
  'philosophie japonaise (Musashi, Mishima)': 'japan samurai mountain',
  'citations de prison et résilience (Mandela, Malcolm X)': 'strength resilience light',
  'femmes philosophes (Beauvoir, Angelou)': 'woman strength poetry',
  'sagesse berbère et maghrébine': 'sahara desert morocco',
  'citations de guerriers (Sun Tzu, Spartiate)': 'warrior battle strength',
  'spiritualité soufie (Rumi, Ibn Arabi)': 'sufi spiritual light',
  'philosophie grecque antique (Socrate, Platon)': 'ancient greece columns',
}

async function fetchPexelsImage(query) {
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=portrait`, {
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

function Slide({ slide, index, total, palette, bgImage, id }) {
  const p = palette
  const base = {
    flexShrink: 0, width: 180, height: 320, borderRadius: 12,
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    alignItems: 'center', padding: '24px 14px', textAlign: 'center',
    position: 'relative', overflow: 'hidden',
    border: '0.5px solid rgba(128,128,128,0.2)', background: '#111',
  }
  const bgStyle = bgImage ? {
    position: 'absolute', inset: 0,
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover', backgroundPosition: 'center',
    filter: 'blur(2px) brightness(0.7)', transform: 'scale(1.05)', zIndex: 0,
  } : { position: 'absolute', inset: 0, background: '#111', zIndex: 0 }
  const overlayStyle = { position: 'absolute', inset: 0, background: p.overlay, zIndex: 1 }
  const inner = { position: 'relative', zIndex: 2, width: '100%' }
  const num = { position: 'absolute', top: 10, left: 12, fontSize: 10, color: p.sub, zIndex: 3 }
  const line = { position: 'absolute', bottom: 14, left: '25%', width: '50%', height: 1.5, background: p.accent, borderRadius: 2, zIndex: 3 }

  const content = () => {
    if (slide.type === 'hook') return (
      <div style={inner}>
        <p style={{ fontSize: 10, color: p.sub, marginBottom: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{slide.origine}</p>
        <p style={{ fontSize: 14, fontWeight: 500, color: p.accent, fontStyle: 'italic', lineHeight: 1.5, marginBottom: 10 }}>"{slide.citation}"</p>
        <p style={{ fontSize: 11, color: p.sub }}>— {slide.auteur}</p>
      </div>
    )
    if (slide.type === 'intrigue') return (
      <div style={inner}>
        <p style={{ fontSize: 16, fontWeight: 500, color: p.text, lineHeight: 1.4, marginBottom: 10 }}>{slide.question}</p>
        <p style={{ fontSize: 12, color: p.sub, lineHeight: 1.5, fontStyle: 'italic' }}>{slide.teaser}</p>
      </div>
    )
    if (slide.type === 'context' || slide.type === 'lesson') return (
      <div style={inner}>
        <p style={{ fontSize: 10, color: p.accent, marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>{slide.titre}</p>
        <p style={{ fontSize: 12, color: p.text, lineHeight: 1.7 }}>{slide.corps}</p>
      </div>
    )
    if (slide.type === 'cta') return (
      <div style={inner}>
        <p style={{ fontSize: 16, fontWeight: 500, color: p.text, lineHeight: 1.4, marginBottom: 10 }}>{slide.texte}</p>
        <p style={{ fontSize: 12, color: p.accent, fontStyle: 'italic' }}>{slide.question}</p>
      </div>
    )
    if (slide.type === 'devine_question') return (
      <div style={inner}>
        <p style={{ fontSize: 12, color: p.sub, marginBottom: 10, lineHeight: 1.5 }}>{slide.intro}</p>
        <p style={{ fontSize: 16, fontWeight: 500, color: p.text, lineHeight: 1.4 }}>{slide.question}</p>
      </div>
    )
    if (slide.type === 'devine_citation') return (
      <div style={inner}>
        <p style={{ fontSize: 10, color: p.sub, marginBottom: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Qui a dit...</p>
        <p style={{ fontSize: 14, fontWeight: 500, color: p.accent, fontStyle: 'italic', lineHeight: 1.5, marginBottom: 10 }}>"{slide.citation}"</p>
        <p style={{ fontSize: 11, color: p.sub, fontStyle: 'italic' }}>{slide.indice}</p>
      </div>
    )
    if (slide.type === 'devine_revelation') return (
      <div style={inner}>
        <p style={{ fontSize: 10, color: p.sub, marginBottom: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>C'était...</p>
        <p style={{ fontSize: 18, fontWeight: 500, color: p.accent, marginBottom: 10 }}>{slide.auteur}</p>
        <p style={{ fontSize: 12, color: p.text, lineHeight: 1.65 }}>{slide.bio}</p>
      </div>
    )
    if (slide.type === 'philo_question') return (
      <div style={inner}>
        <p style={{ fontSize: 10, color: p.sub, marginBottom: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>La question</p>
        <p style={{ fontSize: 16, fontWeight: 500, color: p.text, lineHeight: 1.4, marginBottom: 10 }}>{slide.question}</p>
        <p style={{ fontSize: 11, color: p.sub, fontStyle: 'italic' }}>{slide.teaser}</p>
      </div>
    )
    if (slide.type === 'philo_citation') return (
      <div style={inner}>
        <p style={{ fontSize: 10, color: p.sub, marginBottom: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{slide.penseur}</p>
        <p style={{ fontSize: 14, fontWeight: 500, color: p.accent, fontStyle: 'italic', lineHeight: 1.5, marginBottom: 8 }}>"{slide.citation}"</p>
        <p style={{ fontSize: 11, color: p.text, lineHeight: 1.6 }}>{slide.explication}</p>
      </div>
    )
    if (slide.type === 'philo_conclusion') return (
      <div style={inner}>
        <p style={{ fontSize: 10, color: p.sub, marginBottom: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>La réponse</p>
        <p style={{ fontSize: 15, fontWeight: 500, color: p.text, lineHeight: 1.4, marginBottom: 10 }}>{slide.conclusion}</p>
        <p style={{ fontSize: 12, color: p.accent, fontStyle: 'italic' }}>{slide.question_cta}</p>
      </div>
    )
    // Citation moderne
    if (slide.type === 'moderne_original') return (
      <div style={inner}>
        <p style={{ fontSize: 10, color: p.sub, marginBottom: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{slide.auteur} disait...</p>
        <p style={{ fontSize: 14, fontWeight: 500, color: p.accent, fontStyle: 'italic', lineHeight: 1.5, marginBottom: 10 }}>"{slide.citation}"</p>
        <p style={{ fontSize: 11, color: p.sub }}>Version originale</p>
      </div>
    )
    if (slide.type === 'moderne_traduction') return (
      <div style={inner}>
        <p style={{ fontSize: 10, color: p.sub, marginBottom: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>En 2024 ça donne...</p>
        <p style={{ fontSize: 15, fontWeight: 500, color: p.text, lineHeight: 1.5, marginBottom: 10 }}>"{slide.moderne}"</p>
        <p style={{ fontSize: 11, color: p.accent }}>{slide.contexte}</p>
      </div>
    )
    if (slide.type === 'moderne_cta') return (
      <div style={inner}>
        <p style={{ fontSize: 16, fontWeight: 500, color: p.text, lineHeight: 1.4, marginBottom: 10 }}>{slide.texte}</p>
        <p style={{ fontSize: 12, color: p.accent, fontStyle: 'italic' }}>{slide.question}</p>
      </div>
    )
    // Top 3
    if (slide.type === 'top3_intro') return (
      <div style={inner}>
        <p style={{ fontSize: 10, color: p.sub, marginBottom: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Top 3</p>
        <p style={{ fontSize: 18, fontWeight: 500, color: p.accent, marginBottom: 10 }}>{slide.auteur}</p>
        <p style={{ fontSize: 12, color: p.text, lineHeight: 1.5 }}>{slide.description}</p>
      </div>
    )
    if (slide.type === 'top3_citation') return (
      <div style={inner}>
        <p style={{ fontSize: 11, color: p.accent, marginBottom: 8, fontWeight: 500 }}>#{slide.numero}</p>
        <p style={{ fontSize: 14, fontWeight: 500, color: p.text, fontStyle: 'italic', lineHeight: 1.5, marginBottom: 10 }}>"{slide.citation}"</p>
        <p style={{ fontSize: 11, color: p.sub, lineHeight: 1.5 }}>{slide.explication}</p>
      </div>
    )
    if (slide.type === 'top3_cta') return (
      <div style={inner}>
        <p style={{ fontSize: 16, fontWeight: 500, color: p.text, lineHeight: 1.4, marginBottom: 10 }}>{slide.texte}</p>
        <p style={{ fontSize: 12, color: p.accent, fontStyle: 'italic' }}>{slide.question}</p>
      </div>
    )
    return null
  }

  return (
    <div id={id} style={base}>
      <div style={bgStyle}></div>
      <div style={overlayStyle}></div>
      <span style={num}>{index + 1}/{total}</span>
      {content()}
      <div style={line}></div>
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
  const [style, setStyle] = useState(STYLES[0])
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
      if (format === 0) result = await callAPI('/api/generate', { theme, style })
      else if (format === 1) result = await callAPI('/api/generate-devine', { theme, style })
      else if (format === 2) result = await callAPI('/api/generate-philo', { question: philoQ, style })
      else if (format === 3) result = await callAPI('/api/generate-moderne', { theme, style })
      else result = await callAPI('/api/generate-top3', { auteur, style })

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
        const canvas = await html2canvas(el, { scale: 4, useCORS: true, allowTaint: true })
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

  const palette = PALETTES[style] || PALETTES['sombre et épuré']
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
        <div className="ctrl">
          <label>Style visuel</label>
          <select value={style} onChange={e => setStyle(e.target.value)}>
            {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
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
                total={slides.length} palette={palette} bgImage={bgImages[i]} />
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
