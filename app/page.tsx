import { supabase } from '@/lib/supabase';
import RiskCalculator from '@/components/RiskCalculator';

export default async function Page() {
  // This fetches your trading account data from Supabase
  const { data: account } = await supabase.from('trading_accounts').select('*').single();

  // If you haven't run the SQL in Supabase yet, you will see this message
  if (!account) {
    return (
      <div style={{ color: 'white', padding: '40px', textAlign: 'center', background: 'black', minHeight: '100vh' }}>
        <h2>Account Not Found</h2>
        <p>Please run the SQL command in your Supabase SQL Editor to create your $100k account.</p>
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'black', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>PropGuard Dashboard</h1>
        
        {/* Account Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
          <div style={{ padding: '20px', background: '#18181b', borderRadius: '12px', border: '1px solid #27272a' }}>
            <p style={{ fontSize: '12px', color: '#71717a', margin: '0 0 5px 0' }}>CURRENT BALANCE</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
              ${(account.initial_balance - (account.current_total_loss || 0)).toLocaleString()}
            </p>
          </div>
          
          <div style={{ padding: '20px', background: '#18181b', borderRadius: '12px', border: '1px solid #27272a' }}>
            <p style={{ fontSize: '12px', color: '#71717a', margin: '0 0 5px 0' }}>DAILY LOSS</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: account.current_daily_loss > 0 ? '#ef4444' : '#22c55e' }}>
              ${account.current_daily_loss || 0}
            </p>
          </div>
        </div>

        {/* Risk Calculator Component */}
        <div style={{ background: '#18181b', padding: '20px', borderRadius: '12px', border: '1px solid #27272a' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Risk Calculator</h2>
          <RiskCalculator dbAccount={account} />
        </div>

        <p style={{ marginTop: '30px', fontSize: '12px', color: '#3f3f46', textAlign: 'center' }}>
          Minimum Risk-to-Reward Ratio: 1:2
        </p>
      </div>
    </main>
  );
}
