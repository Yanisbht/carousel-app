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

const JOUEURS_KEYWORDS = {
  'Michael Jordan': 'Michael Jordan Bulls 90s aesthetic vintage',
  'Kobe Bryant': 'Kobe Bryant Lakers Mamba aesthetic vintage',
  'Allen Iverson': 'Allen Iverson 76ers crossover aesthetic vintage',
  'Kyrie Irving': 'Kyrie Irving handles aesthetic dark moody',
  'LeBron James': 'LeBron James cinematic aesthetic moody',
  'Tim Duncan': 'Tim Duncan Spurs championship aesthetic',
  'Kevin Garnett': 'Kevin Garnett intensity aesthetic vintage',
  'Tracy McGrady': 'Tracy McGrady Orlando aesthetic vintage',
  'Vince Carter': 'Vince Carter dunk aesthetic vintage',
  'Dwyane Wade': 'Dwyane Wade Heat aesthetic vintage',
  'Dirk Nowitzki': 'Dirk Nowitzki fadeaway aesthetic vintage',
  'Steve Nash': 'Steve Nash Suns aesthetic vintage',
  'Paul Pierce': 'Paul Pierce Celtics aesthetic vintage',
  'Ray Allen': 'Ray Allen shooter aesthetic vintage',
  'Carmelo Anthony': 'Carmelo Anthony scorer aesthetic vintage',
  'Chris Paul': 'Chris Paul point guard aesthetic vintage',
  'Derrick Rose': 'Derrick Rose Bulls athletic aesthetic vintage',
  'Russell Westbrook': 'Russell Westbrook aggressive aesthetic moody',
  'Stephen Curry': 'Stephen Curry Warriors aesthetic cinematic',
  'Kevin Durant': 'Kevin Durant scorer aesthetic dark moody',
  'Tony Parker': 'Tony Parker Spurs aesthetic vintage',
  'Pau Gasol': 'Pau Gasol big man aesthetic vintage',
  'Manu Ginobili': 'Manu Ginobili eurostep aesthetic vintage',
}

const JOUEURS = Object.keys(JOUEURS_KEYWORDS)

const ACTIONS = [
  'dunk en contre-attaque',
  'step-back three pointer',
  'fadeaway signature',
  'crossover dévastateur',
  'block monumental',
  'lay-up acrobatique',
  'alley-oop spectaculaire',
  'spin move au cercle',
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
const BASKET_STYLE = { color: 'rgba(0,0,0,0.65)', accent: '#ffffff' }

const PEXELS_KEY = 'UHgkq1JFa5yzly6gsz5SIYIacRwUqwnTVRBeKzo99Jw4pzH5ovRoMr10'
const UNSPLASH_KEY = 'yJiL3y_23RkNOFzreNI894AYyKaYB8UnS8pbqDYH1KU'
const API_BASE = import.meta.env.VITE_API_URL || ''
const FORMATS = ['Carrousel', "Devine l'auteur", 'Top 3 auteur', 'Depuis vidéo', 'Script animé']


const BASKET_FORMATS = ['Faits choc', 'Vie de basketteur', 'Action Anime']

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

async function fetchSerperImages(query, count) {
  try {
    const res = await fetch(`${API_BASE}/api/images?query=${encodeURIComponent(query + ' pinterest aesthetic')}&count=${count}`)
    const data = await res.json()
    if (data.images && data.images.length > 0) return data.images
  } catch (e) {}
  return Array(count).fill(null)
}

async function toBase64(url) {
  try {
    const res = await fetch(`${API_BASE}/api/proxy-image?url=${encodeURIComponent(url)}`)
    const blob = await res.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  } catch (e) { return url }
}

async function fetchImages(query, count) {
  const imgs = await fetchSerperImages(query, count)
  const fallback = Math.random() > 0.5
    ? await fetchUnsplashImages(query, count)
    : await fetchPexelsImages(query, count)
  const merged = imgs.map((img, i) => img || fallback[i] || null)
  const validImgs = merged.filter(Boolean)
  if (validImgs.length === 0) return Array(count).fill(null)
  return merged.map(img => img || validImgs[Math.floor(Math.random() * validImgs.length)])
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
    case 'basket_hook': return { main: cap(slide.accroche, 5) }
    case 'basket_citation': return { main: cap(slide.citation, 6), sub: `— ${slide.joueur}` }
    case 'basket_stat': return { main: cap(slide.stat, 6) }
    case 'basket_lecon': return { main: cap(slide.lecon, 10), sub: cap(slide.application, 8) }
    case 'basket_cta': return { main: cap(slide.question, 10) }
    case 'basket_action': return { main: cap(slide.texte, 6) }
    case 'motiv_hook': return { main: cap(slide.texte, 5) }
    case 'vie_slide': return { main: cap(slide.texte, 12) }
    case 'motiv_citation': return { main: cap(slide.citation, 6), sub: slide.auteur }
    case 'motiv_cta': return { main: cap(slide.question, 6) }
    default: return { main: '' }
  }
}

function Slide({ slide, index, total, bgImage, themeStyle, id }) {
  const { main, sub } = getSlideContent(slide)
  const isBasket = slide.type?.startsWith('basket_') || slide.type?.startsWith('motiv_')
  const colorOverlay = isBasket ? 'rgba(0,0,0,0.15)' : (themeStyle?.color || 'rgba(20,20,20,0.55)')

  if (isBasket) {
    return (
      <div id={id} style={{
        flexShrink: 0, width: 180, height: 320, borderRadius: 10,
        position: 'relative', overflow: 'hidden', background: '#000',
        border: '0.5px solid rgba(255,255,255,0.08)',
      }}>
        {bgImage && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover', backgroundPosition: 'center top', zIndex: 0,
          }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.18)', zIndex: 1 }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
          padding: '36px 12px 14px',
          textAlign: 'center',
        }}>
          {main && <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: slide.type === 'vie_slide' ? 14 : 12,
            fontWeight: 700,
            color: slide.type === 'vie_slide' ? '#f5c842' : '#ffffff',
            lineHeight: 1.35, letterSpacing: '0.01em',
            textShadow: '0 2px 12px rgba(0,0,0,1)',
            textAlign: 'center',
          }}>{main}</p>}
          {sub && <p style={{
            fontSize: 9, color: 'rgba(255,255,255,0.55)',
            marginTop: 3, fontStyle: 'italic',
          }}>{sub}</p>}
        </div>
        <span style={{ position: 'absolute', top: 8, left: 10, fontSize: 8, color: 'rgba(255,255,255,0.3)', zIndex: 3 }}>
          {index + 1}/{total}
        </span>
      </div>
    )
  }

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
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 2 }} />
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
        {main && (
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 17, fontWeight: 800, color: '#FFFFFF',
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
  const [compte, setCompte] = useState('citations')
  const [format, setFormat] = useState(0)
  const [theme, setTheme] = useState(THEMES[0])
  const [auteur, setAuteur] = useState(AUTEURS[0])
  const [transcription, setTranscription] = useState('')
  const [basketFormat, setBasketFormat] = useState(0)
  const [joueur, setJoueur] = useState('')
  const [action, setAction] = useState(ACTIONS[0])
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

  const generateBasket = async () => {
    setLoading(true); setError(null); setData(null); setBgImages([])
    try {
      let result
      if (basketFormat === 0) { if (!joueur) { setError('Choisis un joueur'); setLoading(false); return; } result = await callAPI('/api/basket/citations', { joueur, style: 'sombre' }) }
      else if (basketFormat === 1) result = await callAPI('/api/basket/vie', { style: 'sombre' })
      else result = await callAPI('/api/basket/action', { joueur, action, style: 'sombre' })
      setData(result)
      const rawImgs = await fetchImages(JOUEURS_KEYWORDS[joueur] || joueur + ' basketball vintage aesthetic', (result.slides || []).length)
      const imgs = await Promise.all(rawImgs.map(img => img ? toBase64(img) : null))
      setBgImages(imgs)
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  const PUPPET_URL = import.meta.env.VITE_PUPPET_URL || 'http://localhost:3001'

  const downloadAll = async () => {
    setExporting(true)
    try {
      const slideContents = (data?.slides || []).map((slide, i) => {
        const { main, sub } = getSlideContent(slide)
        return { main, sub, type: slide.type }
      })
      const isBasket = slideContents[0]?.type?.startsWith('basket_')
      const res = await fetch(`${PUPPET_URL}/screenshot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(120000),
        body: JSON.stringify({
          slides: slideContents,
          bgImages: bgImages,
          themeColor: themeStyle?.color,
          isBasket
        })
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

  // useEffect(() => { generate() }, [])
  const slides = data?.slides || []

  return (
    <div className="app">
      <header>
        <h1>Carousel Generator</h1>
        <div style={{display: 'flex', gap: 8, marginTop: 8}}>
          <button className={`ftab${compte === 'citations' ? ' active' : ''}`}
            onClick={() => { setCompte('citations'); setData(null); setBgImages([]) }}>
            Citations du monde
          </button>
          <button className={`ftab${compte === 'basket' ? ' active' : ''}`}
            onClick={() => { setCompte('basket'); setData(null); setBgImages([]) }}>
            Basket
          </button>
        </div>
      </header>

      {compte === 'citations' && (
        <>
          <div className="format-tabs">
            {FORMATS.map((f, i) => (
              <button key={i} className={`ftab${format === i ? ' active' : ''}`}
                onClick={() => { setFormat(i); setData(null); setError(null); setBgImages([]) }}>
                {f}
              </button>
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
              <div className="ctrl" style={{flex: '1 1 100%'}}>
                <label>{format === 3 ? 'Colle ta transcription' : 'Colle ta transcription (script animé)'}</label>
                <textarea value={transcription} onChange={e => setTranscription(e.target.value)} rows={5}
                  placeholder="Colle ici la transcription de ta vidéo YouTube..."
                  style={{width: '100%', background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-secondary)', borderRadius: 8, padding: '8px 12px', color: 'var(--color-text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', resize: 'vertical'}} />
              </div>
            )}
            <button className="gen-btn" onClick={generate} disabled={loading}>
              {loading ? 'Génération...' : 'Générer'}
            </button>
          </div>
        </>
      )}

      {compte === 'basket' && (
        <>
          <div className="format-tabs" style={{marginTop: '1rem'}}>
            {BASKET_FORMATS.map((f, i) => (
              <button key={i} className={`ftab${basketFormat === i ? ' active' : ''}`}
                onClick={() => { setBasketFormat(i); setData(null); setBgImages([]) }}>
                {f}
              </button>
            ))}
          </div>
          <div className="controls">
            {basketFormat !== 1 && (
              <div className="ctrl">
                <label>Joueur</label>
                <select value={joueur} onChange={e => setJoueur(e.target.value)}>
                  <option value=''>-- Choisir un joueur --</option>
                {JOUEURS.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
            )}
            {basketFormat === 3 && (
              <div className="ctrl">
                <label>Action</label>
                <select value={action} onChange={e => setAction(e.target.value)}>
                  {ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            )}
            <button className="gen-btn" onClick={generateBasket} disabled={loading}>
              {loading ? 'Génération...' : 'Générer'}
            </button>
          </div>
        </>
      )}

      {error && <div className="error">{error}</div>}
      {loading && <div className="status">Création du carrousel...</div>}

      {data && data.scenes && (
        <div style={{marginTop: '1rem'}}>
          {data.citation_principale && (
            <div style={{background: 'var(--color-background-secondary)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: 16, textAlign: 'center'}}>
              <p style={{fontSize: 10, color: 'var(--color-text-tertiary)', letterSpacing: '0.1em', marginBottom: 6}}>CITATION PRINCIPALE</p>
              <p style={{fontSize: 16, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4}}>"{data.citation_principale}"</p>
              <p style={{fontSize: 12, color: 'var(--color-text-secondary)', fontStyle: 'italic'}}>— {data.auteur}</p>
            </div>
          )}
          {data.scenes.map((scene, i) => (
            <div key={i} style={{background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: 12}}>
              <span style={{fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)'}}>MOMENT {scene.moment} — {scene.duree}</span>
              <p style={{fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', margin: '8px 0'}}>"{scene.citation}"</p>
              <p style={{fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 8}}>{scene.scene}</p>
              <div style={{background: 'var(--color-background-tertiary)', borderRadius: 8, padding: '10px 12px'}}>
                <p style={{fontSize: 10, color: 'var(--color-text-tertiary)', marginBottom: 4}}>PROMPT KLING AI</p>
                <p style={{fontSize: 12, color: 'var(--color-text-secondary)', fontStyle: 'italic'}}>{scene.prompt_kling}</p>
              </div>
            </div>
          ))}
          <div className="hashtags">
            {(data.hashtags || []).map(tag => (
              <span key={tag} className="tag">#{tag.replace(/^#+/, '')}</span>
            ))}
          </div>
        </div>
      )}

      {data && data.slides && (
        <>
          <div className="slides-row">
            {slides.map((slide, i) => (
              <Slide key={i} id={`slide-${i}`} slide={slide} index={i}
                total={slides.length} bgImage={bgImages[i]} themeStyle={themeStyle} />
            ))}
          </div>
          {slides[0]?.type === 'basket_action' && (
            <div style={{marginTop: '1rem'}}>
              <p style={{fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 12, letterSpacing: '0.1em'}}>PROMPTS KLING AI</p>
              {slides.map((slide, i) => (
                <div key={i} style={{background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 10, padding: '12px 14px', marginBottom: 8}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 6}}>
                    <span style={{fontSize: 10, fontWeight: 500, color: 'var(--color-text-secondary)'}}>IMAGE {slide.moment} — {slide.texte}</span>
                    <button onClick={() => navigator.clipboard.writeText(slide.prompt_kling)} style={{fontSize: 10, padding: '2px 8px', border: '0.5px solid var(--color-border-secondary)', borderRadius: 6, background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer'}}>Copier</button>
                  </div>
                  <p style={{fontSize: 12, color: 'var(--color-text-primary)', lineHeight: 1.5, fontStyle: 'italic'}}>{slide.prompt_kling}</p>
                </div>
              ))}
            </div>
          )}
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
