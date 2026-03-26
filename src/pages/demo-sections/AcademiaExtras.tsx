import { useState, useEffect, useRef } from 'react';

/* ── Types ── */
interface AcademiaExtrasProps {
  colors: { primary: string; secondary: string; bg: string; text: string; textMuted: string };
  name: string;
  cardRadius: number;
}

/* ── Animated Counter ── */
function AnimatedCounter({ value, label, suffix, primary, textMuted }: {
  value: number; label: string; suffix?: string; primary: string; textMuted: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) { setStarted(true); o.disconnect(); }
    }, { threshold: 0.3 });
    o.observe(el);
    return () => o.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, value]);

  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '24px 16px' }}>
      <div style={{
        fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, color: primary,
        lineHeight: 1, letterSpacing: '-0.03em',
        textShadow: `0 0 40px ${primary}40`,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        {count.toLocaleString('pt-BR')}{suffix || ''}
      </div>
      <div style={{ fontSize: 11, color: textMuted, marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
        {label}
      </div>
    </div>
  );
}

/* ── Workout Class Card ── */
function ClassCard({ name, time, intensity, icon, primary, cardRadius }: {
  name: string; time: string; intensity: number; icon: string; primary: string; cardRadius: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: 22,
        background: hovered ? `linear-gradient(145deg, rgba(30,30,30,0.95), rgba(15,15,15,0.98))` : `linear-gradient(145deg, rgba(30,30,30,0.9), rgba(15,15,15,0.95))`,
        border: `1px solid ${hovered ? `${primary}40` : `${primary}15`}`,
        borderTop: `2px solid ${hovered ? primary : `${primary}30`}`,
        borderRadius: cardRadius,
        transition: 'all 0.3s',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? `0 0 30px ${primary}20, inset 0 0 20px ${primary}05` : 'none',
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <span style={{ fontSize: 28, lineHeight: 1, color: primary }}>{icon}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: primary, padding: '3px 10px', background: `${primary}15`, borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{time}</span>
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#e8e8e8', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{name}</h3>
      {/* Intensity bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, color: '#777', fontWeight: 600, textTransform: 'uppercase' }}>Intensidade</span>
        <div style={{ flex: 1, height: 4, background: `${primary}15`, borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${intensity}%`,
            background: `linear-gradient(90deg, ${primary}80, ${primary})`,
            borderRadius: 2, transition: 'width 1s ease',
            boxShadow: `0 0 8px ${primary}40`,
          }} />
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function AcademiaExtras({ colors: c, name: _name, cardRadius }: AcademiaExtrasProps) {
  const stats = [
    { value: 800, label: 'm² de área', suffix: '' },
    { value: 1250, label: 'Alunos ativos', suffix: '+' },
    { value: 45000, label: 'kg levantados/dia', suffix: '' },
    { value: 6, label: 'Anos de ferro', suffix: '' },
  ];

  const classes = [
    { name: 'Musculação Pesada', time: 'Livre', intensity: 95, icon: '△' },
    { name: 'HIIT Inferno', time: '45 min', intensity: 100, icon: '◈' },
    { name: 'Boxe', time: '60 min', intensity: 85, icon: '◉' },
    { name: 'Funcional', time: '50 min', intensity: 80, icon: '◇' },
    { name: 'Spinning', time: '45 min', intensity: 90, icon: '◎' },
    { name: 'Yoga Recovery', time: '60 min', intensity: 30, icon: '❦' },
  ];

  const wallOfFame = [
    { name: 'Carlos M.', achievement: '-22kg em 6 meses', quote: 'Esse lugar mudou minha vida.' },
    { name: 'Juliana R.', achievement: 'Primeiro pull-up', quote: 'Nunca achei que conseguiria.' },
    { name: 'André S.', achievement: 'Supino 140kg', quote: 'Só aqui tem estrutura pra isso.' },
  ];

  return (
    <>
      {/* ══ ANIMATED STATS COUNTER ══ */}
      <section style={{ padding: '80px 32px', background: `${c.primary}05`, borderTop: `1px solid ${c.primary}08`, borderBottom: `1px solid ${c.primary}08` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="demo-grid">
            {stats.map(s => (
              <AnimatedCounter key={s.label} value={s.value} label={s.label} suffix={s.suffix} primary={c.primary} text={c.text} textMuted={c.textMuted} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ CLASSES / MODALIDADES ══ */}
      <section style={{ padding: '96px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'left', marginBottom: 16 }}>
            <span style={{ display: 'inline-block', padding: '5px 14px', background: `${c.primary}10`, color: c.primary, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', borderRadius: 20, textTransform: 'uppercase', border: `1px solid ${c.primary}15` }}>Modalidades</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.7rem,4vw,2.4rem)', fontWeight: 800, color: c.text, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
            Escolha sua guerra
          </h2>
          <div style={{ width: 60, height: 4, background: c.primary, borderRadius: 2, marginBottom: 48, boxShadow: `0 0 12px ${c.primary}60` }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {classes.map(cl => (
              <ClassCard key={cl.name} {...cl} primary={c.primary} bg={c.bg} cardRadius={cardRadius} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ WALL OF FAME ══ */}
      <section style={{ padding: '96px 32px', background: `${c.primary}03` }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span style={{ display: 'inline-block', padding: '5px 14px', background: `${c.primary}10`, color: c.primary, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', borderRadius: 20, textTransform: 'uppercase', border: `1px solid ${c.primary}15` }}>Hall da Fama</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.7rem,4vw,2.4rem)', fontWeight: 800, color: c.text, letterSpacing: '0.04em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 8 }}>
            Resultados reais
          </h2>
          <div style={{ width: 60, height: 4, background: c.primary, borderRadius: 2, margin: '0 auto 48px', boxShadow: `0 0 12px ${c.primary}60` }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 18 }}>
            {wallOfFame.map((w, i) => (
              <div key={i} style={{
                padding: 28,
                background: `linear-gradient(145deg, rgba(30,30,30,0.9), rgba(15,15,15,0.95))`,
                border: `1px solid ${c.primary}15`, borderTop: `3px solid ${c.primary}`,
                borderRadius: cardRadius, textAlign: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Neon glow top */}
                <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: c.primary, boxShadow: `0 0 20px ${c.primary}60, 0 0 40px ${c.primary}30`, }} />
                {/* Avatar */}
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px',
                  background: `linear-gradient(135deg, ${c.primary}, ${c.primary}60)`, padding: 2,
                }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: c.primary }}>
                    {w.name.charAt(0)}
                  </div>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: c.text, marginBottom: 4, textTransform: 'uppercase' }}>{w.name}</h3>
                <div style={{ display: 'inline-block', padding: '4px 14px', background: `${c.primary}18`, borderRadius: 20, fontSize: 12, fontWeight: 700, color: c.primary, marginBottom: 14, border: `1px solid ${c.primary}25` }}>
                  {w.achievement}
                </div>
                <p style={{ fontSize: 14, color: c.textMuted, fontStyle: 'italic', lineHeight: 1.7 }}>"{w.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WEEKLY CHALLENGE ══ */}
      <section style={{ padding: '80px 32px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{
            padding: 40, textAlign: 'center',
            background: `linear-gradient(145deg, ${c.primary}12, ${c.primary}04)`,
            border: `2px solid ${c.primary}25`,
            borderRadius: cardRadius, position: 'relative', overflow: 'hidden',
          }}>
            {/* Neon border glow */}
            <div style={{ position: 'absolute', inset: -1, borderRadius: cardRadius, border: `1px solid ${c.primary}20`, boxShadow: `inset 0 0 30px ${c.primary}08, 0 0 30px ${c.primary}08`, pointerEvents: 'none' }} />
            <span style={{ display: 'inline-block', padding: '5px 14px', background: `${c.primary}20`, color: c.primary, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', borderRadius: 20, textTransform: 'uppercase', border: `1px solid ${c.primary}30`, marginBottom: 20 }}>Desafio da Semana</span>
            <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, color: c.text, textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.04em' }}>
              100 Burpees em 10 minutos
            </h3>
            <p style={{ fontSize: 14, color: c.textMuted, marginBottom: 24, maxWidth: 450, margin: '0 auto 24px' }}>
              Complete o desafio, tire uma foto e ganhe 1 mês grátis de aulas coletivas.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
              {[
                { n: '47', l: 'Participantes' },
                { n: '12', l: 'Completaram' },
                { n: '3d', l: 'Restantes' },
              ].map(s => (
                <div key={s.l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: c.primary, textShadow: `0 0 20px ${c.primary}40` }}>{s.n}</div>
                  <div style={{ fontSize: 10, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
