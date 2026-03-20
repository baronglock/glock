import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Database, Bot, Globe, BrainCircuit, ChevronRight, ArrowRight,
  ExternalLink, Mail, Phone, MapPin, Instagram,
  Linkedin, Github, Shield, Clock, TrendingUp,
  BarChart3, Code2, MessageSquare, Search, FileSpreadsheet,
  Workflow, LayoutDashboard, Zap
} from 'lucide-react';
import { useReveal } from './hooks/useReveal';
import { CookieBanner } from './components/CookieBanner';
import { useLanguage } from './hooks/useLanguage';
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

/* ═══════════════════════════════════════════════════════════════
   COSMIC BACKGROUND — Fixed starfield with real stellar coordinates
   ───────────────────────────────────────────────────────────────
   Prosperity stars (traditional astrology) mapped from RA/Dec:
   Regulus (α Leo)    = authority    │ RA 10.14h  Dec +12°
   Spica (α Virgo)    = wealth      │ RA 13.42h  Dec -11°
   Aldebaran (α Tau)  = persistence │ RA  4.60h  Dec +16°
   Vega (α Lyra)      = charisma    │ RA 18.62h  Dec +39°
   Sirius (α CMa)     = prominence  │ RA  6.75h  Dec -17°
   Capella (α Aur)    = honors      │ RA  5.28h  Dec +46°
   Procyon (α CMi)    = opportunity │ RA  7.65h  Dec +5°
   Antares (α Sco)    = power       │ RA 16.49h  Dec -26°
   Mapped: x = RA/24*100,  y = (50-Dec)/80*100
   ═══════════════════════════════════════════════════════════════ */
function CosmicBackground({ theme }: any) {
  const dk = theme === 'dark';

  /* Real stellar coordinates → pushed down to avoid header */
  const stars = {
    regulus:   { x: 45, y: 45, name: 'Regulus' },
    spica:     { x: 70, y: 80, name: 'Spica' },
    aldebaran: { x: 8, y: 40, name: 'Aldebaran' },
    vega:      { x: 90, y: 15, name: 'Vega' },
    sirius:    { x: 15, y: 85, name: 'Sirius' },
    capella:   { x: 10, y: 10, name: 'Capella' },
    procyon:   { x: 25, y: 62, name: 'Procyon' },
    antares:   { x: 85, y: 92, name: 'Antares' },
  };

  /* Small background stars — scattered */
  const dimStars = [
    [8,12],[15,28],[3,45],[12,67],[6,82],[18,95],[25,8],[30,35],
    [27,62],[35,18],[38,48],[33,78],[40,92],[45,5],[48,32],[44,58],
    [50,72],[52,88],[55,15],[58,42],[62,28],[65,55],[60,80],[68,10],
    [72,38],[75,62],[70,85],[78,25],[82,50],[85,72],[80,95],[88,8],
    [90,35],[92,58],[95,18],[97,42],[93,75],[86,90],[10,52],[37,3],
    [63,95],[47,22],[73,48],[84,15],[16,38],[53,62],[42,85],[77,92],
    [21,75],[66,3],[89,65],[4,22],[96,82],[34,92],[57,8],[81,32],
  ];

  const nodeColor = dk ? 'rgba(45,212,191,0.8)' : 'rgba(13,148,136,0.4)';
  const nodeGold = dk ? 'rgba(94,234,212,0.7)' : 'rgba(45,212,191,0.35)';
  const lineColor = dk ? 'rgba(45,212,191,0.3)' : 'rgba(13,148,136,0.18)';
  const lineFaint = dk ? 'rgba(45,212,191,0.18)' : 'rgba(13,148,136,0.1)';
  const lineGold = dk ? 'rgba(94,234,212,0.25)' : 'rgba(45,212,191,0.15)';
  const dimColor = dk ? 'rgba(255,255,255,' : 'rgba(13,148,136,';
  const coreColor = dk ? 'rgba(255,255,255,0.95)' : 'rgba(13,148,136,0.5)';

  const s = stars;

  return (
    <>
    {/* Fixed background — galaxy (dark) / sun rays (light) */}
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      {dk ? (
        <img
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=60&auto=format&fit=crop&fm=webp"
          alt="" loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.1 }}
        />
      ) : (
        <img
          src="/bg-light.jpg"
          alt="" loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.14 }}
        />
      )}
    </div>

    {/* Constellation — fixed in background */}
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>

      {/* SVG constellation — refined, minimal */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.15" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Dim background stars */}
        {dimStars.map(([x, y], i) => {
          const o = (dk ? 0.05 + Math.sin(i * 1.7) * 0.04 : 0.1 + Math.sin(i * 1.7) * 0.06).toFixed(3);
          return <circle key={i} cx={x} cy={y} r="0.15" fill={`${dimColor}${o})`} />;
        })}

        {/* Constellation lines with glow */}
        {[
          [s.spica, s.sirius, lineGold, 0.14], [s.sirius, s.aldebaran, lineGold, 0.14], [s.aldebaran, s.spica, lineGold, 0.12],
          [s.capella, s.aldebaran, lineColor, 0.12], [s.aldebaran, s.regulus, lineColor, 0.14], [s.regulus, s.vega, lineColor, 0.14],
          [s.procyon, s.regulus, lineFaint, 0.1], [s.regulus, s.spica, lineFaint, 0.1],
          [s.spica, s.antares, lineFaint, 0.1], [s.vega, s.antares, lineFaint, 0.08],
          [s.procyon, s.sirius, lineFaint, 0.08], [s.capella, s.vega, lineFaint, 0.06],
        ].map(([a, b, color, width], i) => (
          <line key={`cl${i}`} x1={(a as any).x} y1={(a as any).y} x2={(b as any).x} y2={(b as any).y}
            stroke={color as string} strokeWidth={width as number} opacity={0.85} filter="url(#lineGlow)" />
        ))}

        {/* Star nodes — layered glow effect */}
        {Object.values(s).map((star) => {
          const isGold = star.name === 'Spica' || star.name === 'Sirius' || star.name === 'Aldebaran';
          const color = isGold ? nodeGold : nodeColor;
          return (
            <g key={star.name} filter="url(#starGlow)">
              {/* Outer glow */}
              <circle cx={star.x} cy={star.y} r="1.2" fill={color} opacity={0.15} />
              {/* Mid ring */}
              <circle cx={star.x} cy={star.y} r="0.6" fill={color} opacity={0.5} />
              {/* Core */}
              <circle cx={star.x} cy={star.y} r="0.2" fill={coreColor} />
            </g>
          );
        })}
      </svg>
    </div>
    </>
  );
}

/* ── Wrapper ── */
function W({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={className} style={{ maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto', paddingLeft: 24, paddingRight: 24, width: '100%', ...style }}>{children}</div>;
}

/* ── Section ── */
function Section({ children, className = '', id, alt, style, colors }: { children: React.ReactNode; className?: string; id?: string; alt?: boolean; style?: React.CSSProperties; colors: any }) {
  const ref = useReveal();
  return (
    <section ref={ref} id={id} className={className} style={{ width: '100%', position: 'relative', ...(alt ? { background: colors.bgAlt } : {}), ...style }}>
      {alt && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, background: `linear-gradient(to bottom, ${colors.bg}, transparent)`, pointerEvents: 'none', zIndex: 1 }} />}
      {alt && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: `linear-gradient(to top, ${colors.bg}, transparent)`, pointerEvents: 'none', zIndex: 1 }} />}
      {children}
    </section>
  );
}

/* ── Image URLs ── */
const IMG = {
  heroAi: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=900&q=85&auto=format&fit=crop&fm=webp',
  heroTeam: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop&fm=webp',
  about: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=700&q=80&auto=format&fit=crop&fm=webp',
  caseData: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&auto=format&fit=crop&fm=webp',
  caseAuto: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80&auto=format&fit=crop&fm=webp',
  caseWeb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&auto=format&fit=crop&fm=webp',
  ctaBg: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1400&q=80&auto=format&fit=crop&fm=webp',
  divider: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=90&auto=format&fit=crop&fm=webp',
  svcData: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop&fm=webp',
  svcAuto: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&q=80&auto=format&fit=crop&fm=webp',
  svcChat: 'https://images.unsplash.com/photo-1531746790095-e5a2ebf3fa62?w=900&q=80&auto=format&fit=crop&fm=webp',
  svcSites: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80&auto=format&fit=crop&fm=webp',
  svcDash: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&q=80&auto=format&fit=crop&fm=webp',
  svcConsult: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&q=80&auto=format&fit=crop&fm=webp',
};

/* ═══════════════ HERO ═══════════════ */
function Hero({ t, lang, colors }: any) {
  return (
    <section style={{
      position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', width: '100%',
    }}>
      {/* Animated gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4,
        background: 'radial-gradient(ellipse at 20% 50%, rgba(13,148,136,0.15), transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(45,212,191,0.1), transparent 50%), radial-gradient(ellipse at 60% 80%, rgba(13,148,136,0.08), transparent 50%)',
        backgroundSize: '200% 200%',
        animation: 'bg-gradient-shift 20s ease infinite',
      }} />
      {/* Geometric grid — subtle lines on sides, clean center */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="gl" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={colors.brand} stopOpacity="0.1" />
            <stop offset="35%" stopColor={colors.brand} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gr" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor={colors.brand} stopOpacity="0.1" />
            <stop offset="35%" stopColor={colors.brand} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[15,25,35,45,55,65,75,85].map(y => <line key={`hl${y}`} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="url(#gl)" strokeWidth="0.5" />)}
        {[20,30,40,50,60,70,80].map(y => <line key={`hr${y}`} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="url(#gr)" strokeWidth="0.5" />)}
        {[4,9,15,22].map(x => <line key={`vl${x}`} x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%" stroke="url(#gl)" strokeWidth="0.5" />)}
        {[78,85,91,96].map(x => <line key={`vr${x}`} x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%" stroke="url(#gr)" strokeWidth="0.5" />)}
        {[[9,25],[15,55],[22,75],[4,45],[78,35],[85,65],[91,25],[96,85]].map(([x,y], i) => <circle key={`nd${i}`} cx={`${x}%`} cy={`${y}%`} r="1.5" fill={colors.brand} opacity={0.12} />)}
      </svg>

      <div className="hidden sm:block" style={{ position: 'absolute', top: '15%', left: '15%', width: 500, height: 500, background: `radial-gradient(circle, ${colors.orbBrand} 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none', filter: 'blur(80px)' }} />
      <div className="hidden sm:block" style={{ position: 'absolute', bottom: '20%', right: '10%', width: 400, height: 400, background: `radial-gradient(circle, ${colors.orbGold} 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none', filter: 'blur(80px)' }} />

      <W style={{ paddingTop: 120, paddingBottom: 80, position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
          <h1 className="anim-fade-up" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 600, lineHeight: 0.95, letterSpacing: '-0.04em', marginBottom: 28 }}>
            <span style={{ color: colors.white }}>{t('hero.title1')}</span>
            <br />
            <span className="text-gradient">{t('hero.title2')}</span>
          </h1>

          <p className="anim-fade-up" style={{ maxWidth: 560, margin: '0 auto', color: colors.textMuted, fontSize: 'clamp(1rem, 2vw, 1.15rem)', lineHeight: 1.75, animationDelay: '0.2s', marginBottom: 40 }}>
            {t('hero.sub')}
          </p>

          <div className="anim-fade-up" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16, animationDelay: '0.35s', marginBottom: 48 }}>
            <a href="#contato" className="btn-cta" style={{ padding: '14px 36px', fontSize: 'clamp(0.875rem, 1.6vw, 1rem)' }}>
              {t('hero.cta')} <ArrowRight size={16} />
            </a>
            <a href="#servicos" style={{
              padding: '14px 36px', borderRadius: 9999, border: `1px solid ${colors.border}`, color: colors.text,
              fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none',
              transition: 'all 0.3s ease', fontSize: 16,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = colors.brand; e.currentTarget.style.color = colors.white; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.text; }}
            >
              {t('hero.cta2')} <ChevronRight size={16} />
            </a>
          </div>

          {/* Social proof */}
          <div className="anim-fade-up" style={{ animationDelay: '0.5s', marginTop: 8 }}>
            <p style={{ fontSize: 13, color: colors.textDim, marginBottom: 20, letterSpacing: '0.02em' }}>
              {lang === 'pt'
                ? 'Ajudamos negócios locais a entrar no mundo da IA, automatizar operações e ampliar resultados.'
                : 'We help local businesses enter the AI world, automate operations and amplify results.'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32 }}>
              {[
                { value: '900k+', label: lang === 'pt' ? 'Registros processados' : 'Records processed' },
                { value: '8', label: lang === 'pt' ? 'Segmentos atendidos' : 'Segments served' },
                { value: '24/7', label: lang === 'pt' ? 'Automações ativas' : 'Active automations' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)', fontWeight: 600, color: colors.brand }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: colors.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </W>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: `linear-gradient(to top, ${colors.bg}, transparent)`, pointerEvents: 'none' }} />
    </section>
  );
}

/* ═══════════════ TECH CAROUSEL ═══════════════ */
const TECH = [
  { name: 'OpenAI', logo: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg> },
  { name: 'Claude', logo: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.603 15.357a2.21 2.21 0 0 1-.757-1.59V6.249a2.222 2.222 0 0 1 3.347-1.917l9.14 5.37c.14.08.267.18.378.295L4.603 15.357zm14.794-6.71L8.268 3.263A3.468 3.468 0 0 0 3.1 6.249v7.518c0 .868.327 1.703.916 2.345l12.38-7.465zM19.397 8.643l-12.108 7.3a2.22 2.22 0 0 0 .98.308 2.189 2.189 0 0 0 1.224-.275l9.14-5.37a2.222 2.222 0 0 0 .764-3.054v1.09zm.518 1.565a3.467 3.467 0 0 1-1.682 2.558l-9.14 5.37a3.478 3.478 0 0 1-1.91.57c-.476 0-.94-.1-1.373-.285L18.18 11.86c.5-.302.895-.75 1.137-1.28l.597.35v-.722z"/></svg> },
  { name: 'Gemini', logo: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.352 0 0 5.352 0 12s5.352 12 12 12 12-5.352 12-12S18.648 0 12 0zm0 2.4c5.28 0 9.6 4.32 9.6 9.6 0 .336-.024.672-.048 1.008C19.2 9.12 15.792 6 11.76 6c-1.584 0-3.072.432-4.368 1.152A9.606 9.606 0 0 1 12 2.4zM2.4 12c0-1.92.576-3.72 1.56-5.232C5.352 8.64 7.44 10.08 9.84 10.8c-.192.384-.36.768-.504 1.176C6.072 11.568 3.36 10.2 2.496 9.648 2.424 10.416 2.4 11.208 2.4 12c0 2.88 1.272 5.472 3.288 7.248.288-1.896 1.176-3.624 2.52-4.944.672 1.032 1.512 1.944 2.496 2.688-1.2.984-2.088 2.328-2.544 3.864A9.533 9.533 0 0 0 12 21.6c1.992 0 3.84-.624 5.376-1.68-.768-1.2-1.896-2.16-3.24-2.736.816-.888 1.488-1.896 1.992-3.024 1.8 1.08 3.168 2.808 3.744 4.872A9.575 9.575 0 0 0 21.6 12c0-.72-.096-1.416-.24-2.088-1.416.984-3.168 1.656-5.04 1.848.048-.576.072-1.152.048-1.752 2.304-.024 4.488-.816 6.192-2.136A9.558 9.558 0 0 0 12 2.4"/></svg> },
  { name: 'Python', logo: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.35.12-.33.2-.28.28-.25.34-.21.41-.18.45-.15.5-.13.53-.11.55-.1.56-.08.56-.06.55-.04.53-.02.5-.01h.38zm-5.97 3.23q-.48 0-.82.35-.34.34-.34.82 0 .47.34.82.34.34.82.34.47 0 .82-.34.34-.35.34-.82 0-.48-.34-.82-.35-.35-.82-.35z"/><path d="M18.5 9.72l.06.03.04.02h.08l.06-.02.04-.02.04-.04.04-.04.02-.06.02-.06V2.28l.04-.26.1-.3.16-.33.25-.34.34-.34.45-.32.59-.3.73-.26.9-.2.87-.12.76-.05h.5l.53.02.55.04.55.06.56.08.55.1.53.11.5.13.45.15.41.18.34.21.28.25.2.28.12.33.05.35-.02.37-.01 2.75h-4.11v.83h5.28l.24.01.32.05.36.1.4.16.42.24.42.33.4.44.36.57.32.71.24.87.16 1.04.06 1.22-.05 1.23-.14 1.05-.21.88-.28.73-.32.59-.35.46-.36.36-.36.26-.35.18-.32.12-.28.07-.21.03h-4.95v-3.06l.02-.21.04-.27.07-.32.1-.35.15-.37.2-.36.27-.35.33-.32.41-.27.5-.22.59-.14.69-.05h5.31l.21-.02.26-.04.3-.07.33-.1.35-.14.35-.19.33-.25.3-.31.26-.38.21-.46.13-.55.05-.63V5.87l-.04-.26-.1-.3-.16-.33-.25-.34-.34-.34-.45-.32-.59-.3-.73-.26-.9-.2-.87-.12-.76-.05-.5 0-.53.02-.55.04-.55.06-.56.08-.55.1-.53.11-.5.13-.45.15-.41.18-.34.21-.28.25-.2.28-.12.33-.05.35.02.37v5.75l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H9.73l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17zm5.97 7.82q.48 0 .82.35.34.34.34.82 0 .47-.34.82-.34.34-.82.34-.47 0-.82-.34-.34-.35-.34-.82 0-.48.34-.82.35-.35.82-.35z"/></svg> },
  { name: 'React', logo: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.31 0-.592.068-.846.206C4.96 2.31 4.55 4.027 4.866 6.475c-2.22.822-3.573 2.054-3.573 3.529 0 1.475 1.354 2.706 3.573 3.528-.316 2.448.094 4.165 1.397 4.934.26.14.543.21.846.21 1.346 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.31 0 .592-.069.846-.207 1.302-.77 1.712-2.486 1.397-4.934 2.22-.822 3.573-2.053 3.573-3.529 0-1.475-1.354-2.706-3.573-3.528.316-2.448-.094-4.166-1.397-4.934-.26-.14-.543-.21-.846-.21zm-.092 1.655c.146.066.29.2.399.378.552.896.525 2.544.014 4.476-.749-.245-1.56-.44-2.42-.582a16.33 16.33 0 0 0-1.577-1.89c1.457-1.362 2.817-2.23 3.584-2.382zm-6.578 0c.767.152 2.126 1.02 3.583 2.381a16.527 16.527 0 0 0-1.577 1.89c-.86.143-1.671.338-2.42.583-.51-1.932-.538-3.58.014-4.476a.753.753 0 0 1 .4-.378zM5.89 7.3c.474 1.416 1.134 2.938 1.961 4.492-.827 1.553-1.487 3.076-1.96 4.492-1.797-.614-2.927-1.54-2.927-2.28S4.093 7.914 5.89 7.3zm12.222 0c1.797.614 2.926 1.54 2.926 2.28s-1.13 1.666-2.926 2.28c-.474-1.416-1.134-2.938-1.961-4.492.827-1.553 1.487-3.076 1.96-4.492zm-6.12 2.286c.54.56 1.054 1.168 1.536 1.82a19.78 19.78 0 0 1-3.072 0 18.306 18.306 0 0 1 1.535-1.82zm-3.323.862c-.363.587-.699 1.192-1.006 1.812-.307-.62-.644-1.225-1.006-1.812a18.843 18.843 0 0 1 2.012 0zm6.664 0a18.843 18.843 0 0 1 2.012 0c-.363.587-.699 1.192-1.006 1.812-.307-.62-.644-1.225-1.006-1.812zM8.818 12c-.34.617-.65 1.242-.93 1.874a17.592 17.592 0 0 1-.93-1.874c.28-.633.59-1.257.93-1.874.28.633.59 1.257.93 1.874zm2.59 2.414a16.18 16.18 0 0 0 1.577 1.89c-1.457 1.362-2.817 2.23-3.584 2.382-.146-.066-.29-.2-.399-.378-.552-.896-.525-2.544-.014-4.476.749.244 1.56.44 2.42.582zm2.594 0c.86-.143 1.671-.338 2.42-.582.51 1.932.538 3.58-.014 4.476a.753.753 0 0 1-.4.378c-.766-.152-2.126-1.02-3.583-2.381a16.527 16.527 0 0 0 1.577-1.89z"/></svg> },
  { name: 'Node.js', logo: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.25 1.328-.604.065-.037.15-.023.218.017l2.256 1.339a.29.29 0 0 0 .272 0l8.795-5.076a.277.277 0 0 0 .134-.238V6.921a.28.28 0 0 0-.137-.242L11.998 1.607a.274.274 0 0 0-.27 0L2.943 6.68a.281.281 0 0 0-.139.24v10.15c0 .099.053.19.138.236l2.409 1.392c1.307.654 2.108-.116 2.108-.89V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.112.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.55l-2.307-1.329A1.85 1.85 0 0 1 1.224 17.1V6.95c0-.68.362-1.313.951-1.652L10.97.226a1.905 1.905 0 0 1 1.854 0l8.794 5.073c.589.339.954.972.954 1.652v10.15a1.857 1.857 0 0 1-.954 1.652l-8.794 5.073a1.887 1.887 0 0 1-.926.174zm2.722-6.986c-3.942 0-4.766-1.812-4.766-3.333 0-.142.113-.253.255-.253h1.14c.127 0 .233.092.252.215.172 1.161.683 1.748 3.019 1.748 1.858 0 2.648-.42 2.648-1.408 0-.57-.225-.992-3.112-1.277-2.412-.239-3.905-.771-3.905-2.702 0-1.78 1.502-2.84 4.019-2.84 2.828 0 4.224.981 4.4 3.087a.256.256 0 0 1-.064.19.26.26 0 0 1-.186.082h-1.147a.252.252 0 0 1-.245-.198c-.272-1.209-.934-1.598-2.758-1.598-2.032 0-2.268.708-2.268 1.238 0 .643.28.83 3.013 1.193 2.708.36 4.004.868 4.004 2.773-.002 1.924-1.602 3.022-4.4 3.022z"/></svg> },
  { name: 'TypeScript', logo: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.42.276.69.394c.27.118.58.234.93.35a8.13 8.13 0 0 1 1.195.52c.37.197.694.424.97.683.277.258.497.553.66.886.164.334.245.72.245 1.16 0 .488-.09.908-.27 1.26-.18.353-.425.647-.738.884a3.32 3.32 0 0 1-1.074.548 4.708 4.708 0 0 1-1.287.182c-.748 0-1.434-.09-2.058-.27a5.427 5.427 0 0 1-1.635-.749v-2.667c.244.203.497.38.76.533.264.153.538.283.822.39.284.108.573.192.867.25.295.06.589.089.882.089.3 0 .56-.028.78-.084a1.81 1.81 0 0 0 .558-.235.99.99 0 0 0 .332-.363.967.967 0 0 0 .115-.467c0-.207-.063-.39-.189-.552a1.84 1.84 0 0 0-.534-.44 5.52 5.52 0 0 0-.822-.39 14.8 14.8 0 0 0-1.06-.393 7.36 7.36 0 0 1-1.122-.497 3.79 3.79 0 0 1-.882-.672 2.88 2.88 0 0 1-.578-.888 2.89 2.89 0 0 1-.206-1.115c0-.467.09-.882.27-1.247.182-.364.434-.673.756-.926a3.45 3.45 0 0 1 1.146-.598A4.948 4.948 0 0 1 18.488 9.75zm-9.163.375v1.953h3.083v8.172h2.25v-8.172h3.084V10.125z"/></svg> },
  { name: 'PostgreSQL', logo: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.556 14.7c-.114-.332-.48-.494-.794-.412-3.168.83-4.376-.14-4.808-.662 2.598-3.843 4.032-8.725 3.89-10.12-.168-1.632-2.044-2.502-3.018-2.804C17.748.388 16.466.146 15.314.048a12.7 12.7 0 0 0-2.366.016c-.466-.247-1.636-.736-3.386-.76-2.04-.027-3.582.626-4.588 1.942C3.612 3.076 3.232 5.628 3.5 9c-.75 1.74-.842 4.352.06 5.87.395.665.946 1.04 1.59 1.078.06.004.118.006.176.006.74 0 1.334-.4 1.788-1.128.312-.5.54-1.136.724-1.782a8.197 8.197 0 0 0 2.832 1.466v.064c-.312.518-.778.67-1.624.892-.498.13-1.064.278-1.586.61-.938.596-1.394 1.57-1.254 2.67.2 1.57 1.312 2.534 2.912 2.534l.376-.018c1.04-.106 2.028-.558 2.72-1.24.48-.474.8-1.036 1.008-1.626.33.218.696.396 1.108.484.264.056.528.084.786.084.538 0 1.062-.14 1.524-.412.564-.332.98-.828 1.256-1.418.252.082.534.14.856.176.218.024.44.036.67.036.79 0 1.672-.182 2.592-.536.078-.03 2.086-.822 1.742-1.83zM8.882 13.564c-.17.61-.39 1.162-.652 1.582-.34.547-.672.702-.884.69-.156-.008-.364-.11-.598-.504-.7-1.176-.56-3.392.044-4.774.18.176.376.334.59.472.506.328 1.106.544 1.754.668a15.91 15.91 0 0 0-.254 1.866zm4.248 5.454c-.206.75-.668 1.386-1.292 1.8-.624.414-1.386.572-2.1.46-.91-.142-1.47-.642-1.576-1.42-.072-.534.132-1.04.672-1.382.35-.224.786-.34 1.248-.464.836-.224 1.544-.414 2.014-1.214l.064-.108c.024.45.04.9.048 1.33.016.34-.018.668-.078.998zm3.128-.72c-.206.522-.568.896-1.096 1.2-.548.316-1.18.4-1.738.29a2.41 2.41 0 0 1-.89-.38c.038-.51.046-1.08.022-1.704a25.47 25.47 0 0 0-.14-1.902c.46-.194.862-.486 1.158-.862a.69.69 0 0 0 .116-.148c.39.63.84 1.172 1.376 1.54.332.228.694.388 1.08.452a3.013 3.013 0 0 1-.086.514z"/></svg> },
  { name: 'n8n', logo: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.87 5.236v5.394l4.678 2.7V7.936zm4.678 9.528l-4.679 2.7v5.394l4.679-2.7zM7.51 2.536L2.83 5.236v5.394l4.679-2.7zm0 6.83l-4.68 2.7v5.393l4.68-2.7zm10.036-4.13L12.87.536l-4.68 2.7 4.68 2.7zm-5.36 10.958l-4.679-2.7-4.679 2.7 4.68 2.7zM21.17 7.936l-4.68-2.7v5.394l4.68 2.7zm0 6.828l-4.68-2.7v5.394l4.68 2.7z"/></svg> },
  { name: 'WhatsApp', logo: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg> },
  { name: 'Vercel', logo: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 22.525H0l12-21.05z"/></svg> },
  { name: 'Supabase', logo: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.7.6c-.5-.7-1.5-.7-1.9 0L.4 17.7c-.5.7.1 1.7.9 1.7h9.1V12h3.2v7.4h9.1c.9 0 1.4-1 .9-1.7z"/></svg> },
  { name: 'LangChain', logo: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.18L18.36 7.5 12 10.82 5.64 7.5 12 4.18zM5 8.82l6 3.32v6.54l-6-3.32V8.82zm8 9.86v-6.54l6-3.32v6.54l-6 3.32z"/></svg> },
  { name: 'Docker', logo: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.185-.186h-2.119a.186.186 0 0 0-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 0 0-.75.748 11.376 11.376 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.72 3.13 1.13 5.312 1.13.984 0 1.968-.09 2.935-.268a11.47 11.47 0 0 0 3.12-1.16 9.199 9.199 0 0 0 2.373-1.907c1.187-1.327 1.897-2.815 2.427-4.085h.21c1.303 0 2.105-.529 2.553-1.026.318-.338.55-.74.68-1.18l.09-.34z"/></svg> },
];

function TechCarousel({ lang, colors }: any) {
  const doubled = [...TECH, ...TECH];

  return (
    <Section colors={colors} alt style={{ padding: '44px 0', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <p className="reveal" style={{ fontSize: 12, color: colors.textDim, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {lang === 'pt' ? 'Tecnologias que implementamos' : 'Technologies we implement'}
        </p>
      </div>
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden', maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
        <div style={{
          display: 'flex', gap: 32, alignItems: 'center', width: 'max-content',
          animation: 'scroll-left 40s linear infinite',
        }}>
          {doubled.map((tech, i) => (
            <div key={`${tech.name}-${i}`} style={{
              display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap',
              padding: '10px 22px', borderRadius: 9999, border: `1px solid ${colors.glassCardBorder}`,
              background: colors.glassCard, backdropFilter: 'blur(8px)',
              transition: 'all 0.3s', flexShrink: 0, cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = colors.borderHover; e.currentTarget.style.transform = 'scale(1.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = colors.glassCardBorder; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <span style={{ width: 20, height: 20, color: colors.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {tech.logo}
              </span>
              <span style={{ fontSize: 14, color: colors.textMuted, fontWeight: 600 }}>
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════ SERVICE CARD ═══════════════ */
function ServiceCard({ icon: Icon, title, desc, slug, lang, colors }: any) {
  return (
    <Link to={`/servicos/${slug}`} className="reveal" style={{
      padding: 28, borderRadius: 16, background: colors.glassCard, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      border: `1px solid ${colors.glassCardBorder}`, transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)', cursor: 'pointer',
      textDecoration: 'none', display: 'block',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'; e.currentTarget.style.borderColor = colors.borderHover; e.currentTarget.style.boxShadow = `0 24px 48px ${colors.shadow}, 0 0 40px rgba(13,148,136,0.1)`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.borderColor = colors.glassCardBorder; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <Icon size={22} style={{ color: colors.brandLight }} />
      </div>
      <h3 style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', fontWeight: 600, color: colors.white, marginBottom: 10 }}>{title}</h3>
      <p style={{ color: colors.textMuted, fontSize: 'clamp(0.8rem, 1.4vw, 0.875rem)', lineHeight: 1.7 }}>{desc}</p>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, fontSize: 13, color: colors.brandLight, fontWeight: 500 }}>
        {lang === 'pt' ? 'Saiba mais' : 'Learn more'} <ChevronRight size={14} style={{ transition: 'transform 0.3s' }} className='svc-arrow' />
      </span>
    </Link>
  );
}

/* ═══════════════ SERVICES (6 cards, 3x2) ═══════════════ */
function Services({ t, lang, colors }: any) {
  const services = [
    { icon: Database, titleKey: 'svc.data.title', descKey: 'svc.data.desc', slug: 'extracao-de-dados' },
    { icon: Workflow, titleKey: 'svc.auto.title', descKey: 'svc.auto.desc', slug: 'automacao' },
    { icon: MessageSquare, titleKey: 'svc.chat.title', descKey: 'svc.chat.desc', slug: 'chatbots' },
    { icon: Globe, titleKey: 'svc.web.title', descKey: 'svc.web.desc', slug: 'sites' },
    { icon: LayoutDashboard, titleKey: 'svc.bi.title', descKey: 'svc.bi.desc', slug: 'dashboards' },
    { icon: BrainCircuit, titleKey: 'svc.consult.title', descKey: 'svc.consult.desc', slug: 'consultoria-ia' },
  ];

  return (
    <Section id="servicos" colors={colors} style={{ padding: '96px 0' }}>
      <W>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', background: 'rgba(37,99,235,0.1)', color: colors.brandLight, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
            {t('services.tag')}
          </span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, color: colors.white, marginBottom: 16 }}>
            {t('services.title')}
          </h2>
          <p className="reveal rv-d2" style={{ color: colors.textMuted, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            {t('services.sub')}
          </p>
        </div>
        <div id="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {services.map((s) => (
            <ServiceCard key={s.titleKey} icon={s.icon} title={t(s.titleKey as any)} desc={t(s.descKey as any)} slug={s.slug} lang={lang} colors={colors} />
          ))}
        </div>
        <style>{`
          @media (max-width: 900px) { #services-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 600px) { #services-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </W>
    </Section>
  );
}

/* ═══════════════ METRICS ═══════════════ */
function Metrics({ lang, colors }: any) {
  const metrics = lang === 'pt' ? [
    { value: '1.6M+', label: 'Registros processados', desc: 'Dados empresariais extraídos e organizados para prospecção comercial.', icon: BarChart3 },
    { value: '200+', label: 'Horas economizadas/mês', desc: 'Automações que eliminam tarefas repetitivas e liberam sua equipe.', icon: Clock },
    { value: '99.9%', label: 'Disponibilidade', desc: 'Sistemas sempre online com monitoramento e suporte contínuo.', icon: Shield },
    { value: '< 7 dias', label: 'Prazo de entrega', desc: 'Da proposta ao primeiro entregável em menos de uma semana.', icon: TrendingUp },
  ] : [
    { value: '1.6M+', label: 'Records processed', desc: 'Business data extracted and organized for commercial prospecting.', icon: BarChart3 },
    { value: '200+', label: 'Hours saved/month', desc: 'Automations that eliminate repetitive tasks and free your team.', icon: Clock },
    { value: '99.9%', label: 'Availability', desc: 'Systems always online with continuous monitoring and support.', icon: Shield },
    { value: '< 7 days', label: 'Delivery time', desc: 'From proposal to first deliverable in less than a week.', icon: TrendingUp },
  ];

  return (
    <Section alt colors={colors} style={{ padding: '96px 0' }}>
      <W>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', background: 'rgba(56,189,248,0.1)', color: colors.gold, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
            {lang === 'pt' ? 'Resultados' : 'Results'}
          </span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, color: colors.white, marginBottom: 12 }}>
            {lang === 'pt' ? 'Resultados que comprovam' : 'Proven results'}
          </h2>
          <p className="reveal rv-d2" style={{ color: colors.textMuted, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            {lang === 'pt' ? 'Cada número representa impacto real na operação dos nossos clientes.' : 'Each number represents real impact on our clients\' operations.'}
          </p>
        </div>
        <div id="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {metrics.map((m) => (
            <div key={m.label} className="reveal" style={{
              padding: 28, textAlign: 'center', borderRadius: 16, background: colors.glassCard, border: `1px solid ${colors.glassCardBorder}`,
              transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'; e.currentTarget.style.borderColor = colors.borderHover; e.currentTarget.style.boxShadow = `0 24px 48px ${colors.shadow}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.borderColor = colors.glassCardBorder; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <m.icon size={24} style={{ color: colors.gold, margin: '0 auto 14px' }} />
              <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 300, color: colors.white, marginBottom: 6 }}>{m.value}</div>
              <div style={{ fontSize: 14, color: colors.text, fontWeight: 600, marginBottom: 8 }}>{m.label}</div>
              <div style={{ fontSize: 13, color: colors.textDim, lineHeight: 1.6 }}>{m.desc}</div>
            </div>
          ))}
        </div>
        <style>{`@media (max-width: 768px) { #metrics-grid { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
      </W>
    </Section>
  );
}

/* ═══════════════ PROCESS ═══════════════ */
function Process({ lang, colors }: any) {
  const steps = lang === 'pt' ? [
    { icon: Search, title: 'Discovery', desc: 'Entendemos seu negócio, desafios e objetivos.' },
    { icon: FileSpreadsheet, title: 'Proposta', desc: 'Apresentamos escopo, cronograma e investimento.' },
    { icon: Code2, title: 'Desenvolvimento', desc: 'Construímos com entregas contínuas e validações semanais.' },
    { icon: Zap, title: 'Entrega & Suporte', desc: 'Ativação, treinamento e acompanhamento contínuo.' },
  ] : [
    { icon: Search, title: 'Discovery', desc: 'We understand your business, challenges and goals.' },
    { icon: FileSpreadsheet, title: 'Proposal', desc: 'We present scope, timeline and investment.' },
    { icon: Code2, title: 'Development', desc: 'We build with continuous delivery and weekly reviews.' },
    { icon: Zap, title: 'Delivery & Support', desc: 'Activation, training and ongoing support.' },
  ];

  return (
    <Section colors={colors} style={{ padding: '96px 0' }}>
      <W>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', background: 'rgba(37,99,235,0.1)', color: colors.brandLight, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
            {lang === 'pt' ? 'Processo' : 'Process'}
          </span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, color: colors.white }}>
            {lang === 'pt' ? 'Como trabalhamos' : 'How we work'}
          </h2>
        </div>
        <div id="process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, position: 'relative' }}>
          {/* Connecting line */}
          <div className="process-line" style={{ position: 'absolute', top: 40, left: '12.5%', right: '12.5%', height: 2, background: `linear-gradient(to right, transparent, ${colors.brand}30, ${colors.brand}30, transparent)`, zIndex: 0 }} />
          {steps.map((step, i) => (
            <div key={step.title} className="reveal" style={{
              padding: 24, borderRadius: 16, background: colors.glassCard, border: `1px solid ${colors.glassCardBorder}`,
              transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)', position: 'relative', zIndex: 1,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'; e.currentTarget.style.borderColor = colors.borderHover; e.currentTarget.style.boxShadow = `0 24px 48px ${colors.shadow}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.borderColor = colors.glassCardBorder; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${colors.brand}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.brand, fontWeight: 700, fontSize: 14, border: `2px solid ${colors.brand}40` }}>{i + 1}</div>
                <step.icon size={18} style={{ color: colors.brandLight }} />
              </div>
              <h3 style={{ color: colors.white, fontWeight: 600, marginBottom: 8, fontSize: 'clamp(0.9rem, 1.6vw, 1rem)' }}>{step.title}</h3>
              <p style={{ color: colors.textMuted, fontSize: 14, lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
        <style>{`
          @media (max-width: 768px) { #process-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 500px) { #process-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </W>
    </Section>
  );
}

/* ═══════════════ GRADIENT DIVIDER ═══════════════ */
function ImageDivider({ colors }: any) {
  return (
    <div style={{ position: 'relative', width: '100%', height: 200, overflow: 'visible' }}>
      <div style={{
        position: 'absolute', inset: '-40px 0',
        background: `linear-gradient(180deg, transparent 0%, ${colors.bg}00 10%, rgba(13,148,136,0.04) 40%, rgba(13,148,136,0.04) 60%, ${colors.bgAlt}00 90%, transparent 100%)`,
      }} />
      <div style={{ position: 'absolute', left: '30%', top: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 400, background: `radial-gradient(circle, ${colors.orbBrand} 0%, transparent 70%)`, borderRadius: '50%', filter: 'blur(100px)' }} />
      <div style={{ position: 'absolute', right: '20%', top: '50%', transform: 'translate(50%,-50%)', width: 300, height: 300, background: `radial-gradient(circle, ${colors.orbGold} 0%, transparent 70%)`, borderRadius: '50%', filter: 'blur(80px)' }} />
    </div>
  );
}

/* ═══════════════ ABOUT ═══════════════ */
function About({ t, lang, colors }: any) {
  return (
    <Section id="sobre" alt colors={colors} style={{ padding: '96px 0' }}>
      <W>
        <div id="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          {/* Visual — stats cards with gradient */}
          <div className="reveal" style={{ position: 'relative' }}>
            <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', background: colors.glassCard, border: `1px solid ${colors.glassCardBorder}`, padding: 32 }}>
              {/* Gradient background */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
                <div style={{ position: 'absolute', top: '10%', left: '10%', width: 200, height: 200, background: `radial-gradient(circle, ${colors.brand}25, transparent 70%)`, borderRadius: '50%', filter: 'blur(50px)' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 180, height: 180, background: `radial-gradient(circle, ${colors.gold}20, transparent 70%)`, borderRadius: '50%', filter: 'blur(40px)' }} />
              </div>
              {/* Stats */}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { v: '900k+', l: lang === 'pt' ? 'Registros processados' : 'Records processed', icon: Database },
                  { v: '8', l: lang === 'pt' ? 'Segmentos atendidos' : 'Segments served', icon: Globe },
                  { v: '24/7', l: lang === 'pt' ? 'Automações ativas' : 'Active automations', icon: Bot },
                  { v: '< 7d', l: lang === 'pt' ? 'Tempo de entrega' : 'Delivery time', icon: Clock },
                ].map((s) => {
                  const SIcon = s.icon;
                  return (
                    <div key={s.l} style={{
                      padding: '16px 20px', background: colors.bgCard, backdropFilter: 'blur(12px)',
                      border: `1px solid ${colors.glassCardBorder}`, borderRadius: 12,
                      display: 'flex', alignItems: 'center', gap: 16,
                      transition: 'all 0.3s',
                    }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: `${colors.brand}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <SIcon size={18} style={{ color: colors.brand }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: colors.textDim, marginBottom: 2 }}>{s.l}</div>
                        <div style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', fontWeight: 600, color: colors.white }}>{s.v}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Text */}
          <div>
            <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', background: 'rgba(37,99,235,0.1)', color: colors.brandLight, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
              {t('about.tag')}
            </span>
            <h2 className="reveal rv-d1" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, color: colors.white, marginBottom: 24 }}>
              {t('about.title')}
            </h2>
            <p className="reveal rv-d2" style={{ color: colors.textMuted, lineHeight: 1.75, marginBottom: 16 }}>{t('about.p1')}</p>
            <p className="reveal rv-d3" style={{ color: colors.textMuted, lineHeight: 1.75, marginBottom: 32 }}>{t('about.p2')}</p>
            <div className="reveal rv-d4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {(lang === 'pt' ? [
                { icon: Database, label: 'Engenharia de Dados' },
                { icon: Bot, label: 'IA & Automação' },
                { icon: Globe, label: 'Desenvolvimento Web' },
                { icon: MessageSquare, label: 'Chatbots & NLP' },
              ] : [
                { icon: Database, label: 'Data Engineering' },
                { icon: Bot, label: 'AI & Automation' },
                { icon: Globe, label: 'Web Development' },
                { icon: MessageSquare, label: 'Chatbots & NLP' },
              ]).map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: colors.glassCard, border: `1px solid ${colors.glassCardBorder}` }}>
                  <item.icon size={20} style={{ color: colors.brandLight, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: colors.text, fontWeight: 500 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 768px) { #about-grid { grid-template-columns: 1fr !important; } }`}</style>
      </W>
    </Section>
  );
}

/* ═══════════════ CASES ═══════════════ */
function Cases({ lang, colors }: any) {
  const caseImages = [IMG.caseData, IMG.caseAuto, IMG.caseWeb];
  const cases = lang === 'pt' ? [
    { title: 'Inteligência de Mercado — Base Empresarial', desc: 'Extração e organização de mais de 1.6 milhão de registros empresariais para prospecção comercial. Dados de contato, sócios, atividade econômica e situação fiscal — tudo limpo e pronto para uso.', tags: ['Dados Públicos', 'Prospecção', 'Inteligência Comercial'], metric: '1.6M+ empresas mapeadas' },
    { title: 'Automação Inteligente para Escritório', desc: 'Sistema completo de prospecção automatizada, atendimento via WhatsApp com IA, gestão financeira automatizada e painel de acompanhamento em tempo real.', tags: ['Automação', 'WhatsApp', 'IA', 'Gestão'], metric: '70% menos trabalho manual' },
    { title: 'Presença Digital de Alto Impacto', desc: 'Sites institucionais e landing pages com design exclusivo, carregamento ultrarrápido e otimizados para aparecer no Google. Experiência premium em qualquer dispositivo.', tags: ['Design Exclusivo', 'Performance', 'SEO'], metric: 'Nota máxima em velocidade' },
  ] : [
    { title: 'Market Intelligence — Business Database', desc: 'Extraction and organization of over 1.6 million business records for commercial prospecting. Contact data, partners, economic activity and fiscal status — all clean and ready to use.', tags: ['Public Data', 'Prospecting', 'Business Intelligence'], metric: '1.6M+ companies mapped' },
    { title: 'Intelligent Office Automation', desc: 'Complete system with automated prospecting, AI-powered WhatsApp support, automated financial management and real-time monitoring dashboard.', tags: ['Automation', 'WhatsApp', 'AI', 'Management'], metric: '70% less manual work' },
    { title: 'High-Impact Digital Presence', desc: 'Institutional websites and landing pages with exclusive design, ultra-fast loading and optimized to rank on Google. Premium experience on any device.', tags: ['Exclusive Design', 'Performance', 'SEO'], metric: 'Top speed score' },
  ];

  return (
    <Section id="cases" colors={colors} style={{ padding: '96px 0' }}>
      <W>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', background: 'rgba(37,99,235,0.1)', color: colors.brandLight, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>Portfolio</span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, color: colors.white }}>Cases</h2>
        </div>
        <div id="cases-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {cases.map((c, i) => (
            <div key={c.title} className="reveal" style={{
              display: 'flex', flexDirection: 'column', borderRadius: 16, background: colors.glassCard, border: `1px solid ${colors.glassCardBorder}`,
              transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)', overflow: 'hidden',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'; e.currentTarget.style.borderColor = colors.borderHover; e.currentTarget.style.boxShadow = `0 24px 48px ${colors.shadow}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.borderColor = colors.glassCardBorder; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Case image */}
              <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                <img src={caseImages[i]} alt={`Case: ${c.title}`} loading="lazy" width={600} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent 60%)' }} />
                <span style={{ position: 'absolute', bottom: 12, left: 16, padding: '4px 12px', borderRadius: 6, background: 'rgba(56,189,248,0.2)', backdropFilter: 'blur(8px)', color: colors.gold, fontSize: 12, fontWeight: 600 }}>{c.metric}</span>
              </div>
              {/* Case content */}
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', fontWeight: 600, color: colors.white, marginBottom: 12 }}>{c.title}</h3>
                <p style={{ color: colors.textMuted, fontSize: 'clamp(0.8rem, 1.4vw, 0.875rem)', lineHeight: 1.7, marginBottom: 20, flex: 1 }}>{c.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {c.tags.map((tag) => (
                    <span key={tag} style={{ padding: '3px 10px', borderRadius: 9999, background: colors.tagBg, border: `1px solid ${colors.tagBorder}`, fontSize: 12, color: colors.textDim, fontWeight: 500 }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <style>{`@media (max-width: 900px) { #cases-grid { grid-template-columns: 1fr !important; } }`}</style>
      </W>
    </Section>
  );
}

/* ═══════════════ CTA ═══════════════ */
function CtaSection({ t }: any) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: '120px 0' }}>
      {/* Gradient background — smooth blend */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(13,148,136,0.06) 30%, rgba(13,148,136,0.1) 50%, rgba(13,148,136,0.06) 70%, transparent 100%)' }} />
      <div style={{ position: 'absolute', left: '30%', top: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, background: 'radial-gradient(circle, rgba(13,148,136,0.08) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(100px)' }} />
      <div style={{ position: 'absolute', right: '25%', top: '50%', transform: 'translate(50%,-50%)', width: 400, height: 400, background: 'radial-gradient(circle, rgba(45,212,191,0.05) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)' }} />
      <W style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <h2 className="reveal" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 300, color: '#fff', marginBottom: 24 }}>{t('cta.title')}</h2>
        <p className="reveal rv-d1" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto 40px', fontSize: 'clamp(1rem, 2vw, 1.125rem)', lineHeight: 1.7 }}>{t('cta.sub')}</p>
        <a href="#contato" className="btn-cta anim-pulse-glow reveal rv-d2" style={{ padding: '16px 40px', fontSize: 'clamp(0.95rem, 1.8vw, 1.125rem)' }}>
          {t('cta.btn')} <ArrowRight size={18} />
        </a>
      </W>
    </section>
  );
}

/* ═══════════════ CONTACT ═══════════════ */
function Contact({ lang, colors }: any) {
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const name = data.get('name');
    const msg = data.get('message');
    const whats = data.get('whatsapp');
    const greeting = lang === 'pt' ? `Olá! Sou ${name}${whats ? ` (${whats})` : ''}. ${msg}` : `Hello! I'm ${name}${whats ? ` (${whats})` : ''}. ${msg}`;
    window.open(`https://wa.me/5541987991419?text=${encodeURIComponent(greeting)}`, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    background: colors.inputBg, border: `1px solid ${colors.border}`,
    color: colors.white, fontSize: 14, outline: 'none', transition: 'border-color 0.3s, box-shadow 0.3s', fontFamily: 'inherit',
  };

  return (
    <Section id="contato" colors={colors} style={{ padding: '96px 0' }}>
      <W>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 48 }}>
          <div>
            <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', background: 'rgba(37,99,235,0.1)', color: colors.brandLight, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
              {lang === 'pt' ? 'Contato' : 'Contact'}
            </span>
            <h2 className="reveal rv-d1" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, color: colors.white, marginBottom: 24 }}>
              {lang === 'pt' ? 'Vamos conversar' : "Let's talk"}
            </h2>
            <p className="reveal rv-d2" style={{ color: colors.textMuted, lineHeight: 1.7, marginBottom: 32 }}>
              {lang === 'pt' ? 'Envie uma mensagem ou entre em contato diretamente. Respondemos em até 24 horas.' : 'Send a message or reach out directly. We respond within 24 hours.'}
            </p>
            <div className="reveal rv-d3" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: Phone, text: '+55 (41) 98799-1419', href: 'https://wa.me/5541987991419' },
                { icon: Mail, text: 'contato@stauf.com.br', href: 'mailto:contato@stauf.com.br' },
                { icon: MapPin, text: 'Curitiba, PR — Brasil', href: undefined },
              ].map((item) => {
                const content = (<span style={{ display: 'flex', alignItems: 'center', gap: 12, color: colors.textMuted, fontSize: 14 }}><item.icon size={18} style={{ color: colors.brand }} /> {item.text}</span>);
                return item.href ? <a key={item.text} href={item.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{content}</a> : <div key={item.text}>{content}</div>;
              })}
            </div>
            <div className="reveal rv-d4" style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              {[{ icon: Instagram, href: 'https://instagram.com/stauf.dev', label: 'Instagram' }, { icon: Linkedin, href: 'https://linkedin.com/company/staufdev', label: 'LinkedIn' }, { icon: Github, href: 'https://github.com/baronglock', label: 'GitHub' }].map((s, i) => (
                <a key={i} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.textMuted, textDecoration: 'none', transition: 'all 0.3s', background: colors.glass, border: `1px solid ${colors.glassBorder}` }}
                  onMouseEnter={e => { e.currentTarget.style.color = colors.brand; e.currentTarget.style.borderColor = colors.borderHover; }}
                  onMouseLeave={e => { e.currentTarget.style.color = colors.textMuted; e.currentTarget.style.borderColor = colors.glassBorder; }}
                ><s.icon size={18} /></a>
              ))}
            </div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="reveal rv-d2" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20, borderRadius: 16, background: colors.glassCard, border: `1px solid ${colors.glassCardBorder}` }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 6 }}>{lang === 'pt' ? 'Nome' : 'Name'}</label>
              <input name="name" required style={inputStyle} placeholder={lang === 'pt' ? 'Seu nome' : 'Your name'}
                onFocus={e => { e.currentTarget.style.borderColor = colors.brand; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.15)'; }} onBlur={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.boxShadow = 'none'; }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 6 }}>WhatsApp</label>
              <input name="whatsapp" type="tel" required style={inputStyle} placeholder="(41) 99999-9999"
                onFocus={e => { e.currentTarget.style.borderColor = colors.brand; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.15)'; }} onBlur={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.boxShadow = 'none'; }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 6 }}>{lang === 'pt' ? 'Mensagem' : 'Message'}</label>
              <textarea name="message" rows={4} required style={{ ...inputStyle, resize: 'none' }} placeholder={lang === 'pt' ? 'Conte-nos sobre seu projeto...' : 'Tell us about your project...'}
                onFocus={e => { e.currentTarget.style.borderColor = colors.brand; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.15)'; }} onBlur={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.boxShadow = 'none'; }} />
            </div>
            <button type="submit" className="btn-cta" style={{ padding: '14px 24px', width: '100%', fontSize: 15 }}>
              {sent ? (lang === 'pt' ? 'Redirecionando para WhatsApp...' : 'Redirecting to WhatsApp...')  : (lang === 'pt' ? 'Enviar pelo WhatsApp' : 'Send via WhatsApp')}
              {!sent && <ExternalLink size={16} />}
            </button>
          </form>
        </div>
      </W>
    </Section>
  );
}

/* ═══════════════ APP ═══════════════ */
export default function App() {
  const { lang, t, toggle } = useLanguage();
  const { theme, colors, toggleTheme } = useTheme();

  return (
    <div style={{
      minHeight: '100vh', color: colors.text, fontFamily: "'Inter', system-ui, sans-serif", width: '100%',
      transition: 'background-color 0.4s ease, color 0.4s ease',
      background: colors.bg,
    }}>
      <CosmicBackground theme={theme} />
      <div style={{ position: 'relative', zIndex: 1 }}>
      <Navbar t={t} lang={lang} toggle={toggle} colors={colors} theme={theme} toggleTheme={toggleTheme} />
      <Hero t={t} lang={lang} colors={colors} />
      <TechCarousel lang={lang} colors={colors} />
      <Services t={t} lang={lang} colors={colors} />
      <ImageDivider colors={colors} />
      <Metrics lang={lang} colors={colors} />
      <Process lang={lang} colors={colors} />
      <About t={t} lang={lang} colors={colors} />
      <Cases lang={lang} colors={colors} />
      <CtaSection t={t} colors={colors} />
      <Contact lang={lang} colors={colors} />
      <Footer t={t} lang={lang} colors={colors} />
      </div>
      <CookieBanner colors={colors} />
    </div>
  );
}
