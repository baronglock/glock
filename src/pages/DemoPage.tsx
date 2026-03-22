import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

interface DemoData {
  slug: string;
  name: string;
  niche: string;
  tagline: string;
  city: string;
  phone: string;
  colors: { primary: string; secondary: string; bg: string; text: string; textMuted: string };
  hero: { title: string; subtitle: string; image: string };
  about: { text: string; image: string };
  services: { name: string; desc: string; icon: string }[];
  gallery: string[];
  reviews: { name: string; text: string; stars: number }[];
  features: { label: string; value: string }[];
  cta: { text: string; buttonText: string };
}

function RevealOnScroll({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: `all 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

export default function DemoPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<DemoData | null>(null);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

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
  const navItems = ['Sobre', 'Serviços', 'Galeria', 'Avaliações', 'Contato'];

  return (
    <div style={{ background: c.bg, color: c.text, fontFamily: f, minHeight: '100vh', paddingBottom: 56 }}>

      {/* ── Navbar ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `${c.bg}e8`, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${c.primary}12` }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: c.primary, letterSpacing: '-0.02em' }}>{data.name}</span>
        <div style={{ display: 'flex', gap: 28, fontSize: 13, fontWeight: 500 }} className="demo-nav-links">
          {navItems.map(item => (
            <a key={item} href={`#${item.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`} style={{ color: c.textMuted, textDecoration: 'none', transition: 'color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.color = c.primary}
              onMouseLeave={e => e.currentTarget.style.color = c.textMuted}
            >{item}</a>
          ))}
        </div>
        {/* Hamburger mobile */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="demo-hamburger" style={{ display: 'none', background: 'none', border: 'none', color: c.text, fontSize: 24, cursor: 'pointer' }}>☰</button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: 56, left: 0, right: 0, zIndex: 99, background: `${c.bg}f5`, backdropFilter: 'blur(16px)', padding: 24, display: 'flex', flexDirection: 'column', gap: 20, borderBottom: `1px solid ${c.primary}20` }}>
          {navItems.map(item => (
            <a key={item} href={`#${item.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}
              onClick={() => setMenuOpen(false)}
              style={{ color: c.textMuted, textDecoration: 'none', fontSize: 16, fontWeight: 500 }}
            >{item}</a>
          ))}
        </div>
      )}

      {/* ── Hero — MARCANTE ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={data.hero.image} alt="" loading="eager" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.05)' }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${c.bg} 0%, ${c.bg}d0 35%, ${c.bg}60 65%, ${c.bg}30 100%)` }} />
          {/* Accent glow */}
          <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60%', height: '60%', background: `radial-gradient(circle, ${c.primary}15 0%, transparent 70%)`, pointerEvents: 'none' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 800, padding: '140px 32px 120px', marginLeft: '8%' }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', background: `${c.primary}18`, border: `1px solid ${c.primary}30`, borderRadius: 6, marginBottom: 28 }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', color: c.primary, textTransform: 'uppercase' }}>{data.tagline}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 800, lineHeight: 1.0, marginBottom: 28, color: c.text, letterSpacing: '-0.03em' }}>
            {data.hero.title.split(' ').map((word, i) =>
              i === 0 ? <span key={i} style={{ color: c.primary }}>{word} </span> : word + ' '
            )}
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: c.textMuted, lineHeight: 1.8, marginBottom: 44, maxWidth: 550 }}>{data.hero.subtitle}</p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button style={{ padding: '16px 36px', background: c.primary, color: c.bg, border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.3s', boxShadow: `0 8px 32px ${c.primary}40` }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >{data.cta.buttonText}</button>
            <button style={{ padding: '16px 36px', background: `${c.primary}10`, color: c.primary, border: `1px solid ${c.primary}30`, borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = `${c.primary}20`; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${c.primary}10`; }}
            >Saiba mais ↓</button>
          </div>
        </div>
      </section>

      {/* ── Features strip ── */}
      <RevealOnScroll>
        <section style={{ padding: '52px 32px', background: `${c.primary}06`, borderTop: `1px solid ${c.primary}10`, borderBottom: `1px solid ${c.primary}10` }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 32 }}>
            {data.features.map((ft, i) => (
              <div key={i} style={{ textAlign: 'center', minWidth: 120 }}>
                <div style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: c.primary }}>{ft.value}</div>
                <div style={{ fontSize: 12, color: c.textMuted, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>{ft.label}</div>
              </div>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      {/* ── About ── */}
      <section id="sobre" style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="demo-grid">
          <RevealOnScroll>
            <div>
              <span style={{ display: 'inline-block', padding: '4px 14px', background: `${c.primary}12`, color: c.primary, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 20, borderRadius: 4, textTransform: 'uppercase' }}>Sobre nós</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, marginBottom: 24, color: c.text }}>Conheça a {data.name}</h2>
              <p style={{ color: c.textMuted, fontSize: 16, lineHeight: 1.9 }}>{data.about.text}</p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={200}>
            <div style={{ borderRadius: 20, overflow: 'hidden', aspectRatio: '4/3', boxShadow: `0 24px 48px ${c.primary}10` }}>
              <img src={data.about.image} alt={data.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="servicos" style={{ padding: '100px 32px', background: `${c.primary}04` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealOnScroll>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span style={{ display: 'inline-block', padding: '4px 14px', background: `${c.primary}12`, color: c.primary, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 16, borderRadius: 4, textTransform: 'uppercase' }}>Serviços</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, color: c.text }}>O que oferecemos</h2>
            </div>
          </RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {data.services.map((s, i) => (
              <RevealOnScroll key={i} delay={i * 100}>
                <div style={{ padding: 28, background: `${c.bg}`, border: `1px solid ${c.primary}10`, borderRadius: 16, transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.primary}35`; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 16px 40px ${c.primary}12`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${c.primary}10`; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${c.primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 18 }}>{s.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: c.text, marginBottom: 10 }}>{s.name}</h3>
                  <p style={{ fontSize: 14, color: c.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery — Layout variado ── */}
      <section id="galeria" style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealOnScroll>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span style={{ display: 'inline-block', padding: '4px 14px', background: `${c.primary}12`, color: c.primary, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 16, borderRadius: 4, textTransform: 'uppercase' }}>Galeria</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, color: c.text }}>Nosso espaço</h2>
            </div>
          </RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto', gap: 12 }} className="demo-gallery">
            {data.gallery.map((img, i) => (
              <RevealOnScroll key={i} delay={i * 80}>
                <div style={{ borderRadius: 14, overflow: 'hidden', gridColumn: i === 0 ? 'span 2' : i === 3 ? 'span 2' : 'span 1', aspectRatio: (i === 0 || i === 3) ? '2/1' : '1/1' }}>
                  <img src={img} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews — com avatares ── */}
      <section id="avaliacoes" style={{ padding: '100px 32px', background: `${c.primary}04` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealOnScroll>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span style={{ display: 'inline-block', padding: '4px 14px', background: `${c.primary}12`, color: c.primary, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 16, borderRadius: 4, textTransform: 'uppercase' }}>Avaliações</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, color: c.text }}>O que dizem sobre nós</h2>
            </div>
          </RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {data.reviews.map((r, i) => (
              <RevealOnScroll key={i} delay={i * 120}>
                <div style={{ padding: 28, background: c.bg, border: `1px solid ${c.primary}10`, borderRadius: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${c.primary}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: c.primary }}>
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: c.text, marginBottom: 2 }}>{r.name}</p>
                      <span style={{ fontSize: 14 }}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: c.textMuted, lineHeight: 1.8, fontStyle: 'italic' }}>"{r.text}"</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contato" style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }} className="demo-grid">
          <RevealOnScroll>
            <div>
              <span style={{ display: 'inline-block', padding: '4px 14px', background: `${c.primary}12`, color: c.primary, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 20, borderRadius: 4, textTransform: 'uppercase' }}>Contato</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, marginBottom: 32, color: c.text }}>{data.cta.text}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { icon: '📱', label: 'WhatsApp', value: data.phone },
                  { icon: '📍', label: 'Endereço', value: data.city },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${c.primary}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: 12, color: c.textMuted, marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontSize: 15, color: c.text, fontWeight: 500 }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={150}>
            <div style={{ padding: 32, background: `${c.primary}05`, border: `1px solid ${c.primary}10`, borderRadius: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: c.text, marginBottom: 24 }}>Envie uma mensagem</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {['Seu nome', 'WhatsApp'].map(ph => (
                  <input key={ph} placeholder={ph} style={{ padding: '13px 16px', background: `${c.primary}06`, border: `1px solid ${c.primary}15`, borderRadius: 10, color: c.text, fontSize: 14, outline: 'none', transition: 'border-color 0.3s' }}
                    onFocus={e => e.currentTarget.style.borderColor = `${c.primary}50`}
                    onBlur={e => e.currentTarget.style.borderColor = `${c.primary}15`}
                  />
                ))}
                <textarea placeholder="Mensagem" rows={4} style={{ padding: '13px 16px', background: `${c.primary}06`, border: `1px solid ${c.primary}15`, borderRadius: 10, color: c.text, fontSize: 14, outline: 'none', resize: 'none', transition: 'border-color 0.3s' }}
                  onFocus={e => e.currentTarget.style.borderColor = `${c.primary}50`}
                  onBlur={e => e.currentTarget.style.borderColor = `${c.primary}15`}
                />
                <button style={{ padding: '15px 32px', background: c.primary, color: c.bg, border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >Enviar mensagem</button>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '28px 32px', textAlign: 'center', borderTop: `1px solid ${c.primary}10` }}>
        <p style={{ color: c.textMuted, fontSize: 12 }}>© 2026 {data.name}. Todos os direitos reservados.</p>
      </footer>

      {/* ── WhatsApp Flutuante ── */}
      <a href="#contato" style={{
        position: 'fixed', bottom: 72, right: 24, zIndex: 998,
        width: 52, height: 52, borderRadius: '50%', background: '#25d366',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(37,211,102,0.4)', transition: 'transform 0.3s',
        textDecoration: 'none', fontSize: 26,
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >💬</a>

      {/* ── Banner Stauf (FIXO) ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999,
        padding: '10px 24px',
        background: 'rgba(10,10,15,0.94)', backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(45,212,191,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#2dd4bf', fontSize: 14, fontWeight: 700 }}>STAUF.</span>
          <span style={{ color: '#777', fontSize: 12 }} className="demo-banner-text">Demo visual — Quer um site assim?</span>
        </div>
        <Link to="/" style={{
          padding: '7px 18px', background: '#2dd4bf', color: '#0a0a0f',
          borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none',
        }}>Conheça a Stauf.</Link>
      </div>

      {/* ── Responsive ── */}
      <style>{`
        @media (max-width: 768px) {
          .demo-nav-links { display: none !important; }
          .demo-hamburger { display: block !important; }
          .demo-grid { grid-template-columns: 1fr !important; }
          .demo-gallery { grid-template-columns: 1fr 1fr !important; }
          .demo-gallery > div > div { grid-column: span 1 !important; aspect-ratio: 1/1 !important; }
          .demo-banner-text { display: none; }
        }
      `}</style>
    </div>
  );
}
