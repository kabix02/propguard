type Account = {
  initial_balance: number;
  current_total_loss: number;
  current_daily_loss: number;
};

export default function RiskCalculator({ dbAccount }: { dbAccount: Account }) {
  return (
    <div style={{ padding: '15px', background: '#18181b', borderRadius: '8px', border: '1px solid #27272a' }}>
      <p style={{ fontSize: '10px', color: '#71717a' }}>RISK ENGINE</p>
      <p style={{ fontSize: '14px', color: 'white' }}>Loaded for account balance ${Number(dbAccount.initial_balance).toLocaleString()}</p>
    </div>
  );
}
