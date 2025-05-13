// pages/index.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Trade = {
  id: number
  date: string
  product: string
  entry: number
  sl: number
  tp: number
  certs: number
  type: string
  rr: number
}

export default function Home() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)

  const [newTrade, setNewTrade] = useState({
    date: '',
    product: '',
    entry: '',
    sl: '',
    tp: '',
    certs: '',
    type: '',
    rr: '',
  })

  // Hämta trades från Supabase
  const fetchTrades = async () => {
    const { data, error } = await supabase.from('planned_trades').select('*').order('id', { ascending: true })
    if (!error && data) {
      setTrades(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTrades()
  }, [])

  // Lägg till ny trade
  const addTrade = async () => {
    const { error } = await supabase.from('planned_trades').insert([
      {
        date: newTrade.date,
        product: newTrade.product,
        entry: parseFloat(newTrade.entry),
        sl: parseFloat(newTrade.sl),
        tp: parseFloat(newTrade.tp),
        certs: parseInt(newTrade.certs),
        type: newTrade.type,
        rr: parseFloat(newTrade.rr),
      },
    ])
    if (!error) {
      setNewTrade({ date: '', product: '', entry: '', sl: '', tp: '', certs: '', type: '', rr: '' })
      fetchTrades()
    }
  }

  return (
    <main style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Trade IQ – Planerade trades</h1>

      {loading ? (
        <p>Laddar...</p>
      ) : (
        <>
          <table style={{ width: '100%', marginBottom: 40, borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Datum</th>
                <th>Produkt</th>
                <th>Entry</th>
                <th>SL</th>
                <th>TP</th>
                <th>Certifikat</th>
                <th>Typ</th>
                <th>RR</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id}>
                  <td>{trade.date}</td>
                  <td>{trade.product}</td>
                  <td>{trade.entry}</td>
                  <td>{trade.sl}</td>
                  <td>{trade.tp}</td>
                  <td>{trade.certs}</td>
                  <td>{trade.type}</td>
                  <td>{trade.rr}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Lägg till ny trade</h2>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 400, gap: 10 }}>
            {Object.entries(newTrade).map(([key, value]) => (
              <input
                key={key}
                type="text"
                placeholder={key}
                value={value}
                onChange={(e) => setNewTrade({ ...newTrade, [key]: e.target.value })}
              />
            ))}
            <button onClick={addTrade}>Spara trade</button>
          </div>
        </>
      )}
    </main>
  )
}
