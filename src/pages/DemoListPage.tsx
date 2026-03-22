import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface DemoEntry {
  slug: string;
  name: string;
  niche: string;
  tagline: string;
  colors: { primary: string; bg: string };
  hero: { image: string };
}

const DEMO_SLUGS = ['barber-king', 'iron-gym'];

export default function DemoListPage() {
  const [demos, setDemos] = useState<DemoEntry[]>([]);

  useEffect(() => {
    Promise.all(
      DEMO_SLUGS.map(slug =>
        fetch(`/demos/data/${slug}.json`)
          .then(r => r.ok ? r.json() : null)
          .catch(() => null)
      )
    ).then(results => setDemos(results.filter(Boolean)));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#f5f5f5', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <nav style={{ padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(45,212,191,0.1)' }}>
        <Link to="/" style={{ color: '#2dd4bf', fontSize: 22, fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.02em' }}>STAUF.</Link>
        <span style={{ color: '#666', fontSize: 13 }}>Demos</span>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ display: 'inline-block', padding: '5px 14px', background: 'rgba(45,212,191,0.1)', color: '#2dd4bf', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', borderRadius: 20, textTransform: 'uppercase', border: '1px solid rgba(45,212,191,0.15)', marginBottom: 16 }}>Portfolio</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, marginBottom: 16 }}>Demos de sites</h1>
          <p style={{ color: '#888', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>Sites demonstrativos criados pela Stauf. para diferentes nichos e negócios.</p>
        </div>

        {demos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #333', borderTopColor: '#2dd4bf', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: '#888' }}>Carregando demos...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
            {demos.map(demo => (
              <Link key={demo.slug} to={`/demo/${demo.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  borderRadius: 18, overflow: 'hidden',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = `${demo.colors.primary}40`; e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3), 0 0 30px ${demo.colors.primary}10`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {/* Preview image */}
                  <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                    <img src={demo.hero.image} alt={demo.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.8), transparent 60%)' }} />
                    <span style={{ position: 'absolute', top: 14, right: 14, padding: '4px 12px', background: `${demo.colors.primary}20`, backdropFilter: 'blur(8px)', color: demo.colors.primary, fontSize: 11, fontWeight: 600, borderRadius: 6, border: `1px solid ${demo.colors.primary}30` }}>{demo.niche}</span>
                  </div>

                  {/* Content */}
                  <div style={{ padding: 24 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: demo.colors.primary }}>{demo.name}</h2>
                    <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>{demo.tagline}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: '#2dd4bf', fontWeight: 600 }}>Ver demo →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ color: '#555', fontSize: 12 }}>Demos criadas por <Link to="/" style={{ color: '#2dd4bf', textDecoration: 'none', fontWeight: 600 }}>Stauf.</Link></p>
      </div>

      <style>{`@media(max-width:480px){h1{font-size:1.8rem!important}}`}</style>
    </div>
  );
}
