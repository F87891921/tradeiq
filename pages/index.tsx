import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Trade = {
  id: number
  date: string
  product: string
  entry: number
  sl: number
  tp: number
  certs: number
  type: string
  rr: string
}

export default function Home() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [form, setForm] = useState({
    date: '',
    product: '',
    entry: '',
    sl: '',
    tp: '',
    certs: '',
    type: '',
    rr: ''
  })

  async function fetchTrades() {
    const { data, error } = await supabase.from('planned_trades').select('*').order('id', { ascending: true })
    if (data) setTrades(data as Trade[])
  }

  async function addTrade() {
    const { error } = await supabase.from('planned_trades').insert([form])
    if (!error) {
      fetchTrades()
      setForm({
        date: '',
        product: '',
        entry: '',
        sl: '',
        tp: '',
        certs: '',
        type: '',
        rr: ''
      })
    }
  }

  async function deleteTrade(id: number) {
    await supabase.from('planned_trades').delete().eq('id', id)
    fetchTrades()
  }

  useEffect(() => {
    fetchTrades()
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>📈 Trade IQ – Planera och spara analyserade trades</h2>

      <div style={{ marginBottom: '2rem' }}>
        <h3>➕ Lägg till trade</h3>
        {['date', 'product', 'entry', 'sl', 'tp', 'certs', 'type', 'rr'].map((key) => (
          <input
            key={key}
            type="text"
            placeholder={key}
            value={(form as any)[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            style={{
              display: 'block',
              marginBottom: '8px',
              padding: '8px',
              width: '100%',
              border: '1px solid #ccc',
              borderRadius: '6px'
            }}
          />
        ))}
        <button
          onClick={addTrade}
          style={{
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Spara trade
        </button>
      </div>

      <div>
        <h3>📋 Planerade trades</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc' }}>Datum</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>Produkt</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>Entry</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>SL</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>TP</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>Certifikat</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>Typ</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>RR</th>
              <th style={{ borderBottom: '1px solid #ccc' }}></th>
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
                <td>
                  <button
                    onClick={() => deleteTrade(trade.id)}
                    style={{
                      backgroundColor: 'red',
                      color: 'white',
                      border: 'none',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    Ta bort
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
