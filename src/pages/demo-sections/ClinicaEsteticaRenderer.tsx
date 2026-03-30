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
  [key: string]: any;
}

/* ── Graceful fade — slow, breathable, like walking into a spa ── */
function Gf({ children, d = 0 }: { children: React.ReactNode; d?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: 0.05 });
    o.observe(el); return () => o.disconnect();
  }, []);
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? 'none' : 'translateY(20px)', transition: `opacity 1s ease ${d}ms, transform 1s ease ${d}ms` }}>{children}</div>;
}

/* ══════════════════════════════════════════════════════════════════
   CLÍNICA DE ESTÉTICA RENDERER
   Inspired by: Destination Aesthetics, Beverly Hills Med Spa
   LIGHT bg (cream/off-white), Playfair-style serif, rose gold,
   MASSIVE white space, thin borders, clinical elegance, zero noise
   The OPPOSITE of barber (dark navy) and gym (black industrial)
   ══════════════════════════════════════════════════════════════════ */
export default function ClinicaEsteticaRenderer({ data }: { data: DemoData }) {
  const c = data.colors;
  const [heroVis, setHeroVis] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [navScroll, setNavScroll] = useState(false);
  const [bookingSvc, setBookingSvc] = useState<ServiceItem | null>(null);
  const [bookingPicker, setBookingPicker] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [bookingStaff, setBookingStaff] = useState<StaffItem | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingDone, setBookingDone] = useState(false);

  useEffect(() => { setTimeout(() => setHeroVis(true), 200); }, []);
  useEffect(() => { const fn = () => setNavScroll(window.scrollY > 60); window.addEventListener('scroll', fn, { passive: true }); return () => window.removeEventListener('scroll', fn); }, []);

  const staff = data.staff || [];
  const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  const handleBook = () => { setBookingDone(true); setTimeout(() => { setBookingDone(false); setBookingSvc(null); setBookingPicker(false); setBookingStaff(null); setBookingDate(''); setBookingTime(''); }, 2500); };
  const plans = data.plans || [];
  const fallback = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1400&q=85';

  // ── DESIGN SYSTEM — Ultra-luxury light aesthetic clinic ──
  const rose = c.primary; // #b08d7a rose gold / tan
  const cream = c.bg; // #faf7f5
  const dark = c.text; // #2a2320
  const muted = c.textMuted; // #8a7e77
  const white = '#ffffff';
  const gold = '#c9a96e'; // subtle warm gold for luxury accents
  const goldLight = '#d4b87a';
  const heading = "'Georgia', 'Playfair Display', 'Times New Roman', serif";
  const body = "'Inter', system-ui, sans-serif";

  // Generous section wrapper
  const Sec = ({ children, id, alt }: { children: React.ReactNode; id?: string; alt?: boolean }) => (
    <section id={id} style={{ padding: 'clamp(80px, 14vw, 160px) clamp(24px, 6vw, 80px)', background: alt ? white : cream }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>{children}</div>
    </section>
  );

  // Section header — thin, elegant, centered with gold ornament
  const SH = ({ label, title, sub }: { label: string; title: string; sub?: string }) => (
    <div style={{ textAlign: 'center', marginBottom: 64 }}>
      <span style={{ fontFamily: body, fontSize: 10, fontWeight: 500, letterSpacing: '0.25em', color: gold, textTransform: 'uppercase' }}>{label}</span>
      <h2 style={{ fontFamily: heading, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 400, fontStyle: 'italic', color: dark, marginTop: 12, lineHeight: 1.2 }}>{title}</h2>
      {sub && <p style={{ fontFamily: body, fontSize: 14, color: muted, marginTop: 14, maxWidth: 480, margin: '14px auto 0', lineHeight: 1.8 }}>{sub}</p>}
      {/* Gold ornamental divider */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 20 }}>
        <div style={{ width: 30, height: 1, background: `linear-gradient(90deg, transparent, ${gold}60)` }} />
        <div style={{ width: 5, height: 5, borderRadius: '50%', border: `1px solid ${gold}50`, background: 'transparent' }} />
        <div style={{ width: 30, height: 1, background: `linear-gradient(90deg, ${gold}60, transparent)` }} />
      </div>
    </div>
  );

  // Thin gold line divider
  const ThinLine = () => <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 clamp(24px, 6vw, 80px)' }}><div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${gold}20, transparent)` }} /></div>;

  return (
    <div style={{ background: cream, color: dark, fontFamily: body, minHeight: '100vh' }}>

      {/* ═══ Subtle luxury textures ═══ */}
      {/* Warm golden glow — top center */}
      <div style={{ position: 'fixed', top: '5%', left: '50%', transform: 'translateX(-50%)', width: '50vw', height: '25vh', background: `radial-gradient(ellipse, ${gold}08 0%, transparent 50%)`, filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />
      {/* Rose glow — bottom */}
      <div style={{ position: 'fixed', bottom: '10%', left: '30%', width: '40vw', height: '20vh', background: `radial-gradient(ellipse, ${rose}05 0%, transparent 50%)`, filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />
      {/* Ultra-subtle gold grain texture */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.015, mixBlendMode: 'multiply',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px' }} />

      {/* ═══ NAVBAR — ultra minimal, thin, breathable ═══ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: navScroll ? '14px clamp(24px, 6vw, 80px)' : '24px clamp(24px, 6vw, 80px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: navScroll ? `${cream}f5` : `${cream}cc`,
        backdropFilter: navScroll ? 'blur(20px)' : 'none',
        borderBottom: navScroll ? `1px solid ${rose}10` : 'none',
        transition: 'all 0.6s',
      }}>
        <span style={{ fontFamily: heading, fontSize: 20, fontWeight: 400, fontStyle: 'italic', color: dark, letterSpacing: '0.02em' }}>{data.name}</span>
        <div className="clinic-nav" style={{ display: 'flex', gap: 32 }}>
          {['Tratamentos', 'Equipe', 'Galeria', 'Planos', 'Contato'].map(i => (
            <a key={i} href={`#${i.toLowerCase()}`} style={{ color: muted, textDecoration: 'none', fontSize: 11, fontWeight: 400, letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.color = dark}
              onMouseLeave={e => e.currentTarget.style.color = muted}>{i}</a>
          ))}
        </div>
        <button className="clinic-burger" onClick={() => setMobileMenu(!mobileMenu)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8, zIndex: 101 }}>
          <div style={{ width: 20, height: 1.5, background: rose, marginBottom: 5, transition: 'all 0.3s', transform: mobileMenu ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <div style={{ width: 20, height: 1.5, background: rose, marginBottom: 5, transition: 'all 0.3s', opacity: mobileMenu ? 0 : 1 }} />
          <div style={{ width: 20, height: 1.5, background: rose, transition: 'all 0.3s', transform: mobileMenu ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </nav>

      {mobileMenu && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99, background: `${white}f8`, backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          {['Tratamentos', 'Equipe', 'Galeria', 'Planos', 'Contato'].map((i, idx) => (
            <a key={i} href={`#${i.toLowerCase()}`} onClick={() => setMobileMenu(false)}
              style={{ fontFamily: heading, fontSize: 24, fontStyle: 'italic', color: dark, textDecoration: 'none', opacity: 0, animation: `clinicFadeIn 0.4s ease ${idx * 0.08}s forwards` }}>{i}</a>
          ))}
          <button onClick={() => { setMobileMenu(false); setBookingPicker(true); }}
            style={{ marginTop: 12, padding: '14px 36px', background: rose, color: white, border: 'none', borderRadius: 100, fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
            Agendar agora
          </button>
        </div>
      )}

      {/* ═══ HERO — Split: text left, image right, light bg, ultra clean ═══ */}
      <section style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', position: 'relative' }} className="clinic-hero-grid">
        {/* Left — content on cream bg */}
        <div className="clinic-hero-text" style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(140px, 15vw, 200px) clamp(32px, 6vw, 80px) clamp(60px, 8vw, 100px)',
          opacity: heroVis ? 1 : 0, transform: heroVis ? 'none' : 'translateY(24px)',
          transition: 'all 1.2s ease',
        }}>
          <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.3em', color: rose, textTransform: 'uppercase', marginBottom: 20 }}>{data.tagline}</span>

          <h1 style={{
            fontFamily: heading, fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 400, fontStyle: 'italic',
            color: dark, lineHeight: 1.15, marginBottom: 24,
          }}>
            {data.hero.title}
          </h1>

          <p style={{ fontSize: 15, color: muted, lineHeight: 2, maxWidth: 420, marginBottom: 40, fontWeight: 300 }}>
            {data.hero.subtitle}
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button onClick={() => setBookingPicker(true)} style={{
              padding: '16px 40px', background: rose, color: white, border: 'none', borderRadius: 100,
              fontSize: 11, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.4s', boxShadow: `0 8px 32px ${rose}25`,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${rose}35`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 8px 32px ${rose}25`; }}>
              {data.cta.buttonText}
            </button>
            <button style={{
              padding: '16px 40px', background: 'transparent', color: dark,
              border: `1px solid ${rose}30`, borderRadius: 100,
              fontSize: 11, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.4s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = rose; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${rose}30`; }}>
              Nossos tratamentos
            </button>
          </div>

          {/* Trust badges — credentials */}
          <div style={{ display: 'flex', gap: 24, marginTop: 48, flexWrap: 'wrap' }}>
            {['ANVISA', 'CRM Verificado', 'ISO 9001'].map(b => (
              <span key={b} style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.12em', color: gold, textTransform: 'uppercase', padding: '6px 14px', border: `1px solid ${gold}25`, borderRadius: 100, background: `${gold}05` }}>{b}</span>
            ))}
          </div>
        </div>

        {/* Right — full bleed image */}
        <div style={{ position: 'relative', overflow: 'hidden' }} className="clinic-hero-img">
          <img src={data.hero.image} alt="" loading="eager" style={{
            width: '100%', height: '100%', objectFit: 'cover', minHeight: '100vh',
            transform: heroVis ? 'scale(1)' : 'scale(1.05)', transition: 'transform 2s ease',
          }} onError={e => { (e.target as HTMLImageElement).src = fallback; }} />
          {/* Soft cream fade on left edge */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${cream} 0%, ${cream}80 3%, transparent 20%)` }} />
          {/* Bottom fade */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '15%', background: `linear-gradient(transparent, ${cream})` }} />
        </div>
      </section>

      {/* ═══ FEATURES — horizontal strip, thin and elegant ═══ */}
      <div style={{ padding: '48px clamp(24px, 6vw, 80px)', borderTop: `1px solid ${gold}12`, borderBottom: `1px solid ${gold}12`, background: white }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          {data.features.map((f, i) => (
            <Gf key={i} d={i * 150}>
              <div style={{ textAlign: 'center', flex: 1, minWidth: 120 }}>
                <div style={{ fontFamily: heading, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontStyle: 'italic', color: gold }}>{f.value}</div>
                <div style={{ fontSize: 10, color: muted, marginTop: 6, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 400 }}>{f.label}</div>
              </div>
            </Gf>
          ))}
        </div>
      </div>

      {/* ═══ ABOUT — Image left with soft rounded corners, text right ═══ */}
      <Sec>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 'clamp(40px, 8vw, 100px)', alignItems: 'center' }} className="clinic-grid">
          <Gf>
            <div style={{ borderRadius: 32, overflow: 'hidden', aspectRatio: '4/5', boxShadow: `0 24px 64px ${rose}10`, border: `1px solid ${gold}18`, position: 'relative' }}>
              <img src={data.about.image} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).src = fallback; }} />
              {/* Subtle gold shimmer at bottom */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '20%', background: `linear-gradient(transparent, ${gold}08)` }} />
            </div>
          </Gf>
          <Gf d={200}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.25em', color: gold, textTransform: 'uppercase' }}>Sobre nós</span>
              <h2 style={{ fontFamily: heading, fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 400, fontStyle: 'italic', color: dark, marginTop: 12, marginBottom: 20, lineHeight: 1.25 }}>
                Ciência e arte a serviço da sua beleza
              </h2>
              <p style={{ color: muted, fontSize: 14, lineHeight: 2.2, fontWeight: 300 }}>{data.about.text}</p>
            </div>
          </Gf>
        </div>
      </Sec>

      <ThinLine />

      {/* ═══ TREATMENTS — Clean grid with thin borders, no heavy cards ═══ */}
      <Sec id="tratamentos" alt>
        <Gf><SH label="Tratamentos" title="Procedimentos exclusivos" sub="Tecnologia avançada e protocolos personalizados para resultados naturais e duradouros." /></Gf>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1, background: `${gold}12`, borderRadius: 24, overflow: 'hidden', border: `1px solid ${gold}10` }}>
          {data.services.map((s, i) => (
            <Gf key={s.name} d={i * 60}>
              <div onClick={() => setBookingSvc(s)} style={{
                padding: '32px 28px', background: white, cursor: 'pointer',
                transition: 'all 0.4s', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%',
                borderBottom: `2px solid transparent`,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = `${gold}04`; e.currentTarget.style.borderBottomColor = `${gold}30`; }}
                onMouseLeave={e => { e.currentTarget.style.background = white; e.currentTarget.style.borderBottomColor = 'transparent'; }}>
                {s.popular && <span style={{ position: 'absolute', top: 16, right: 16, padding: '4px 14px', background: `linear-gradient(135deg, ${gold}18, ${gold}08)`, color: gold, fontSize: 9, fontWeight: 600, borderRadius: 100, letterSpacing: '0.08em', textTransform: 'uppercase', border: `1px solid ${gold}15` }}>Popular</span>}
                <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', color: gold, textTransform: 'uppercase', marginBottom: 10 }}>{s.category}</span>
                <h3 style={{ fontFamily: heading, fontSize: 18, fontWeight: 400, fontStyle: 'italic', color: dark, marginBottom: 8 }}>{s.name}</h3>
                <p style={{ fontSize: 13, color: muted, lineHeight: 1.8, flex: 1, fontWeight: 300 }}>{s.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, paddingTop: 16, borderTop: `1px solid ${gold}10` }}>
                  <span style={{ fontFamily: heading, fontSize: 18, fontStyle: 'italic', color: dark }}>{s.price}</span>
                  {s.time && <span style={{ fontSize: 11, color: muted, fontWeight: 300 }}>{s.time}</span>}
                </div>
              </div>
            </Gf>
          ))}
        </div>
      </Sec>

      <ThinLine />

      {/* ═══ STAFF — Doctors with credentials prominently displayed ═══ */}
      <Sec id="equipe">
        <Gf><SH label="Equipe" title="Nossos especialistas" sub="Profissionais referência em estética avançada no Paraná." /></Gf>
        <div style={{ display: 'flex', gap: 'clamp(24px, 4vw, 48px)', justifyContent: 'center', flexWrap: 'wrap' }}>
          {staff.map((s, i) => (
            <Gf key={s.name} d={i * 120}>
              <div style={{ textAlign: 'center', width: 'clamp(200px, 25vw, 260px)' }}>
                {/* Elegant circular photo with rose gold ring */}
                <div style={{ width: 120, height: 120, borderRadius: '50%', margin: '0 auto 20px', padding: 3, background: `linear-gradient(135deg, ${gold}50, ${gold}20)` }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: `${rose}08`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: heading, fontSize: 36, fontStyle: 'italic', color: rose }}>{s.name.split(' ').pop()?.[0] || s.name[0]}</div>
                </div>
                {s.available && <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#4ade80', border: `3px solid ${cream}`, margin: '-16px auto 8px', position: 'relative', zIndex: 2 }} />}
                <h3 style={{ fontFamily: heading, fontSize: 17, fontWeight: 400, fontStyle: 'italic', color: dark, marginBottom: 4 }}>{s.name}</h3>
                {/* Credential — prominently displayed */}
                <p style={{ fontSize: 11, color: rose, fontWeight: 500, letterSpacing: '0.04em', marginBottom: 8 }}>{s.role}</p>
                <div style={{ fontSize: 12 }}>
                  <span style={{ color: gold }}>★ {s.rating}</span>
                  <span style={{ color: `${muted}80` }}> · {s.reviews} avaliações</span>
                </div>
              </div>
            </Gf>
          ))}
        </div>
      </Sec>

      <ThinLine />

      {/* ═══ GALLERY — Clean grid with large rounded corners, soft shadows ═══ */}
      <Sec id="galeria" alt>
        <Gf><SH label="Galeria" title="Nosso espaço" sub="Ambiente projetado para seu conforto e bem-estar." /></Gf>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="clinic-gallery">
          {data.gallery.slice(0, 6).map((img, i) => (
            <Gf key={i} d={i * 80}>
              <div onClick={() => setLightboxIdx(i)} style={{ borderRadius: 20, overflow: 'hidden', aspectRatio: i === 0 || i === 5 ? '1/1' : '4/3', cursor: 'pointer', boxShadow: `0 8px 32px ${rose}08`, transition: 'all 0.5s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 48px ${rose}12`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 8px 32px ${rose}08`; }}>
                <img src={img} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                  onError={e => { (e.target as HTMLImageElement).src = fallback; }} />
              </div>
            </Gf>
          ))}
        </div>
      </Sec>

      {/* ═══ LIGHTBOX ═══ */}
      {lightboxIdx !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: `${cream}f8`, backdropFilter: 'blur(24px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setLightboxIdx(null)}>
          <button onClick={e => { e.stopPropagation(); setLightboxIdx(lightboxIdx > 0 ? lightboxIdx - 1 : data.gallery.length - 1); }} style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, borderRadius: '50%', background: white, border: `1px solid ${rose}15`, color: dark, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${rose}10` }}>‹</button>
          <img src={data.gallery[lightboxIdx]} alt="" onClick={e => e.stopPropagation()} style={{ maxWidth: '80vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: 16, boxShadow: `0 24px 80px ${rose}15` }} />
          <button onClick={e => { e.stopPropagation(); setLightboxIdx(lightboxIdx < data.gallery.length - 1 ? lightboxIdx + 1 : 0); }} style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', width: 48, height: 48, borderRadius: '50%', background: white, border: `1px solid ${rose}15`, color: dark, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${rose}10` }}>›</button>
          <button onClick={() => setLightboxIdx(null)} style={{ position: 'absolute', top: 24, right: 24, width: 40, height: 40, borderRadius: '50%', background: white, border: `1px solid ${rose}15`, color: muted, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
      )}

      <ThinLine />

      {/* ═══ REVIEWS — Testimonials in soft cards ═══ */}
      <Sec>
        <Gf><SH label="Depoimentos" title="O que nossas pacientes dizem" /></Gf>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {data.reviews.map((rv, i) => (
            <Gf key={i} d={i * 100}>
              <div style={{ padding: 28, background: white, borderRadius: 20, border: `1px solid ${rose}08`, boxShadow: `0 4px 24px ${rose}06`, position: 'relative' }}>
                <span style={{ position: 'absolute', top: 16, right: 20, fontFamily: heading, fontSize: 48, color: `${rose}12`, lineHeight: 1, fontStyle: 'italic' }}>"</span>
                <div style={{ fontSize: 12, color: gold, letterSpacing: 2, marginBottom: 14 }}>{'★'.repeat(rv.stars)}</div>
                <p style={{ fontFamily: heading, fontSize: 14, fontStyle: 'italic', color: `${dark}cc`, lineHeight: 2 }}>"{rv.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${rose}0c`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: heading, fontStyle: 'italic', fontSize: 15, color: rose }}>{rv.name[0]}</div>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: dark }}>{rv.name}</span>
                    {rv.time && <span style={{ fontSize: 10, color: `${muted}80`, marginLeft: 8 }}>{rv.time}</span>}
                  </div>
                </div>
              </div>
            </Gf>
          ))}
        </div>
      </Sec>

      <ThinLine />

      {/* ═══ PLANS — Elegant cards with rose gold accents ═══ */}
      <Sec id="planos" alt>
        <Gf><SH label="Planos" title="Programas de tratamento" sub="Invista na sua beleza com acompanhamento contínuo." /></Gf>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${plans.length}, 1fr)`, gap: 20, alignItems: 'stretch' }} className="clinic-grid">
          {plans.map((p, i) => (
            <Gf key={p.name} d={i * 120}>
              <div style={{
                padding: p.popular ? 40 : 32, background: white, borderRadius: 24,
                border: `1px solid ${p.popular ? gold : `${gold}12`}`,
                boxShadow: p.popular ? `0 16px 56px ${gold}10, 0 0 0 1px ${gold}15` : `0 4px 24px ${rose}06`,
                position: 'relative', display: 'flex', flexDirection: 'column', height: '100%',
                transform: p.popular ? 'scale(1.03)' : 'none',
              }}>
                {p.popular && <span style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', padding: '6px 24px', background: `linear-gradient(135deg, ${gold}, ${goldLight})`, color: white, fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: 100, boxShadow: `0 4px 16px ${gold}30` }}>Mais escolhido</span>}
                <h3 style={{ fontFamily: heading, fontSize: 22, fontStyle: 'italic', color: dark, marginBottom: 8 }}>{p.name}</h3>
                <div style={{ fontFamily: heading, fontSize: 34, fontStyle: 'italic', color: gold, marginBottom: 28 }}>{p.price}</div>
                <ul style={{ listStyle: 'none', padding: 0, flex: 1 }}>
                  {p.features.map((f, j) => <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', fontSize: 13, color: `${dark}bb`, borderTop: j > 0 ? `1px solid ${gold}08` : 'none', fontWeight: 300 }}><span style={{ color: gold, fontSize: 11 }}>✓</span>{f}</li>)}
                </ul>
                <button style={{
                  width: '100%', padding: 16, marginTop: 24,
                  background: p.popular ? `linear-gradient(135deg, ${gold}, ${goldLight})` : 'transparent', color: p.popular ? white : dark,
                  border: p.popular ? 'none' : `1px solid ${gold}20`, borderRadius: 100,
                  fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.4s',
                  boxShadow: p.popular ? `0 4px 24px ${gold}25` : 'none',
                }}
                  onMouseEnter={e => { if (!p.popular) e.currentTarget.style.background = `${rose}06`; }}
                  onMouseLeave={e => { if (!p.popular) e.currentTarget.style.background = 'transparent'; }}>
                  Começar agora
                </button>
              </div>
            </Gf>
          ))}
        </div>
      </Sec>

      <ThinLine />

      {/* ═══ FAQ ═══ */}
      {data.faq && data.faq.length > 0 && (
        <Sec>
          <Gf><SH label="Dúvidas" title="Perguntas frequentes" /></Gf>
          <div style={{ maxWidth: 650, margin: '0 auto' }}>
            {data.faq.map((item, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${rose}08` }}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: '100%', padding: '24px 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: heading, fontSize: 15, fontStyle: 'italic', color: dark, textAlign: 'left' }}>{item.q}</span>
                  <span style={{ color: rose, fontSize: 18, transition: 'transform 0.3s', transform: faqOpen === i ? 'rotate(45deg)' : 'none', flexShrink: 0, marginLeft: 16 }}>+</span>
                </button>
                <div style={{ maxHeight: faqOpen === i ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.5s ease' }}>
                  <p style={{ fontSize: 14, color: muted, lineHeight: 1.9, paddingBottom: 24, fontWeight: 300 }}>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </Sec>
      )}

      <ThinLine />

      {/* ═══ CONTACT ═══ */}
      <Sec id="contato" alt>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 6vw, 80px)' }} className="clinic-grid">
          <Gf><div>
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.25em', color: rose, textTransform: 'uppercase' }}>Contato</span>
            <h2 style={{ fontFamily: heading, fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 400, fontStyle: 'italic', color: dark, marginTop: 12, marginBottom: 28, lineHeight: 1.25 }}>{data.cta.text}</h2>
            {[{ icon: '☎', l: 'WhatsApp', v: data.phone }, { icon: '⊙', l: 'Localização', v: data.city }].map((x, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${rose}08`, border: `1px solid ${rose}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: rose, fontSize: 16 }}>{x.icon}</div>
                <div><div style={{ fontSize: 10, color: muted, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 400 }}>{x.l}</div><div style={{ fontSize: 14, color: dark, fontWeight: 500 }}>{x.v}</div></div>
              </div>
            ))}
          </div></Gf>
          <Gf d={200}><div style={{ padding: 32, background: white, borderRadius: 24, border: `1px solid ${rose}08`, boxShadow: `0 4px 24px ${rose}06` }}>
            <h3 style={{ fontFamily: heading, fontSize: 18, fontStyle: 'italic', color: dark, marginBottom: 20 }}>Agende sua avaliação</h3>
            {['Seu nome', 'WhatsApp', 'E-mail'].map(ph => <input key={ph} placeholder={ph} style={{ width: '100%', padding: '14px 18px', background: cream, border: `1px solid ${rose}10`, borderRadius: 14, color: dark, fontSize: 13, outline: 'none', marginBottom: 10, boxSizing: 'border-box', transition: 'border-color 0.3s', fontWeight: 300 }}
              onFocus={e => e.currentTarget.style.borderColor = rose}
              onBlur={e => e.currentTarget.style.borderColor = `${rose}10`} />)}
            <textarea placeholder="Qual tratamento te interessa?" rows={3} style={{ width: '100%', padding: '14px 18px', background: cream, border: `1px solid ${rose}10`, borderRadius: 14, color: dark, fontSize: 13, outline: 'none', resize: 'none', marginBottom: 16, boxSizing: 'border-box', fontWeight: 300 }}
              onFocus={e => e.currentTarget.style.borderColor = rose}
              onBlur={e => e.currentTarget.style.borderColor = `${rose}10`} />
            <button style={{ width: '100%', padding: 16, background: rose, color: white, border: 'none', borderRadius: 100, fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: `0 4px 24px ${rose}20`, transition: 'all 0.4s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 32px ${rose}35`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = `0 4px 24px ${rose}20`}>Enviar</button>
          </div></Gf>
        </div>

        {/* Google Maps */}
        <Gf d={300}>
          <div style={{ marginTop: 40, borderRadius: 20, overflow: 'hidden', border: `1px solid ${rose}10`, height: 280 }}>
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCdpxxgZRYNVs2cQ_X8SOZchL-iVl48tmU&q=${encodeURIComponent(data.name + ' ' + data.city)}`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              loading="lazy"
              allowFullScreen
            />
          </div>
        </Gf>
      </Sec>

      {/* ═══ SERVICE PICKER MODAL (from hero CTA) ═══ */}
      {bookingPicker && !bookingSvc && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: `${cream}e0`, backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setBookingPicker(false)}>
          <div style={{ background: white, border: `1px solid ${rose}15`, borderRadius: 24, padding: 'clamp(24px, 4vw, 40px)', maxWidth: 520, width: 'calc(100% - 32px)', maxHeight: '85vh', overflowY: 'auto', boxShadow: `0 32px 80px rgba(0,0,0,0.08)` }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <span style={{ fontFamily: body, fontSize: 10, fontWeight: 500, letterSpacing: '0.25em', color: rose, textTransform: 'uppercase' }}>Agendar</span>
              <h3 style={{ fontFamily: heading, fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 400, fontStyle: 'italic', color: dark, marginTop: 8 }}>Escolha o tratamento</h3>
              <div style={{ width: 40, height: 1, background: `${rose}40`, margin: '12px auto 0' }} />
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {data.services.map(s => (
                <button key={s.name} onClick={() => setBookingSvc(s)} style={{
                  padding: '18px 20px', background: `${rose}04`, border: `1px solid ${rose}10`, borderRadius: 14,
                  cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'all 0.4s', textAlign: 'left',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = rose; e.currentTarget.style.background = `${rose}08`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${rose}10`; e.currentTarget.style.background = `${rose}04`; }}>
                  <div>
                    <div style={{ fontFamily: heading, fontSize: 16, fontStyle: 'italic', color: dark }}>{s.name}</div>
                    {s.time && <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{s.time}</div>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {s.popular && <span style={{ padding: '2px 10px', background: `${rose}15`, color: rose, fontSize: 8, fontWeight: 500, borderRadius: 20 }}>Popular</span>}
                    <span style={{ fontFamily: heading, fontSize: 18, fontStyle: 'italic', color: rose }}>{s.price}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ BOOKING MODAL ═══ */}
      {bookingSvc && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: `${cream}e0`, backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => { if (!bookingDone) { setBookingSvc(null); setBookingPicker(false); } }}>
          <div style={{ background: white, border: `1px solid ${rose}15`, borderRadius: 24, padding: 'clamp(24px, 4vw, 40px)', maxWidth: 460, width: 'calc(100% - 32px)', maxHeight: '90vh', overflowY: 'auto', boxShadow: `0 32px 80px rgba(0,0,0,0.08)` }} onClick={e => e.stopPropagation()}>
            {bookingDone ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', border: `2px solid ${rose}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 24, color: rose }}>✓</div>
                <h3 style={{ fontFamily: heading, fontSize: 22, fontStyle: 'italic', color: dark }}>Agendamento confirmado</h3>
              </div>
            ) : (<>
              <h3 style={{ fontFamily: heading, fontSize: 22, fontStyle: 'italic', color: dark, marginBottom: 4 }}>{bookingSvc.name}</h3>
              <p style={{ color: muted, fontSize: 13, marginBottom: 28 }}>{bookingSvc.price} · {bookingSvc.time}</p>
              {staff.filter(s => s.available).length > 0 && <>
                <p style={{ fontSize: 10, fontWeight: 500, color: rose, marginBottom: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Profissional</p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                  {staff.filter(s => s.available).map(s => (
                    <button key={s.name} onClick={() => setBookingStaff(s)} style={{ padding: '10px 18px', background: bookingStaff?.name === s.name ? `${rose}10` : `${rose}04`, border: `1px solid ${bookingStaff?.name === s.name ? rose : `${rose}10`}`, borderRadius: 12, cursor: 'pointer', transition: 'all 0.3s' }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: dark }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: muted }}>{s.role}</div>
                    </button>
                  ))}
                </div>
              </>}
              <p style={{ fontSize: 10, fontWeight: 500, color: rose, marginBottom: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Data</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {['Hoje', 'Amanhã', 'Qua', 'Qui', 'Sex'].map(d => (
                  <button key={d} onClick={() => setBookingDate(d)} style={{ padding: '8px 18px', fontSize: 12, background: bookingDate === d ? `${rose}10` : `${rose}04`, border: `1px solid ${bookingDate === d ? rose : `${rose}10`}`, borderRadius: 10, cursor: 'pointer', color: bookingDate === d ? rose : muted, fontWeight: bookingDate === d ? 600 : 400, transition: 'all 0.3s' }}>{d}</button>
                ))}
              </div>
              <p style={{ fontSize: 10, fontWeight: 500, color: rose, marginBottom: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Horário</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 28 }}>
                {times.map(t => (
                  <button key={t} onClick={() => setBookingTime(t)} style={{ padding: 10, fontSize: 13, background: bookingTime === t ? rose : `${rose}04`, color: bookingTime === t ? white : muted, border: `1px solid ${bookingTime === t ? rose : `${rose}10`}`, borderRadius: 10, cursor: 'pointer', fontWeight: bookingTime === t ? 600 : 400, transition: 'all 0.3s' }}>{t}</button>
                ))}
              </div>
              <button onClick={handleBook} disabled={!bookingDate || !bookingTime} style={{ width: '100%', padding: 16, background: bookingDate && bookingTime ? rose : `${rose}30`, color: white, border: 'none', borderRadius: 14, fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: bookingDate && bookingTime ? 'pointer' : 'not-allowed', transition: 'all 0.3s' }}>Confirmar agendamento</button>
            </>)}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ padding: '24px clamp(24px, 6vw, 80px)', textAlign: 'center', borderTop: `1px solid ${rose}08` }}>
        <p style={{ color: `${muted}80`, fontSize: 11, fontWeight: 300 }}>© 2026 {data.name}. Todos os direitos reservados.</p>
      </footer>

      {/* WhatsApp */}
      <a href="#contato" style={{ position: 'fixed', bottom: 68, right: 24, zIndex: 998, width: 50, height: 50, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 24px rgba(37,211,102,0.3)', textDecoration: 'none', fontSize: 22, color: '#fff', transition: 'transform 0.3s' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>◯</a>

      {/* Stauf banner */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999, padding: '9px 24px', background: `${white}f5`, backdropFilter: 'blur(16px)', borderTop: `1px solid ${rose}08`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#2dd4bf', fontSize: 13, fontWeight: 700 }}>STAUF.</span>
          <span style={{ color: muted, fontSize: 11 }} className="clinic-banner-text">Demo visual — Quer um site assim?</span>
        </div>
        <Link to="/" style={{ padding: '6px 18px', background: '#2dd4bf', color: '#0a0a0f', borderRadius: 20, fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>Conheça a Stauf.</Link>
      </div>

      <style>{`
        @keyframes clinicFadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @media(max-width:768px){
          .clinic-nav{display:none!important}
          .clinic-burger{display:block!important}
          .clinic-hero-grid{grid-template-columns:1fr!important}
          .clinic-hero-img{max-height:40vh}
          .clinic-hero-text{padding:140px 20px 60px!important}
          .clinic-grid{grid-template-columns:1fr!important}
          .clinic-gallery{grid-template-columns:1fr 1fr!important}
          .clinic-banner-text{display:none}
          h1{font-size:2.2rem!important}
          h2{font-size:1.5rem!important}
        }
        @media(max-width:480px){
          .clinic-gallery{grid-template-columns:1fr!important}
          h1{font-size:1.8rem!important}
        }
      `}</style>
    </div>
  );
}
