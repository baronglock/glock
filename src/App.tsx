import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Database, Bot, Globe, BrainCircuit, ChevronRight, ArrowRight,
  ExternalLink, Mail, Phone, MapPin, Instagram,
  Linkedin, Github, Shield, Clock, TrendingUp,
  BarChart3, Code2, MessageSquare, Search, FileSpreadsheet,
  Workflow, LayoutDashboard, Zap
} from 'lucide-react';
import { useReveal } from './hooks/useReveal';
import { useLanguage } from './hooks/useLanguage';
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

/* ── Wrapper ── */
function W({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={className} style={{ maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto', paddingLeft: 24, paddingRight: 24, width: '100%', ...style }}>{children}</div>;
}

/* ── Section ── */
function Section({ children, className = '', id, alt, style, colors }: { children: React.ReactNode; className?: string; id?: string; alt?: boolean; style?: React.CSSProperties; colors: any }) {
  const ref = useReveal();
  return (
    <section ref={ref} id={id} className={className} style={{ width: '100%', ...(alt ? { background: colors.bgAlt } : {}), ...style }}>
      {children}
    </section>
  );
}

/* ── Image URLs ── */
const IMG = {
  heroAi: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80&auto=format&fit=crop',
  heroTeam: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop',
  about: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=700&q=80&auto=format&fit=crop',
  caseData: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&auto=format&fit=crop',
  caseAuto: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80&auto=format&fit=crop',
  caseWeb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&auto=format&fit=crop',
  ctaBg: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1400&q=80&auto=format&fit=crop',
  divider: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=90&auto=format&fit=crop',
  svcData: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop',
  svcAuto: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&q=80&auto=format&fit=crop',
  svcChat: 'https://images.unsplash.com/photo-1531746790095-e5a2ebf3fa62?w=900&q=80&auto=format&fit=crop',
  svcSites: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80&auto=format&fit=crop',
  svcDash: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&q=80&auto=format&fit=crop',
  svcConsult: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&q=80&auto=format&fit=crop',
};

/* ═══════════════ HERO ═══════════════ */
function Hero({ t, lang, colors }: any) {
  return (
    <section style={{
      position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', width: '100%',
      backgroundImage: `linear-gradient(${colors.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${colors.gridLine} 1px, transparent 1px)`,
      backgroundSize: '60px 60px',
    }}>
      <div style={{ position: 'absolute', top: '15%', left: '15%', width: 500, height: 500, background: `radial-gradient(circle, ${colors.orbBrand} 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 400, height: 400, background: `radial-gradient(circle, ${colors.orbGold} 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none', filter: 'blur(80px)' }} />

      <W style={{ paddingTop: 120, paddingBottom: 80, position: 'relative', zIndex: 10 }}>
        <div id="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          {/* Left: text */}
          <div>
            <h1 className="anim-fade-up" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 28 }}>
              <span style={{ color: colors.white }}>{t('hero.title1')}</span>
              <br />
              <span className="text-gradient">{t('hero.title2')}</span>
            </h1>

            <p className="anim-fade-up" style={{ maxWidth: 520, color: colors.textMuted, fontSize: 'clamp(1rem, 2vw, 1.125rem)', lineHeight: 1.75, animationDelay: '0.2s', marginBottom: 36 }}>
              {t('hero.sub')}
            </p>

            <div className="anim-fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, animationDelay: '0.35s', marginBottom: 40 }}>
              <a href="#contato" className="btn-cta" style={{ padding: '14px 36px', fontSize: 16 }}>
                {t('hero.cta')} <ArrowRight size={16} />
              </a>
              <a href="#servicos" style={{
                padding: '14px 36px', borderRadius: 9999, border: `1px solid ${colors.border}`, color: colors.text,
                fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none',
                transition: 'all 0.3s ease', fontSize: 16,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = colors.brand; e.currentTarget.style.color = colors.white; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.text; }}
              >
                {t('hero.cta2')} <ChevronRight size={16} />
              </a>
            </div>

            <div className="anim-fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, animationDelay: '0.5s' }}>
              {(lang === 'pt'
                ? ['Dados sob medida', 'Processos automatizados', 'Atendimento 24h', 'Presença digital premium', 'Decisões baseadas em dados', 'IA aplicada']
                : ['Custom data', 'Automated processes', '24/7 support', 'Premium digital presence', 'Data-driven decisions', 'Applied AI']
              ).map((tag) => (
                <span key={tag} style={{ padding: '5px 14px', borderRadius: 9999, background: colors.badgeBg, border: `1px solid ${colors.badgeBorder}`, fontSize: 12, color: colors.textDim, fontWeight: 500 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: image collage */}
          <div className="anim-fade-up" style={{ position: 'relative', animationDelay: '0.3s' }}>
            <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', boxShadow: `0 40px 80px ${colors.shadow}`, border: `1px solid ${colors.glassCardBorder}` }}>
              <img src={IMG.heroAi} alt="AI visualization" style={{ width: '100%', height: 380, objectFit: 'cover', display: 'block' }} loading="eager" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(155,27,48,0.15), transparent 60%)' }} />
            </div>
            <div style={{
              position: 'absolute', bottom: -24, left: -24, width: 180, height: 180, borderRadius: 16, overflow: 'hidden',
              boxShadow: `0 20px 40px ${colors.shadow}`, border: `2px solid ${colors.glassCardBorder}`,
            }}>
              <img src={IMG.heroTeam} alt="Team collaboration" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="eager" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(155,27,48,0.1), transparent 50%)' }} />
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            #hero-grid { grid-template-columns: 1fr !important; text-align: center; }
            #hero-grid > div:last-child { display: none; }
          }
        `}</style>
      </W>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: `linear-gradient(to top, ${colors.bg}, transparent)`, pointerEvents: 'none' }} />
    </section>
  );
}

/* ═══════════════ SERVICE CARD ═══════════════ */
function ServiceCard({ icon: Icon, title, desc, slug, lang, colors }: any) {
  return (
    <Link to={`/servicos/${slug}`} className="reveal" style={{
      padding: 28, borderRadius: 16, background: colors.glassCard, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      border: `1px solid ${colors.glassCardBorder}`, transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)', cursor: 'pointer',
      textDecoration: 'none', display: 'block',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = colors.borderHover; e.currentTarget.style.boxShadow = `0 20px 40px ${colors.shadow}, 0 0 30px rgba(155,27,48,0.08)`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = colors.glassCardBorder; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(155,27,48,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <Icon size={22} style={{ color: colors.brandLight }} />
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 600, color: colors.white, marginBottom: 10 }}>{title}</h3>
      <p style={{ color: colors.textMuted, fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, fontSize: 13, color: colors.brandLight, fontWeight: 500 }}>
        {lang === 'pt' ? 'Saiba mais' : 'Learn more'} <ChevronRight size={14} />
      </span>
    </Link>
  );
}

/* ═══════════════ SERVICES (6 cards, 3x2) ═══════════════ */
function Services({ t, lang, colors }: any) {
  const services = [
    { icon: Database, titleKey: 'svc.data.title', descKey: 'svc.data.desc', slug: 'extracao-de-dados' },
    { icon: Workflow, titleKey: 'svc.auto.title', descKey: 'svc.auto.desc', slug: 'automacao' },
    { icon: MessageSquare, titleKey: 'svc.chat.title', descKey: 'svc.chat.desc', slug: 'chatbots' },
    { icon: Globe, titleKey: 'svc.web.title', descKey: 'svc.web.desc', slug: 'sites' },
    { icon: LayoutDashboard, titleKey: 'svc.bi.title', descKey: 'svc.bi.desc', slug: 'dashboards' },
    { icon: BrainCircuit, titleKey: 'svc.consult.title', descKey: 'svc.consult.desc', slug: 'consultoria-ia' },
  ];

  return (
    <Section id="servicos" colors={colors} style={{ padding: '96px 0' }}>
      <W>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 9999, background: 'rgba(155,27,48,0.1)', color: colors.brandLight, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
            {t('services.tag')}
          </span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: colors.white, marginBottom: 16 }}>
            {t('services.title')}
          </h2>
          <p className="reveal rv-d2" style={{ color: colors.textMuted, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            {t('services.sub')}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {services.map((s) => (
            <ServiceCard key={s.titleKey} icon={s.icon} title={t(s.titleKey as any)} desc={t(s.descKey as any)} slug={s.slug} lang={lang} colors={colors} />
          ))}
        </div>
        <style>{`
          @media (max-width: 900px) { #servicos [style*="grid-template-columns: repeat(3"] { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 600px) { #servicos [style*="grid-template-columns: repeat(3"], #servicos [style*="grid-template-columns: repeat(2"] { grid-template-columns: 1fr !important; } }
        `}</style>
      </W>
    </Section>
  );
}

/* ═══════════════ METRICS ═══════════════ */
function Metrics({ lang, colors }: any) {
  const metrics = lang === 'pt' ? [
    { value: '1.6M+', label: 'Registros processados', desc: 'Dados empresariais extraídos e organizados para prospecção comercial.', icon: BarChart3 },
    { value: '200+', label: 'Horas economizadas/mês', desc: 'Automações que eliminam tarefas repetitivas e liberam sua equipe.', icon: Clock },
    { value: '99.9%', label: 'Disponibilidade', desc: 'Sistemas sempre online com monitoramento e suporte contínuo.', icon: Shield },
    { value: '< 7 dias', label: 'Prazo de entrega', desc: 'Da proposta ao primeiro entregável em menos de uma semana.', icon: TrendingUp },
  ] : [
    { value: '1.6M+', label: 'Records processed', desc: 'Business data extracted and organized for commercial prospecting.', icon: BarChart3 },
    { value: '200+', label: 'Hours saved/month', desc: 'Automations that eliminate repetitive tasks and free your team.', icon: Clock },
    { value: '99.9%', label: 'Availability', desc: 'Systems always online with continuous monitoring and support.', icon: Shield },
    { value: '< 7 days', label: 'Delivery time', desc: 'From proposal to first deliverable in less than a week.', icon: TrendingUp },
  ];

  return (
    <Section alt colors={colors} style={{ padding: '96px 0' }}>
      <W>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 9999, background: 'rgba(212,165,116,0.1)', color: colors.gold, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
            {lang === 'pt' ? 'Resultados' : 'Results'}
          </span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: colors.white, marginBottom: 12 }}>
            {lang === 'pt' ? 'Resultados que comprovam' : 'Proven results'}
          </h2>
          <p className="reveal rv-d2" style={{ color: colors.textMuted, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            {lang === 'pt' ? 'Cada número representa impacto real na operação dos nossos clientes.' : 'Each number represents real impact on our clients\' operations.'}
          </p>
        </div>
        <div id="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {metrics.map((m) => (
            <div key={m.label} className="reveal" style={{
              padding: 28, textAlign: 'center', borderRadius: 16, background: colors.glassCard, border: `1px solid ${colors.glassCardBorder}`,
              transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = colors.borderHover; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = colors.glassCardBorder; }}
            >
              <m.icon size={24} style={{ color: colors.gold, margin: '0 auto 14px' }} />
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 700, color: colors.white, marginBottom: 6 }}>{m.value}</div>
              <div style={{ fontSize: 14, color: colors.text, fontWeight: 600, marginBottom: 8 }}>{m.label}</div>
              <div style={{ fontSize: 13, color: colors.textDim, lineHeight: 1.6 }}>{m.desc}</div>
            </div>
          ))}
        </div>
        <style>{`@media (max-width: 768px) { #metrics-grid { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
      </W>
    </Section>
  );
}

/* ═══════════════ PROCESS ═══════════════ */
function Process({ lang, colors }: any) {
  const steps = lang === 'pt' ? [
    { icon: Search, title: 'Discovery', desc: 'Entendemos seu negócio, desafios e objetivos.' },
    { icon: FileSpreadsheet, title: 'Proposta', desc: 'Apresentamos escopo, cronograma e investimento.' },
    { icon: Code2, title: 'Desenvolvimento', desc: 'Construímos com entregas contínuas e validações semanais.' },
    { icon: Zap, title: 'Entrega & Suporte', desc: 'Ativação, treinamento e acompanhamento contínuo.' },
  ] : [
    { icon: Search, title: 'Discovery', desc: 'We understand your business, challenges and goals.' },
    { icon: FileSpreadsheet, title: 'Proposal', desc: 'We present scope, timeline and investment.' },
    { icon: Code2, title: 'Development', desc: 'We build with continuous delivery and weekly reviews.' },
    { icon: Zap, title: 'Delivery & Support', desc: 'Activation, training and ongoing support.' },
  ];

  return (
    <Section colors={colors} style={{ padding: '96px 0' }}>
      <W>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 9999, background: 'rgba(155,27,48,0.1)', color: colors.brandLight, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
            {lang === 'pt' ? 'Processo' : 'Process'}
          </span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: colors.white }}>
            {lang === 'pt' ? 'Como trabalhamos' : 'How we work'}
          </h2>
        </div>
        <div id="process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {steps.map((step, i) => (
            <div key={step.title} className="reveal" style={{
              padding: 24, borderRadius: 16, background: colors.glassCard, border: `1px solid ${colors.glassCardBorder}`,
              transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = colors.borderHover; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = colors.glassCardBorder; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(155,27,48,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.brand, fontWeight: 700, fontSize: 14 }}>{i + 1}</div>
                <step.icon size={18} style={{ color: colors.brandLight }} />
              </div>
              <h3 style={{ color: colors.white, fontWeight: 600, marginBottom: 8, fontSize: 16 }}>{step.title}</h3>
              <p style={{ color: colors.textMuted, fontSize: 14, lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
        <style>{`
          @media (max-width: 768px) { #process-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 500px) { #process-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </W>
    </Section>
  );
}

/* ═══════════════ IMAGE DIVIDER ═══════════════ */
function ImageDivider({ colors }: any) {
  return (
    <div style={{ position: 'relative', width: '100%', height: 360, overflow: 'hidden' }}>
      <img src={IMG.divider} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, ${colors.bg}, rgba(155,27,48,0.15), ${colors.bgAlt})` }} />
    </div>
  );
}

/* ═══════════════ ABOUT ═══════════════ */
function About({ t, colors }: any) {
  return (
    <Section id="sobre" alt colors={colors} style={{ padding: '96px 0' }}>
      <W>
        <div id="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          {/* Image */}
          <div className="reveal" style={{ position: 'relative' }}>
            <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: `0 30px 60px ${colors.shadow}`, border: `1px solid ${colors.glassCardBorder}` }}>
              <img src={IMG.about} alt="Technology workspace" style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block' }} loading="lazy" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(155,27,48,0.1), transparent 50%)' }} />
            </div>
            {/* Floating stats card */}
            <div style={{
              position: 'absolute', bottom: -16, right: -16, padding: '20px 28px', borderRadius: 16,
              background: colors.glassCard, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${colors.glassCardBorder}`, boxShadow: `0 20px 40px ${colors.shadow}`,
            }}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: colors.brandLight }}>5+</div>
              <div style={{ fontSize: 12, color: colors.textDim, fontWeight: 500 }}>anos de experiência</div>
            </div>
          </div>
          {/* Text */}
          <div>
            <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 9999, background: 'rgba(155,27,48,0.1)', color: colors.brandLight, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
              {t('about.tag')}
            </span>
            <h2 className="reveal rv-d1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: colors.white, marginBottom: 24 }}>
              {t('about.title')}
            </h2>
            <p className="reveal rv-d2" style={{ color: colors.textMuted, lineHeight: 1.75, marginBottom: 16 }}>{t('about.p1')}</p>
            <p className="reveal rv-d3" style={{ color: colors.textMuted, lineHeight: 1.75, marginBottom: 32 }}>{t('about.p2')}</p>
            <div className="reveal rv-d4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { icon: Database, label: 'Data Engineering' },
                { icon: Bot, label: 'AI & Automation' },
                { icon: Globe, label: 'Web Development' },
                { icon: MessageSquare, label: 'Chatbots & NLP' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: colors.glassCard, border: `1px solid ${colors.glassCardBorder}` }}>
                  <item.icon size={20} style={{ color: colors.brandLight, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: colors.text, fontWeight: 500 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 768px) { #about-grid { grid-template-columns: 1fr !important; } }`}</style>
      </W>
    </Section>
  );
}

/* ═══════════════ CASES ═══════════════ */
function Cases({ lang, colors }: any) {
  const caseImages = [IMG.caseData, IMG.caseAuto, IMG.caseWeb];
  const cases = lang === 'pt' ? [
    { title: 'Inteligência de Mercado — Base Empresarial', desc: 'Extração e organização de mais de 1.6 milhão de registros empresariais para prospecção comercial. Dados de contato, sócios, atividade econômica e situação fiscal — tudo limpo e pronto para uso.', tags: ['Dados Públicos', 'Prospecção', 'Inteligência Comercial'], metric: '1.6M+ empresas mapeadas' },
    { title: 'Automação Inteligente para Escritório', desc: 'Sistema completo de prospecção automatizada, atendimento via WhatsApp com IA, gestão financeira automatizada e painel de acompanhamento em tempo real.', tags: ['Automação', 'WhatsApp', 'IA', 'Gestão'], metric: '70% menos trabalho manual' },
    { title: 'Presença Digital de Alto Impacto', desc: 'Sites institucionais e landing pages com design exclusivo, carregamento ultrarrápido e otimizados para aparecer no Google. Experiência premium em qualquer dispositivo.', tags: ['Design Exclusivo', 'Performance', 'SEO'], metric: 'Nota máxima em velocidade' },
  ] : [
    { title: 'Market Intelligence — Business Database', desc: 'Extraction and organization of over 1.6 million business records for commercial prospecting. Contact data, partners, economic activity and fiscal status — all clean and ready to use.', tags: ['Public Data', 'Prospecting', 'Business Intelligence'], metric: '1.6M+ companies mapped' },
    { title: 'Intelligent Office Automation', desc: 'Complete system with automated prospecting, AI-powered WhatsApp support, automated financial management and real-time monitoring dashboard.', tags: ['Automation', 'WhatsApp', 'AI', 'Management'], metric: '70% less manual work' },
    { title: 'High-Impact Digital Presence', desc: 'Institutional websites and landing pages with exclusive design, ultra-fast loading and optimized to rank on Google. Premium experience on any device.', tags: ['Exclusive Design', 'Performance', 'SEO'], metric: 'Top speed score' },
  ];

  return (
    <Section id="cases" colors={colors} style={{ padding: '96px 0' }}>
      <W>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 9999, background: 'rgba(155,27,48,0.1)', color: colors.brandLight, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>Portfolio</span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: colors.white }}>Cases</h2>
        </div>
        <div id="cases-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {cases.map((c, i) => (
            <div key={c.title} className="reveal" style={{
              display: 'flex', flexDirection: 'column', borderRadius: 16, background: colors.glassCard, border: `1px solid ${colors.glassCardBorder}`,
              transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)', overflow: 'hidden',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = colors.borderHover; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = colors.glassCardBorder; }}
            >
              {/* Case image */}
              <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                <img src={caseImages[i]} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
                  loading="lazy"
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent 60%)' }} />
                <span style={{ position: 'absolute', bottom: 12, left: 16, padding: '4px 12px', borderRadius: 6, background: 'rgba(212,165,116,0.2)', backdropFilter: 'blur(8px)', color: colors.gold, fontSize: 12, fontWeight: 600 }}>{c.metric}</span>
              </div>
              {/* Case content */}
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: colors.white, marginBottom: 12 }}>{c.title}</h3>
                <p style={{ color: colors.textMuted, fontSize: 14, lineHeight: 1.7, marginBottom: 20, flex: 1 }}>{c.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {c.tags.map((tag) => (
                    <span key={tag} style={{ padding: '3px 10px', borderRadius: 9999, background: colors.tagBg, border: `1px solid ${colors.tagBorder}`, fontSize: 12, color: colors.textDim, fontWeight: 500 }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <style>{`@media (max-width: 900px) { #cases-grid { grid-template-columns: 1fr !important; } }`}</style>
      </W>
    </Section>
  );
}

/* ═══════════════ CTA ═══════════════ */
function CtaSection({ t }: any) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: '120px 0' }}>
      {/* Background image */}
      <img src={IMG.ctaBg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,10,15,0.88), rgba(155,27,48,0.3), rgba(10,10,15,0.92))' }} />
      <W style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <h2 className="reveal" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 700, color: '#fff', marginBottom: 24 }}>{t('cta.title')}</h2>
        <p className="reveal rv-d1" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto 40px', fontSize: 18, lineHeight: 1.7 }}>{t('cta.sub')}</p>
        <a href="#contato" className="btn-cta anim-pulse-glow reveal rv-d2" style={{ padding: '16px 40px', fontSize: 18 }}>
          {t('cta.btn')} <ArrowRight size={18} />
        </a>
      </W>
    </section>
  );
}

/* ═══════════════ CONTACT ═══════════════ */
function Contact({ lang, colors }: any) {
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const name = data.get('name');
    const msg = data.get('message');
    window.open(`https://wa.me/5541987991419?text=${encodeURIComponent(`Olá! Sou ${name}. ${msg}`)}`, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    background: colors.inputBg, border: `1px solid ${colors.border}`,
    color: colors.white, fontSize: 14, outline: 'none', transition: 'border-color 0.3s', fontFamily: 'inherit',
  };

  return (
    <Section id="contato" colors={colors} style={{ padding: '96px 0' }}>
      <W>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 48 }}>
          <div>
            <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 9999, background: 'rgba(155,27,48,0.1)', color: colors.brandLight, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
              {lang === 'pt' ? 'Contato' : 'Contact'}
            </span>
            <h2 className="reveal rv-d1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: colors.white, marginBottom: 24 }}>
              {lang === 'pt' ? 'Vamos conversar' : "Let's talk"}
            </h2>
            <p className="reveal rv-d2" style={{ color: colors.textMuted, lineHeight: 1.7, marginBottom: 32 }}>
              {lang === 'pt' ? 'Envie uma mensagem ou entre em contato diretamente. Respondemos em até 24 horas.' : 'Send a message or reach out directly. We respond within 24 hours.'}
            </p>
            <div className="reveal rv-d3" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: Phone, text: '+55 (41) 98799-1419', href: 'https://wa.me/5541987991419' },
                { icon: Mail, text: 'contato@glock.dev', href: 'mailto:contato@glock.dev' },
                { icon: MapPin, text: 'Curitiba, PR — Brasil', href: undefined },
              ].map((item) => {
                const content = (<span style={{ display: 'flex', alignItems: 'center', gap: 12, color: colors.textMuted, fontSize: 14 }}><item.icon size={18} style={{ color: colors.brand }} /> {item.text}</span>);
                return item.href ? <a key={item.text} href={item.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{content}</a> : <div key={item.text}>{content}</div>;
              })}
            </div>
            <div className="reveal rv-d4" style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              {[{ icon: Instagram, href: '#' }, { icon: Linkedin, href: '#' }, { icon: Github, href: 'https://github.com/baronglock' }].map((s, i) => (
                <a key={i} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.textMuted, textDecoration: 'none', transition: 'all 0.3s', background: colors.glass, border: `1px solid ${colors.glassBorder}` }}
                  onMouseEnter={e => { e.currentTarget.style.color = colors.brand; e.currentTarget.style.borderColor = colors.borderHover; }}
                  onMouseLeave={e => { e.currentTarget.style.color = colors.textMuted; e.currentTarget.style.borderColor = colors.glassBorder; }}
                ><s.icon size={18} /></a>
              ))}
            </div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="reveal rv-d2" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20, borderRadius: 16, background: colors.glassCard, border: `1px solid ${colors.glassCardBorder}` }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 6 }}>{lang === 'pt' ? 'Nome' : 'Name'}</label>
              <input name="name" required style={inputStyle} placeholder={lang === 'pt' ? 'Seu nome' : 'Your name'}
                onFocus={e => e.currentTarget.style.borderColor = colors.brand} onBlur={e => e.currentTarget.style.borderColor = colors.border} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 6 }}>Email</label>
              <input name="email" type="email" required style={inputStyle} placeholder={lang === 'pt' ? 'seu@email.com' : 'your@email.com'}
                onFocus={e => e.currentTarget.style.borderColor = colors.brand} onBlur={e => e.currentTarget.style.borderColor = colors.border} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: colors.text, marginBottom: 6 }}>{lang === 'pt' ? 'Mensagem' : 'Message'}</label>
              <textarea name="message" rows={4} required style={{ ...inputStyle, resize: 'none' }} placeholder={lang === 'pt' ? 'Conte-nos sobre seu projeto...' : 'Tell us about your project...'}
                onFocus={e => e.currentTarget.style.borderColor = colors.brand} onBlur={e => e.currentTarget.style.borderColor = colors.border} />
            </div>
            <button type="submit" className="btn-cta" style={{ padding: '14px 24px', width: '100%', fontSize: 15 }}>
              {sent ? (lang === 'pt' ? 'Redirecionando para WhatsApp...' : 'Redirecting to WhatsApp...') : (lang === 'pt' ? 'Enviar pelo WhatsApp' : 'Send via WhatsApp')}
              {!sent && <ExternalLink size={16} />}
            </button>
          </form>
        </div>
      </W>
    </Section>
  );
}

/* ═══════════════ APP ═══════════════ */
export default function App() {
  const { lang, t, toggle } = useLanguage();
  const { theme, colors, toggleTheme } = useTheme();

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.text, fontFamily: "'Inter', system-ui, sans-serif", width: '100%', transition: 'background-color 0.4s ease, color 0.4s ease' }}>
      <Navbar t={t} lang={lang} toggle={toggle} colors={colors} theme={theme} toggleTheme={toggleTheme} />
      <Hero t={t} lang={lang} colors={colors} />
      <Services t={t} lang={lang} colors={colors} />
      <ImageDivider colors={colors} />
      <Metrics lang={lang} colors={colors} />
      <Process lang={lang} colors={colors} />
      <About t={t} colors={colors} />
      <Cases lang={lang} colors={colors} />
      <CtaSection t={t} colors={colors} />
      <Contact lang={lang} colors={colors} />
      <Footer t={t} lang={lang} colors={colors} />
    </div>
  );
}
