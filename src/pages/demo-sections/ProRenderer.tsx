import { useState, useEffect, useRef } from 'react';
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

/* ── Niche themes ── */
const NICHE_THEMES: Record<string, { dark: boolean; gold: string; bg: string; bgAlt: string; text: string; muted: string; navItems: string[]; sectionLabels: Record<string, string> }> = {
  barbearia: {
    dark: true, gold: '#c9a96e', bg: '#0a0e1a', bgAlt: '#111827', text: '#f4efe6', muted: '#999',
    navItems: ['Serviços', 'Galeria', 'Equipe', 'Planos', 'Contato'],
    sectionLabels: { services: 'Nossos Serviços', gallery: 'Nosso Espaço', staff: 'Nossos Barbeiros', plans: 'Planos', reviews: 'Avaliações', contact: 'Contato', about: 'Nossa História' },
  },
  clinica_estetica: {
    dark: false, gold: '#c9a96e', bg: '#faf7f5', bgAlt: '#ffffff', text: '#2a2320', muted: '#8a7e77',
    navItems: ['Tratamentos', 'Equipe', 'Galeria', 'Planos', 'Contato'],
    sectionLabels: { services: 'Procedimentos', gallery: 'Nosso Espaço', staff: 'Nossos Especialistas', plans: 'Protocolos', reviews: 'Depoimentos', contact: 'Agende sua Avaliação', about: 'Sobre Nós' },
  },
  salao: {
    dark: false, gold: '#c9a96e', bg: '#faf6f4', bgAlt: '#ffffff', text: '#2a2320', muted: '#8a7e77',
    navItems: ['Serviços', 'Equipe', 'Galeria', 'Planos', 'Contato'],
    sectionLabels: { services: 'Nossos Serviços', gallery: 'Nosso Espaço', staff: 'Nosso Time', plans: 'Planos', reviews: 'Avaliações', contact: 'Agende seu Horário', about: 'Sobre Nós' },
  },
  academia: {
    dark: true, gold: '#d4790e', bg: '#050505', bgAlt: '#0e0e0e', text: '#eee', muted: '#777',
    navItems: ['Treinos', 'Galeria', 'Planos', 'Contato'],
    sectionLabels: { services: 'Modalidades', gallery: 'Estrutura', staff: 'Instrutores', plans: 'Planos', reviews: 'Avaliações', contact: 'Bora Treinar', about: 'Sobre Nós' },
  },
  restaurante: {
    dark: true, gold: '#d4af37', bg: '#1a0f0a', bgAlt: '#2d1810', text: '#f5e6d3', muted: '#a89080',
    navItems: ['Cardápio', 'Galeria', 'Avaliações', 'Reserva', 'Contato'],
    sectionLabels: { services: 'Nosso Cardápio', gallery: 'Ambientes', staff: 'Nossa Equipe', plans: 'Combos', reviews: 'Avaliações', contact: 'Reserve sua Mesa', about: 'Nossa História' },
  },
};

/* ── Fade-in on scroll ── */
function Fade({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); o.disconnect(); } }, { threshold: 0.05 });
    o.observe(el); return () => o.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(24px)', transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PRO RENDERER — Universal high-quality renderer for all niches
   Tailwind + lucide-react, inspired by 21st.dev templates
   ══════════════════════════════════════════════════════════════ */
export default function ProRenderer({ data }: { data: DemoData }) {
  const theme = NICHE_THEMES[data.niche] || NICHE_THEMES.salao;
  const { gold, bg, bgAlt, text: textColor, muted } = theme;
  const staff = data.staff || [];
  const plans = data.plans || [];
  const [mobileMenu, setMobileMenu] = useState(false);
  const [navScroll, setNavScroll] = useState(false);
  const [heroVis, setHeroVis] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);

  // Booking
  const [bookingPicker, setBookingPicker] = useState(false);
  const [bookingSvc, setBookingSvc] = useState<ServiceItem | null>(null);
  const [bookingStaff, setBookingStaff] = useState<StaffItem | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingDone, setBookingDone] = useState(false);

  const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  const handleBook = () => {
    setBookingDone(true);
    setTimeout(() => { setBookingDone(false); setBookingSvc(null); setBookingPicker(false); setBookingStaff(null); setBookingDate(''); setBookingTime(''); setBookingName(''); setBookingPhone(''); }, 3000);
  };

  useEffect(() => { setTimeout(() => setHeroVis(true), 150); }, []);
  useEffect(() => {
    const fn = () => setNavScroll(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true }); return () => window.removeEventListener('scroll', fn);
  }, []);

  const categories = [...new Set(data.services.map(s => s.category || ''))];

  // CSS vars for dynamic theming
  const cssVars = { '--gold': gold, '--bg': bg, '--bg-alt': bgAlt, '--text': textColor, '--muted': muted } as React.CSSProperties;

  return (
    <div style={{ ...cssVars, background: bg, color: textColor }} className="min-h-screen font-sans">

      {/* ═══ NAV ═══ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          padding: navScroll ? '12px clamp(20px, 5vw, 64px)' : '20px clamp(20px, 5vw, 64px)',
          background: navScroll ? (theme.dark ? `${bg}f0` : `${bg}f5`) : (theme.dark ? 'transparent' : `${bg}cc`),
          backdropFilter: navScroll ? 'blur(16px)' : 'none',
          borderBottom: navScroll ? `1px solid ${gold}15` : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="font-display text-xl md:text-2xl italic" style={{ color: gold }}>{data.name}</span>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-7">
            {theme.navItems.map(i => (
              <a key={i} href={`#${i.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}
                className="text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300 hover:opacity-100"
                style={{ color: `${muted}`, opacity: 0.7 }}
                onMouseEnter={e => { e.currentTarget.style.color = gold; e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.opacity = '0.7'; }}>
                {i}
              </a>
            ))}
          </div>

          {/* Hamburger */}
          <button className="md:hidden p-2" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={22} color={gold} /> : <Menu size={22} color={gold} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileMenu && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-5" style={{ background: theme.dark ? `${bg}f8` : `${bgAlt}f8`, backdropFilter: 'blur(20px)' }}>
          {theme.navItems.map((i, idx) => (
            <a key={i} href={`#${i.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}
              onClick={() => setMobileMenu(false)}
              className="font-display text-2xl italic transition-all"
              style={{ color: textColor, opacity: 0, animation: `proFadeIn 0.4s ease ${idx * 0.07}s forwards` }}>
              {i}
            </a>
          ))}
          <button onClick={() => { setMobileMenu(false); setBookingPicker(true); }}
            className="mt-4 px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all"
            style={{ background: gold, color: bg }}>
            {data.cta.buttonText}
          </button>
        </div>
      )}

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${data.hero.image})`, filter: 'brightness(0.3) saturate(0.8)', transform: heroVis ? 'scale(1.02)' : 'scale(1.08)', transition: 'transform 15s ease' }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${bg}dd 0%, ${bg}80 40%, ${bg}cc 100%)` }} />
        {/* Gold glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40vw] h-[30vh] rounded-full" style={{ background: `radial-gradient(circle, ${gold}0a, transparent 60%)`, filter: 'blur(80px)' }} />

        <div className="relative z-10 text-center max-w-3xl mx-auto px-6" style={{ opacity: heroVis ? 1 : 0, transform: heroVis ? 'none' : 'translateY(28px)', transition: 'all 1s cubic-bezier(0.4,0,0.2,1)' }}>
          {/* Ornament */}
          <div className="flex items-center justify-center gap-3 mb-8" style={{ opacity: heroVis ? 1 : 0, transition: 'opacity 1s ease 0.3s' }}>
            <div className="w-10 h-[1px]" style={{ background: `${gold}50` }} />
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase" style={{ color: gold }}>{data.tagline}</span>
            <div className="w-10 h-[1px]" style={{ background: `${gold}50` }} />
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl italic leading-[0.9] mb-6" style={{ color: textColor, textShadow: `0 4px 40px ${gold}15` }}>
            {data.name}
          </h1>

          <p className="text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10" style={{ color: `${textColor}90` }}>
            {data.hero.subtitle}
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => setBookingPicker(true)}
              className="px-10 py-4 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase cursor-pointer transition-all duration-300 hover:-translate-y-1"
              style={{ background: gold, color: bg, boxShadow: `0 8px 32px ${gold}30` }}>
              {data.cta.buttonText}
            </button>
            <a href="#galeria"
              className="px-10 py-4 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase cursor-pointer transition-all duration-300 border hover:opacity-80"
              style={{ color: textColor, borderColor: `${textColor}20` }}>
              Conheça nosso espaço
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES STRIP ═══ */}
      <div className="py-12 px-6" style={{ borderTop: `1px solid ${gold}12`, borderBottom: `1px solid ${gold}12`, background: bgAlt }}>
        <div className="max-w-5xl mx-auto flex justify-between flex-wrap gap-6">
          {data.features.map((f, i) => (
            <Fade key={i} delay={i * 120} className="text-center flex-1 min-w-[120px]">
              <div className="font-display text-3xl md:text-4xl italic" style={{ color: gold }}>{f.value}</div>
              <div className="text-[10px] font-semibold tracking-[0.12em] uppercase mt-1" style={{ color: muted }}>{f.label}</div>
            </Fade>
          ))}
        </div>
      </div>

      {/* ═══ ABOUT ═══ */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <Fade>
            <div className="rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl" style={{ border: `1px solid ${gold}15` }}>
              <img src={data.about.image} alt="" loading="lazy" className="w-full h-full object-cover" />
            </div>
          </Fade>
          <Fade delay={150}>
            <div>
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ color: gold }}>{theme.sectionLabels.about}</span>
              <h2 className="font-display text-3xl md:text-4xl italic mt-3 mb-6 leading-tight" style={{ color: textColor }}>
                Conheça a {data.name}
              </h2>
              <p className="text-[15px] leading-[2.1]" style={{ color: `${textColor}80` }}>{data.about.text}</p>
            </div>
          </Fade>
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id={theme.navItems[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')} className="py-20 md:py-28 px-6" style={{ background: bgAlt }}>
        <div className="max-w-5xl mx-auto">
          <Fade className="text-center mb-14">
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ color: gold }}>{theme.sectionLabels.services}</span>
            <h2 className="font-display text-3xl md:text-4xl italic mt-3 leading-tight" style={{ color: textColor }}>O que oferecemos</h2>
            {/* Gold ornament */}
            <div className="flex items-center justify-center gap-2 mt-5">
              <div className="w-8 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${gold}60)` }} />
              <div className="w-[5px] h-[5px] rounded-full" style={{ border: `1px solid ${gold}50` }} />
              <div className="w-8 h-[1px]" style={{ background: `linear-gradient(90deg, ${gold}60, transparent)` }} />
            </div>
          </Fade>

          {categories.filter(Boolean).map(cat => (
            <div key={cat} className="mb-10">
              <h3 className="font-display text-2xl italic mb-5 pb-2" style={{ color: gold, borderBottom: `1px solid ${gold}20` }}>{cat}</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {data.services.filter(s => s.category === cat).map((s, i) => (
                  <Fade key={s.name} delay={i * 50}>
                    <div onClick={() => setBookingSvc(s)}
                      className="p-6 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 relative group"
                      style={{ background: `${gold}04`, border: `1px solid ${gold}08`, borderBottom: `2px solid transparent` }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderBottomColor = `${gold}40`; (e.currentTarget as HTMLElement).style.background = `${gold}08`; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent'; (e.currentTarget as HTMLElement).style.background = `${gold}04`; }}>
                      {s.popular && <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[8px] font-bold tracking-wider uppercase" style={{ background: `${gold}15`, color: gold, border: `1px solid ${gold}20` }}>Popular</span>}
                      <h4 className="font-display text-lg italic mb-1" style={{ color: textColor }}>{s.name}</h4>
                      <p className="text-[12px] leading-relaxed mb-3" style={{ color: muted }}>{s.desc}</p>
                      <div className="flex justify-between items-center pt-3" style={{ borderTop: `1px solid ${gold}08` }}>
                        <span className="font-display text-xl italic" style={{ color: gold }}>{s.price}</span>
                        {s.time && <span className="text-[11px]" style={{ color: muted }}>{s.time}</span>}
                      </div>
                    </div>
                  </Fade>
                ))}
              </div>
            </div>
          ))}
          {/* Fallback if no categories */}
          {categories.filter(Boolean).length === 0 && (
            <div className="grid md:grid-cols-2 gap-3">
              {data.services.map((s, i) => (
                <Fade key={s.name} delay={i * 50}>
                  <div onClick={() => setBookingSvc(s)}
                    className="p-6 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
                    style={{ background: `${gold}04`, border: `1px solid ${gold}08` }}>
                    <h4 className="font-display text-lg italic mb-1" style={{ color: textColor }}>{s.name}</h4>
                    <p className="text-[12px] leading-relaxed mb-3" style={{ color: muted }}>{s.desc}</p>
                    <div className="flex justify-between items-center pt-3" style={{ borderTop: `1px solid ${gold}08` }}>
                      <span className="font-display text-xl italic" style={{ color: gold }}>{s.price}</span>
                      {s.time && <span className="text-[11px]" style={{ color: muted }}>{s.time}</span>}
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
        <section id="equipe" className="py-20 md:py-28 px-6">
          <div className="max-w-5xl mx-auto">
            <Fade className="text-center mb-14">
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ color: gold }}>{theme.sectionLabels.staff}</span>
              <h2 className="font-display text-3xl md:text-4xl italic mt-3" style={{ color: textColor }}>Nossa equipe</h2>
            </Fade>
            <div className="flex justify-center flex-wrap gap-10">
              {staff.map((s, i) => (
                <Fade key={s.name} delay={i * 100} className="text-center w-52">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ padding: 3, background: `linear-gradient(135deg, ${gold}50, ${gold}20)` }}>
                    <div className="w-full h-full rounded-full flex items-center justify-center font-display text-3xl italic" style={{ background: `${gold}08`, color: gold }}>
                      {s.name.split(' ').pop()?.[0] || s.name[0]}
                    </div>
                  </div>
                  {s.available && <div className="w-3 h-3 rounded-full bg-green-400 mx-auto -mt-3 mb-2 relative z-10" style={{ border: `3px solid ${bg}` }} />}
                  <h3 className="font-display text-base italic" style={{ color: textColor }}>{s.name}</h3>
                  <p className="text-[11px] mt-1" style={{ color: muted }}>{s.role}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star size={12} fill={gold} color={gold} />
                    <span className="text-[12px] font-semibold" style={{ color: gold }}>{s.rating}</span>
                  </div>
                </Fade>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ GALLERY ═══ */}
      <section id="galeria" className="py-20 md:py-28 px-6" style={{ background: bgAlt }}>
        <div className="max-w-5xl mx-auto">
          <Fade className="text-center mb-14">
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ color: gold }}>{theme.sectionLabels.gallery}</span>
            <h2 className="font-display text-3xl md:text-4xl italic mt-3" style={{ color: textColor }}>Galeria</h2>
          </Fade>

          {/* Mobile carousel */}
          <div className="md:hidden relative">
            <div className="rounded-xl overflow-hidden h-72">
              <img src={data.gallery[galleryIdx]} alt="" className="w-full h-full object-cover" />
            </div>
            <button onClick={() => setGalleryIdx(p => (p - 1 + data.gallery.length) % data.gallery.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${bg}cc`, color: gold }}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setGalleryIdx(p => (p + 1) % data.gallery.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${bg}cc`, color: gold }}>
              <ChevronRight size={18} />
            </button>
            <div className="flex justify-center gap-2 mt-4">
              {data.gallery.map((_, i) => (
                <button key={i} onClick={() => setGalleryIdx(i)}
                  className="rounded-full transition-all duration-300"
                  style={{ width: i === galleryIdx ? 24 : 8, height: 8, background: i === galleryIdx ? gold : `${gold}30` }} />
              ))}
            </div>
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid grid-cols-3 gap-3">
            {data.gallery.slice(0, 6).map((img, i) => (
              <Fade key={i} delay={i * 60}>
                <div className="relative h-56 rounded-xl overflow-hidden cursor-pointer group" onClick={() => setLightboxIdx(i)}>
                  <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 transition-colors duration-300" style={{ background: `${gold}00` }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${gold}15`}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = `${gold}00`} />
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: `${bg}ee`, backdropFilter: 'blur(16px)' }} onClick={() => setLightboxIdx(null)}>
          <button className="absolute top-6 right-6" style={{ color: gold }}><X size={28} /></button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: gold }} onClick={e => { e.stopPropagation(); setLightboxIdx(p => (p! - 1 + data.gallery.length) % data.gallery.length); }}><ChevronLeft size={32} /></button>
          <img src={data.gallery[lightboxIdx]} alt="" className="max-w-[85vw] max-h-[85vh] rounded-xl object-contain" onClick={e => e.stopPropagation()} />
          <button className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: gold }} onClick={e => { e.stopPropagation(); setLightboxIdx(p => (p! + 1) % data.gallery.length); }}><ChevronRight size={32} /></button>
        </div>
      )}

      {/* ═══ REVIEWS ═══ */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <Fade className="text-center mb-14">
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ color: gold }}>{theme.sectionLabels.reviews}</span>
            <h2 className="font-display text-3xl md:text-4xl italic mt-3" style={{ color: textColor }}>O que dizem nossos clientes</h2>
          </Fade>
          <div className="grid md:grid-cols-3 gap-6">
            {data.reviews.slice(0, 3).map((rv, i) => (
              <Fade key={i} delay={i * 100}>
                <div className="p-6 rounded-xl" style={{ background: `${gold}04`, border: `1px solid ${gold}10` }}>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: rv.stars }).map((_, j) => <Star key={j} size={14} fill={gold} color={gold} />)}
                  </div>
                  <p className="text-[13px] leading-relaxed italic mb-4" style={{ color: `${textColor}cc` }}>"{rv.text}"</p>
                  <div className="pt-4" style={{ borderTop: `1px solid ${gold}10` }}>
                    <p className="font-semibold text-sm" style={{ color: gold }}>{rv.name}</p>
                    {rv.time && <p className="text-[11px] mt-1" style={{ color: muted }}>{rv.time}</p>}
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PLANS ═══ */}
      {plans.length > 0 && (
        <section id="planos" className="py-20 md:py-28 px-6" style={{ background: bgAlt }}>
          <div className="max-w-5xl mx-auto">
            <Fade className="text-center mb-14">
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ color: gold }}>{theme.sectionLabels.plans}</span>
              <h2 className="font-display text-3xl md:text-4xl italic mt-3" style={{ color: textColor }}>Nossos planos</h2>
            </Fade>
            <div className={`grid gap-5 items-stretch ${plans.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 max-w-3xl mx-auto'}`}>
              {plans.map((p, i) => (
                <Fade key={p.name} delay={i * 100}>
                  <div className="p-8 rounded-2xl flex flex-col h-full relative transition-transform duration-300 hover:-translate-y-1"
                    style={{
                      background: theme.dark ? `${gold}04` : '#fff',
                      border: `1px solid ${p.popular ? gold : `${gold}12`}`,
                      boxShadow: p.popular ? `0 16px 48px ${gold}10` : 'none',
                      transform: p.popular ? 'scale(1.03)' : 'none',
                    }}>
                    {p.popular && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase text-white"
                        style={{ background: `linear-gradient(135deg, ${gold}, ${gold}cc)`, boxShadow: `0 4px 16px ${gold}30` }}>
                        Mais escolhido
                      </span>
                    )}
                    <h3 className="font-display text-xl italic mb-2" style={{ color: textColor }}>{p.name}</h3>
                    <div className="font-display text-3xl italic mb-6" style={{ color: gold }}>{p.price}</div>
                    <ul className="flex-1 space-y-3 mb-6">
                      {p.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-[13px]" style={{ color: `${textColor}bb` }}>
                          <Check size={14} color={gold} />{f}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-3.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all"
                      style={{
                        background: p.popular ? `linear-gradient(135deg, ${gold}, ${gold}cc)` : 'transparent',
                        color: p.popular ? bg : textColor,
                        border: p.popular ? 'none' : `1px solid ${gold}20`,
                      }}>
                      Começar agora
                    </button>
                  </div>
                </Fade>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ FAQ ═══ */}
      {data.faq && data.faq.length > 0 && (
        <section className="py-20 md:py-28 px-6">
          <div className="max-w-3xl mx-auto">
            <Fade className="text-center mb-14">
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ color: gold }}>Dúvidas frequentes</span>
              <h2 className="font-display text-3xl md:text-4xl italic mt-3" style={{ color: textColor }}>FAQ</h2>
            </Fade>
            {data.faq.map((f, i) => (
              <Fade key={i} delay={i * 50}>
                <div className="mb-3 rounded-xl overflow-hidden" style={{ border: `1px solid ${gold}10` }}>
                  <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="w-full text-left p-5 flex justify-between items-center cursor-pointer transition-colors"
                    style={{ background: faqOpen === i ? `${gold}06` : 'transparent' }}>
                    <span className="font-semibold text-sm" style={{ color: textColor }}>{f.q}</span>
                    <span className="text-lg transition-transform duration-300" style={{ color: gold, transform: faqOpen === i ? 'rotate(45deg)' : 'none' }}>+</span>
                  </button>
                  {faqOpen === i && (
                    <div className="px-5 pb-5">
                      <p className="text-[13px] leading-relaxed" style={{ color: muted }}>{f.a}</p>
                    </div>
                  )}
                </div>
              </Fade>
            ))}
          </div>
        </section>
      )}

      {/* ═══ CONTACT ═══ */}
      <section id="contato" className="py-20 md:py-28 px-6" style={{ background: bgAlt }}>
        <div className="max-w-5xl mx-auto">
          <Fade className="text-center mb-14">
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ color: gold }}>{theme.sectionLabels.contact}</span>
            <h2 className="font-display text-3xl md:text-4xl italic mt-3" style={{ color: textColor }}>{data.cta.text}</h2>
          </Fade>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { icon: <Phone size={28} />, label: 'WhatsApp', value: data.phone },
              { icon: <MapPin size={28} />, label: 'Localização', value: data.city },
              { icon: <Clock size={28} />, label: 'Horário', value: 'Seg-Sáb' },
              { icon: <Star size={28} />, label: 'Avaliação', value: `${data.features.find(f => f.label.includes('Avaliação'))?.value || '5.0 ★'}` },
            ].map((item, i) => (
              <Fade key={i} delay={i * 80}>
                <div className="p-5 rounded-xl text-center" style={{ background: `${gold}04`, border: `1px solid ${gold}10` }}>
                  <div className="mx-auto mb-3" style={{ color: gold }}>{item.icon}</div>
                  <p className="text-[10px] font-semibold tracking-wider uppercase mb-1" style={{ color: gold }}>{item.label}</p>
                  <p className="text-[13px]" style={{ color: textColor }}>{item.value}</p>
                </div>
              </Fade>
            ))}
          </div>

          {/* Maps */}
          <Fade delay={200}>
            <div className="rounded-xl overflow-hidden h-64" style={{ border: `1px solid ${gold}10` }}>
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCdpxxgZRYNVs2cQ_X8SOZchL-iVl48tmU&q=${encodeURIComponent(data.name + ' ' + data.city)}`}
                className="w-full h-full border-0"
                style={{ filter: theme.dark ? 'invert(0.9) hue-rotate(180deg) saturate(0.3)' : 'none' }}
                loading="lazy" allowFullScreen />
            </div>
          </Fade>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-6 px-6 text-center" style={{ borderTop: `1px solid ${gold}08` }}>
        <p className="text-[11px]" style={{ color: `${muted}80` }}>© 2026 {data.name}. Todos os direitos reservados.</p>
      </footer>

      {/* WhatsApp FAB */}
      <a href="#contato" className="fixed bottom-16 right-5 z-40 w-12 h-12 rounded-full bg-[#25d366] flex items-center justify-center shadow-lg transition-transform hover:scale-110" style={{ fontSize: 20, color: '#fff' }}>
        <Phone size={20} />
      </a>

      {/* Stauf banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 py-2 px-5 flex items-center justify-between" style={{ background: theme.dark ? `${bg}f5` : `${bgAlt}f5`, backdropFilter: 'blur(16px)', borderTop: `1px solid ${gold}10` }}>
        <div className="flex items-center gap-2">
          <span className="text-[#2dd4bf] text-sm font-bold">STAUF.</span>
          <span className="text-[11px] hidden sm:inline" style={{ color: muted }}>Demo visual — Quer um site assim?</span>
        </div>
        <Link to="/" className="px-4 py-1.5 bg-[#2dd4bf] text-[#0a0a0f] rounded-full text-[11px] font-bold no-underline">Conheça a Stauf.</Link>
      </div>

      {/* ═══ SERVICE PICKER MODAL ═══ */}
      {bookingPicker && !bookingSvc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: theme.dark ? `${bg}dd` : `${bg}e0`, backdropFilter: 'blur(16px)' }} onClick={() => setBookingPicker(false)}>
          <div className="rounded-2xl p-8 w-full max-w-lg max-h-[85vh] overflow-y-auto" style={{ background: theme.dark ? bgAlt : '#fff', border: `1px solid ${gold}15`, boxShadow: `0 32px 80px rgba(0,0,0,0.3)` }} onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase" style={{ color: gold }}>Agendar</span>
              <h3 className="font-display text-2xl italic mt-2" style={{ color: textColor }}>Escolha o serviço</h3>
            </div>
            <div className="space-y-2">
              {data.services.map(s => (
                <button key={s.name} onClick={() => setBookingSvc(s)}
                  className="w-full p-4 rounded-xl flex justify-between items-center text-left transition-all cursor-pointer"
                  style={{ background: `${gold}04`, border: `1px solid ${gold}10` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = gold; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${gold}10`; }}>
                  <div>
                    <div className="font-display text-base italic" style={{ color: textColor }}>{s.name}</div>
                    {s.time && <div className="text-[11px] mt-0.5" style={{ color: muted }}>{s.time}</div>}
                  </div>
                  <span className="font-display text-lg italic" style={{ color: gold }}>{s.price}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ BOOKING MODAL ═══ */}
      {bookingSvc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: theme.dark ? `${bg}dd` : `${bg}e0`, backdropFilter: 'blur(16px)' }} onClick={() => { if (!bookingDone) { setBookingSvc(null); setBookingPicker(false); } }}>
          <div className="rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ background: theme.dark ? bgAlt : '#fff', border: `1px solid ${gold}15`, boxShadow: `0 32px 80px rgba(0,0,0,0.3)` }} onClick={e => e.stopPropagation()}>
            {bookingDone ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl" style={{ border: `2px solid ${gold}`, color: gold }}>✓</div>
                <h3 className="font-display text-2xl italic mb-2" style={{ color: textColor }}>Agendamento confirmado!</h3>
                <p className="text-[13px]" style={{ color: muted }}>Você receberá uma confirmação pelo WhatsApp em instantes.</p>
              </div>
            ) : (<>
              <h3 className="font-display text-xl italic mb-1" style={{ color: textColor }}>{bookingSvc.name}</h3>
              <p className="text-[13px] mb-6" style={{ color: muted }}>{bookingSvc.price} · {bookingSvc.time}</p>

              {staff.filter(s => s.available).length > 0 && <>
                <p className="text-[10px] font-bold tracking-wider uppercase mb-3" style={{ color: gold }}>Profissional</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {staff.filter(s => s.available).map(s => (
                    <button key={s.name} onClick={() => setBookingStaff(s)}
                      className="px-4 py-2 rounded-xl transition-all text-left"
                      style={{ background: bookingStaff?.name === s.name ? `${gold}12` : `${gold}04`, border: `1px solid ${bookingStaff?.name === s.name ? gold : `${gold}10`}` }}>
                      <div className="text-[13px] font-semibold" style={{ color: textColor }}>{s.name}</div>
                      <div className="text-[11px]" style={{ color: muted }}>{s.role}</div>
                    </button>
                  ))}
                </div>
              </>}

              <p className="text-[10px] font-bold tracking-wider uppercase mb-3" style={{ color: gold }}>Data</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {['Hoje', 'Amanhã', 'Qua', 'Qui', 'Sex'].map(d => (
                  <button key={d} onClick={() => setBookingDate(d)}
                    className="px-4 py-2 rounded-lg text-[12px] transition-all"
                    style={{ background: bookingDate === d ? `${gold}12` : `${gold}04`, border: `1px solid ${bookingDate === d ? gold : `${gold}10`}`, color: bookingDate === d ? gold : muted, fontWeight: bookingDate === d ? 700 : 400 }}>
                    {d}
                  </button>
                ))}
              </div>

              <p className="text-[10px] font-bold tracking-wider uppercase mb-3" style={{ color: gold }}>Horário</p>
              <div className="grid grid-cols-3 gap-1.5 mb-5">
                {times.map(t => (
                  <button key={t} onClick={() => setBookingTime(t)}
                    className="py-2.5 rounded-lg text-[13px] transition-all"
                    style={{ background: bookingTime === t ? gold : `${gold}04`, color: bookingTime === t ? bg : muted, border: `1px solid ${bookingTime === t ? gold : `${gold}10`}`, fontWeight: bookingTime === t ? 700 : 400 }}>
                    {t}
                  </button>
                ))}
              </div>

              <p className="text-[10px] font-bold tracking-wider uppercase mb-3" style={{ color: gold }}>Seus dados</p>
              <input placeholder="Seu nome" value={bookingName} onChange={e => setBookingName(e.target.value)}
                className="w-full p-3 rounded-lg text-[13px] outline-none mb-2 transition-colors"
                style={{ background: `${gold}04`, border: `1px solid ${gold}10`, color: textColor }} />
              <input placeholder="WhatsApp (41) 99999-9999" value={bookingPhone} onChange={e => setBookingPhone(e.target.value)}
                className="w-full p-3 rounded-lg text-[13px] outline-none mb-3 transition-colors"
                style={{ background: `${gold}04`, border: `1px solid ${gold}10`, color: textColor }} />
              <p className="text-[11px] mb-4" style={{ color: muted }}>Você receberá uma confirmação automática pelo WhatsApp.</p>

              <button onClick={handleBook}
                disabled={!bookingDate || !bookingTime || !bookingName || !bookingPhone}
                className="w-full py-4 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all"
                style={{
                  background: bookingDate && bookingTime && bookingName && bookingPhone ? `linear-gradient(135deg, ${gold}, ${gold}cc)` : `${gold}25`,
                  color: bg,
                  cursor: bookingDate && bookingTime && bookingName && bookingPhone ? 'pointer' : 'not-allowed',
                  boxShadow: bookingDate && bookingTime && bookingName && bookingPhone ? `0 4px 20px ${gold}25` : 'none',
                }}>
                Confirmar agendamento
              </button>
            </>)}
          </div>
        </div>
      )}

      <style>{`
        @keyframes proFadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
      `}</style>
    </div>
  );
}
