import { useState, useEffect } from 'react'
import './App.css'

const PALETTES = {
  'sombre et épuré':    { bg: '#0f0f0f', text: '#f5f5f5', accent: '#d4af37', sub: '#888', badge: '#1a1a1a', badgeText: '#d4af37' },
  'minimaliste blanc':  { bg: '#fafafa', text: '#111',    accent: '#333',    sub: '#777', badge: '#e8e8e8', badgeText: '#444'    },
  'doré et luxueux':    { bg: '#1a1200', text: '#f5e6a0', accent: '#d4af37', sub: '#a08c40', badge: '#2a1e00', badgeText: '#d4af37' },
  'coloré et énergique':{ bg: '#1a0533', text: '#fff',    accent: '#b24bf3', sub: '#c9a0f7', badge: '#2a0a4a', badgeText: '#e0b0ff' },
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
  'Pourquoi le monde n\'a pas de sens — selon Camus',
  'Pourquoi souffrons-nous — selon les stoïciens',
  'C\'est quoi la liberté vraiment — selon Sartre',
  'Pourquoi l\'argent ne rend pas heureux — selon Épictète',
  'Pourquoi on a peur de la mort — selon Marc Aurèle',
  'C\'est quoi l\'amour selon les Grecs',
  'Pourquoi l\'homme cherche toujours plus — selon les bouddhistes',
  'Qu\'est-ce que le temps — selon Augustin',
]

const STYLES = Object.keys(PALETTES)
const API_BASE = import.meta.env.VITE_API_URL || ''
const FORMATS = ['Carrousel', 'Devine l\'auteur', 'Philo Express']

function Slide({ slide, index, total, palette, id }) {
  const p = palette
  const base = {
    flexShrink: 0, width: 180, height: 320, borderRadius: 12,
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    alignItems: 'center', padding: '24px 16px', textAlign: 'center',
    position: 'relative', background: p.bg,
    border: '0.5px solid rgba(128,128,128,0.15)',
  }
  const num = { position: 'absolute', top: 12, left: 14, fontSize: 10, color: p.sub }
  const line = { position: 'absolute', bottom: 0, left: '20%', width: '60%', height: 2, background: p.accent, borderRadius: 2 }

  const content = () => {
    if (slide.type === 'hook') return (
      <>
        <p style={{ fontSize: 11, color: p.sub, marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{slide.origine}</p>
        <p style={{ fontSize: 18, fontWeight: 500, color: p.accent, fontStyle: 'italic', lineHeight: 1.45, marginBottom: 12 }}>"{slide.citation}"</p>
        <p style={{ fontSize: 11, color: p.sub }}>— {slide.auteur}</p>
        <div style={line}></div>
      </>
    )
    if (slide.type === 'intrigue') return (
      <>
        <p style={{ fontSize: 22, fontWeight: 500, color: p.text, lineHeight: 1.3, marginBottom: 12 }}>{slide.question}</p>
        <p style={{ fontSize: 12, color: p.sub, lineHeight: 1.5 }}>{slide.teaser}</p>
      </>
    )
    if (slide.type === 'context' || slide.type === 'lesson') return (
      <>
        <p style={{ fontSize: 12, fontWeight: 500, color: p.accent, marginBottom: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{slide.titre}</p>
        <p style={{ fontSize: 13, color: p.text, lineHeight: 1.65 }}>{slide.corps}</p>
      </>
    )
    if (slide.type === 'cta') return (
      <>
        <p style={{ fontSize: 20, fontWeight: 500, color: p.text, lineHeight: 1.35, marginBottom: 14 }}>{slide.texte}</p>
        <p style={{ fontSize: 13, color: p.accent, fontStyle: 'italic' }}>{slide.question}</p>
        <div style={line}></div>
      </>
    )
    // Format Devine
    if (slide.type === 'devine_question') return (
      <>
        <p style={{ fontSize: 13, color: p.sub, marginBottom: 14, lineHeight: 1.5 }}>{slide.intro}</p>
        <p style={{ fontSize: 22, fontWeight: 500, color: p.text, lineHeight: 1.3 }}>{slide.question}</p>
      </>
    )
    if (slide.type === 'devine_citation') return (
      <>
        <p style={{ fontSize: 11, color: p.sub, marginBottom: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Qui a dit...</p>
        <p style={{ fontSize: 17, fontWeight: 500, color: p.accent, fontStyle: 'italic', lineHeight: 1.5, marginBottom: 14 }}>"{slide.citation}"</p>
        <p style={{ fontSize: 13, color: p.sub }}>{slide.indice}</p>
        <div style={line}></div>
      </>
    )
    if (slide.type === 'devine_revelation') return (
      <>
        <p style={{ fontSize: 11, color: p.sub, marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>C'était...</p>
        <p style={{ fontSize: 22, fontWeight: 500, color: p.accent, marginBottom: 10 }}>{slide.auteur}</p>
        <p style={{ fontSize: 12, color: p.text, lineHeight: 1.6 }}>{slide.bio}</p>
        <div style={line}></div>
      </>
    )
    // Format Philo Express
    if (slide.type === 'philo_question') return (
      <>
        <p style={{ fontSize: 11, color: p.sub, marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>La question</p>
        <p style={{ fontSize: 20, fontWeight: 500, color: p.text, lineHeight: 1.35, marginBottom: 12 }}>{slide.question}</p>
        <p style={{ fontSize: 12, color: p.sub, fontStyle: 'italic' }}>{slide.teaser}</p>
      </>
    )
    if (slide.type === 'philo_citation') return (
      <>
        <p style={{ fontSize: 11, color: p.sub, marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{slide.penseur}</p>
        <p style={{ fontSize: 16, fontWeight: 500, color: p.accent, fontStyle: 'italic', lineHeight: 1.5, marginBottom: 10 }}>"{slide.citation}"</p>
        <p style={{ fontSize: 12, color: p.text, lineHeight: 1.55 }}>{slide.explication}</p>
      </>
    )
    if (slide.type === 'philo_conclusion') return (
      <>
        <p style={{ fontSize: 11, color: p.sub, marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>La réponse</p>
        <p style={{ fontSize: 17, fontWeight: 500, color: p.text, lineHeight: 1.4, marginBottom: 12 }}>{slide.conclusion}</p>
        <p style={{ fontSize: 13, color: p.accent, fontStyle: 'italic' }}>{slide.question_cta}</p>
        <div style={line}></div>
      </>
    )
    return null
  }

  return (
    <div id={id} style={base}>
      <span style={num}>{index + 1}/{total}</span>
      {content()}
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
  const [style, setStyle] = useState(STYLES[0])
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const generate = async () => {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      let result
      if (format === 0) result = await callAPI('/api/generate', { theme, style })
      else if (format === 1) result = await callAPI('/api/generate-devine', { theme, style })
      else result = await callAPI('/api/generate-philo', { question: philoQ, style })
      setData(result)
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
        const canvas = await html2canvas(el, { scale: 4, backgroundColor: null, useCORS: true })
        const link = document.createElement('a')
        link.download = `slide-${i + 1}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
        await new Promise(r => setTimeout(r, 400))
      }
    } catch (e) {
      alert('Erreur export: ' + e.message)
    }
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
          <button key={i} className={`ftab${format === i ? ' active' : ''}`} onClick={() => { setFormat(i); setData(null); setError(null); }}>
            {f}
          </button>
        ))}
      </div>

      <div className="controls">
        {format === 0 && (
          <div className="ctrl">
            <label>Thème</label>
            <select value={theme} onChange={e => setTheme(e.target.value)}>
              {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        )}
        {format === 1 && (
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
              <Slide key={i} id={`slide-${i}`} slide={slide} index={i} total={slides.length} palette={palette} />
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
