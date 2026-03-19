import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Languages, Sun, Moon, ArrowLeft } from 'lucide-react';
import { StaufLogo } from './StaufLogo';

export function Navbar({ t, lang, toggle, colors, theme, toggleTheme }: any) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = isHome ? [
    { href: '#servicos', label: t('nav.services'), isAnchor: true },
    { href: '/servicos/sites', label: 'Sites', isAnchor: false },
    { href: '#sobre', label: t('nav.about'), isAnchor: true },
    { href: '#contato', label: t('nav.contact'), isAnchor: true },
  ] : [
    { href: '/', label: lang === 'pt' ? 'Início' : 'Home', isAnchor: false },
    { href: '/#servicos', label: t('nav.services'), isAnchor: false },
    { href: '/servicos/sites', label: 'Sites', isAnchor: false },
    { href: '/#sobre', label: t('nav.about'), isAnchor: false },
    { href: '/#contato', label: t('nav.contact'), isAnchor: false },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.5s ease',
        background: scrolled ? colors.glass : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${colors.glassBorder}` : '1px solid transparent',
        boxShadow: scrolled ? `0 4px 30px ${colors.shadow}` : 'none',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
              {!isHome && <ArrowLeft size={16} style={{ color: colors.textMuted, marginBottom: 3 }} />}
              <StaufLogo size={20} colors={colors} />
              <span className="hidden sm:inline" style={{ fontSize: 10, color: colors.textDim, fontWeight: 400, letterSpacing: '0.04em', marginBottom: 1, whiteSpace: 'nowrap' }}>
                We make stuff.
              </span>
            </Link>

            <div className="hidden md:flex" style={{ alignItems: 'center', gap: 28 }}>
              {links.map((l) =>
                l.isAnchor ? (
                  <a key={l.href} href={l.href} style={{ fontSize: 14, color: colors.textMuted, textDecoration: 'none', transition: 'color 0.3s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = colors.white)}
                    onMouseLeave={e => (e.currentTarget.style.color = colors.textMuted)}>
                    {l.label}
                  </a>
                ) : (
                  <Link key={l.href} to={l.href} style={{ fontSize: 14, color: colors.textMuted, textDecoration: 'none', transition: 'color 0.3s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = colors.white)}
                    onMouseLeave={e => (e.currentTarget.style.color = colors.textMuted)}>
                    {l.label}
                  </Link>
                )
              )}
              <button onClick={toggleTheme} aria-label="Alternar tema" style={{ background: 'none', border: 'none', color: colors.textDim, cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4, transition: 'color 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.color = colors.brand}
                onMouseLeave={e => e.currentTarget.style.color = colors.textDim}>
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button onClick={toggle} aria-label="Alternar idioma" style={{ background: 'none', border: 'none', color: colors.textDim, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500 }}>
                <Languages size={14} />
                {lang === 'pt' ? 'EN' : 'PT'}
              </button>
              <a href={isHome ? '#contato' : '/#contato'} className="btn-cta" style={{ padding: '9px 22px', fontSize: 14 }}>
                {t('hero.cta')}
              </a>
            </div>

            <div className="flex md:hidden" style={{ alignItems: 'center', gap: 10 }}>
              <button onClick={toggleTheme} aria-label="Alternar tema" style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer' }}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={toggle} aria-label="Alternar idioma" style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer' }}>
                <Languages size={18} />
              </button>
              <button onClick={() => setOpen(true)} aria-label="Abrir menu" style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer' }}>
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {open && (
        <div className="anim-fade-in" style={{ position: 'fixed', inset: 0, zIndex: 60, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', background: theme === 'dark' ? 'rgba(10,10,15,0.8)' : 'rgba(0,0,0,0.3)' }} onClick={() => setOpen(false)}>
          <div className="anim-slide-right" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 280, padding: 24, background: colors.glass, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderLeft: `1px solid ${colors.border}` }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} aria-label="Fechar menu" style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer' }}>
              <X size={22} />
            </button>
            <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {links.map((l) =>
                l.isAnchor ? (
                  <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ fontSize: 18, color: colors.text, textDecoration: 'none' }}>{l.label}</a>
                ) : (
                  <Link key={l.href} to={l.href} onClick={() => setOpen(false)} style={{ fontSize: 18, color: colors.text, textDecoration: 'none' }}>{l.label}</Link>
                )
              )}
              <a href={isHome ? '#contato' : '/#contato'} onClick={() => setOpen(false)} className="btn-cta" style={{ padding: '12px 20px', marginTop: 16, textAlign: 'center', fontSize: 14 }}>
                {t('hero.cta')}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
