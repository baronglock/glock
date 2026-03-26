import { useState } from 'react';

/* ── Types ── */
interface BarbeariaExtrasProps {
  colors: { primary: string; secondary: string; bg: string; text: string; textMuted: string };
  name: string;
  gallery: string[];
  cardRadius: number;
}

/* ── Before/After Slider ── */
function BeforeAfter({ before, after, primary, radius }: { before: string; after: string; primary: string; radius: number }) {
  const [pos, setPos] = useState(50);
  return (
    <div
      style={{ position: 'relative', width: '100%', aspectRatio: '3/4', maxWidth: 360, borderRadius: radius, overflow: 'hidden', cursor: 'ew-resize', border: `1px solid ${primary}15` }}
      onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); setPos(Math.max(5, Math.min(95, ((e.clientX - r.left) / r.width) * 100))); }}
      onTouchMove={e => { const t = e.touches[0]; const r = e.currentTarget.getBoundingClientRect(); setPos(Math.max(5, Math.min(95, ((t.clientX - r.left) / r.width) * 100))); }}
    >
      {/* After (full) */}
      <img src={after} alt="Depois" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      {/* Before (clipped) */}
      <div style={{ position: 'absolute', inset: 0, width: `${pos}%`, overflow: 'hidden' }}>
        <img src={before} alt="Antes" style={{ width: `${10000 / pos}%`, height: '100%', objectFit: 'cover' }} />
      </div>
      {/* Divider line */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${pos}%`, width: 3, background: primary, transform: 'translateX(-50%)', boxShadow: `0 0 12px ${primary}80`, zIndex: 2 }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 36, height: 36, borderRadius: '50%', background: primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#0f0f17', fontWeight: 800, boxShadow: `0 0 20px ${primary}60` }}>
          ◂▸
        </div>
      </div>
      {/* Labels */}
      <div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 12px', background: 'rgba(0,0,0,0.7)', borderRadius: 20, fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase', zIndex: 3 }}>Antes</div>
      <div style={{ position: 'absolute', top: 12, right: 12, padding: '4px 12px', background: `${primary}cc`, borderRadius: 20, fontSize: 10, fontWeight: 700, color: '#0f0f17', letterSpacing: '0.08em', textTransform: 'uppercase', zIndex: 3 }}>Depois</div>
    </div>
  );
}

/* ── Style Badge ── */
function StyleBadge({ name, icon, primary }: { name: string; icon: string; primary: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '20px 16px',
        background: hovered ? `${primary}12` : `${primary}06`,
        border: `1px solid ${hovered ? `${primary}30` : `${primary}10`}`,
        borderRadius: 16, transition: 'all 0.3s', cursor: 'default', minWidth: 100,
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? `0 8px 24px ${primary}15` : 'none',
      }}
    >
      <span style={{ fontSize: 28, lineHeight: 1 }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 600, color: primary, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{name}</span>
    </div>
  );
}

/* ── Main Component ── */
export default function BarbeariaExtras({ colors: c, name: _name, gallery, cardRadius }: BarbeariaExtrasProps) {
  // Use first 2 gallery images as before/after pairs (or fallbacks)
  const beforeAfterPairs = [
    { before: gallery[0] || '', after: gallery[1] || '' },
    { before: gallery[2] || '', after: gallery[3] || '' },
  ];

  const styles = [
    { name: 'Degradê', icon: '◈' },
    { name: 'Clássico', icon: '♛' },
    { name: 'Barba Full', icon: '⌇' },
    { name: 'Razor Fade', icon: '◎' },
    { name: 'Pompadour', icon: '◇' },
    { name: 'Undercut', icon: '△' },
  ];

  return (
    <>
      {/* ══ BEFORE/AFTER TRANSFORMATIONS ══ */}
      <section style={{ padding: '96px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span style={{ display: 'inline-block', padding: '5px 14px', background: `${c.primary}10`, color: c.primary, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', borderRadius: 20, textTransform: 'uppercase', border: `1px solid ${c.primary}15` }}>Transformações</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.7rem,4vw,2.4rem)', fontWeight: 300, color: c.text, letterSpacing: '-0.02em', textAlign: 'center', marginBottom: 8 }}>
            Antes & Depois
          </h2>
          <div style={{ width: 40, height: 1, background: `${c.primary}50`, margin: '0 auto 16px' }} />
          <p style={{ textAlign: 'center', color: c.textMuted, fontSize: 14, marginBottom: 48, maxWidth: 500, margin: '0 auto 48px' }}>
            Cada corte conta uma história. Veja o que nossos profissionais fazem.
          </p>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {beforeAfterPairs.map((pair, i) => (
              <BeforeAfter key={i} before={pair.before} after={pair.after} primary={c.primary} radius={cardRadius} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ STYLE CATALOG ══ */}
      <section style={{ padding: '80px 32px', background: `${c.primary}03` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span style={{ display: 'inline-block', padding: '5px 14px', background: `${c.primary}10`, color: c.primary, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', borderRadius: 20, textTransform: 'uppercase', border: `1px solid ${c.primary}15` }}>Especialidades</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.7rem,4vw,2.4rem)', fontWeight: 300, color: c.text, letterSpacing: '-0.02em', textAlign: 'center', marginBottom: 8 }}>
            Nossos Estilos
          </h2>
          <div style={{ width: 40, height: 1, background: `${c.primary}50`, margin: '0 auto 48px' }} />
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            {styles.map(s => (
              <StyleBadge key={s.name} name={s.name} icon={s.icon} primary={c.primary} bg={c.bg} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ THE EXPERIENCE — VIP LOUNGE ══ */}
      <section style={{ padding: '96px 32px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span style={{ display: 'inline-block', padding: '5px 14px', background: `${c.primary}10`, color: c.primary, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', borderRadius: 20, textTransform: 'uppercase', border: `1px solid ${c.primary}15` }}>A Experiência</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.7rem,4vw,2.4rem)', fontWeight: 300, color: c.text, letterSpacing: '-0.02em', textAlign: 'center', marginBottom: 8 }}>
            Mais que um corte
          </h2>
          <div style={{ width: 40, height: 1, background: `${c.primary}50`, margin: '0 auto 48px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }} className="demo-grid">
            {[
              { icon: '♛', title: 'Whisky & Cerveja', desc: 'Cortesia da casa enquanto você espera ou durante o serviço.' },
              { icon: '◎', title: 'Toalha Quente', desc: 'Ritual de relaxamento com toalhas quentes e óleos essenciais.' },
              { icon: '◇', title: 'Ambiente Premium', desc: 'Som ambiente, iluminação aconchegante e cadeiras de couro.' },
            ].map(item => (
              <div key={item.title} style={{
                padding: 28, textAlign: 'center',
                background: `${c.primary}06`, backdropFilter: 'blur(12px)',
                border: `1px solid ${c.primary}10`, borderRadius: cardRadius,
                transition: 'all 0.3s',
              }}>
                <div style={{ fontSize: 32, color: c.primary, marginBottom: 16, lineHeight: 1 }}>{item.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: c.text, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: c.textMuted, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
