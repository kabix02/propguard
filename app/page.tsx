import { supabase } from '../lib/supabase';
import RiskCalculator from '../components/RiskCalculator';
import TradeForm from '../components/TradeForm';
import TradeHistory from '../components/TradeHistory';

export default async function Page() {
  // Fetch the account from Supabase
  const { data: account, error } = await supabase
    .from('trading_accounts')
    .select('*')
    .single();

  if (error || !account) {
    return (
      <div style={{ color: 'white', padding: '40px', textAlign: 'center', background: 'black', minHeight: '100vh' }}>
        Account not found. Make sure you ran the SQL in Supabase!
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'black', color: 'white', padding: '20px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>PropGuard Dashboard</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          <div style={{ padding: '15px', background: '#18181b', borderRadius: '8px', border: '1px solid #27272a' }}>
            <p style={{ fontSize: '10px', color: '#71717a' }}>BALANCE</p>
            <p style={{ fontSize: '18px' }}>
              ${(account.initial_balance - (account.current_total_loss || 0)).toLocaleString()}
            </p>
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
          setDailyLoss={() => {}} 
          setBalance={() => {}} 
        />

        {/* Trade History */}
        <TradeHistory accountId={account.id} />
      </div>
    </main>
  );
}
