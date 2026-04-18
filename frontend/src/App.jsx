import { useState } from 'react'
import './App.css'

const THEMES = [
  'philosophie stoïcienne', 'sagesse africaine', 'philosophie orientale',
  'leaders et révolutionnaires', 'philosophie arabe et islamique',
  'développement personnel moderne', 'sagesse amérindienne',
  'philosophie japonaise (Musashi, Mishima)',
  'citations de prison et résilience (Mandela, Malcolm X)',
  'femmes philosophes (Beauvoir, Angelou)', 'sagesse berbère et maghrébine',
  'citations de guerriers (Sun Tzu, Spartiate)', 'spiritualité soufie (Rumi, Ibn Arabi)',
  'philosophie grecque antique (Socrate, Platon)',
]

const AUTEURS = [
  'Marc Aurèle', 'Épictète', 'Sénèque', 'Socrate', 'Platon', 'Aristote',
  'Rumi', 'Ibn Khaldoun', 'Confucius', 'Lao Tseu', 'Sun Tzu', 'Miyamoto Musashi',
  'Nelson Mandela', 'Malcolm X', 'Simone de Beauvoir', 'Maya Angelou',
  'Nietzsche', 'Camus', 'Sartre',
]

const ERES = [
  '2010 - 2013 (collège swag)',
  '2013 - 2016 (lycée tumblr)',
  '2015 - 2018 (PS4 / Snapchat)',
  '2017 - 2020 (ado tardif)',
  '2019 - 2022 (covid generation)',
]

const THEME_STYLE = {
  'philosophie stoïcienne':                                 { color: 'rgba(30,60,120,0.55)',  accent: '#a8c8ff', keyword: 'stoicism aesthetic dark moody ancient rome' },
  'sagesse africaine':                                      { color: 'rgba(120,60,10,0.55)',  accent: '#ffb347', keyword: 'africa aesthetic golden sunset savanna' },
  'philosophie orientale':                                  { color: 'rgba(10,80,60,0.55)',   accent: '#7fffd4', keyword: 'japan aesthetic zen dark moody temple' },
  'leaders et révolutionnaires':                            { color: 'rgba(100,10,10,0.55)',  accent: '#ff6b6b', keyword: 'revolution aesthetic dark dramatic portrait' },
  'philosophie arabe et islamique':                         { color: 'rgba(60,30,100,0.55)',  accent: '#c9a0ff', keyword: 'islamic architecture aesthetic moody light' },
  'développement personnel moderne':                        { color: 'rgba(10,60,80,0.55)',   accent: '#80d8ff', keyword: 'mindset aesthetic dark motivation sunrise' },
  'sagesse amérindienne':                                   { color: 'rgba(60,80,10,0.55)',   accent: '#b8e986', keyword: 'native american aesthetic nature spiritual' },
  'philosophie japonaise (Musashi, Mishima)':               { color: 'rgba(60,10,10,0.55)',   accent: '#ff8a80', keyword: 'samurai aesthetic dark japan moody' },
  'citations de prison et résilience (Mandela, Malcolm X)': { color: 'rgba(20,20,20,0.60)',   accent: '#e0e0e0', keyword: 'strength resilience aesthetic dark portrait' },
  'femmes philosophes (Beauvoir, Angelou)':                 { color: 'rgba(100,20,60,0.55)',  accent: '#f48fb1', keyword: 'woman aesthetic dark moody portrait' },
  'sagesse berbère et maghrébine':                          { color: 'rgba(100,70,10,0.55)',  accent: '#ffd54f', keyword: 'sahara desert aesthetic moody golden' },
  'citations de guerriers (Sun Tzu, Spartiate)':            { color: 'rgba(40,40,10,0.55)',   accent: '#e6ee9c', keyword: 'warrior aesthetic dark dramatic battle' },
  'spiritualité soufie (Rumi, Ibn Arabi)':                  { color: 'rgba(60,10,80,0.55)',   accent: '#ce93d8', keyword: 'sufi spiritual aesthetic mystical purple' },
  'philosophie grecque antique (Socrate, Platon)':          { color: 'rgba(10,50,80,0.55)',   accent: '#90caf9', keyword: 'ancient greece aesthetic dark ruins moody' },
}
const DEFAULT_STYLE = { color: 'rgba(20,20,20,0.55)', accent: '#ffffff', keyword: 'dramatic cinematic landscape' }

const PEXELS_KEY = 'UHgkq1JFa5yzly6gsz5SIYIacRwUqwnTVRBeKzo99Jw4pzH5ovRoMr10'
const UNSPLASH_KEY = 'yJiL3y_23RkNOFzreNI894AYyKaYB8UnS8pbqDYH1KU'
const API_BASE = import.meta.env.VITE_API_URL || ''
const PUPPET_URL = import.meta.env.VITE_PUPPET_URL || 'http://localhost:3001'
const FORMATS = ['Carrousel', "Devine l'auteur", 'Top 3 auteur', 'Depuis vidéo', 'Script animé']
const GENZ_FORMATS = ['Nostalgie', 'Pensées gen Z', 'Cinéma & Rap']

async function fetchPexelsImages(query, count) {
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=20&orientation=portrait`, { headers: { Authorization: PEXELS_KEY } })
    const data = await res.json()
    if (data.photos?.length > 0) return [...data.photos].sort(() => Math.random() - 0.5).slice(0, count).map(p => p.src.large)
  } catch (e) {}
  return Array(count).fill(null)
}

async function fetchUnsplashImages(query, count) {
  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20&orientation=portrait`, { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } })
    const data = await res.json()
    if (data.results?.length > 0) return [...data.results].sort(() => Math.random() - 0.5).slice(0, count).map(p => p.urls.regular)
  } catch (e) {}
  return Array(count).fill(null)
}

async function fetchSerperImages(query, count) {
  try {
    const res = await fetch(`${API_BASE}/api/images?query=${encodeURIComponent(query + ' pinterest aesthetic')}&count=${count}`)
    const data = await res.json()
    if (data.images?.length > 0) return data.images
  } catch (e) {}
  return Array(count).fill(null)
}

async function toBase64(url) {
  try {
    const res = await fetch(`${API_BASE}/api/proxy-image?url=${encodeURIComponent(url)}`)
    const blob = await res.blob()
    return new Promise(resolve => { const r = new FileReader(); r.onloadend = () => resolve(r.result); r.readAsDataURL(blob) })
  } catch (e) { return url }
}

async function fetchImages(query, count) {
  const imgs = await fetchSerperImages(query, count)
  const fallback = Math.random() > 0.5 ? await fetchUnsplashImages(query, count) : await fetchPexelsImages(query, count)
  const merged = imgs.map((img, i) => img || fallback[i] || null)
  const valid = merged.filter(Boolean)
  if (valid.length === 0) return Array(count).fill(null)
  return merged.map(img => img || valid[Math.floor(Math.random() * valid.length)])
}

function cap(text, max) {
  if (!text) return ''
  const w = text.split(' ')
  return w.length > max ? w.slice(0, max).join(' ') + '…' : text
}

function getSlideContent(slide) {
  switch (slide.type) {
    case 'hook': return { main: `"${cap(slide.citation, 10)}"`, sub: `— ${slide.auteur}` }
    case 'intrigue': return { main: cap(slide.question, 8) }
    case 'context': return { main: cap(slide.corps, 10) }
    case 'lesson': return { main: cap(slide.corps, 10) }
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
    case 'video_hook': return { main: cap(slide.accroche, 10) }
    case 'video_explication': return { main: cap(slide.corps, 10) }
    case 'video_exemple': return { main: cap(slide.exemple, 10) }
    case 'video_cta': return { main: cap(slide.texte, 8), sub: cap(slide.question, 8) }
    case 'nostalgie_hook': return { main: cap(slide.texte, 12) }
    case 'nostalgie_refs': return { main: cap(slide.texte, 15) }
    case 'nostalgie_feeling': return { main: cap(slide.texte, 12) }
    case 'pensee_slide': return { main: cap(slide.texte, 12) }
    case 'cinema_slide': return { main: cap(slide.texte, 12) }
    default: return { main: '' }
  }
}

function Slide({ slide, index, total, bgImage, themeStyle, id }) {
  const { main, sub } = getSlideContent(slide)
  const isGenz = ['nostalgie_hook','nostalgie_refs','nostalgie_feeling','pensee_slide','cinema_slide'].includes(slide.type)
  const colorOverlay = themeStyle?.color || 'rgba(20,20,20,0.55)'

  if (isGenz) {
    const accentColor = slide.type?.startsWith('nostalgie') ? '#c084fc' : slide.type?.startsWith('cinema') ? '#f472b6' : '#a5f3fc'
    return (
      <div id={id} style={{ flexShrink: 0, width: 180, height: 320, borderRadius: 10, position: 'relative', overflow: 'hidden', background: '#050510', border: '0.5px solid rgba(255,255,255,0.08)' }}>
        {bgImage && <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,20,0.62)', zIndex: 1 }} />
        <span style={{ position: 'absolute', top: 8, left: 10, fontSize: 8, color: 'rgba(255,255,255,0.3)', zIndex: 4 }}>{index + 1}/{total}</span>
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 16px 24px', textAlign: 'center', gap: 8 }}>
          {main && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.3, textShadow: `0 0 20px ${accentColor}88, 0 2px 10px rgba(0,0,0,0.9)`, textWrap: 'balance' }}>{main}</p>}
          {sub && <p style={{ fontSize: 9, color: accentColor, marginTop: 4, letterSpacing: '0.05em' }}>{sub}</p>}
        </div>
      </div>
    )
  }

  return (
    <div id={id} style={{ flexShrink: 0, width: 180, height: 320, borderRadius: 10, position: 'relative', overflow: 'hidden', background: '#0a0a0a', border: '0.5px solid rgba(255,255,255,0.08)' }}>
      {bgImage && <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />}
      <div style={{ position: 'absolute', inset: 0, background: colorOverlay, zIndex: 1 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 2 }} />
      <span style={{ position: 'absolute', top: 10, left: 12, fontSize: 9, color: 'rgba(255,255,255,0.4)', zIndex: 4 }}>{index + 1}/{total}</span>
      <div style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 18px 24px', textAlign: 'center', gap: 10, boxSizing: 'border-box' }}>
        {main && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 17, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.3, textShadow: '0 2px 10px rgba(0,0,0,0.8)', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden', textWrap: 'balance' }}>{main}</p>}
        {sub && <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4, fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{sub}</p>}
      </div>
    </div>
  )
}

async function callAPI(endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Erreur serveur')
  return typeof json.data === 'string' ? JSON.parse(json.data) : json.data
}

export default function App() {
  const [compte, setCompte] = useState('citations')
  const [format, setFormat] = useState(0)
  const [theme, setTheme] = useState(THEMES[0])
  const [auteur, setAuteur] = useState(AUTEURS[0])
  const [transcription, setTranscription] = useState('')
  const [genzFormat, setGenzFormat] = useState(0)
  const [ere, setEre] = useState(ERES[0])
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
      else if (format === 2) result = await callAPI('/api/generate-top3', { auteur, style: 'sombre' })
      else if (format === 3) result = await callAPI('/api/generate-video', { transcription, style: 'sombre' })
      else result = await callAPI('/api/generate-script', { transcription, style: 'sombre' })
      setData(result)
      const rawImgs = await fetchImages(themeStyle.keyword, (result.slides || []).length)
      const imgs = await Promise.all(rawImgs.map(img => img ? toBase64(img) : null))
      setBgImages(imgs)
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  const generateGenz = async () => {
    setLoading(true); setError(null); setData(null); setBgImages([])
    try {
      let result
      if (genzFormat === 0) result = await callAPI('/api/genz/nostalgie', { ere, style: 'sombre' })
      else if (genzFormat === 1) result = await callAPI('/api/genz/pensees', { style: 'sombre' })
      else result = await callAPI('/api/genz/cinema', { style: 'sombre' })
      setData(result)
      const imgQuery = genzFormat === 0
        ? 'euphoria aesthetic dark neon bedroom teen nostalgic cinematic'
        : genzFormat === 1
        ? 'euphoria aesthetic dark moody neon cinematic portrait youth'
        : 'aesthetic dark neon cinematic french youth moody portrait'
      const rawImgs = await fetchImages(imgQuery, (result.slides || []).length)
      const imgs = await Promise.all(rawImgs.map(img => img ? toBase64(img) : null))
      setBgImages(imgs)
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  const downloadAll = async () => {
    setExporting(true)
    try {
      const slideContents = (data?.slides || []).map(slide => { const { main, sub } = getSlideContent(slide); return { main, sub, type: slide.type } })
      const isBasket = false
      const res = await fetch(`${PUPPET_URL}/screenshot`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(120000),
        body: JSON.stringify({ slides: slideContents, bgImages, themeColor: themeStyle?.color, isBasket })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      json.images.forEach((b64, i) => {
        const link = document.createElement('a')
        link.download = `slide-${i + 1}.png`
        link.href = `data:image/png;base64,${b64}`
        link.click()
      })
    } catch (e) { alert('Erreur export: ' + e.message) }
    setExporting(false)
  }

  const slides = data?.slides || []

  return (
    <div className="app">
      <header>
        <h1>Carousel Generator</h1>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className={`ftab${compte === 'citations' ? ' active' : ''}`} onClick={() => { setCompte('citations'); setData(null); setBgImages([]) }}>Citations du monde</button>
          <button className={`ftab${compte === 'genz' ? ' active' : ''}`} onClick={() => { setCompte('genz'); setData(null); setBgImages([]) }}>Gen Z</button>
        </div>
      </header>

      {compte === 'citations' && (
        <>
          <div className="format-tabs">
            {FORMATS.map((f, i) => (
              <button key={i} className={`ftab${format === i ? ' active' : ''}`} onClick={() => { setFormat(i); setData(null); setError(null); setBgImages([]) }}>{f}</button>
            ))}
          </div>
          <div className="controls">
            {(format === 0 || format === 1) && (
              <div className="ctrl">
                <label>Thème</label>
                <select value={theme} onChange={e => setTheme(e.target.value)}>
                  {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            )}
            {format === 2 && (
              <div className="ctrl">
                <label>Auteur</label>
                <select value={auteur} onChange={e => setAuteur(e.target.value)}>
                  {AUTEURS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            )}
            {(format === 3 || format === 4) && (
              <div className="ctrl" style={{ flex: '1 1 100%' }}>
                <label>{format === 3 ? 'Colle ta transcription' : 'Colle ta transcription (script animé)'}</label>
                <textarea value={transcription} onChange={e => setTranscription(e.target.value)} rows={5} placeholder="Colle ici la transcription YouTube..."
                  style={{ width: '100%', background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-secondary)', borderRadius: 8, padding: '8px 12px', color: 'var(--color-text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', resize: 'vertical' }} />
              </div>
            )}
            <button className="gen-btn" onClick={generate} disabled={loading}>{loading ? 'Génération...' : 'Générer'}</button>
          </div>
        </>
      )}

      {compte === 'genz' && (
        <>
          <div className="format-tabs" style={{ marginTop: '1rem' }}>
            {GENZ_FORMATS.map((f, i) => (
              <button key={i} className={`ftab${genzFormat === i ? ' active' : ''}`} onClick={() => { setGenzFormat(i); setData(null); setBgImages([]) }}>{f}</button>
            ))}
          </div>
          <div className="controls">
            {genzFormat === 0 && (
              <div className="ctrl">
                <label>Ère</label>
                <select value={ere} onChange={e => setEre(e.target.value)}>
                  {ERES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            )}
            <button className="gen-btn" onClick={generateGenz} disabled={loading}>{loading ? 'Génération...' : 'Générer'}</button>
          </div>
        </>
      )}

      {error && <div className="error">{error}</div>}
      {loading && <div className="status">Création du carrousel...</div>}

      {data && data.scenes && (
        <div style={{ marginTop: '1rem' }}>
          {data.citation_principale && (
            <div style={{ background: 'var(--color-background-secondary)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: 16, textAlign: 'center' }}>
              <p style={{ fontSize: 10, color: 'var(--color-text-tertiary)', letterSpacing: '0.1em', marginBottom: 6 }}>CITATION PRINCIPALE</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>"{data.citation_principale}"</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>— {data.auteur}</p>
            </div>
          )}
          {data.scenes.map((scene, i) => (
            <div key={i} style={{ background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)' }}>MOMENT {scene.moment} — {scene.duree}</span>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', margin: '8px 0' }}>"{scene.citation}"</p>
              <div style={{ background: 'var(--color-background-tertiary)', borderRadius: 8, padding: '10px 12px' }}>
                <p style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginBottom: 4 }}>PROMPT KLING AI</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>{scene.prompt_kling}</p>
              </div>
            </div>
          ))}
          <div className="hashtags">{(data.hashtags || []).map(tag => <span key={tag} className="tag">#{tag.replace(/^#+/, '')}</span>)}</div>
        </div>
      )}

      {data && data.slides && (
        <>
          <div className="slides-row">
            {slides.map((slide, i) => (
              <Slide key={i} id={`slide-${i}`} slide={slide} index={i} total={slides.length} bgImage={bgImages[i]} themeStyle={themeStyle} />
            ))}
          </div>
          <div className="hashtags">{(data.hashtags || []).map(tag => <span key={tag} className="tag">#{tag.replace(/^#+/, '')}</span>)}</div>
          <button className="dl-btn" onClick={downloadAll} disabled={exporting}>{exporting ? 'Export en cours...' : 'Télécharger les slides (PNG)'}</button>
        </>
      )}
    </div>
  )
}
