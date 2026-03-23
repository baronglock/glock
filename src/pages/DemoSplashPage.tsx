import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DemoPage from './DemoPage';

interface Professional {
  name: string;
  role: string;
  slug: string;
  image: string;
}

interface SplashData {
  slug: string;
  name: string;
  tagline: string;
  colors: { primary: string; bg: string; text: string; textMuted: string };
  professionals: Professional[];
  hero: { image: string };
  city?: string;
}

const SERVICES: Record<string, { name: string; price: string; time: string }[]> = {
  'Barbeiro': [
    { name: 'Corte Signature', price: 'R$ 70', time: '40 min' },
    { name: 'Barba Sculpting', price: 'R$ 55', time: '30 min' },
    { name: 'Corte + Barba', price: 'R$ 110', time: '60 min' },
    { name: 'Hot Towel Shave', price: 'R$ 80', time: '40 min' },
    { name: 'Combo Noivo', price: 'R$ 180', time: '90 min' },
  ],
  'Cabeleireira': [
    { name: 'Corte Feminino', price: 'R$ 90', time: '50 min' },
    { name: 'Coloração', price: 'A partir de R$ 150', time: '90 min' },
    { name: 'Mechas & Luzes', price: 'A partir de R$ 200', time: '120 min' },
    { name: 'Escova Progressiva', price: 'R$ 200', time: '120 min' },
    { name: 'Hidratação Profunda', price: 'R$ 120', time: '60 min' },
  ],
};

const TIMES = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'];
const DATES = ['Hoje', 'Amanhã', 'Qua 26', 'Qui 27', 'Sex 28', 'Sáb 29'];

export default function DemoSplashPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<SplashData | null>(null);
  const [err, setErr] = useState('');
  const [hovered, setHovered] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [booking, setBooking] = useState<Professional | null>(null);
  const [selService, setSelService] = useState('');
  const [selDate, setSelDate] = useState('');
  const [selTime, setSelTime] = useState('');
  const [bookingDone, setBookingDone] = useState(false);

  useEffect(() => {
    fetch(`/demos/data/${slug}.json`)
      .then(r => { if (!r.ok) throw new Error('x'); return r.json(); })
      .then(d => {
        if (!d.splash || !d.professionals) {
          setData(null);
          setErr('not-splash');
          return;
        }
        setData(d);
        setTimeout(() => setVisible(true), 100);
      })
      .catch(() => setErr('não encontrado'));
  }, [slug, navigate]);

  // Not a splash page — render normal DemoPage
  if (err === 'not-splash') return <DemoPage />;

  if (err) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 48, fontWeight: 200 }}>404</h1>
        <Link to="/" style={{ color: '#2dd4bf', textDecoration: 'none' }}>← Stauf.</Link>
      </div>
    </div>
  );

  if (!data) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #333', borderTopColor: '#d4a843', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const c = data.colors;
  // Cores do modal de booking — feminino pra Sabrina
  const femColors = { primary: '#c47d8a', bg: '#faf6f4', text: '#2a1f1f', textMuted: '#8a7070' };
  const bk = booking?.role === 'Cabeleireira' ? femColors : { primary: c.primary, bg: c.bg, text: c.text, textMuted: c.textMuted };

  return (
    <div style={{ minHeight: '100vh', background: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif", position: 'relative', overflow: 'hidden' }}>
      {/* Background image */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <img src={data.hero.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(3px)', transform: 'scale(1.05)' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${c.bg}e0 0%, ${c.bg}cc 40%, ${c.bg}e8 100%)` }} />
      </div>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2, minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Logo text */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            fontSize: 'clamp(72px, 16vw, 140px)', fontFamily: "'Georgia', 'Times New Roman', serif",
            fontWeight: 400, fontStyle: 'italic', color: c.primary, lineHeight: 0.9,
            letterSpacing: '-0.04em', textShadow: `0 4px 32px ${c.primary}30`,
          }}>RS</div>
          <div style={{ width: 'clamp(120px, 24vw, 220px)', height: 1, background: `${c.primary}50`, margin: '16px auto' }} />
          <div style={{
            fontSize: 'clamp(11px, 1.6vw, 15px)', fontWeight: 400, color: c.primary,
            letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.8,
          }}>{data.tagline}</div>
        </div>

        {/* Select professional */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 300, color: c.text, marginBottom: 8 }}>
            Escolha seu profissional
          </h2>
          <p style={{ fontSize: 14, color: c.textMuted }}>Selecione quem vai te atender</p>
        </div>

        {/* Professional cards */}
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 700 }}>
          {data.professionals.map((pro, i) => (
            <div key={pro.slug} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
              onClick={() => { setBooking(pro); setSelService(''); setSelDate(''); setSelTime(''); setBookingDone(false); }}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <div style={{
                width: 'clamp(240px, 35vw, 300px)',
                borderRadius: 20, overflow: 'hidden',
                background: hovered === i ? `${c.primary}12` : `${c.primary}06`,
                border: `1px solid ${hovered === i ? `${c.primary}40` : `${c.primary}12`}`,
                transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
                transform: hovered === i ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                boxShadow: hovered === i ? `0 24px 48px rgba(0,0,0,0.3), 0 0 40px ${c.primary}15` : '0 4px 16px rgba(0,0,0,0.2)',
                cursor: 'pointer',
              }}>
                {/* Photo */}
                <div style={{ height: 'clamp(200px, 30vw, 320px)', overflow: 'hidden', position: 'relative' }}>
                  <img src={pro.image} alt={pro.name} style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    transition: 'transform 0.6s',
                    transform: hovered === i ? 'scale(1.08)' : 'scale(1)',
                  }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
                  {/* Availability dot */}
                  <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', borderRadius: 20 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
                    <span style={{ fontSize: 11, color: '#fff', fontWeight: 500 }}>Disponível</span>
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: c.text, marginBottom: 4 }}>{pro.name}</h3>
                  <p style={{ fontSize: 14, color: c.primary, fontWeight: 500, marginBottom: 16 }}>{pro.role}</p>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <div style={{
                      padding: '12px 20px', background: c.primary, color: c.bg,
                      border: 'none', borderRadius: 10,
                      fontSize: 13, fontWeight: 700, transition: 'all 0.3s',
                      cursor: 'pointer',
                    }}>
                      Agendar
                    </div>
                    <Link to={`/demo/${pro.slug}`}
                      onClick={e => e.stopPropagation()}
                      style={{
                        padding: '12px 20px', background: `${c.primary}10`, color: c.primary,
                        border: `1px solid ${c.primary}25`, borderRadius: 10,
                        fontSize: 13, fontWeight: 600, transition: 'all 0.3s',
                        textDecoration: 'none', display: 'inline-block',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${c.primary}20`; }}
                      onMouseLeave={e => { e.currentTarget.style.background = `${c.primary}10`; }}>
                      Ver site
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom info */}
        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: c.textMuted, marginBottom: 8 }}>{data.city}</p>
          <p style={{ fontSize: 12, color: `${c.textMuted}80` }}>Agendamento online • Sem fila • Escolha seu horário</p>
        </div>
      </div>

      {/* ══ BOOKING MODAL ══ */}
      {booking && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => !bookingDone && setBooking(null)}>
          <div style={{ background: bk.bg, border: `1px solid ${bk.primary}20`, borderRadius: 20, padding: 'clamp(20px, 4vw, 32px)', maxWidth: 480, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>

            {bookingDone ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 16, color: bk.primary }}>✓</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: bk.text, marginBottom: 8 }}>Agendamento confirmado!</h3>
                <p style={{ color: bk.textMuted, fontSize: 14, marginBottom: 8 }}>{selService} com {booking.name}</p>
                <p style={{ color: bk.textMuted, fontSize: 13 }}>{selDate} às {selTime}</p>
                <p style={{ color: bk.textMuted, fontSize: 12, marginTop: 16, opacity: 0.6 }}>Você receberá a confirmação por WhatsApp</p>
                <button onClick={() => { setBooking(null); setBookingDone(false); }} style={{ marginTop: 24, padding: '12px 28px', background: `${bk.primary}15`, color: bk.primary, border: `1px solid ${bk.primary}25`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Fechar</button>
              </div>
            ) : (<>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: bk.text, marginBottom: 2 }}>Agendar com {booking.name}</h3>
                  <p style={{ fontSize: 13, color: bk.primary }}>{booking.role}</p>
                </div>
                <button onClick={() => setBooking(null)} style={{ background: 'none', border: 'none', color: bk.textMuted, fontSize: 22, cursor: 'pointer' }}>✕</button>
              </div>

              {/* Step 1: Serviço */}
              <p style={{ fontSize: 11, fontWeight: 700, color: bk.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>1. Escolha o serviço</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {(SERVICES[booking.role] || []).map(svc => (
                  <button key={svc.name} onClick={() => setSelService(svc.name)} style={{
                    padding: '14px 16px', textAlign: 'left',
                    background: selService === svc.name ? `${bk.primary}18` : `${bk.primary}06`,
                    border: `1px solid ${selService === svc.name ? bk.primary : `${bk.primary}12`}`,
                    borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{svc.name}</div>
                      <div style={{ fontSize: 12, color: bk.textMuted, marginTop: 2 }}>{svc.time}</div>
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 700, color: bk.primary }}>{svc.price}</span>
                  </button>
                ))}
              </div>

              {/* Step 2: Data */}
              {selService && (<>
                <p style={{ fontSize: 11, fontWeight: 700, color: bk.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>2. Escolha a data</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                  {DATES.map(d => (
                    <button key={d} onClick={() => setSelDate(d)} style={{
                      padding: '10px 18px', fontSize: 13,
                      background: selDate === d ? `${bk.primary}20` : `${bk.primary}06`,
                      border: `1px solid ${selDate === d ? bk.primary : `${bk.primary}12`}`,
                      borderRadius: 8, cursor: 'pointer', color: selDate === d ? bk.primary : bk.textMuted,
                      fontWeight: selDate === d ? 700 : 500, transition: 'all 0.2s',
                    }}>{d}</button>
                  ))}
                </div>
              </>)}

              {/* Step 3: Horário */}
              {selDate && (<>
                <p style={{ fontSize: 11, fontWeight: 700, color: bk.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>3. Escolha o horário</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 24 }}>
                  {TIMES.map(t => (
                    <button key={t} onClick={() => setSelTime(t)} style={{
                      padding: '10px', fontSize: 13,
                      background: selTime === t ? bk.primary : `${bk.primary}06`,
                      color: selTime === t ? bk.bg : bk.textMuted,
                      border: `1px solid ${selTime === t ? bk.primary : `${bk.primary}12`}`,
                      borderRadius: 8, cursor: 'pointer', fontWeight: selTime === t ? 700 : 500,
                      transition: 'all 0.2s',
                    }}>{t}</button>
                  ))}
                </div>
              </>)}

              {/* Step 4: Dados pessoais */}
              {selTime && (<>
                <p style={{ fontSize: 11, fontWeight: 700, color: bk.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>4. Seus dados</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  <input placeholder="Seu nome" style={{ padding: '12px 14px', background: `${bk.primary}06`, border: `1px solid ${bk.primary}12`, borderRadius: 8, color: bk.text, fontSize: 14, outline: 'none' }} />
                  <input placeholder="WhatsApp" style={{ padding: '12px 14px', background: `${bk.primary}06`, border: `1px solid ${bk.primary}12`, borderRadius: 8, color: bk.text, fontSize: 14, outline: 'none' }} />
                </div>
              </>)}

              {/* Confirmar */}
              <button onClick={() => setBookingDone(true)} disabled={!selService || !selDate || !selTime}
                style={{
                  width: '100%', padding: '16px', fontSize: 15, fontWeight: 700, cursor: selService && selDate && selTime ? 'pointer' : 'not-allowed',
                  background: selService && selDate && selTime ? bk.primary : `${bk.primary}20`,
                  color: selService && selDate && selTime ? bk.bg : bk.textMuted,
                  border: 'none', borderRadius: 12, transition: 'all 0.3s',
                  boxShadow: selService && selDate && selTime ? `0 4px 16px ${bk.primary}30` : 'none',
                }}>
                {selService && selDate && selTime ? 'Confirmar agendamento' : 'Selecione serviço, data e horário'}
              </button>
            </>)}
          </div>
        </div>
      )}

      {/* Stauf banner */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999,
        padding: '9px 24px', background: 'rgba(10,10,15,0.94)', backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(45,212,191,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#2dd4bf', fontSize: 13, fontWeight: 700 }}>STAUF.</span>
          <span style={{ color: '#666', fontSize: 11 }}>Demo visual</span>
        </div>
        <Link to="/" style={{ padding: '6px 16px', background: '#2dd4bf', color: '#0a0a0f', borderRadius: 6, fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>Conheça a Stauf.</Link>
      </div>
    </div>
  );
}
