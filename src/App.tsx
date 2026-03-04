import { useState, useEffect, useRef } from 'react';
import {
  Database, Bot, Globe, BrainCircuit, ChevronRight, ArrowRight,
  Menu, X, ExternalLink, Mail, Phone, MapPin, Instagram,
  Linkedin, Github, Zap, Shield, Clock, TrendingUp,
  BarChart3, Code2, MessageSquare, Search, FileSpreadsheet,
  Workflow, Languages
} from 'lucide-react';
import { useReveal } from './hooks/useReveal';
import { useLanguage } from './hooks/useLanguage';

/* ─── Wrapper with max-width ─── */
function W({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={className} style={{ maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto', paddingLeft: 24, paddingRight: 24, width: '100%', ...style }}>{children}</div>;
}

/* ─── Section with scroll reveal ─── */
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
          ...(scrolled ? { boxShadow: '0 4px 30px rgba(0,0,0,0.3)' } : { background: 'transparent' }),
        }}
      >
        <W>
          <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                Glock<span style={{ color: '#6366f1' }}>.</span>
              </span>
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: 32 }}>
              {links.map((l) => (
                <a key={l.href} href={l.href} style={{ fontSize: 14, color: '#94a3b8', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}>
                  {l.label}
                </a>
              ))}
              <button onClick={toggle} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500 }}>
                <Languages size={14} />
                {lang === 'pt' ? 'EN' : 'PT'}
              </button>
              <a href="#contato" className="btn-cta" style={{ padding: '8px 20px', fontSize: 14 }}>
                {t('hero.cta')}
              </a>
            </div>

            {/* Mobile */}
            <div className="flex md:hidden" style={{ alignItems: 'center', gap: 12 }}>
              <button onClick={toggle} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <Languages size={18} />
              </button>
              <button onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <Menu size={22} />
              </button>
            </div>
          </div>
        </W>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="drawer-overlay anim-fade-in" style={{ position: 'fixed', inset: 0, zIndex: 60 }} onClick={() => setOpen(false)}>
          <div className="drawer-panel anim-slide-right" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 280, padding: 24 }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <X size={22} />
            </button>
            <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 24 }}>
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
      <div style={{ position: 'absolute', top: '20%', left: '20%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(60px)' }} />

      <W className="anim-fade-up" style={{ paddingTop: 96, paddingBottom: 64, textAlign: 'center', position: 'relative', zIndex: 10 }}>
        {/* Tag */}
        <div>
          <span className="glass" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 9999, fontSize: 12, fontWeight: 500, color: '#818cf8', letterSpacing: '0.05em', marginBottom: 32 }}>
            <Zap size={12} />
            {t('hero.tag')}
          </span>
        </div>

        {/* Title */}
        <h1 className="anim-fade-up" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 24, marginTop: 24, animationDelay: '0.15s' }}>
          <span style={{ color: '#ffffff' }}>{t('hero.title1')}</span>
          <br />
          <span className="text-gradient">{t('hero.title2')}</span>
        </h1>

        {/* Subtitle */}
        <p className="anim-fade-up" style={{ maxWidth: 600, margin: '0 auto 40px', color: '#94a3b8', fontSize: 'clamp(1rem, 2vw, 1.125rem)', lineHeight: 1.7, animationDelay: '0.3s' }}>
          {t('hero.sub')}
        </p>

        {/* CTA buttons */}
        <div className="anim-fade-up" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 16, animationDelay: '0.45s' }}>
          <a href="#contato" className="btn-cta" style={{ padding: '14px 32px', fontSize: 16 }}>
            {t('hero.cta')}
            <ArrowRight size={16} />
          </a>
          <a href="#servicos" style={{
            padding: '14px 32px', borderRadius: 9999, border: '1px solid #334155', color: '#cbd5e1',
            fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none',
            transition: 'all 0.3s ease', fontSize: 16,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.color = '#cbd5e1'; }}
          >
            {t('hero.cta2')}
            <ChevronRight size={16} />
          </a>
        </div>

        {/* Tech badges */}
        <div className="anim-fade-up" style={{ marginTop: 64, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, animationDelay: '0.6s' }}>
          {['Python', 'React', 'Node.js', 'OpenAI', 'n8n', 'WhatsApp API'].map((tech) => (
            <span key={tech} style={{ padding: '4px 14px', borderRadius: 9999, background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(51,65,85,0.5)', fontSize: 12, color: '#64748b', fontWeight: 500 }}>
              {tech}
            </span>
          ))}
        </div>
      </W>

      {/* Bottom fade */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to top, #020617, transparent)', pointerEvents: 'none' }} />
    </section>
  );
}

/* ═══════════════ SERVICE CARD ═══════════════ */
function ServiceCard({ icon: Icon, title, desc, features }: {
  icon: any; title: string; desc: string; features: string[];
}) {
  return (
    <div className="glass-card reveal" style={{ padding: '28px 28px 24px' }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <Icon size={22} style={{ color: '#818cf8' }} />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 12 }}>{title}</h3>
      <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{desc}</p>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {features.map((f) => (
          <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#64748b' }}>
            <ChevronRight size={12} style={{ color: '#6366f1', marginTop: 3, flexShrink: 0 }} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ═══════════════ SERVICES ═══════════════ */
function Services({ t, lang }: { t: (k: any) => string; lang: string }) {
  const features = {
    data: lang === 'pt'
      ? ['Receita Federal / CNPJ', 'Google Maps & LinkedIn', 'E-commerce & Marketplaces', 'APIs públicas e privadas']
      : ['Government databases', 'Google Maps & LinkedIn', 'E-commerce & Marketplaces', 'Public & private APIs'],
    auto: lang === 'pt'
      ? ['Chatbots com IA (WhatsApp)', 'Fluxos n8n / Make', 'OCR e processamento de docs', 'Integrações CRM / ERP']
      : ['AI Chatbots (WhatsApp)', 'n8n / Make workflows', 'OCR & document processing', 'CRM / ERP integrations'],
    web: lang === 'pt'
      ? ['React + TypeScript', 'Performance 100/100', 'SEO otimizado', 'Design responsivo premium']
      : ['React + TypeScript', '100/100 Performance', 'Optimized SEO', 'Premium responsive design'],
    consult: lang === 'pt'
      ? ['Diagnóstico de processos', 'Roadmap de automação', 'Seleção de ferramentas', 'Treinamento de equipe']
      : ['Process diagnostics', 'Automation roadmap', 'Tool selection', 'Team training'],
  };

  return (
    <Section id="servicos" style={{ padding: '96px 0' }}>
      <W>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 9999, background: 'rgba(99,102,241,0.1)', color: '#818cf8', fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
            {t('services.tag')}
          </span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: '#fff', marginBottom: 16 }}>
            {t('services.title')}
          </h2>
          <p className="reveal rv-d2" style={{ color: '#94a3b8', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            {t('services.sub')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 20 }}>
          <ServiceCard icon={Database} title={t('svc.data.title')} desc={t('svc.data.desc')} features={features.data} />
          <ServiceCard icon={Bot} title={t('svc.auto.title')} desc={t('svc.auto.desc')} features={features.auto} />
          <ServiceCard icon={Globe} title={t('svc.web.title')} desc={t('svc.web.desc')} features={features.web} />
          <ServiceCard icon={BrainCircuit} title={t('svc.consult.title')} desc={t('svc.consult.desc')} features={features.consult} />
        </div>
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
          <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 9999, background: 'rgba(16,185,129,0.1)', color: '#34d399', fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
            {t('metrics.tag')}
          </span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: '#fff' }}>
            {t('metrics.title')}
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {metrics.map((m) => (
            <div key={m.label} className="glass-card reveal" style={{ padding: 28, textAlign: 'center' }}>
              <m.icon size={26} style={{ color: '#818cf8', margin: '0 auto 16px' }} />
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 700, color: '#fff', marginBottom: 8 }}>{m.value}</div>
              <div style={{ fontSize: 14, color: '#64748b' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </W>
    </Section>
  );
}

/* ═══════════════ PROCESS ═══════════════ */
function Process({ lang }: { lang: string }) {
  const steps = lang === 'pt' ? [
    { icon: Search, title: 'Discovery', desc: 'Entendemos seu negócio, desafios e objetivos.' },
    { icon: FileSpreadsheet, title: 'Proposta', desc: 'Apresentamos escopo, cronograma e investimento.' },
    { icon: Code2, title: 'Desenvolvimento', desc: 'Construímos com sprints semanais e entregas contínuas.' },
    { icon: Workflow, title: 'Entrega & Suporte', desc: 'Deploy, treinamento e manutenção contínua.' },
  ] : [
    { icon: Search, title: 'Discovery', desc: 'We understand your business, challenges and goals.' },
    { icon: FileSpreadsheet, title: 'Proposal', desc: 'We present scope, timeline and investment.' },
    { icon: Code2, title: 'Development', desc: 'We build with weekly sprints and continuous delivery.' },
    { icon: Workflow, title: 'Delivery & Support', desc: 'Deploy, training and ongoing maintenance.' },
  ];

  return (
    <Section style={{ padding: '96px 0' }}>
      <W>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 9999, background: 'rgba(99,102,241,0.1)', color: '#818cf8', fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
            {lang === 'pt' ? 'Processo' : 'Process'}
          </span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: '#fff' }}>
            {lang === 'pt' ? 'Como trabalhamos' : 'How we work'}
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {steps.map((step, i) => (
            <div key={step.title} className="glass-card reveal" style={{ padding: 24, position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', fontWeight: 700, fontSize: 14 }}>
                  {i + 1}
                </div>
                <step.icon size={18} style={{ color: '#818cf8' }} />
              </div>
              <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: 8, fontSize: 16 }}>{step.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
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
            <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 9999, background: 'rgba(99,102,241,0.1)', color: '#818cf8', fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
              {t('about.tag')}
            </span>
            <h2 className="reveal rv-d1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: '#fff', marginBottom: 24 }}>
              {t('about.title')}
            </h2>
            <p className="reveal rv-d2" style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: 16 }}>
              {t('about.p1')}
            </p>
            <p className="reveal rv-d3" style={{ color: '#94a3b8', lineHeight: 1.7 }}>
              {t('about.p2')}
            </p>
          </div>

          <div className="reveal rv-d2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {skills.map((item) => (
              <div key={item.label} className="glass-card" style={{ padding: 20, textAlign: 'center' }}>
                <item.icon size={28} style={{ color: '#818cf8', margin: '0 auto 12px' }} />
                <span style={{ fontSize: 14, color: '#cbd5e1', fontWeight: 500 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </W>
    </Section>
  );
}

/* ═══════════════ CASES ═══════════════ */
function Cases({ lang }: { lang: string }) {
  const cases = lang === 'pt' ? [
    {
      title: 'Base CNPJ — Região Metropolitana de Curitiba',
      desc: 'Extração e cruzamento de 1.6M+ registros da Receita Federal. Dados limpos com razão social, sócios, telefone, regime tributário e situação cadastral.',
      tags: ['Python', 'Data Engineering', 'Receita Federal'],
      metric: '1.6M+ registros',
    },
    {
      title: 'Automação Contábil com IA',
      desc: 'Sistema completo de prospecção, chatbot WhatsApp, BPO financeiro automatizado e dashboard em tempo real para escritório de contabilidade.',
      tags: ['n8n', 'WhatsApp API', 'React', 'OpenAI'],
      metric: '70% menos trabalho manual',
    },
    {
      title: 'Sites de Alta Performance',
      desc: 'Desenvolvimento de sites institucionais com design exclusivo, Lighthouse 100/100, SEO otimizado e deploy automático via Vercel.',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
      metric: '100/100 Lighthouse',
    },
  ] : [
    {
      title: 'CNPJ Database — Curitiba Metro Area',
      desc: 'Extraction and cross-referencing of 1.6M+ records from the Federal Revenue Service. Clean data with company name, partners, phone, tax regime and registration status.',
      tags: ['Python', 'Data Engineering', 'Gov Data'],
      metric: '1.6M+ records',
    },
    {
      title: 'AI-Powered Accounting Automation',
      desc: 'Complete system with prospecting, WhatsApp chatbot, automated financial BPO and real-time dashboard for an accounting firm.',
      tags: ['n8n', 'WhatsApp API', 'React', 'OpenAI'],
      metric: '70% less manual work',
    },
    {
      title: 'High-Performance Websites',
      desc: 'Institutional websites with exclusive design, Lighthouse 100/100, optimized SEO and automatic deploy via Vercel.',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
      metric: '100/100 Lighthouse',
    },
  ];

  return (
    <Section id="cases" style={{ padding: '96px 0' }}>
      <W>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 9999, background: 'rgba(99,102,241,0.1)', color: '#818cf8', fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
            Portfolio
          </span>
          <h2 className="reveal rv-d1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: '#fff' }}>
            Cases
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 20 }}>
          {cases.map((c) => (
            <div key={c.title} className="glass-card reveal" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
              <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 6, background: 'rgba(16,185,129,0.1)', color: '#34d399', fontSize: 12, fontWeight: 600, marginBottom: 16, alignSelf: 'flex-start' }}>
                {c.metric}
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 12 }}>{c.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, marginBottom: 20, flex: 1 }}>{c.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {c.tags.map((tag) => (
                  <span key={tag} style={{ padding: '3px 10px', borderRadius: 9999, background: 'rgba(30,41,59,0.8)', fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </W>
    </Section>
  );
}

/* ═══════════════ CTA ═══════════════ */
function CtaSection({ t }: { t: (k: any) => string }) {
  return (
    <Section alt style={{ padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(99,102,241,0.05), transparent 50%, rgba(16,185,129,0.04))', pointerEvents: 'none' }} />
      <W style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <h2 className="reveal" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 700, color: '#fff', marginBottom: 24 }}>
          {t('cta.title')}
        </h2>
        <p className="reveal rv-d1" style={{ color: '#94a3b8', maxWidth: 500, margin: '0 auto 40px', fontSize: 18, lineHeight: 1.7 }}>
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
    const phone = '5541999999999';
    const text = `Olá! Sou ${name}. ${msg}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(51,65,85,0.5)',
    color: '#fff', fontSize: 14, outline: 'none', transition: 'border-color 0.3s',
    fontFamily: 'inherit',
  };

  return (
    <Section id="contato" style={{ padding: '96px 0' }}>
      <W>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 48 }}>
          {/* Left info */}
          <div>
            <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 9999, background: 'rgba(99,102,241,0.1)', color: '#818cf8', fontSize: 12, fontWeight: 500, letterSpacing: '0.05em', marginBottom: 16 }}>
              {lang === 'pt' ? 'Contato' : 'Contact'}
            </span>
            <h2 className="reveal rv-d1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, color: '#fff', marginBottom: 24 }}>
              {lang === 'pt' ? 'Vamos conversar' : "Let's talk"}
            </h2>
            <p className="reveal rv-d2" style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: 32 }}>
              {lang === 'pt'
                ? 'Envie uma mensagem ou entre em contato diretamente. Respondemos em até 24 horas.'
                : 'Send a message or reach out directly. We respond within 24 hours.'}
            </p>

            <div className="reveal rv-d3" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: Mail, text: 'contato@glock.dev', href: 'mailto:contato@glock.dev' },
                { icon: Phone, text: '+55 (41) 99999-9999', href: 'tel:+5541999999999' },
                { icon: MapPin, text: 'Curitiba, PR — Brasil', href: undefined },
              ].map((item) => {
                const content = (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>
                    <item.icon size={18} style={{ color: '#6366f1' }} /> {item.text}
                  </span>
                );
                return item.href
                  ? <a key={item.text} href={item.href} style={{ textDecoration: 'none' }}>{content}</a>
                  : <div key={item.text}>{content}</div>;
              })}
            </div>

            <div className="reveal rv-d4" style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              {[
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Github, href: 'https://github.com/baronglock' },
              ].map((s) => (
                <a key={s.href} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="glass" style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', textDecoration: 'none', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#6366f1'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.12)'; }}
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="glass-card reveal rv-d2" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>
                {lang === 'pt' ? 'Nome' : 'Name'}
              </label>
              <input name="name" required style={inputStyle} placeholder={lang === 'pt' ? 'Seu nome' : 'Your name'}
                onFocus={e => e.currentTarget.style.borderColor = '#6366f1'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(51,65,85,0.5)'} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>Email</label>
              <input name="email" type="email" required style={inputStyle} placeholder={lang === 'pt' ? 'seu@email.com' : 'your@email.com'}
                onFocus={e => e.currentTarget.style.borderColor = '#6366f1'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(51,65,85,0.5)'} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>
                {lang === 'pt' ? 'Mensagem' : 'Message'}
              </label>
              <textarea name="message" rows={4} required style={{ ...inputStyle, resize: 'none' }} placeholder={lang === 'pt' ? 'Conte-nos sobre seu projeto...' : 'Tell us about your project...'}
                onFocus={e => e.currentTarget.style.borderColor = '#6366f1'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(51,65,85,0.5)'} />
            </div>
            <button type="submit" className="btn-cta" style={{ padding: '14px 24px', width: '100%', fontSize: 15 }}>
              {sent ? (lang === 'pt' ? 'Redirecionando...' : 'Redirecting...') : (lang === 'pt' ? 'Enviar mensagem' : 'Send message')}
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
    <footer style={{ borderTop: '1px solid rgba(30,41,59,0.5)', padding: '48px 0', width: '100%' }}>
      <W>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 40 }}>
          <div>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>
              Glock<span style={{ color: '#6366f1' }}>.</span>
            </span>
            <p style={{ fontSize: 14, color: '#64748b', marginTop: 12, lineHeight: 1.6 }}>
              {lang === 'pt' ? 'Automação, Dados e IA' : 'Automation, Data & AI'}
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: '#cbd5e1', marginBottom: 12 }}>{t('footer.services')}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[t('svc.data.title'), t('svc.auto.title'), t('svc.web.title'), t('svc.consult.title')].map((s) => (
                <li key={s}><a href="#servicos" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#6366f1'}
                  onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>{s}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: '#cbd5e1', marginBottom: 12 }}>{t('footer.company')}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><a href="#sobre" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>{t('nav.about')}</a></li>
              <li><a href="#cases" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>Cases</a></li>
              <li><a href="#contato" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none' }}>{t('nav.contact')}</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: '#cbd5e1', marginBottom: 12 }}>{t('footer.contact')}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: '#64748b' }}>
              <li>contato@glock.dev</li>
              <li>Curitiba, PR</li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(30,41,59,0.5)', paddingTop: 32, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <p style={{ fontSize: 12, color: '#475569' }}>
            &copy; {new Date().getFullYear()} Glock. {t('footer.rights')}
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            {[Instagram, Linkedin, Github].map((Icon, i) => (
              <a key={i} href={i === 2 ? 'https://github.com/baronglock' : '#'} target={i === 2 ? '_blank' : undefined} rel="noopener noreferrer"
                style={{ color: '#475569', transition: 'color 0.3s', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#6366f1'}
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
    <div style={{ minHeight: '100vh', background: '#020617', color: '#e2e8f0', fontFamily: "'Inter', system-ui, sans-serif", width: '100%' }}>
      <Navbar t={t} lang={lang} toggle={toggle} />
      <Hero t={t} />
      <Services t={t} lang={lang} />
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
