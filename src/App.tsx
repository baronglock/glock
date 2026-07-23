import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Database, Bot, Globe, BrainCircuit, ChevronRight, ArrowRight,
  ExternalLink, Mail, Phone, MapPin, Instagram,
  Linkedin, Github, Shield, Clock, TrendingUp,
  BarChart3, Code2, MessageSquare, Search, FileSpreadsheet,
  Workflow, LayoutDashboard, Zap, ChevronLeft,
  Headphones, DollarSign, Megaphone, Settings, Users,
  CheckCircle2
} from 'lucide-react';
import { useReveal } from './hooks/useReveal';
import { CookieBanner } from './components/CookieBanner';
import { ChatWidget } from './components/ChatWidget';
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

    {/* Film grain texture — real photo, organic */}
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
      backgroundImage: 'url(/texture-film-grain.webp)', backgroundRepeat: 'repeat', backgroundSize: '512px',
      opacity: dk ? 0.06 : 0.03, mixBlendMode: 'overlay',
    }} />

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
      position: 'relative', minHeight: '100dvh', display: 'flex', alignItems: 'center', overflow: 'hidden', width: '100%',
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
          <h1 className="anim-fade-up" style={{ fontFamily: "'Bricolage Grotesque', 'Trebuchet MS', system-ui, sans-serif", fontSize: 'clamp(3.2rem, 7.5vw, 6rem)', fontWeight: 700, lineHeight: 0.98, letterSpacing: '-0.03em', marginBottom: 28 }}>
            <span style={{ color: colors.white }}>{t('hero.title1')}</span>
            <br />
            <span style={{ color: colors.brand }}>{t('hero.title2')}</span>
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
                { value: '912k+', label: lang === 'pt' ? 'Registros processados' : 'Records processed' },
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
/* ═══════════════ DEMOS VIVAS (faixa) ═══════════════ */
function DemoStrip({ lang, colors }: any) {
  const demos = lang === 'pt' ? [
    { k: 'barbearia', t: 'Agenda que se preenche' },
    { k: 'academia', t: 'Aluno que não some' },
    { k: 'clínica', t: 'Paciente lembrado' },
  ] : [
    { k: 'barbershop', t: 'A calendar that fills itself' },
    { k: 'gym', t: 'Members who stay' },
    { k: 'clinic', t: 'Patients, remembered' },
  ];
  return (
    <Section colors={colors} alt style={{ padding: '44px 0' }}>
      <W>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <p className="reveal" style={{ fontSize: 12, color: colors.textDim, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {lang === 'pt' ? 'Não acredita? Usa. Demos vivas por nicho' : "Don't take our word. Try the live demos"}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {demos.map((d) => (
              <Link key={d.k} to="/demo" className="reveal" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                borderRadius: 9999, border: `1px solid ${colors.glassCardBorder}`, background: colors.glassCard,
                textDecoration: 'none', transition: 'border-color 0.25s cubic-bezier(0.22,1,0.36,1), transform 0.25s cubic-bezier(0.22,1,0.36,1)',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.brand; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.glassCardBorder; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <span style={{ fontSize: 11, color: colors.brand, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{d.k}</span>
                <span style={{ fontSize: 13, color: colors.textMuted }}>{d.t}</span>
                <ArrowRight size={13} style={{ color: colors.textDim }} />
              </Link>
            ))}
          </div>
        </div>
      </W>
    </Section>
  );
}

/* ═══════════════ SERVICE CARD ═══════════════ */
function ServiceCard({ icon: Icon, title, desc, slug, lang, colors }: any) {
  const href = slug.startsWith('_') ? `/${slug.slice(1)}` : `/servicos/${slug}`;
  return (
    <Link to={href} className="reveal" style={{
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
    { icon: Shield, titleKey: 'svc.security.title', descKey: 'svc.security.desc', slug: '_killspy' },
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
    { value: '1,7 mi', label: 'Registros processados', desc: 'Dados empresariais extraídos e organizados para prospecção comercial.', icon: BarChart3 },
    { value: '214', label: 'Horas economizadas/mês', desc: 'Automações que eliminam tarefas repetitivas e liberam sua equipe.', icon: Clock },
    { value: '99,7%', label: 'Disponibilidade', desc: 'Sistemas sempre online com monitoramento e suporte contínuo.', icon: Shield },
    { value: '< 7 dias', label: 'Prazo de entrega', desc: 'Da proposta ao primeiro entregável em menos de uma semana.', icon: TrendingUp },
  ] : [
    { value: '1.7M+', label: 'Records processed', desc: 'Business data extracted and organized for commercial prospecting.', icon: BarChart3 },
    { value: '214', label: 'Hours saved/month', desc: 'Automations that eliminate repetitive tasks and free your team.', icon: Clock },
    { value: '99.7%', label: 'Availability', desc: 'Systems always online with continuous monitoring and support.', icon: Shield },
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
                  { v: '912k+', l: lang === 'pt' ? 'Registros processados' : 'Records processed', icon: Database },
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

/* ═══════════════ SECTOR AUTOMATION ═══════════════ */
function SectorAutomation({ lang, colors }: any) {
  const departments = lang === 'pt' ? [
    {
      icon: Headphones, name: 'Atendimento',
      color: '#06b6d4',
      tasks: [
        'Chatbot 24/7 com IA para dúvidas frequentes',
        'Triagem e encaminhamento automático de tickets',
        'Respostas automáticas no WhatsApp e e-mail',
        'Pesquisas de satisfação pós-atendimento',
        'Relatórios de SLA e tempo de resposta',
      ],
    },
    {
      icon: DollarSign, name: 'Financeiro',
      color: '#10b981',
      tasks: [
        'Conciliação bancária automática',
        'Emissão e envio de boletos e NFs',
        'Cobranças automáticas por WhatsApp/e-mail',
        'Alertas de inadimplência e vencimentos',
        'Relatórios financeiros em tempo real',
      ],
    },
    {
      icon: Megaphone, name: 'Marketing',
      color: '#f59e0b',
      tasks: [
        'Disparo segmentado de e-mails e campanhas',
        'Geração de conteúdo com IA (posts, textos)',
        'Monitoramento de redes sociais e menções',
        'Lead scoring e qualificação automática',
        'Relatórios de ROI por canal',
      ],
    },
    {
      icon: Settings, name: 'Operações',
      color: '#8b5cf6',
      tasks: [
        'Automação de processos repetitivos (RPA)',
        'Integração entre sistemas e planilhas',
        'Alertas e notificações por eventos',
        'Controle de estoque e reposição automática',
        'Dashboards operacionais em tempo real',
      ],
    },
    {
      icon: Users, name: 'RH',
      color: '#ec4899',
      tasks: [
        'Triagem automática de currículos com IA',
        'Onboarding digital de novos colaboradores',
        'Controle de ponto e banco de horas',
        'Pesquisas de clima organizacional',
        'Avisos automáticos de férias e vencimentos',
      ],
    },
  ] : [
    {
      icon: Headphones, name: 'Customer Service',
      color: '#06b6d4',
      tasks: [
        '24/7 AI chatbot for common questions',
        'Automatic ticket triage and routing',
        'Auto-replies on WhatsApp and email',
        'Post-service satisfaction surveys',
        'SLA and response time reports',
      ],
    },
    {
      icon: DollarSign, name: 'Finance',
      color: '#10b981',
      tasks: [
        'Automatic bank reconciliation',
        'Invoice and receipt generation & sending',
        'Automated collections via WhatsApp/email',
        'Delinquency and due date alerts',
        'Real-time financial reports',
      ],
    },
    {
      icon: Megaphone, name: 'Marketing',
      color: '#f59e0b',
      tasks: [
        'Segmented email and campaign blasts',
        'AI content generation (posts, copy)',
        'Social media and mention monitoring',
        'Automatic lead scoring & qualification',
        'ROI reports by channel',
      ],
    },
    {
      icon: Settings, name: 'Operations',
      color: '#8b5cf6',
      tasks: [
        'Repetitive process automation (RPA)',
        'System and spreadsheet integrations',
        'Event-driven alerts and notifications',
        'Inventory control and auto-restock',
        'Real-time operational dashboards',
      ],
    },
    {
      icon: Users, name: 'HR',
      color: '#ec4899',
      tasks: [
        'AI-powered resume screening',
        'Digital onboarding for new hires',
        'Time tracking and hour banks',
        'Organizational climate surveys',
        'Automatic vacation and deadline notices',
      ],
    },
  ];

  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <Section id="automacao-setores" alt colors={colors} style={{ padding: '96px 0' }}>
      <W>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', background: 'rgba(45,212,191,0.1)', color: colors.gold, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
            {lang === 'pt' ? 'Automação Total' : 'Full Automation'}
          </span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, color: colors.white, marginBottom: 16 }}>
            {lang === 'pt' ? 'Automatize Setores Inteiros' : 'Automate Entire Departments'}
          </h2>
          <p className="reveal rv-d2" style={{ color: colors.textMuted, maxWidth: 640, margin: '0 auto', lineHeight: 1.8, fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)' }}>
            {lang === 'pt'
              ? 'Dezenas de funções que seus funcionários fazem manualmente podem ser automatizadas. Economize tempo, dinheiro e dores de cabeça.'
              : 'Dozens of functions your employees do manually can be automated. Save time, money and headaches.'}
          </p>
        </div>

        {/* Subtitle callout */}
        <div className="reveal rv-d3" style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ color: colors.textDim, fontSize: 14, fontStyle: 'italic', maxWidth: 500, margin: '0 auto' }}>
            {lang === 'pt'
              ? 'Clique em um setor para ver o que podemos automatizar →'
              : 'Click a department to see what we can automate →'}
          </p>
        </div>

        {/* Department cards grid */}
        <div id="sectors-grid" style={{ display: 'flex', gap: 16, overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: 8, WebkitOverflowScrolling: 'touch' }}>
          {departments.map((dept, i) => {
            const DeptIcon = dept.icon;
            const isExpanded = expanded === i;
            return (
              <div
                key={dept.name}
                className="reveal"
                onClick={() => setExpanded(isExpanded ? null : i)}
                style={{
                  padding: isExpanded ? 28 : 24,
                  borderRadius: 16,
                  background: colors.glassCard,
                  border: `1px solid ${isExpanded ? dept.color + '60' : colors.glassCardBorder}`,
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                  minWidth: isExpanded ? 340 : 200,
                  maxWidth: isExpanded ? 400 : 240,
                  flex: isExpanded ? '0 0 380px' : '1 1 200px',
                  scrollSnapAlign: 'start',
                  ...(isExpanded ? { boxShadow: `0 20px 60px ${dept.color}15, 0 0 40px ${dept.color}08` } : {}),
                }}
                onMouseEnter={e => {
                  if (!isExpanded) {
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                    e.currentTarget.style.borderColor = dept.color + '40';
                    e.currentTarget.style.boxShadow = `0 24px 48px ${colors.shadow}`;
                  }
                }}
                onMouseLeave={e => {
                  if (!isExpanded) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.borderColor = colors.glassCardBorder;
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {/* Icon + Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: isExpanded ? 20 : 16 }}>
                  <div style={{
                    width: isExpanded ? 44 : 40, height: isExpanded ? 44 : 40, borderRadius: 12,
                    background: dept.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s',
                  }}>
                    <DeptIcon size={isExpanded ? 22 : 20} style={{ color: dept.color }} />
                  </div>
                  <div>
                    <h3 style={{ color: colors.white, fontWeight: 600, fontSize: isExpanded ? 18 : 15, transition: 'all 0.3s' }}>{dept.name}</h3>
                    {!isExpanded && (
                      <span style={{ fontSize: 11, color: colors.textDim }}>
                        {dept.tasks.length} {lang === 'pt' ? 'automações' : 'automations'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded: task list */}
                {isExpanded && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {dept.tasks.map((task, j) => (
                      <div key={j} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px',
                        borderRadius: 10, background: colors.bgCard || colors.glassCard,
                        border: `1px solid ${colors.glassCardBorder}`,
                        transition: 'all 0.3s',
                      }}>
                        <CheckCircle2 size={16} style={{ color: dept.color, flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 13, color: colors.text, lineHeight: 1.5 }}>{task}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Collapsed: mini preview */}
                {!isExpanded && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {dept.tasks.slice(0, 3).map((task, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: dept.color + '60', flexShrink: 0 }} />
                        <span style={{ fontSize: 11, color: colors.textDim, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task}</span>
                      </div>
                    ))}
                    <span style={{ fontSize: 11, color: dept.color, fontWeight: 500, marginTop: 4 }}>
                      +{dept.tasks.length - 3} {lang === 'pt' ? 'mais' : 'more'}...
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="reveal rv-d4" style={{ textAlign: 'center', marginTop: 48 }}>
          <a href="#contato" className="btn-cta anim-pulse-glow" style={{ padding: '14px 36px', fontSize: '0.95rem' }}>
            {lang === 'pt' ? 'Quero automatizar meu negócio' : 'I want to automate my business'} <ArrowRight size={16} />
          </a>
        </div>

        <style>{`
          #sectors-grid::-webkit-scrollbar { height: 4px; }
          #sectors-grid::-webkit-scrollbar-track { background: transparent; }
          #sectors-grid::-webkit-scrollbar-thumb { background: rgba(45,212,191,0.2); border-radius: 4px; }
        `}</style>
      </W>
    </Section>
  );
}

/* ═══════════════ CASES CAROUSEL ═══════════════ */
function Cases({ lang, colors }: any) {
  const cases = lang === 'pt' ? [
    { title: 'Inteligência de Mercado', desc: 'Extração de 1.6M+ registros empresariais com dados de contato, sócios e situação fiscal.', tags: ['Dados', 'Prospecção', 'IA'], metric: '1.6M+ empresas', img: IMG.caseData },
    { title: 'Pet Shop Premium', desc: 'Site institucional com galeria, agendamento online e integração WhatsApp para clínica veterinária.', tags: ['Site', 'Pet Shop', 'Design'], metric: '+340% agendamentos', img: '/demos/pet-shop/banner-petshop.jpg' },
    { title: 'Automação de Escritório', desc: 'Prospecção automatizada, atendimento WhatsApp com IA e painel de acompanhamento em tempo real.', tags: ['Automação', 'WhatsApp', 'IA'], metric: '70% menos trabalho', img: IMG.caseAuto },
    { title: 'Restaurante & Delivery', desc: 'Cardápio digital interativo com pedidos via WhatsApp, galeria de pratos e sistema de reservas.', tags: ['Restaurante', 'Delivery', 'UX'], metric: '+85% pedidos online', img: '/demos/restaurante/dish-1.jpg' },
    { title: 'Landing Page de Conversão', desc: 'Páginas otimizadas para captura de leads com formulários inteligentes e A/B testing.', tags: ['Landing Page', 'SEO', 'Conversão'], metric: '12% taxa conversão', img: IMG.caseWeb },
    { title: 'Clínica Veterinária', desc: 'Plataforma completa com prontuário digital, galeria de pacientes e agendamento automatizado.', tags: ['Saúde', 'Automação', 'Dashboard'], metric: '+200 consultas/mês', img: '/demos/pet-shop/banner-vet.jpg' },
    { title: 'Dashboard Financeiro', desc: 'Painel interativo com KPIs em tempo real, alertas automáticos e relatórios exportáveis.', tags: ['BI', 'Dashboard', 'Dados'], metric: '5h economizadas/dia', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&auto=format&fit=crop&fm=webp' },
    { title: 'Chatbot Inteligente', desc: 'Assistente virtual com IA que qualifica leads, agenda reuniões e resolve dúvidas 24/7.', tags: ['Chatbot', 'IA', 'WhatsApp'], metric: '24/7 atendimento', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80&auto=format&fit=crop&fm=webp' },
  ] : [
    { title: 'Market Intelligence', desc: 'Extraction of 1.6M+ business records with contact data, partners and fiscal status.', tags: ['Data', 'Prospecting', 'AI'], metric: '1.6M+ companies', img: IMG.caseData },
    { title: 'Premium Pet Shop', desc: 'Institutional website with gallery, online booking and WhatsApp integration for vet clinic.', tags: ['Website', 'Pet Shop', 'Design'], metric: '+340% bookings', img: '/demos/pet-shop/banner-petshop.jpg' },
    { title: 'Office Automation', desc: 'Automated prospecting, AI WhatsApp support and real-time monitoring dashboard.', tags: ['Automation', 'WhatsApp', 'AI'], metric: '70% less manual work', img: IMG.caseAuto },
    { title: 'Restaurant & Delivery', desc: 'Interactive digital menu with WhatsApp orders, dish gallery and reservation system.', tags: ['Restaurant', 'Delivery', 'UX'], metric: '+85% online orders', img: '/demos/restaurante/dish-1.jpg' },
    { title: 'Conversion Landing Page', desc: 'Pages optimized for lead capture with smart forms and A/B testing.', tags: ['Landing Page', 'SEO', 'Conversion'], metric: '12% conversion rate', img: IMG.caseWeb },
    { title: 'Veterinary Clinic', desc: 'Full platform with digital records, patient gallery and automated scheduling.', tags: ['Health', 'Automation', 'Dashboard'], metric: '+200 visits/month', img: '/demos/pet-shop/banner-vet.jpg' },
    { title: 'Financial Dashboard', desc: 'Interactive panel with real-time KPIs, automatic alerts and exportable reports.', tags: ['BI', 'Dashboard', 'Data'], metric: '5h saved/day', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&auto=format&fit=crop&fm=webp' },
    { title: 'Smart Chatbot', desc: 'AI virtual assistant that qualifies leads, schedules meetings and resolves questions 24/7.', tags: ['Chatbot', 'AI', 'WhatsApp'], metric: '24/7 support', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80&auto=format&fit=crop&fm=webp' },
  ];

  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [noTransition, setNoTransition] = useState(false);
  const dragStart = useRef(0);
  const dragOffset = useRef(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const cardWidth = 340;
  const gap = 20;
  const step = cardWidth + gap;
  const total = cases.length;

  // Duplicate items for infinite loop: [...cases, ...cases, ...cases]
  const loopCases = [...cases, ...cases, ...cases];
  const startOffset = total; // start at the middle copy

  // Initialize at middle copy
  useEffect(() => {
    setNoTransition(true);
    setCurrent(startOffset);
    requestAnimationFrame(() => setNoTransition(false));
  }, []);

  // When animation ends on a clone region, silently snap back to middle copy
  const handleTransitionEnd = useCallback(() => {
    if (current >= total * 2) {
      setNoTransition(true);
      setCurrent(current - total);
      requestAnimationFrame(() => setNoTransition(false));
    } else if (current < total) {
      setNoTransition(true);
      setCurrent(current + total);
      requestAnimationFrame(() => setNoTransition(false));
    }
  }, [current, total]);

  const slideTo = useCallback((idx: number) => {
    setCurrent(idx);
  }, []);

  // Auto-play
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      setCurrent(prev => prev + 1);
    }, 4000);
    return () => clearInterval(autoplayRef.current);
  }, []);

  const pauseAutoplay = () => { clearInterval(autoplayRef.current); };
  const resumeAutoplay = () => {
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setCurrent(prev => prev + 1);
    }, 4000);
  };

  // Drag handlers
  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = e.clientX;
    dragOffset.current = 0;
    pauseAutoplay();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    dragOffset.current = e.clientX - dragStart.current;
  };
  const onPointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset.current < -60) slideTo(current + 1);
    else if (dragOffset.current > 60) slideTo(current - 1);
    resumeAutoplay();
  };

  // Which dot is active (map back to real index)
  const activeDot = ((current % total) + total) % total;

  return (
    <Section id="cases" colors={colors} style={{ padding: '96px 0' }}>
      <W>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', background: 'rgba(37,99,235,0.1)', color: colors.brandLight, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>Portfolio</span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, color: colors.white }}>Cases</h2>
        </div>

        {/* Carousel container */}
        <div className="reveal" style={{ position: 'relative' }}
          onMouseEnter={pauseAutoplay} onMouseLeave={resumeAutoplay}>

          {/* Arrow buttons */}
          <button onClick={() => slideTo(current - 1)} aria-label="Previous"
            style={{
              position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
              width: 44, height: 44, borderRadius: '50%', border: `1px solid ${colors.glassCardBorder}`,
              background: colors.glassCard, backdropFilter: 'blur(8px)', color: colors.white,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              transition: 'all 0.3s',
            }}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => slideTo(current + 1)} aria-label="Next"
            style={{
              position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
              width: 44, height: 44, borderRadius: '50%', border: `1px solid ${colors.glassCardBorder}`,
              background: colors.glassCard, backdropFilter: 'blur(8px)', color: colors.white,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              transition: 'all 0.3s',
            }}>
            <ChevronRight size={20} />
          </button>

          {/* Track */}
          <div style={{ overflow: 'hidden', borderRadius: 16, cursor: isDragging ? 'grabbing' : 'grab' }}
            onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
            <div ref={trackRef} onTransitionEnd={handleTransitionEnd} style={{
              display: 'flex', gap, transition: isDragging || noTransition ? 'none' : 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
              transform: `translateX(-${current * step}px)`,
              touchAction: 'pan-y',
            }}>
              {loopCases.map((c, i) => (
                <div key={`${c.title}-${i}`} style={{
                  minWidth: cardWidth, maxWidth: cardWidth, display: 'flex', flexDirection: 'column',
                  borderRadius: 16, background: colors.glassCard, border: `1px solid ${colors.glassCardBorder}`,
                  transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)', overflow: 'hidden', userSelect: 'none',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'; e.currentTarget.style.borderColor = colors.borderHover; e.currentTarget.style.boxShadow = `0 24px 48px ${colors.shadow}`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.borderColor = colors.glassCardBorder; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                    <img src={c.img} alt={c.title} loading="lazy" draggable={false} width={600} height={400}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent 60%)' }} />
                    <span style={{ position: 'absolute', bottom: 12, left: 16, padding: '4px 12px', borderRadius: 6, background: 'rgba(56,189,248,0.2)', backdropFilter: 'blur(8px)', color: colors.gold, fontSize: 12, fontWeight: 600 }}>{c.metric}</span>
                  </div>
                  <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.white, marginBottom: 10 }}>{c.title}</h3>
                    <p style={{ color: colors.textMuted, fontSize: 13, lineHeight: 1.7, marginBottom: 16, flex: 1 }}>{c.desc}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {c.tags.map((tag) => (
                        <span key={tag} style={{ padding: '3px 10px', borderRadius: 9999, background: colors.tagBg, border: `1px solid ${colors.tagBorder}`, fontSize: 11, color: colors.textDim, fontWeight: 500 }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
            {cases.map((_, i) => (
              <button key={i} onClick={() => slideTo(startOffset + i)} aria-label={`Case ${i + 1}`}
                style={{
                  width: activeDot === i ? 24 : 8, height: 8, borderRadius: 4, border: 'none',
                  background: activeDot === i ? colors.brand : colors.glassCardBorder,
                  transition: 'all 0.3s', cursor: 'pointer', padding: 0,
                }} />
            ))}
          </div>
        </div>
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
    window.open(`https://wa.me/5541988242456?text=${encodeURIComponent(greeting)}`, '_blank');
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
                { icon: Phone, text: '+55 (41) 98824-2456', href: 'https://wa.me/5541988242456' },
                { icon: Mail, text: 'contato@stauf.com.br', href: 'mailto:contato@stauf.com.br' },
                { icon: MapPin, text: 'Curitiba, PR — Brasil', href: undefined },
              ].map((item) => {
                const content = (<span style={{ display: 'flex', alignItems: 'center', gap: 12, color: colors.textMuted, fontSize: 14 }}><item.icon size={18} style={{ color: colors.brand }} /> {item.text}</span>);
                return item.href ? <a key={item.text} href={item.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{content}</a> : <div key={item.text}>{content}</div>;
              })}
            </div>
            <div className="reveal rv-d4" style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              {[{ icon: Instagram, href: 'https://instagram.com/stauf.dev', label: 'Instagram' }, { icon: Linkedin, href: 'https://linkedin.com/company/staufdev', label: 'LinkedIn' }, { icon: Github, href: '#', label: 'GitHub' }].map((s, i) => (
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
      <DemoStrip lang={lang} colors={colors} />
      <Services t={t} lang={lang} colors={colors} />
      <ImageDivider colors={colors} />
      <Metrics lang={lang} colors={colors} />
      <Process lang={lang} colors={colors} />
      <About t={t} lang={lang} colors={colors} />
      <SectorAutomation lang={lang} colors={colors} />
      <Cases lang={lang} colors={colors} />
      <CtaSection t={t} colors={colors} />
      <Contact lang={lang} colors={colors} />
      <Footer t={t} lang={lang} colors={colors} />
      </div>
      <CookieBanner colors={colors} />
      <ChatWidget />
    </div>
  );
}
