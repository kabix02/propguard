"use client";
import { useState } from 'react';
import { supabase } from '../lib/supabase';

type Account = {
  id: number;
  initial_balance: number;
  current_total_loss: number;
  current_daily_loss: number;
};

export default function TradeForm({
  dbAccount,
  setDailyLoss,
  setBalance
}: {
  dbAccount: Account;
  setDailyLoss: React.Dispatch<React.SetStateAction<number>>;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [pips, setPips] = useState('');
  const [riskPercent, setRiskPercent] = useState('1');
  const [loading, setLoading] = useState(false);

  const balance = Number(dbAccount.initial_balance) - Number(dbAccount.current_total_loss || 0);
  const riskAmount = balance * (Number(riskPercent) / 100);
  const lotSize = pips ? (riskAmount / (Number(pips) * 10)).toFixed(2) : "0.00";

  const handleLogTrade = async () => {
    if (!dbAccount.id || !pips) return;
    setLoading(true);

    // Example P/L: assume 1 pip = $10 per lot (simplified)
    const profitLoss = Number(pips) * Number(lotSize) * 10 * -1; // negative because loss

    const newDailyLoss = Number(dbAccount.current_daily_loss || 0) + Math.abs(profitLoss);

    // 1️⃣ Update account daily loss
    const { error: accountError } = await supabase
      .from('trading_accounts')
      .update({ current_daily_loss: newDailyLoss })
      .eq('id', dbAccount.id);

    // 2️⃣ Insert new trade
    const { error: tradeError } = await supabase
      .from('trades')
      .insert([{
        account_id: dbAccount.id,
        pips: Number(pips),
        risk_percent: Number(riskPercent),
        lot_size: Number(lotSize),
        profit_loss: profitLoss
      }]);

    if (accountError || tradeError) {
      console.error(accountError || tradeError);
      alert("Error logging trade");
    } else {
      setDailyLoss(newDailyLoss);
      setBalance(balance - Math.abs(profitLoss));
      setPips('');
    }

    setLoading(false);
  };

  return (
    <div style={{ marginTop: '20px', padding: '15px', background: '#18181b', borderRadius: '8px', border: '1px solid #27272a' }}>
      <p style={{ fontSize: '10px', color: '#71717a', marginBottom: '10px' }}>NEW TRADE SETUP</p>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input 
          placeholder="SL Pips" 
          type="number"
          value={pips}
          onChange={(e) => setPips(e.target.value)}
          style={{ width: '100%', padding: '10px', background: 'black', border: '1px solid #27272a', color: 'white', borderRadius: '5px' }}
        />
        <select 
          value={riskPercent}
          onChange={(e) => setRiskPercent(e.target.value)}
          style={{ width: '100%', padding: '10px', background: 'black', border: '1px solid #27272a', color: 'white', borderRadius: '5px' }}
        >
          <option value="0.25">0.25% Risk</option>
          <option value="0.5">0.5% Risk</option>
          <option value="1">1% Risk</option>
          <option value="2">2% Risk</option>
        </select>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <p style={{ color: '#71717a', fontSize: '12px' }}>SUGGESTED LOT SIZE</p>
        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4ade80' }}>{lotSize}</p>
      </div>

      <button 
        onClick={handleLogTrade}
        disabled={loading || !pips}
        style={{ width: '100%', padding: '12px', background: 'white', color: 'black', fontWeight: 'bold', borderRadius: '5px', cursor: 'pointer' }}
      >
        {loading ? "Logging..." : "Log Trade & Risk"}
      </button>
    </div>
  );
}
