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
  'citations de prison et résilience (Mandela, Malcolm X)': 'dramatic light strength',
  'femmes philosophes (Beauvoir, Angelou)': 'woman dramatic portrait light',
  'sagesse berbère et maghrébine': 'sahara desert dramatic dusk',
  'citations de guerriers (Sun Tzu, Spartiate)': 'warrior battle dramatic fog',
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

function cap(text, max) {
  if (!text) return ''
  const w = text.split(' ')
  return w.length > max ? w.slice(0, max).join(' ') + '…' : text
}

function getSlideContent(slide) {
  switch (slide.type) {
    case 'hook': return {
      badge: slide.origine?.toUpperCase(),
      top: slide.accroche,
      main: `"${cap(slide.citation, 10)}"`,
      sub: `— ${slide.auteur}`,
    }
    case 'intrigue': return {
      badge: 'SUSPENSE',
      main: cap(slide.question, 8),
    }
    case 'context': return {
      badge: slide.titre?.toUpperCase(),
      main: cap(slide.corps, 10),
    }
    case 'lesson': return {
      badge: slide.titre?.toUpperCase(),
      main: cap(slide.corps, 10),
    }
    case 'cta': return {
      badge: 'TOI',
      main: cap(slide.question, 10),
    }
    case 'devine_question': return {
      badge: "DEVINE",
      top: cap(slide.intro, 6),
      main: cap(slide.question, 8),
    }
    case 'devine_citation': return {
      badge: 'QUI A DIT...',
      main: `"${cap(slide.citation, 12)}"`,
      sub: cap(slide.indice, 8),
    }
    case 'devine_revelation': return {
      badge: "C'ÉTAIT...",
      main: slide.auteur,
      sub: cap(slide.bio, 14),
    }
    case 'philo_question': return {
      badge: 'LA QUESTION',
      main: cap(slide.question, 8),
      sub: cap(slide.teaser, 7),
    }
    case 'philo_citation': return {
      badge: slide.penseur?.toUpperCase(),
      main: `"${cap(slide.citation, 12)}"`,
      sub: cap(slide.explication, 8),
    }
    case 'philo_conclusion': return {
      badge: 'LA RÉPONSE',
      main: cap(slide.conclusion, 8),
      sub: cap(slide.question_cta, 8),
    }
    case 'moderne_original': return {
      badge: slide.auteur?.toUpperCase(),
      top: 'VERSION ORIGINALE',
      main: `"${cap(slide.citation, 10)}"`,
    }
    case 'moderne_traduction': return {
      badge: 'EN 2024...',
      main: `"${cap(slide.moderne, 12)}"`,
      sub: cap(slide.contexte, 7),
    }
    case 'moderne_cta': return {
      badge: 'TOI',
      main: cap(slide.texte, 7),
      sub: cap(slide.question, 7),
    }
    case 'top3_intro': return {
      badge: 'TOP 3',
      main: slide.auteur,
      sub: cap(slide.description, 10),
    }
    case 'top3_citation': return {
      badge: `#${slide.numero}`,
      main: `"${cap(slide.citation, 12)}"`,
      sub: cap(slide.explication, 7),
    }
    case 'top3_cta': return {
      badge: 'TOI',
      main: cap(slide.texte, 7),
      sub: slide.question,
    }
    default: return { main: '' }
  }
}

function Slide({ slide, index, total, bgImage, id }) {
  const { badge, top, main, sub } = getSlideContent(slide)

  return (
    <div id={id} style={{
      flexShrink: 0, width: 180, height: 320, borderRadius: 10,
      position: 'relative', overflow: 'hidden', background: '#0a0a0a',
      border: '0.5px solid rgba(255,255,255,0.08)',
    }}>
      {bgImage && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0,
        }} />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.65) 65%, rgba(0,0,0,0.94) 100%)',
        zIndex: 1,
      }} />

      <span style={{ position: 'absolute', top: 10, left: 12, fontSize: 9, color: 'rgba(255,255,255,0.45)', zIndex: 3 }}>
        {index + 1}/{total}
      </span>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '10px 14px 16px', zIndex: 2, textAlign: 'center',
      }}>
        {badge && (
          <p style={{ fontSize: 7, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em', marginBottom: 4, textTransform: 'uppercase' }}>
            {badge}
          </p>
        )}
        {top && (
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', marginBottom: 4, letterSpacing: '0.1em' }}>
            {top}
          </p>
        )}
        {main && (
          <p style={{
            fontSize: 12, fontWeight: 700, color: '#f0e040',
            lineHeight: 1.3, marginBottom: sub ? 5 : 0,
            textShadow: '0 1px 8px rgba(0,0,0,0.95)',
            wordBreak: 'break-word', overflow: 'hidden',
            display: '-webkit-box', WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
          }}>{main}</p>
        )}
        {sub && (
          <p style={{
            fontSize: 9, color: 'rgba(255,255,255,0.65)', lineHeight: 1.4,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            wordBreak: 'break-word',
          }}>{sub}</p>
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
      if (format === 0) result = await callAPI('/api/generate', { theme, style: 'sombre' })
      else if (format === 1) result = await callAPI('/api/generate-devine', { theme, style: 'sombre' })
      else if (format === 2) result = await callAPI('/api/generate-philo', { question: philoQ, style: 'sombre' })
      else if (format === 3) result = await callAPI('/api/generate-moderne', { theme, style: 'sombre' })
      else result = await callAPI('/api/generate-top3', { auteur, style: 'sombre' })

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
        const canvas = await html2canvas(el, { scale: 3, useCORS: true, allowTaint: true })
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
