import { useState } from 'react'
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
  'philosophie existentialiste (Camus, Sartre, Beauvoir)',
  'philosophie nietzscheenne',
  'bouddhisme et pleine conscience',
  'philosophie indienne (Veda, Upanishad, Gandhi)',
  'sagesse chinoise (Confucius, Lao Tseu, Zhuangzi)',
  'philosophie latine (Ciceron, Virgile, Horace)',
  "philosophie medievale (Thomas d'Aquin, Ibn Rushd)",
  'philosophie des Lumieres (Voltaire, Rousseau, Montesquieu)',
  'philosophie allemande (Kant, Hegel, Schopenhauer)',
  'citations de scientifiques (Einstein, Feynman, Curie)',
  'sagesse des peuples du monde (proverbes universels)',
  'philosophie politique (Machiavel, Hobbes, Locke)',
  "philosophie de l'amour et des relations",
  'philosophie de la mort et du temps',
  'philosophie du bonheur et de la joie',
  'sagesse des nomades et des voyageurs',
  "philosophie de la creativite et de l'art",
  'citations litteraires (Hugo, Proust, Dostoievski)',
]

const AUTEURS = [
  'Marc Aurele', 'Epictete', 'Seneque', 'Socrate', 'Platon', 'Aristote',
  'Rumi', 'Ibn Khaldoun', 'Confucius', 'Lao Tseu', 'Sun Tzu', 'Miyamoto Musashi',
  'Nelson Mandela', 'Malcolm X', 'Simone de Beauvoir', 'Maya Angelou',
  'Nietzsche', 'Camus', 'Sartre',
]

const THEME_STYLE = {}
const DEFAULT_STYLE = { color: 'rgba(0,0,0,0.25)', accent: '#ffffff' }

const UNSPLASH_KEY = 'yJiL3y_23RkNOFzreNI894AYyKaYB8UnS8pbqDYH1KU'
const API_BASE = import.meta.env.VITE_API_URL || ''
const FORMATS = ['Philosophes 2026', 'Ma pensee', 'Films', 'Carrousel', 'Emotionnel']

async function toBase64(url) {
  try {
    const res = await fetch(`${API_BASE}/api/proxy-image?url=${encodeURIComponent(url)}`)
    const blob = await res.blob()
    return new Promise(resolve => { const r = new FileReader(); r.onloadend = () => resolve(r.result); r.readAsDataURL(blob) })
  } catch (e) { return url }
}

async function fetchOneUnsplashRandom(query) {
  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=portrait&count=1`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    )
    const data = await res.json()
    if (Array.isArray(data) && data[0]) return data[0].urls.regular
  } catch (e) {}
  return null
}

const MOON_QUERIES = [
  'moon night sky dark',
  'crescent moon dark sky',
  'full moon night',
  'moon clouds night dark',
  'night sky stars moon',
  'moonlight dark sky',
]

const LIFESTYLE_QUERIES = [
  'luxury lifestyle desert aesthetic',
  'athlete training aesthetic',
  'rooftop city view aesthetic',
  'sunset luxury lifestyle aesthetic',
  'sport motivation aesthetic dark',
]

async function fetchImages(query, count) {
  const shuffled = [...MOON_QUERIES].sort(() => Math.random() - 0.5)
  const results = await Promise.all(
    Array.from({ length: count }, (_, i) =>
      fetchOneUnsplashRandom(query || shuffled[i % shuffled.length])
    )
  )
  return results.filter(Boolean)
}

function cap(text, max) {
  if (!text) return ''
  return text.replace(/\.{2,}/g, '.').replace(/\u2026/g, '').replace(/\s+\./g, '.').trim()
}

function getSlideContent(slide) {
  switch (slide.type) {
    case 'hook': return { main: cap(slide.citation, 5), sub: slide.auteur || null }
    case 'intrigue': return { main: cap(slide.question, 5) }
    case 'context': return { main: cap(slide.corps, 10) }
    case 'lesson': return { main: cap(slide.corps, 7) }
    case 'cta': return { main: cap(slide.question, 10) }
    case 'devine_question': return { main: cap(slide.question, 8) }
    case 'devine_citation': return { main: `"${cap(slide.citation, 12)}"` }
    case 'devine_revelation': return { main: slide.auteur, sub: cap(slide.bio, 14) }
    case 'philo_question': return { main: cap(slide.question, 8) }
    case 'philo_reponse': return { main: cap(slide.reponse, 10), sub: slide.citation ? `"${cap(slide.citation, 8)}"` : null }
    case 'philo_qui': return { main: slide.penseur, sub: cap(slide.fait, 10) }
    case 'philo_conclusion': return { main: cap(slide.conclusion, 8), sub: cap(slide.question_cta, 8) }
    case 'top3_intro': return { main: slide.auteur, sub: cap(slide.description, 10) }
    case 'top3_citation': return { main: `"${cap(slide.citation, 12)}"`, sub: cap(slide.explication, 7) }
    case 'top3_cta': return { main: cap(slide.texte, 7), sub: slide.question }
    case 'video_hook': return { main: cap(slide.accroche, 6) }
    case 'video_explication': return { main: cap(slide.corps, 8) }
    case 'video_exemple': return { main: cap(slide.exemple, 10) }
    case 'video_cta': return { main: cap(slide.texte, 8) }
    case 'oneshot': return { main: cap(slide.phrase, 15) }
    case 'pensee': return { main: slide.texte || '' }
    case 'film': return { main: cap(slide.texte || '', 20) }
    case 'philo2026': return { main: cap(slide.texte || '', 20) }
    default: return { main: '' }
  }
}

// ---- SLIDE PHILO 2026 — Option C (image plein cadre + bande blanche) ----
function SlidePhilo2026({ slide, bgImage, id }) {
  const philosophe = (slide.philosophe || '').toUpperCase()
  const sujet = (slide.sujet || '').toUpperCase()
  const teaser = slide.teaser || slide.texte || ''

  // Hauteur bande blanche : 42% de 320px = ~135px
  const bandH = 135

  return (
    <div id={id} style={{
      flexShrink: 0,
      width: 180,
      height: 320,
      borderRadius: 10,
      position: 'relative',
      overflow: 'hidden',
      background: '#222',
      border: '0.5px solid rgba(0,0,0,0.12)',
    }}>

      {/* IMAGE PLEIN CADRE — toute la slide */}
      {bgImage
        ? <img src={bgImage} alt="" style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 20%',
            filter: 'grayscale(100%) contrast(1.2) brightness(0.8)',
            zIndex: 1,
          }} />
        : <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'linear-gradient(160deg, #2a2a2a 0%, #111 100%)',
          }} />
      }

      {/* DEGRADE haut de la bande vers transparent */}
      <div style={{
        position: 'absolute', bottom: bandH - 30, left: 0, right: 0,
        height: 60,
        background: 'linear-gradient(to bottom, transparent, #fff)',
        zIndex: 2,
      }} />

      {/* BANDE BLANCHE BAS */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: bandH,
        background: '#fff',
        zIndex: 3,
        padding: '10px 12px 12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}>

        {/* Tag catégorie */}
        <span style={{
          fontSize: 6.5,
          fontWeight: 700,
          letterSpacing: '0.18em',
          color: '#bbb',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: 5,
          fontFamily: 'sans-serif',
        }}>PHILO × MODERNITÉ</span>

        {/* Titre principal */}
        <div style={{
          fontSize: 18,
          fontWeight: 900,
          lineHeight: 0.93,
          letterSpacing: '-0.02em',
          color: '#000',
          textTransform: 'uppercase',
          marginBottom: 7,
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          wordBreak: 'break-word',
        }}>
          {philosophe}<br/>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#888' }}>FACE À</span><br/>
          {sujet}
        </div>

        {/* Règle */}
        <div style={{ width: 20, height: 2, background: '#000', marginBottom: 6 }} />

        {/* Teaser */}
        <div style={{
          fontSize: 7.5,
          fontWeight: 400,
          lineHeight: 1.4,
          color: '#555',
          fontStyle: 'italic',
          fontFamily: 'sans-serif',
          overflow: 'hidden',
        }}>{teaser}</div>

      </div>
    </div>
  )
}

// ---- SLIDE GENERIQUE ----
function Slide({ slide, index, total, bgImage, themeStyle, id, decorImage }) {
  // Rendu special pour philo2026 — détection par type OU par présence du champ philosophe
  if (slide.type === 'philo2026' || slide.philosophe) {
    return <SlidePhilo2026 slide={slide} bgImage={bgImage} id={id} />
  }

  const { main, sub } = getSlideContent(slide)
  const isOneShot = slide.type === 'oneshot'
  const isPenseeSlide = slide.type === 'pensee'
  const chars = (main || '').length
  const baseSize = chars <= 8 ? 52 : chars <= 14 ? 40 : chars <= 20 ? 30 : chars <= 30 ? 22 : 16
  const sizeMultiplier = index === 0 ? 1 : index === 1 ? 0.82 : 0.70
  const fontSize = Math.round(baseSize * sizeMultiplier)

  return (
    <div id={id} style={{
      flexShrink: 0, width: 180, height: 320, borderRadius: 10,
      position: 'relative', overflow: 'hidden', background: '#fff',
      border: '0.5px solid rgba(0,0,0,0.08)',
    }}>
      {bgImage && <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0,
        filter: 'brightness(0.5) saturate(0.7)',
      }} />}
      <div style={{ position: 'absolute', inset: 0, background: '#fff', zIndex: 1 }} />
      {decorImage && (
        <img src={decorImage} alt="" crossOrigin="anonymous" style={{
          position: 'absolute', bottom: 60, right: 12,
          width: 110, height: 110, objectFit: 'contain', zIndex: 4,
        }} />
      )}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-start', alignItems: isOneShot ? 'center' : 'flex-start',
        padding: isPenseeSlide ? '80px 24px 100px 24px' : isOneShot ? '80px 24px' : '80px 14px 28px',
        gap: 10,
      }}>
        {main && <p style={{
          fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
          fontSize, fontWeight: isOneShot ? 300 : 900,
          color: '#000000',
          lineHeight: isOneShot ? 1.6 : 0.95,
          letterSpacing: isOneShot ? '0.01em' : '-0.02em',
          textTransform: isOneShot ? 'none' : 'uppercase',
          textAlign: isOneShot ? 'center' : 'left',
          wordBreak: 'break-word', overflowWrap: 'break-word',
          width: '100%', margin: 0,
        }}>{main}</p>}
        {sub && <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 9, fontWeight: 400,
          color: 'rgba(0,0,0,0.4)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginTop: 8,
        }}>{sub}</p>}
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
  const [transcription, setTranscription] = useState('')
  const [pensee, setPensee] = useState('')
  const [decorImage, setDecorImage] = useState(null)
  const [sujet, setSujet] = useState('')
  const [nbSlides, setNbSlides] = useState(5)
  const [film, setFilm] = useState('La Haine')
  const [philosophe, setPhilosophe] = useState('Socrate')
  const [sujetModerne, setSujetModerne] = useState('Tinder')
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
      if (format === 0) result = await callAPI('/api/generate-philo2026', { philosophe, sujet: sujetModerne })
      else if (format === 1) result = await callAPI('/api/generate-pensee', { texte: pensee, nbSlides: String(nbSlides) })
      else if (format === 2) result = await callAPI('/api/generate-film', { film })
      else if (format === 3) result = await callAPI('/api/generate', { theme, style: 'sombre', sujet })
      else result = await callAPI('/api/generate-emotionnel', { theme, style: 'sombre', sujet })

      setData(result)
      const slideCount = (result.slides || []).length
      const isPensee = format === 1

      let imgs
      if (isPensee) {
        imgs = Array(slideCount).fill(null)
      } else if (format === 0) {
        // Format Philo 2026 : image de buste / statue du philosophe
        const philoQuery = `${philosophe} ancient philosopher marble bust statue`
        const raw = await fetchImages(philoQuery, slideCount)
        imgs = await Promise.all(raw.map(url => url ? toBase64(url) : null))
      } else {
        const raw = await fetchImages('', slideCount)
        imgs = await Promise.all(raw.map(url => url ? toBase64(url) : null))
      }
      setBgImages(imgs)
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  const downloadAll = async () => {
    setExporting(true)
    try {
      const total = (data?.slides || []).slice(0, 3).length
      for (let i = 0; i < total; i++) {
        const el = document.getElementById(`slide-${i}`)
        if (!el) continue
        const canvas = await window.html2canvas(el, { scale: 6, useCORS: true, allowTaint: true, backgroundColor: '#fff' })
        const link = document.createElement('a')
        link.download = `slide-${i + 1}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
        await new Promise(r => setTimeout(r, 300))
      }
    } catch (e) { alert('Erreur export: ' + e.message) }
    setExporting(false)
  }

  const slides = format === 1
    ? (data?.slides || []).slice(0, nbSlides)
    : (data?.slides || []).slice(0, 3)

  return (
    <div className="app">
      <header>
        <h1>Philosophes 2026</h1>
        <p className="subtitle">la philo face au monde moderne</p>
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
        {/* Format 0 — Philosophes 2026 */}
        {format === 0 && (
          <>
            <div className="ctrl">
              <label>Philosophe</label>
              <select value={philosophe} onChange={e => setPhilosophe(e.target.value)}>
                {['Socrate','Platon','Aristote','Diogene','Epictete','Marc Aurele','Seneque',
                  'Nietzsche','Schopenhauer','Kant','Hegel','Sartre','Camus',
                  'Simone de Beauvoir','Foucault','Deleuze','Spinoza','Descartes',
                  'Pascal','Confucius','Lao Tseu'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="ctrl">
              <label>Sujet moderne</label>
              <input type="text" value={sujetModerne} onChange={e => setSujetModerne(e.target.value)}
                placeholder="ex: Tinder, LinkedIn, les notifs, Amazon..."
                style={{ width: '100%', background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-secondary)', borderRadius: 8, padding: '8px 12px', color: 'var(--color-text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)' }} />
            </div>
          </>
        )}

        {/* Format 1 — Ma pensee */}
        {format === 1 && (
          <>
            <div className="ctrl" style={{ flex: '1 1 100%' }}>
              <label>Ta pensee</label>
              <textarea value={pensee} onChange={e => setPensee(e.target.value)} rows={4}
                placeholder="Ecris ta pensee ici, l'app la coupe en N slides sans la modifier..."
                style={{ width: '100%', background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-secondary)', borderRadius: 8, padding: '8px 12px', color: 'var(--color-text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', resize: 'vertical' }} />
            </div>
            <div className="ctrl">
              <label>Nombre de slides</label>
              <select value={nbSlides} onChange={e => setNbSlides(Number(e.target.value))}>
                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </>
        )}

        {/* Format 2 — Films */}
        {format === 2 && (
          <div className="ctrl">
            <label>Film culte</label>
            <input type="text" value={film} onChange={e => setFilm(e.target.value)}
              placeholder="ex: La Haine, Fight Club, Drive..."
              style={{ width: '100%', background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-secondary)', borderRadius: 8, padding: '8px 12px', color: 'var(--color-text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)' }} />
          </div>
        )}

        {/* Format 3 & 4 — Carrousel / Emotionnel */}
        {(format === 3 || format === 4) && (
          <>
            <div className="ctrl">
              <label>Theme</label>
              <select value={theme} onChange={e => setTheme(e.target.value)}>
                {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="ctrl">
              <label>Sujet precis (optionnel)</label>
              <input type="text" value={sujet} onChange={e => setSujet(e.target.value)}
                placeholder="ex: Federer, Walter White, Neo..."
                style={{ width: '100%', background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-secondary)', borderRadius: 8, padding: '8px 12px', color: 'var(--color-text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)' }} />
            </div>
          </>
        )}

        {/* Image decorative — tous formats sauf Philo 2026 */}
        {format !== 0 && (
          <div className="ctrl" style={{ flex: '1 1 100%' }}>
            <label>Image decorative (coin bas droite)</label>
            <input type="file" accept="image/*" onChange={e => {
              const file = e.target.files?.[0]
              if (!file) return
              const reader = new FileReader()
              reader.onload = ev => setDecorImage(ev.target.result)
              reader.readAsDataURL(file)
            }} style={{ width: '100%', padding: '8px', color: 'var(--color-text-primary)', fontSize: 12 }} />
            {decorImage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <img src={decorImage} alt="apercu" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                <button onClick={() => setDecorImage(null)}
                  style={{ fontSize: 11, padding: '4px 8px', background: 'transparent', border: '0.5px solid var(--color-border-secondary)', color: 'var(--color-text-secondary)', borderRadius: 4, cursor: 'pointer' }}>
                  Retirer
                </button>
              </div>
            )}
          </div>
        )}

        <button className="gen-btn" onClick={generate} disabled={loading}>
          {loading ? 'Generation...' : 'Generer'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="status">Creation du carrousel...</div>}

      {data && data.slides && (
        <>
          <div className="slides-row">
            {slides.map((slide, i) => (
              <Slide key={i} id={`slide-${i}`} slide={slide} index={i}
                total={slides.length} bgImage={bgImages[i]}
                themeStyle={themeStyle} decorImage={format !== 0 ? decorImage : null} />
            ))}
          </div>
          <div className="hashtags">
            {(data.hashtags || []).map(tag => (
              <span key={tag} className="tag">#{tag.replace(/^#+/, '')}</span>
            ))}
          </div>
          <button className="dl-btn" onClick={downloadAll} disabled={exporting}>
            {exporting ? 'Export en cours...' : 'Telecharger les slides (PNG)'}
          </button>
        </>
      )}
    </div>
  )
}
