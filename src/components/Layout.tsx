import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';

export function Layout({ children }: { children: React.ReactNode }) {
  const { lang, t, toggle } = useLanguage();
  const { theme, colors, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      setVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.text, fontFamily: "'Inter', system-ui, sans-serif", width: '100%', transition: 'background-color 0.4s ease, color 0.4s ease' }}>
      <Navbar t={t} lang={lang} toggle={toggle} colors={colors} theme={theme} toggleTheme={toggleTheme} />
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(15px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
      }}>
        {typeof children === 'function' ? (children as any)({ lang, t, colors, theme }) : children}
      </div>
      <Footer t={t} lang={lang} colors={colors} />
    </div>
  );
}

/* Shared components */
export function W({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={className} style={{ maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto', paddingLeft: 24, paddingRight: 24, width: '100%', ...style }}>{children}</div>;
}

export function SectionBlock({ children, className = '', id, alt, style, colors }: { children: React.ReactNode; className?: string; id?: string; alt?: boolean; style?: React.CSSProperties; colors: any }) {
  return (
    <section id={id} className={className} style={{ width: '100%', ...(alt ? { background: colors.bgAlt } : {}), ...style }}>
      {children}
    </section>
  );
}
