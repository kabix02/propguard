'use client';
import React, { useState, useEffect } from 'react';

export default function RiskCalculator({ dbAccount }: { dbAccount: any }) {
  const [inputs, setInputs] = useState({
    riskPct: dbAccount?.risk_per_trade_pct || 1,
    entry: 1.08500,
    stopLoss: 1.08250,
    pipValue: 10,
  });

  const [res, setRes] = useState({ lot: 0, viol: false });

  useEffect(() => {
    const pips = Math.abs(inputs.entry - inputs.stopLoss) * 10000;
    const dol = dbAccount.initial_balance * (inputs.riskPct / 100);
    const lot = pips > 0 ? dol / (pips * inputs.pipValue) : 0;
    const dLim = dbAccount.initial_balance * (dbAccount.daily_limit_pct / 100);
    
    setRes({
      lot: Number(lot.toFixed(2)),
      viol: (dLim - dbAccount.current_daily_loss - dol) <= 0
    });
  }, [inputs, dbAccount]);

  return (
    <div style={{background: '#18181b', padding: '20px', borderRadius: '12px', border: '1px solid #27272a'}}>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px'}}>
        <input type="number" value={inputs.entry} onChange={e => setInputs({...inputs, entry: Number(e.target.value)})} style={{background: '#09090b', color: 'white', padding: '8px', border: '1px solid #27272a'}} placeholder="Entry" />
        <input type="number" value={inputs.stopLoss} onChange={e => setInputs({...inputs, stopLoss: Number(e.target.value)})} style={{background: '#09090b', color: 'white', padding: '8px', border: '1px solid #27272a'}} placeholder="SL" />
      </div>
      <div style={{textAlign: 'center', padding: '20px', background: '#09090b', borderRadius: '8px'}}>
        <p style={{fontSize: '12px', color: '#71717a'}}>RECOMMENDED LOTS</p>
        <p style={{fontSize: '32px', fontWeight: 'bold', color: res.viol ? '#ef4444' : '#10b981'}}>{res.lot}</p>
      </div>
    </div>
  );
}
