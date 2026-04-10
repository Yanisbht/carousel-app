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
  "T'arrives pas à être heureux ? Camus avait la réponse",
  "Pourquoi tu souffres autant ? Les stoïciens l'expliquent",
  "C'est quoi vraiment être libre ? Sartre te répond",
  "L'argent rend-il vraiment heureux ? Épictète dit non",
  "T'as peur de mourir ? Marc Aurèle avait réglé ça",
  "C'est quoi l'amour pour de vrai ? Les Grecs avaient 6 mots pour ça",
  "Pourquoi t'en veux toujours plus ? Le bouddhisme explique",
  "Tu te sens seul même entouré ? Épictète t'explique pourquoi",
  "Pourquoi tu procrastines autant ? Les stoïciens avaient vu venir",
  "C'est quoi le vrai courage ? Aristote t'étonnerait",
  "Pourquoi les autres t'énervent ? Marc Aurèle avait la solution",
  "T'as l'impression que ta vie a pas de sens ? Camus répond",
]

const AUTEURS = [
  'Marc Aurèle', 'Épictète', 'Sénèque', 'Socrate', 'Platon',
  'Aristote', 'Rumi', 'Ibn Khaldoun', 'Confucius', 'Lao Tseu',
  'Sun Tzu', 'Miyamoto Musashi', 'Nelson Mandela', 'Malcolm X',
  'Simone de Beauvoir', 'Maya Angelou', 'Nietzsche', 'Camus', 'Sartre',
]

const THEME_STYLE = {
  'philosophie stoïcienne':                              { color: 'rgba(30,60,120,0.55)',  accent: '#a8c8ff', keyword: 'ancient greece ruins dramatic' },
  'sagesse africaine':                                   { color: 'rgba(120,60,10,0.55)',  accent: '#ffb347', keyword: 'africa savanna golden hour' },
  'philosophie orientale':                               { color: 'rgba(10,80,60,0.55)',   accent: '#7fffd4', keyword: 'japan misty mountain temple' },
  'leaders et révolutionnaires':                         { color: 'rgba(100,10,10,0.55)',  accent: '#ff6b6b', keyword: 'dramatic crowd protest light' },
  'philosophie arabe et islamique':                      { color: 'rgba(60,30,100,0.55)',  accent: '#c9a0ff', keyword: 'arabic mosque dramatic light' },
  'développement personnel moderne':                     { color: 'rgba(10,60,80,0.55)',   accent: '#80d8ff', keyword: 'dramatic sunrise mountain' },
  'sagesse amérindienne':                                { color: 'rgba(60,80,10,0.55)',   accent: '#b8e986', keyword: 'native american forest dramatic' },
  'philosophie japonaise (Musashi, Mishima)':            { color: 'rgba(60,10,10,0.55)',   accent: '#ff8a80', keyword: 'japan forest fog samurai' },
  'citations de prison et résilience (Mandela, Malcolm X)': { color: 'rgba(20,20,20,0.60)', accent: '#e0e0e0', keyword: 'dramatic light strength' },
  'femmes philosophes (Beauvoir, Angelou)':              { color: 'rgba(100,20,60,0.55)', accent: '#f48fb1', keyword: 'woman dramatic portrait light' },
  'sagesse berbère et maghrébine':                       { color: 'rgba(100,70,10,0.55)', accent: '#ffd54f', keyword: 'sahara desert dramatic dusk' },
  'citations de guerriers (Sun Tzu, Spartiate)':         { color: 'rgba(40,40,10,0.55)',  accent: '#e6ee9c', keyword: 'warrior battle dramatic fog' },
  'spiritualité soufie (Rumi, Ibn Arabi)':               { color: 'rgba(60,10,80,0.55)',  accent: '#ce93d8', keyword: 'mystical light spiritual fog' },
  'philosophie grecque antique (Socrate, Platon)':       { color: 'rgba(10,50,80,0.55)',  accent: '#90caf9', keyword: 'ancient ruins dramatic sky' },
}

const DEFAULT_STYLE = { color: 'rgba(20,20,20,0.55)', accent: '#f0e040', keyword: 'dramatic cinematic landscape' }

const PEXELS_KEY = 'UHgkq1JFa5yzly6gsz5SIYIacRwUqwnTVRBeKzo99Jw4pzH5ovRoMr10'
const UNSPLASH_KEY = 'yJiL3y_23RkNOFzreNI894AYyKaYB8UnS8pbqDYH1KU'
const API_BASE = import.meta.env.VITE_API_URL || ''
const FORMATS = ['Carrousel', "Devine l'auteur", 'Philo Express', 'Citation moderne', 'Top 3 auteur', 'Depuis vidéo']

async function fetchPexelsImages(query, count) {
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=20&orientation=portrait`, {
      headers: { Authorization: PEXELS_KEY }
    })
    const data = await res.json()
    if (data.photos && data.photos.length > 0) {
      const shuffled = [...data.photos].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, count).map(p => p.src.large)
    }
  } catch (e) {}
  return Array(count).fill(null)
}

async function fetchUnsplashImages(query, count) {
  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20&orientation=portrait`, {
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` }
    })
    const data = await res.json()
    if (data.results && data.results.length > 0) {
      const shuffled = [...data.results].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, count).map(p => p.urls.regular)
    }
  } catch (e) {}
  return Array(count).fill(null)
}

async function fetchImages(query, count) {
  const useUnsplash = Math.random() > 0.5
  const imgs = useUnsplash
    ? await fetchUnsplashImages(query, count)
    : await fetchPexelsImages(query, count)
  const hasNulls = imgs.some(i => i === null)
  if (hasNulls) {
    const fallback = useUnsplash
      ? await fetchPexelsImages(query, count)
      : await fetchUnsplashImages(query, count)
    return imgs.map((img, i) => img || fallback[i] || null)
  }
  return imgs
}

function cap(text, max) {
  if (!text) return ''
  const w = text.split(' ')
  return w.length > max ? w.slice(0, max).join(' ') + '…' : text
}

function getSlideContent(slide) {
  switch (slide.type) {
    case 'hook': return { badge: slide.origine?.toUpperCase(), main: `"${cap(slide.citation, 10)}"`, sub: `— ${slide.auteur}` }
    case 'intrigue': return { badge: 'SUSPENSE', main: cap(slide.question, 8) }
    case 'context': return { badge: slide.titre?.toUpperCase(), main: cap(slide.corps, 10) }
    case 'lesson': return { badge: slide.titre?.toUpperCase(), main: cap(slide.corps, 10) }
    case 'cta': return { badge: 'TOI', main: cap(slide.question, 10) }
    case 'devine_question': return { badge: 'DEVINE', top: cap(slide.intro, 6), main: cap(slide.question, 8) }
    case 'devine_citation': return { badge: 'QUI A DIT...', main: `"${cap(slide.citation, 12)}"`, sub: cap(slide.indice, 8) }
    case 'devine_revelation': return { badge: "C'ÉTAIT...", main: slide.auteur, sub: cap(slide.bio, 14) }
    case 'philo_question': return { badge: 'LA QUESTION', main: cap(slide.question, 8), sub: cap(slide.teaser, 7) }
    case 'philo_citation': return { badge: slide.penseur?.toUpperCase(), main: `"${cap(slide.citation, 12)}"`, sub: cap(slide.explication, 8) }
    case 'philo_conclusion': return { badge: 'LA RÉPONSE', main: cap(slide.conclusion, 8), sub: cap(slide.question_cta, 8) }
    case 'moderne_original': return { badge: slide.auteur?.toUpperCase(), top: 'VERSION ORIGINALE', main: `"${cap(slide.citation, 10)}"` }
    case 'moderne_traduction': return { badge: 'EN 2024...', main: `"${cap(slide.moderne, 12)}"`, sub: cap(slide.contexte, 7) }
    case 'moderne_cta': return { badge: 'TOI', main: cap(slide.texte, 7), sub: cap(slide.question, 7) }
    case 'philo_reponse': return { badge: slide.penseur?.toUpperCase(), top: 'SA RÉPONSE', main: cap(slide.reponse, 10), sub: null }
    case 'philo_qui': return { badge: slide.epoque?.toUpperCase(), main: slide.penseur, sub: cap(slide.fait, 10) }
    case 'top3_intro': return { badge: 'TOP 3', main: slide.auteur, sub: cap(slide.description, 10) }
    case 'top3_citation': return { badge: `#${slide.numero}`, main: `"${cap(slide.citation, 12)}"`, sub: cap(slide.explication, 7) }
    case 'top3_cta': return { badge: 'TOI', main: cap(slide.texte, 7), sub: slide.question }
    case 'video_hook': return { badge: slide.concept?.toUpperCase(), main: cap(slide.accroche, 10) }
    case 'video_explication': return { badge: slide.titre?.toUpperCase(), main: cap(slide.corps, 10) }
    case 'video_exemple': return { badge: 'PAR EXEMPLE', main: cap(slide.exemple, 10) }
    case 'video_cta': return { badge: 'TOI', main: cap(slide.texte, 8), sub: cap(slide.question, 8) }
    default: return { main: '' }
  }
}

function Slide({ slide, index, total, bgImage, themeStyle, id }) {
  const { badge, top, main, sub } = getSlideContent(slide)
  const accent = themeStyle?.accent || '#f0e040'
  const colorOverlay = themeStyle?.color || 'rgba(20,20,20,0.55)'

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
      <div style={{ position: 'absolute', inset: 0, background: colorOverlay, zIndex: 1 }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.2)',
        zIndex: 2,
      }} />

      <span style={{ position: 'absolute', top: 10, left: 12, fontSize: 9, color: 'rgba(255,255,255,0.4)', zIndex: 4 }}>
        {index + 1}/{total}
      </span>

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 3,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '40px 18px 24px', textAlign: 'center',
        gap: 10, boxSizing: 'border-box',
      }}>
        {badge && (
          <p style={{ fontSize: 7, color: `${accent}cc`, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 500 }}>
            {badge}
          </p>
        )}
        {top && (
          <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>{top}</p>
        )}
        {main && (
          <p style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 18, fontWeight: 900, color: '#FFFFFF',
            lineHeight: 1.3, textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            wordBreak: 'break-word', overflow: 'hidden',
            display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical',
            textWrap: 'balance', textAlign: 'center',
          }}>{main}</p>
        )}
        {sub && (
          <p style={{
            fontSize: 10, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4, fontStyle: 'italic',
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>{sub}</p>
        )}
      </div>
    </div>
  )
}

async function callAPI(endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
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
  const [transcription, setTranscription] = useState('')
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [data, setData] = useState(null)
  const [bgImages, setBgImages] = useState([])
  const [error, setError] = useState(null)

  const themeStyle = THEME_STYLE[theme] || DEFAULT_STYLE

  const generate = async () => {
    setLoading(true); setError(null); setData(null); setBgImages([])
    try {
      let result
      if (format === 0) result = await callAPI('/api/generate', { theme, style: 'sombre' })
      else if (format === 1) result = await callAPI('/api/generate-devine', { theme, style: 'sombre' })
      else if (format === 2) result = await callAPI('/api/generate-philo', { question: philoQ, style: 'sombre' })
      else if (format === 3) result = await callAPI('/api/generate-moderne', { theme, style: 'sombre' })
      else if (format === 4) result = await callAPI('/api/generate-top3', { auteur, style: 'sombre' })
      else result = await callAPI('/api/generate-video', { transcription, style: 'sombre' })

      setData(result)
      const imgs = await fetchImages(themeStyle.keyword, (result.slides || []).length)
      setBgImages(imgs)
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  const downloadAll = async () => {
    setExporting(true)
    try {
      const { default: html2canvas } = await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js')
      for (let i = 0; i < (data?.slides || []).length; i++) {
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
        {format === 5 && (
          <div className="ctrl" style={{flex: '1 1 100%'}}>
            <label>Colle ta transcription</label>
            <textarea value={transcription} onChange={e => setTranscription(e.target.value)} rows={5} placeholder="Colle ici la transcription de ta vidéo YouTube..." style={{width: '100%', background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-secondary)', borderRadius: 8, padding: '8px 12px', color: 'var(--color-text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', resize: 'vertical'}} />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 12px' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: themeStyle.accent }}></div>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{theme}</span>
          </div>
          <div className="slides-row">
            {slides.map((slide, i) => (
              <Slide key={i} id={`slide-${i}`} slide={slide} index={i}
                total={slides.length} bgImage={bgImages[i]} themeStyle={themeStyle} />
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
