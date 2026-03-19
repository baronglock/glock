import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';

const SERVICE_IMAGES: Record<string, string> = {
  'extracao-de-dados': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop&fm=webp',
  'automacao': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80&auto=format&fit=crop&fm=webp',
  'chatbots': 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=1200&q=80&auto=format&fit=crop&fm=webp',
  'sites': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop&fm=webp',
  'dashboards': 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80&auto=format&fit=crop&fm=webp',
  'consultoria-ia': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80&auto=format&fit=crop&fm=webp',
};

export interface ServicePageData {
  icon: any;
  titlePt: string;
  titleEn: string;
  subtitlePt: string;
  subtitleEn: string;
  descPt: string;
  descEn: string;
  benefitsPt: { title: string; desc: string }[];
  benefitsEn: { title: string; desc: string }[];
  sectorsPt: string[];
  sectorsEn: string[];
  ctaPt: string;
  ctaEn: string;
  metricsPt?: { value: string; label: string }[];
  metricsEn?: { value: string; label: string }[];
  processPt?: { title: string; desc: string }[];
  processEn?: { title: string; desc: string }[];
  plansPt?: { name: string; subtitle: string; price: string; period: string; features: string[]; highlight?: boolean }[];
  plansEn?: { name: string; subtitle: string; price: string; period: string; features: string[]; highlight?: boolean }[];
}

export function ServicePage({ data, slug }: { data: ServicePageData; slug: string }) {
  const { lang, t } = useLanguage();
  const { colors } = useTheme();
  const ref = useReveal();
  const Icon = data.icon;
  const en = lang === 'en';

  const title = en ? data.titleEn : data.titlePt;
  const subtitle = en ? data.subtitleEn : data.subtitlePt;
  const desc = en ? data.descEn : data.descPt;
  const benefits = en ? data.benefitsEn : data.benefitsPt;
  const sectors = en ? data.sectorsEn : data.sectorsPt;
  const cta = en ? data.ctaEn : data.ctaPt;
  const metrics = en ? data.metricsEn : data.metricsPt;
  const process = en ? data.processEn : data.processPt;
  const plans = en ? data.plansEn : data.plansPt;

  const tagStyle: React.CSSProperties = {
    display: 'inline-block', padding: '4px 14px', fontSize: 11,
    letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500,
    color: colors.brand, background: `${colors.brand}15`,
    border: `1px solid ${colors.brand}25`, marginBottom: 20,
  };

  const h2Style: React.CSSProperties = {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300,
    color: colors.white, lineHeight: 1.15, letterSpacing: '-0.02em',
  };

  return (
    <div ref={ref}>
      <Helmet>
        <title>{title} — Stauf.</title>
        <meta name="description" content={`${subtitle} — ${desc.slice(0, 140)}`} />
        <meta property="og:title" content={`${title} — Stauf.`} />
        <meta property="og:description" content={subtitle} />
        <link rel="canonical" href={`https://stauf.com.br/servicos/${slug}`} />
      </Helmet>

      {/* ════ HERO ════ */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: '120px 0 80px' }}>
        {/* Background image with gradient fade */}
        {SERVICE_IMAGES[slug] && (
          <>
            <img src={SERVICE_IMAGES[slug]} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12 }} loading="eager" />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${colors.bg} 35%, transparent 60%, ${colors.bg} 100%)` }} />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, ${colors.bg} 0%, transparent 30%, transparent 70%, ${colors.bg} 100%)` }} />
          </>
        )}
        {/* Gradient orbs */}
        <div style={{ position: 'absolute', top: '15%', left: '15%', width: 500, height: 500, background: `radial-gradient(circle, ${colors.orbBrand} 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 400, height: 400, background: `radial-gradient(circle, ${colors.orbGold} 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none', filter: 'blur(80px)' }} />
        {/* Decorative line */}
        <div style={{ position: 'absolute', left: 32, top: 160, width: 1, height: 200, background: `linear-gradient(to bottom, ${colors.brand}40, transparent)`, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', width: '100%', position: 'relative', zIndex: 10 }}>
          <Link to="/" className="anim-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: colors.textDim, textDecoration: 'none', fontSize: 13, marginBottom: 32, transition: 'color 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.color = colors.brand}
            onMouseLeave={e => e.currentTarget.style.color = colors.textDim}>
            <ArrowLeft size={14} /> {en ? 'Back' : 'Voltar'}
          </Link>

          <div style={{ maxWidth: 700 }}>
            <div className="anim-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24, animationDelay: '0.1s' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${colors.brand}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} style={{ color: colors.brand }} />
              </div>
              <span style={{ fontSize: 13, color: colors.textDim, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</span>
            </div>

            <h1 className="anim-fade-up" style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 300,
              lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: 24,
              animationDelay: '0.2s',
            }}>
              <span style={{ color: colors.white }}>{subtitle}</span>
            </h1>

            <p className="anim-fade-up" style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: colors.textMuted, lineHeight: 1.75, maxWidth: 560, marginBottom: 36, animationDelay: '0.3s' }}>
              {desc}
            </p>

            <div className="anim-fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, animationDelay: '0.4s' }}>
              <a href="/#contato" className="btn-cta" style={{ padding: '14px 36px', fontSize: 'clamp(0.875rem, 1.6vw, 1rem)' }}>
                {t('hero.cta')} <ArrowRight size={16} />
              </a>
            </div>
          </div>

          {/* Metrics row */}
          {metrics && (
            <div className="anim-fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: 40, marginTop: 56, paddingTop: 32, borderTop: `1px solid ${colors.border}`, animationDelay: '0.5s' }}>
              {metrics.map(m => (
                <div key={m.label}>
                  <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 600, color: colors.brand }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: colors.textDim, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>{m.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: `linear-gradient(to top, ${colors.bg}, transparent)`, pointerEvents: 'none' }} />
      </section>

      {/* ════ BENEFITS ════ */}
      <section style={{ padding: '100px 0', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, background: `linear-gradient(to bottom, ${colors.bg}, transparent)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={tagStyle}>{en ? 'Benefits' : 'Benefícios'}</span>
            <h2 style={h2Style}>
              {en ? 'What we ' : 'O que '}
              <span style={{ fontStyle: 'italic', fontWeight: 400, color: colors.brand }}>{en ? 'deliver' : 'entregamos'}</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {benefits.map((b, i) => (
              <div key={i} className="reveal" style={{
                padding: 28, background: colors.glassCard, border: `1px solid ${colors.glassCardBorder}`,
                transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'; e.currentTarget.style.borderColor = colors.borderHover; e.currentTarget.style.boxShadow = `0 24px 48px ${colors.shadow}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.borderColor = colors.glassCardBorder; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <CheckCircle2 size={20} style={{ color: colors.brand, marginBottom: 16 }} />
                <h3 style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', fontWeight: 600, color: colors.white, marginBottom: 8 }}>{b.title}</h3>
                <p style={{ fontSize: 'clamp(0.8rem, 1.4vw, 0.875rem)', color: colors.textMuted, lineHeight: 1.7 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ PROCESS ════ */}
      {process && (
        <section style={{ padding: '100px 0', background: colors.bgAlt, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, background: `linear-gradient(to bottom, ${colors.bg}, transparent)`, pointerEvents: 'none', zIndex: 1 }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: `linear-gradient(to top, ${colors.bg}, transparent)`, pointerEvents: 'none', zIndex: 1 }} />
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
              <span style={tagStyle}>{en ? 'Process' : 'Processo'}</span>
              <h2 style={h2Style}>
                {en ? 'How it ' : 'Como '}
                <span style={{ fontStyle: 'italic', fontWeight: 400, color: colors.brand }}>{en ? 'works' : 'funciona'}</span>
              </h2>
            </div>

            <div id="svc-process-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${process.length}, 1fr)`, gap: 20, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 28, left: '10%', right: '10%', height: 2, background: `linear-gradient(to right, transparent, ${colors.brand}30, ${colors.brand}30, transparent)`, zIndex: 0 }} />
              {process.map((step, i) => (
                <div key={step.title} className="reveal" style={{
                  padding: 24, background: colors.glassCard, border: `1px solid ${colors.glassCardBorder}`,
                  transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)', position: 'relative', zIndex: 1,
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'; e.currentTarget.style.borderColor = colors.borderHover; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.borderColor = colors.glassCardBorder; }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${colors.brand}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.brand, fontWeight: 700, fontSize: 14, border: `2px solid ${colors.brand}40`, marginBottom: 16 }}>{i + 1}</div>
                  <h3 style={{ color: colors.white, fontWeight: 600, marginBottom: 8, fontSize: 'clamp(0.9rem, 1.6vw, 1rem)' }}>{step.title}</h3>
                  <p style={{ color: colors.textMuted, fontSize: 14, lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              ))}
            </div>
            <style>{`
              @media (max-width: 768px) { #svc-process-grid { grid-template-columns: repeat(2, 1fr) !important; } }
              @media (max-width: 500px) { #svc-process-grid { grid-template-columns: 1fr !important; } }
            `}</style>
          </div>
        </section>
      )}

      {/* ════ PLANS ════ */}
      {plans && (
        <section style={{ padding: '100px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
              <span style={tagStyle}>{en ? 'Plans' : 'Planos'}</span>
              <h2 style={h2Style}>
                {en ? 'Transparent ' : 'Investimento '}
                <span style={{ fontStyle: 'italic', fontWeight: 400, color: colors.brand }}>{en ? 'investment' : 'transparente'}</span>
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, alignItems: 'start' }}>
              {plans.map(p => (
                <div key={p.name} className="reveal" style={{
                  padding: 36, background: colors.glassCard,
                  border: p.highlight ? `2px solid ${colors.brand}` : `1px solid ${colors.glassCardBorder}`,
                  transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {p.highlight && (
                    <div style={{ position: 'absolute', top: 16, right: 16, padding: '4px 12px', background: colors.brand, color: '#fff', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em' }}>
                      {en ? 'Most Popular' : 'Mais Popular'}
                    </div>
                  )}
                  <h3 style={{ fontSize: 'clamp(1.15rem, 2.2vw, 1.375rem)', fontWeight: 300, color: colors.white, marginBottom: 4 }}>{p.name}</h3>
                  <p style={{ fontSize: 13, color: colors.textDim, marginBottom: 24 }}>{p.subtitle}</p>
                  <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: `1px solid ${colors.border}` }}>
                    <span style={{ fontSize: 'clamp(1.5rem, 3vw, 1.75rem)', fontWeight: 300, color: colors.white }}>{p.price}</span>
                    <span style={{ fontSize: 13, color: colors.textDim }}> {p.period}</span>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                    {p.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: colors.textMuted, lineHeight: 1.5 }}>
                        <CheckCircle2 size={15} style={{ color: colors.brand, flexShrink: 0, marginTop: 2 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="/#contato" style={{
                    display: 'block', textAlign: 'center', padding: '12px 24px',
                    background: p.highlight ? colors.brand : 'transparent',
                    color: p.highlight ? '#fff' : colors.white,
                    border: p.highlight ? 'none' : `1px solid ${colors.border}`,
                    fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'all 0.3s',
                  }}
                    onMouseEnter={e => { if (!p.highlight) { e.currentTarget.style.borderColor = colors.brand; e.currentTarget.style.color = colors.brand; } else { e.currentTarget.style.opacity = '0.9'; } }}
                    onMouseLeave={e => { if (!p.highlight) { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.white; } else { e.currentTarget.style.opacity = '1'; } }}
                  >
                    {en ? 'Start now' : 'Começar agora'}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════ SECTORS ════ */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div className="reveal" style={{ marginBottom: 48 }}>
            <span style={tagStyle}>{en ? 'Industries' : 'Setores'}</span>
            <h2 style={h2Style}>{en ? 'Industries we serve' : 'Setores que atendemos'}</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
            {sectors.map(s => (
              <span key={s} className="reveal" style={{
                padding: '10px 20px', borderRadius: 9999, background: colors.glassCard, border: `1px solid ${colors.glassCardBorder}`,
                fontSize: 14, color: colors.text, fontWeight: 500, transition: 'all 0.3s',
              }}
                onMouseOver={e => { (e.target as HTMLElement).style.borderColor = colors.borderHover; (e.target as HTMLElement).style.color = colors.brand; }}
                onMouseOut={e => { (e.target as HTMLElement).style.borderColor = colors.glassCardBorder; (e.target as HTMLElement).style.color = colors.text; }}
              >{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CTA ════ */}
      <section style={{ position: 'relative', padding: '120px 0', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 0%, ${colors.brand}08 30%, ${colors.brand}0a 50%, ${colors.brand}08 70%, transparent 100%)` }} />
        <div style={{ position: 'absolute', left: '30%', top: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, background: `radial-gradient(circle, ${colors.brand}08 0%, transparent 70%)`, borderRadius: '50%', filter: 'blur(100px)' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <h2 className="reveal" style={{ ...h2Style, fontSize: 'clamp(1.8rem, 5vw, 3rem)', marginBottom: 16 }}>{cta}</h2>
          <p className="reveal rv-d1" style={{ color: colors.textMuted, marginBottom: 40, fontSize: 'clamp(1rem, 2vw, 1.125rem)', lineHeight: 1.7 }}>
            {en ? "Let's talk about how we can help." : 'Vamos conversar sobre como podemos ajudar.'}
          </p>
          <a href="/#contato" className="btn-cta anim-pulse-glow reveal rv-d2" style={{ padding: '16px 40px', fontSize: 'clamp(0.95rem, 1.8vw, 1.125rem)' }}>
            {t('hero.cta')} <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}
