import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { login } from './killspy-api';

const ks = {
  bg: '#0a0a0f', bgCard: '#0f1018', teal: '#2dd4bf', tealDim: 'rgba(45,212,191,0.12)',
  tealGlow: 'rgba(45,212,191,0.25)', red: '#ef4444', text: '#e8e8e8', muted: '#888',
  border: 'rgba(45,212,191,0.1)', sans: "'Inter', system-ui, sans-serif",
};

export default function KillSpyLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/conta/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

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
            <div style={{ fontSize: 11, color: ks.muted }}>Acesse sua conta</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{
          padding: 32, background: ks.bgCard, border: `1px solid ${ks.border}`, borderRadius: 16,
          boxShadow: `0 16px 48px rgba(0,0,0,0.3), 0 0 40px ${ks.tealGlow}`,
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: ks.text, marginBottom: 8 }}>Login</h1>
          <p style={{ fontSize: 13, color: ks.muted, marginBottom: 28 }}>Entre com seu email e senha</p>

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, marginBottom: 16, fontSize: 13, color: ks.red }}>
              {error}
            </div>
          )}

          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: ks.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="seu@email.com"
            style={{ width: '100%', padding: '12px 14px', background: ks.bg, border: `1px solid ${ks.border}`, borderRadius: 10, color: ks.text, fontSize: 14, outline: 'none', marginBottom: 18, boxSizing: 'border-box', transition: 'border-color 0.2s' }}
            onFocus={e => e.currentTarget.style.borderColor = ks.teal}
            onBlur={e => e.currentTarget.style.borderColor = ks.border} />

          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: ks.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Senha</label>
          <div style={{ position: 'relative', marginBottom: 24 }}>
            <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
              style={{ width: '100%', padding: '12px 42px 12px 14px', background: ks.bg, border: `1px solid ${ks.border}`, borderRadius: 10, color: ks.text, fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={e => e.currentTarget.style.borderColor = ks.teal}
              onBlur={e => e.currentTarget.style.borderColor = ks.border} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: ks.muted, cursor: 'pointer', padding: 4 }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div style={{ textAlign: 'right', marginBottom: 16 }}>
            <Link to="/conta/forgot-password" style={{ fontSize: 12, color: ks.muted, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e: any) => e.currentTarget.style.color = ks.teal}
              onMouseLeave={(e: any) => e.currentTarget.style.color = ks.muted}>
              Esqueceu a senha?
            </Link>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: 14, background: loading ? `${ks.teal}60` : ks.teal, color: ks.bg, border: 'none',
            borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
            boxShadow: `0 4px 20px ${ks.tealGlow}`, transition: 'all 0.2s',
          }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: ks.muted }}>
            Não tem conta? <Link to="/conta/register" style={{ color: ks.teal, textDecoration: 'none', fontWeight: 600 }}>Criar conta grátis</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
