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
  [key: string]: any;
}

/* ── Snap-in reveal (snappy, NOT smooth — like lifting a weight) ── */
function Snap({ children, d = 0 }: { children: React.ReactNode; d?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: 0.05 });
    o.observe(el); return () => o.disconnect();
  }, []);
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? 'none' : 'translateY(14px)', transition: `opacity 0.35s ease ${d}ms, transform 0.35s cubic-bezier(0.2,0,0,1) ${d}ms` }}>{children}</div>;
}

/* ── Counter ── */
function Counter({ value, suffix, label, accent }: { value: number; suffix?: string; label: string; accent: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const go = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting && !go.current) { go.current = true; let c = 0; const inc = value / 40; const t = setInterval(() => { c += inc; if (c >= value) { setN(value); clearInterval(t); } else setN(Math.floor(c)); }, 28); } }, { threshold: 0.3 });
    o.observe(el); return () => o.disconnect();
  }, [value]);
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <span style={{ fontFamily: "'Georgia','Times New Roman',serif", fontSize: 'clamp(3.5rem, 10vw, 6rem)', fontWeight: 700, color: accent, lineHeight: 0.9, display: 'block', textShadow: `0 4px 0 rgba(0,0,0,0.3), 0 0 60px ${accent}30` }}>{n.toLocaleString('pt-BR')}{suffix}</span>
      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#555', marginTop: 10, display: 'block' }}>{label}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ACADEMIA RENDERER v2
   Inspired by: World Gym, Ironmuscle, T Nation, Muscle templates
   Black bg, serif BOLD headings (Clarendon-style), clip-path shapes,
   heavy shadows, dense layout, skewed elements, industrial concrete
   ══════════════════════════════════════════════════════════════════ */
export default function AcademiaRenderer({ data }: { data: DemoData }) {
  const c = data.colors;
  const [heroVis, setHeroVis] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [navScroll, setNavScroll] = useState(false);

  useEffect(() => { setTimeout(() => setHeroVis(true), 80); }, []);
  useEffect(() => { const fn = () => setNavScroll(window.scrollY > 50); window.addEventListener('scroll', fn, { passive: true }); return () => window.removeEventListener('scroll', fn); }, []);

  
  const plans = data.plans || [];
  const fallback = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&q=85';

  // ── DESIGN SYSTEM — World Gym inspired ──
  const accent = c.primary; // #d4790e amber/orange
  const black = '#050505';
  const darkGray = '#0e0e0e';
  const heading = "'Georgia', 'Clarendon', serif"; // serif BOLD like World Gym
  const body = "'Inter', system-ui, sans-serif";
  const white = '#eee';

  // Skewed section wrapper (World Gym-inspired polygon shapes)
  const Sec = ({ children, id, alt }: { children: React.ReactNode; id?: string; alt?: boolean }) => (
    <section id={id} style={{ padding: 'clamp(56px, 8vw, 96px) clamp(16px, 4vw, 56px)', background: alt ? darkGray : black, position: 'relative' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', position: 'relative', zIndex: 2 }}>{children}</div>
    </section>
  );

  // Section header — BOLD UPPERCASE SERIF
  const SH = ({ label, title, center }: { label: string; title: string; center?: boolean }) => (
    <div style={{ marginBottom: 40, textAlign: center ? 'center' : undefined }}>
      {/* Skewed accent bar (World Gym technique) */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ width: 40, height: 4, background: accent, transform: 'skewX(-20deg)' }} />
        <span style={{ fontFamily: body, fontSize: 10, fontWeight: 800, letterSpacing: '0.3em', color: accent, textTransform: 'uppercase' }}>{label}</span>
      </div>
      <h2 style={{ fontFamily: heading, fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', color: white, lineHeight: 1, display: center ? 'block' : undefined }}>{title}</h2>
    </div>
  );

  return (
    <div style={{ background: black, color: white, fontFamily: body, minHeight: '100vh', overflow: 'hidden' }}>

      {/* ═══ TEXTURE LAYERS — CONCRETE & STEEL ═══ */}
      {/* 1 — Concrete grain — heavy, rough (baseFrequency horizontal stretch = brushed metal) */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.16, mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5 6' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23c)'/%3E%3C/svg%3E")`,
        backgroundSize: '400px' }} />
      {/* 2 — Micro dot screen — halftone print feel (80s magazine) */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.03,
        backgroundImage: `radial-gradient(#fff 0.5px, transparent 0.5px)`, backgroundSize: '4px 4px' }} />
      {/* 3 — Accent glow — warm industrial light */}
      <div style={{ position: 'fixed', top: '-10%', left: '60%', width: '40vw', height: '40vh', background: `radial-gradient(circle, ${accent}0e 0%, transparent 50%)`, filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      {/* 4 — Bottom corner glow */}
      <div style={{ position: 'fixed', bottom: '-10%', left: '-5%', width: '30vw', height: '30vh', background: `radial-gradient(circle, ${accent}08 0%, transparent 50%)`, filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
      {/* 5 — Vignette — gym lighting, dramatic */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 30%, transparent 25%, rgba(0,0,0,0.55) 100%)' }} />

      {/* ═══ NAVBAR — Heavy, serif logo, skewed accent ═══ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 clamp(16px, 4vw, 56px)', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: navScroll ? `${black}f5` : 'transparent',
        transition: 'all 0.2s',
      }}>
        {/* Bottom accent line when scrolled */}
        {navScroll && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, ${accent}60, transparent)`, boxShadow: `0 0 20px ${accent}40` }} />}
        <span style={{ fontFamily: heading, fontSize: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: navScroll ? accent : white }}>{data.name}</span>
        <div className="gym-nav" style={{ display: 'flex', gap: 20 }}>
          {['Treinos', 'Galeria', 'Planos', 'Contato'].map(i => (
            <a key={i} href={`#${i.toLowerCase()}`} style={{ color: '#555', textDecoration: 'none', fontSize: 9, fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = accent} onMouseLeave={e => e.currentTarget.style.color = '#555'}>{i}</a>
          ))}
        </div>
      </nav>

      {/* ═══ HERO — Full bleed image, MASSIVE serif text, skewed overlay ═══ */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <img src={data.hero.image} alt="" loading="eager" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          filter: 'contrast(1.2) saturate(0.7) brightness(0.4)',
          transform: heroVis ? 'scale(1.02)' : 'scale(1.1)', transition: 'transform 18s ease',
        }} onError={e => { (e.target as HTMLImageElement).src = fallback; }} />
        {/* Dark overlay with left-side emphasis */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(100deg, ${black}e8 0%, ${black}a0 35%, ${black}50 70%, ${black}30 100%)` }} />
        {/* Skewed accent shape — World Gym inspired */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '35%', height: '100%', background: `linear-gradient(180deg, transparent, ${accent}06)`, clipPath: 'polygon(0 30%, 100% 0%, 80% 100%, 0% 100%)', pointerEvents: 'none' }} />
        {/* Bottom accent bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: accent, boxShadow: `0 0 30px ${accent}60, 0 0 60px ${accent}25`, zIndex: 3 }} />
        {/* Diagonal corner cut */}
        <div style={{ position: 'absolute', top: 0, right: 0, borderTop: `100px solid ${black}`, borderLeft: '100px solid transparent', zIndex: 3 }} />

        {/* Content — bottom-left aligned like World Gym */}
        <div className="gym-hero-content" style={{
          position: 'relative', zIndex: 4, height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', padding: '0 clamp(16px, 5vw, 64px) clamp(60px, 10vw, 100px)', maxWidth: 800,
          opacity: heroVis ? 1 : 0, transform: heroVis ? 'none' : 'translateY(20px)', transition: 'all 0.5s ease',
        }}>
          {/* Skewed stripe accent */}
          <div style={{ display: 'flex', gap: 5, marginBottom: 20 }}>
            {[44, 28, 14, 8].map((w, i) => <div key={i} style={{ width: w, height: 5, background: i === 0 ? accent : `${accent}${70 - i * 20}`, transform: 'skewX(-20deg)' }} />)}
          </div>
          <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.4em', color: accent, textTransform: 'uppercase', marginBottom: 14 }}>{data.tagline}</span>

          {/* MASSIVE stacked serif uppercase title */}
          <h1 style={{ margin: 0 }}>
            {data.hero.title.split(' ').map((word, i) => (
              <span key={i} style={{
                display: 'block', fontFamily: heading,
                fontSize: 'clamp(3rem, 9vw, 7rem)', fontWeight: 700,
                lineHeight: 0.9, textTransform: 'uppercase', letterSpacing: '-0.02em',
                color: i === 0 ? accent : white,
                textShadow: i === 0 ? `0 4px 0 ${accent}30, 0 0 40px ${accent}25` : `0 4px 0 rgba(0,0,0,0.5)`,
              }}>{word}</span>
            ))}
          </h1>

          <p style={{ fontSize: 14, color: '#888', lineHeight: 1.7, maxWidth: 460, margin: '22px 0 30px' }}>{data.hero.subtitle}</p>

          {/* CTA — skewed button like World Gym's ribbon */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{
              padding: '16px 44px', background: accent, color: '#000', border: 'none',
              fontFamily: heading, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
              cursor: 'pointer', transform: 'skewX(-6deg)',
              boxShadow: `0 0 30px ${accent}40, 4px 4px 0 rgba(0,0,0,0.3)`,
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 50px ${accent}60, 4px 4px 0 rgba(0,0,0,0.3)`; e.currentTarget.style.transform = 'skewX(-6deg) translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 30px ${accent}40, 4px 4px 0 rgba(0,0,0,0.3)`; e.currentTarget.style.transform = 'skewX(-6deg)'; }}>
              <span style={{ display: 'inline-block', transform: 'skewX(6deg)' }}>{data.cta.buttonText}</span>
            </button>
            <button style={{
              padding: '16px 32px', background: 'transparent', color: '#888',
              border: `2px solid #333`, fontFamily: body, fontSize: 11, fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#888'; }}>
              Planos
            </button>
          </div>
        </div>
      </section>

      {/* ═══ STATS — Serif bold numbers, accent bar top ═══ */}
      <section style={{ padding: '56px clamp(16px, 4vw, 56px)', background: darkGray, position: 'relative', borderTop: `4px solid ${accent}` }}>
        <div style={{ position: 'absolute', top: 0, left: '5%', right: '5%', height: 1, background: accent, boxShadow: `0 0 40px ${accent}60, 0 0 80px ${accent}25` }} />
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} className="gym-stats">
          {data.features.map((f, i) => {
            const num = parseInt(f.value.replace(/[^0-9]/g, '')) || 0;
            const suf = f.value.replace(/[0-9.,]/g, '').trim();
            return <Snap key={i} d={i * 100}><Counter value={num} suffix={suf} label={f.label} accent={accent} /></Snap>;
          })}
        </div>
      </section>

      {/* ═══ ABOUT — Photo with skewed clip-path, text left ═══ */}
      <Sec>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px, 5vw, 64px)', alignItems: 'center' }} className="gym-grid">
          <Snap><div>
            <SH label="Sobre" title={data.name} />
            <p style={{ color: '#888', fontSize: 14, lineHeight: 2 }}>{data.about.text}</p>
          </div></Snap>
          <Snap d={150}><div style={{ position: 'relative' }}>
            <div style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 92%, 92% 100%, 0 100%, 0 8%)', overflow: 'hidden', boxShadow: `8px 8px 0 ${accent}20, 0 20px 60px rgba(0,0,0,0.5)` }}>
              <img src={data.about.image} alt="" loading="lazy" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', filter: 'contrast(1.1) saturate(0.85)', display: 'block' }} onError={e => { (e.target as HTMLImageElement).src = fallback; }} />
            </div>
            {/* Accent corner decoration */}
            <div style={{ position: 'absolute', bottom: -4, right: -4, width: 60, height: 60, borderRight: `3px solid ${accent}`, borderBottom: `3px solid ${accent}`, opacity: 0.5 }} />
          </div></Snap>
        </div>
      </Sec>

      {/* ═══ ACCENT BAND — Full width colored strip (World Gym inspired) ═══ */}
      <div style={{ background: accent, padding: '18px clamp(16px, 5vw, 64px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <span style={{ fontFamily: heading, fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#000' }}>A serious gym for serious workouts.</span>
        <span style={{ fontFamily: body, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.4)' }}>{data.name}</span>
      </div>

      {/* ═══ SERVICES — Full-width rows with left accent + skew ═══ */}
      <Sec id="treinos" alt>
        <Snap><SH label="Modalidades" title="Escolha seu treino" /></Snap>
        {data.services.map((s, i) => (
          <Snap key={s.name} d={i * 40}>
            <div style={{
              display: 'grid', gridTemplateColumns: '5px 1fr auto', borderBottom: '1px solid #1a1a1a',
              transition: 'all 0.15s', cursor: 'default',
            }}
              onMouseEnter={e => { (e.currentTarget.children[0] as HTMLElement).style.background = accent; (e.currentTarget.children[0] as HTMLElement).style.boxShadow = `0 0 10px ${accent}50`; e.currentTarget.style.background = '#111'; }}
              onMouseLeave={e => { (e.currentTarget.children[0] as HTMLElement).style.background = '#222'; (e.currentTarget.children[0] as HTMLElement).style.boxShadow = 'none'; e.currentTarget.style.background = 'transparent'; }}>
              <div style={{ background: '#222', alignSelf: 'stretch', transition: 'all 0.15s' }} />
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: heading, fontSize: 15, fontWeight: 700, textTransform: 'uppercase', color: white }}>{s.name}</span>
                  {s.popular && <span style={{ padding: '2px 10px', background: accent, color: '#000', fontSize: 8, fontWeight: 900, letterSpacing: '0.15em', transform: 'skewX(-10deg)' }}><span style={{ display: 'inline-block', transform: 'skewX(10deg)' }}>TOP</span></span>}
                </div>
                <p style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{s.desc}</p>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                <span style={{ fontFamily: heading, fontSize: 18, fontWeight: 700, color: accent }}>{s.price}</span>
                {s.time && <span style={{ fontSize: 10, color: '#444' }}>{s.time}</span>}
              </div>
            </div>
          </Snap>
        ))}
      </Sec>

      {/* ═══ GALLERY — Full-bleed featured + tight 4-grid ═══ */}
      <section id="galeria" style={{ padding: 0, position: 'relative' }}>
        {/* Featured image — massive, full width */}
        <div onClick={() => setLightboxIdx(0)} style={{ position: 'relative', cursor: 'pointer', overflow: 'hidden' }}>
          <img src={data.gallery[0]} alt="" style={{ width: '100%', height: '40vh', objectFit: 'cover', filter: 'contrast(1.15) saturate(0.8)', display: 'block', transition: 'transform 0.5s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            onError={e => { (e.target as HTMLImageElement).src = fallback; }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(0deg, ${black} 0%, transparent 30%, transparent 80%, ${black}80 100%)` }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: accent, boxShadow: `0 0 15px ${accent}40` }} />
          <div style={{ position: 'absolute', bottom: 20, left: 'clamp(16px, 5vw, 64px)', zIndex: 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 30, height: 4, background: accent, transform: 'skewX(-20deg)' }} />
              <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.3em', color: accent, textTransform: 'uppercase' }}>Galeria</span>
            </div>
            <h2 style={{ fontFamily: heading, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, textTransform: 'uppercase', color: white }}>O Ambiente</h2>
          </div>
        </div>
        {/* 4-grid square, tight gap */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }} className="gym-gallery">
          {data.gallery.slice(1, 5).map((img, i) => (
            <div key={i} onClick={() => setLightboxIdx(i + 1)} style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
              <img src={img} alt="" loading="lazy" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', filter: 'contrast(1.1) saturate(0.85)', display: 'block', transition: 'transform 0.4s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                onError={e => { (e.target as HTMLImageElement).src = fallback; }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: accent, opacity: 0, transition: 'opacity 0.2s' }}
                ref={el => { if (el) { el.parentElement!.onmouseenter = () => el.style.opacity = '1'; el.parentElement!.onmouseleave = () => el.style.opacity = '0'; }}} />
            </div>
          ))}
        </div>
      </section>

      {/* ═══ LIGHTBOX ═══ */}
      {lightboxIdx !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: `${black}f8`, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setLightboxIdx(null)}>
          <button onClick={e => { e.stopPropagation(); setLightboxIdx(lightboxIdx > 0 ? lightboxIdx - 1 : data.gallery.length - 1); }} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%) skewX(-6deg)', width: 44, height: 44, background: `${accent}15`, border: `1px solid ${accent}30`, color: accent, fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <img src={data.gallery[lightboxIdx]} alt="" onClick={e => e.stopPropagation()} style={{ maxWidth: '88vw', maxHeight: '88vh', objectFit: 'contain' }} />
          <button onClick={e => { e.stopPropagation(); setLightboxIdx(lightboxIdx < data.gallery.length - 1 ? lightboxIdx + 1 : 0); }} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%) skewX(-6deg)', width: 44, height: 44, background: `${accent}15`, border: `1px solid ${accent}30`, color: accent, fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
          <button onClick={() => setLightboxIdx(null)} style={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, background: 'none', border: `1px solid ${accent}30`, color: '#fff', fontSize: 16, cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* ═══ REVIEWS ═══ */}
      <Sec alt>
        <Snap><SH label="Depoimentos" title="Quem treina sabe" center /></Snap>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 4 }}>
          {data.reviews.map((rv, i) => (
            <Snap key={i} d={i * 60}>
              <div style={{ padding: '24px 22px', background: '#111', borderTop: `3px solid ${accent}`, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: accent, boxShadow: `0 0 15px ${accent}40` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, background: `${accent}12`, border: `2px solid ${accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: heading, fontSize: 16, fontWeight: 700, color: accent, clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}>{rv.name[0]}</div>
                  <div>
                    <span style={{ fontFamily: heading, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: white }}>{rv.name}</span>
                    <div style={{ color: accent, fontSize: 11, letterSpacing: 2 }}>{'★'.repeat(rv.stars)}</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>"{rv.text}"</p>
              </div>
            </Snap>
          ))}
        </div>
      </Sec>

      {/* ═══ ACCENT BAND 2 ═══ */}
      <div style={{ background: `linear-gradient(90deg, ${accent}, ${accent}cc)`, padding: '14px clamp(16px, 5vw, 64px)', textAlign: 'center' }}>
        <span style={{ fontFamily: heading, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#000' }}>Mais de {data.features[0]?.value || '500'} {data.features[0]?.label?.toLowerCase() || 'alunos'}</span>
      </div>

      {/* ═══ PLANS — Skewed accent, heavy shadows ═══ */}
      <Sec id="planos">
        <Snap><SH label="Planos" title="Assine o compromisso" center /></Snap>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${plans.length}, 1fr)`, gap: 4 }} className="gym-grid">
          {plans.map((p, i) => (
            <Snap key={p.name} d={i * 80}>
              <div style={{
                padding: 28, background: p.popular ? '#151515' : '#0c0c0c',
                borderTop: p.popular ? `5px solid ${accent}` : '2px solid #1a1a1a',
                position: 'relative', display: 'flex', flexDirection: 'column', height: '100%',
                boxShadow: p.popular ? `0 0 40px ${accent}08, 8px 8px 0 ${accent}10` : `4px 4px 0 rgba(0,0,0,0.3)`,
              }}>
                {p.popular && <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: accent, boxShadow: `0 0 20px ${accent}50` }} />}
                {p.popular && <span style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%) skewX(-6deg)', padding: '4px 18px', background: accent, color: '#000', fontFamily: body, fontSize: 8, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase' }}><span style={{ display: 'inline-block', transform: 'skewX(6deg)' }}>Popular</span></span>}
                <h3 style={{ fontFamily: heading, fontSize: 22, fontWeight: 700, textTransform: 'uppercase', color: white, marginBottom: 8 }}>{p.name}</h3>
                <div style={{ fontFamily: heading, fontSize: 38, fontWeight: 700, color: accent, marginBottom: 20, textShadow: `0 0 30px ${accent}20` }}>{p.price}</div>
                <ul style={{ listStyle: 'none', padding: 0, flex: 1 }}>
                  {p.features.map((f, j) => <li key={j} style={{ padding: '7px 0', fontSize: 13, color: '#666', borderTop: j > 0 ? '1px solid #151515' : 'none', display: 'flex', gap: 8, alignItems: 'center' }}><span style={{ color: accent, fontWeight: 900, fontSize: 10 }}>▸</span>{f}</li>)}
                </ul>
                <button style={{
                  width: '100%', padding: 14, marginTop: 16, background: p.popular ? accent : 'transparent', color: p.popular ? '#000' : '#666',
                  border: p.popular ? 'none' : '1px solid #222', fontFamily: heading, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer',
                  transform: p.popular ? 'skewX(-4deg)' : 'none',
                  boxShadow: p.popular ? `0 0 25px ${accent}30, 4px 4px 0 rgba(0,0,0,0.2)` : 'none',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { if (!p.popular) { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}}
                  onMouseLeave={e => { if (!p.popular) { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#666'; }}}>
                  {p.popular ? <span style={{ display: 'inline-block', transform: 'skewX(4deg)' }}>Assinar</span> : 'Assinar'}
                </button>
              </div>
            </Snap>
          ))}
        </div>
      </Sec>

      {/* ═══ FAQ ═══ */}
      {data.faq && data.faq.length > 0 && (
        <Sec alt>
          <div style={{ maxWidth: 650, margin: '0 auto' }}>
            <Snap><SH label="FAQ" title="Perguntas" /></Snap>
            {data.faq.map((item, i) => (
              <div key={i} style={{ borderBottom: '1px solid #1a1a1a' }}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: '100%', padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: heading, fontSize: 14, fontWeight: 700, color: '#bbb', textAlign: 'left', textTransform: 'uppercase' }}>{item.q}</span>
                  <span style={{ color: accent, fontSize: 16, fontWeight: 900, transform: faqOpen === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, marginLeft: 16 }}>+</span>
                </button>
                <div style={{ maxHeight: faqOpen === i ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.3s' }}>
                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7, paddingBottom: 18 }}>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </Sec>
      )}

      {/* ═══ CONTACT ═══ */}
      <Sec id="contato">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px, 5vw, 48px)' }} className="gym-grid">
          <Snap><div>
            <SH label="Contato" title="Bora treinar" />
            {[{ icon: '☎', l: 'WhatsApp', v: data.phone }, { icon: '⊙', l: 'Local', v: data.city }].map((x, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 38, height: 38, background: `${accent}0c`, border: `1px solid ${accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, fontSize: 14 }}>{x.icon}</div>
                <div><div style={{ fontSize: 9, color: '#444', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>{x.l}</div><div style={{ fontSize: 14, color: '#ccc', fontWeight: 700 }}>{x.v}</div></div>
              </div>
            ))}
          </div></Snap>
          <Snap d={100}><div style={{ padding: 24, background: '#0c0c0c', borderTop: `3px solid ${accent}30` }}>
            <h3 style={{ fontFamily: heading, fontSize: 16, fontWeight: 700, textTransform: 'uppercase', color: white, marginBottom: 16 }}>Mensagem</h3>
            {['Nome', 'WhatsApp'].map(ph => <input key={ph} placeholder={ph} style={{ width: '100%', padding: '12px 14px', background: black, border: '1px solid #1a1a1a', color: '#ddd', fontSize: 13, outline: 'none', marginBottom: 6, boxSizing: 'border-box', transition: 'border-color 0.15s' }} onFocus={e => e.currentTarget.style.borderColor = accent} onBlur={e => e.currentTarget.style.borderColor = '#1a1a1a'} />)}
            <textarea placeholder="Mensagem" rows={3} style={{ width: '100%', padding: '12px 14px', background: black, border: '1px solid #1a1a1a', color: '#ddd', fontSize: 13, outline: 'none', resize: 'none', marginBottom: 12, boxSizing: 'border-box' }} onFocus={e => e.currentTarget.style.borderColor = accent} onBlur={e => e.currentTarget.style.borderColor = '#1a1a1a'} />
            <button style={{ width: '100%', padding: 14, background: accent, color: '#000', border: 'none', fontFamily: heading, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', transform: 'skewX(-4deg)', boxShadow: `0 0 20px ${accent}25, 4px 4px 0 rgba(0,0,0,0.2)` }}>
              <span style={{ display: 'inline-block', transform: 'skewX(4deg)' }}>Enviar</span>
            </button>
          </div></Snap>
        </div>
      </Sec>

      {/* Footer */}
      <footer style={{ padding: '20px clamp(16px, 5vw, 56px)', borderTop: '1px solid #111', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', color: '#333', textTransform: 'uppercase' }}>© 2026 {data.name}</span>
        <span style={{ fontFamily: heading, fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: '#222', textTransform: 'uppercase' }}>Iron builds character</span>
      </footer>

      {/* WhatsApp */}
      <a href="#contato" style={{ position: 'fixed', bottom: 68, right: 24, zIndex: 998, width: 48, height: 48, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,0.4)', textDecoration: 'none', fontSize: 20, color: '#fff' }}>◯</a>

      {/* Stauf banner */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999, padding: '8px 24px', background: `${black}f5`, borderTop: `3px solid ${accent}50`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'absolute', top: -1, left: '15%', right: '15%', height: 1, background: accent, boxShadow: `0 0 12px ${accent}35` }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#2dd4bf', fontSize: 13, fontWeight: 700 }}>STAUF.</span>
          <span style={{ color: '#444', fontSize: 11 }} className="gym-banner-text">Quer um site assim?</span>
        </div>
        <Link to="/" style={{ padding: '5px 14px', background: '#2dd4bf', color: '#0a0a0f', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>Conheça</Link>
      </div>

      <style>{`
        @media(max-width:768px){
          .gym-nav{display:none!important}
          .gym-hero-content{padding:0 20px 60px!important;max-width:100%!important}
          .gym-hero-content h1 span{font-size:2.5rem!important}
          .gym-stats{grid-template-columns:1fr 1fr!important}
          .gym-grid{grid-template-columns:1fr!important}
          .gym-gallery{grid-template-columns:1fr 1fr!important}
          .gym-banner-text{display:none}
        }
        @media(max-width:480px){
          .gym-hero-content h1 span{font-size:2rem!important}
          .gym-stats{grid-template-columns:1fr!important}
          .gym-gallery{grid-template-columns:1fr!important}
        }
      `}</style>
    </div>
  );
}
