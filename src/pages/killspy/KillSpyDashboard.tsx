import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Copy, Check, LogOut, Download, Users, DollarSign, Key, Clock, Home, User, Globe, Bot, BarChart3, Zap, ChevronRight } from 'lucide-react';
import { getSession, getProfile, getActiveLicense, getReferrals, requestWithdrawal, logout, supabase } from './killspy-api';

const ks = {
  bg: '#0a0a0f', bgCard: '#0f1018', bgCardHover: '#131320', teal: '#2dd4bf', tealDim: 'rgba(45,212,191,0.08)',
  tealGlow: 'rgba(45,212,191,0.2)', red: '#ef4444', redDim: 'rgba(239,68,68,0.08)',
  green: '#22c55e', greenDim: 'rgba(34,197,94,0.08)', amber: '#f59e0b', amberDim: 'rgba(245,158,11,0.08)',
  purple: '#a855f7', purpleDim: 'rgba(168,85,247,0.08)',
  text: '#e8e8e8', muted: '#777', mutedLight: '#555', border: 'rgba(255,255,255,0.06)',
  borderHover: 'rgba(45,212,191,0.15)', mono: "'JetBrains Mono','Fira Code',monospace", sans: "'Inter',system-ui,sans-serif",
};

function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: copied ? ks.greenDim : ks.tealDim, border: `1px solid ${copied ? 'rgba(34,197,94,0.15)' : ks.border}`, borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: copied ? ks.green : ks.teal, transition: 'all 0.2s' }}>
      {copied ? <><Check size={13} /> Copiado!</> : <><Copy size={13} /> {label || 'Copiar'}</>}
    </button>
  );
}

function Card({ children, span }: { children: React.ReactNode; span?: boolean }) {
  return (
    <div style={{ padding: 'clamp(20px, 3vw, 28px)', background: ks.bgCard, border: `1px solid ${ks.border}`, borderRadius: 16, gridColumn: span ? '1 / -1' : undefined, transition: 'border-color 0.3s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = ks.borderHover}
      onMouseLeave={e => e.currentTarget.style.borderColor = ks.border}>
      {children}
    </div>
  );
}

function CardHeader({ icon: Icon, title, color, action }: { icon: any; title: string; color?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color || ks.teal}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={color || ks.teal} />
        </div>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: ks.text }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

/* ── Service card for other Stauf services ── */
function ServiceLink({ icon: Icon, title, desc, color, href }: { icon: any; title: string; desc: string; color: string; href: string }) {
  return (
    <Link to={href} style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
      background: ks.bg, border: `1px solid ${ks.border}`, borderRadius: 10,
      textDecoration: 'none', transition: 'all 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}30`; e.currentTarget.style.background = `${color}06`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = ks.border; e.currentTarget.style.background = ks.bg; }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} color={color} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: ks.text }}>{title}</div>
        <div style={{ fontSize: 11, color: ks.muted }}>{desc}</div>
      </div>
      <ChevronRight size={14} color={ks.mutedLight} />
    </Link>
  );
}

export default function KillSpyDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'killspy' | 'referrals'>('overview');
  const [user, setUser] = useState<any>(null);
  const [license, setLicense] = useState<any>(null);
  const [status, setStatus] = useState('carregando');
  const [referrals, setReferrals] = useState<any>(null);
  const [balance, setBalance] = useState<any>(null);
  const [pixKey, setPixKey] = useState('');
  const [withdrawMsg, setWithdrawMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<any>(null);

  useEffect(() => {
    const payment = searchParams.get('payment');
    const plan = searchParams.get('plan');
    if (payment === 'success' && plan) {
      setPaymentSuccess(true);
      window.history.replaceState({}, '', '/conta/dashboard');
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const session = await getSession();
      if (!session) { navigate('/conta/login'); return; }
      const { data: { user: au } } = await supabase.auth.getUser();
      setAuthUser(au);
      let profile = await getProfile();
      if (!profile) {
        if (!au) { navigate('/conta/login'); return; }
        await new Promise(r => setTimeout(r, 1000));
        profile = await getProfile();
        if (!profile) {
          setUser({ name: au.user_metadata?.name || au.email?.split('@')[0] || 'Usuário', ref_code: '...', is_admin: false, pix_key: null });
          setLoading(false); return;
        }
      }
      const [activeLicense, refData] = await Promise.all([getActiveLicense(), getReferrals()]);
      setUser(profile); setLicense(activeLicense);
      setStatus(activeLicense ? (new Date(activeLicense.expires_at) > new Date() ? 'ativo' : 'vencido') : 'sem_plano');
      setReferrals(refData);
      setBalance({ balance: refData.balance, total_earned: refData.total_earned, total_paid: refData.total_paid });
      setPixKey(profile.pix_key || '');
    } catch { navigate('/conta/login'); } finally { setLoading(false); }
  };

  const handleWithdraw = async () => {
    if (!pixKey.trim()) { setWithdrawMsg('Informe sua chave PIX'); return; }
    try { await requestWithdrawal(pixKey); setWithdrawMsg('Saque solicitado!'); loadData(); }
    catch (err: any) { setWithdrawMsg(err.message); }
  };

  if (loading) return (
    <div style={{ background: ks.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${ks.border}`, borderTopColor: ks.teal, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (!user) return null;

  const refLink = `https://stauf.com.br/killspy?ref=${user.ref_code}`;
  const isActive = status === 'ativo';
  const isExpired = status === 'vencido';

  return (
    <div style={{ background: ks.bg, minHeight: '100vh', fontFamily: ks.sans, color: ks.text }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: 'url(/texture-film-grain.webp)', backgroundRepeat: 'repeat', backgroundSize: '256px', opacity: 0.04, mixBlendMode: 'overlay' }} />
      <div style={{ position: 'fixed', top: '5%', left: '50%', transform: 'translateX(-50%)', width: '40vw', height: '20vh', background: `radial-gradient(circle, ${ks.tealGlow} 0%, transparent 60%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />

      {/* ═══ TOP BAR ═══ */}
      <nav style={{ padding: '14px clamp(16px, 4vw, 40px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${ks.border}`, position: 'relative', zIndex: 2, background: `${ks.bg}e0`, backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
            <img src="/stauf-icon.png" alt="S" width={20} height={20} style={{ objectFit: 'contain' }} />
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', color: '#fff' }}>TAUF<span style={{ color: ks.teal }}>.</span></span>
          </Link>
          <span style={{ color: ks.mutedLight, fontSize: 11 }}>›</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: ks.text }}>Minha conta</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/" style={{ fontSize: 11, color: ks.muted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}><Home size={12} /> Site</Link>
          {user.is_admin && <Link to="/conta/admin" style={{ fontSize: 11, color: ks.red, textDecoration: 'none', fontWeight: 600, padding: '3px 10px', background: ks.redDim, borderRadius: 6 }}>Admin</Link>}
          <span style={{ color: ks.mutedLight }}>|</span>
          <span style={{ fontSize: 12, color: ks.muted }}>{user.name}</span>
          <button onClick={logout} style={{ background: 'none', border: 'none', color: ks.mutedLight, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}
            onMouseEnter={e => e.currentTarget.style.color = ks.red} onMouseLeave={e => e.currentTarget.style.color = ks.mutedLight}>
            <LogOut size={13} /> Sair
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: 'clamp(24px, 4vw, 40px) clamp(16px, 4vw, 40px)', position: 'relative', zIndex: 2 }}>

        {/* ═══ WELCOME ═══ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, marginBottom: 6 }}>
              Olá, <span style={{ color: ks.teal }}>{user.name.split(' ')[0]}</span>
            </h1>
            <p style={{ fontSize: 13, color: ks.muted }}>{authUser?.email}</p>
          </div>
          {/* Quick status badges */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20,
              background: isActive ? ks.greenDim : isExpired ? ks.redDim : ks.amberDim,
              border: `1px solid ${isActive ? 'rgba(34,197,94,0.15)' : isExpired ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'}`,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: isActive ? ks.green : isExpired ? ks.red : ks.amber }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: isActive ? ks.green : isExpired ? ks.red : ks.amber }}>
                KillSpy: {isActive ? 'Ativo' : isExpired ? 'Vencido' : 'Sem plano'}
              </span>
            </div>
          </div>
        </div>

        {/* ═══ TABS ═══ */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: `1px solid ${ks.border}`, paddingBottom: 0 }}>
          {[
            { id: 'overview', label: 'Visão geral', icon: Home },
            { id: 'killspy', label: 'KillSpy', icon: Shield },
            { id: 'referrals', label: 'Indicações', icon: Users },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
              background: activeTab === t.id ? ks.tealDim : 'transparent',
              border: 'none', borderBottom: activeTab === t.id ? `2px solid ${ks.teal}` : '2px solid transparent',
              color: activeTab === t.id ? ks.teal : ks.muted, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {/* ═══ OVERVIEW TAB ═══ */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="ks-dash-grid">

            {/* Profile card */}
            <Card>
              <CardHeader icon={User} title="Meu perfil" color={ks.purple} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: ks.muted }}>Nome</span>
                  <span style={{ color: ks.text, fontWeight: 500 }}>{user.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderTop: `1px solid ${ks.border}`, paddingTop: 10 }}>
                  <span style={{ color: ks.muted }}>Email</span>
                  <span style={{ color: ks.text, fontWeight: 500 }}>{authUser?.email || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderTop: `1px solid ${ks.border}`, paddingTop: 10 }}>
                  <span style={{ color: ks.muted }}>Telefone</span>
                  <span style={{ color: ks.text, fontWeight: 500 }}>{user.phone || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, borderTop: `1px solid ${ks.border}`, paddingTop: 10 }}>
                  <span style={{ color: ks.muted }}>Código de indicação</span>
                  <span style={{ fontFamily: ks.mono, fontSize: 12, color: ks.teal, padding: '2px 10px', background: ks.tealDim, borderRadius: 4 }}>{user.ref_code}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderTop: `1px solid ${ks.border}`, paddingTop: 10 }}>
                  <span style={{ color: ks.muted }}>Membro desde</span>
                  <span style={{ color: ks.text }}>{user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '—'}</span>
                </div>
              </div>
            </Card>

            {/* KillSpy quick status */}
            <Card>
              <CardHeader icon={Shield} title="KillSpy" action={
                <Link to="#" onClick={() => setActiveTab('killspy')} style={{ fontSize: 11, color: ks.teal, textDecoration: 'none', fontWeight: 600 }}>Ver detalhes →</Link>
              } />
              {license ? (
                <div>
                  <div style={{ padding: '14px 16px', background: ks.bg, borderRadius: 10, border: `1px solid ${ks.border}`, fontFamily: ks.mono, fontSize: 14, color: ks.teal, letterSpacing: '0.04em', wordBreak: 'break-all', marginBottom: 12, boxShadow: `inset 0 0 20px ${ks.tealDim}` }}>
                    {license.key}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <CopyBtn text={license.key} />
                    <span style={{ fontSize: 12, color: isActive ? ks.green : ks.red, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> {isActive ? `Expira ${new Date(license.expires_at).toLocaleDateString('pt-BR')}` : 'Vencida'}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Shield size={28} color={ks.mutedLight} style={{ marginBottom: 10, opacity: 0.4 }} />
                  <p style={{ color: ks.muted, fontSize: 13, marginBottom: 12 }}>Nenhuma licença ativa</p>
                  <Link to="/killspy#planos" style={{ display: 'inline-block', padding: '8px 20px', background: ks.teal, color: ks.bg, borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>Ver planos</Link>
                </div>
              )}
            </Card>

            {/* Other Stauf services */}
            <Card span>
              <CardHeader icon={Zap} title="Serviços Stauf" color={ks.purple} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="ks-dash-grid">
                <ServiceLink icon={Globe} title="Sites & Landing Pages" desc="Design premium otimizado pro Google" color={ks.teal} href="/servicos/sites" />
                <ServiceLink icon={Bot} title="Chatbots com IA" desc="Atendimento 24/7 no WhatsApp e site" color={ks.green} href="/servicos/chatbots" />
                <ServiceLink icon={Zap} title="Automação de Processos" desc="Elimine tarefas repetitivas" color={ks.amber} href="/servicos/automacao" />
                <ServiceLink icon={BarChart3} title="Dashboards & BI" desc="Painéis interativos, KPIs em tempo real" color={ks.purple} href="/servicos/dashboards" />
              </div>
            </Card>
          </div>
        )}

        {/* ═══ KILLSPY TAB ═══ */}
        {activeTab === 'killspy' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="ks-dash-grid">

            {/* License */}
            <Card span>
              <CardHeader icon={Key} title="Chave de Licença" action={license && <CopyBtn text={license.key} />} />
              {license ? (
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, padding: '16px 20px', background: ks.bg, borderRadius: 12, border: `1px solid ${ks.border}`, fontFamily: ks.mono, fontSize: 'clamp(14px, 2vw, 18px)', color: ks.teal, letterSpacing: '0.05em', wordBreak: 'break-all', boxShadow: `inset 0 0 30px ${ks.tealDim}` }}>
                    {license.key}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 140 }}>
                    <span style={{ padding: '4px 12px', background: ks.tealDim, borderRadius: 6, fontSize: 11, fontWeight: 600, color: ks.teal, alignSelf: 'flex-start' }}>
                      {license.plan_type === 'S' ? 'Varredura' : license.plan_type === 'M' ? 'Mensal' : 'Anual'}
                    </span>
                    <span style={{ fontSize: 12, color: isActive ? ks.green : ks.red, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Clock size={12} /> {isActive ? `Expira ${new Date(license.expires_at).toLocaleDateString('pt-BR')}` : 'Vencida'}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '32px 0', textAlign: 'center' }}>
                  <Key size={32} color={ks.mutedLight} style={{ marginBottom: 12, opacity: 0.4 }} />
                  <p style={{ color: ks.muted, fontSize: 14, marginBottom: 14 }}>Nenhuma licença ativa</p>
                  <Link to="/killspy#planos" style={{ display: 'inline-block', padding: '10px 24px', background: ks.teal, color: ks.bg, borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Escolher plano</Link>
                </div>
              )}
            </Card>

            {/* App download */}
            <Card>
              <CardHeader icon={Download} title="App KillSpy" />
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: ks.tealDim, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Shield size={24} color={ks.teal} />
                </div>
                <p style={{ fontSize: 13, color: ks.muted, marginBottom: 12 }}>Em fase final de testes</p>
                <div style={{ padding: '10px 16px', background: ks.amberDim, border: `1px solid ${ks.amber}20`, borderRadius: 8, fontSize: 12, color: ks.amber, fontWeight: 500 }}>
                  Disponível em breve — Android 11+
                </div>
              </div>
              {license && (
                <div style={{ marginTop: 12, padding: 12, background: ks.bg, borderRadius: 8, border: `1px solid ${ks.border}` }}>
                  <div style={{ fontSize: 10, color: ks.mutedLight, marginBottom: 6, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Quando disponível:</div>
                  <div style={{ fontFamily: ks.mono, fontSize: 11, color: ks.muted, lineHeight: 1.8 }}>
                    1. Baixe o APK<br />2. Abra → Licença<br />3. Cole sua chave<br />4. Protegido!
                  </div>
                </div>
              )}
            </Card>

            {/* Quick referral stats */}
            <Card>
              <CardHeader icon={Users} title="Indicação rápida" action={
                <button onClick={() => setActiveTab('referrals')} style={{ background: 'none', border: 'none', color: ks.teal, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Ver tudo →</button>
              } />
              <div style={{ padding: '10px 12px', background: ks.bg, borderRadius: 8, border: `1px solid ${ks.border}`, fontFamily: ks.mono, fontSize: 10, color: ks.teal, marginBottom: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {refLink}
              </div>
              <CopyBtn text={refLink} label="Copiar link" />
              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                <div style={{ flex: 1, padding: 12, background: ks.bg, borderRadius: 8, textAlign: 'center', border: `1px solid ${ks.border}` }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: ks.teal }}>{referrals?.referrals?.length || 0}</div>
                  <div style={{ fontSize: 10, color: ks.mutedLight, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Indicações</div>
                </div>
                <div style={{ flex: 1, padding: 12, background: ks.bg, borderRadius: 8, textAlign: 'center', border: `1px solid ${ks.border}` }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: ks.green }}>R${(balance?.balance || 0).toFixed(0)}</div>
                  <div style={{ fontSize: 10, color: ks.mutedLight, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Saldo</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ═══ REFERRALS TAB ═══ */}
        {activeTab === 'referrals' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="ks-dash-grid">

            {/* Referral link */}
            <Card>
              <CardHeader icon={Users} title="Seu link de indicação" />
              <p style={{ fontSize: 12, color: ks.muted, marginBottom: 14, lineHeight: 1.7 }}>
                Compartilhe seu link. Quem assinar ganha 20% de desconto e você recebe 30% de comissão.
              </p>
              <div style={{ padding: '12px 14px', background: ks.bg, borderRadius: 10, border: `1px solid ${ks.border}`, fontFamily: ks.mono, fontSize: 11, color: ks.teal, marginBottom: 12, wordBreak: 'break-all' }}>
                {refLink}
              </div>
              <CopyBtn text={refLink} label="Copiar link de indicação" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 16 }}>
                <div style={{ padding: 10, background: ks.bg, borderRadius: 8, textAlign: 'center', border: `1px solid ${ks.border}` }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: ks.teal }}>{referrals?.referrals?.length || 0}</div>
                  <div style={{ fontSize: 9, color: ks.mutedLight, textTransform: 'uppercase' }}>Indicações</div>
                </div>
                <div style={{ padding: 10, background: ks.bg, borderRadius: 8, textAlign: 'center', border: `1px solid ${ks.border}` }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: ks.green }}>R${(referrals?.total_earned || 0).toFixed(0)}</div>
                  <div style={{ fontSize: 9, color: ks.mutedLight, textTransform: 'uppercase' }}>Ganho total</div>
                </div>
                <div style={{ padding: 10, background: ks.bg, borderRadius: 8, textAlign: 'center', border: `1px solid ${ks.border}` }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: ks.amber }}>R${(balance?.balance || 0).toFixed(0)}</div>
                  <div style={{ fontSize: 9, color: ks.mutedLight, textTransform: 'uppercase' }}>Disponível</div>
                </div>
              </div>
            </Card>

            {/* Withdraw */}
            <Card>
              <CardHeader icon={DollarSign} title="Sacar saldo" color={ks.green} />
              <div style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, color: ks.green, lineHeight: 1, marginBottom: 4 }}>
                R${(balance?.balance || 0).toFixed(2)}
              </div>
              <div style={{ fontSize: 11, color: ks.mutedLight, marginBottom: 20 }}>Mínimo R$20 para saque</div>
              <input type="text" value={pixKey} onChange={e => setPixKey(e.target.value)} placeholder="Chave PIX (CPF, email, telefone)"
                style={{ width: '100%', padding: '10px 12px', background: ks.bg, border: `1px solid ${ks.border}`, borderRadius: 8, color: ks.text, fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 8, transition: 'border-color 0.2s' }}
                onFocus={e => e.currentTarget.style.borderColor = ks.green}
                onBlur={e => e.currentTarget.style.borderColor = ks.border} />
              <button onClick={handleWithdraw} disabled={(balance?.balance || 0) < 20}
                style={{ width: '100%', padding: 11, background: (balance?.balance || 0) >= 20 ? ks.green : `${ks.green}25`, color: (balance?.balance || 0) >= 20 ? '#000' : ks.mutedLight, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: (balance?.balance || 0) >= 20 ? 'pointer' : 'not-allowed' }}>
                Solicitar saque via PIX
              </button>
              {withdrawMsg && <p style={{ fontSize: 11, color: withdrawMsg.includes('solicitado') ? ks.green : ks.red, marginTop: 6 }}>{withdrawMsg}</p>}
            </Card>

            {/* Referral history */}
            {referrals?.referrals?.length > 0 && (
              <Card span>
                <CardHeader icon={Users} title="Histórico" />
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr>
                        {['Pessoa', 'Plano', 'Comissão', 'Status'].map(h => (
                          <th key={h} style={{ textAlign: h === 'Comissão' || h === 'Status' ? 'right' : 'left', padding: '10px 14px', color: ks.mutedLight, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, borderBottom: `1px solid ${ks.border}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.referrals.map((r: any, i: number) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${ks.border}` }}>
                          <td style={{ padding: '12px 14px' }}>{r.referred_name || '—'}</td>
                          <td style={{ padding: '12px 14px', color: ks.muted }}>{r.plan_type === 'S' ? 'Varredura' : r.plan_type === 'M' ? 'Mensal' : 'Anual'}</td>
                          <td style={{ padding: '12px 14px', color: ks.green, textAlign: 'right', fontWeight: 700, fontFamily: ks.mono }}>R${parseFloat(r.commission_amount).toFixed(2)}</td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: r.commission_paid ? ks.greenDim : ks.amberDim, color: r.commission_paid ? ks.green : ks.amber }}>
                              {r.commission_paid ? 'Pago' : 'Pendente'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Payment success banner */}
        {paymentSuccess && (
          <div style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', padding: '14px 28px', background: ks.greenDim, border: `1px solid rgba(34,197,94,0.2)`, borderRadius: 12, zIndex: 100, display: 'flex', alignItems: 'center', gap: 10, boxShadow: `0 8px 32px rgba(0,0,0,0.3)` }}>
            <Check size={18} color={ks.green} />
            <span style={{ fontSize: 14, fontWeight: 600, color: ks.green }}>Pagamento confirmado! Sua chave será gerada em instantes.</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:768px){ .ks-dash-grid{grid-template-columns:1fr!important} }
      `}</style>
    </div>
  );
}
