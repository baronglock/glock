import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* ── Types ── */
interface ServiceItem { name: string; desc: string; icon: string; price?: string; time?: string; category?: string; popular?: boolean }
interface ReviewItem { name: string; text: string; stars: number; time?: string }
interface FeatureItem { label: string; value: string }
interface StaffItem { name: string; role: string; rating: number; reviews: number; available: boolean }
interface PlanItem { name: string; price: string; features: string[]; popular?: boolean }
interface DemoData {
  slug: string; name: string; niche: string; tagline: string; city: string; phone: string;
  colors: { primary: string; secondary: string; bg: string; text: string; textMuted: string };
  hero: { title: string; subtitle: string; image: string };
  about: { text: string; image: string };
  services: ServiceItem[]; gallery: string[]; reviews: ReviewItem[]; features: FeatureItem[];
  cta: { text: string; buttonText: string };
  faq?: { q: string; a: string }[];
  staff?: StaffItem[]; plans?: PlanItem[];
  products?: { name: string; price: string; img: string; popular?: boolean }[];
  siblingDemo?: string;
  [key: string]: any;
}

/* ── Staggered fade-in (like Scissors & Scotch) ── */
function Fade({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); o.disconnect(); } }, { threshold: 0.06 });
    o.observe(el); return () => o.disconnect();
  }, []);
  return <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(28px)', transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms` }}>{children}</div>;
}

/* ── SVG Curl Ornament (inspired by Abel's on Queen) ── */
function CurlDivider({ color, flip }: { color: string; flip?: boolean }) {
  return (
    <div style={{ textAlign: 'center', padding: '28px 0', transform: flip ? 'scaleX(-1)' : 'none' }}>
      <svg width="120" height="20" viewBox="0 0 120 20" fill="none" style={{ display: 'inline-block', opacity: 0.4 }}>
        <path d="M0 10 Q15 0 30 10 T60 10 T90 10 T120 10" stroke={color} strokeWidth="1" fill="none" />
        <circle cx="60" cy="10" r="3" fill={color} fillOpacity="0.3" />
      </svg>
    </div>
  );
}

/* ── Before/After Slider ── */
function BeforeAfter({ before, after, accent }: { before: string; after: string; accent: string }) {
  const [pos, setPos] = useState(50);
  const drag = useRef(false);
  const box = useRef<HTMLDivElement>(null);
  const move = (x: number) => { const r = box.current?.getBoundingClientRect(); if (r) setPos(Math.max(5, Math.min(95, ((x - r.left) / r.width) * 100))); };
  useEffect(() => {
    const m = (e: MouseEvent | TouchEvent) => { if (!drag.current) return; move('touches' in e ? e.touches[0].clientX : e.clientX); };
    const u = () => { drag.current = false; };
    window.addEventListener('mousemove', m); window.addEventListener('mouseup', u);
    window.addEventListener('touchmove', m); window.addEventListener('touchend', u);
    return () => { window.removeEventListener('mousemove', m); window.removeEventListener('mouseup', u); window.removeEventListener('touchmove', m); window.removeEventListener('touchend', u); };
  }, []);
  return (
    <div ref={box} onMouseDown={() => { drag.current = true; }} onTouchStart={() => { drag.current = true; }}
      style={{ position: 'relative', width: '100%', maxWidth: 320, aspectRatio: '3/4', borderRadius: 24, overflow: 'hidden', cursor: 'ew-resize', boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 40px ${accent}08` }}>
      <img src={after} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, width: `${pos}%`, overflow: 'hidden' }}>
        <img src={before} alt="" style={{ width: `${10000 / pos}%`, height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${pos}%`, width: 2, background: accent, transform: 'translateX(-50%)', boxShadow: `0 0 20px ${accent}80`, zIndex: 2 }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 36, height: 36, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#0a0e1a', fontWeight: 800, boxShadow: `0 0 20px ${accent}60` }}>◂▸</div>
      </div>
      <div style={{ position: 'absolute', bottom: 14, left: 14, padding: '4px 12px', background: 'rgba(10,14,26,0.7)', backdropFilter: 'blur(8px)', borderRadius: 16, fontSize: 9, fontWeight: 700, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Antes</div>
      <div style={{ position: 'absolute', bottom: 14, right: 14, padding: '4px 12px', background: `${accent}dd`, borderRadius: 16, fontSize: 9, fontWeight: 700, color: '#0a0e1a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Depois</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   BARBEARIA RENDERER v2
   Inspired by: Abel's on Queen, Scissors & Scotch, Gentlemen BC
   Navy bg, warm gold, cursive display, serif body, SVG curls,
   generous spacing, fade-in staggered, bourbon lounge vibe
   ══════════════════════════════════════════════════════════════ */
export default function BarbeariaRenderer({ data }: { data: DemoData }) {
  const c = data.colors;
  const [heroVis, setHeroVis] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [navScroll, setNavScroll] = useState(false);
  const [bookingSvc, setBookingSvc] = useState<ServiceItem | null>(null);
  const [bookingStaff, setBookingStaff] = useState<StaffItem | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingDone, setBookingDone] = useState(false);

  useEffect(() => { setTimeout(() => setHeroVis(true), 150); }, []);
  useEffect(() => {
    const fn = () => setNavScroll(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true }); return () => window.removeEventListener('scroll', fn);
  }, []);

  const staff = data.staff || [];
  const plans = data.plans || [];
  const times = ['09:00', '09:45', '10:30', '11:15', '14:00', '14:45', '15:30', '16:15', '17:00'];
  const fallback = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1400&q=85';

  const handleBook = () => { setBookingDone(true); setTimeout(() => { setBookingDone(false); setBookingSvc(null); setBookingStaff(null); setBookingDate(''); setBookingTime(''); }, 2500); };

  // ── DESIGN SYSTEM — inspired by world's best barbershop sites ──
  const gold = c.primary;
  const navy = '#0a0e1a'; // deep navy, NOT pure black (like Abel's)
  const navyLight = '#111827';
  const cream = '#f4efe6'; // warm cream for accents
  const cursive = "'Georgia', 'Times New Roman', serif"; // display font
  const body = "'Inter', system-ui, sans-serif";

  // Section wrapper with consistent generous padding
  const Sec = ({ children, id, alt }: { children: React.ReactNode; id?: string; alt?: boolean }) => (
    <section id={id} style={{ padding: 'clamp(80px, 12vw, 140px) clamp(20px, 5vw, 64px)', background: alt ? navyLight : navy, position: 'relative' }}>
      <div style={{ maxWidth: 1060, margin: '0 auto' }}>{children}</div>
    </section>
  );

  // Section header — cursive + ornamental
  const SH = ({ label, title, center }: { label: string; title: string; center?: boolean }) => (
    <div style={{ textAlign: center ? 'center' : undefined, marginBottom: 56 }}>
      <span style={{ fontFamily: body, fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', color: gold, textTransform: 'uppercase' }}>{label}</span>
      <h2 style={{ fontFamily: cursive, fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 400, fontStyle: 'italic', color: cream, marginTop: 10, lineHeight: 1.15 }}>{title}</h2>
      <div style={{ width: 40, height: 1, background: `${gold}50`, margin: center ? '16px auto 0' : '16px 0 0' }} />
    </div>
  );

  return (
    <div style={{ background: navy, color: cream, fontFamily: body, minHeight: '100vh' }}>

      {/* ═══ TEXTURE LAYERS ═══ */}
      {/* 1 — Warm paper grain — organic, NOT metallic */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.08, mixBlendMode: 'soft-light',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix values='1 0 0 0 0.1 0 1 0 0 0.05 0 0 1 0 0 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)'/%3E%3C/svg%3E")`,
        backgroundSize: '300px' }} />
      {/* 2 — Fine linen weave — subtle fabric texture */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1v1H0zM4 4h1v1H4z' fill='%23fff' opacity='0.4'/%3E%3C/svg%3E")`,
        backgroundSize: '8px' }} />
      {/* 3 — Warm golden glow from center */}
      <div style={{ position: 'fixed', top: '5%', left: '50%', transform: 'translateX(-50%)', width: '50vw', height: '40vh', background: `radial-gradient(ellipse, ${gold}0c 0%, transparent 50%)`, filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />
      {/* 4 — Vignette — warm, not harsh */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', background: `radial-gradient(ellipse at 50% 40%, transparent 35%, ${navy}cc 100%)` }} />

      {/* ═══ NAVBAR — minimal, cursive logo ═══ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: navScroll ? '12px clamp(20px, 5vw, 64px)' : '20px clamp(20px, 5vw, 64px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: navScroll ? `${navy}f0` : 'transparent',
        backdropFilter: navScroll ? 'blur(16px)' : 'none',
        borderBottom: navScroll ? `1px solid ${gold}10` : 'none',
        transition: 'all 0.5s',
      }}>
        <span style={{ fontFamily: cursive, fontSize: 22, fontStyle: 'italic', color: gold }}>{data.name}</span>
        <div className="barber-nav" style={{ display: 'flex', gap: 28 }}>
          {['Serviços', 'Galeria', 'Equipe', 'Planos', 'Contato'].map(i => (
            <a key={i} href={`#${i.toLowerCase()}`} style={{ color: `${cream}60`, textDecoration: 'none', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', transition: 'color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.color = gold}
              onMouseLeave={e => e.currentTarget.style.color = `${cream}60`}>{i}</a>
          ))}
        </div>
      </nav>

      {/* ═══ HERO — Full bleed image, centered cursive overlay, fade-in staggered ═══ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img src={data.hero.image} alt="" loading="eager" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          filter: 'brightness(0.35) saturate(0.8)',
          transform: heroVis ? 'scale(1.02)' : 'scale(1.1)', transition: 'transform 20s ease',
        }} onError={e => { (e.target as HTMLImageElement).src = fallback; }} />
        {/* Navy overlay — NOT black, warm navy */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${navy}e0 0%, ${navy}90 40%, ${navy}b0 100%)` }} />
        {/* Warm radial glow behind text */}
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '50%', height: '50%', background: `radial-gradient(circle, ${gold}0a 0%, transparent 50%)`, filter: 'blur(60px)' }} />

        <div style={{
          position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 700, padding: '140px 24px 100px',
          opacity: heroVis ? 1 : 0, transform: heroVis ? 'none' : 'translateY(32px)',
          transition: 'all 1s cubic-bezier(0.4,0,0.2,1)',
        }}>
          {/* Small ornamental line + tagline */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 36, opacity: heroVis ? 1 : 0, transition: 'opacity 1.2s ease 0.3s' }}>
            <div style={{ width: 50, height: 1, background: `${gold}40` }} />
            <span style={{ fontFamily: body, fontSize: 10, fontWeight: 600, letterSpacing: '0.25em', color: gold, textTransform: 'uppercase' }}>{data.tagline}</span>
            <div style={{ width: 50, height: 1, background: `${gold}40` }} />
          </div>

          {/* BIG cursive name — like Abel's on Queen */}
          <h1 style={{
            fontFamily: cursive, fontSize: 'clamp(3.5rem, 12vw, 8rem)', fontWeight: 400, fontStyle: 'italic',
            color: cream, lineHeight: 0.9, marginBottom: 28,
            textShadow: `0 4px 40px ${gold}20, 0 0 80px ${navy}`,
            opacity: heroVis ? 1 : 0, transition: 'opacity 1s ease 0.4s',
          }}>
            {data.name}
          </h1>

          {/* Hero subtitle */}
          <p style={{ fontSize: 16, color: `${cream}90`, lineHeight: 1.9, maxWidth: 480, margin: '0 auto 40px', letterSpacing: '0.02em', opacity: heroVis ? 1 : 0, transition: 'opacity 1s ease 0.7s' }}>
            {data.hero.subtitle}
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', opacity: heroVis ? 1 : 0, transition: 'opacity 1s ease 1s' }}>
            <button style={{
              padding: '16px 44px', background: gold, color: navy, border: 'none', borderRadius: 100,
              fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.3s', boxShadow: `0 8px 32px ${gold}30`,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 14px 44px ${gold}45`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 8px 32px ${gold}30`; }}>
              {data.cta.buttonText}
            </button>
            <button style={{
              padding: '16px 44px', background: 'transparent', color: cream,
              border: `1px solid ${cream}25`, borderRadius: 100,
              fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = gold; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${cream}25`; e.currentTarget.style.color = cream; }}>
              Conheça nosso espaço
            </button>
          </div>

          {/* SVG curl ornament below */}
          <CurlDivider color={gold} />
        </div>
      </section>

      {/* ═══ FEATURES — Numbers in a horizontal strip ═══ */}
      <div style={{ padding: '48px clamp(20px, 5vw, 64px)', borderTop: `1px solid ${gold}08`, borderBottom: `1px solid ${gold}08`, background: navyLight }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          {data.features.map((f, i) => (
            <Fade key={i} delay={i * 150}>
              <div style={{ textAlign: 'center', flex: 1, minWidth: 120 }}>
                <div style={{ fontFamily: cursive, fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontStyle: 'italic', color: gold }}>{f.value}</div>
                <div style={{ fontSize: 10, color: `${cream}50`, marginTop: 6, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>{f.label}</div>
              </div>
            </Fade>
          ))}
        </div>
      </div>

      {/* ═══ ABOUT — Image left with rounded corners, text right ═══ */}
      <Sec>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 6vw, 80px)', alignItems: 'center' }} className="barber-grid">
          <Fade>
            <div style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '4/5', boxShadow: `0 32px 80px rgba(0,0,0,0.4), 0 0 60px ${gold}06`, position: 'relative' }}>
              <img src={data.about.image} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).src = fallback; }} />
              {/* Warm gold gradient overlay at bottom */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: `linear-gradient(transparent, ${navy}80)` }} />
            </div>
          </Fade>
          <Fade delay={200}>
            <div>
              <SH label="Nossa história" title={`Conheça a ${data.name}`} />
              <p style={{ color: `${cream}70`, fontSize: 15, lineHeight: 2.1, letterSpacing: '0.01em' }}>{data.about.text}</p>
            </div>
          </Fade>
        </div>
      </Sec>

      <CurlDivider color={gold} />

      {/* ═══ SERVICES — 2-column elegant cards with gold bottom border ═══ */}
      <Sec id="serviços" alt>
        <Fade><SH label="Serviços" title="O que oferecemos" center /></Fade>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {data.services.map((s, i) => (
            <Fade key={s.name} delay={i * 70}>
              <div onClick={() => setBookingSvc(s)} style={{
                padding: '28px 24px', cursor: 'pointer', position: 'relative',
                background: `linear-gradient(160deg, ${gold}05, transparent)`,
                borderRadius: 16, border: `1px solid ${gold}08`,
                borderBottom: `2px solid ${gold}15`,
                transition: 'all 0.4s', display: 'flex', flexDirection: 'column', height: '100%',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderBottomColor = gold; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${gold}0a`; }}
                onMouseLeave={e => { e.currentTarget.style.borderBottomColor = `${gold}15`; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                {s.popular && <span style={{ position: 'absolute', top: 12, right: 12, padding: '3px 12px', background: gold, color: navy, fontSize: 9, fontWeight: 700, borderRadius: 20, letterSpacing: '0.06em' }}>POPULAR</span>}
                <h3 style={{ fontFamily: cursive, fontSize: 19, fontStyle: 'italic', color: cream, marginBottom: 8 }}>{s.name}</h3>
                <p style={{ fontSize: 12, color: `${cream}55`, lineHeight: 1.7, flex: 1 }}>{s.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 14, borderTop: `1px solid ${gold}08` }}>
                  <span style={{ fontFamily: cursive, fontSize: 22, fontStyle: 'italic', color: gold }}>{s.price}</span>
                  {s.time && <span style={{ fontSize: 11, color: `${cream}40` }}>{s.time}</span>}
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </Sec>

      {/* ═══ BOOKING MODAL ═══ */}
      {bookingSvc && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(10,14,26,0.8)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => !bookingDone && setBookingSvc(null)}>
          <div style={{ background: navyLight, border: `1px solid ${gold}15`, borderRadius: 24, padding: 'clamp(24px, 4vw, 40px)', maxWidth: 460, width: 'calc(100% - 32px)', maxHeight: '90vh', overflowY: 'auto', boxShadow: `0 32px 80px rgba(0,0,0,0.5), 0 0 40px ${gold}06` }} onClick={e => e.stopPropagation()}>
            {bookingDone ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', border: `2px solid ${gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 24, color: gold }}>✓</div>
                <h3 style={{ fontFamily: cursive, fontSize: 24, fontStyle: 'italic', color: cream }}>Confirmado</h3>
              </div>
            ) : (<>
              <h3 style={{ fontFamily: cursive, fontSize: 24, fontStyle: 'italic', color: cream, marginBottom: 4 }}>{bookingSvc.name}</h3>
              <p style={{ color: `${cream}50`, fontSize: 13, marginBottom: 28 }}>{bookingSvc.price} · {bookingSvc.time}</p>
              <p style={{ fontSize: 10, fontWeight: 700, color: gold, marginBottom: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Profissional</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {staff.filter(s => s.available).map(s => (
                  <button key={s.name} onClick={() => setBookingStaff(s)} style={{ padding: '10px 18px', background: bookingStaff?.name === s.name ? `${gold}12` : `${gold}05`, border: `1px solid ${bookingStaff?.name === s.name ? gold : `${gold}10`}`, borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: cream }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: `${cream}50` }}>{s.role}</div>
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 10, fontWeight: 700, color: gold, marginBottom: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Data</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {['Hoje', 'Amanhã', 'Sex', 'Sáb'].map(d => (
                  <button key={d} onClick={() => setBookingDate(d)} style={{ padding: '8px 18px', fontSize: 12, background: bookingDate === d ? `${gold}12` : `${gold}05`, border: `1px solid ${bookingDate === d ? gold : `${gold}10`}`, borderRadius: 10, cursor: 'pointer', color: bookingDate === d ? gold : `${cream}50`, fontWeight: bookingDate === d ? 700 : 500, transition: 'all 0.2s' }}>{d}</button>
                ))}
              </div>
              <p style={{ fontSize: 10, fontWeight: 700, color: gold, marginBottom: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Horário</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 28 }}>
                {times.map(t => (
                  <button key={t} onClick={() => setBookingTime(t)} style={{ padding: 10, fontSize: 13, background: bookingTime === t ? gold : `${gold}05`, color: bookingTime === t ? navy : `${cream}50`, border: `1px solid ${bookingTime === t ? gold : `${gold}10`}`, borderRadius: 10, cursor: 'pointer', fontWeight: bookingTime === t ? 700 : 500, transition: 'all 0.2s' }}>{t}</button>
                ))}
              </div>
              <button onClick={handleBook} disabled={!bookingStaff || !bookingDate || !bookingTime} style={{ width: '100%', padding: 16, background: bookingStaff && bookingDate && bookingTime ? gold : `${gold}25`, color: navy, border: 'none', borderRadius: 14, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: bookingStaff && bookingDate && bookingTime ? 'pointer' : 'not-allowed', boxShadow: bookingStaff && bookingDate && bookingTime ? `0 4px 20px ${gold}30` : 'none' }}>Confirmar</button>
            </>)}
          </div>
        </div>
      )}

      <CurlDivider color={gold} flip />

      {/* ═══ BEFORE/AFTER ═══ */}
      <Sec>
        <Fade><SH label="Transformações" title="Antes & Depois" center /></Fade>
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Fade delay={100}><BeforeAfter before={data.gallery[0]} after={data.gallery[1]} accent={gold} /></Fade>
          <Fade delay={250}><BeforeAfter before={data.gallery[2]} after={data.gallery[3]} accent={gold} /></Fade>
        </div>
      </Sec>

      <CurlDivider color={gold} />

      {/* ═══ STAFF — Circular photos with gold ring ═══ */}
      <Sec id="equipe" alt>
        <Fade><SH label="Equipe" title="Nossos Barbeiros" center /></Fade>
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
          {staff.map((s, i) => (
            <Fade key={s.name} delay={i * 100}>
              <div style={{ textAlign: 'center', width: 180 }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', margin: '0 auto 18px', padding: 3, background: `linear-gradient(135deg, ${gold}, ${gold}40)`, boxShadow: `0 8px 32px ${gold}15` }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: navy, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: cursive, fontSize: 32, fontStyle: 'italic', color: gold }}>{s.name[0]}</div>
                </div>
                {s.available && <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#22c55e', border: `3px solid ${navy}`, margin: '-18px auto 6px', position: 'relative', zIndex: 2, boxShadow: '0 0 8px rgba(34,197,94,0.5)' }} />}
                <h3 style={{ fontFamily: cursive, fontSize: 18, fontStyle: 'italic', color: cream, marginBottom: 4 }}>{s.name}</h3>
                <p style={{ fontSize: 12, color: `${cream}45` }}>{s.role}</p>
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 13, color: gold }}>★ {s.rating}</span>
                  <span style={{ fontSize: 11, color: `${cream}35` }}> ({s.reviews})</span>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </Sec>

      <CurlDivider color={gold} flip />

      {/* ═══ GALLERY — CSS columns masonry with rounded corners ═══ */}
      <Sec id="galeria">
        <Fade><SH label="Galeria" title="Nosso Espaço" center /></Fade>
        <div style={{ columns: 3, gap: 16 }} className="barber-gallery">
          {data.gallery.slice(0, 6).map((img, i) => (
            <Fade key={i} delay={i * 80}>
              <div onClick={() => setLightboxIdx(i)} style={{ marginBottom: 16, borderRadius: 16, overflow: 'hidden', cursor: 'pointer', position: 'relative', breakInside: 'avoid' }}>
                <img src={img} alt="" loading="lazy" style={{ width: '100%', display: 'block', transition: 'transform 0.7s ease, filter 0.5s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.filter = 'none'; }}
                  onError={e => { (e.target as HTMLImageElement).src = fallback; }} />
                {/* Gold shimmer on hover */}
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 50%, ${gold}12 100%)`, opacity: 0, transition: 'opacity 0.4s', pointerEvents: 'none' }}
                  ref={el => { if (el) { el.parentElement!.onmouseenter = () => el.style.opacity = '1'; el.parentElement!.onmouseleave = () => el.style.opacity = '0'; } }} />
              </div>
            </Fade>
          ))}
        </div>
      </Sec>

      {/* ═══ LIGHTBOX ═══ */}
      {lightboxIdx !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: `${navy}f5`, backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setLightboxIdx(null)}>
          <button onClick={e => { e.stopPropagation(); setLightboxIdx(lightboxIdx > 0 ? lightboxIdx - 1 : data.gallery.length - 1); }} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, borderRadius: '50%', background: `${gold}0c`, border: `1px solid ${gold}15`, color: cream, fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <img src={data.gallery[lightboxIdx]} alt="" onClick={e => e.stopPropagation()} style={{ maxWidth: '85vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 12 }} />
          <button onClick={e => { e.stopPropagation(); setLightboxIdx(lightboxIdx < data.gallery.length - 1 ? lightboxIdx + 1 : 0); }} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, borderRadius: '50%', background: `${gold}0c`, border: `1px solid ${gold}15`, color: cream, fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
          <button onClick={() => setLightboxIdx(null)} style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRadius: '50%', background: `${gold}0c`, border: `1px solid ${gold}15`, color: cream, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
      )}

      <CurlDivider color={gold} />

      {/* ═══ REVIEWS — Staggered quote cards ═══ */}
      <Sec id="avaliações" alt>
        <Fade><SH label="Avaliações" title="O que dizem" center /></Fade>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {data.reviews.map((rv, i) => (
            <Fade key={i} delay={i * 100}>
              <div style={{ padding: 28, background: `${gold}04`, borderRadius: 16, border: `1px solid ${gold}06`, position: 'relative' }}>
                <span style={{ position: 'absolute', top: 12, right: 20, fontFamily: cursive, fontSize: 56, color: `${gold}0c`, lineHeight: 1, pointerEvents: 'none', fontStyle: 'italic' }}>"</span>
                <div style={{ fontSize: 13, color: gold, letterSpacing: 2, marginBottom: 14 }}>{'★'.repeat(rv.stars)}</div>
                <p style={{ fontFamily: cursive, fontSize: 15, fontStyle: 'italic', color: `${cream}65`, lineHeight: 1.9 }}>"{rv.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${gold}0c`, border: `1px solid ${gold}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: cursive, fontStyle: 'italic', fontSize: 16, color: gold }}>{rv.name[0]}</div>
                  <div><span style={{ fontSize: 13, fontWeight: 600, color: cream }}>{rv.name}</span>{rv.time && <span style={{ fontSize: 10, color: `${cream}35`, marginLeft: 8 }}>{rv.time}</span>}</div>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </Sec>

      <CurlDivider color={gold} flip />

      {/* ═══ PLANS — Pill-shaped buttons, rounded cards ═══ */}
      <Sec id="planos">
        <Fade><SH label="Assinaturas" title="Planos Mensais" center /></Fade>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${plans.length}, 1fr)`, gap: 16, alignItems: 'stretch' }} className="barber-grid">
          {plans.map((p, i) => (
            <Fade key={p.name} delay={i * 120}>
              <div style={{
                padding: p.popular ? 36 : 28, background: p.popular ? `${gold}08` : `${gold}03`,
                borderRadius: 20, border: `1px solid ${p.popular ? `${gold}20` : `${gold}08`}`,
                position: 'relative', display: 'flex', flexDirection: 'column', height: '100%',
                transform: p.popular ? 'scale(1.04)' : 'none',
                boxShadow: p.popular ? `0 16px 48px ${gold}0c` : 'none',
              }}>
                {p.popular && <span style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', padding: '5px 20px', background: gold, color: navy, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 20 }}>Recomendado</span>}
                <h3 style={{ fontFamily: cursive, fontSize: 24, fontStyle: 'italic', color: cream, marginBottom: 8 }}>{p.name}</h3>
                <div style={{ fontFamily: cursive, fontSize: 36, fontStyle: 'italic', color: gold, marginBottom: 24 }}>{p.price}</div>
                <ul style={{ listStyle: 'none', padding: 0, flex: 1 }}>
                  {p.features.map((f, j) => <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', fontSize: 13, color: `${cream}60`, borderTop: j > 0 ? `1px solid ${gold}06` : 'none' }}><span style={{ color: gold, fontSize: 12 }}>✓</span>{f}</li>)}
                </ul>
                <button style={{ width: '100%', padding: 14, marginTop: 20, background: p.popular ? gold : 'transparent', color: p.popular ? navy : gold, border: p.popular ? 'none' : `1px solid ${gold}15`, borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s', boxShadow: p.popular ? `0 4px 20px ${gold}25` : 'none' }}
                  onMouseEnter={e => { if (!p.popular) { e.currentTarget.style.background = `${gold}08`; } }}
                  onMouseLeave={e => { if (!p.popular) { e.currentTarget.style.background = p.popular ? gold : 'transparent'; } }}>Assinar</button>
              </div>
            </Fade>
          ))}
        </div>
      </Sec>

      <CurlDivider color={gold} />

      {/* ═══ FAQ ═══ */}
      {data.faq && data.faq.length > 0 && (
        <Sec alt>
          <Fade><SH label="FAQ" title="Perguntas Frequentes" center /></Fade>
          <div style={{ maxWidth: 650, margin: '0 auto' }}>
            {data.faq.map((item, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${gold}08` }}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: '100%', padding: '22px 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: cursive, fontSize: 16, fontStyle: 'italic', color: cream, textAlign: 'left' }}>{item.q}</span>
                  <span style={{ color: gold, fontSize: 18, transition: 'transform 0.3s', transform: faqOpen === i ? 'rotate(45deg)' : 'none', flexShrink: 0, marginLeft: 16 }}>+</span>
                </button>
                <div style={{ maxHeight: faqOpen === i ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
                  <p style={{ fontSize: 14, color: `${cream}55`, lineHeight: 1.8, paddingBottom: 22 }}>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </Sec>
      )}

      <CurlDivider color={gold} flip />

      {/* ═══ CONTACT ═══ */}
      <Sec id="contato">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 6vw, 80px)' }} className="barber-grid">
          <Fade><div>
            <SH label="Contato" title={data.cta.text} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 8 }}>
              {[{ icon: '☎', label: 'WhatsApp', value: data.phone }, { icon: '⊙', label: 'Endereço', value: data.city }].map((x, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${gold}08`, border: `1px solid ${gold}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: gold, fontSize: 17 }}>{x.icon}</div>
                  <div><div style={{ fontSize: 10, color: `${cream}40`, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{x.label}</div><div style={{ fontSize: 14, color: cream, fontWeight: 500 }}>{x.value}</div></div>
                </div>
              ))}
            </div>
          </div></Fade>
          <Fade delay={200}><div style={{ padding: 28, background: `${gold}04`, borderRadius: 20, border: `1px solid ${gold}08` }}>
            <h3 style={{ fontFamily: cursive, fontSize: 20, fontStyle: 'italic', color: cream, marginBottom: 20 }}>Envie uma mensagem</h3>
            {['Seu nome', 'WhatsApp'].map(ph => <input key={ph} placeholder={ph} style={{ width: '100%', padding: '14px 16px', background: `${navy}`, border: `1px solid ${gold}08`, borderRadius: 12, color: cream, fontSize: 13, outline: 'none', marginBottom: 10, boxSizing: 'border-box', transition: 'border-color 0.3s' }}
              onFocus={e => e.currentTarget.style.borderColor = gold}
              onBlur={e => e.currentTarget.style.borderColor = `${gold}08`} />)}
            <textarea placeholder="Mensagem" rows={3} style={{ width: '100%', padding: '14px 16px', background: navy, border: `1px solid ${gold}08`, borderRadius: 12, color: cream, fontSize: 13, outline: 'none', resize: 'none', marginBottom: 14, boxSizing: 'border-box' }}
              onFocus={e => e.currentTarget.style.borderColor = gold}
              onBlur={e => e.currentTarget.style.borderColor = `${gold}08`} />
            <button style={{ width: '100%', padding: 16, background: gold, color: navy, border: 'none', borderRadius: 100, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: `0 4px 20px ${gold}25`, transition: 'all 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 32px ${gold}40`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = `0 4px 20px ${gold}25`}>Enviar</button>
          </div></Fade>
        </div>
      </Sec>

      {/* ── Footer ── */}
      <footer style={{ padding: '24px clamp(20px, 5vw, 64px)', textAlign: 'center', borderTop: `1px solid ${gold}06` }}>
        <p style={{ color: `${cream}30`, fontSize: 11 }}>© 2026 {data.name}. Todos os direitos reservados.</p>
      </footer>

      {/* ── WhatsApp FAB ── */}
      <a href="#contato" style={{ position: 'fixed', bottom: 68, right: 24, zIndex: 998, width: 50, height: 50, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 24px rgba(37,211,102,0.4)', textDecoration: 'none', fontSize: 22, color: '#fff', transition: 'transform 0.3s' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>◯</a>

      {/* ── Stauf banner ── */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999, padding: '9px 24px', background: `${navy}f5`, backdropFilter: 'blur(16px)', borderTop: `1px solid ${gold}08`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#2dd4bf', fontSize: 13, fontWeight: 700 }}>STAUF.</span>
          <span style={{ color: `${cream}30`, fontSize: 11 }} className="barber-banner-text">Demo visual — Quer um site assim?</span>
        </div>
        <Link to="/" style={{ padding: '6px 18px', background: '#2dd4bf', color: '#0a0a0f', borderRadius: 20, fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>Conheça a Stauf.</Link>
      </div>

      <style>{`
        @media(max-width:768px){
          .barber-nav{display:none!important}
          .barber-grid{grid-template-columns:1fr!important}
          .barber-gallery{columns:2!important}
          .barber-banner-text{display:none}
          section{padding-left:20px!important;padding-right:20px!important}
          h1{font-size:3.5rem!important}
          h2{font-size:1.6rem!important}
        }
        @media(max-width:480px){
          .barber-gallery{columns:1!important}
          h1{font-size:2.5rem!important}
        }
      `}</style>
    </div>
  );
}
