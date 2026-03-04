import { useState, useEffect, useRef } from 'react';
import {
  Database, Bot, Globe, BrainCircuit, ChevronRight, ArrowRight,
  Menu, X, ExternalLink, Mail, Phone, MapPin, Instagram,
  Linkedin, Github, Shield, Clock, TrendingUp,
  BarChart3, Code2, MessageSquare, Search, FileSpreadsheet,
  Workflow, Languages, LayoutDashboard, Zap
} from 'lucide-react';
import { useReveal } from './hooks/useReveal';
import { useLanguage } from './hooks/useLanguage';

/* ── Colors (bordô palette) ── */
const C = {
  brand: '#9b1b30',
  brandLight: '#c2314a',
  brandDark: '#7a1526',
  gold: '#d4a574',
  goldLight: '#e0be98',
  bg: '#0a0a0f',
  bgCard: 'rgba(20, 20, 30, 0.6)',
  bgAlt: 'rgba(16, 16, 24, 0.4)',
  border: 'rgba(255,255,255,0.06)',
  borderHover: 'rgba(155, 27, 48, 0.3)',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  white: '#ffffff',
};

/* ── Wrapper ── */
function W({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={className} style={{ maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto', paddingLeft: 24, paddingRight: 24, width: '100%', ...style }}>{children}</div>;
}

/* ── Section ── */
function Section({ children, className = '', id, alt, style }: { children: React.ReactNode; className?: string; id?: string; alt?: boolean; style?: React.CSSProperties }) {
  const ref = useReveal();
  return (
    <section ref={ref} id={id} className={`${alt ? 'section-alt' : ''} ${className}`} style={{ width: '100%', ...style }}>
      {children}
    </section>
  );
}

/* ═══════════════ NAVBAR ═══════════════ */
function Navbar({ t, lang, toggle }: { t: (k: any) => string; lang: string; toggle: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { href: '#servicos', label: t('nav.services') },
    { href: '#sobre', label: t('nav.about') },
    { href: '#cases', label: t('nav.cases') },
    { href: '#contato', label: t('nav.contact') },
  ];

  return (
    <>
      <nav
        className={scrolled ? 'glass' : ''}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          transition: 'all 0.5s ease',
          ...(scrolled ? { boxShadow: '0 4px 30px rgba(0,0,0,0.4)' } : { background: 'transparent' }),
        }}
      >
        <W>
          <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo */}
            <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: C.white, letterSpacing: '-0.03em' }}>
                Glock<span style={{ color: C.brand }}>.</span>
              </span>
              <span style={{ fontSize: 11, color: C.textDim, fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {lang === 'pt' ? 'Automação, Dados e IA' : 'Automation, Data & AI'}
              </span>
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: 28 }}>
              {links.map((l) => (
                <a key={l.href} href={l.href} style={{ fontSize: 14, color: C.textMuted, textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.white)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}>
                  {l.label}
                </a>
              ))}
              <button onClick={toggle} style={{ background: 'none', border: 'none', color: C.textDim, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500 }}>
                <Languages size={14} />
                {lang === 'pt' ? 'EN' : 'PT'}
              </button>
              <a href="#contato" className="btn-cta" style={{ padding: '9px 22px', fontSize: 14 }}>
                {t('hero.cta')}
              </a>
            </div>

            {/* Mobile */}
            <div className="flex md:hidden" style={{ alignItems: 'center', gap: 12 }}>
              <button onClick={toggle} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer' }}>
                <Languages size={18} />
              </button>
              <button onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer' }}>
                <Menu size={22} />
              </button>
            </div>
          </div>
        </W>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="drawer-overlay anim-fade-in" style={{ position: 'fixed', inset: 0, zIndex: 60 }} onClick={() => setOpen(false)}>
          <div className="drawer-panel anim-slide-right" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 280, padding: 24, borderLeft: `1px solid ${C.border}` }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer' }}>
              <X size={22} />
            </button>
            <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                  style={{ fontSize: 18, color: '#cbd5e1', textDecoration: 'none' }}>
                  {l.label}
                </a>
              ))}
              <a href="#contato" onClick={() => setOpen(false)} className="btn-cta" style={{ padding: '12px 20px', marginTop: 16, textAlign: 'center', fontSize: 14 }}>
                {t('hero.cta')}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════ HERO ═══════════════ */
function Hero({ t }: { t: (k: any) => string }) {
  return (
    <section className="bg-grid" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', width: '100%' }}>
      {/* Gradient orbs */}
      <div style={{ position: 'absolute', top: '15%', left: '15%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(155,27,48,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(212,165,116,0.05) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(80px)' }} />

      <W style={{ paddingTop: 120, paddingBottom: 80, textAlign: 'center', position: 'relative', zIndex: 10 }}>
        {/* Title */}
        <h1 className="anim-fade-up" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 28 }}>
          <span style={{ color: C.white }}>{t('hero.title1')}</span>
          <br />
          <span className="text-gradient">{t('hero.title2')}</span>
        </h1>

        {/* Subtitle */}
        <p className="anim-fade-up" style={{ maxWidth: 620, margin: '0 auto 44px', color: C.textMuted, fontSize: 'clamp(1rem, 2vw, 1.125rem)', lineHeight: 1.75, animationDelay: '0.2s' }}>
          {t('hero.sub')}
        </p>

        {/* CTA buttons */}
        <div className="anim-fade-up" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 16, animationDelay: '0.35s' }}>
          <a href="#contato" className="btn-cta" style={{ padding: '14px 36px', fontSize: 16 }}>
            {t('hero.cta')}
            <ArrowRight size={16} />
          </a>
          <a href="#servicos" style={{
            padding: '14px 36px', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1',
            fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none',
            transition: 'all 0.3s ease', fontSize: 16,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.brand; e.currentTarget.style.color = C.white; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#cbd5e1'; }}
          >
            {t('hero.cta2')}
            <ChevronRight size={16} />
          </a>
        </div>

        {/* Tech badges */}
        <div className="anim-fade-up" style={{ marginTop: 64, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, animationDelay: '0.5s' }}>
          {['Python', 'React', 'Node.js', 'OpenAI', 'n8n', 'WhatsApp API'].map((tech) => (
            <span key={tech} style={{ padding: '5px 14px', borderRadius: 9999, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontSize: 12, color: C.textDim, fontWeight: 500 }}>
              {tech}
            </span>
          ))}
        </div>
      </W>

      {/* Bottom fade */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: `linear-gradient(to top, ${C.bg}, transparent)`, pointerEvents: 'none' }} />
    </section>
  );
}

/* ═══════════════ SERVICE CARD ═══════════════ */
function ServiceCard({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="glass-card reveal" style={{ padding: 28 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(155,27,48,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <Icon size={22} style={{ color: C.brandLight }} />
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 600, color: C.white, marginBottom: 10 }}>{title}</h3>
      <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}

/* ═══════════════ SERVICES (6 cards, 3x2) ═══════════════ */
function Services({ t }: { t: (k: any) => string }) {
  const services = [
    { icon: Database, titleKey: 'svc.data.title', descKey: 'svc.data.desc' },
    { icon: Workflow, titleKey: 'svc.auto.title', descKey: 'svc.auto.desc' },
    { icon: MessageSquare, titleKey: 'svc.chat.title', descKey: 'svc.chat.desc' },
    { icon: Globe, titleKey: 'svc.web.title', descKey: 'svc.web.desc' },
    { icon: LayoutDashboard, titleKey: 'svc.bi.title', descKey: 'svc.bi.desc' },
    { icon: BrainCircuit, titleKey: 'svc.consult.title', descKey: 'svc.consult.desc' },
  ];

  return (
    <Section id="servicos" style={{ padding: '96px 0' }}>
      <W>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 9999, background: 'rgba(155,27,48,0.1)', color: C.brandLight, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
            {t('services.tag')}
          </span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: C.white, marginBottom: 16 }}>
            {t('services.title')}
          </h2>
          <p className="reveal rv-d2" style={{ color: C.textMuted, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            {t('services.sub')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {services.map((s) => (
            <ServiceCard key={s.titleKey} icon={s.icon} title={t(s.titleKey as any)} desc={t(s.descKey as any)} />
          ))}
        </div>

        {/* Responsive fallback: on mobile show 1 col */}
        <style>{`
          @media (max-width: 900px) {
            #servicos [style*="grid-template-columns: repeat(3"] {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 600px) {
            #servicos [style*="grid-template-columns: repeat(3"],
            #servicos [style*="grid-template-columns: repeat(2"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </W>
    </Section>
  );
}

/* ═══════════════ METRICS ═══════════════ */
function Metrics({ t }: { t: (k: any) => string }) {
  const metrics = [
    { value: '1.6M+', label: t('metrics.data'), icon: BarChart3 },
    { value: '200+', label: t('metrics.auto'), icon: Clock },
    { value: '99.9%', label: t('metrics.uptime'), icon: Shield },
    { value: '< 7 dias', label: t('metrics.speed'), icon: TrendingUp },
  ];

  return (
    <Section alt style={{ padding: '96px 0' }}>
      <W>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 9999, background: 'rgba(212,165,116,0.1)', color: C.gold, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
            {t('metrics.tag')}
          </span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: C.white }}>
            {t('metrics.title')}
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {metrics.map((m) => (
            <div key={m.label} className="glass-card reveal" style={{ padding: 28, textAlign: 'center' }}>
              <m.icon size={26} style={{ color: C.gold, margin: '0 auto 16px' }} />
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: C.white, marginBottom: 8 }}>{m.value}</div>
              <div style={{ fontSize: 13, color: C.textDim }}>{m.label}</div>
            </div>
          ))}
        </div>

        <style>{`
          @media (max-width: 768px) {
            .section-alt [style*="grid-template-columns: repeat(4"] {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
        `}</style>
      </W>
    </Section>
  );
}

/* ═══════════════ PROCESS ═══════════════ */
function Process({ lang }: { lang: string }) {
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
    <Section style={{ padding: '96px 0' }}>
      <W>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 9999, background: 'rgba(155,27,48,0.1)', color: C.brandLight, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
            {lang === 'pt' ? 'Processo' : 'Process'}
          </span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: C.white }}>
            {lang === 'pt' ? 'Como trabalhamos' : 'How we work'}
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {steps.map((step, i) => (
            <div key={step.title} className="glass-card reveal" style={{ padding: 24, position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(155,27,48,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.brand, fontWeight: 700, fontSize: 14 }}>
                  {i + 1}
                </div>
                <step.icon size={18} style={{ color: C.brandLight }} />
              </div>
              <h3 style={{ color: C.white, fontWeight: 600, marginBottom: 8, fontSize: 16 }}>{step.title}</h3>
              <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>

        <style>{`
          @media (max-width: 768px) {
            section:not(.section-alt) [style*="grid-template-columns: repeat(4"] {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 500px) {
            section:not(.section-alt) [style*="grid-template-columns: repeat(4"],
            section:not(.section-alt) [style*="grid-template-columns: repeat(2"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </W>
    </Section>
  );
}

/* ═══════════════ ABOUT ═══════════════ */
function About({ t }: { t: (k: any) => string }) {
  const skills = [
    { icon: Database, label: 'Data Engineering' },
    { icon: Bot, label: 'AI & Automation' },
    { icon: Globe, label: 'Web Development' },
    { icon: MessageSquare, label: 'Chatbots & NLP' },
  ];

  return (
    <Section id="sobre" alt style={{ padding: '96px 0' }}>
      <W>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 9999, background: 'rgba(155,27,48,0.1)', color: C.brandLight, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
              {t('about.tag')}
            </span>
            <h2 className="reveal rv-d1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: C.white, marginBottom: 24 }}>
              {t('about.title')}
            </h2>
            <p className="reveal rv-d2" style={{ color: C.textMuted, lineHeight: 1.75, marginBottom: 16 }}>
              {t('about.p1')}
            </p>
            <p className="reveal rv-d3" style={{ color: C.textMuted, lineHeight: 1.75 }}>
              {t('about.p2')}
            </p>
          </div>

          <div className="reveal rv-d2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {skills.map((item) => (
              <div key={item.label} className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
                <item.icon size={28} style={{ color: C.brandLight, margin: '0 auto 12px' }} />
                <span style={{ fontSize: 14, color: '#cbd5e1', fontWeight: 500 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </W>
    </Section>
  );
}

/* ═══════════════ CASES (sem info técnica interna) ═══════════════ */
function Cases({ lang }: { lang: string }) {
  const cases = lang === 'pt' ? [
    {
      title: 'Inteligência de Mercado — Base Empresarial',
      desc: 'Extração e organização de mais de 1.6 milhão de registros empresariais para prospecção comercial. Dados de contato, sócios, atividade econômica e situação fiscal — tudo limpo e pronto para uso.',
      tags: ['Dados Públicos', 'Prospecção', 'Inteligência Comercial'],
      metric: '1.6M+ empresas mapeadas',
    },
    {
      title: 'Automação Inteligente para Escritório',
      desc: 'Sistema completo de prospecção automatizada, atendimento via WhatsApp com IA, gestão financeira automatizada e painel de acompanhamento em tempo real.',
      tags: ['Automação', 'WhatsApp', 'IA', 'Gestão'],
      metric: '70% menos trabalho manual',
    },
    {
      title: 'Presença Digital de Alto Impacto',
      desc: 'Sites institucionais e landing pages com design exclusivo, carregamento ultrarrápido e otimizados para aparecer no Google. Experiência premium em qualquer dispositivo.',
      tags: ['Design Exclusivo', 'Performance', 'SEO'],
      metric: 'Nota máxima em velocidade',
    },
  ] : [
    {
      title: 'Market Intelligence — Business Database',
      desc: 'Extraction and organization of over 1.6 million business records for commercial prospecting. Contact data, partners, economic activity and fiscal status — all clean and ready to use.',
      tags: ['Public Data', 'Prospecting', 'Business Intelligence'],
      metric: '1.6M+ companies mapped',
    },
    {
      title: 'Intelligent Office Automation',
      desc: 'Complete system with automated prospecting, AI-powered WhatsApp support, automated financial management and real-time monitoring dashboard.',
      tags: ['Automation', 'WhatsApp', 'AI', 'Management'],
      metric: '70% less manual work',
    },
    {
      title: 'High-Impact Digital Presence',
      desc: 'Institutional websites and landing pages with exclusive design, ultra-fast loading and optimized to rank on Google. Premium experience on any device.',
      tags: ['Exclusive Design', 'Performance', 'SEO'],
      metric: 'Top speed score',
    },
  ];

  return (
    <Section id="cases" style={{ padding: '96px 0' }}>
      <W>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 9999, background: 'rgba(155,27,48,0.1)', color: C.brandLight, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
            Portfolio
          </span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: C.white }}>
            Cases
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {cases.map((c) => (
            <div key={c.title} className="glass-card reveal" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
              <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 6, background: 'rgba(212,165,116,0.1)', color: C.gold, fontSize: 12, fontWeight: 600, marginBottom: 16, alignSelf: 'flex-start' }}>
                {c.metric}
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: C.white, marginBottom: 12 }}>{c.title}</h3>
              <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.7, marginBottom: 20, flex: 1 }}>{c.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {c.tags.map((tag) => (
                  <span key={tag} style={{ padding: '3px 10px', borderRadius: 9999, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', fontSize: 12, color: C.textDim, fontWeight: 500 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <style>{`
          @media (max-width: 900px) {
            #cases [style*="grid-template-columns: repeat(3"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </W>
    </Section>
  );
}

/* ═══════════════ CTA ═══════════════ */
function CtaSection({ t }: { t: (k: any) => string }) {
  return (
    <Section alt style={{ padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(155,27,48,0.04), transparent 50%, rgba(212,165,116,0.03))', pointerEvents: 'none' }} />
      <W style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <h2 className="reveal" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 700, color: C.white, marginBottom: 24 }}>
          {t('cta.title')}
        </h2>
        <p className="reveal rv-d1" style={{ color: C.textMuted, maxWidth: 500, margin: '0 auto 40px', fontSize: 18, lineHeight: 1.7 }}>
          {t('cta.sub')}
        </p>
        <a href="#contato" className="btn-cta anim-pulse-glow reveal rv-d2" style={{ padding: '16px 40px', fontSize: 18 }}>
          {t('cta.btn')}
          <ArrowRight size={18} />
        </a>
      </W>
    </Section>
  );
}

/* ═══════════════ CONTACT ═══════════════ */
function Contact({ lang }: { lang: string }) {
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const name = data.get('name');
    const msg = data.get('message');
    const phone = '5541987991419';
    const text = `Olá! Sou ${name}. ${msg}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    background: 'rgba(20,20,30,0.6)', border: `1px solid ${C.border}`,
    color: C.white, fontSize: 14, outline: 'none', transition: 'border-color 0.3s',
    fontFamily: 'inherit',
  };

  return (
    <Section id="contato" style={{ padding: '96px 0' }}>
      <W>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 48 }}>
          <div>
            <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 9999, background: 'rgba(155,27,48,0.1)', color: C.brandLight, fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
              {lang === 'pt' ? 'Contato' : 'Contact'}
            </span>
            <h2 className="reveal rv-d1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: C.white, marginBottom: 24 }}>
              {lang === 'pt' ? 'Vamos conversar' : "Let's talk"}
            </h2>
            <p className="reveal rv-d2" style={{ color: C.textMuted, lineHeight: 1.7, marginBottom: 32 }}>
              {lang === 'pt'
                ? 'Envie uma mensagem ou entre em contato diretamente. Respondemos em até 24 horas.'
                : 'Send a message or reach out directly. We respond within 24 hours.'}
            </p>

            <div className="reveal rv-d3" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: Phone, text: '+55 (41) 98799-1419', href: 'https://wa.me/5541987991419' },
                { icon: Mail, text: 'contato@glock.dev', href: 'mailto:contato@glock.dev' },
                { icon: MapPin, text: 'Curitiba, PR — Brasil', href: undefined },
              ].map((item) => {
                const content = (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.textMuted, fontSize: 14 }}>
                    <item.icon size={18} style={{ color: C.brand }} /> {item.text}
                  </span>
                );
                return item.href
                  ? <a key={item.text} href={item.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{content}</a>
                  : <div key={item.text}>{content}</div>;
              })}
            </div>

            <div className="reveal rv-d4" style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              {[
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Github, href: 'https://github.com/baronglock' },
              ].map((s, i) => (
                <a key={i} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="glass" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted, textDecoration: 'none', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = C.brand; e.currentTarget.style.borderColor = C.borderHover; }}
                  onMouseLeave={e => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.borderColor = 'rgba(155,27,48,0.15)'; }}
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="glass-card reveal rv-d2" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>
                {lang === 'pt' ? 'Nome' : 'Name'}
              </label>
              <input name="name" required style={inputStyle} placeholder={lang === 'pt' ? 'Seu nome' : 'Your name'}
                onFocus={e => e.currentTarget.style.borderColor = C.brand}
                onBlur={e => e.currentTarget.style.borderColor = C.border} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>Email</label>
              <input name="email" type="email" required style={inputStyle} placeholder={lang === 'pt' ? 'seu@email.com' : 'your@email.com'}
                onFocus={e => e.currentTarget.style.borderColor = C.brand}
                onBlur={e => e.currentTarget.style.borderColor = C.border} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>
                {lang === 'pt' ? 'Mensagem' : 'Message'}
              </label>
              <textarea name="message" rows={4} required style={{ ...inputStyle, resize: 'none' }} placeholder={lang === 'pt' ? 'Conte-nos sobre seu projeto...' : 'Tell us about your project...'}
                onFocus={e => e.currentTarget.style.borderColor = C.brand}
                onBlur={e => e.currentTarget.style.borderColor = C.border} />
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

/* ═══════════════ FOOTER ═══════════════ */
function Footer({ t, lang }: { t: (k: any) => string; lang: string }) {
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, padding: '48px 0', width: '100%' }}>
      <W>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 40 }}>
          <div>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: C.white }}>
              Glock<span style={{ color: C.brand }}>.</span>
            </span>
            <p style={{ fontSize: 13, color: C.textDim, marginTop: 12, lineHeight: 1.6 }}>
              {lang === 'pt' ? 'Automação, Dados e IA' : 'Automation, Data & AI'}
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('footer.services')}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[t('svc.data.title'), t('svc.auto.title'), t('svc.web.title'), t('svc.consult.title')].map((s) => (
                <li key={s}><a href="#servicos" style={{ fontSize: 14, color: C.textDim, textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.color = C.brand}
                  onMouseLeave={e => e.currentTarget.style.color = C.textDim}>{s}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('footer.company')}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><a href="#sobre" style={{ fontSize: 14, color: C.textDim, textDecoration: 'none' }}>{t('nav.about')}</a></li>
              <li><a href="#cases" style={{ fontSize: 14, color: C.textDim, textDecoration: 'none' }}>Cases</a></li>
              <li><a href="#contato" style={{ fontSize: 14, color: C.textDim, textDecoration: 'none' }}>{t('nav.contact')}</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('footer.contact')}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: C.textDim }}>
              <li>+55 (41) 98799-1419</li>
              <li>contato@glock.dev</li>
              <li>Curitiba, PR</li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 32, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <p style={{ fontSize: 12, color: '#475569' }}>
            &copy; {new Date().getFullYear()} Glock. {t('footer.rights')}
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            {[Instagram, Linkedin, Github].map((Icon, i) => (
              <a key={i} href={i === 2 ? 'https://github.com/baronglock' : '#'} target={i === 2 ? '_blank' : undefined} rel="noopener noreferrer"
                style={{ color: '#475569', transition: 'color 0.3s', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = C.brand}
                onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </W>
    </footer>
  );
}

/* ═══════════════ APP ═══════════════ */
export default function App() {
  const { lang, t, toggle } = useLanguage();

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif", width: '100%' }}>
      <Navbar t={t} lang={lang} toggle={toggle} />
      <Hero t={t} />
      <Services t={t} />
      <Metrics t={t} />
      <Process lang={lang} />
      <About t={t} />
      <Cases lang={lang} />
      <CtaSection t={t} />
      <Contact lang={lang} />
      <Footer t={t} lang={lang} />
    </div>
  );
}
