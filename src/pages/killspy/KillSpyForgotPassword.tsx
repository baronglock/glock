import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { supabase } from './killspy-api';

const ks = {
  bg: '#0a0a0f', bgCard: '#0f1018', teal: '#2dd4bf', tealDim: 'rgba(45,212,191,0.12)',
  tealGlow: 'rgba(45,212,191,0.25)', red: '#ef4444', text: '#e8e8e8', muted: '#888',
  border: 'rgba(45,212,191,0.1)', sans: "'Inter', system-ui, sans-serif",
};

export default function KillSpyForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/conta/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) return (
    <div style={{ background: ks.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ks.sans, padding: 24 }}>
      <div style={{ maxWidth: 420, textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: ks.tealDim, border: `2px solid ${ks.teal}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Mail size={28} color={ks.teal} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: ks.text, marginBottom: 10 }}>Email enviado!</h2>
        <p style={{ fontSize: 14, color: ks.muted, marginBottom: 24, lineHeight: 1.7 }}>
          Enviamos um link de recuperação para <strong style={{ color: ks.text }}>{email}</strong>. Verifique sua caixa de entrada e spam.
        </p>
        <Link to="/conta/login" style={{ display: 'inline-block', padding: '12px 32px', background: ks.teal, color: ks.bg, borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Voltar ao login</Link>
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
        <Link to="/conta/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: ks.muted, textDecoration: 'none', fontSize: 13, marginBottom: 32 }}>
          <ArrowLeft size={14} /> Voltar ao login
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <img src="/stauf-icon.png" alt="Stauf" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          <div>
            <span style={{ fontSize: 18, fontWeight: 700, color: ks.text, letterSpacing: '0.08em' }}>TAUF<span style={{ color: ks.teal }}>.</span></span>
            <div style={{ fontSize: 11, color: ks.muted }}>Recuperar senha</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{
          padding: 32, background: ks.bgCard, border: `1px solid ${ks.border}`, borderRadius: 16,
          boxShadow: `0 16px 48px rgba(0,0,0,0.3), 0 0 40px ${ks.tealGlow}`,
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: ks.text, marginBottom: 8 }}>Esqueceu a senha?</h1>
          <p style={{ fontSize: 13, color: ks.muted, marginBottom: 28 }}>Digite seu email e enviaremos um link para redefinir.</p>

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, marginBottom: 16, fontSize: 13, color: ks.red }}>{error}</div>
          )}

          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: ks.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="seu@email.com"
            style={{ width: '100%', padding: '12px 14px', background: ks.bg, border: `1px solid ${ks.border}`, borderRadius: 10, color: ks.text, fontSize: 14, outline: 'none', marginBottom: 24, boxSizing: 'border-box' }}
            onFocus={e => e.currentTarget.style.borderColor = ks.teal}
            onBlur={e => e.currentTarget.style.borderColor = ks.border} />

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: 14, background: loading ? `${ks.teal}60` : ks.teal, color: ks.bg, border: 'none',
            borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
            boxShadow: `0 4px 20px ${ks.tealGlow}`,
          }}>
            {loading ? 'Enviando...' : 'Enviar link de recuperação'}
          </button>
        </form>
      </div>
    </div>
  );
}
