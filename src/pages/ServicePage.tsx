import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';

const SERVICE_IMAGES: Record<string, string> = {
  'extracao-de-dados': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop',
  'automacao': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80&auto=format&fit=crop',
  'chatbots': 'https://images.unsplash.com/photo-1531746790095-e5a2ebf3fa62?w=1200&q=80&auto=format&fit=crop',
  'sites': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop',
  'dashboards': 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80&auto=format&fit=crop',
  'consultoria-ia': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80&auto=format&fit=crop',
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
}

export function ServicePage({ data, slug }: { data: ServicePageData; slug: string }) {
  const { lang, t } = useLanguage();
  const { colors } = useTheme();
  const ref = useReveal();
  const Icon = data.icon;
  const heroImg = SERVICE_IMAGES[slug] || SERVICE_IMAGES['consultoria-ia'];

  const title = lang === 'pt' ? data.titlePt : data.titleEn;
  const subtitle = lang === 'pt' ? data.subtitlePt : data.subtitleEn;
  const desc = lang === 'pt' ? data.descPt : data.descEn;
  const benefits = lang === 'pt' ? data.benefitsPt : data.benefitsEn;
  const sectors = lang === 'pt' ? data.sectorsPt : data.sectorsEn;
  const cta = lang === 'pt' ? data.ctaPt : data.ctaEn;

  return (
    <div ref={ref}>
      {/* Hero with image */}
      <section style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        {/* Background image */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={heroImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="eager" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,15,0.95) 40%, rgba(10,10,15,0.6) 70%, rgba(155,27,48,0.2))' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '160px 24px 100px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 14, marginBottom: 32, transition: 'color 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#e8a0a0'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
            <ArrowLeft size={16} />
            {lang === 'pt' ? 'Voltar ao início' : 'Back to home'}
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div className="reveal" style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(155,27,48,0.2)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={28} style={{ color: '#e8a0a0' }} />
            </div>
          </div>

          <h1 className="reveal rv-d1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: '#fff', marginBottom: 16, lineHeight: 1.15, maxWidth: 700 }}>
            {title}
          </h1>

          <p className="reveal rv-d2" style={{ fontSize: 20, color: '#e8a0a0', fontWeight: 500, marginBottom: 24 }}>
            {subtitle}
          </p>

          <p className="reveal rv-d3" style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, maxWidth: 600 }}>
            {desc}
          </p>

          <a href="/#contato" className="btn-cta reveal rv-d4" style={{ marginTop: 32, padding: '14px 36px', fontSize: 16, display: 'inline-flex' }}>
            {t('hero.cta')} <ArrowRight size={16} />
          </a>
        </div>
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

      {/* CTA with background image */}
      <section style={{ position: 'relative', padding: '100px 0', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1400&q=80&auto=format&fit=crop" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,10,15,0.9), rgba(155,27,48,0.25), rgba(10,10,15,0.92))' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <h2 className="reveal" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, color: '#fff', marginBottom: 16 }}>
            {cta}
          </h2>
          <p className="reveal rv-d1" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 32, fontSize: 17 }}>
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
