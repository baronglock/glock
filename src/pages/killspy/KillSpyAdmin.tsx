import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Key, DollarSign, AlertTriangle, Check, X, Plus, Trash2, LogOut, RefreshCw } from 'lucide-react';
import { getSession, getProfile, supabase, logout } from './killspy-api';

const ks = {
  bg: '#0a0a0f', bgCard: '#0f1018', teal: '#2dd4bf', tealDim: 'rgba(45,212,191,0.08)',
  tealGlow: 'rgba(45,212,191,0.2)', red: '#ef4444', redDim: 'rgba(239,68,68,0.08)',
  green: '#22c55e', greenDim: 'rgba(34,197,94,0.08)', amber: '#f59e0b', amberDim: 'rgba(245,158,11,0.08)',
  text: '#e8e8e8', muted: '#777', mutedLight: '#555', border: 'rgba(255,255,255,0.06)',
  mono: "'JetBrains Mono','Fira Code',monospace", sans: "'Inter',system-ui,sans-serif",
};

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <div style={{ padding: 20, background: ks.bgCard, border: `1px solid ${ks.border}`, borderRadius: 14, borderTop: `2px solid ${color}20` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon size={16} color={color} />
        <span style={{ fontSize: 11, color: ks.muted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

function Tab({ active, label, onClick, count }: { active: boolean; label: string; onClick: () => void; count?: number }) {
  return (
    <button onClick={onClick} style={{
      padding: '10px 20px', background: active ? ks.tealDim : 'transparent',
      border: `1px solid ${active ? 'rgba(45,212,191,0.2)' : ks.border}`,
      borderRadius: 8, color: active ? ks.teal : ks.muted, fontSize: 13, fontWeight: 600,
      cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {label}
      {count !== undefined && <span style={{ padding: '2px 8px', background: active ? 'rgba(45,212,191,0.15)' : `${ks.border}`, borderRadius: 10, fontSize: 11 }}>{count}</span>}
    </button>
  );
}

export default function KillSpyAdmin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'users' | 'licenses' | 'withdrawals'>('overview');

  // Data
  const [users, setUsers] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  // referrals loaded in loadAll

  // Generate key modal
  
  const [genEmail, setGenEmail] = useState('');
  const [genPlan, setGenPlan] = useState('M');
  const [genMsg, setGenMsg] = useState('');

  useEffect(() => { checkAdmin(); }, []);

  const checkAdmin = async () => {
    const session = await getSession();
    if (!session) { navigate('/conta/login'); return; }
    const profile = await getProfile();
    if (!profile?.is_admin) { navigate('/conta/dashboard'); return; }
    await loadAll();
    setLoading(false);
  };

  const loadAll = async () => {
    const [u, l, p, w] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('licenses').select('*, profiles(name, email)').order('created_at', { ascending: false }),
      supabase.from('payments').select('*').order('created_at', { ascending: false }),
      supabase.from('withdrawals').select('*, profiles(name, email)').order('requested_at', { ascending: false }),
    ]);
    setUsers(u.data || []);
    setLicenses(l.data || []);
    setPayments(p.data || []);
    setWithdrawals(w.data || []);
  };

  const revokeLicense = async (key: string) => {
    if (!confirm(`Revogar chave ${key}?`)) return;
    await supabase.from('licenses').update({ is_active: false }).eq('key', key);
    loadAll();
  };

  const handleWithdrawal = async (id: string, action: 'approved' | 'paid' | 'rejected') => {
    await supabase.from('withdrawals').update({
      status: action,
      ...(action === 'paid' ? { paid_at: new Date().toISOString() } : {}),
    }).eq('id', id);
    if (action === 'paid') {
      const w = withdrawals.find(x => x.id === id);
      if (w) await supabase.from('referrals').update({ commission_paid: true, paid_at: new Date().toISOString() }).eq('referrer_user_id', w.user_id).eq('commission_paid', false);
    }
    loadAll();
  };

  const generateKey = async () => {
    setGenMsg('');
    // Search by email in auth.users via RPC, or match by name in profiles
    const emailLower = genEmail.trim().toLowerCase();
    let userId = '';

    // Try to find by email match - profiles might have email from auth join
    // Since profiles doesn't have email, search by matching auth user
    const { data: authSearch } = await supabase.rpc('find_user_by_email', { p_email: emailLower });
    if (authSearch) {
      userId = authSearch;
    } else {
      // Fallback: match by name
      const user = users.find(u => u.name?.toLowerCase() === emailLower);
      if (user) userId = user.id;
    }
    if (!userId) { setGenMsg('Email não encontrado. O usuário precisa criar conta primeiro.'); return; }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const rand = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const days = genPlan === 'S' ? 1 : genPlan === 'M' ? 30 : 365;
    const expires = new Date(Date.now() + days * 86400000).toISOString();
    const key = `KILL-${rand}-${genPlan}-${expires.slice(0, 10).replace(/-/g, '')}-MANU`;

    const { error } = await supabase.from('licenses').insert({ user_id: userId, key, plan_type: genPlan, expires_at: expires });
    if (error) { setGenMsg(error.message); return; }

    // Send email with the license key
    const userName = users.find(u => u.id === userId)?.name || '';
    await supabase.functions.invoke('send-license-email', {
      body: { to: emailLower, name: userName, key, plan: genPlan, expires_at: expires },
    });

    setGenMsg(`Chave gerada e email enviado: ${key}`);
    setGenEmail('');
    loadAll();
  };

  if (loading) return (
    <div style={{ background: ks.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${ks.border}`, borderTopColor: ks.teal, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // Stats
  const activeUsers = users.length;
  const activeLicenses = licenses.filter(l => l.is_active && new Date(l.expires_at) > new Date()).length;
  const totalRevenue = payments.reduce((s, p) => s + parseFloat(p.amount || 0), 0);
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;

  return (
    <div style={{ background: ks.bg, minHeight: '100vh', fontFamily: ks.sans, color: ks.text }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: 'url(/texture-film-grain.webp)', backgroundRepeat: 'repeat', backgroundSize: '256px', opacity: 0.04, mixBlendMode: 'overlay' }} />

      {/* Navbar */}
      <nav style={{ padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${ks.border}`, position: 'relative', zIndex: 2, background: `${ks.bg}e0`, backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
            <img src="/stauf-icon.png" alt="S" width={20} height={20} />
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', color: '#fff' }}>TAUF<span style={{ color: ks.teal }}>.</span></span>
          </Link>
          <span style={{ color: ks.mutedLight }}>›</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: ks.red }}>Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => loadAll()} style={{ background: 'none', border: 'none', color: ks.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
            <RefreshCw size={13} /> Atualizar
          </button>
          <Link to="/conta/dashboard" style={{ fontSize: 11, color: ks.muted, textDecoration: 'none' }}>Dashboard</Link>
          <button onClick={logout} style={{ background: 'none', border: 'none', color: ks.mutedLight, cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
            <LogOut size={12} /> Sair
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px', position: 'relative', zIndex: 2 }}>

        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Painel <span style={{ color: ks.teal }}>Admin</span></h1>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }} className="admin-stats">
          <StatCard icon={Users} label="Usuários" value={activeUsers} color={ks.teal} />
          <StatCard icon={Key} label="Licenças ativas" value={activeLicenses} color={ks.green} />
          <StatCard icon={DollarSign} label="Receita total" value={`R$${totalRevenue.toFixed(0)}`} color={ks.green} />
          <StatCard icon={AlertTriangle} label="Saques pendentes" value={pendingWithdrawals} color={pendingWithdrawals > 0 ? ks.amber : ks.muted} />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          <Tab active={tab === 'overview'} label="Visão geral" onClick={() => setTab('overview')} />
          <Tab active={tab === 'users'} label="Usuários" onClick={() => setTab('users')} count={activeUsers} />
          <Tab active={tab === 'licenses'} label="Licenças" onClick={() => setTab('licenses')} count={licenses.length} />
          <Tab active={tab === 'withdrawals'} label="Saques" onClick={() => setTab('withdrawals')} count={pendingWithdrawals} />
        </div>

        {/* ═══ OVERVIEW ═══ */}
        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="admin-grid">
            {/* Recent users */}
            <div style={{ padding: 24, background: ks.bgCard, border: `1px solid ${ks.border}`, borderRadius: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Users size={16} color={ks.teal} /> Últimos cadastros</h3>
              {users.slice(0, 5).map(u => (
                <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: `1px solid ${ks.border}` }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: ks.text }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: ks.muted }}>{u.email || '—'}</div>
                  </div>
                  <span style={{ fontFamily: ks.mono, fontSize: 10, color: ks.teal, padding: '3px 8px', background: ks.tealDim, borderRadius: 4 }}>{u.ref_code}</span>
                </div>
              ))}
            </div>

            {/* Generate key */}
            <div style={{ padding: 24, background: ks.bgCard, border: `1px solid ${ks.border}`, borderRadius: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Plus size={16} color={ks.green} /> Gerar chave manual</h3>
              <label style={{ display: 'block', fontSize: 11, color: ks.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, fontWeight: 500 }}>Email do usuário</label>
              <input type="email" value={genEmail} onChange={e => setGenEmail(e.target.value)} placeholder="cliente@email.com"
                style={{ width: '100%', padding: '10px 12px', background: ks.bg, border: `1px solid ${ks.border}`, borderRadius: 8, color: ks.text, fontSize: 13, outline: 'none', marginBottom: 12, boxSizing: 'border-box' }} />
              <label style={{ display: 'block', fontSize: 11, color: ks.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, fontWeight: 500 }}>Plano</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {[{ v: 'S', l: 'Varredura (1d)' }, { v: 'M', l: 'Mensal (30d)' }, { v: 'A', l: 'Anual (365d)' }].map(p => (
                  <button key={p.v} onClick={() => setGenPlan(p.v)} style={{
                    flex: 1, padding: '8px 12px', fontSize: 12, fontWeight: 600,
                    background: genPlan === p.v ? ks.tealDim : ks.bg,
                    border: `1px solid ${genPlan === p.v ? 'rgba(45,212,191,0.2)' : ks.border}`,
                    borderRadius: 8, color: genPlan === p.v ? ks.teal : ks.muted, cursor: 'pointer',
                  }}>{p.l}</button>
                ))}
              </div>
              <button onClick={generateKey} style={{ width: '100%', padding: 12, background: ks.green, color: '#000', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                Gerar chave
              </button>
              {genMsg && <p style={{ marginTop: 10, fontSize: 12, color: genMsg.includes('gerada') ? ks.green : ks.red, fontFamily: genMsg.includes('KILL') ? ks.mono : ks.sans, wordBreak: 'break-all' }}>{genMsg}</p>}
            </div>

            {/* Pending withdrawals */}
            <div style={{ padding: 24, background: ks.bgCard, border: `1px solid ${ks.border}`, borderRadius: 14, gridColumn: '1 / -1' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><DollarSign size={16} color={ks.amber} /> Saques pendentes</h3>
              {withdrawals.filter(w => w.status === 'pending').length === 0 ? (
                <p style={{ color: ks.muted, fontSize: 13 }}>Nenhum saque pendente</p>
              ) : (
                withdrawals.filter(w => w.status === 'pending').map(w => (
                  <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: `1px solid ${ks.border}` }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{w.profiles?.name || '—'}</div>
                      <div style={{ fontSize: 11, color: ks.muted }}>PIX: {w.pix_key}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: ks.green, fontFamily: ks.mono }}>R${parseFloat(w.amount).toFixed(2)}</span>
                      <button onClick={() => handleWithdrawal(w.id, 'paid')} style={{ padding: '6px 14px', background: ks.greenDim, border: `1px solid rgba(34,197,94,0.2)`, borderRadius: 6, color: ks.green, fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Check size={12} /> Pagar
                      </button>
                      <button onClick={() => handleWithdrawal(w.id, 'rejected')} style={{ padding: '6px 14px', background: ks.redDim, border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 6, color: ks.red, fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <X size={12} /> Rejeitar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ═══ USERS ═══ */}
        {tab === 'users' && (
          <div style={{ padding: 24, background: ks.bgCard, border: `1px solid ${ks.border}`, borderRadius: 14, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Nome', 'Email', 'Ref Code', 'Indicado por', 'Admin', 'Criado'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: ks.mutedLight, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, borderBottom: `1px solid ${ks.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: `1px solid ${ks.border}` }}>
                    <td style={{ padding: '10px 12px', fontWeight: 500 }}>{u.name}</td>
                    <td style={{ padding: '10px 12px', color: ks.muted }}>{u.email || '—'}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ fontFamily: ks.mono, fontSize: 11, color: ks.teal, padding: '2px 8px', background: ks.tealDim, borderRadius: 4 }}>{u.ref_code}</span></td>
                    <td style={{ padding: '10px 12px', color: ks.muted, fontFamily: ks.mono, fontSize: 11 }}>{u.referred_by || '—'}</td>
                    <td style={{ padding: '10px 12px' }}>{u.is_admin ? <span style={{ color: ks.green }}>✓</span> : '—'}</td>
                    <td style={{ padding: '10px 12px', color: ks.muted, fontSize: 11 }}>{u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ═══ LICENSES ═══ */}
        {tab === 'licenses' && (
          <div style={{ padding: 24, background: ks.bgCard, border: `1px solid ${ks.border}`, borderRadius: 14, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Chave', 'Usuário', 'Plano', 'Expira', 'Device', 'Status', 'Ação'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: ks.mutedLight, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, borderBottom: `1px solid ${ks.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {licenses.map(l => {
                  const active = l.is_active && new Date(l.expires_at) > new Date();
                  return (
                    <tr key={l.id} style={{ borderBottom: `1px solid ${ks.border}` }}>
                      <td style={{ padding: '10px 12px', fontFamily: ks.mono, fontSize: 11, color: ks.teal, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.key}</td>
                      <td style={{ padding: '10px 12px', color: ks.muted, fontSize: 12 }}>{l.profiles?.name || '—'}</td>
                      <td style={{ padding: '10px 12px' }}><span style={{ padding: '2px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: l.plan_type === 'A' ? ks.greenDim : l.plan_type === 'M' ? ks.tealDim : ks.amberDim, color: l.plan_type === 'A' ? ks.green : l.plan_type === 'M' ? ks.teal : ks.amber }}>{l.plan_type === 'S' ? 'Varredura' : l.plan_type === 'M' ? 'Mensal' : 'Anual'}</span></td>
                      <td style={{ padding: '10px 12px', color: ks.muted, fontSize: 11 }}>{new Date(l.expires_at).toLocaleDateString('pt-BR')}</td>
                      <td style={{ padding: '10px 12px', fontFamily: ks.mono, fontSize: 10, color: ks.mutedLight, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.device_id ? `${l.device_brand || ''} ${l.device_model || ''}`.trim() || l.device_id.slice(0, 12) + '...' : '—'}</td>
                      <td style={{ padding: '10px 12px' }}><span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: active ? ks.greenDim : ks.redDim, color: active ? ks.green : ks.red }}>{active ? 'Ativa' : l.is_active ? 'Expirada' : 'Revogada'}</span></td>
                      <td style={{ padding: '10px 12px' }}>
                        {l.is_active && <button onClick={() => revokeLicense(l.key)} style={{ padding: '4px 10px', background: ks.redDim, border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 4, color: ks.red, fontSize: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><Trash2 size={11} /> Revogar</button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ═══ WITHDRAWALS ═══ */}
        {tab === 'withdrawals' && (
          <div style={{ padding: 24, background: ks.bgCard, border: `1px solid ${ks.border}`, borderRadius: 14, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Usuário', 'Valor', 'PIX', 'Status', 'Solicitado', 'Ações'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: ks.mutedLight, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, borderBottom: `1px solid ${ks.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {withdrawals.map(w => (
                  <tr key={w.id} style={{ borderBottom: `1px solid ${ks.border}` }}>
                    <td style={{ padding: '10px 12px', fontWeight: 500 }}>{w.profiles?.name || '—'}</td>
                    <td style={{ padding: '10px 12px', fontFamily: ks.mono, fontWeight: 700, color: ks.green }}>R${parseFloat(w.amount).toFixed(2)}</td>
                    <td style={{ padding: '10px 12px', fontSize: 12, color: ks.muted }}>{w.pix_key}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        padding: '3px 12px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                        background: w.status === 'paid' ? ks.greenDim : w.status === 'pending' ? ks.amberDim : w.status === 'approved' ? ks.tealDim : ks.redDim,
                        color: w.status === 'paid' ? ks.green : w.status === 'pending' ? ks.amber : w.status === 'approved' ? ks.teal : ks.red,
                      }}>{w.status === 'paid' ? 'Pago' : w.status === 'pending' ? 'Pendente' : w.status === 'approved' ? 'Aprovado' : 'Rejeitado'}</span>
                    </td>
                    <td style={{ padding: '10px 12px', color: ks.muted, fontSize: 11 }}>{w.requested_at ? new Date(w.requested_at).toLocaleDateString('pt-BR') : '—'}</td>
                    <td style={{ padding: '10px 12px' }}>
                      {w.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => handleWithdrawal(w.id, 'paid')} style={{ padding: '4px 12px', background: ks.greenDim, border: `1px solid rgba(34,197,94,0.2)`, borderRadius: 4, color: ks.green, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>Pagar</button>
                          <button onClick={() => handleWithdrawal(w.id, 'rejected')} style={{ padding: '4px 12px', background: ks.redDim, border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 4, color: ks.red, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>Rejeitar</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @media(max-width:900px){ .admin-stats{grid-template-columns:1fr 1fr!important} .admin-grid{grid-template-columns:1fr!important} }
        @media(max-width:500px){ .admin-stats{grid-template-columns:1fr!important} }
      `}</style>
    </div>
  );
}
