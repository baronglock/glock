import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';

/* ── Niche-specific FULL renderers (lazy loaded) ── */
const BarbeariaRenderer = lazy(() => import('./demo-sections/BarbeariaRenderer'));
const AcademiaRenderer = lazy(() => import('./demo-sections/AcademiaRenderer'));
const ClinicaEsteticaRenderer = lazy(() => import('./demo-sections/ClinicaEsteticaRenderer'));

/* ── Types ── */
interface ServiceItem { name: string; desc: string; icon: string; price?: string; time?: string; category?: string; popular?: boolean }
interface ReviewItem { name: string; text: string; stars: number; time?: string }
interface FeatureItem { label: string; value: string }
interface StaffItem { name: string; role: string; rating: number; reviews: number; available: boolean }
interface PlanItem { name: string; price: string; features: string[]; popular?: boolean }
interface ProductItem { name: string; price: string; img: string; popular?: boolean }
interface DesignTokens {
  heroStyle?: 'fullscreen' | 'split' | 'minimal';
  cardStyle?: 'glass' | 'solid' | 'bordered' | 'elevated';
  galleryLayout?: 'grid' | 'masonry' | 'featured';
  sectionDivider?: 'none' | 'line' | 'gradient' | 'diagonal';
  aboutLayout?: 'default' | 'reverse' | 'centered';
  effects?: ('glow' | 'grain' | 'neon' | 'gradient-text')[];
  heroDecoration?: 'none' | 'geometric' | 'circles' | 'lines' | 'dots';
  titleStyle?: 'underline' | 'accent' | 'gradient' | 'plain';
}
interface DemoData {
  slug: string; name: string; niche: string; tagline: string; city: string; phone: string;
  logo?: string;
  colors: { primary: string; secondary: string; bg: string; text: string; textMuted: string };
  hero: { title: string; subtitle: string; image: string };
  about: { text: string; image: string };
  services: ServiceItem[];
  gallery: string[];
  reviews: ReviewItem[];
  features: FeatureItem[];
  cta: { text: string; buttonText: string };
  faq?: { q: string; a: string }[];
  staff?: StaffItem[];
  products?: ProductItem[];
  plans?: PlanItem[];
  theme?: string;
  design?: DesignTokens;
  siblingDemo?: string;
  siblingLabel?: string;
}

/* ── Outline Icons ── */
const IC: Record<string, string> = {
  '✂️':'✂','🪒':'⌇','👑':'♛','🎨':'◎','💧':'◇','🍺':'◈','🎯':'◎','💇':'✂',
  '📱':'☎','📍':'⊙','⭐':'★','🍕':'◉','🏋️':'△','🐾':'◬','🏠':'⌂','👗':'◊',
};
function Ic({ e, c: color, s = 20 }: { e: string; c: string; s?: number }) {
  return <span style={{ fontSize: s, color, fontWeight: 300, lineHeight: 1 }}>{IC[e] || e}</span>;
}

/* ── Tiers ── */
const TIERS = {
  essencial: { name: 'Essencial', price: 'R$ 1.497', period: 'setup + R$ 149/mês', level: 1 },
  profissional: { name: 'Profissional', price: 'R$ 2.997', period: 'setup + R$ 249/mês', level: 2 },
  premium: { name: 'Premium', price: 'Sob consulta', period: 'projeto personalizado', level: 3 },
};

/* ── Reveal (scroll animation) ── */
function R({ children, d = 0, show = true }: { children: React.ReactNode; d?: number; show?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    if (!show) { setV(false); return; }
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: 0.08 });
    o.observe(el); return () => o.disconnect();
  }, [show]);
  return <div ref={ref} style={{ opacity: v && show ? 1 : 0, transform: v && show ? 'translateY(0)' : 'translateY(24px)', transition: `all 0.6s cubic-bezier(0.4,0,0.2,1) ${d}ms`, maxHeight: show ? 9999 : 0, overflow: show ? 'visible' : 'hidden' }}>{children}</div>;
}

/* ── Theme system per niche ── */
interface ThemeStyle {
  cardRadius: number;
  btnRadius: number;
  inputRadius: number;
  sectionRadius: number;
  pattern: string;
  fontStyle: string;
  heroAlign: 'left' | 'center';
  heroWeight: number;
  cardBg: (p: string) => React.CSSProperties;
  sectionBg: (p: string) => string;
  accent: (p: string) => string;
  texture: (p: string) => React.CSSProperties;
}

const THEMES: Record<string, ThemeStyle> = {
  clean: {
    cardRadius: 16, btnRadius: 12, inputRadius: 8, sectionRadius: 0,
    pattern: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='white' stroke-width='0.5' opacity='0.04'/%3E%3C/svg%3E")`,
    fontStyle: "'Inter', system-ui, sans-serif",
    heroAlign: 'left', heroWeight: 800,
    cardBg: (p) => ({ background: `${p}0a`, backdropFilter: 'blur(12px)', border: `1px solid ${p}14` }),
    sectionBg: (p) => `${p}03`,
    accent: (p) => `${p}15`,
    texture: () => ({}),
  },
  industrial: {
    cardRadius: 2, btnRadius: 2, inputRadius: 2, sectionRadius: 0,
    pattern: `url("data:image/svg+xml,%3Csvg width='4' height='4' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' fill='white' opacity='0.03'/%3E%3C/svg%3E")`,
    fontStyle: "'Inter', 'Impact', system-ui, sans-serif",
    heroAlign: 'left', heroWeight: 900,
    cardBg: (p) => ({ background: `linear-gradient(145deg, rgba(30,30,30,0.9), rgba(15,15,15,0.95))`, border: `1px solid ${p}30`, borderTop: `2px solid ${p}50` }),
    sectionBg: (p) => `${p}05`,
    accent: (p) => `${p}20`,
    texture: (p) => ({
      backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 2px, ${p}04 2px, ${p}04 4px),
        repeating-linear-gradient(90deg, transparent, transparent 2px, ${p}03 2px, ${p}03 4px)
      `,
    }),
  },
  elegant: {
    cardRadius: 20, btnRadius: 24, inputRadius: 12, sectionRadius: 0,
    pattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1' fill='white' opacity='0.03'/%3E%3C/svg%3E")`,
    fontStyle: "'Inter', 'Georgia', serif",
    heroAlign: 'center', heroWeight: 300,
    cardBg: (p) => ({ background: `${p}06`, backdropFilter: 'blur(20px)', border: `1px solid ${p}10`, boxShadow: `0 4px 24px ${p}08` }),
    sectionBg: (p) => `${p}02`,
    accent: (p) => `${p}10`,
    texture: () => ({}),
  },
  energetic: {
    cardRadius: 8, btnRadius: 6, inputRadius: 4, sectionRadius: 0,
    pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='20' x2='20' y2='0' stroke='white' stroke-width='0.3' opacity='0.05'/%3E%3C/svg%3E")`,
    fontStyle: "'Inter', system-ui, sans-serif",
    heroAlign: 'center', heroWeight: 900,
    cardBg: (p) => ({ background: `linear-gradient(135deg, ${p}08, ${p}03)`, border: `1px solid ${p}18` }),
    sectionBg: (p) => `${p}04`,
    accent: (p) => `${p}18`,
    texture: (p) => ({
      backgroundImage: `linear-gradient(180deg, transparent 0%, ${p}05 100%)`,
    }),
  },
};

const NICHE_THEME: Record<string, string> = {
  barbearia: 'clean',
  academia: 'industrial',
  restaurante: 'elegant',
  clinica: 'clean',
  pet_shop: 'energetic',
  loja: 'energetic',
  escritorio: 'clean',
  imobiliaria: 'elegant',
  salao: 'elegant',
};

/* ── Default design tokens per niche — overridable via JSON design field ── */
const NICHE_DESIGN: Record<string, DesignTokens> = {
  barbearia: {
    heroStyle: 'fullscreen', cardStyle: 'glass', galleryLayout: 'masonry',
    sectionDivider: 'line', aboutLayout: 'default', effects: ['glow'],
    heroDecoration: 'geometric', titleStyle: 'underline',
  },
  academia: {
    heroStyle: 'split', cardStyle: 'solid', galleryLayout: 'featured',
    sectionDivider: 'diagonal', aboutLayout: 'reverse', effects: ['grain', 'neon'],
    heroDecoration: 'lines', titleStyle: 'accent',
  },
  restaurante: {
    heroStyle: 'minimal', cardStyle: 'elevated', galleryLayout: 'masonry',
    sectionDivider: 'gradient', aboutLayout: 'centered', effects: ['glow'],
    heroDecoration: 'dots', titleStyle: 'gradient',
  },
  clinica: {
    heroStyle: 'split', cardStyle: 'bordered', galleryLayout: 'grid',
    sectionDivider: 'line', aboutLayout: 'reverse', effects: [],
    heroDecoration: 'circles', titleStyle: 'plain',
  },
  pet_shop: {
    heroStyle: 'fullscreen', cardStyle: 'elevated', galleryLayout: 'featured',
    sectionDivider: 'gradient', aboutLayout: 'default', effects: ['glow'],
    heroDecoration: 'dots', titleStyle: 'accent',
  },
  loja: {
    heroStyle: 'minimal', cardStyle: 'bordered', galleryLayout: 'grid',
    sectionDivider: 'line', aboutLayout: 'reverse', effects: ['gradient-text'],
    heroDecoration: 'geometric', titleStyle: 'underline',
  },
  salao: {
    heroStyle: 'minimal', cardStyle: 'glass', galleryLayout: 'masonry',
    sectionDivider: 'gradient', aboutLayout: 'centered', effects: ['glow'],
    heroDecoration: 'circles', titleStyle: 'gradient',
  },
  imobiliaria: {
    heroStyle: 'split', cardStyle: 'elevated', galleryLayout: 'featured',
    sectionDivider: 'gradient', aboutLayout: 'default', effects: ['gradient-text'],
    heroDecoration: 'lines', titleStyle: 'accent',
  },
  escritorio: {
    heroStyle: 'minimal', cardStyle: 'bordered', galleryLayout: 'grid',
    sectionDivider: 'line', aboutLayout: 'reverse', effects: [],
    heroDecoration: 'none', titleStyle: 'plain',
  },
};

/* ── Light/Dark background detection ── */
function isLightBg(hex: string): boolean {
  const h = hex.replace('#', '').slice(0, 6);
  if (h.length < 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

const glass = (primary: string, hover = false, bg?: string) => {
  const light = bg ? isLightBg(bg) : false;
  if (light) {
    return {
      background: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(12px)',
      border: `1px solid rgba(0,0,0,${hover ? 0.12 : 0.06})`,
      boxShadow: `0 2px 8px rgba(0,0,0,0.04)`,
    };
  }
  return {
    background: `${primary}0a`,
    backdropFilter: 'blur(12px)',
    border: `1px solid ${primary}${hover ? '40' : '14'}`,
  };
};

/* ══════════════════ MAIN ══════════════════ */
export default function DemoPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<DemoData | null>(null);
  const [err, setErr] = useState('');
  const [tier, setTier] = useState<'essencial' | 'profissional' | 'premium'>('premium');
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [activeCat, setActiveCat] = useState('Todos');
  const [bookingService, setBookingService] = useState<ServiceItem | null>(null);
  const [bookingStaff, setBookingStaff] = useState<StaffItem | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingDone, setBookingDone] = useState(false);
  const [loyaltyPoints] = useState(1250);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [cart, setCart] = useState<{ name: string; price: string; type: 'produto' | 'servico'; detail?: string }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    fetch(`/demos/data/${slug}.json`)
      .then(r => { if (!r.ok) throw new Error('x'); return r.json(); })
      .then(setData).catch(() => setErr('Demo não encontrada'));
  }, [slug]);

  useEffect(() => { if (data) { const t = setTimeout(() => setHeroVisible(true), 100); return () => clearTimeout(t); } }, [data]);

  // Navbar scroll opacity
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (err) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: '#fff', fontFamily: "'Inter',sans-serif" }}><div style={{ textAlign: 'center' }}><h1 style={{ fontSize: 48, fontWeight: 200, marginBottom: 16 }}>404</h1><p style={{ color: '#888', marginBottom: 32 }}>{err}</p><Link to="/" style={{ color: '#2dd4bf', textDecoration: 'none' }}>← Stauf.</Link></div></div>;
  if (!data) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}><div style={{ width: 40, height: 40, border: '3px solid #333', borderTopColor: '#2dd4bf', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  /* ── Delegate to niche-specific FULL renderer if available ── */
  if (data.niche === 'barbearia') return <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a0f' }} />}><BarbeariaRenderer data={data} /></Suspense>;
  if (data.niche === 'academia') return <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a0a' }} />}><AcademiaRenderer data={data} /></Suspense>;
  if (data.niche === 'clinica_estetica') return <Suspense fallback={<div style={{ minHeight: '100vh', background: '#faf7f5' }} />}><ClinicaEsteticaRenderer data={data} /></Suspense>;

  const c = data.colors;
  const lv = TIERS[tier].level;
  const tp = TIERS[tier];
  const themeName = data.theme || NICHE_THEME[data.niche] || 'clean';
  const th = THEMES[themeName] || THEMES.clean;
  const font = th.fontStyle;

  // Design tokens — JSON overrides niche defaults
  const nicheDefaults = NICHE_DESIGN[data.niche] || NICHE_DESIGN.barbearia;
  const ds: Required<DesignTokens> = {
    heroStyle: data.design?.heroStyle || nicheDefaults.heroStyle || 'fullscreen',
    cardStyle: data.design?.cardStyle || nicheDefaults.cardStyle || 'glass',
    galleryLayout: data.design?.galleryLayout || nicheDefaults.galleryLayout || 'grid',
    sectionDivider: data.design?.sectionDivider || nicheDefaults.sectionDivider || 'none',
    aboutLayout: data.design?.aboutLayout || nicheDefaults.aboutLayout || 'default',
    effects: data.design?.effects || nicheDefaults.effects || [],
    heroDecoration: data.design?.heroDecoration || nicheDefaults.heroDecoration || 'none',
    titleStyle: data.design?.titleStyle || nicheDefaults.titleStyle || 'plain',
  };
  const hasEffect = (e: string) => ds.effects.includes(e as any);

  const categories = ['Todos', ...new Set(data.services.map(s => s.category || 'Geral'))];
  const filteredServices = activeCat === 'Todos' ? data.services : data.services.filter(s => (s.category || 'Geral') === activeCat);
  const displayServices = lv === 1 ? filteredServices.slice(0, 4) : lv === 2 ? filteredServices.slice(0, 6) : filteredServices;

  const staff: StaffItem[] = data.staff || [
    { name: 'Ana Silva', role: 'Especialista', rating: 4.9, reviews: 234, available: true },
    { name: 'Carlos Lima', role: 'Sênior', rating: 4.8, reviews: 189, available: true },
    { name: 'Marina Costa', role: 'Premium', rating: 4.9, reviews: 312, available: false },
  ];

  const plans: PlanItem[] = data.plans || [
    { name: 'Básico', price: 'R$ 140/mês', features: ['2 atendimentos/mês', 'Agendamento online', 'Suporte WhatsApp'] },
    { name: 'Pro', price: 'R$ 260/mês', features: ['4 atendimentos/mês', 'Atendimento prioritário', 'Descontos em produtos', 'Bebidas inclusas'], popular: true },
    { name: 'VIP', price: 'R$ 450/mês', features: ['Atendimentos ilimitados', 'Todos os benefícios', 'Prioridade total', 'Tratamentos inclusos', 'Área VIP exclusiva'] },
  ];

  const times = ['09:00', '09:45', '10:30', '11:15', '14:00', '14:45', '15:30', '16:15', '17:00'];

  const handleBook = () => {
    if (bookingService && bookingStaff && bookingDate && bookingTime) {
      setCart(prev => [...prev, {
        name: bookingService.name,
        price: bookingService.price || 'Sob consulta',
        type: 'servico',
        detail: `${bookingStaff.name} · ${bookingDate} às ${bookingTime}`,
      }]);
      setCartOpen(true);
    }
    setBookingDone(true);
    setTimeout(() => { setBookingDone(false); setBookingService(null); setBookingStaff(null); setBookingDate(''); setBookingTime(''); }, 2500);
  };

  const fallbackImg = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=85&auto=format&fit=crop';

  const lightBg = isLightBg(c.bg);

  const SectionLabel = ({ text, center }: { text: string; center?: boolean }) => (
    <div style={{ textAlign: center || th.heroAlign === 'center' ? 'center' : undefined }}>
      <span style={{ display: 'inline-block', padding: '5px 14px', background: lightBg ? `${c.primary}0c` : `${c.primary}10`, color: c.primary, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', marginBottom: 14, borderRadius: 20, textTransform: 'uppercase', border: `1px solid ${lightBg ? `${c.primary}15` : `${c.primary}15`}` }}>{text}</span>
    </div>
  );
  const SectionTitle = ({ text, center }: { text: string; center?: boolean }) => {
    const align = center || th.heroAlign === 'center' ? 'center' : undefined;
    const base: React.CSSProperties = { fontSize: 'clamp(1.7rem,4vw,2.4rem)', fontWeight: 300, color: c.text, letterSpacing: '-0.02em', textAlign: align };
    if (ds.titleStyle === 'gradient') return <h2 style={{ ...base, backgroundImage: `linear-gradient(135deg, ${c.primary}, ${c.text})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 600 }}>{text}</h2>;
    if (ds.titleStyle === 'accent') return <div style={{ textAlign: align }}><h2 style={{ ...base, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{text}</h2><div style={{ width: 60, height: 4, background: c.primary, borderRadius: 2, margin: align === 'center' ? '12px auto 0' : '12px 0 0', boxShadow: `0 0 12px ${c.primary}60` }} /></div>;
    if (ds.titleStyle === 'underline') return <div style={{ textAlign: align }}><h2 style={base}>{text}</h2><div style={{ width: 40, height: 1, background: `${c.primary}50`, margin: align === 'center' ? '10px auto 0' : '10px 0 0' }} /></div>;
    return <h2 style={base}>{text}</h2>;
  };

  /* ── Section Divider ── */
  const Divider = () => {
    if (ds.sectionDivider === 'none') return null;
    if (ds.sectionDivider === 'line') return <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}><div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${c.primary}20, transparent)` }} /></div>;
    if (ds.sectionDivider === 'gradient') return <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${c.primary}40, ${c.primary}, ${c.primary}40, transparent)` }} />;
    if (ds.sectionDivider === 'diagonal') return <div style={{ height: 60, background: `${c.primary}05`, clipPath: 'polygon(0 0, 100% 100%, 100% 100%, 0 100%)', marginTop: -30 }} />;
    return null;
  };

  /* ── Hero Decoration SVG overlays ── */
  const HeroDecoration = () => {
    if (ds.heroDecoration === 'none') return null;
    if (ds.heroDecoration === 'geometric') return (
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: '15%', right: '8%', width: 120, height: 120, border: `1px solid ${c.primary}15`, transform: 'rotate(45deg)' }} />
        <div style={{ position: 'absolute', top: '25%', right: '12%', width: 80, height: 80, border: `1px solid ${c.primary}10`, transform: 'rotate(45deg)' }} />
        <div style={{ position: 'absolute', bottom: '20%', left: '5%', width: 150, height: 150, border: `1px solid ${c.primary}08`, borderRadius: '50%' }} />
      </div>
    );
    if (ds.heroDecoration === 'circles') return (
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${c.primary}08, transparent 70%)` }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '8%', width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle, ${c.primary}06, transparent 70%)` }} />
        <div style={{ position: 'absolute', top: '40%', left: '50%', width: 300, height: 300, borderRadius: '50%', border: `1px solid ${c.primary}06`, transform: 'translate(-50%, -50%)' }} />
      </div>
    );
    if (ds.heroDecoration === 'lines') return (
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
        {[15, 35, 55, 75, 95].map(p => (
          <div key={p} style={{ position: 'absolute', top: 0, bottom: 0, left: `${p}%`, width: 1, background: `linear-gradient(180deg, transparent, ${c.primary}08, transparent)` }} />
        ))}
        {[20, 50, 80].map(p => (
          <div key={p} style={{ position: 'absolute', left: 0, right: 0, top: `${p}%`, height: 1, background: `linear-gradient(90deg, transparent, ${c.primary}06, transparent)` }} />
        ))}
      </div>
    );
    if (ds.heroDecoration === 'dots') return (
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1, backgroundImage: `radial-gradient(${c.primary}0a 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
    );
    return null;
  };

  /* ── Grain overlay effect ── */
  const GrainOverlay = hasEffect('grain') ? (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, opacity: 0.035, mixBlendMode: 'overlay', backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }} />
  ) : null;

  return (
    <div style={{ background: c.bg, color: c.text, fontFamily: font, minHeight: '100vh', paddingBottom: 56, ...th.texture(c.primary) }}>
      {/* Theme pattern overlay */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: th.pattern, backgroundRepeat: 'repeat', pointerEvents: 'none', zIndex: 0 }} />
      {/* Grain effect */}
      {GrainOverlay}
      {/* Neon ambient glow */}
      {hasEffect('neon') && <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: '40vh', background: `radial-gradient(ellipse, ${c.primary}12 0%, transparent 70%)`, pointerEvents: 'none', zIndex: 0, filter: 'blur(60px)' }} />}

      {/* ── Tier Switcher (pill glass) ── */}
      <div style={{ position: 'fixed', top: navScrolled ? 58 : 80, left: '50%', transform: 'translateX(-50%)', zIndex: 101, display: 'flex', gap: 2, padding: 4, ...glass(c.primary, false, c.bg), background: lightBg ? 'rgba(255,255,255,0.9)' : `${c.bg}e0`, borderRadius: th.cardRadius, boxShadow: lightBg ? '0 4px 24px rgba(0,0,0,0.08)' : `0 8px 32px ${c.bg}90`, transition: 'top 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
        {(Object.entries(TIERS) as [string, typeof TIERS['essencial']][]).map(([key, val]) => (
          <button key={key} onClick={() => { setTier(key as typeof tier); setActiveCat('Todos'); }} style={{ padding: '7px 20px', fontSize: 11, fontWeight: tier === key ? 700 : 500, background: tier === key ? c.primary : 'transparent', color: tier === key ? c.bg : c.textMuted, border: 'none', borderRadius: 12, cursor: 'pointer', transition: 'all 0.3s', boxShadow: tier === key ? `0 2px 12px ${c.primary}40` : 'none' }}>{val.name}</button>
        ))}
      </div>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: navScrolled ? '10px 32px' : '16px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: navScrolled
          ? (lightBg ? 'rgba(255,255,255,0.92)' : `${c.bg}f0`)
          : (lightBg ? 'rgba(255,255,255,0.3)' : `${c.bg}40`),
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: navScrolled
          ? `1px solid ${lightBg ? 'rgba(0,0,0,0.06)' : `${c.primary}12`}`
          : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            fontSize: 18, fontWeight: 300, color: c.primary, letterSpacing: '0.15em',
            fontFamily: "'Georgia', 'Times New Roman', serif", textTransform: 'uppercase',
          }}>{data.name}</span>
        </div>

        <div className="demo-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {['Sobre', 'Serviços', ...(lv >= 2 ? ['Equipe', 'Avaliações'] : []), ...(lv >= 3 ? ['Planos', 'Loja'] : []), 'Contato'].map(i => (
            <a key={i} href={`#${i.toLowerCase()}`} style={{
              color: lightBg ? 'rgba(0,0,0,0.45)' : c.textMuted,
              textDecoration: 'none', transition: 'color 0.3s',
              fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' as const,
            }}
              onMouseEnter={e => e.currentTarget.style.color = c.primary}
              onMouseLeave={e => e.currentTarget.style.color = lightBg ? 'rgba(0,0,0,0.45)' : c.textMuted}>{i}</a>
          ))}
          {data.siblingDemo && (
            <div style={{
              display: 'inline-flex', gap: 2, padding: 3,
              background: lightBg ? 'rgba(0,0,0,0.05)' : `${c.primary}0c`,
              borderRadius: 20, border: `1px solid ${lightBg ? 'rgba(0,0,0,0.06)' : `${c.primary}15`}`,
            }}>
              <span style={{
                padding: '5px 16px', fontSize: 11, fontWeight: 700, borderRadius: 16,
                background: c.primary, color: c.bg, letterSpacing: '0.04em',
              }}>{data.niche === 'barbearia' ? 'Barbearia' : 'Salão'}</span>
              <Link to={`/demo/${data.siblingDemo}`} style={{
                padding: '5px 16px', fontSize: 11, fontWeight: 600, borderRadius: 16,
                background: 'transparent', color: lightBg ? 'rgba(0,0,0,0.4)' : c.textMuted,
                textDecoration: 'none', transition: 'all 0.3s', letterSpacing: '0.04em',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = `${c.primary}15`; e.currentTarget.style.color = c.primary; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = lightBg ? 'rgba(0,0,0,0.4)' : c.textMuted; }}>
                {data.niche === 'barbearia' ? 'Salão' : 'Barbearia'}
              </Link>
            </div>
          )}
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="demo-hamburger" style={{
          display: 'none', background: 'none', border: 'none',
          color: lightBg ? 'rgba(0,0,0,0.6)' : c.text,
          fontSize: 24, cursor: 'pointer', padding: 4,
        }}>{menuOpen ? '✕' : '☰'}</button>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99,
          background: lightBg ? 'rgba(255,255,255,0.97)' : `${c.bg}f8`,
          backdropFilter: 'blur(24px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32,
        }}>
          {['Sobre', 'Serviços', ...(lv >= 2 ? ['Equipe', 'Avaliações'] : []), ...(lv >= 3 ? ['Planos', 'Loja'] : []), 'Contato'].map(i => (
            <a key={i} href={`#${i.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{
              color: lightBg ? 'rgba(0,0,0,0.6)' : c.textMuted,
              textDecoration: 'none', fontSize: 18, fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase' as const,
              transition: 'color 0.3s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = c.primary}
              onMouseLeave={e => e.currentTarget.style.color = lightBg ? 'rgba(0,0,0,0.6)' : c.textMuted}>{i}</a>
          ))}
          {data.siblingDemo && (
            <div style={{
              display: 'inline-flex', gap: 2, padding: 4, marginTop: 8,
              background: lightBg ? 'rgba(0,0,0,0.05)' : `${c.primary}0c`,
              borderRadius: 24, border: `1px solid ${lightBg ? 'rgba(0,0,0,0.06)' : `${c.primary}15`}`,
            }}>
              <span style={{
                padding: '8px 24px', fontSize: 13, fontWeight: 700, borderRadius: 20,
                background: c.primary, color: c.bg,
              }}>{data.niche === 'barbearia' ? 'Barbearia' : 'Salão'}</span>
              <Link to={`/demo/${data.siblingDemo}`} onClick={() => setMenuOpen(false)} style={{
                padding: '8px 24px', fontSize: 13, fontWeight: 600, borderRadius: 20,
                background: 'transparent', color: lightBg ? 'rgba(0,0,0,0.4)' : c.textMuted,
                textDecoration: 'none', transition: 'all 0.3s',
              }}>
                {data.niche === 'barbearia' ? 'Salão' : 'Barbearia'}
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ══ HERO ══ */}
      {ds.heroStyle === 'split' ? (
        /* ── SPLIT HERO — image right, content left ── */
        <section style={{ position: 'relative', minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }} className="demo-hero-split">
          <HeroDecoration />
          {/* Left — content */}
          <div className="demo-hero-content" style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '160px 56px 120px 56px', position: 'relative', zIndex: 2,
            opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateX(0)' : 'translateX(-32px)',
            transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)',
          }}>
            {/* Logo */}
            {data.logo && data.logo.endsWith('.svg') ? (
              <img src={data.logo} alt={data.name} style={{ height: 80, objectFit: 'contain', marginBottom: 32, alignSelf: 'flex-start' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            ) : (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 48, fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 400, fontStyle: 'italic', color: c.primary, lineHeight: 1, letterSpacing: '-0.04em' }}>{data.name.split(' ')[0].substring(0, 2).toUpperCase()}</div>
                <div style={{ width: 60, height: 1, background: `${c.primary}40`, margin: '8px 0' }} />
              </div>
            )}
            {/* Sibling toggle */}
            {data.siblingDemo && (
              <div style={{ display: 'inline-flex', gap: 4, padding: 4, background: `${c.primary}0c`, borderRadius: 28, marginBottom: 20, alignSelf: 'flex-start', border: `1px solid ${c.primary}12` }}>
                <span style={{ padding: '6px 20px', background: c.primary, color: c.bg, borderRadius: 22, fontSize: 12, fontWeight: 700 }}>{data.niche === 'barbearia' ? 'Barbearia' : 'Salão'}</span>
                <Link to={`/demo/${data.siblingDemo}`} style={{ padding: '6px 20px', color: c.textMuted, borderRadius: 22, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>{data.niche === 'barbearia' ? 'Salão Feminino' : 'Barbearia'}</Link>
              </div>
            )}
            {/* Tagline */}
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: c.primary, textTransform: 'uppercase', marginBottom: 20 }}>{data.tagline}</span>
            {/* Title */}
            <h1 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: th.heroWeight,
              lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.03em',
              textTransform: themeName === 'industrial' ? 'uppercase' as const : 'none' as const,
            }}>
              {data.hero.title.split(' ').map((w, i) => (
                <span key={i} style={{ color: i === 0 ? c.primary : c.text, ...(i > 0 && hasEffect('gradient-text') ? { backgroundImage: `linear-gradient(135deg, ${c.text}, ${c.textMuted})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : {}) }}>{w} </span>
              ))}
            </h1>
            <p style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', color: c.textMuted, lineHeight: 1.8, maxWidth: 480, marginBottom: 36 }}>{data.hero.subtitle}</p>
            {/* CTA */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button style={{ padding: '16px 38px', background: c.primary, color: c.bg, border: 'none', borderRadius: th.btnRadius, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 32px ${c.primary}40`, transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 14px 44px ${c.primary}55`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 8px 32px ${c.primary}40`; e.currentTarget.style.transform = 'translateY(0)'; }}>{data.cta.buttonText}</button>
              <button style={{ padding: '16px 38px', ...glass(c.primary, false, c.bg), color: c.primary, borderRadius: th.btnRadius, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }}>Saiba mais ↓</button>
            </div>
            {/* Tier badge */}
            <div style={{ marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', ...glass(c.primary, false, c.bg), borderRadius: 22, alignSelf: 'flex-start' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.primary, boxShadow: `0 0 10px ${c.primary}60` }} />
              <span style={{ fontSize: 11, color: c.textMuted, fontWeight: 500 }}>Plano {tp.name} — {tp.price}</span>
            </div>
          </div>
          {/* Right — image */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <img src={data.hero.image} alt="" loading="eager" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 14s ease', transform: heroVisible ? 'scale(1.05)' : 'scale(1.15)' }}
              onError={e => { (e.target as HTMLImageElement).src = fallbackImg; }} />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${c.bg} 0%, ${c.bg}80 8%, transparent 40%)` }} />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${c.bg}40 0%, transparent 30%, transparent 70%, ${c.bg}60 100%)` }} />
            {hasEffect('neon') && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${c.primary}, ${c.primary}60, transparent)`, boxShadow: `0 0 20px ${c.primary}60` }} />}
          </div>
        </section>
      ) : ds.heroStyle === 'minimal' ? (
        /* ── MINIMAL HERO — no background image, typography-focused ── */
        <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <HeroDecoration />
          {/* Subtle gradient bg instead of image */}
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 30%, ${c.primary}08 0%, transparent 50%)` }} />
          {hasEffect('glow') && <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '40%', height: '40%', background: `radial-gradient(circle, ${c.primary}15 0%, transparent 60%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />}
          <div className="demo-hero-content" style={{
            position: 'relative', zIndex: 2, maxWidth: 900, width: '100%',
            padding: '180px 32px 140px', margin: '0 auto', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)',
          }}>
            {/* Logo */}
            {data.logo && data.logo.endsWith('.svg') ? (
              <img src={data.logo} alt={data.name} style={{ height: 'clamp(80px, 14vw, 140px)', objectFit: 'contain', marginBottom: 40 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            ) : (
              <div style={{ marginBottom: 40 }}>
                <div style={{ fontSize: 'clamp(12px, 2vw, 16px)', fontWeight: 500, letterSpacing: '0.3em', color: c.primary, textTransform: 'uppercase', marginBottom: 16 }}>{data.name}</div>
                <div style={{ width: 40, height: 1, background: `${c.primary}40`, margin: '0 auto' }} />
              </div>
            )}
            {/* Sibling toggle */}
            {data.siblingDemo && (
              <div style={{ display: 'inline-flex', gap: 4, padding: 4, background: `${c.primary}0c`, borderRadius: 28, marginBottom: 28, border: `1px solid ${c.primary}12` }}>
                <span style={{ padding: '8px 26px', background: c.primary, color: c.bg, borderRadius: 22, fontSize: 13, fontWeight: 700, boxShadow: `0 2px 12px ${c.primary}40` }}>{data.niche === 'barbearia' ? 'Barbearia' : 'Salão'}</span>
                <Link to={`/demo/${data.siblingDemo}`} style={{ padding: '8px 26px', color: c.textMuted, borderRadius: 22, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>{data.niche === 'barbearia' ? 'Salão Feminino' : 'Barbearia'}</Link>
              </div>
            )}
            {/* Giant title — typography is the hero */}
            <h1 style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: th.heroWeight,
              lineHeight: 0.95, marginBottom: 28, letterSpacing: '-0.04em',
            }}>
              {data.hero.title.split(' ').map((w, i) => (
                <span key={i} style={{
                  display: i > 0 ? 'block' : undefined,
                  color: i === 0 ? c.primary : c.text,
                  ...(hasEffect('gradient-text') && i > 0 ? { backgroundImage: `linear-gradient(135deg, ${c.text}, ${c.textMuted})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : {}),
                }}>{w} </span>
              ))}
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: c.textMuted, lineHeight: 1.8, maxWidth: 500, margin: '0 auto 44px' }}>{data.hero.subtitle}</p>
            {/* CTA */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button style={{ padding: '16px 38px', background: c.primary, color: c.bg, border: 'none', borderRadius: th.btnRadius, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 32px ${c.primary}40`, transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 14px 44px ${c.primary}55`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 8px 32px ${c.primary}40`; e.currentTarget.style.transform = 'translateY(0)'; }}>{data.cta.buttonText}</button>
              <button style={{ padding: '16px 38px', ...glass(c.primary, false, c.bg), color: c.primary, borderRadius: th.btnRadius, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }}>Saiba mais ↓</button>
            </div>
            {/* Tier badge */}
            <div style={{ marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', ...glass(c.primary, false, c.bg), borderRadius: 22 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.primary, boxShadow: `0 0 10px ${c.primary}60` }} />
              <span style={{ fontSize: 11, color: c.textMuted, fontWeight: 500 }}>Plano {tp.name} — {tp.price}</span>
            </div>
            {/* Hero image as horizontal strip below */}
            <div style={{ marginTop: 56, width: '100%', maxWidth: 800, borderRadius: th.cardRadius, overflow: 'hidden', aspectRatio: '21/9', boxShadow: `0 20px 60px ${c.primary}15`, border: `1px solid ${c.primary}10` }}>
              <img src={data.hero.image} alt="" loading="eager" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).src = fallbackImg; }} />
            </div>
          </div>
        </section>
      ) : (
        /* ── FULLSCREEN HERO — original style with decorations ── */
        <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <HeroDecoration />
          <div style={{ position: 'absolute', inset: 0 }}>
            <img src={data.hero.image} alt="" loading="eager" style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: lv >= 2 ? 'scale(1.08)' : 'scale(1.02)',
              transition: 'transform 14s ease',
            }} onError={e => { (e.target as HTMLImageElement).src = fallbackImg; }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: lightBg
                ? `linear-gradient(180deg, ${c.bg}f0 0%, ${c.bg}c8 30%, ${c.bg}90 55%, ${c.bg}60 100%)`
                : `linear-gradient(180deg, ${c.bg}f5 0%, ${c.bg}d0 30%, ${c.bg}80 60%, ${c.bg}50 100%)`,
            }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: th.pattern, backgroundRepeat: 'repeat', opacity: 0.5, pointerEvents: 'none' }} />
            {hasEffect('glow') && <div style={{
              position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
              width: '70%', height: '60%',
              background: `radial-gradient(ellipse, ${c.primary}1a 0%, transparent 65%)`,
              pointerEvents: 'none', filter: 'blur(50px)',
            }} />}
          </div>
          <div className="demo-hero-content" style={{
            position: 'relative', zIndex: 2, maxWidth: 800, width: '100%',
            padding: '160px 32px 120px', margin: '0 auto', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)',
          }}>
            {data.logo && data.logo.endsWith('.svg') ? (
              <img src={data.logo} alt={data.name} style={{ height: 'clamp(100px, 18vw, 180px)', objectFit: 'contain', marginBottom: 32 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            ) : (
              <div style={{ marginBottom: 32, textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(60px, 14vw, 120px)', fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 400, fontStyle: 'italic', color: c.primary, lineHeight: 1, letterSpacing: '-0.04em', textShadow: `0 4px 24px ${c.primary}40` }}>
                  {data.name.split(' ')[0].substring(0, 2).toUpperCase()}
                </div>
                <div style={{ width: 'clamp(100px, 20vw, 200px)', height: 1, background: `${c.primary}40`, margin: '12px auto' }} />
                <div style={{ fontSize: 'clamp(10px, 1.5vw, 14px)', fontFamily: "'Inter', sans-serif", fontWeight: 400, color: c.primary, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.8 }}>{data.tagline}</div>
              </div>
            )}
            {data.siblingDemo && (
              <div style={{ display: 'inline-flex', gap: 4, padding: 4, background: `${c.primary}0c`, borderRadius: 28, marginBottom: 28, border: `1px solid ${c.primary}12`, backdropFilter: 'blur(12px)' }}>
                <span style={{ padding: '8px 26px', background: c.primary, color: c.bg, borderRadius: 22, fontSize: 13, fontWeight: 700, boxShadow: `0 2px 12px ${c.primary}40` }}>{data.niche === 'barbearia' ? 'Barbearia' : 'Salão'}</span>
                <Link to={`/demo/${data.siblingDemo}`} style={{ padding: '8px 26px', color: c.textMuted, borderRadius: 22, fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${c.primary}15`; e.currentTarget.style.color = c.primary; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = c.textMuted; }}>{data.niche === 'barbearia' ? 'Salão Feminino' : 'Barbearia'}</Link>
              </div>
            )}
            <div style={{ display: 'inline-block', padding: '6px 20px', marginBottom: 28, ...glass(c.primary, false, c.bg), borderRadius: 24 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: c.primary, textTransform: 'uppercase' }}>{data.tagline}</span>
            </div>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: th.heroWeight,
              lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.03em', textAlign: 'center',
              textTransform: themeName === 'industrial' ? 'uppercase' as const : 'none' as const,
            }}>
              {data.hero.title.split(' ').map((w, i) => (
                <span key={i} style={{ color: i === 0 ? c.primary : c.text, ...(i > 0 ? { backgroundImage: `linear-gradient(135deg, ${c.text}, ${c.textMuted})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : {}) }}>{w} </span>
              ))}
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: c.textMuted, lineHeight: 1.8, maxWidth: 550, margin: '0 auto 44px', textAlign: 'center' }}>{data.hero.subtitle}</p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button style={{ padding: '16px 38px', background: c.primary, color: c.bg, border: 'none', borderRadius: th.btnRadius, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 32px ${c.primary}40`, transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 14px 44px ${c.primary}55`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 8px 32px ${c.primary}40`; e.currentTarget.style.transform = 'translateY(0)'; }}>{data.cta.buttonText}</button>
              <button style={{ padding: '16px 38px', ...glass(c.primary, false, c.bg), color: c.primary, borderRadius: th.btnRadius, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${c.primary}40`}
                onMouseLeave={e => e.currentTarget.style.borderColor = lightBg ? 'rgba(0,0,0,0.06)' : `${c.primary}14`}>Saiba mais ↓</button>
            </div>
            <div style={{ marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', ...glass(c.primary, false, c.bg), borderRadius: 22 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.primary, boxShadow: `0 0 10px ${c.primary}60` }} />
              <span style={{ fontSize: 11, color: lightBg ? 'rgba(0,0,0,0.45)' : c.textMuted, fontWeight: 500 }}>Plano {tp.name} — {tp.price}</span>
            </div>
          </div>
        </section>
      )}

      {/* ══ FEATURES STRIP ══ */}
      <R><section style={{ padding: '48px 32px', background: `${c.primary}05`, borderTop: `1px solid ${c.primary}08`, borderBottom: `1px solid ${c.primary}08` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 32 }}>
          {data.features.map((f, i) => <div key={i} style={{ textAlign: 'center' }}><div style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: c.primary }}>{f.value}</div><div style={{ fontSize: 11, color: c.textMuted, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{f.label}</div></div>)}
        </div>
      </section></R>

      <Divider />

      {/* ══ ABOUT ══ */}
      {ds.aboutLayout === 'centered' ? (
        <section id="sobre" style={{ padding: '96px 32px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            <R><div><SectionLabel text="Sobre nós" center /><SectionTitle text={`Conheça a ${data.name}`} center /></div></R>
            <R d={100}><div style={{ borderRadius: th.cardRadius, overflow: 'hidden', aspectRatio: '21/9', margin: '32px 0', boxShadow: `0 20px 50px ${c.primary}12`, border: `1px solid ${c.primary}10` }}><img src={data.about.image} alt={data.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).src = fallbackImg.replace('1400', '800'); }} /></div></R>
            <R d={200}><p style={{ color: c.textMuted, fontSize: 16, lineHeight: 2, maxWidth: 600, margin: '0 auto' }}>{data.about.text}</p></R>
          </div>
        </section>
      ) : (
        <section id="sobre" style={{ padding: '96px 32px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center', direction: ds.aboutLayout === 'reverse' ? 'rtl' : 'ltr' }} className="demo-grid">
            <R><div style={{ direction: 'ltr' }}><SectionLabel text="Sobre nós" /><SectionTitle text={`Conheça a ${data.name}`} /><p style={{ color: c.textMuted, fontSize: 15, lineHeight: 1.9, marginTop: 20 }}>{data.about.text}</p></div></R>
            <R d={200}><div style={{ direction: 'ltr', borderRadius: th.cardRadius, overflow: 'hidden', aspectRatio: '4/3', boxShadow: `0 20px 50px ${c.primary}12`, border: `1px solid ${c.primary}10` }}><img src={data.about.image} alt={data.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).src = fallbackImg.replace('1400', '800'); }} /></div></R>
          </div>
        </section>
      )}

      <Divider />

      {/* ══ SERVICES ══ */}
      <section id="serviços" style={{ padding: '96px 32px', background: `${c.primary}03` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <R><div style={{ textAlign: 'center', marginBottom: 40 }}><SectionLabel text="Serviços" /><SectionTitle text="O que oferecemos" /></div></R>

          {/* Category filter (Pro+) */}
          {lv >= 2 && categories.length > 2 && (
            <R><div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 40, flexWrap: 'wrap', padding: 4, background: `${c.primary}06`, borderRadius: th.cardRadius, maxWidth: 'fit-content', margin: '0 auto 40px' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCat(cat)} style={{ padding: '8px 20px', fontSize: 12, fontWeight: activeCat === cat ? 700 : 500, background: activeCat === cat ? c.primary : 'transparent', color: activeCat === cat ? c.bg : c.textMuted, border: 'none', borderRadius: 12, cursor: 'pointer', transition: 'all 0.3s', boxShadow: activeCat === cat ? `0 2px 12px ${c.primary}30` : 'none' }}>{cat}</button>
              ))}
            </div></R>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            {displayServices.map((s, i) => (
              <R key={s.name} d={i * 60}>
                <div style={{ padding: 24, ...th.cardBg(c.primary), borderRadius: th.cardRadius, transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)', cursor: lv >= 2 ? 'pointer' : 'default', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', ...(ds.cardStyle === 'elevated' ? { boxShadow: `0 8px 32px ${c.primary}0a` } : {}), ...(ds.cardStyle === 'bordered' ? { borderLeft: `3px solid ${c.primary}30` } : {}) }}
                  onClick={() => lv >= 2 && setBookingService(s)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.primary}40`; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = hasEffect('neon') ? `0 0 30px ${c.primary}30, inset 0 0 20px ${c.primary}05` : `0 0 30px ${c.primary}15`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = ds.cardStyle === 'bordered' ? `${c.primary}30` : `${c.primary}14`; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = ds.cardStyle === 'elevated' ? `0 8px 32px ${c.primary}0a` : 'none'; }}>
                  {s.popular && <div style={{ position: 'absolute', top: 12, right: 12, padding: '3px 12px', background: `linear-gradient(135deg, ${c.primary}, ${c.primary}c0)`, color: c.bg, fontSize: 10, fontWeight: 700, borderRadius: 20, letterSpacing: '0.04em' }}>POPULAR</div>}
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: `${c.primary}0a`, border: `1px solid ${c.primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}><Ic e={s.icon} c={c.primary} /></div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: c.text, marginBottom: 6 }}>{s.name}</h3>
                  <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.7, flex: 1 }}>{s.desc}</p>
                  {s.price && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 14, borderTop: `1px solid ${c.primary}0a` }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: c.primary }}>{s.price}</span>
                    {s.time && <span style={{ fontSize: 11, color: c.textMuted }}>{s.time}</span>}
                  </div>}
                  {lv >= 2 && <div style={{ marginTop: 12, textAlign: 'center' }}><span style={{ fontSize: 11, color: c.primary, fontWeight: 600 }}>Clique para agendar →</span></div>}
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BOOKING MODAL (Pro+) ══ */}
      {lv >= 2 && bookingService && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => !bookingDone && setBookingService(null)}>
          <div style={{ ...glass(c.primary), background: `${c.bg}f5`, borderRadius: 20, padding: 'clamp(20px, 4vw, 32px)', maxWidth: 500, width: 'calc(100% - 32px)', maxHeight: '90vh', overflowY: 'auto', boxShadow: `0 24px 64px rgba(0,0,0,0.4), 0 0 40px ${c.primary}08` }} onClick={e => e.stopPropagation()}>
            {bookingDone ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${c.primary}15`, border: `2px solid ${c.primary}`, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: c.primary, animation: 'bookCheck 0.5s ease' }}>✓</div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: c.text, marginBottom: 8 }}>Agendamento confirmado!</h3>
                <p style={{ color: c.textMuted, fontSize: 14 }}>Você receberá a confirmação por WhatsApp.</p>
              </div>
            ) : (<>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: c.text, marginBottom: 4 }}>Agendar: {bookingService.name}</h3>
              <p style={{ color: c.textMuted, fontSize: 13, marginBottom: 24 }}>{bookingService.price} · {bookingService.time}</p>

              <p style={{ fontSize: 12, fontWeight: 600, color: c.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Escolha o profissional</p>
              <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                {staff.filter(s => s.available).map(s => (
                  <button key={s.name} onClick={() => setBookingStaff(s)} style={{ padding: '10px 16px', ...glass(c.primary, bookingStaff?.name === s.name), background: bookingStaff?.name === s.name ? `${c.primary}18` : `${c.primary}06`, borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxShadow: bookingStaff?.name === s.name ? `0 0 16px ${c.primary}15` : 'none' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: c.text }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: c.textMuted }}>{s.role} · <span style={{ color: c.primary }}>★</span>{s.rating}</div>
                  </button>
                ))}
              </div>

              <p style={{ fontSize: 12, fontWeight: 600, color: c.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Escolha a data</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {['Hoje', 'Amanhã', 'Sex 22', 'Sáb 23', 'Seg 25'].map(d => (
                  <button key={d} onClick={() => setBookingDate(d)} style={{ padding: '8px 16px', fontSize: 12, background: bookingDate === d ? `${c.primary}18` : `${c.primary}06`, border: `1px solid ${bookingDate === d ? c.primary : c.primary + '12'}`, borderRadius: 8, cursor: 'pointer', color: bookingDate === d ? c.primary : c.textMuted, fontWeight: bookingDate === d ? 700 : 500, transition: 'all 0.2s' }}>{d}</button>
                ))}
              </div>

              <p style={{ fontSize: 12, fontWeight: 600, color: c.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Escolha o horário</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 28 }}>
                {times.map(tm => (
                  <button key={tm} onClick={() => setBookingTime(tm)} style={{ padding: '10px', fontSize: 13, background: bookingTime === tm ? c.primary : `${c.primary}06`, color: bookingTime === tm ? c.bg : c.textMuted, border: `1px solid ${bookingTime === tm ? c.primary : c.primary + '12'}`, borderRadius: 8, cursor: 'pointer', fontWeight: bookingTime === tm ? 700 : 500, transition: 'all 0.2s', boxShadow: bookingTime === tm ? `0 4px 16px ${c.primary}30` : 'none' }}>{tm}</button>
                ))}
              </div>

              <button onClick={handleBook} disabled={!bookingStaff || !bookingDate || !bookingTime} style={{ width: '100%', padding: '15px', background: bookingStaff && bookingDate && bookingTime ? c.primary : `${c.primary}30`, color: c.bg, border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: bookingStaff && bookingDate && bookingTime ? 'pointer' : 'not-allowed', transition: 'all 0.3s', boxShadow: bookingStaff && bookingDate && bookingTime ? `0 8px 24px ${c.primary}35` : 'none' }}
                onMouseEnter={e => { if (bookingStaff && bookingDate && bookingTime) e.currentTarget.style.boxShadow = `0 8px 32px ${c.primary}50`; }}
                onMouseLeave={e => { if (bookingStaff && bookingDate && bookingTime) e.currentTarget.style.boxShadow = `0 8px 24px ${c.primary}35`; }}>Confirmar agendamento</button>
            </>)}
          </div>
        </div>
      )}

      {/* ══ STAFF (Pro+) ══ */}
      <R show={lv >= 2}>
        <section id="equipe" style={{ padding: '96px 32px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}><SectionLabel text="Equipe" /><SectionTitle text="Nossos profissionais" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
              {staff.map((s, i) => (
                <R key={s.name} d={i * 100}>
                  <div style={{ padding: 28, ...th.cardBg(c.primary), borderRadius: th.cardRadius, textAlign: 'center', position: 'relative', transition: 'all 0.3s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.primary}30`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = `${c.primary}14`; e.currentTarget.style.transform = 'none'; }}>
                    {!s.available && <div style={{ position: 'absolute', top: 12, right: 12, padding: '3px 10px', background: '#ef444420', color: '#ef4444', fontSize: 9, fontWeight: 700, borderRadius: 20, border: '1px solid #ef444430' }}>INDISPONÍVEL</div>}
                    {/* Avatar with gradient border */}
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${c.primary}, ${c.primary}60)`, padding: 3, margin: '0 auto 16px' }}>
                      <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: c.primary }}>{s.name.charAt(0)}</div>
                    </div>
                    {/* Availability dot */}
                    <div style={{ position: 'absolute', top: 28, left: '50%', marginLeft: 26, width: 12, height: 12, borderRadius: '50%', background: s.available ? '#22c55e' : '#ef4444', border: `2px solid ${c.bg}`, boxShadow: s.available ? '0 0 8px #22c55e80' : '0 0 8px #ef444480', animation: s.available ? 'pulse 2s ease infinite' : 'none' }} />
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: c.text, marginBottom: 4 }}>{s.name}</h3>
                    <p style={{ fontSize: 12, color: c.textMuted, marginBottom: 12 }}>{s.role}</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, fontSize: 12 }}>
                      <span style={{ color: c.primary }}>★ {s.rating}</span>
                      <span style={{ color: c.textMuted }}>({s.reviews} avaliações)</span>
                    </div>
                  </div>
                </R>
              ))}
            </div>
          </div>
        </section>
      </R>

      <Divider />

      {/* ══ GALLERY ══ */}
      <R><section id="galeria" style={{ padding: '96px 32px', background: `${c.primary}03` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}><SectionLabel text="Galeria" /><SectionTitle text="Nosso espaço" center /></div>
          {ds.galleryLayout === 'masonry' ? (
            /* Masonry — 3 columns, alternating heights */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, gridAutoRows: 8 }} className="demo-gallery">
              {data.gallery.slice(0, 6).map((img, i) => (
                <div key={i} onClick={() => setLightboxIdx(i)} style={{ borderRadius: th.cardRadius, overflow: 'hidden', cursor: 'pointer', position: 'relative', gridRow: `span ${i % 3 === 0 ? 28 : i % 3 === 1 ? 22 : 25}` }}>
                  <img src={img} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    onError={e => { (e.target as HTMLImageElement).src = fallbackImg.replace('1400', '600'); }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'} />
                </div>
              ))}
            </div>
          ) : ds.galleryLayout === 'featured' ? (
            /* Featured — first image large, rest in grid */
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="demo-gallery">
              <div onClick={() => setLightboxIdx(0)} style={{ gridColumn: '1 / -1', borderRadius: th.cardRadius, overflow: 'hidden', aspectRatio: '21/9', cursor: 'pointer', position: 'relative' }}>
                <img src={data.gallery[0]} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  onError={e => { (e.target as HTMLImageElement).src = fallbackImg.replace('1400', '600'); }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'} />
              </div>
              {data.gallery.slice(1, 5).map((img, i) => (
                <div key={i + 1} onClick={() => setLightboxIdx(i + 1)} style={{ borderRadius: th.cardRadius, overflow: 'hidden', aspectRatio: '4/3', cursor: 'pointer', position: 'relative' }}>
                  <img src={img} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    onError={e => { (e.target as HTMLImageElement).src = fallbackImg.replace('1400', '600'); }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'} />
                </div>
              ))}
            </div>
          ) : (
            /* Default grid 3x2 */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="demo-gallery">
              {data.gallery.slice(0, 6).map((img, i) => (
                <div key={i} onClick={() => setLightboxIdx(i)} style={{ borderRadius: th.cardRadius, overflow: 'hidden', aspectRatio: '4/3', cursor: 'pointer', position: 'relative' }}>
                  <img src={img} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    onError={e => { (e.target as HTMLImageElement).src = fallbackImg.replace('1400', '600'); }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.25)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section></R>

      {/* ══ LIGHTBOX ══ */}
      {lightboxIdx !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setLightboxIdx(null)}>
          {/* Prev */}
          <button onClick={e => { e.stopPropagation(); setLightboxIdx(lightboxIdx > 0 ? lightboxIdx - 1 : data.gallery.length - 1); }}
            style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>‹</button>
          {/* Image */}
          <img src={data.gallery[lightboxIdx]} alt="" onClick={e => e.stopPropagation()}
            style={{ maxWidth: '85vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 12 }}
            onError={e => { (e.target as HTMLImageElement).src = fallbackImg; }} />
          {/* Next */}
          <button onClick={e => { e.stopPropagation(); setLightboxIdx(lightboxIdx < data.gallery.length - 1 ? lightboxIdx + 1 : 0); }}
            style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>›</button>
          {/* Close */}
          <button onClick={() => setLightboxIdx(null)}
            style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          {/* Counter */}
          <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{lightboxIdx + 1} / {data.gallery.length}</div>
        </div>
      )}

      {/* Niche-specific extras are handled by full renderers now (BarbeariaRenderer, AcademiaRenderer) */}

      <Divider />

      {/* ══ REVIEWS (Pro+) ══ */}
      <R show={lv >= 2}><section id="avaliações" style={{ padding: '96px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}><SectionLabel text="Avaliações" /><SectionTitle text="O que dizem sobre nós" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            {data.reviews.map((rv, i) => (
              <R key={i} d={i * 100}><div style={{ padding: 26, ...th.cardBg(c.primary), borderRadius: th.cardRadius, borderLeft: `3px solid ${c.primary}`, position: 'relative', transition: 'all 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = c.primary}
                onMouseLeave={e => e.currentTarget.style.borderColor = `${c.primary}14`}>
                {/* Decorative quote */}
                <span style={{ position: 'absolute', top: 12, right: 20, fontSize: 48, fontWeight: 700, color: `${c.primary}12`, lineHeight: 1, fontFamily: 'Georgia, serif', pointerEvents: 'none' }}>"</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg, ${c.primary}25, ${c.primary}10)`, border: `1px solid ${c.primary}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: c.primary }}>{rv.name.charAt(0)}</div>
                  <div><p style={{ fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 2 }}>{rv.name}</p><span style={{ fontSize: 13, color: c.primary, letterSpacing: 1 }}>{'★'.repeat(rv.stars)}<span style={{ color: c.textMuted, opacity: 0.3 }}>{'★'.repeat(5 - rv.stars)}</span></span></div>
                </div>
                <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.8, fontStyle: 'italic' }}>"{rv.text}"</p>
                {rv.time && <p style={{ fontSize: 11, color: `${c.textMuted}80`, marginTop: 12 }}>{rv.time}</p>}
              </div></R>
            ))}
          </div>
        </div>
      </section></R>

      <Divider />

      {/* ══ SUBSCRIPTION PLANS (Premium) ══ */}
      <R show={lv >= 3}><section id="planos" style={{ padding: '96px 32px', background: `${c.primary}03` }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}><SectionLabel text="Planos" /><SectionTitle text="Assinaturas mensais" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 18, alignItems: 'center' }}>
            {plans.map((p, i) => (
              <R key={p.name} d={i * 100}>
                <div style={{ padding: p.popular ? 32 : 28, ...glass(c.primary, p.popular), background: p.popular ? `linear-gradient(160deg, ${c.primary}0c, ${c.primary}04)` : `${c.primary}0a`, borderRadius: th.cardRadius, position: 'relative', transition: 'all 0.3s', transform: p.popular ? 'scale(1.05)' : 'scale(1)', boxShadow: p.popular ? `0 16px 48px ${c.primary}15` : 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = p.popular ? 'scale(1.07)' : 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 48px ${c.primary}20`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = p.popular ? 'scale(1.05)' : 'scale(1)'; e.currentTarget.style.boxShadow = p.popular ? `0 16px 48px ${c.primary}15` : 'none'; }}>
                  {p.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', padding: '4px 18px', background: `linear-gradient(135deg, ${c.primary}, ${c.primary}c0)`, color: c.bg, fontSize: 10, fontWeight: 700, borderRadius: 20, letterSpacing: '0.04em', boxShadow: `0 4px 16px ${c.primary}40` }}>MAIS POPULAR</div>}
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: c.text, marginBottom: 8 }}>{p.name}</h3>
                  <div style={{ fontSize: 32, fontWeight: 800, color: c.primary, marginBottom: 24, letterSpacing: '-0.02em' }}>{p.price}</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {p.features.map((f, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', fontSize: 13, color: c.textMuted, borderTop: j > 0 ? `1px solid ${c.primary}08` : 'none' }}>
                        <span style={{ color: c.primary, fontSize: 14, fontWeight: 700 }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <button style={{ width: '100%', padding: '14px', marginTop: 22, background: p.popular ? c.primary : 'transparent', color: p.popular ? c.bg : c.primary, border: p.popular ? 'none' : `1px solid ${c.primary}25`, borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', boxShadow: p.popular ? `0 4px 20px ${c.primary}30` : 'none' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 24px ${c.primary}40`; if (!p.popular) e.currentTarget.style.background = `${c.primary}10`; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = p.popular ? `0 4px 20px ${c.primary}30` : 'none'; if (!p.popular) e.currentTarget.style.background = 'transparent'; }}>Assinar</button>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section></R>

      {/* ══ LOYALTY (Premium) ══ */}
      <R show={lv >= 3}><section style={{ padding: '96px 32px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}><SectionLabel text="Fidelidade" /><SectionTitle text="Programa de pontos" /></div>
          <div style={{ padding: 32, ...th.cardBg(c.primary), borderRadius: th.cardRadius }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div><div style={{ fontSize: 12, color: c.textMuted, marginBottom: 4 }}>Seus pontos</div><div style={{ fontSize: 32, fontWeight: 800, color: c.primary }}>{loyaltyPoints}</div></div>
              <div style={{ padding: '8px 18px', background: `${c.primary}15`, borderRadius: 20, border: `1px solid ${c.primary}20`, boxShadow: `0 0 20px ${c.primary}10` }}><span style={{ fontSize: 12, fontWeight: 700, color: c.primary }}>Nível Ouro ★</span></div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: c.textMuted, marginBottom: 8 }}><span>Ouro</span><span>Diamante (1.500 pts)</span></div>
              <div style={{ height: 8, background: `${c.primary}10`, borderRadius: 4, overflow: 'hidden' }}><div style={{ height: '100%', width: `${(loyaltyPoints / 1500) * 100}%`, background: `linear-gradient(90deg, ${c.primary}80, ${c.primary})`, borderRadius: 4, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)', boxShadow: `0 0 12px ${c.primary}40` }} /></div>
            </div>
            <div style={{ fontSize: 12, color: c.textMuted }}>Faltam <strong style={{ color: c.primary }}>{1500 - loyaltyPoints} pontos</strong> para Diamante</div>
          </div>
        </div>
      </section></R>

      {/* ══ LOJA / E-COMMERCE (Premium) ══ */}
      <R show={lv >= 3}><section id="loja" style={{ padding: '96px 32px', background: `${c.primary}03` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 56 }}>
            <div><SectionLabel text="Loja" /><SectionTitle text="Nossos produtos" /></div>
            <button onClick={() => setCartOpen(true)} style={{ position: 'relative', padding: '10px 20px', ...glass(c.primary), borderRadius: 12, cursor: 'pointer', color: c.text, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              ◇ Carrinho
              {cart.length > 0 && <span style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: c.primary, color: c.bg, fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cart.length}</span>}
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
            {(data.products || [
              { name: 'Produto 1', price: 'R$ 50', img: fallbackImg.replace('1400', '300') },
              { name: 'Produto 2', price: 'R$ 75', img: fallbackImg.replace('1400', '300') },
              { name: 'Produto 3', price: 'R$ 60', img: fallbackImg.replace('1400', '300') },
              { name: 'Produto 4', price: 'R$ 120', img: fallbackImg.replace('1400', '300'), popular: true },
            ]).map((product, i) => (
              <R key={product.name} d={i * 80}>
                <div style={{ ...th.cardBg(c.primary), borderRadius: th.cardRadius, overflow: 'hidden', transition: 'all 0.4s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.primary}30`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 0 24px ${c.primary}12`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${c.primary}14`; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                    <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { (e.target as HTMLImageElement).src = fallbackImg.replace('1400', '300'); }} />
                    {(product as any).popular && <div style={{ position: 'absolute', top: 10, right: 10, padding: '3px 10px', background: `linear-gradient(135deg, ${c.primary}, ${c.primary}cc)`, color: c.bg, fontSize: 10, fontWeight: 700, borderRadius: 6 }}>MAIS VENDIDO</div>}
                  </div>
                  <div style={{ padding: 18 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: c.text, marginBottom: 8 }}>{product.name}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: c.primary }}>{product.price}</span>
                      <button onClick={() => { setCart(prev => [...prev, { name: product.name, price: product.price, type: 'produto' as const }]); setCartOpen(true); }}
                        style={{ padding: '8px 16px', background: `${c.primary}15`, color: c.primary, border: `1px solid ${c.primary}25`, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = c.primary; e.currentTarget.style.color = c.bg; }}
                        onMouseLeave={e => { e.currentTarget.style.background = `${c.primary}15`; e.currentTarget.style.color = c.primary; }}>
                        + Carrinho
                      </button>
                    </div>
                  </div>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section></R>

      {/* ══ CART SIDEBAR (Premium — lateral fixa) ══ */}
      {lv >= 3 && (<>
        {/* Overlay */}
        {cartOpen && <div onClick={() => setCartOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 249, background: 'rgba(0,0,0,0.5)', transition: 'opacity 0.3s' }} />}

        {/* Cart button fixo */}
        {!cartOpen && cart.length > 0 && (
          <button onClick={() => setCartOpen(true)} style={{
            position: 'fixed', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 248,
            padding: '14px 12px', background: c.primary, color: c.bg, border: 'none',
            borderRadius: '12px 0 0 12px', cursor: 'pointer', fontSize: 13, fontWeight: 700,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            boxShadow: `0 4px 20px ${c.primary}40`, writingMode: 'vertical-lr',
          }}>
            ◇ {cart.length}
          </button>
        )}

        {/* Sidebar */}
        <div style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 250,
          width: 'clamp(300px, 30vw, 380px)',
          background: c.bg, borderLeft: `1px solid ${c.primary}15`,
          transform: cartOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex', flexDirection: 'column',
          boxShadow: cartOpen ? `-8px 0 40px rgba(0,0,0,0.4)` : 'none',
        }}>
          {/* Header */}
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${c.primary}10`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: c.text }}>Carrinho ({cart.length})</h3>
            <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', color: c.textMuted, fontSize: 18, cursor: 'pointer' }}>✕</button>
          </div>

          {/* Items */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ fontSize: 36, opacity: 0.3, marginBottom: 12 }}>◇</div>
                <p style={{ color: c.textMuted, fontSize: 14 }}>Carrinho vazio</p>
                <p style={{ color: `${c.textMuted}80`, fontSize: 12, marginTop: 4 }}>Adicione serviços ou produtos</p>
              </div>
            ) : (
              cart.map((item, i) => (
                <div key={i} style={{ padding: '14px 0', borderBottom: `1px solid ${c.primary}06`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ padding: '2px 8px', background: item.type === 'servico' ? `${c.primary}15` : `${c.primary}08`, color: c.primary, fontSize: 9, fontWeight: 700, borderRadius: 4, textTransform: 'uppercase' }}>
                        {item.type === 'servico' ? 'Serviço' : 'Produto'}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: c.text, marginBottom: 2 }}>{item.name}</p>
                    {item.detail && <p style={{ fontSize: 11, color: c.textMuted }}>{item.detail}</p>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: c.primary }}>{item.price}</span>
                    <button onClick={() => setCart(prev => prev.filter((_, idx) => idx !== i))}
                      style={{ background: `${c.primary}08`, border: 'none', color: c.textMuted, cursor: 'pointer', fontSize: 14, width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div style={{ padding: '20px 24px', borderTop: `1px solid ${c.primary}12` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 14, color: c.textMuted }}>Total</span>
                <span style={{ fontSize: 24, fontWeight: 800, color: c.primary }}>
                  R$ {cart.reduce((sum, item) => {
                    const val = parseFloat((item.price || '0').replace('R$ ', '').replace('.', '').replace(',', '.'));
                    return sum + (isNaN(val) ? 0 : val);
                  }, 0).toFixed(0)}
                </span>
              </div>
              <button style={{ width: '100%', padding: '14px', background: c.primary, color: c.bg, border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 8, transition: 'all 0.2s', boxShadow: `0 4px 16px ${c.primary}30` }}>
                Pagar online
              </button>
              <button style={{ width: '100%', padding: '12px', background: 'transparent', color: c.textMuted, border: `1px solid ${c.primary}15`, borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                Pagar presencialmente
              </button>
            </div>
          )}
        </div>
      </>)}

      {/* ══ FAQ (Pro+) ══ */}
      <R show={lv >= 2 && !!data.faq?.length}><section style={{ padding: '96px 32px', background: `${c.primary}03` }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}><SectionLabel text="FAQ" /><SectionTitle text="Perguntas frequentes" /></div>
          {(data.faq || []).map((item, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${c.primary}10` }}>
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: '100%', padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 15, fontWeight: 500, color: c.text, textAlign: 'left' }}>{item.q}</span>
                <span style={{ color: c.primary, fontSize: 20, transition: 'transform 0.3s', transform: faqOpen === i ? 'rotate(45deg)' : 'none', flexShrink: 0, marginLeft: 16 }}>+</span>
              </button>
              <div style={{ maxHeight: faqOpen === i ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
                <p style={{ fontSize: 14, color: c.textMuted, lineHeight: 1.7, paddingBottom: 18 }}>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section></R>

      <Divider />

      {/* ══ CONTACT ══ */}
      <section id="contato" style={{ padding: '96px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56 }} className="demo-grid">
          <R><div><SectionLabel text="Contato" /><SectionTitle text={data.cta.text} />
            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[{ i: '📱', l: 'WhatsApp', v: data.phone }, { i: '📍', l: 'Endereço', v: data.city }].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, ...glass(c.primary), display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic e={item.i} c={c.primary} s={18} /></div>
                  <div><div style={{ fontSize: 11, color: c.textMuted }}>{item.l}</div><div style={{ fontSize: 14, color: c.text, fontWeight: 500 }}>{item.v}</div></div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 28, height: 240, borderRadius: th.cardRadius, overflow: 'hidden', border: `1px solid ${c.primary}10` }}>
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCdpxxgZRYNVs2cQ_X8SOZchL-iVl48tmU&q=${encodeURIComponent(data.name + ' ' + data.city)}&zoom=15`}
                style={{ width: '100%', height: '100%', border: 'none', filter: c.bg.startsWith('#0') || c.bg.startsWith('#1') ? 'invert(0.9) hue-rotate(180deg) saturate(0.3)' : 'none' }}
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div></R>
          <R d={150}><div style={{ padding: 28, ...th.cardBg(c.primary), borderRadius: th.cardRadius }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: c.text, marginBottom: 20 }}>Envie uma mensagem</h3>
            {['Seu nome', 'WhatsApp'].map(ph => <input key={ph} placeholder={ph} style={{ width: '100%', padding: '13px 16px', background: `${c.primary}05`, border: `1px solid ${c.primary}12`, borderRadius: 8, color: c.text, fontSize: 13, outline: 'none', marginBottom: 12, boxSizing: 'border-box', transition: 'all 0.3s' }}
              onFocus={e => { e.currentTarget.style.borderColor = c.primary; e.currentTarget.style.boxShadow = `0 0 0 3px ${c.primary}15`; }}
              onBlur={e => { e.currentTarget.style.borderColor = `${c.primary}12`; e.currentTarget.style.boxShadow = 'none'; }} />)}
            <textarea placeholder="Mensagem" rows={3} style={{ width: '100%', padding: '13px 16px', background: `${c.primary}05`, border: `1px solid ${c.primary}12`, borderRadius: 8, color: c.text, fontSize: 13, outline: 'none', resize: 'none', marginBottom: 16, boxSizing: 'border-box', transition: 'all 0.3s' }}
              onFocus={e => { e.currentTarget.style.borderColor = c.primary; e.currentTarget.style.boxShadow = `0 0 0 3px ${c.primary}15`; }}
              onBlur={e => { e.currentTarget.style.borderColor = `${c.primary}12`; e.currentTarget.style.boxShadow = 'none'; }} />
            <button style={{ width: '100%', padding: '14px', background: c.primary, color: c.bg, border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', boxShadow: `0 4px 16px ${c.primary}25` }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 24px ${c.primary}45`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 4px 16px ${c.primary}25`; e.currentTarget.style.transform = 'translateY(0)'; }}>Enviar mensagem</button>
          </div></R>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '24px 32px', textAlign: 'center', borderTop: `1px solid ${c.primary}08` }}><p style={{ color: c.textMuted, fontSize: 11 }}>© 2026 {data.name}. Todos os direitos reservados.</p></footer>

      {/* ── WhatsApp FAB ── */}
      <a href="#contato" style={{ position: 'fixed', bottom: 68, right: 24, zIndex: 998, width: 50, height: 50, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,0.4)', transition: 'all 0.3s', textDecoration: 'none', fontSize: 22, color: '#fff' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(37,211,102,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,211,102,0.4)'; }}>◯</a>

      {/* ── Banner Stauf ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999, padding: '9px 24px',
        background: lightBg ? 'rgba(255,255,255,0.94)' : 'rgba(10,10,15,0.94)',
        backdropFilter: 'blur(16px)',
        borderTop: lightBg ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(45,212,191,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#2dd4bf', fontSize: 13, fontWeight: 700 }}>STAUF.</span>
          <span style={{ color: lightBg ? '#888' : '#666', fontSize: 11 }} className="demo-banner-text">Demo visual — Quer um site assim?</span>
        </div>
        <Link to="/" style={{ padding: '6px 16px', background: '#2dd4bf', color: '#0a0a0f', borderRadius: 6, fontSize: 11, fontWeight: 700, textDecoration: 'none', transition: 'all 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(45,212,191,0.4)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>Conheça a Stauf.</Link>
      </div>

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        @keyframes bookCheck{0%{transform:scale(0) rotate(-180deg);opacity:0}60%{transform:scale(1.2) rotate(10deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}
        @media(max-width:768px){
          .demo-nav-links{display:none!important}
          .demo-hamburger{display:block!important}
          .demo-grid{grid-template-columns:1fr!important;direction:ltr!important}
          .demo-gallery{grid-template-columns:1fr 1fr!important}
          .demo-gallery>div{grid-column:span 1!important;aspect-ratio:1/1!important;grid-row:span 1!important}
          .demo-banner-text{display:none}
          .demo-hero-split{grid-template-columns:1fr!important}
          .demo-hero-split>div:last-child{max-height:40vh}
          .demo-hero-content{margin-left:0!important;padding:140px 20px 80px!important;text-align:center;align-items:center!important}
          .demo-hero-content>div:last-of-type{justify-content:center}
          .demo-hero-content img:first-child{height:clamp(80px,25vw,140px)!important}
          .demo-hero-content span[style*="align-self"]{align-self:center!important}
          section{padding-left:16px!important;padding-right:16px!important}
          nav{padding:12px 16px!important}
          h1{font-size:2.2rem!important}
          h2{font-size:1.5rem!important}
        }
        @media(max-width:480px){
          .demo-gallery{grid-template-columns:1fr!important}
          .demo-gallery>div{grid-row:span 1!important}
          section{padding-top:56px!important;padding-bottom:56px!important}
          h1{font-size:1.8rem!important}
          h2{font-size:1.3rem!important}
        }
      `}</style>
    </div>
  );
}
