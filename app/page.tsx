"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import RiskCalculator from '../components/RiskCalculator';
import TradeForm from '../components/TradeForm';
import TradeHistory from '../components/TradeHistory';

type Account = {
  id: number;
  initial_balance: number;
  current_total_loss: number;
  current_daily_loss: number;
};

export default function Page() {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch account data on mount
  useEffect(() => {
    const fetchAccount = async () => {
      const { data, error } = await supabase
        .from('trading_accounts')
        .select('*')
        .single();
      if (error) console.error(error);
      else setAccount(data);
      setLoading(false);
    };
    fetchAccount();
  }, []);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  if (!account) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Account not found</div>;

  return (
    <main style={{ minHeight: '100vh', background: 'black', color: 'white', padding: '20px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>PropGuard Dashboard</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          <div style={{ padding: '15px', background: '#18181b', borderRadius: '8px', border: '1px solid #27272a' }}>
            <p style={{ fontSize: '10px', color: '#71717a' }}>BALANCE</p>
            <p style={{ fontSize: '18px' }}>${(account.initial_balance - (account.current_total_loss || 0)).toLocaleString()}</p>
          </div>
          <div style={{ padding: '15px', background: '#18181b', borderRadius: '8px', border: '1px solid #27272a' }}>
            <p style={{ fontSize: '10px', color: '#71717a' }}>DAILY LOSS</p>
            <p style={{ fontSize: '18px' }}>${account.current_daily_loss || 0}</p>
          </div>
        </div>

        {/* Risk Engine */}
        <RiskCalculator dbAccount={account} />

        {/* Trade Form */}
        <TradeForm 
          dbAccount={account} 
          setDailyLoss={(val) => setAccount({ ...account, current_daily_loss: val })}
          setBalance={(val) => setAccount({ ...account, current_total_loss: account.initial_balance - val })}
        />

        {/* Trade History */}
        <TradeHistory accountId={account.id} />
      </div>
    </main>
  );
}
