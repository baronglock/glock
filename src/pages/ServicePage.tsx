import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';

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
}

export function ServicePage({ data }: { data: ServicePageData }) {
  const { lang, t } = useLanguage();
  const { colors } = useTheme();
  const ref = useReveal();
  const Icon = data.icon;

  const title = lang === 'pt' ? data.titlePt : data.titleEn;
  const subtitle = lang === 'pt' ? data.subtitlePt : data.subtitleEn;
  const desc = lang === 'pt' ? data.descPt : data.descEn;
  const benefits = lang === 'pt' ? data.benefitsPt : data.benefitsEn;
  const sectors = lang === 'pt' ? data.sectorsPt : data.sectorsEn;
  const cta = lang === 'pt' ? data.ctaPt : data.ctaEn;

  return (
    <div ref={ref}>
      {/* Hero */}
      <section style={{
        paddingTop: 140, paddingBottom: 80, width: '100%', position: 'relative', overflow: 'hidden',
        backgroundImage: `linear-gradient(${colors.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${colors.gridLine} 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }}>
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: 400, height: 400, background: `radial-gradient(circle, ${colors.orbBrand} 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none', filter: 'blur(80px)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: colors.textMuted, textDecoration: 'none', fontSize: 14, marginBottom: 32, transition: 'color 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.color = colors.brand}
            onMouseLeave={e => e.currentTarget.style.color = colors.textMuted}>
            <ArrowLeft size={16} />
            {lang === 'pt' ? 'Voltar ao início' : 'Back to home'}
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div className="reveal" style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(155,27,48,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={28} style={{ color: colors.brandLight }} />
            </div>
          </div>

          <h1 className="reveal rv-d1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: colors.white, marginBottom: 16, lineHeight: 1.15, maxWidth: 700 }}>
            {title}
          </h1>

          <p className="reveal rv-d2" style={{ fontSize: 20, color: colors.brandLight, fontWeight: 500, marginBottom: 24 }}>
            {subtitle}
          </p>

          <p className="reveal rv-d3" style={{ fontSize: 17, color: colors.textMuted, lineHeight: 1.8, maxWidth: 650 }}>
            {desc}
          </p>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: `linear-gradient(to top, ${colors.bg}, transparent)`, pointerEvents: 'none' }} />
      </section>

      {/* Benefits */}
      <section style={{ padding: '80px 0', background: colors.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <h2 className="reveal" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: colors.white, marginBottom: 48, textAlign: 'center' }}>
            {lang === 'pt' ? 'O que entregamos' : 'What we deliver'}
          </h2>

          <div id="benefits-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {benefits.map((b, i) => (
              <div key={i} className="reveal" style={{
                padding: 28, borderRadius: 16, background: colors.glassCard, border: `1px solid ${colors.glassCardBorder}`,
                transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = colors.borderHover; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = colors.glassCardBorder; }}
              >
                <CheckCircle2 size={20} style={{ color: colors.brandLight, marginBottom: 16 }} />
                <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.white, marginBottom: 8 }}>{b.title}</h3>
                <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.7 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <h2 className="reveal" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: colors.white, marginBottom: 16, textAlign: 'center' }}>
            {lang === 'pt' ? 'Setores que atendemos' : 'Industries we serve'}
          </h2>
          <p className="reveal rv-d1" style={{ textAlign: 'center', color: colors.textMuted, marginBottom: 48, maxWidth: 500, margin: '0 auto 48px' }}>
            {lang === 'pt' ? 'Soluções adaptadas para diferentes segmentos de mercado.' : 'Solutions adapted for different market segments.'}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
            {sectors.map((s) => (
              <span key={s} className="reveal" style={{
                padding: '10px 20px', borderRadius: 9999, background: colors.glassCard, border: `1px solid ${colors.glassCardBorder}`,
                fontSize: 14, color: colors.text, fontWeight: 500, transition: 'all 0.3s',
              }}
                onMouseOver={e => { (e.target as HTMLElement).style.borderColor = colors.borderHover; (e.target as HTMLElement).style.color = colors.brandLight; }}
                onMouseOut={e => { (e.target as HTMLElement).style.borderColor = colors.glassCardBorder; (e.target as HTMLElement).style.color = colors.text; }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', background: colors.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h2 className="reveal" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, color: colors.white, marginBottom: 16 }}>
            {cta}
          </h2>
          <p className="reveal rv-d1" style={{ color: colors.textMuted, marginBottom: 32, fontSize: 17 }}>
            {lang === 'pt' ? 'Vamos conversar sobre como podemos ajudar.' : "Let's talk about how we can help."}
          </p>
          <a href="/#contato" className="btn-cta anim-pulse-glow reveal rv-d2" style={{ padding: '16px 40px', fontSize: 17 }}>
            {t('hero.cta')} <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}
