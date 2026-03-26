import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';
import { supabase } from './killspy-api';

const ks = {
  bg: '#0a0a0f', bgCard: '#0f1018', teal: '#2dd4bf', tealDim: 'rgba(45,212,191,0.12)',
  tealGlow: 'rgba(45,212,191,0.25)', red: '#ef4444', green: '#22c55e', text: '#e8e8e8',
  muted: '#888', border: 'rgba(45,212,191,0.1)', sans: "'Inter', system-ui, sans-serif",
};

export default function KillSpyResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Supabase sets session from URL hash automatically
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User came from reset email — ready to set new password
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) { setError('Senha deve ter pelo menos 8 caracteres'); return; }
    if (password !== confirm) { setError('As senhas não coincidem'); return; }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => navigate('/conta/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={{ background: ks.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ks.sans, padding: 24 }}>
      <div style={{ maxWidth: 420, textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: `2px solid ${ks.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Lock size={28} color={ks.green} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: ks.text, marginBottom: 10 }}>Senha redefinida!</h2>
        <p style={{ fontSize: 14, color: ks.muted, marginBottom: 24 }}>Redirecionando para o login...</p>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <img src="/stauf-icon.png" alt="Stauf" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          <div>
            <span style={{ fontSize: 18, fontWeight: 700, color: ks.text, letterSpacing: '0.08em' }}>TAUF<span style={{ color: ks.teal }}>.</span></span>
            <div style={{ fontSize: 11, color: ks.muted }}>Nova senha</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{
          padding: 32, background: ks.bgCard, border: `1px solid ${ks.border}`, borderRadius: 16,
          boxShadow: `0 16px 48px rgba(0,0,0,0.3), 0 0 40px ${ks.tealGlow}`,
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: ks.text, marginBottom: 8 }}>Redefinir senha</h1>
          <p style={{ fontSize: 13, color: ks.muted, marginBottom: 28 }}>Digite sua nova senha</p>

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, marginBottom: 16, fontSize: 13, color: ks.red }}>{error}</div>
          )}

          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: ks.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Nova senha</label>
          <div style={{ position: 'relative', marginBottom: 18 }}>
            <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
              style={{ width: '100%', padding: '12px 42px 12px 14px', background: ks.bg, border: `1px solid ${ks.border}`, borderRadius: 10, color: ks.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.currentTarget.style.borderColor = ks.teal}
              onBlur={e => e.currentTarget.style.borderColor = ks.border} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: ks.muted, cursor: 'pointer', padding: 4 }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: ks.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Confirmar senha</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="••••••••"
            style={{ width: '100%', padding: '12px 14px', background: ks.bg, border: `1px solid ${ks.border}`, borderRadius: 10, color: ks.text, fontSize: 14, outline: 'none', marginBottom: 24, boxSizing: 'border-box' }}
            onFocus={e => e.currentTarget.style.borderColor = ks.teal}
            onBlur={e => e.currentTarget.style.borderColor = ks.border} />

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: 14, background: loading ? `${ks.teal}60` : ks.teal, color: ks.bg, border: 'none',
            borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
            boxShadow: `0 4px 20px ${ks.tealGlow}`,
          }}>
            {loading ? 'Salvando...' : 'Redefinir senha'}
          </button>
        </form>
      </div>
    </div>
  );
}
