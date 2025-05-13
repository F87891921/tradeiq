import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

interface Trade {
  id: number
  datum: string
  produkt: string
  entry: number
  sl: number
  tp: number
  certifikat: number
  typ: string
  rr: number
}

export default function Home() {
  const [trades, setTrades] = useState<Trade[]>([])

  useEffect(() => {
    fetchTrades()
  }, [])

  const fetchTrades = async () => {
    const { data, error } = await supabase.from('planned_trades').select('*')
    if (error) {
      console.error('Kunde inte hämta trades:', error)
    } else {
      setTrades(data)
    }
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Trade IQ – Planerade trades</h1>
      {trades.length === 0 ? (
        <p>Inga trades planerade ännu.</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Nr</th>
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
            {trades.map((trade, index) => (
              <tr key={trade.id}>
                <td>{index + 1}</td>
                <td>{trade.datum}</td>
                <td>{trade.produkt}</td>
                <td>{trade.entry}</td>
                <td>{trade.sl}</td>
                <td>{trade.tp}</td>
                <td>{trade.certifikat}</td>
                <td>{trade.typ}</td>
                <td>{trade.rr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
