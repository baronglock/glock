import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

/* ── Types ── */
interface ServiceItem { name: string; desc: string; icon: string }
interface ReviewItem { name: string; text: string; stars: number }
interface FeatureItem { label: string; value: string }
interface TierConfig {
  name: string;
  price: string;
  period: string;
  servicesCount: number;
  showGallery: boolean;
  showReviews: boolean;
  showFeatures: boolean;
  showBlog: boolean;
  showFaq: boolean;
  animatedHero: boolean;
  glowEffects: boolean;
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
  blogPosts?: { title: string; excerpt: string; image: string }[];
}

/* ── Outline Icons (sem emoji colorido) ── */
const ICONS: Record<string, string> = {
  '✂️': '✂', '🪒': '⌇', '👑': '♛', '🎨': '◎', '💧': '◇', '🍺': '◈',
  '🍕': '◉', '🏋️': '△', '🐾': '◬', '💉': '⊕', '🏠': '⌂', '👗': '◊',
  '📱': '☎', '📍': '⊙', '💬': '◯', '⚙️': '⛭', '🔧': '⚙', '🍽️': '◎',
  '🧹': '◇', '💇': '✂', '🦷': '◇', '🏥': '⊕', '📊': '▥', '🤖': '◈',
  '🌿': '❦', '🏪': '⌂', '📋': '▤', '🎯': '◎', '⭐': '★', '🚗': '◇',
};
function Icon({ emoji, color, size = 22 }: { emoji: string; color: string; size?: number }) {
  const outline = ICONS[emoji] || emoji;
  return <span style={{ fontSize: size, color, fontWeight: 300, lineHeight: 1 }}>{outline}</span>;
}

/* ── Tier definitions ── */
const TIERS: Record<string, TierConfig> = {
  essencial: {
    name: 'Essencial', price: 'R$ 1.497', period: 'setup + R$ 149/mês',
    servicesCount: 4,
    showGallery: true,       // galeria simples (fotos)
    showReviews: false,      // sem avaliações
    showFeatures: true,
    showBlog: false,         // sem blog
    showFaq: false,          // sem FAQ
    animatedHero: false,     // hero estático
    glowEffects: false,      // sem efeitos glow
    // Visual: single page clean, sem animações, sem maps, sem dark mode toggle
  },
  profissional: {
    name: 'Profissional', price: 'R$ 2.997', period: 'setup + R$ 249/mês',
    servicesCount: 6,
    showGallery: true,       // galeria com hover zoom
    showReviews: true,       // avaliações Google
    showFeatures: true,
    showBlog: false,
    showFaq: true,           // FAQ accordion
    animatedHero: true,      // hero com parallax sutil
    glowEffects: true,       // glow nos cards, shadows
    // Visual: animações de scroll, Google Maps, catálogo interativo, SEO badges
  },
  premium: {
    name: 'Premium', price: 'Sob consulta', period: 'projeto personalizado',
    servicesCount: 8,
    showGallery: true,       // galeria premium com lightbox feel
    showReviews: true,
    showFeatures: true,
    showBlog: true,          // blog preview
    showFaq: true,
    animatedHero: true,      // hero cinematográfico
    glowEffects: true,
    // Visual: TUDO + blog, catálogo produtos, carrinho visual, painel admin mockup
  },
};

/* ── Scroll Reveal ── */
function Reveal({ children, delay = 0, show = true }: { children: React.ReactNode; delay?: number; show?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!show) { setVisible(false); return; }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [show]);
  return (
    <div ref={ref} style={{
      opacity: visible && show ? 1 : 0,
      transform: visible && show ? 'translateY(0)' : 'translateY(24px)',
      transition: `all 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
      maxHeight: show ? 2000 : 0,
      overflow: show ? 'visible' : 'hidden',
      marginBottom: show ? undefined : 0,
      padding: show ? undefined : 0,
    }}>
      {children}
    </div>
  );
}

/* ── Main Component ── */
export default function DemoPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<DemoData | null>(null);
  const [error, setError] = useState('');
  const [tier, setTier] = useState<string>('profissional');
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/demos/data/${slug}.json`)
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json(); })
      .then(setData)
      .catch(() => setError('Demo não encontrada'));
  }, [slug]);

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 48, fontWeight: 200, marginBottom: 16 }}>404</h1>
        <p style={{ color: '#888', marginBottom: 32 }}>{error}</p>
        <Link to="/" style={{ color: '#2dd4bf', textDecoration: 'none' }}>← Voltar pra Stauf.</Link>
      </div>
    </div>
  );

  if (!data) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #333', borderTopColor: '#2dd4bf', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const c = data.colors;
  const f = "'Inter', system-ui, sans-serif";
  const t = TIERS[tier];
  const navItems = ['Sobre', 'Serviços', ...(t.showGallery ? ['Galeria'] : []), ...(t.showReviews ? ['Avaliações'] : []), 'Contato'];

  return (
    <div style={{ background: c.bg, color: c.text, fontFamily: f, minHeight: '100vh', paddingBottom: 56, transition: 'all 0.5s' }}>

      {/* ── Tier Switcher (floating) ── */}
      <div style={{
        position: 'fixed', top: 70, left: '50%', transform: 'translateX(-50%)', zIndex: 101,
        display: 'flex', gap: 2, padding: 3, background: `${c.bg}e0`, backdropFilter: 'blur(12px)',
        borderRadius: 10, border: `1px solid ${c.primary}20`, boxShadow: `0 4px 24px ${c.bg}80`,
      }}>
        {Object.entries(TIERS).map(([key, val]) => (
          <button key={key} onClick={() => setTier(key)} style={{
            padding: '6px 16px', fontSize: 11, fontWeight: tier === key ? 700 : 500,
            background: tier === key ? c.primary : 'transparent',
            color: tier === key ? c.bg : c.textMuted,
            border: 'none', borderRadius: 8, cursor: 'pointer',
            transition: 'all 0.3s',
            letterSpacing: '0.03em',
          }}>{val.name}</button>
        ))}
      </div>

      {/* ── Navbar ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `${c.bg}e8`, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${c.primary}10` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {data.logo && <img src={data.logo} alt="" style={{ height: 28, borderRadius: 4 }} />}
          <span style={{ fontSize: 22, fontWeight: 700, color: c.primary, letterSpacing: '-0.02em' }}>{data.name}</span>
        </div>
        <div style={{ display: 'flex', gap: 28, fontSize: 13, fontWeight: 500 }} className="demo-nav-links">
          {navItems.map(item => (
            <a key={item} href={`#${item.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`} style={{ color: c.textMuted, textDecoration: 'none', transition: 'color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.color = c.primary}
              onMouseLeave={e => e.currentTarget.style.color = c.textMuted}
            >{item}</a>
          ))}
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="demo-hamburger" style={{ display: 'none', background: 'none', border: 'none', color: c.text, fontSize: 22, cursor: 'pointer' }}>☰</button>
      </nav>

      {menuOpen && (
        <div style={{ position: 'fixed', top: 56, left: 0, right: 0, zIndex: 99, background: `${c.bg}f5`, backdropFilter: 'blur(16px)', padding: 24, display: 'flex', flexDirection: 'column', gap: 20, borderBottom: `1px solid ${c.primary}15` }}>
          {navItems.map(item => (
            <a key={item} href={`#${item.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`} onClick={() => setMenuOpen(false)}
              style={{ color: c.textMuted, textDecoration: 'none', fontSize: 16 }}>{item}</a>
          ))}
        </div>
      )}

      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={data.hero.image} alt="" loading="eager" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 8s ease', transform: t.animatedHero ? 'scale(1.08)' : 'scale(1.02)' }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${c.bg} 0%, ${c.bg}d0 35%, ${c.bg}60 65%, ${c.bg}30 100%)` }} />
          {t.glowEffects && <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60%', height: '60%', background: `radial-gradient(circle, ${c.primary}12 0%, transparent 70%)`, pointerEvents: 'none', transition: 'opacity 0.8s' }} />}
        </div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 800, padding: '140px 32px 120px', marginLeft: '8%' }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', background: `${c.primary}15`, border: `1px solid ${c.primary}25`, borderRadius: 6, marginBottom: 28, transition: 'all 0.5s' }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: c.primary, textTransform: 'uppercase' }}>{data.tagline}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.8rem, 7vw, 4.8rem)', fontWeight: 800, lineHeight: 1.0, marginBottom: 28, letterSpacing: '-0.03em', transition: 'all 0.5s' }}>
            {data.hero.title.split(' ').map((word, i) =>
              <span key={i} style={{ color: i === 0 ? c.primary : c.text, transition: 'color 0.5s' }}>{word} </span>
            )}
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: c.textMuted, lineHeight: 1.8, marginBottom: 44, maxWidth: 520 }}>{data.hero.subtitle}</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button style={{ padding: '15px 34px', background: c.primary, color: c.bg, border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', boxShadow: t.glowEffects ? `0 8px 28px ${c.primary}35` : 'none' }}>{data.cta.buttonText}</button>
            <button style={{ padding: '15px 34px', background: `${c.primary}08`, color: c.primary, border: `1px solid ${c.primary}25`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Saiba mais ↓</button>
          </div>
          {/* Plan badge */}
          <div style={{ marginTop: 32, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', background: `${c.primary}10`, borderRadius: 6, transition: 'all 0.4s' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.primary }} />
            <span style={{ fontSize: 11, color: c.textMuted }}>Plano {t.name} — {t.price} <span style={{ opacity: 0.6 }}>{t.period}</span></span>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <Reveal show={t.showFeatures}>
        <section style={{ padding: '48px 32px', background: `${c.primary}05`, borderTop: `1px solid ${c.primary}08`, borderBottom: `1px solid ${c.primary}08` }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 32 }}>
            {data.features.map((ft, i) => (
              <div key={i} style={{ textAlign: 'center', minWidth: 110, transition: 'all 0.4s' }}>
                <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: c.primary }}>{ft.value}</div>
                <div style={{ fontSize: 11, color: c.textMuted, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{ft.label}</div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── About ── */}
      <section id="sobre" style={{ padding: '96px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }} className="demo-grid">
          <Reveal>
            <div>
              <span style={{ display: 'inline-block', padding: '4px 12px', background: `${c.primary}10`, color: c.primary, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 20, borderRadius: 4, textTransform: 'uppercase' }}>Sobre nós</span>
              <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: 300, marginBottom: 20, color: c.text }}>Conheça a {data.name}</h2>
              <p style={{ color: c.textMuted, fontSize: 15, lineHeight: 1.9 }}>{data.about.text}</p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div style={{ borderRadius: 18, overflow: 'hidden', aspectRatio: '4/3', boxShadow: t.glowEffects ? `0 20px 40px ${c.primary}10` : 'none', transition: 'box-shadow 0.5s' }}>
              <img src={data.about.image} alt={data.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="servicos" style={{ padding: '96px 32px', background: `${c.primary}03` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={{ display: 'inline-block', padding: '4px 12px', background: `${c.primary}10`, color: c.primary, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 14, borderRadius: 4, textTransform: 'uppercase' }}>Serviços</span>
              <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: 300, color: c.text }}>O que oferecemos</h2>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, transition: 'all 0.5s' }}>
            {data.services.slice(0, t.servicesCount).map((s, i) => (
              <Reveal key={s.name} delay={i * 80} show={i < t.servicesCount}>
                <div style={{ padding: 26, background: c.bg, border: `1px solid ${c.primary}08`, borderRadius: 14, transition: 'all 0.4s', cursor: 'default' }}
                  onMouseEnter={e => { if (t.glowEffects) { e.currentTarget.style.borderColor = `${c.primary}30`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${c.primary}10`; }}}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${c.primary}08`; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `${c.primary}08`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Icon emoji={s.icon} color={c.primary} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: c.text, marginBottom: 8 }}>{s.name}</h3>
                  <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery (Pro+) ── */}
      <Reveal show={t.showGallery}>
        <section id="galeria" style={{ padding: '96px 32px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={{ display: 'inline-block', padding: '4px 12px', background: `${c.primary}10`, color: c.primary, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 14, borderRadius: 4, textTransform: 'uppercase' }}>Galeria</span>
              <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: 300, color: c.text }}>Nosso espaço</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }} className="demo-gallery">
              {data.gallery.map((img, i) => (
                <div key={i} style={{ borderRadius: 12, overflow: 'hidden', gridColumn: (i === 0 || i === 3) ? 'span 2' : 'span 1', aspectRatio: (i === 0 || i === 3) ? '2/1' : '1/1', transition: 'all 0.4s' }}>
                  <img src={img} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    onError={e => { (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&auto=format&fit=crop`; }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Reviews (Pro+) ── */}
      <Reveal show={t.showReviews}>
        <section id="avaliacoes" style={{ padding: '96px 32px', background: `${c.primary}03` }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={{ display: 'inline-block', padding: '4px 12px', background: `${c.primary}10`, color: c.primary, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 14, borderRadius: 4, textTransform: 'uppercase' }}>Avaliações</span>
              <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: 300, color: c.text }}>O que dizem sobre nós</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
              {data.reviews.map((r, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div style={{ padding: 26, background: c.bg, border: `1px solid ${c.primary}08`, borderRadius: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${c.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: c.primary }}>{r.name.charAt(0)}</div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 2 }}>{r.name}</p>
                        <span style={{ fontSize: 13, color: c.primary }}>{'★'.repeat(r.stars)}<span style={{ color: `${c.textMuted}40` }}>{'★'.repeat(5 - r.stars)}</span></span>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.8, fontStyle: 'italic' }}>"{r.text}"</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── FAQ (Premium) ── */}
      <Reveal show={t.showFaq && !!data.faq?.length}>
        <section style={{ padding: '96px 32px' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={{ display: 'inline-block', padding: '4px 12px', background: `${c.primary}10`, color: c.primary, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 14, borderRadius: 4, textTransform: 'uppercase' }}>FAQ</span>
              <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: 300, color: c.text }}>Perguntas frequentes</h2>
            </div>
            {(data.faq || []).map((item, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${c.primary}10`, marginBottom: 4 }}>
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
        </section>
      </Reveal>

      {/* ── Google Maps (Pro+) ── */}
      <Reveal show={t.glowEffects}>
        <section style={{ padding: '96px 32px', background: `${c.primary}03` }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={{ display: 'inline-block', padding: '4px 12px', background: `${c.primary}10`, color: c.primary, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 14, borderRadius: 4, textTransform: 'uppercase' }}>Localização</span>
              <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: 300, color: c.text }}>Como chegar</h2>
            </div>
            <div style={{ borderRadius: 16, overflow: 'hidden', height: 350, background: `${c.primary}08`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${c.primary}10` }}>
              <div style={{ textAlign: 'center', color: c.textMuted }}>
                <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.5 }}>⊙</div>
                <p style={{ fontSize: 14 }}>Google Maps integrado</p>
                <p style={{ fontSize: 12, opacity: 0.6 }}>{data.city}</p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Blog Preview (Premium) ── */}
      <Reveal show={t.showBlog}>
        <section style={{ padding: '96px 32px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={{ display: 'inline-block', padding: '4px 12px', background: `${c.primary}10`, color: c.primary, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 14, borderRadius: 4, textTransform: 'uppercase' }}>Blog</span>
              <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: 300, color: c.text }}>Últimas novidades</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              {[
                { title: `Tendências 2026 para ${data.niche}`, excerpt: `As principais novidades do mercado de ${data.niche} que vão transformar seu negócio este ano.`, img: data.gallery[0] },
                { title: `Como atrair mais clientes com presença digital`, excerpt: 'Descubra as estratégias que negócios locais estão usando para dobrar o faturamento.', img: data.gallery[1] },
                { title: `${data.name}: nossa história e missão`, excerpt: `Conheça a trajetória da ${data.name} e o que nos motiva a oferecer o melhor serviço.`, img: data.about.image },
              ].map((post, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div style={{ borderRadius: 14, overflow: 'hidden', background: c.bg, border: `1px solid ${c.primary}08`, transition: 'all 0.4s', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${c.primary}10`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ height: 180, overflow: 'hidden' }}>
                      <img src={post.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&auto=format&fit=crop'; }} />
                    </div>
                    <div style={{ padding: 22 }}>
                      <span style={{ fontSize: 11, color: c.primary, fontWeight: 600 }}>ARTIGO</span>
                      <h3 style={{ fontSize: 16, fontWeight: 600, color: c.text, marginTop: 8, marginBottom: 10 }}>{post.title}</h3>
                      <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.7 }}>{post.excerpt}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── CTA Section (Pro+ tem mais impacto) ── */}
      <Reveal>
        <section style={{ padding: '80px 32px', textAlign: 'center', background: t.glowEffects ? `linear-gradient(135deg, ${c.primary}08 0%, transparent 50%)` : 'transparent' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, marginBottom: 16, color: c.text }}>{data.cta.text}</h2>
            <p style={{ color: c.textMuted, marginBottom: 32, fontSize: 15 }}>Entre em contato e transforme seu negócio.</p>
            <button style={{ padding: '16px 40px', background: c.primary, color: c.bg, border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: t.glowEffects ? `0 8px 32px ${c.primary}30` : 'none' }}>{data.cta.buttonText}</button>
          </div>
        </section>
      </Reveal>

      {/* ── Contact ── */}
      <section id="contato" style={{ padding: '96px 32px', background: `${c.primary}03` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56 }} className="demo-grid">
          <Reveal>
            <div>
              <span style={{ display: 'inline-block', padding: '4px 12px', background: `${c.primary}10`, color: c.primary, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 20, borderRadius: 4, textTransform: 'uppercase' }}>Contato</span>
              <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: 300, marginBottom: 28, color: c.text }}>{data.cta.text}</h2>
              {[{ icon: '📱', label: 'WhatsApp', value: data.phone }, { icon: '📍', label: 'Endereço', value: data.city }].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: `${c.primary}08`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon emoji={item.icon} color={c.primary} size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: c.textMuted }}>{item.label}</div>
                    <div style={{ fontSize: 14, color: c.text, fontWeight: 500 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div style={{ padding: 28, background: `${c.primary}04`, border: `1px solid ${c.primary}08`, borderRadius: 18 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: c.text, marginBottom: 20 }}>Envie uma mensagem</h3>
              {['Seu nome', 'WhatsApp'].map(ph => (
                <input key={ph} placeholder={ph} style={{ width: '100%', padding: '12px 14px', background: `${c.primary}05`, border: `1px solid ${c.primary}12`, borderRadius: 8, color: c.text, fontSize: 13, outline: 'none', marginBottom: 12, boxSizing: 'border-box', transition: 'border-color 0.3s' }}
                  onFocus={e => e.currentTarget.style.borderColor = `${c.primary}40`}
                  onBlur={e => e.currentTarget.style.borderColor = `${c.primary}12`}
                />
              ))}
              <textarea placeholder="Mensagem" rows={3} style={{ width: '100%', padding: '12px 14px', background: `${c.primary}05`, border: `1px solid ${c.primary}12`, borderRadius: 8, color: c.text, fontSize: 13, outline: 'none', resize: 'none', marginBottom: 14, boxSizing: 'border-box' }} />
              <button style={{ width: '100%', padding: '14px', background: c.primary, color: c.bg, border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Enviar mensagem</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '24px 32px', textAlign: 'center', borderTop: `1px solid ${c.primary}08` }}>
        <p style={{ color: c.textMuted, fontSize: 11 }}>© 2026 {data.name}. Todos os direitos reservados.</p>
      </footer>

      {/* ── WhatsApp FAB ── */}
      <a href="#contato" style={{
        position: 'fixed', bottom: 68, right: 24, zIndex: 998,
        width: 50, height: 50, borderRadius: '50%', background: '#25d366',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(37,211,102,0.35)', transition: 'transform 0.3s',
        textDecoration: 'none', fontSize: 24, color: '#fff',
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >◯</a>

      {/* ── Banner Stauf ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999,
        padding: '9px 24px', background: 'rgba(10,10,15,0.94)', backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(45,212,191,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#2dd4bf', fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em' }}>STAUF.</span>
          <span style={{ color: '#666', fontSize: 11 }} className="demo-banner-text">Demo visual — Quer um site assim?</span>
        </div>
        <Link to="/" style={{ padding: '6px 16px', background: '#2dd4bf', color: '#0a0a0f', borderRadius: 6, fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>Conheça a Stauf.</Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .demo-nav-links { display: none !important; }
          .demo-hamburger { display: block !important; }
          .demo-grid { grid-template-columns: 1fr !important; }
          .demo-gallery { grid-template-columns: 1fr 1fr !important; }
          .demo-gallery > div { grid-column: span 1 !important; aspect-ratio: 1/1 !important; }
          .demo-banner-text { display: none; }
        }
      `}</style>
    </div>
  );
}
