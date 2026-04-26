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
  'philosophie nietzschéenne',
  'bouddhisme et pleine conscience',
  'philosophie indienne (Veda, Upanishad, Gandhi)',
  'sagesse chinoise (Confucius, Lao Tseu, Zhuangzi)',
  'philosophie latine (Cicéron, Virgile, Horace)',
  "philosophie médiévale (Thomas d'Aquin, Ibn Rushd)",
  'philosophie des Lumières (Voltaire, Rousseau, Montesquieu)',
  'philosophie allemande (Kant, Hegel, Schopenhauer)',
  'citations de scientifiques (Einstein, Feynman, Curie)',
  'sagesse des peuples du monde (proverbes universels)',
  'philosophie politique (Machiavel, Hobbes, Locke)',
  "philosophie de l'amour et des relations",
  'philosophie de la mort et du temps',
  'philosophie du bonheur et de la joie',
  'sagesse des nomades et des voyageurs',
  "philosophie de la créativité et de l'art",
  'citations littéraires (Hugo, Proust, Dostoïevski)',
]

const AUTEURS = [
  'Marc Aurèle', 'Épictète', 'Sénèque', 'Socrate', 'Platon', 'Aristote',
  'Rumi', 'Ibn Khaldoun', 'Confucius', 'Lao Tseu', 'Sun Tzu', 'Miyamoto Musashi',
  'Nelson Mandela', 'Malcolm X', 'Simone de Beauvoir', 'Maya Angelou',
  'Nietzsche', 'Camus', 'Sartre',
]

const THEME_STYLE = {
  'philosophie stoïcienne':                                 { color: 'rgba(0,0,0,0.25)', accent: '#ffffff' },
  'sagesse africaine':                                      { color: 'rgba(0,0,0,0.25)', accent: '#ffffff' },
  'philosophie orientale':                                  { color: 'rgba(0,0,0,0.25)', accent: '#ffffff' },
  'leaders et révolutionnaires':                            { color: 'rgba(0,0,0,0.25)', accent: '#ffffff' },
  'philosophie arabe et islamique':                         { color: 'rgba(0,0,0,0.25)', accent: '#ffffff' },
  'développement personnel moderne':                        { color: 'rgba(0,0,0,0.25)', accent: '#ffffff' },
  'sagesse amérindienne':                                   { color: 'rgba(0,0,0,0.25)', accent: '#ffffff' },
  'philosophie japonaise (Musashi, Mishima)':               { color: 'rgba(0,0,0,0.25)', accent: '#ffffff' },
  'citations de prison et résilience (Mandela, Malcolm X)': { color: 'rgba(0,0,0,0.25)', accent: '#ffffff' },
  'femmes philosophes (Beauvoir, Angelou)':                 { color: 'rgba(0,0,0,0.25)', accent: '#ffffff' },
  'sagesse berbère et maghrébine':                          { color: 'rgba(0,0,0,0.25)', accent: '#ffffff' },
  'citations de guerriers (Sun Tzu, Spartiate)':            { color: 'rgba(0,0,0,0.25)', accent: '#ffffff' },
  'spiritualité soufie (Rumi, Ibn Arabi)':                  { color: 'rgba(0,0,0,0.25)', accent: '#ffffff' },
  'philosophie grecque antique (Socrate, Platon)':          { color: 'rgba(0,0,0,0.25)', accent: '#ffffff' },
}
const DEFAULT_STYLE = { color: 'rgba(0,0,0,0.25)', accent: '#ffffff' }

const PEXELS_KEY = 'UHgkq1JFa5yzly6gsz5SIYIacRwUqwnTVRBeKzo99Jw4pzH5ovRoMr10'
const UNSPLASH_KEY = 'yJiL3y_23RkNOFzreNI894AYyKaYB8UnS8pbqDYH1KU'
const API_BASE = import.meta.env.VITE_API_URL || ''
const PUPPET_URL = import.meta.env.VITE_PUPPET_URL || 'http://localhost:3001'
const ELEVEN_KEY = 'sk_06c242de0700d16b65f168fd10913efdeea6f1df8d219c9b'
const ELEVEN_VOICE_ID = 'pNInz6obpgDQGcFmaJgB' // Adam — voix masculine charismatique
const FORMATS = ['Carrousel', 'Depuis vidéo', 'One Shot']

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

const LIFESTYLE_QUERIES = [
  'luxury lifestyle desert aesthetic',
  'man quad bike desert aesthetic',
  'luxury car desert aesthetic',
  'athlete training aesthetic',
  'rooftop city view aesthetic',
  'sunset luxury lifestyle aesthetic',
  'sport motivation aesthetic dark',
  'luxury watch aesthetic',
  'mountain hike aesthetic',
  'ocean luxury lifestyle aesthetic',
]

const QUERIES = [
  'landscape nature', 'sky clouds', 'mountain', 'forest', 'ocean',
  'sunset', 'meadow', 'desert', 'river', 'night sky',
]

async function fetchImages(query, count) {
  const shuffled = [...QUERIES].sort(() => Math.random() - 0.5)
  // Générer count+3 images et trier par qualité (on prend les meilleures)
  const extra = count + 3
  const results = await Promise.all(
    Array.from({ length: extra }, (_, i) => fetchOneUnsplashRandom(shuffled[i % shuffled.length]))
  )
  const valid = results.filter(Boolean)
  // Trier : préférer les images avec des mots-clés de qualité dans l'URL (landscape, sky, mountain)
  const quality = ['landscape', 'sky', 'mountain', 'ocean', 'sunset', 'forest']
  const sorted = [...valid].sort((a, b) => {
    const aScore = quality.some(q => a.includes(q)) ? 1 : 0
    const bScore = quality.some(q => b.includes(q)) ? 1 : 0
    return bScore - aScore
  })
  return sorted.slice(0, count)
}

function cap(text, max) {
  if (!text) return ''
  const w = text.split(' ')
  return w.length > max ? w.slice(0, max).join(' ') + '…' : text
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
    default: return { main: '' }
  }
}

function Slide({ slide, index, total, bgImage, themeStyle, id }) {
  const { main, sub } = getSlideContent(slide)

  // Calcule la taille du texte selon la longueur — plus court = plus grand
  const isOneShot = slide.type === 'oneshot'
  const chars = (main || '').length
  const baseSize = chars <= 8 ? 52 : chars <= 14 ? 40 : chars <= 20 ? 30 : chars <= 30 ? 22 : 16
  const sizeMultiplier = index === 0 ? 1 : index === 1 ? 0.82 : 0.70
  const fontSize = Math.round(baseSize * sizeMultiplier)

  return (
    <div id={id} style={{
      flexShrink: 0, width: 180, height: 320, borderRadius: 10,
      position: 'relative', overflow: 'hidden', background: '#111',
      border: '0.5px solid rgba(255,255,255,0.06)',
    }}>
      {bgImage && <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0,
        filter: 'brightness(0.5) saturate(0.7)',
      }} />}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1 }} />
      <span style={{ position: 'absolute', top: 10, left: 12, fontSize: 9, color: 'rgba(255,255,255,0.3)', zIndex: 4 }}>{index + 1}/{total}</span>
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: isOneShot ? 'center' : 'flex-start',
        padding: isOneShot ? '44px 20px' : '44px 14px 28px',
        gap: 10,
      }}>
        {main && <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: fontSize,
          fontWeight: isOneShot ? 700 : 900,
          color: '#FFFFFF',
          lineHeight: isOneShot ? 1.3 : 0.95,
          letterSpacing: isOneShot ? '-0.01em' : '-0.02em',
          textTransform: isOneShot ? 'none' : 'uppercase',
          textAlign: isOneShot ? 'center' : 'left',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          width: '100%',
          margin: 0,
        }}>{main}</p>}
        {sub && <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 9, fontWeight: 400,
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginTop: 8,
        }}>{sub}</p>}
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
  const [format, setFormat] = useState(0)
  const [theme, setTheme] = useState(THEMES[0])
  const [transcription, setTranscription] = useState('')
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [data, setData] = useState(null)
  const [bgImages, setBgImages] = useState([])
  const [error, setError] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [generatingAudio, setGeneratingAudio] = useState(false)

  const themeStyle = THEME_STYLE[theme] || DEFAULT_STYLE

  const generate = async () => {
    setLoading(true); setError(null); setData(null); setBgImages([])
    try {
      let result
      if (format === 0) result = await callAPI('/api/generate', { theme, style: 'sombre' })
      else if (format === 1) result = await callAPI('/api/generate-video', { transcription, style: 'sombre' })
      else result = await callAPI('/api/generate-oneshot', { style: 'sombre' })
      setData(result)
      const slideCount = (result.slides || []).length
      const isOneShot = format === 2
      const imgQuery = isOneShot
        ? LIFESTYLE_QUERIES[Math.floor(Math.random() * LIFESTYLE_QUERIES.length)]
        : ''
      const rawImgs = await fetchImages(imgQuery, slideCount)
      const imgs = await Promise.all(rawImgs.map(url => url ? toBase64(url) : null))
      setBgImages(imgs)
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  const generateAudio = async () => {
    if (!data?.slides) return
    setGeneratingAudio(true)
    setAudioUrl(null)
    try {
      const script = (data.slides || [])
        .map(s => getSlideContent(s).main || '')
        .filter(Boolean)
        .join('... ')
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVEN_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: script,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.4, similarity_boost: 0.85, style: 0.5, use_speaker_boost: true }
        })
      })
      if (!res.ok) throw new Error('Erreur ElevenLabs')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
    } catch (e) { alert('Erreur audio: ' + e.message) }
    setGeneratingAudio(false)
  }

  const downloadAll = async () => {
    setExporting(true)
    try {
      const slideContents = (data?.slides || []).map(slide => { const { main, sub } = getSlideContent(slide); return { main, sub, type: slide.type } })
      const res = await fetch(`${PUPPET_URL}/screenshot`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(120000),
        body: JSON.stringify({ slides: slideContents, bgImages, themeColor: themeStyle?.color, isBasket: false })
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

  const slides = (data?.slides || []).slice(0, 3)

  return (
    <div className="app">
      <header>
        <h1>Carousel Generator</h1>
        <p className="subtitle">@citationmonde5</p>
      </header>

      <div className="format-tabs">
        {FORMATS.map((f, i) => (
          <button key={i} className={`ftab${format === i ? ' active' : ''}`} onClick={() => { setFormat(i); setData(null); setError(null); setBgImages([]) }}>{f}</button>
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
          <div className="ctrl" style={{ flex: '1 1 100%' }}>
            <label>Colle ta transcription</label>
            <textarea value={transcription} onChange={e => setTranscription(e.target.value)} rows={5}
              placeholder="Colle ici la transcription de ta vidéo YouTube..."
              style={{ width: '100%', background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-secondary)', borderRadius: 8, padding: '8px 12px', color: 'var(--color-text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', resize: 'vertical' }} />
          </div>
        )}
        {format === 2 && (
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Une phrase motivante + image lifestyle. Génère et télécharge directement.</p>
        )}
        <button className="gen-btn" onClick={generate} disabled={loading}>{loading ? 'Génération...' : 'Générer'}</button>
      </div>

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 12px' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: themeStyle.accent }}></div>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{theme}</span>
          </div>
          <div className="slides-row">
            {slides.map((slide, i) => (
              <Slide key={i} id={`slide-${i}`} slide={slide} index={i} total={slides.length} bgImage={bgImages[i]} themeStyle={themeStyle} />
            ))}
          </div>
          <div className="hashtags">{(data.hashtags || []).map(tag => <span key={tag} className="tag">#{tag.replace(/^#+/, '')}</span>)}</div>
          <div style={{display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8}}>
            <button className="dl-btn" onClick={downloadAll} disabled={exporting}>{exporting ? 'Export en cours...' : 'Télécharger les slides (PNG)'}</button>
            <button className="dl-btn" onClick={generateAudio} disabled={generatingAudio}
              style={{background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)', border: '0.5px solid var(--color-border-secondary)'}}>
              {generatingAudio ? 'Génération audio...' : '🎙️ Générer la voix'}
            </button>
          </div>
          {audioUrl && (
            <div style={{marginTop: 12, background: 'var(--color-background-secondary)', borderRadius: 12, padding: '12px 16px'}}>
              <p style={{fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 8}}>VOIX GÉNÉRÉE — ajoute ce MP3 dans CapCut</p>
              <audio controls src={audioUrl} style={{width: '100%'}} />
              <a href={audioUrl} download="voix.mp3" style={{display: 'block', marginTop: 8, fontSize: 12, color: 'var(--color-text-secondary)'}}>⬇️ Télécharger le MP3</a>
            </div>
          )}
        </>
      )}
    </div>
  )
}
