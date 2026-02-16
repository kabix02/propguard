"use client";
import { useState, useEffect } from 'react';

type Account = {
  id: number;
  initial_balance: number;
  current_total_loss: number;
  current_daily_loss: number;
};

export default function RiskCalculator({
  dbAccount,
  balance
}: {
  dbAccount: Account;
  balance: number; // now we pass the dynamic balance from page.tsx
}) {
  const [riskPercentage, setRiskPercentage] = useState(1);
  const [suggestedLot, setSuggestedLot] = useState(0);

  // Recalculate lot size whenever risk % or balance changes
  useEffect(() => {
    const lot = (balance * (riskPercentage / 100)) / 10; // simple calculation
    setSuggestedLot(lot);
  }, [riskPercentage, balance]);

  return (
    <div style={{ marginTop: '20px', padding: '15px', background: '#18181b', borderRadius: '8px', border: '1px solid #27272a' }}>
      <p style={{ fontSize: '10px', color: '#71717a', marginBottom: '10px' }}>RISK CALCULATOR</p>

      <input
        type="number"
        value={riskPercentage}
        onChange={(e) => setRiskPercentage(Number(e.target.value))}
        style={{ width: '100%', padding: '10px', background: 'black', border: '1px solid #27272a', color: 'white', borderRadius: '5px', marginBottom: '15px' }}
      />

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#71717a', fontSize: '12px' }}>SUGGESTED LOT SIZE</p>
        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4ade80' }}>{suggestedLot.toFixed(2)}</p>
      </div>
    </div>
  );
}
