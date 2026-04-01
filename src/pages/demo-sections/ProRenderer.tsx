import { useState, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, MapPin, Phone, Star, ChevronLeft, ChevronRight, Clock, Check } from 'lucide-react';

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

/* ── Niche config ── */
const THEMES: Record<string, { dark: boolean; gold: string; navItems: string[]; labels: Record<string, string> }> = {
  barbearia: { dark: true, gold: '#c9a96e', navItems: ['Serviços', 'Galeria', 'Equipe', 'Planos', 'Contato'], labels: { services: 'Nossos Serviços', gallery: 'Nosso Espaço', staff: 'Nossos Barbeiros', plans: 'Planos', reviews: 'Avaliações', contact: 'Contato', about: 'Nossa História' } },
  clinica_estetica: { dark: false, gold: '#c9a96e', navItems: ['Tratamentos', 'Equipe', 'Galeria', 'Planos', 'Contato'], labels: { services: 'Procedimentos', gallery: 'Nosso Espaço', staff: 'Especialistas', plans: 'Protocolos', reviews: 'Depoimentos', contact: 'Agende sua Avaliação', about: 'Sobre Nós' } },
  salao: { dark: false, gold: '#c9a96e', navItems: ['Serviços', 'Equipe', 'Galeria', 'Planos', 'Contato'], labels: { services: 'Nossos Serviços', gallery: 'Nosso Espaço', staff: 'Nosso Time', plans: 'Planos', reviews: 'Avaliações', contact: 'Agende seu Horário', about: 'Sobre Nós' } },
  academia: { dark: true, gold: '#d4790e', navItems: ['Treinos', 'Galeria', 'Planos', 'Contato'], labels: { services: 'Modalidades', gallery: 'Estrutura', staff: 'Instrutores', plans: 'Planos', reviews: 'Avaliações', contact: 'Bora Treinar', about: 'Sobre Nós' } },
  restaurante: { dark: true, gold: '#d4af37', navItems: ['Cardápio', 'Galeria', 'Avaliações', 'Reserva', 'Contato'], labels: { services: 'Nosso Cardápio', gallery: 'Ambientes', staff: 'Equipe', plans: 'Combos', reviews: 'Avaliações', contact: 'Reserve sua Mesa', about: 'Nossa História' } },
  pet_shop: { dark: false, gold: '#4a9e6b', navItems: ['Serviços', 'Galeria', 'Equipe', 'Planos', 'Contato'], labels: { services: 'Nossos Serviços', gallery: 'Nosso Espaço', staff: 'Nossos Veterinários', plans: 'Planos', reviews: 'Avaliações', contact: 'Agende uma Consulta', about: 'Sobre Nós' } },
  loja: { dark: false, gold: '#c9a96e', navItems: ['Produtos', 'Galeria', 'Avaliações', 'Contato'], labels: { services: 'Nossos Produtos', gallery: 'Nossa Loja', staff: 'Equipe', plans: 'Ofertas', reviews: 'Avaliações', contact: 'Visite-nos', about: 'Sobre Nós' } },
};

/* ── Fade on scroll ── */
function Fade({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => { const el = ref.current; if (!el) return; const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: 0.05 }); o.observe(el); return () => o.disconnect(); }, []);
  return <div ref={ref} style={{ ...style, opacity: v ? 1 : 0, transform: v ? 'none' : 'translateY(24px)', transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>{children}</div>;
}

/* ══════════════════════════════════════════════════════════════
   PRO RENDERER — Universal high-quality renderer
   ══════════════════════════════════════════════════════════════ */
export default function ProRenderer({ data }: { data: DemoData }) {
  const t = THEMES[data.niche] || THEMES.salao;
  const bg = data.colors.bg;
  const bgAlt = t.dark ? (bg === '#050505' ? '#0e0e0e' : '#111827') : '#ffffff';
  const text = data.colors.text;
  const muted = data.colors.textMuted;
  const gold = t.gold;
  // Light themes need stronger text opacity — dark text on light bg disappears at 80%
  const textSoft = t.dark ? `${text}90` : `${text}cc`;
  const textSubtle = t.dark ? `${text}80` : `${text}aa`;
  const _textFaint = t.dark ? `${text}60` : `${text}88`; void _textFaint;
  const staff = data.staff || [];
  const plans = data.plans || [];
  const heading = "'Georgia', 'Playfair Display', 'Times New Roman', serif";
  const body = "'Inter', system-ui, sans-serif";

  const [mobileMenu, setMobileMenu] = useState(false);
  const [navScroll, setNavScroll] = useState(false);
  const [heroVis, setHeroVis] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [bookingPicker, setBookingPicker] = useState(false);
  const [bookingSvc, setBookingSvc] = useState<ServiceItem | null>(null);
  const [bookingStaff, setBookingStaff] = useState<StaffItem | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingDone, setBookingDone] = useState(false);

  const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  const handleBook = () => { setBookingDone(true); setTimeout(() => { setBookingDone(false); setBookingSvc(null); setBookingPicker(false); setBookingStaff(null); setBookingDate(''); setBookingTime(''); setBookingName(''); setBookingPhone(''); }, 3000); };
  const categories = [...new Set(data.services.map(s => s.category || ''))].filter(Boolean);

  useEffect(() => { setTimeout(() => setHeroVis(true), 150); }, []);
  useEffect(() => { const fn = () => setNavScroll(window.scrollY > 60); window.addEventListener('scroll', fn, { passive: true }); return () => window.removeEventListener('scroll', fn); }, []);

  const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');

  // ── Shared styles ──
  const sec = (alt?: boolean): CSSProperties => ({ padding: 'clamp(80px, 12vw, 140px) clamp(20px, 5vw, 64px)', background: alt ? bgAlt : bg });
  const maxW: CSSProperties = { maxWidth: 1060, margin: '0 auto' };
  const sectionLabel: CSSProperties = { fontFamily: body, fontSize: 10, fontWeight: 600, letterSpacing: '0.25em', color: gold, textTransform: 'uppercase' };
  const sectionTitle: CSSProperties = { fontFamily: heading, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 400, fontStyle: 'italic', color: text, marginTop: 10, lineHeight: 1.15 };
  const ornament: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 16 };
  const cardBase: CSSProperties = { background: `${gold}04`, border: `1px solid ${gold}10`, borderRadius: 16, transition: 'all 0.3s' };
  const inputStyle: CSSProperties = { width: '100%', padding: '12px 16px', background: `${gold}05`, border: `1px solid ${gold}12`, borderRadius: 10, color: text, fontSize: 13, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 8, fontFamily: body };
  const btnGold: CSSProperties = { background: `linear-gradient(135deg, ${gold}, ${gold}cc)`, color: bg, border: 'none', borderRadius: 100, fontFamily: body, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, cursor: 'pointer', transition: 'all 0.3s' };

  return (
    <div style={{ background: bg, color: text, fontFamily: body, minHeight: '100vh', position: 'relative' }}>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, transition: 'all 0.5s',
        padding: navScroll ? '12px clamp(20px, 5vw, 64px)' : '20px clamp(20px, 5vw, 64px)',
        background: navScroll ? (t.dark ? `${bg}f0` : `${bg}f5`) : (t.dark ? 'transparent' : `${bg}cc`),
        backdropFilter: navScroll ? 'blur(16px)' : 'none',
        borderBottom: navScroll ? `1px solid ${gold}15` : 'none',
      }}>
        <div style={{ ...maxW, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: heading, fontSize: 22, fontStyle: 'italic', color: gold }}>{data.name}</span>
          <div className="pro-nav" style={{ display: 'flex', gap: 28 }}>
            {t.navItems.map(i => (
              <a key={i} href={`#${slugify(i)}`} style={{ color: t.dark ? muted : text, textDecoration: 'none', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', transition: 'color 0.3s', opacity: t.dark ? 0.7 : 0.6 }}
                onMouseEnter={e => { e.currentTarget.style.color = gold; e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={e => { e.currentTarget.style.color = t.dark ? muted : text; e.currentTarget.style.opacity = t.dark ? '0.7' : '0.6'; }}>{i}</a>
            ))}
          </div>
          <button className="pro-burger" onClick={() => setMobileMenu(!mobileMenu)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
            {mobileMenu ? <X size={22} color={gold} /> : <Menu size={22} color={gold} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileMenu && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99, background: t.dark ? `${bg}f8` : `${bgAlt}f8`, backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          {t.navItems.map((i, idx) => (
            <a key={i} href={`#${slugify(i)}`} onClick={() => setMobileMenu(false)}
              style={{ fontFamily: heading, fontSize: 26, fontStyle: 'italic', color: text, textDecoration: 'none', opacity: 0, animation: `proFadeIn 0.4s ease ${idx * 0.07}s forwards` }}>{i}</a>
          ))}
          <button onClick={() => { setMobileMenu(false); setBookingPicker(true); }}
            style={{ ...btnGold, marginTop: 12, padding: '14px 36px', fontSize: 11 }}>{data.cta.buttonText}</button>
        </div>
      )}

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${data.hero.image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.3) saturate(0.8)', transform: heroVis ? 'scale(1.02)' : 'scale(1.08)', transition: 'transform 15s ease' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${bg}dd 0%, ${bg}80 40%, ${bg}cc 100%)` }} />
        <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)', width: '40vw', height: '30vh', background: `radial-gradient(circle, ${gold}0a, transparent 60%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 700, padding: '140px 24px 100px', opacity: heroVis ? 1 : 0, transform: heroVis ? 'none' : 'translateY(28px)', transition: 'all 1s cubic-bezier(0.4,0,0.2,1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 32 }}>
            <div style={{ width: 40, height: 1, background: `${gold}50` }} />
            <span style={{ ...sectionLabel }}>{data.tagline}</span>
            <div style={{ width: 40, height: 1, background: `${gold}50` }} />
          </div>
          <h1 style={{ fontFamily: heading, fontSize: 'clamp(3rem, 10vw, 7rem)', fontWeight: 400, fontStyle: 'italic', color: text, lineHeight: 0.9, marginBottom: 24, textShadow: `0 4px 40px ${gold}15` }}>{data.name}</h1>
          <p style={{ fontSize: 16, color: textSoft, lineHeight: 1.9, maxWidth: 480, margin: '0 auto 36px' }}>{data.hero.subtitle}</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setBookingPicker(true)} style={{ ...btnGold, padding: '16px 44px', fontSize: 11, boxShadow: `0 8px 32px ${gold}30` }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 14px 44px ${gold}45`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 8px 32px ${gold}30`; }}>
              {data.cta.buttonText}
            </button>
            <a href="#galeria" style={{ padding: '16px 44px', background: 'transparent', color: text, border: `1px solid ${text}20`, borderRadius: 100, fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.3s' }}>
              Conheça nosso espaço
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <div style={{ padding: '48px clamp(20px, 5vw, 64px)', borderTop: `1px solid ${gold}12`, borderBottom: `1px solid ${gold}12`, background: bgAlt }}>
        <div style={{ ...maxW, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          {data.features.map((f, i) => (
            <Fade key={i} delay={i * 120} style={{ textAlign: 'center', flex: 1, minWidth: 120 }}>
              <div style={{ fontFamily: heading, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontStyle: 'italic', color: gold }}>{f.value}</div>
              <div style={{ fontSize: 10, color: muted, marginTop: 6, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>{f.label}</div>
            </Fade>
          ))}
        </div>
      </div>

      {/* ═══ ABOUT ═══ */}
      <section style={sec()}>
        <div style={{ ...maxW, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 6vw, 80px)', alignItems: 'center' }} className="pro-grid">
          <Fade>
            <div style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '4/5', boxShadow: `0 24px 64px rgba(0,0,0,0.3)`, border: `1px solid ${gold}15` }}>
              <img src={data.about.image} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </Fade>
          <Fade delay={150}>
            <div>
              <span style={sectionLabel}>{t.labels.about}</span>
              <h2 style={{ ...sectionTitle, marginBottom: 20 }}>Conheça a {data.name}</h2>
              <p style={{ color: textSubtle, fontSize: 15, lineHeight: 2.1 }}>{data.about.text}</p>
            </div>
          </Fade>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id={slugify(t.navItems[0])} style={sec(true)}>
        <div style={maxW}>
          <Fade style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={sectionLabel}>{t.labels.services}</span>
            <h2 style={sectionTitle}>O que oferecemos</h2>
            <div style={ornament}>
              <div style={{ width: 30, height: 1, background: `linear-gradient(90deg, transparent, ${gold}60)` }} />
              <div style={{ width: 5, height: 5, borderRadius: '50%', border: `1px solid ${gold}50` }} />
              <div style={{ width: 30, height: 1, background: `linear-gradient(90deg, ${gold}60, transparent)` }} />
            </div>
          </Fade>

          {categories.length > 0 ? categories.map(cat => (
            <div key={cat} style={{ marginBottom: 40 }}>
              <h3 style={{ fontFamily: heading, fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontStyle: 'italic', color: gold, marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${gold}20` }}>{cat}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                {data.services.filter(s => s.category === cat).map((s, i) => (
                  <Fade key={s.name} delay={i * 50}>
                    <div onClick={() => setBookingSvc(s)} style={{ ...cardBase, padding: '24px 20px', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', borderBottom: `2px solid transparent` }}
                      onMouseEnter={e => { (e.currentTarget).style.borderBottomColor = `${gold}40`; (e.currentTarget).style.transform = 'translateY(-3px)'; (e.currentTarget).style.boxShadow = `0 8px 32px ${gold}08`; }}
                      onMouseLeave={e => { (e.currentTarget).style.borderBottomColor = 'transparent'; (e.currentTarget).style.transform = 'none'; (e.currentTarget).style.boxShadow = 'none'; }}>
                      {s.popular && <span style={{ position: 'absolute', top: 10, right: 10, padding: '3px 12px', background: `${gold}15`, color: gold, fontSize: 8, fontWeight: 700, borderRadius: 20, letterSpacing: '0.08em', textTransform: 'uppercase', border: `1px solid ${gold}20` }}>Popular</span>}
                      <h4 style={{ fontFamily: heading, fontSize: 17, fontStyle: 'italic', color: text, marginBottom: 6 }}>{s.name}</h4>
                      <p style={{ fontSize: 12, color: muted, lineHeight: 1.7, flex: 1 }}>{s.desc}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTop: `1px solid ${gold}08` }}>
                        <span style={{ fontFamily: heading, fontSize: 20, fontStyle: 'italic', color: gold }}>{s.price}</span>
                        {s.time && <span style={{ fontSize: 11, color: muted }}>{s.time}</span>}
                      </div>
                    </div>
                  </Fade>
                ))}
              </div>
            </div>
          )) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
              {data.services.map((s, i) => (
                <Fade key={s.name} delay={i * 50}>
                  <div onClick={() => setBookingSvc(s)} style={{ ...cardBase, padding: '24px 20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <h4 style={{ fontFamily: heading, fontSize: 17, fontStyle: 'italic', color: text, marginBottom: 6 }}>{s.name}</h4>
                    <p style={{ fontSize: 12, color: muted, lineHeight: 1.7, flex: 1 }}>{s.desc}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTop: `1px solid ${gold}08` }}>
                      <span style={{ fontFamily: heading, fontSize: 20, fontStyle: 'italic', color: gold }}>{s.price}</span>
                      {s.time && <span style={{ fontSize: 11, color: muted }}>{s.time}</span>}
                    </div>
                  </div>
                </Fade>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ STAFF ═══ */}
      {staff.length > 0 && (
        <section id="equipe" style={sec()}>
          <div style={maxW}>
            <Fade style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={sectionLabel}>{t.labels.staff}</span>
              <h2 style={sectionTitle}>Nossa equipe</h2>
            </Fade>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 40 }}>
              {staff.map((s, i) => (
                <Fade key={s.name} delay={i * 100} style={{ textAlign: 'center', width: 200 }}>
                  <div style={{ width: 96, height: 96, borderRadius: '50%', margin: '0 auto 16px', padding: 3, background: `linear-gradient(135deg, ${gold}50, ${gold}20)` }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: `${gold}08`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: heading, fontSize: 32, fontStyle: 'italic', color: gold }}>{s.name.split(' ').pop()?.[0] || s.name[0]}</div>
                  </div>
                  {s.available && <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#4ade80', margin: '-12px auto 8px', position: 'relative', zIndex: 2, border: `3px solid ${bg}` }} />}
                  <h3 style={{ fontFamily: heading, fontSize: 16, fontStyle: 'italic', color: text }}>{s.name}</h3>
                  <p style={{ fontSize: 11, color: muted, marginTop: 2 }}>{s.role}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 6 }}>
                    <Star size={12} fill={gold} color={gold} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: gold }}>{s.rating}</span>
                  </div>
                </Fade>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ GALLERY ═══ */}
      <section id="galeria" style={sec(true)}>
        <div style={maxW}>
          <Fade style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={sectionLabel}>{t.labels.gallery}</span>
            <h2 style={sectionTitle}>Galeria</h2>
          </Fade>

          {/* Mobile carousel */}
          <div className="pro-gallery-mobile" style={{ display: 'none', position: 'relative' }}>
            <div style={{ borderRadius: 16, overflow: 'hidden', height: 280 }}>
              <img src={data.gallery[galleryIdx]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <button onClick={() => setGalleryIdx(p => (p - 1 + data.gallery.length) % data.gallery.length)} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', background: `${bg}cc`, border: 'none', color: gold, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={18} /></button>
            <button onClick={() => setGalleryIdx(p => (p + 1) % data.gallery.length)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', background: `${bg}cc`, border: 'none', color: gold, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={18} /></button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
              {data.gallery.map((_, i) => (
                <button key={i} onClick={() => setGalleryIdx(i)} style={{ width: i === galleryIdx ? 24 : 8, height: 8, borderRadius: 100, background: i === galleryIdx ? gold : `${gold}30`, border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
              ))}
            </div>
          </div>

          {/* Desktop grid */}
          <div className="pro-gallery-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {data.gallery.slice(0, 6).map((img, i) => (
              <Fade key={i} delay={i * 60}>
                <div onClick={() => setLightboxIdx(i)} style={{ position: 'relative', height: 220, borderRadius: 16, overflow: 'hidden', cursor: 'pointer' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={e => (e.currentTarget).style.transform = 'scale(1.08)'}
                    onMouseLeave={e => (e.currentTarget).style.transform = 'scale(1)'} />
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: `${bg}ee`, backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setLightboxIdx(null)}>
          <button style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: gold, cursor: 'pointer' }}><X size={28} /></button>
          <button style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: gold, cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setLightboxIdx(p => (p! - 1 + data.gallery.length) % data.gallery.length); }}><ChevronLeft size={32} /></button>
          <img src={data.gallery[lightboxIdx]} alt="" style={{ maxWidth: '85vw', maxHeight: '85vh', borderRadius: 16, objectFit: 'contain' }} onClick={e => e.stopPropagation()} />
          <button style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: gold, cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setLightboxIdx(p => (p! + 1) % data.gallery.length); }}><ChevronRight size={32} /></button>
        </div>
      )}

      {/* ═══ REVIEWS ═══ */}
      <section style={sec()}>
        <div style={maxW}>
          <Fade style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={sectionLabel}>{t.labels.reviews}</span>
            <h2 style={sectionTitle}>O que dizem nossos clientes</h2>
          </Fade>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {data.reviews.slice(0, 3).map((rv, i) => (
              <Fade key={i} delay={i * 100}>
                <div style={{ ...cardBase, padding: 24 }}>
                  <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                    {Array.from({ length: rv.stars }).map((_, j) => <Star key={j} size={14} fill={gold} color={gold} />)}
                  </div>
                  <p style={{ fontSize: 13, color: textSoft, lineHeight: 1.8, fontStyle: 'italic', marginBottom: 16 }}>"{rv.text}"</p>
                  <div style={{ paddingTop: 14, borderTop: `1px solid ${gold}10` }}>
                    <p style={{ fontWeight: 600, fontSize: 13, color: gold }}>{rv.name}</p>
                    {rv.time && <p style={{ fontSize: 11, color: muted, marginTop: 2 }}>{rv.time}</p>}
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PLANS ═══ */}
      {plans.length > 0 && (
        <section id="planos" style={sec(true)}>
          <div style={maxW}>
            <Fade style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={sectionLabel}>{t.labels.plans}</span>
              <h2 style={sectionTitle}>Nossos planos</h2>
            </Fade>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(plans.length, 3)}, 1fr)`, gap: 16, alignItems: 'stretch' }} className="pro-grid">
              {plans.map((p, i) => (
                <Fade key={p.name} delay={i * 100}>
                  <div style={{ padding: p.popular ? 36 : 28, background: t.dark ? `${gold}04` : '#fff', border: `1px solid ${p.popular ? gold : `${gold}12`}`, borderRadius: 20, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', boxShadow: p.popular ? `0 16px 48px ${gold}10` : 'none', transform: p.popular ? 'scale(1.03)' : 'none', transition: 'transform 0.3s' }}>
                    {p.popular && <span style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', padding: '5px 20px', ...btnGold, fontSize: 9, boxShadow: `0 4px 16px ${gold}30` }}>Mais escolhido</span>}
                    <h3 style={{ fontFamily: heading, fontSize: 20, fontStyle: 'italic', color: text, marginBottom: 6 }}>{p.name}</h3>
                    <div style={{ fontFamily: heading, fontSize: 30, fontStyle: 'italic', color: gold, marginBottom: 24 }}>{p.price}</div>
                    <ul style={{ listStyle: 'none', padding: 0, flex: 1, margin: 0 }}>
                      {p.features.map((f, j) => <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', fontSize: 13, color: textSubtle, borderTop: j > 0 ? `1px solid ${gold}06` : 'none' }}><Check size={14} color={gold} />{f}</li>)}
                    </ul>
                    <button style={{ ...btnGold, width: '100%', padding: 14, marginTop: 20, fontSize: 11, background: p.popular ? `linear-gradient(135deg, ${gold}, ${gold}cc)` : 'transparent', color: p.popular ? bg : text, border: p.popular ? 'none' : `1px solid ${gold}20` }}>Começar agora</button>
                  </div>
                </Fade>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ FAQ ═══ */}
      {data.faq && data.faq.length > 0 && (
        <section style={sec()}>
          <div style={{ ...maxW, maxWidth: 700 }}>
            <Fade style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={sectionLabel}>Dúvidas frequentes</span>
              <h2 style={sectionTitle}>FAQ</h2>
            </Fade>
            {data.faq.map((f, i) => (
              <Fade key={i} delay={i * 40}>
                <div style={{ marginBottom: 8, borderRadius: 12, overflow: 'hidden', border: `1px solid ${gold}10` }}>
                  <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: '100%', textAlign: 'left', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: faqOpen === i ? `${gold}06` : 'transparent', border: 'none', color: text, fontFamily: body, fontSize: 14, fontWeight: 600, transition: 'background 0.2s' }}>
                    {f.q}
                    <span style={{ color: gold, fontSize: 18, transition: 'transform 0.3s', transform: faqOpen === i ? 'rotate(45deg)' : 'none', flexShrink: 0, marginLeft: 12 }}>+</span>
                  </button>
                  {faqOpen === i && <div style={{ padding: '0 20px 18px' }}><p style={{ fontSize: 13, lineHeight: 1.8, color: muted }}>{f.a}</p></div>}
                </div>
              </Fade>
            ))}
          </div>
        </section>
      )}

      {/* ═══ CONTACT ═══ */}
      <section id="contato" style={sec(true)}>
        <div style={maxW}>
          <Fade style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={sectionLabel}>{t.labels.contact}</span>
            <h2 style={sectionTitle}>{data.cta.text}</h2>
          </Fade>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 32 }}>
            {[
              { icon: <Phone size={24} />, label: 'WhatsApp', value: data.phone },
              { icon: <MapPin size={24} />, label: 'Localização', value: data.city },
              { icon: <Clock size={24} />, label: 'Horário', value: 'Seg-Sáb' },
              { icon: <Star size={24} />, label: 'Avaliação', value: data.features.find(f => f.label.includes('Avaliação'))?.value || '5.0 ★' },
            ].map((item, i) => (
              <Fade key={i} delay={i * 80}>
                <div style={{ ...cardBase, padding: 20, textAlign: 'center' }}>
                  <div style={{ color: gold, marginBottom: 10, display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                  <p style={{ ...sectionLabel, fontSize: 9, marginBottom: 6 }}>{item.label}</p>
                  <p style={{ fontSize: 13, color: text, lineHeight: 1.5 }}>{item.value}</p>
                </div>
              </Fade>
            ))}
          </div>
          <Fade delay={200}>
            <div style={{ borderRadius: 16, overflow: 'hidden', height: 260, border: `1px solid ${gold}10` }}>
              <iframe src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCdpxxgZRYNVs2cQ_X8SOZchL-iVl48tmU&q=${encodeURIComponent(data.name + ' ' + data.city)}`} style={{ width: '100%', height: '100%', border: 'none', filter: t.dark ? 'invert(0.9) hue-rotate(180deg) saturate(0.3)' : 'none' }} loading="lazy" allowFullScreen />
            </div>
          </Fade>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '20px clamp(20px, 5vw, 64px)', textAlign: 'center', borderTop: `1px solid ${gold}08` }}>
        <p style={{ fontSize: 11, color: `${muted}80` }}>© 2026 {data.name}. Todos os direitos reservados.</p>
      </footer>

      {/* WhatsApp FAB */}
      <a href="#contato" style={{ position: 'fixed', bottom: 60, right: 20, zIndex: 40, width: 48, height: 48, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,0.4)', color: '#fff', textDecoration: 'none', transition: 'transform 0.3s' }}
        onMouseEnter={e => (e.currentTarget).style.transform = 'scale(1.1)'} onMouseLeave={e => (e.currentTarget).style.transform = 'scale(1)'}><Phone size={20} /></a>

      {/* Stauf banner */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, padding: '8px 20px', background: t.dark ? `${bg}f5` : `${bgAlt}f5`, backdropFilter: 'blur(16px)', borderTop: `1px solid ${gold}10`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#2dd4bf', fontSize: 13, fontWeight: 700 }}>STAUF.</span>
          <span className="pro-banner-text" style={{ color: muted, fontSize: 11 }}>Demo visual — Quer um site assim?</span>
        </div>
        <Link to="/" style={{ padding: '5px 16px', background: '#2dd4bf', color: '#0a0a0f', borderRadius: 20, fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>Conheça a Stauf.</Link>
      </div>

      {/* ═══ SERVICE PICKER ═══ */}
      {bookingPicker && !bookingSvc && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: t.dark ? `${bg}dd` : `${bg}e0`, backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setBookingPicker(false)}>
          <div style={{ background: t.dark ? bgAlt : '#fff', border: `1px solid ${gold}15`, borderRadius: 20, padding: 'clamp(24px, 4vw, 36px)', maxWidth: 500, width: '100%', maxHeight: '85vh', overflowY: 'auto', boxShadow: `0 32px 80px rgba(0,0,0,0.3)` }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <span style={sectionLabel}>Agendar</span>
              <h3 style={{ fontFamily: heading, fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', fontStyle: 'italic', color: text, marginTop: 8 }}>Escolha o serviço</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.services.map(s => (
                <button key={s.name} onClick={() => setBookingSvc(s)} style={{ ...cardBase, padding: '16px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', width: '100%' }}
                  onMouseEnter={e => (e.currentTarget).style.borderColor = gold} onMouseLeave={e => (e.currentTarget).style.borderColor = `${gold}10`}>
                  <div>
                    <div style={{ fontFamily: heading, fontSize: 15, fontStyle: 'italic', color: text }}>{s.name}</div>
                    {s.time && <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{s.time}</div>}
                  </div>
                  <span style={{ fontFamily: heading, fontSize: 18, fontStyle: 'italic', color: gold }}>{s.price}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ BOOKING MODAL ═══ */}
      {bookingSvc && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: t.dark ? `${bg}dd` : `${bg}e0`, backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => { if (!bookingDone) { setBookingSvc(null); setBookingPicker(false); } }}>
          <div style={{ background: t.dark ? bgAlt : '#fff', border: `1px solid ${gold}15`, borderRadius: 20, padding: 'clamp(24px, 4vw, 36px)', maxWidth: 440, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: `0 32px 80px rgba(0,0,0,0.3)` }} onClick={e => e.stopPropagation()}>
            {bookingDone ? (
              <div style={{ textAlign: 'center', padding: '36px 0' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', border: `2px solid ${gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24, color: gold }}>✓</div>
                <h3 style={{ fontFamily: heading, fontSize: 22, fontStyle: 'italic', color: text, marginBottom: 8 }}>Agendamento confirmado!</h3>
                <p style={{ fontSize: 13, color: muted }}>Você receberá uma confirmação pelo WhatsApp.</p>
              </div>
            ) : (<>
              <h3 style={{ fontFamily: heading, fontSize: 20, fontStyle: 'italic', color: text, marginBottom: 4 }}>{bookingSvc.name}</h3>
              <p style={{ fontSize: 13, color: muted, marginBottom: 24 }}>{bookingSvc.price} · {bookingSvc.time}</p>
              {staff.filter(s => s.available).length > 0 && <>
                <p style={{ ...sectionLabel, fontSize: 9, marginBottom: 10 }}>Profissional</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                  {staff.filter(s => s.available).map(s => (
                    <button key={s.name} onClick={() => setBookingStaff(s)} style={{ padding: '8px 16px', background: bookingStaff?.name === s.name ? `${gold}12` : `${gold}04`, border: `1px solid ${bookingStaff?.name === s.name ? gold : `${gold}10`}`, borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: muted }}>{s.role}</div>
                    </button>
                  ))}
                </div>
              </>}
              <p style={{ ...sectionLabel, fontSize: 9, marginBottom: 10 }}>Data</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                {['Hoje', 'Amanhã', 'Qua', 'Qui', 'Sex'].map(d => (
                  <button key={d} onClick={() => setBookingDate(d)} style={{ padding: '7px 16px', fontSize: 12, background: bookingDate === d ? `${gold}12` : `${gold}04`, border: `1px solid ${bookingDate === d ? gold : `${gold}10`}`, borderRadius: 8, cursor: 'pointer', color: bookingDate === d ? gold : muted, fontWeight: bookingDate === d ? 700 : 400, fontFamily: body, transition: 'all 0.2s' }}>{d}</button>
                ))}
              </div>
              <p style={{ ...sectionLabel, fontSize: 9, marginBottom: 10 }}>Horário</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5, marginBottom: 20 }}>
                {times.map(tt => (
                  <button key={tt} onClick={() => setBookingTime(tt)} style={{ padding: 9, fontSize: 13, background: bookingTime === tt ? gold : `${gold}04`, color: bookingTime === tt ? bg : muted, border: `1px solid ${bookingTime === tt ? gold : `${gold}10`}`, borderRadius: 8, cursor: 'pointer', fontWeight: bookingTime === tt ? 700 : 400, fontFamily: body, transition: 'all 0.2s' }}>{tt}</button>
                ))}
              </div>
              <p style={{ ...sectionLabel, fontSize: 9, marginBottom: 10 }}>Seus dados</p>
              <input placeholder="Seu nome" value={bookingName} onChange={e => setBookingName(e.target.value)} style={inputStyle} />
              <input placeholder="WhatsApp (41) 99999-9999" value={bookingPhone} onChange={e => setBookingPhone(e.target.value)} style={inputStyle} />
              <p style={{ fontSize: 11, color: muted, marginBottom: 14, marginTop: 4 }}>Você receberá uma confirmação automática pelo WhatsApp.</p>
              <button onClick={handleBook} disabled={!bookingDate || !bookingTime || !bookingName || !bookingPhone}
                style={{ ...btnGold, width: '100%', padding: 14, fontSize: 11, opacity: bookingDate && bookingTime && bookingName && bookingPhone ? 1 : 0.4, cursor: bookingDate && bookingTime && bookingName && bookingPhone ? 'pointer' : 'not-allowed', boxShadow: bookingDate && bookingTime && bookingName && bookingPhone ? `0 4px 20px ${gold}25` : 'none' }}>
                Confirmar agendamento
              </button>
            </>)}
          </div>
        </div>
      )}

      <style>{`
        @keyframes proFadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @media(max-width:768px){
          .pro-nav{display:none!important}
          .pro-burger{display:block!important}
          .pro-grid{grid-template-columns:1fr!important}
          .pro-gallery-desktop{display:none!important}
          .pro-gallery-mobile{display:block!important}
          .pro-banner-text{display:none}
        }
        @media(max-width:480px){
          .pro-gallery-mobile div:first-child{height:220px!important}
        }
      `}</style>
    </div>
  );
}
