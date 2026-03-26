import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Gift } from 'lucide-react';
import { register } from './killspy-api';

const ks = {
  bg: '#0a0a0f', bgCard: '#0f1018', teal: '#2dd4bf', tealDim: 'rgba(45,212,191,0.12)',
  tealGlow: 'rgba(45,212,191,0.25)', red: '#ef4444', green: '#22c55e', text: '#e8e8e8',
  muted: '#888', border: 'rgba(45,212,191,0.1)', sans: "'Inter', system-ui, sans-serif",
};

export default function KillSpyRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [refCode, setRefCode] = useState('');
  useEffect(() => {
    const urlRef = searchParams.get('ref');
    if (urlRef) { setRefCode(urlRef); localStorage.setItem('killspy_ref', urlRef); }
    else { const stored = localStorage.getItem('killspy_ref'); if (stored) setRefCode(stored); }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Senha deve ter pelo menos 8 caracteres'); return; }

    setLoading(true);
    try {
      const data = await register(name, email, password, phone || undefined, refCode || undefined);
      localStorage.removeItem('killspy_ref');

      // Supabase may require email confirmation
      if (data.user && !data.session) {
        setSuccess(true); // Show confirmation message
      } else {
        navigate('/conta/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', background: ks.bg, border: `1px solid ${ks.border}`,
    borderRadius: 10, color: ks.text, fontSize: 14, outline: 'none', marginBottom: 18,
    boxSizing: 'border-box' as const, transition: 'border-color 0.2s',
  };

  if (success) return (
    <div style={{ background: ks.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ks.sans, padding: 24 }}>
      <div style={{ maxWidth: 420, textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: ks.tealDim, border: `2px solid ${ks.teal}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28, color: ks.teal }}>✓</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: ks.text, marginBottom: 10 }}>Conta criada!</h2>
        <p style={{ fontSize: 14, color: ks.muted, marginBottom: 24 }}>Verifique seu email para confirmar o cadastro. Depois faça login.</p>
        <Link to="/conta/login" style={{ display: 'inline-block', padding: '12px 32px', background: ks.teal, color: ks.bg, borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Fazer login</Link>
      </div>
    </div>
  );

  return (
    <div style={{ background: ks.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ks.sans, padding: 24 }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0M-10 10L10 -10M30 50L50 30' stroke='%232dd4bf' stroke-width='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: '40px' }} />
      <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '30%', height: '30%', background: `radial-gradient(circle, ${ks.tealGlow} 0%, transparent 50%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 2 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: ks.muted, textDecoration: 'none', fontSize: 13, marginBottom: 32 }}>
          <ArrowLeft size={14} /> Voltar ao site
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <img src="/stauf-icon.png" alt="Stauf" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          <div>
            <span style={{ fontSize: 18, fontWeight: 700, color: ks.text, letterSpacing: '0.08em' }}>TAUF<span style={{ color: ks.teal }}>.</span></span>
            <div style={{ fontSize: 11, color: ks.muted }}>Crie sua conta gratuita</div>
          </div>
        </div>

        {refCode && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, marginBottom: 20 }}>
            <Gift size={16} color={ks.green} />
            <span style={{ fontSize: 13, color: ks.green, fontWeight: 600 }}>20% de desconto na primeira compra!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{
          padding: 32, background: ks.bgCard, border: `1px solid ${ks.border}`, borderRadius: 16,
          boxShadow: `0 16px 48px rgba(0,0,0,0.3), 0 0 40px ${ks.tealGlow}`,
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: ks.text, marginBottom: 8 }}>Criar conta</h1>
          <p style={{ fontSize: 13, color: ks.muted, marginBottom: 28 }}>Gratuito. Acesse o dashboard e gerencie seus produtos.</p>

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, marginBottom: 16, fontSize: 13, color: ks.red }}>{error}</div>
          )}

          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: ks.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Nome</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Seu nome" style={inputStyle}
            onFocus={e => e.currentTarget.style.borderColor = ks.teal} onBlur={e => e.currentTarget.style.borderColor = ks.border} />

          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: ks.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="seu@email.com" style={inputStyle}
            onFocus={e => e.currentTarget.style.borderColor = ks.teal} onBlur={e => e.currentTarget.style.borderColor = ks.border} />

          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: ks.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Senha <span style={{ fontWeight: 400, color: `${ks.muted}80` }}>(mín. 8 caracteres)</span></label>
          <div style={{ position: 'relative', marginBottom: 18 }}>
            <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
              style={{ ...inputStyle, marginBottom: 0, paddingRight: 42 }}
              onFocus={e => e.currentTarget.style.borderColor = ks.teal} onBlur={e => e.currentTarget.style.borderColor = ks.border} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: ks.muted, cursor: 'pointer', padding: 4 }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: ks.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>WhatsApp <span style={{ fontWeight: 400, color: `${ks.muted}80` }}>(opcional)</span></label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(41) 99999-9999" style={inputStyle}
            onFocus={e => e.currentTarget.style.borderColor = ks.teal} onBlur={e => e.currentTarget.style.borderColor = ks.border} />

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: 14, background: loading ? `${ks.teal}60` : ks.teal, color: ks.bg, border: 'none',
            borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
            boxShadow: `0 4px 20px ${ks.tealGlow}`, transition: 'all 0.2s',
          }}>
            {loading ? 'Criando conta...' : 'Criar conta grátis'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: ks.muted }}>
            Já tem conta? <Link to="/conta/login" style={{ color: ks.teal, textDecoration: 'none', fontWeight: 600 }}>Fazer login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
