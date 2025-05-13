import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [productName, setProductName] = useState('');
  const [iskStatus, setIskStatus] = useState(null);
  const [selectedStrategy, setSelectedStrategy] = useState('');

  const iskApprovedList = [
    'NVDA VT517', 'MFL HM VT71', 'MFL EVO VT373', 'MFL SP500 VT212'
  ];

  const checkISK = () => {
    if (iskApprovedList.includes(productName.trim())) {
      setIskStatus(true);
    } else {
      setIskStatus(false);
    }
  };

  const strategies = {
    'TP + Trailing SL': {
      why: 'Kombinerar fast vinstmål med skydd för uppsida.',
      steps: [
        'Sätt TP1, TP2 och TP3-nivåer i Avanza.',
        'Sätt en initial Stop Loss (SL).',
        'Flytta SL uppåt när priset går upp (Trailing).',
        'Lås vinst när TP1/TP2 träffas.'
      ]
    },
    'Scalp Entry': {
      why: 'Snabba vinster på korta rörelser.',
      steps: [
        'Leta efter momentum via candlestick.',
        'Lägg en snäv SL och ta vinst snabbt.',
        'Avsluta trade inom några minuter/timmar.'
      ]
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Lato, sans-serif' }}>
      <h1>Trade IQ – ISK-koll & Strategiguide</h1>

      {/* ISK Kontroll */}
      <h2>1. ISK-godkännande</h2>
      <input
        type="text"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="Ange produktnamn, t.ex. NVDA VT517"
        style={{ padding: '0.5rem', width: '100%', borderRadius: '6px', border: '1px solid #ccc' }}
      />
      <button onClick={checkISK} style={{ marginTop: '0.5rem' }}>Kontrollera ISK</button>

      {iskStatus === true && <p style={{ color: 'green' }}>✅ Produkten “{productName}” är ISK-godkänd.</p>}
      {iskStatus === false && <p style={{ color: 'red' }}>⚠️ Produkten “{productName}” är <strong>inte</strong> ISK-godkänd.</p>}

      {/* Strategiguide */}
      <h2>2. Trade Execution Guide</h2>
      <select
        value={selectedStrategy}
        onChange={(e) => setSelectedStrategy(e.target.value)}
        style={{ padding: '0.5rem', width: '100%', borderRadius: '6px', border: '1px solid #ccc' }}>
        <option value="">Välj strategi</option>
        {Object.keys(strategies).map((key) => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>

      {selectedStrategy && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Strategi:</strong> {selectedStrategy}</p>
          <p><strong>Varför:</strong> {strategies[selectedStrategy].why}</p>
          <p><strong>Steg-för-steg i Avanza:</strong></p>
          <ul>
            {strategies[selectedStrategy].steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
