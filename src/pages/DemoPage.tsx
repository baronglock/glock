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

/* ── Reveal ── */
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

/* ══════════════════ MAIN ══════════════════ */
export default function DemoPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<DemoData | null>(null);
  const [err, setErr] = useState('');
  const [tier, setTier] = useState<'essencial' | 'profissional' | 'premium'>('premium');
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  // Interactive states
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

  if (err) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: '#fff', fontFamily: "'Inter',sans-serif" }}><div style={{ textAlign: 'center' }}><h1 style={{ fontSize: 48, fontWeight: 200, marginBottom: 16 }}>404</h1><p style={{ color: '#888', marginBottom: 32 }}>{err}</p><Link to="/" style={{ color: '#2dd4bf', textDecoration: 'none' }}>← Stauf.</Link></div></div>;
  if (!data) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}><div style={{ width: 40, height: 40, border: '3px solid #333', borderTopColor: '#2dd4bf', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  const c = data.colors;
  const lv = TIERS[tier].level;
  const t = TIERS[tier];
  const font = "'Inter',system-ui,sans-serif";

  // Categories
  const categories = ['Todos', ...new Set(data.services.map(s => s.category || 'Geral'))];
  const filteredServices = activeCat === 'Todos' ? data.services : data.services.filter(s => (s.category || 'Geral') === activeCat);
  const displayServices = lv === 1 ? filteredServices.slice(0, 4) : lv === 2 ? filteredServices.slice(0, 6) : filteredServices;

  // Staff
  const staff: StaffItem[] = data.staff || [
    { name: 'Ana Silva', role: 'Especialista', rating: 4.9, reviews: 234, available: true },
    { name: 'Carlos Lima', role: 'Sênior', rating: 4.8, reviews: 189, available: true },
    { name: 'Marina Costa', role: 'Premium', rating: 4.9, reviews: 312, available: false },
  ];

  // Plans
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

  const SectionLabel = ({ text }: { text: string }) => (
    <span style={{ display: 'inline-block', padding: '4px 12px', background: `${c.primary}10`, color: c.primary, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 14, borderRadius: 4, textTransform: 'uppercase' }}>{text}</span>
  );
  const SectionTitle = ({ text }: { text: string }) => (
    <h2 style={{ fontSize: 'clamp(1.7rem,4vw,2.4rem)', fontWeight: 300, color: c.text }}>{text}</h2>
  );

  return (
    <div style={{ background: c.bg, color: c.text, fontFamily: font, minHeight: '100vh', paddingBottom: 56 }}>

      {/* ── Tier Switcher ── */}
      <div style={{ position: 'fixed', top: 68, left: '50%', transform: 'translateX(-50%)', zIndex: 101, display: 'flex', gap: 2, padding: 3, background: `${c.bg}e0`, backdropFilter: 'blur(12px)', borderRadius: 10, border: `1px solid ${c.primary}20`, boxShadow: `0 4px 24px ${c.bg}80` }}>
        {(Object.entries(TIERS) as [string, typeof TIERS['essencial']][]).map(([key, val]) => (
          <button key={key} onClick={() => { setTier(key as typeof tier); setActiveCat('Todos'); }} style={{ padding: '6px 16px', fontSize: 11, fontWeight: tier === key ? 700 : 500, background: tier === key ? c.primary : 'transparent', color: tier === key ? c.bg : c.textMuted, border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'all 0.3s' }}>{val.name}</button>
        ))}
      </div>

      {/* ── Navbar ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `${c.bg}e8`, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${c.primary}10` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {data.logo && <img src={data.logo} alt="" style={{ height: 28, borderRadius: 4 }} />}
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

      {menuOpen && <div style={{ position: 'fixed', top: 56, left: 0, right: 0, zIndex: 99, background: `${c.bg}f5`, backdropFilter: 'blur(16px)', padding: 24, display: 'flex', flexDirection: 'column', gap: 20, borderBottom: `1px solid ${c.primary}15` }}>
        {['Sobre', 'Serviços', 'Contato'].map(i => <a key={i} href={`#${i.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{ color: c.textMuted, textDecoration: 'none', fontSize: 16 }}>{i}</a>)}
      </div>}

      {/* ══ HERO ══ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={data.hero.image} alt="" loading="eager" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: lv >= 2 ? 'scale(1.08)' : 'scale(1.02)', transition: 'transform 10s ease' }}
            onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=85&auto=format&fit=crop'; }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${c.bg} 0%, ${c.bg}d0 35%, ${c.bg}60 65%, ${c.bg}30 100%)` }} />
          {lv >= 2 && <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60%', height: '60%', background: `radial-gradient(circle, ${c.primary}12 0%, transparent 70%)`, pointerEvents: 'none' }} />}
        </div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 800, padding: '140px 32px 120px', marginLeft: '8%' }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', background: `${c.primary}15`, border: `1px solid ${c.primary}25`, borderRadius: 6, marginBottom: 28 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: c.primary, textTransform: 'uppercase' }}>{data.tagline}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.8rem,7vw,4.8rem)', fontWeight: 800, lineHeight: 1.0, marginBottom: 28, letterSpacing: '-0.03em' }}>
            {data.hero.title.split(' ').map((w, i) => <span key={i} style={{ color: i === 0 ? c.primary : c.text }}>{w} </span>)}
          </h1>
          <p style={{ fontSize: 'clamp(1rem,2vw,1.15rem)', color: c.textMuted, lineHeight: 1.8, marginBottom: 44, maxWidth: 520 }}>{data.hero.subtitle}</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button style={{ padding: '15px 34px', background: c.primary, color: c.bg, border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: lv >= 2 ? `0 8px 28px ${c.primary}35` : 'none' }}>{data.cta.buttonText}</button>
            <button style={{ padding: '15px 34px', background: `${c.primary}08`, color: c.primary, border: `1px solid ${c.primary}25`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Saiba mais ↓</button>
          </div>
          <div style={{ marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', background: `${c.primary}10`, borderRadius: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.primary }} />
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
          <R d={200}><div style={{ borderRadius: 18, overflow: 'hidden', aspectRatio: '4/3', boxShadow: lv >= 2 ? `0 20px 40px ${c.primary}10` : 'none' }}><img src={data.about.image} alt={data.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop'; }} /></div></R>
        </div>
      </section>

      {/* ══ SERVICES (com categorias filtráveis) ══ */}
      <section id="serviços" style={{ padding: '96px 32px', background: `${c.primary}03` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <R><div style={{ textAlign: 'center', marginBottom: 40 }}><SectionLabel text="Serviços" /><SectionTitle text="O que oferecemos" /></div></R>

          {/* Category filter (Pro+) */}
          {lv >= 2 && categories.length > 2 && (
            <R><div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCat(cat)} style={{ padding: '8px 20px', fontSize: 12, fontWeight: activeCat === cat ? 700 : 500, background: activeCat === cat ? c.primary : `${c.primary}08`, color: activeCat === cat ? c.bg : c.textMuted, border: `1px solid ${activeCat === cat ? c.primary : c.primary + '15'}`, borderRadius: 8, cursor: 'pointer', transition: 'all 0.3s' }}>{cat}</button>
              ))}
            </div></R>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            {displayServices.map((s, i) => (
              <R key={s.name} d={i * 60}>
                <div style={{ padding: 24, background: c.bg, border: `1px solid ${c.primary}08`, borderRadius: 14, transition: 'all 0.4s', cursor: lv >= 2 ? 'pointer' : 'default', position: 'relative' }}
                  onClick={() => lv >= 2 && setBookingService(s)}
                  onMouseEnter={e => { if (lv >= 2) { e.currentTarget.style.borderColor = `${c.primary}30`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${c.primary}10`; }}}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${c.primary}08`; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                  {s.popular && <div style={{ position: 'absolute', top: 12, right: 12, padding: '2px 10px', background: c.primary, color: c.bg, fontSize: 10, fontWeight: 700, borderRadius: 4 }}>POPULAR</div>}
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `${c.primary}08`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}><Ic e={s.icon} c={c.primary} /></div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: c.text, marginBottom: 6 }}>{s.name}</h3>
                  <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.7, marginBottom: s.price ? 12 : 0 }}>{s.desc}</p>
                  {s.price && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 12, borderTop: `1px solid ${c.primary}08` }}>
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
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => !bookingDone && setBookingService(null)}>
          <div style={{ background: c.bg, border: `1px solid ${c.primary}20`, borderRadius: 20, padding: 32, maxWidth: 500, width: '100%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            {bookingDone ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: c.text, marginBottom: 8 }}>Agendamento confirmado!</h3>
                <p style={{ color: c.textMuted, fontSize: 14 }}>Você receberá a confirmação por WhatsApp.</p>
              </div>
            ) : (<>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: c.text, marginBottom: 4 }}>Agendar: {bookingService.name}</h3>
              <p style={{ color: c.textMuted, fontSize: 13, marginBottom: 24 }}>{bookingService.price} · {bookingService.time}</p>

              {/* Staff selection */}
              <p style={{ fontSize: 12, fontWeight: 600, color: c.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Escolha o profissional</p>
              <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
                {staff.filter(s => s.available).map(s => (
                  <button key={s.name} onClick={() => setBookingStaff(s)} style={{ padding: '10px 16px', background: bookingStaff?.name === s.name ? `${c.primary}20` : `${c.primary}06`, border: `1px solid ${bookingStaff?.name === s.name ? c.primary : c.primary + '12'}`, borderRadius: 10, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: c.text }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: c.textMuted }}>{s.role} · ★{s.rating}</div>
                  </button>
                ))}
              </div>

              {/* Date */}
              <p style={{ fontSize: 12, fontWeight: 600, color: c.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Escolha a data</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {['Hoje', 'Amanhã', 'Sex 22', 'Sáb 23', 'Seg 25'].map(d => (
                  <button key={d} onClick={() => setBookingDate(d)} style={{ padding: '8px 16px', fontSize: 12, background: bookingDate === d ? `${c.primary}20` : `${c.primary}06`, border: `1px solid ${bookingDate === d ? c.primary : c.primary + '12'}`, borderRadius: 8, cursor: 'pointer', color: bookingDate === d ? c.primary : c.textMuted, fontWeight: bookingDate === d ? 700 : 500, transition: 'all 0.2s' }}>{d}</button>
                ))}
              </div>

              {/* Time */}
              <p style={{ fontSize: 12, fontWeight: 600, color: c.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Escolha o horário</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 28 }}>
                {times.map(t => (
                  <button key={t} onClick={() => setBookingTime(t)} style={{ padding: '10px', fontSize: 13, background: bookingTime === t ? c.primary : `${c.primary}06`, color: bookingTime === t ? c.bg : c.textMuted, border: `1px solid ${bookingTime === t ? c.primary : c.primary + '12'}`, borderRadius: 8, cursor: 'pointer', fontWeight: bookingTime === t ? 700 : 500, transition: 'all 0.2s' }}>{t}</button>
                ))}
              </div>

              <button onClick={handleBook} disabled={!bookingStaff || !bookingDate || !bookingTime} style={{ width: '100%', padding: '15px', background: bookingStaff && bookingDate && bookingTime ? c.primary : `${c.primary}30`, color: c.bg, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: bookingStaff && bookingDate && bookingTime ? 'pointer' : 'not-allowed', transition: 'all 0.3s' }}>Confirmar agendamento</button>
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
                  <div style={{ padding: 24, background: `${c.primary}04`, border: `1px solid ${c.primary}08`, borderRadius: 14, textAlign: 'center', position: 'relative' }}>
                    {!s.available && <div style={{ position: 'absolute', top: 12, right: 12, padding: '2px 8px', background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 4 }}>INDISPONÍVEL</div>}
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${c.primary}15`, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: c.primary }}>{s.name.charAt(0)}</div>
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
              <div key={i} style={{ borderRadius: 12, overflow: 'hidden', gridColumn: (i === 0 || i === 3) ? 'span 2' : 'span 1', aspectRatio: (i === 0 || i === 3) ? '2/1' : '1/1' }}>
                <img src={img} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&auto=format&fit=crop'; }} />
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
            {data.reviews.map((r, i) => (
              <R key={i} d={i * 100}><div style={{ padding: 26, background: `${c.primary}04`, border: `1px solid ${c.primary}08`, borderRadius: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${c.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: c.primary }}>{r.name.charAt(0)}</div>
                  <div><p style={{ fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 2 }}>{r.name}</p><span style={{ fontSize: 13, color: c.primary }}>{'★'.repeat(r.stars)}</span></div>
                </div>
                <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.8, fontStyle: 'italic' }}>"{r.text}"</p>
                {r.time && <p style={{ fontSize: 11, color: `${c.textMuted}80`, marginTop: 10 }}>{r.time}</p>}
              </div></R>
            ))}
          </div>
        </div>
      </section></R>

      {/* ══ SUBSCRIPTION PLANS (Premium) ══ */}
      <R show={lv >= 3}><section id="planos" style={{ padding: '96px 32px', background: `${c.primary}03` }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}><SectionLabel text="Planos" /><SectionTitle text="Assinaturas mensais" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 18 }}>
            {plans.map((p, i) => (
              <R key={p.name} d={i * 100}>
                <div style={{ padding: 28, background: c.bg, border: `1px solid ${p.popular ? c.primary : c.primary + '10'}`, borderRadius: 16, position: 'relative', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${c.primary}15`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                  {p.popular && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', padding: '3px 14px', background: c.primary, color: c.bg, fontSize: 10, fontWeight: 700, borderRadius: 4 }}>MAIS POPULAR</div>}
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: c.text, marginBottom: 4 }}>{p.name}</h3>
                  <div style={{ fontSize: 28, fontWeight: 800, color: c.primary, marginBottom: 20 }}>{p.price}</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {p.features.map((f, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', fontSize: 13, color: c.textMuted, borderTop: j > 0 ? `1px solid ${c.primary}06` : 'none' }}>
                        <span style={{ color: c.primary, fontSize: 14 }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <button style={{ width: '100%', padding: '13px', marginTop: 20, background: p.popular ? c.primary : `${c.primary}10`, color: p.popular ? c.bg : c.primary, border: p.popular ? 'none' : `1px solid ${c.primary}20`, borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Assinar</button>
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
          <div style={{ padding: 28, background: `${c.primary}04`, border: `1px solid ${c.primary}10`, borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div><div style={{ fontSize: 12, color: c.textMuted }}>Seus pontos</div><div style={{ fontSize: 28, fontWeight: 800, color: c.primary }}>{loyaltyPoints}</div></div>
              <div style={{ padding: '6px 14px', background: `${c.primary}15`, borderRadius: 6 }}><span style={{ fontSize: 12, fontWeight: 700, color: c.primary }}>Nível Ouro ★</span></div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: c.textMuted, marginBottom: 6 }}><span>Ouro</span><span>Diamante (1.500 pts)</span></div>
              <div style={{ height: 6, background: `${c.primary}10`, borderRadius: 3 }}><div style={{ height: '100%', width: `${(loyaltyPoints / 1500) * 100}%`, background: c.primary, borderRadius: 3, transition: 'width 1s ease' }} /></div>
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
                <span style={{ color: c.primary, fontSize: 20, transition: 'transform 0.3s', transform: faqOpen === i ? 'rotate(45deg)' : 'none' }}>+</span>
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
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: `${c.primary}08`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic e={item.i} c={c.primary} s={18} /></div>
                  <div><div style={{ fontSize: 11, color: c.textMuted }}>{item.l}</div><div style={{ fontSize: 14, color: c.text, fontWeight: 500 }}>{item.v}</div></div>
                </div>
              ))}
            </div>
            {/* Maps placeholder (Pro+) */}
            {lv >= 2 && <div style={{ marginTop: 28, height: 200, borderRadius: 14, background: `${c.primary}06`, border: `1px solid ${c.primary}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: c.textMuted }}><div style={{ fontSize: 32, marginBottom: 8, opacity: 0.4 }}>⊙</div><p style={{ fontSize: 12 }}>Google Maps integrado</p></div>
            </div>}
          </div></R>
          <R d={150}><div style={{ padding: 28, background: `${c.primary}04`, border: `1px solid ${c.primary}08`, borderRadius: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: c.text, marginBottom: 20 }}>Envie uma mensagem</h3>
            {['Seu nome', 'WhatsApp'].map(ph => <input key={ph} placeholder={ph} style={{ width: '100%', padding: '12px 14px', background: `${c.primary}05`, border: `1px solid ${c.primary}12`, borderRadius: 8, color: c.text, fontSize: 13, outline: 'none', marginBottom: 12, boxSizing: 'border-box' }} />)}
            <textarea placeholder="Mensagem" rows={3} style={{ width: '100%', padding: '12px 14px', background: `${c.primary}05`, border: `1px solid ${c.primary}12`, borderRadius: 8, color: c.text, fontSize: 13, outline: 'none', resize: 'none', marginBottom: 14, boxSizing: 'border-box' }} />
            <button style={{ width: '100%', padding: '14px', background: c.primary, color: c.bg, border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Enviar mensagem</button>
          </div></R>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '24px 32px', textAlign: 'center', borderTop: `1px solid ${c.primary}08` }}><p style={{ color: c.textMuted, fontSize: 11 }}>© 2026 {data.name}. Todos os direitos reservados.</p></footer>

      {/* ── WhatsApp FAB ── */}
      <a href="#contato" style={{ position: 'fixed', bottom: 68, right: 24, zIndex: 998, width: 50, height: 50, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(37,211,102,0.35)', transition: 'transform 0.3s', textDecoration: 'none', fontSize: 22, color: '#fff' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>◯</a>

      {/* ── Banner Stauf ── */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999, padding: '9px 24px', background: 'rgba(10,10,15,0.94)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(45,212,191,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: '#2dd4bf', fontSize: 13, fontWeight: 700 }}>STAUF.</span><span style={{ color: '#666', fontSize: 11 }} className="demo-banner-text">Demo visual — Quer um site assim?</span></div>
        <Link to="/" style={{ padding: '6px 16px', background: '#2dd4bf', color: '#0a0a0f', borderRadius: 6, fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>Conheça a Stauf.</Link>
      </div>

      <style>{`
        @media(max-width:768px){.demo-nav-links{display:none!important}.demo-hamburger{display:block!important}.demo-grid{grid-template-columns:1fr!important}.demo-gallery{grid-template-columns:1fr 1fr!important}.demo-gallery>div{grid-column:span 1!important;aspect-ratio:1/1!important}.demo-banner-text{display:none}}
      `}</style>
    </div>
  );
}
