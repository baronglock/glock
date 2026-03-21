import { useEffect, useState } from 'react';
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

export default function DemoPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<DemoData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/demos/data/${slug}.json`)
      .then(r => { if (!r.ok) throw new Error('Demo não encontrada'); return r.json(); })
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: '#fff' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #333', borderTopColor: '#2dd4bf', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#888' }}>Carregando demo...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  const c = data.colors;
  const font = "'Inter', system-ui, sans-serif";

  return (
    <div style={{ background: c.bg, color: c.text, fontFamily: font, minHeight: '100vh' }}>

      {/* ── Navbar ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `${c.bg}ee`, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${c.primary}15` }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: c.primary }}>{data.name}</span>
        <div style={{ display: 'flex', gap: 24, fontSize: 14 }}>
          {['Início', 'Sobre', 'Serviços', 'Galeria', 'Avaliações', 'Contato'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: c.textMuted, textDecoration: 'none', transition: 'color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.color = c.primary}
              onMouseLeave={e => e.currentTarget.style.color = c.textMuted}
            >{item}</a>
          ))}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section id="início" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={data.hero.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${c.bg}f0 0%, ${c.bg}99 50%, transparent 100%)` }} />
        </div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 700, margin: '0 auto', padding: '120px 32px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 200, lineHeight: 1.1, marginBottom: 24, color: c.text }}>
            {data.hero.title}
          </h1>
          <p style={{ fontSize: 18, color: c.textMuted, lineHeight: 1.7, marginBottom: 40 }}>{data.hero.subtitle}</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{ padding: '14px 32px', background: c.primary, color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>{data.cta.buttonText}</button>
            <button style={{ padding: '14px 32px', background: 'transparent', color: c.primary, border: `1px solid ${c.primary}`, borderRadius: 12, fontSize: 15, cursor: 'pointer' }}>Ver mais</button>
          </div>
        </div>
      </section>

      {/* ── Features strip ── */}
      {data.features.length > 0 && (
        <section style={{ padding: '48px 32px', background: `${c.primary}08`, borderTop: `1px solid ${c.primary}15`, borderBottom: `1px solid ${c.primary}15` }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24 }}>
            {data.features.map((f, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: c.primary }}>{f.value}</div>
                <div style={{ fontSize: 13, color: c.textMuted, marginTop: 4 }}>{f.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── About ── */}
      <section id="sobre" style={{ padding: '96px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <span style={{ display: 'inline-block', padding: '4px 14px', background: `${c.primary}15`, color: c.primary, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16, borderRadius: 4 }}>SOBRE NÓS</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, marginBottom: 24, color: c.text }}>Conheça a {data.name}</h2>
            <p style={{ color: c.textMuted, fontSize: 16, lineHeight: 1.8 }}>{data.about.text}</p>
          </div>
          <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3' }}>
            <img src={data.about.image} alt={`Sobre ${data.name}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="serviços" style={{ padding: '96px 32px', background: `${c.primary}05` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ display: 'inline-block', padding: '4px 14px', background: `${c.primary}15`, color: c.primary, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16, borderRadius: 4 }}>SERVIÇOS</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, color: c.text }}>O que oferecemos</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {data.services.map((s, i) => (
              <div key={i} style={{ padding: 32, background: `${c.bg}`, border: `1px solid ${c.primary}15`, borderRadius: 16, transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.primary}40`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${c.primary}15`; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>{s.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: c.text, marginBottom: 12 }}>{s.name}</h3>
                <p style={{ fontSize: 14, color: c.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section id="galeria" style={{ padding: '96px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ display: 'inline-block', padding: '4px 14px', background: `${c.primary}15`, color: c.primary, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16, borderRadius: 4 }}>GALERIA</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, color: c.text }}>Nosso espaço</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
            {data.gallery.map((img, i) => (
              <div key={i} style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: i === 0 ? '16/10' : '4/3' }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section id="avaliações" style={{ padding: '96px 32px', background: `${c.primary}05` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ display: 'inline-block', padding: '4px 14px', background: `${c.primary}15`, color: c.primary, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16, borderRadius: 4 }}>AVALIAÇÕES</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, color: c.text }}>O que dizem sobre nós</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {data.reviews.map((r, i) => (
              <div key={i} style={{ padding: 32, background: c.bg, border: `1px solid ${c.primary}15`, borderRadius: 16 }}>
                <div style={{ marginBottom: 16, fontSize: 18 }}>{'⭐'.repeat(r.stars)}</div>
                <p style={{ fontSize: 14, color: c.textMuted, lineHeight: 1.7, fontStyle: 'italic', marginBottom: 16 }}>"{r.text}"</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '96px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, marginBottom: 16, color: c.text }}>{data.cta.text}</h2>
          <p style={{ color: c.textMuted, marginBottom: 32, fontSize: 16 }}>Entre em contato e agende seu horário.</p>
          <button style={{ padding: '16px 40px', background: c.primary, color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>{data.cta.buttonText}</button>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contato" style={{ padding: '96px 32px', background: `${c.primary}05` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
          <div>
            <span style={{ display: 'inline-block', padding: '4px 14px', background: `${c.primary}15`, color: c.primary, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16, borderRadius: 4 }}>CONTATO</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, marginBottom: 24, color: c.text }}>Fale conosco</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>📱</span>
                <span style={{ color: c.textMuted }}>{data.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>📍</span>
                <span style={{ color: c.textMuted }}>{data.city}</span>
              </div>
            </div>
          </div>
          <div style={{ padding: 32, background: c.bg, border: `1px solid ${c.primary}15`, borderRadius: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input placeholder="Seu nome" style={{ padding: '12px 16px', background: `${c.primary}08`, border: `1px solid ${c.primary}20`, borderRadius: 8, color: c.text, fontSize: 14, outline: 'none' }} />
              <input placeholder="WhatsApp" style={{ padding: '12px 16px', background: `${c.primary}08`, border: `1px solid ${c.primary}20`, borderRadius: 8, color: c.text, fontSize: 14, outline: 'none' }} />
              <textarea placeholder="Mensagem" rows={4} style={{ padding: '12px 16px', background: `${c.primary}08`, border: `1px solid ${c.primary}20`, borderRadius: 8, color: c.text, fontSize: 14, outline: 'none', resize: 'none' }} />
              <button style={{ padding: '14px 32px', background: c.primary, color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Enviar mensagem</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '32px', textAlign: 'center', borderTop: `1px solid ${c.primary}15` }}>
        <p style={{ color: c.textMuted, fontSize: 13 }}>© 2026 {data.name}. Todos os direitos reservados.</p>
      </footer>

      {/* ── Stauf Demo Banner (FIXO) ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999,
        padding: '12px 24px',
        background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(45,212,191,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: font,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#2dd4bf', fontSize: 13, fontWeight: 600 }}>STAUF.</span>
          <span style={{ color: '#999', fontSize: 13 }}>Demo criada por Stauf. — Quer um site assim pro seu negócio?</span>
        </div>
        <Link to="/" style={{
          padding: '8px 20px', background: '#2dd4bf', color: '#0a0a0f',
          borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none',
          transition: 'opacity 0.3s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Conheça a Stauf.
        </Link>
      </div>

      {/* ── Responsive ── */}
      <style>{`
        @media (max-width: 768px) {
          nav > div:last-child { display: none !important; }
          section > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
