"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type Trade = {
  id: number;
  pips: number;
  risk_percent: number;
  lot_size: number;
  profit_loss: number;
  timestamp: string;
};

export default function TradeHistory({ accountId }: { accountId: number }) {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const fetchTrades = async () => {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('account_id', accountId)
        .order('timestamp', { ascending: false });
      
      if (error) console.error(error);
      else setTrades(data);
    };

    fetchTrades();
  }, [accountId]);

  if (!trades.length) return <p style={{ color: '#71717a', marginTop: '20px' }}>No trades logged yet.</p>;

  return (
    <div style={{ marginTop: '20px', padding: '15px', background: '#18181b', borderRadius: '8px', border: '1px solid #27272a' }}>
      <p style={{ fontSize: '10px', color: '#71717a', marginBottom: '10px' }}>TRADE HISTORY</p>
      <table style={{ width: '100%', color: 'white', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #27272a', padding: '5px', fontSize: '12px' }}>Pips</th>
            <th style={{ borderBottom: '1px solid #27272a', padding: '5px', fontSize: '12px' }}>Risk %</th>
            <th style={{ borderBottom: '1px solid #27272a', padding: '5px', fontSize: '12px' }}>Lot Size</th>
            <th style={{ borderBottom: '1px solid #27272a', padding: '5px', fontSize: '12px' }}>P/L</th>
            <th style={{ borderBottom: '1px solid #27272a', padding: '5px', fontSize: '12px' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr key={trade.id}>
              <td style={{ padding: '5px', fontSize: '14px' }}>{trade.pips}</td>
              <td style={{ padding: '5px', fontSize: '14px' }}>{trade.risk_percent}%</td>
              <td style={{ padding: '5px', fontSize: '14px' }}>{trade.lot_size}</td>
              <td style={{ padding: '5px', fontSize: '14px' }}>{trade.profit_loss}</td>
              <td style={{ padding: '5px', fontSize: '14px' }}>{new Date(trade.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
