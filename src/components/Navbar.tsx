import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Languages, Sun, Moon, ArrowLeft, User } from 'lucide-react';
import { StaufLogo } from './StaufLogo';
import { supabase } from '../pages/killspy/killspy-api';

export function Navbar({ t, lang, toggle, colors, theme, toggleTheme }: any) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setLoggedIn(!!session));
    return () => { listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = isHome ? [
    { href: '#servicos', label: t('nav.services'), isAnchor: true },
    { href: '/killspy', label: lang === 'pt' ? 'Segurança' : 'Security', isAnchor: false },
    { href: '#sobre', label: t('nav.about'), isAnchor: true },
    { href: '#contato', label: t('nav.contact'), isAnchor: true },
  ] : [
    { href: '/', label: lang === 'pt' ? 'Início' : 'Home', isAnchor: false },
    { href: '/#servicos', label: t('nav.services'), isAnchor: false },
    { href: '/killspy', label: lang === 'pt' ? 'Segurança' : 'Security', isAnchor: false },
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
              <Link to={loggedIn ? '/conta/dashboard' : '/conta/login'} style={{ fontSize: 14, color: loggedIn ? colors.brand : colors.textMuted, textDecoration: 'none', transition: 'color 0.3s', display: 'flex', alignItems: 'center', gap: 5 }}
                onMouseEnter={e => (e.currentTarget.style.color = colors.white)}
                onMouseLeave={e => (e.currentTarget.style.color = loggedIn ? colors.brand : colors.textMuted)}>
                {loggedIn ? <><User size={14} /> {lang === 'pt' ? 'Minha conta' : 'My account'}</> : (lang === 'pt' ? 'Entrar' : 'Login')}
              </Link>
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
          <div className="anim-slide-right" style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 300, padding: '0 28px',
            background: colors.bg, borderLeft: `1px solid ${colors.border}`,
            display: 'flex', flexDirection: 'column',
            boxShadow: '-8px 0 32px rgba(0,0,0,0.3)',
          }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: `1px solid ${colors.border}` }}>
              <StaufLogo size={18} colors={colors} />
              <button onClick={() => setOpen(false)} aria-label="Fechar menu" style={{ background: 'none', border: 'none', color: colors.textMuted, cursor: 'pointer', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 20, flex: 1 }}>
              {links.map((l) => {
                const LinkEl = l.isAnchor ? 'a' : Link;
                const props = l.isAnchor ? { href: l.href } : { to: l.href };
                return (
                  <LinkEl key={l.href} {...props as any} onClick={() => setOpen(false)} style={{
                    fontSize: 15, color: colors.text, textDecoration: 'none', fontWeight: 500,
                    padding: '14px 16px', borderRadius: 10, transition: 'background 0.2s',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}
                    onMouseEnter={(e: any) => e.currentTarget.style.background = `${colors.brand}10`}
                    onMouseLeave={(e: any) => e.currentTarget.style.background = 'transparent'}>
                    {l.label}
                  </LinkEl>
                );
              })}

              {/* Divider */}
              <div style={{ height: 1, background: colors.border, margin: '8px 0' }} />

              {/* Account */}
              <Link to={loggedIn ? '/conta/dashboard' : '/conta/login'} onClick={() => setOpen(false)} style={{
                fontSize: 15, color: colors.brand, textDecoration: 'none', fontWeight: 600,
                padding: '14px 16px', borderRadius: 10, transition: 'background 0.2s',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
                onMouseEnter={(e: any) => e.currentTarget.style.background = `${colors.brand}10`}
                onMouseLeave={(e: any) => e.currentTarget.style.background = 'transparent'}>
                <User size={16} />
                {loggedIn ? (lang === 'pt' ? 'Minha conta' : 'My account') : (lang === 'pt' ? 'Entrar' : 'Login')}
              </Link>
            </div>

            {/* Bottom CTA */}
            <div style={{ padding: '20px 0', borderTop: `1px solid ${colors.border}` }}>
              <a href={isHome ? '#contato' : '/#contato'} onClick={() => setOpen(false)} className="btn-cta" style={{ padding: '14px 20px', textAlign: 'center', fontSize: 14, display: 'block', borderRadius: 10 }}>
                {t('hero.cta')}
              </a>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14 }}>
                <button onClick={() => { toggleTheme(); }} style={{ background: 'none', border: 'none', color: colors.textDim, cursor: 'pointer', padding: 4 }}>
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                <button onClick={() => { toggle(); }} style={{ background: 'none', border: 'none', color: colors.textDim, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                  <Languages size={14} /> {lang === 'pt' ? 'EN' : 'PT'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
