import { useEffect, useState, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProRenderer = lazy(() => import('./demo-sections/ProRenderer'));

interface DemoData {
  slug: string; name: string; niche: string; tagline: string; city: string; phone: string;
  colors: { primary: string; secondary: string; bg: string; text: string; textMuted: string };
  hero: { title: string; subtitle: string; image: string };
  about: { text: string; image: string };
  services: any[]; gallery: string[]; reviews: any[]; features: any[];
  cta: { text: string; buttonText: string };
  faq?: any[]; staff?: any[]; plans?: any[]; products?: any[];
  [key: string]: any;
}

export default function DemoPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<DemoData | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetch(`/demos/data/${slug}.json`)
      .then(r => { if (!r.ok) throw new Error('x'); return r.json(); })
      .then(setData).catch(() => setErr('Demo não encontrada'));
  }, [slug]);

  if (err) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: '#fff', fontFamily: "'Inter',sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 48, fontWeight: 200, marginBottom: 16 }}>404</h1>
        <p style={{ color: '#888', marginBottom: 32 }}>{err}</p>
        <Link to="/" style={{ color: '#2dd4bf', textDecoration: 'none' }}>← Stauf.</Link>
      </div>
    </div>
  );

  if (!data) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #333', borderTopColor: '#2dd4bf', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return <Suspense fallback={<div style={{ minHeight: '100vh', background: data.colors?.bg || '#0a0a0f' }} />}><ProRenderer data={data} /></Suspense>;
}
