"use client";
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import RiskCalculator from '../components/RiskCalculator';
import TradeForm from '../components/TradeForm';

type Account = {
  id: number;
  initial_balance: number;
  current_total_loss: number;
  current_daily_loss: number;
};

export default function Page({ dbAccountProp }: { dbAccountProp: Account }) {
  const [dailyLoss, setDailyLoss] = useState(Number(dbAccountProp.current_daily_loss || 0));
  const balance = Number(dbAccountProp.initial_balance) - Number(dbAccountProp.current_total_loss || 0);

  return (
    <main style={{ minHeight: '100vh', background: 'black', color: 'white', padding: '20px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>PropGuard Dashboard</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          <div style={{ padding: '15px', background: '#18181b', borderRadius: '8px', border: '1px solid #27272a' }}>
            <p style={{ fontSize: '10px', color: '#71717a' }}>BALANCE</p>
            <p style={{ fontSize: '18px' }}>${balance.toLocaleString()}</p>
          </div>
          <div style={{ padding: '15px', background: '#18181b', borderRadius: '8px', border: '1px solid #27272a' }}>
            <p style={{ fontSize: '10px', color: '#71717a' }}>DAILY LOSS</p>
            <p style={{ fontSize: '18px' }}>${dailyLoss.toLocaleString()}</p>
          </div>
        </div>

        {/* Risk Calculator */}
        <RiskCalculator dbAccount={dbAccountProp} />

        {/* Trade Logger */}
        <TradeForm dbAccount={dbAccountProp} setDailyLoss={setDailyLoss} />
      </div>
    </main>
  );
}
