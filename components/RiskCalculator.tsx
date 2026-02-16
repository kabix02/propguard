"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type Account = {
  id: number;
  initial_balance: number;
  current_total_loss: number;
  current_daily_loss: number;
};

export default function RiskCalculator({
  dbAccount,
  setDailyLoss
}: {
  dbAccount: Account;
  setDailyLoss: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [riskPercentage, setRiskPercentage] = useState(1);
  const [suggestedLot, setSuggestedLot] = useState(0);

  // Calculate suggested lot based on current balance and daily loss
  useEffect(() => {
    const balance = Number(dbAccount.initial_balance) - Number(dbAccount.current_total_loss || 0);
    const lot = (balance * (riskPercentage / 100)) / 10; // simple calculation example
    setSuggestedLot(lot);
  }, [riskPercentage, dbAccount]);

  const handleUpdateRisk = async (newRisk: number) => {
    setRiskPercentage(newRisk);

    // Optionally, update daily loss in Supabase for dynamic risk tracking
    const balance = Number(dbAccount.initial_balance) - Number(dbAccount.current_total_loss || 0);
    const additionalLoss = balance * (newRisk / 100);

    const { error } = await supabase
      .from('trading_accounts')
      .update({ current_daily_loss: Number(dbAccount.current_daily_loss || 0) + additionalLoss })
      .eq('id', dbAccount.id);

    if (error) console.error(error);
    else setDailyLoss(Number(dbAccount.current_daily_loss || 0) + additionalLoss);
  };

  return (
    <div style={{ marginTop: '20px', padding: '15px', background: '#18181b', borderRadius: '8px', border: '1px solid #27272a' }}>
      <p style={{ fontSize: '10px', color: '#71717a', marginBottom: '10px' }}>RISK CALCULATOR</p>

      <input
        type="number"
        value={riskPercentage}
        onChange={(e) => handleUpdateRisk(Number(e.target.value))}
        style={{ width: '100%', padding: '10px', background: 'black', border: '1px solid #27272a', color: 'white', borderRadius: '5px', marginBottom: '15px' }}
      />

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#71717a', fontSize: '12px' }}>SUGGESTED LOT SIZE</p>
        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4ade80' }}>{suggestedLot.toFixed(2)}</p>
      </div>
    </div>
  );
}
