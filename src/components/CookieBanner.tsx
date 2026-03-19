import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'stauf-cookies-accepted';

export function CookieBanner({ colors }: { colors: any }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(STORAGE_KEY);
    if (!accepted) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'essential');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      style={{
        position: 'fixed', bottom: 24, left: 24, right: 24, zIndex: 9999,
        maxWidth: 480, margin: '0 auto',
        padding: '20px 24px',
        background: colors.glass,
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${colors.glassBorder}`,
        borderRadius: 16,
        boxShadow: `0 20px 60px ${colors.shadow}`,
        animation: 'fade-up 0.5s ease-out',
      }}
    >
      <button
        onClick={decline}
        aria-label="Fechar aviso de cookies"
        style={{
          position: 'absolute', top: 12, right: 12,
          background: 'none', border: 'none', color: colors.textDim,
          cursor: 'pointer', padding: 4,
        }}
      >
        <X size={16} />
      </button>

      <p style={{ fontSize: 13, color: colors.text, lineHeight: 1.6, marginBottom: 16, paddingRight: 20 }}>
        Utilizamos cookies essenciais para o funcionamento do site.
        Ao continuar navegando, você concorda com nossa{' '}
        <a href="/privacidade" style={{ color: colors.brand, textDecoration: 'underline' }}>
          Política de Privacidade
        </a>.
      </p>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={accept}
          style={{
            padding: '8px 20px', fontSize: 13, fontWeight: 600,
            background: colors.brand, color: '#fff', border: 'none',
            borderRadius: 8, cursor: 'pointer', transition: 'opacity 0.3s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Aceitar
        </button>
        <button
          onClick={decline}
          style={{
            padding: '8px 20px', fontSize: 13, fontWeight: 500,
            background: 'transparent', color: colors.textMuted,
            border: `1px solid ${colors.border}`, borderRadius: 8,
            cursor: 'pointer', transition: 'all 0.3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = colors.brand; e.currentTarget.style.color = colors.text; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.textMuted; }}
        >
          Apenas essenciais
        </button>
      </div>
    </div>
  );
}
