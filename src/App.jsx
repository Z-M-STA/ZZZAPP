import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { BANNERS, DEFAULT_BANNER_ID } from './data/banners'
import { calculatePulls } from './utils/calculations'

const STORAGE_KEY = 'zzz-pull-calc'

const DEFAULTS = {
  bannerId: DEFAULT_BANNER_ID,
  currentPity: 0,
  guaranteed: false,
  pulls: 0,
  polychromes: 0,
}

// URL params win over localStorage, which wins over defaults.
function loadInitialState() {
  let state = { ...DEFAULTS }
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    state = { ...state, ...saved }
  } catch {
    // ignore broken storage
  }
  const params = new URLSearchParams(window.location.search)
  if (params.has('banner') && BANNERS[params.get('banner')]) {
    state.bannerId = params.get('banner')
  }
  if (params.has('pity')) state.currentPity = Number(params.get('pity')) || 0
  if (params.has('pulls')) state.pulls = Number(params.get('pulls')) || 0
  if (params.has('poly')) state.polychromes = Number(params.get('poly')) || 0
  if (params.has('guaranteed')) state.guaranteed = params.get('guaranteed') === '1'
  return state
}

function App() {
  const [form, setForm] = useState(loadInitialState)
  const banner = BANNERS[form.bannerId] ?? BANNERS[DEFAULT_BANNER_ID]

  // Persist to localStorage and keep the URL shareable.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
    } catch {
      // storage unavailable, fine
    }
    const params = new URLSearchParams({
      banner: form.bannerId,
      pity: String(form.currentPity),
      pulls: String(form.pulls),
      poly: String(form.polychromes),
      guaranteed: form.guaranteed ? '1' : '0',
    })
    window.history.replaceState(null, '', `?${params.toString()}`)
  }, [form])

  const result = useMemo(() => calculatePulls(form, banner), [form, banner])

  const setNumber = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: Math.max(0, Number(e.target.value) || 0) }))

  return (
    <main className="app">
      <h1>ZZZ Pull Calculator</h1>

      <section className="card">
        <label>
          Banner
          <select
            value={form.bannerId}
            onChange={(e) => setForm((f) => ({ ...f, bannerId: e.target.value }))}
          >
            {Object.values(BANNERS).map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Current pity (How many pulls in 0 - {banner.hardPity - 1})
          <input
            type="number"
            min="0"
            max={banner.hardPity - 1}
            value={form.currentPity}
            onChange={setNumber('currentPity')}
          />
        </label>

        <label className="check">
          <input
            type="checkbox"
            checked={form.guaranteed}
            onChange={(e) => setForm((f) => ({ ...f, guaranteed: e.target.checked }))}
          />
          Guaranteed featured (lost the last 50/50)
        </label>

        <label>
          Pulls on hand
          <input type="number" min="0" value={form.pulls} onChange={setNumber('pulls')} />
        </label>

        <label>
          Polychromes
          <input
            type="number"
            min="0"
            value={form.polychromes}
            onChange={setNumber('polychromes')}
          />
        </label>
      </section>

      <section className="card results">
        <h2>Results</h2>
        <dl>
          <dt>Total pulls available</dt>
          <dd>{result.totalPulls}</dd>
          <dt>Pulls to hard pity</dt>
          <dd>{result.pullsToHardPity}</dd>
          <dt>Worst case for featured</dt>
          <dd>{result.worstCaseFeatured}</dd>
          <dt>Chance to get featured</dt>
          <dd>{result.successChance ?? 'coming soon'}</dd>
        </dl>
        {result.isPlaceholder && (
          <p className="note">Placeholder maths - real calculation not wired in yet.</p>
        )}
      </section>
    </main>
  )
}

export default App
