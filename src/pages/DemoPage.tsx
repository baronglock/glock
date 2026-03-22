import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

/* ── Types ── */
interface ServiceItem { name: string; desc: string; icon: string; price?: string; time?: string; category?: string; popular?: boolean }
interface ReviewItem { name: string; text: string; stars: number; time?: string }
interface FeatureItem { label: string; value: string }
interface StaffItem { name: string; role: string; rating: number; reviews: number; available: boolean }
interface PlanItem { name: string; price: string; features: string[]; popular?: boolean }
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
  plans?: PlanItem[];
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

/* ── Glass helper ── */
const glass = (primary: string, hover = false) => ({
  background: `${primary}0a`,
  backdropFilter: 'blur(12px)',
  border: `1px solid ${primary}${hover ? '40' : '14'}`,
});

/* ── SVG diamond pattern ── */
const DIAMOND_SVG = `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='white' stroke-width='0.5' opacity='0.04'/%3E%3C/svg%3E")`;

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

  useEffect(() => {
    fetch(`/demos/data/${slug}.json`)
      .then(r => { if (!r.ok) throw new Error('x'); return r.json(); })
      .then(setData).catch(() => setErr('Demo não encontrada'));
  }, [slug]);

  useEffect(() => { if (data) { const t = setTimeout(() => setHeroVisible(true), 100); return () => clearTimeout(t); } }, [data]);

  if (err) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: '#fff', fontFamily: "'Inter',sans-serif" }}><div style={{ textAlign: 'center' }}><h1 style={{ fontSize: 48, fontWeight: 200, marginBottom: 16 }}>404</h1><p style={{ color: '#888', marginBottom: 32 }}>{err}</p><Link to="/" style={{ color: '#2dd4bf', textDecoration: 'none' }}>← Stauf.</Link></div></div>;
  if (!data) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}><div style={{ width: 40, height: 40, border: '3px solid #333', borderTopColor: '#2dd4bf', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  const c = data.colors;
  const lv = TIERS[tier].level;
  const t = TIERS[tier];
  const font = "'Inter',system-ui,sans-serif";

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
    setBookingDone(true);
    setTimeout(() => { setBookingDone(false); setBookingService(null); setBookingStaff(null); setBookingDate(''); setBookingTime(''); }, 3000);
  };

  const fallbackImg = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=85&auto=format&fit=crop';

  const SectionLabel = ({ text }: { text: string }) => (
    <span style={{ display: 'inline-block', padding: '5px 14px', background: `${c.primary}10`, color: c.primary, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', marginBottom: 14, borderRadius: 20, textTransform: 'uppercase', border: `1px solid ${c.primary}15` }}>{text}</span>
  );
  const SectionTitle = ({ text }: { text: string }) => (
    <h2 style={{ fontSize: 'clamp(1.7rem,4vw,2.4rem)', fontWeight: 300, color: c.text, letterSpacing: '-0.02em' }}>{text}</h2>
  );

  return (
    <div style={{ background: c.bg, color: c.text, fontFamily: font, minHeight: '100vh', paddingBottom: 56 }}>

      {/* ── Tier Switcher (pill glass) ── */}
      <div style={{ position: 'fixed', top: 68, left: '50%', transform: 'translateX(-50%)', zIndex: 101, display: 'flex', gap: 2, padding: 4, ...glass(c.primary), background: `${c.bg}e0`, borderRadius: 16, boxShadow: `0 8px 32px ${c.bg}90` }}>
        {(Object.entries(TIERS) as [string, typeof TIERS['essencial']][]).map(([key, val]) => (
          <button key={key} onClick={() => { setTier(key as typeof tier); setActiveCat('Todos'); }} style={{ padding: '7px 20px', fontSize: 11, fontWeight: tier === key ? 700 : 500, background: tier === key ? c.primary : 'transparent', color: tier === key ? c.bg : c.textMuted, border: 'none', borderRadius: 12, cursor: 'pointer', transition: 'all 0.3s', boxShadow: tier === key ? `0 2px 12px ${c.primary}40` : 'none' }}>{val.name}</button>
        ))}
      </div>

      {/* ── Navbar ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `${c.bg}e8`, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${c.primary}10` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {data.logo && <img src={data.logo} alt="" style={{ height: 28, borderRadius: 4 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
          <span style={{ fontSize: 22, fontWeight: 700, color: c.primary, letterSpacing: '-0.02em' }}>{data.name}</span>
        </div>
        <div className="demo-nav-links" style={{ display: 'flex', gap: 24, fontSize: 13, fontWeight: 500 }}>
          {['Sobre', 'Serviços', ...(lv >= 2 ? ['Equipe', 'Avaliações'] : []), ...(lv >= 3 ? ['Planos'] : []), 'Contato'].map(i => (
            <a key={i} href={`#${i.toLowerCase()}`} style={{ color: c.textMuted, textDecoration: 'none', transition: 'color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.color = c.primary} onMouseLeave={e => e.currentTarget.style.color = c.textMuted}>{i}</a>
          ))}
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="demo-hamburger" style={{ display: 'none', background: 'none', border: 'none', color: c.text, fontSize: 22, cursor: 'pointer' }}>☰</button>
      </nav>

      {menuOpen && <div style={{ position: 'fixed', top: 56, left: 0, right: 0, zIndex: 99, background: `${c.bg}f5`, backdropFilter: 'blur(20px)', padding: 24, display: 'flex', flexDirection: 'column', gap: 20, borderBottom: `1px solid ${c.primary}15` }}>
        {['Sobre', 'Serviços', 'Contato'].map(i => <a key={i} href={`#${i.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{ color: c.textMuted, textDecoration: 'none', fontSize: 16 }}>{i}</a>)}
      </div>}

      {/* ══ HERO ══ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background image */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={data.hero.image} alt="" loading="eager" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: lv >= 2 ? 'scale(1.08)' : 'scale(1.02)', transition: 'transform 12s ease' }}
            onError={e => { (e.target as HTMLImageElement).src = fallbackImg; }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${c.bg} 0%, ${c.bg}d0 35%, ${c.bg}60 65%, ${c.bg}30 100%)` }} />
          {/* Diamond pattern overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: DIAMOND_SVG, backgroundRepeat: 'repeat', opacity: 0.5, pointerEvents: 'none' }} />
          {/* Radial glow behind title */}
          <div style={{ position: 'absolute', top: '30%', left: '20%', width: '50%', height: '50%', background: `radial-gradient(ellipse, ${c.primary}18 0%, transparent 70%)`, pointerEvents: 'none', filter: 'blur(40px)' }} />
          {lv >= 2 && <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60%', height: '60%', background: `radial-gradient(circle, ${c.primary}12 0%, transparent 70%)`, pointerEvents: 'none' }} />}
        </div>
        <div className="demo-hero-content" style={{ position: 'relative', zIndex: 2, maxWidth: 800, padding: '140px 32px 120px', marginLeft: '8%', opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(32px)', transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)' }}>
          <div style={{ display: 'inline-block', padding: '6px 18px', ...glass(c.primary), borderRadius: 20, marginBottom: 28 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: c.primary, textTransform: 'uppercase' }}>{data.tagline}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.8rem,7vw,4.8rem)', fontWeight: 800, lineHeight: 1.0, marginBottom: 28, letterSpacing: '-0.03em' }}>
            {data.hero.title.split(' ').map((w, i) => (
              <span key={i} style={{ color: i === 0 ? c.primary : c.text, ...(i > 0 ? { backgroundImage: `linear-gradient(135deg, ${c.text}, ${c.textMuted})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : {}) }}>{w} </span>
            ))}
          </h1>
          <p style={{ fontSize: 'clamp(1rem,2vw,1.15rem)', color: c.textMuted, lineHeight: 1.8, marginBottom: 44, maxWidth: 520 }}>{data.hero.subtitle}</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button style={{ padding: '15px 34px', background: c.primary, color: c.bg, border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 28px ${c.primary}35`, transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 12px 40px ${c.primary}50`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 8px 28px ${c.primary}35`; e.currentTarget.style.transform = 'translateY(0)'; }}>{data.cta.buttonText}</button>
            <button style={{ padding: '15px 34px', ...glass(c.primary), color: c.primary, borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${c.primary}40`}
              onMouseLeave={e => e.currentTarget.style.borderColor = `${c.primary}14`}>Saiba mais ↓</button>
          </div>
          <div style={{ marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', ...glass(c.primary), borderRadius: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.primary, boxShadow: `0 0 8px ${c.primary}60` }} />
            <span style={{ fontSize: 11, color: c.textMuted }}>Plano {t.name} — {t.price}</span>
          </div>
        </div>
      </section>

      {/* ══ FEATURES STRIP ══ */}
      <R><section style={{ padding: '48px 32px', background: `${c.primary}05`, borderTop: `1px solid ${c.primary}08`, borderBottom: `1px solid ${c.primary}08` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 32 }}>
          {data.features.map((f, i) => <div key={i} style={{ textAlign: 'center' }}><div style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: c.primary }}>{f.value}</div><div style={{ fontSize: 11, color: c.textMuted, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{f.label}</div></div>)}
        </div>
      </section></R>

      {/* ══ ABOUT ══ */}
      <section id="sobre" style={{ padding: '96px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }} className="demo-grid">
          <R><div><SectionLabel text="Sobre nós" /><SectionTitle text={`Conheça a ${data.name}`} /><p style={{ color: c.textMuted, fontSize: 15, lineHeight: 1.9, marginTop: 20 }}>{data.about.text}</p></div></R>
          <R d={200}><div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3', boxShadow: `0 20px 50px ${c.primary}12`, border: `1px solid ${c.primary}10` }}><img src={data.about.image} alt={data.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).src = fallbackImg.replace('1400', '800'); }} /></div></R>
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section id="serviços" style={{ padding: '96px 32px', background: `${c.primary}03` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <R><div style={{ textAlign: 'center', marginBottom: 40 }}><SectionLabel text="Serviços" /><SectionTitle text="O que oferecemos" /></div></R>

          {/* Category filter (Pro+) */}
          {lv >= 2 && categories.length > 2 && (
            <R><div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 40, flexWrap: 'wrap', padding: 4, background: `${c.primary}06`, borderRadius: 16, maxWidth: 'fit-content', margin: '0 auto 40px' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCat(cat)} style={{ padding: '8px 20px', fontSize: 12, fontWeight: activeCat === cat ? 700 : 500, background: activeCat === cat ? c.primary : 'transparent', color: activeCat === cat ? c.bg : c.textMuted, border: 'none', borderRadius: 12, cursor: 'pointer', transition: 'all 0.3s', boxShadow: activeCat === cat ? `0 2px 12px ${c.primary}30` : 'none' }}>{cat}</button>
              ))}
            </div></R>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            {displayServices.map((s, i) => (
              <R key={s.name} d={i * 60}>
                <div style={{ padding: 24, ...glass(c.primary), borderRadius: 16, transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)', cursor: lv >= 2 ? 'pointer' : 'default', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}
                  onClick={() => lv >= 2 && setBookingService(s)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.primary}40`; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 0 30px ${c.primary}15`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${c.primary}14`; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
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
                  <div style={{ padding: 28, ...glass(c.primary), borderRadius: 16, textAlign: 'center', position: 'relative', transition: 'all 0.3s' }}
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

      {/* ══ GALLERY ══ */}
      <R><section id="galeria" style={{ padding: '96px 32px', background: `${c.primary}03` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}><SectionLabel text="Galeria" /><SectionTitle text="Nosso espaço" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }} className="demo-gallery">
            {data.gallery.map((img, i) => (
              <div key={i} style={{ borderRadius: 16, overflow: 'hidden', gridColumn: (i === 0 || i === 3) ? 'span 2' : 'span 1', aspectRatio: (i === 0 || i === 3) ? '2/1' : '1/1' }}>
                <img src={img} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  onError={e => { (e.target as HTMLImageElement).src = fallbackImg.replace('1400', '600'); }} />
              </div>
            ))}
          </div>
        </div>
      </section></R>

      {/* ══ REVIEWS (Pro+) ══ */}
      <R show={lv >= 2}><section id="avaliações" style={{ padding: '96px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}><SectionLabel text="Avaliações" /><SectionTitle text="O que dizem sobre nós" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            {data.reviews.map((rv, i) => (
              <R key={i} d={i * 100}><div style={{ padding: 26, ...glass(c.primary), borderRadius: 16, borderLeft: `3px solid ${c.primary}`, position: 'relative', transition: 'all 0.3s' }}
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

      {/* ══ SUBSCRIPTION PLANS (Premium) ══ */}
      <R show={lv >= 3}><section id="planos" style={{ padding: '96px 32px', background: `${c.primary}03` }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}><SectionLabel text="Planos" /><SectionTitle text="Assinaturas mensais" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 18, alignItems: 'center' }}>
            {plans.map((p, i) => (
              <R key={p.name} d={i * 100}>
                <div style={{ padding: p.popular ? 32 : 28, ...glass(c.primary, p.popular), background: p.popular ? `linear-gradient(160deg, ${c.primary}0c, ${c.primary}04)` : `${c.primary}0a`, borderRadius: 16, position: 'relative', transition: 'all 0.3s', transform: p.popular ? 'scale(1.05)' : 'scale(1)', boxShadow: p.popular ? `0 16px 48px ${c.primary}15` : 'none' }}
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
          <div style={{ padding: 32, ...glass(c.primary), borderRadius: 16 }}>
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
            {lv >= 2 && <div style={{ marginTop: 28, height: 200, borderRadius: 16, ...glass(c.primary), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: c.textMuted }}><div style={{ fontSize: 32, marginBottom: 8, opacity: 0.4 }}>⊙</div><p style={{ fontSize: 12 }}>Google Maps integrado</p></div>
            </div>}
          </div></R>
          <R d={150}><div style={{ padding: 28, ...glass(c.primary), borderRadius: 16 }}>
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
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999, padding: '9px 24px', background: 'rgba(10,10,15,0.94)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(45,212,191,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: '#2dd4bf', fontSize: 13, fontWeight: 700 }}>STAUF.</span><span style={{ color: '#666', fontSize: 11 }} className="demo-banner-text">Demo visual — Quer um site assim?</span></div>
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
          .demo-grid{grid-template-columns:1fr!important}
          .demo-gallery{grid-template-columns:1fr 1fr!important}
          .demo-gallery>div{grid-column:span 1!important;aspect-ratio:1/1!important}
          .demo-banner-text{display:none}
          .demo-hero-content{margin-left:0!important;padding:120px 20px 80px!important;text-align:center}
          .demo-hero-content>div:last-of-type{justify-content:center}
          section{padding-left:16px!important;padding-right:16px!important}
          nav{padding:12px 16px!important}
          h1{font-size:2.2rem!important}
          h2{font-size:1.5rem!important}
        }
        @media(max-width:480px){
          .demo-gallery{grid-template-columns:1fr!important}
          section{padding-top:56px!important;padding-bottom:56px!important}
          h1{font-size:1.8rem!important}
          h2{font-size:1.3rem!important}
        }
      `}</style>
    </div>
  );
}
