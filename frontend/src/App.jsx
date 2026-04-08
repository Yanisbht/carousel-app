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

const STYLES = Object.keys(PALETTES)
const SLIDE_LABELS = ['intro', 'citation', 'contexte', 'leçon', 'cta']
const API_BASE = import.meta.env.VITE_API_URL || ''

function Slide({ slide, index, palette, id }) {
  const p = palette
  const label = SLIDE_LABELS[index] || slide.type

  const content = () => {
    if (slide.type === 'cover') return (
      <>
        <p style={{ fontSize: 17, fontWeight: 500, color: p.text, lineHeight: 1.4, marginBottom: 10 }}>{slide.titre}</p>
        <p style={{ fontSize: 12, color: p.sub, lineHeight: 1.5 }}>{slide.soustitre}</p>
      </>
    )
    if (slide.type === 'quote') return (
      <>
        <p style={{ fontSize: 13, color: p.accent, fontStyle: 'italic', lineHeight: 1.6, marginBottom: 10 }}>"{slide.texte}"</p>
        <p style={{ fontSize: 11, color: p.sub, fontWeight: 500 }}>— {slide.auteur}</p>
      </>
    )
    if (slide.type === 'context' || slide.type === 'lesson') return (
      <>
        <p style={{ fontSize: 13, fontWeight: 500, color: p.accent, marginBottom: 10 }}>{slide.titre}</p>
        <p style={{ fontSize: 11, color: p.text, lineHeight: 1.6, opacity: 0.85 }}>{slide.corps}</p>
      </>
    )
    if (slide.type === 'cta') return (
      <>
        <p style={{ fontSize: 15, fontWeight: 500, color: p.text, lineHeight: 1.4, marginBottom: 10 }}>{slide.texte}</p>
        <p style={{ fontSize: 11, color: p.accent }}>{slide.sub}</p>
      </>
    )
    return null
  }

  return (
    <div id={id} style={{
      flexShrink: 0, width: 200, height: 355, borderRadius: 12,
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      alignItems: 'center', padding: '20px 16px', textAlign: 'center',
      position: 'relative', background: p.bg,
      border: '0.5px solid rgba(128,128,128,0.2)',
    }}>
      <span style={{ position: 'absolute', top: 12, left: 16, fontSize: 11, color: p.sub, fontWeight: 500 }}>{index + 1}/5</span>
      <span style={{
        position: 'absolute', top: 12, right: 12, fontSize: 10,
        padding: '2px 8px', borderRadius: 20,
        background: p.badge, color: p.badgeText, fontWeight: 500,
      }}>{label}</span>
      {content()}
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useState(THEMES[0])
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
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, style }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Erreur serveur')
      const parsed = typeof json.data === 'string' ? JSON.parse(json.data) : json.data
      setData(parsed)
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  const downloadAll = async () => {
    setExporting(true)
    try {
      const { default: html2canvas } = await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js')
      for (let i = 0; i < 5; i++) {
        const el = document.getElementById(`slide-${i}`)
        if (!el) continue
        const canvas = await html2canvas(el, { scale: 3, backgroundColor: null, useCORS: true })
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

  return (
    <div className="app">
      <header>
        <h1>Carousel Generator</h1>
        <p className="subtitle">Citations du monde — TikTok</p>
      </header>

      <div className="controls">
        <div className="ctrl">
          <label>Thème</label>
          <select value={theme} onChange={e => setTheme(e.target.value)}>
            {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
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
      {loading && <div className="status">L'agent crée ton carrousel...</div>}

      {data && (
        <>
          <div className="slides-row">
            {(data.slides || []).map((slide, i) => (
              <Slide key={i} id={`slide-${i}`} slide={slide} index={i} palette={palette} />
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
