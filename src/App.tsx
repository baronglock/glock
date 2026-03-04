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

/* ─── Intersection Observer for reveals ─── */
function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useReveal();
  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  );
}

/* ─── Navbar ─── */
function Navbar({ t, lang, toggle }: { t: (k: any) => string; lang: string; toggle: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#servicos', label: t('nav.services') },
    { href: '#sobre', label: t('nav.about') },
    { href: '#cases', label: t('nav.cases') },
    { href: '#contato', label: t('nav.contact') },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass shadow-lg shadow-black/20' : 'bg-transparent'}`}>
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight text-white">
              Glock<span className="text-accent">.</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-accent after:transition-all after:duration-300 hover:after:w-full">
                {l.label}
              </a>
            ))}
            <button onClick={toggle} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-accent transition-colors" title="Switch language">
              <Languages size={14} />
              <span className="uppercase text-xs font-medium">{lang === 'pt' ? 'EN' : 'PT'}</span>
            </button>
            <a href="#contato" className="btn-cta px-5 py-2 rounded-full text-sm font-medium text-white">
              {t('hero.cta')}
            </a>
          </div>

          <div className="flex md:hidden items-center gap-3">
            <button onClick={toggle} className="text-slate-400 hover:text-white transition-colors">
              <Languages size={18} />
            </button>
            <button onClick={() => setOpen(true)} className="text-slate-400 hover:text-white transition-colors">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] drawer-overlay animate-fade-in" onClick={() => setOpen(false)}>
          <div className="drawer-panel absolute right-0 top-0 bottom-0 w-72 p-6 animate-slide-right" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X size={22} />
            </button>
            <div className="mt-12 flex flex-col gap-6">
              {links.map((l, i) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className="text-lg text-slate-300 hover:text-white transition-colors"
                  style={{ animationDelay: `${i * 0.08}s` }}>
                  {l.label}
                </a>
              ))}
              <a href="#contato" onClick={() => setOpen(false)} className="btn-cta px-5 py-3 rounded-full text-center text-sm font-medium text-white mt-4">
                {t('hero.cta')}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Hero ─── */
function Hero({ t }: { t: (k: any) => string }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-grid overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 pt-24 pb-16 text-center relative z-10">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-accent-light tracking-wide mb-8">
            <Zap size={12} />
            {t('hero.tag')}
          </span>
        </div>

        <h1 className="animate-fade-up font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6" style={{ animationDelay: '0.15s' }}>
          <span className="text-white">{t('hero.title1')}</span>
          <br />
          <span className="text-gradient">{t('hero.title2')}</span>
        </h1>

        <p className="animate-fade-up max-w-[600px] mx-auto text-slate-400 text-base sm:text-lg leading-relaxed mb-10" style={{ animationDelay: '0.3s' }}>
          {t('hero.sub')}
        </p>

        <div className="animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: '0.45s' }}>
          <a href="#contato" className="btn-cta px-8 py-3.5 rounded-full text-white font-semibold flex items-center gap-2">
            {t('hero.cta')}
            <ArrowRight size={16} />
          </a>
          <a href="#servicos" className="px-8 py-3.5 rounded-full border border-slate-700 text-slate-300 hover:border-accent hover:text-white transition-all duration-300 font-medium flex items-center gap-2">
            {t('hero.cta2')}
            <ChevronRight size={16} />
          </a>
        </div>

        {/* Floating tech badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-3 animate-fade-up" style={{ animationDelay: '0.6s' }}>
          {['Python', 'React', 'Node.js', 'OpenAI', 'n8n', 'WhatsApp API'].map((tech) => (
            <span key={tech} className="px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-xs text-slate-500 font-medium">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
}

/* ─── Service Card ─── */
function ServiceCard({ icon: Icon, title, desc, features, delay }: {
  icon: any; title: string; desc: string; features: string[]; delay: number;
}) {
  return (
    <div className={`reveal reveal-delay-${delay} bento-card glass-light rounded-2xl p-6 sm:p-8 group cursor-default`}>
      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors duration-300">
        <Icon size={22} className="text-accent-light" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-5">{desc}</p>
      <ul className="space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-slate-500">
            <ChevronRight size={12} className="text-accent mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Services Section ─── */
function Services({ t, lang }: { t: (k: any) => string; lang: string }) {
  const features = {
    data: lang === 'pt'
      ? ['Receita Federal / CNPJ', 'Google Maps & LinkedIn', 'E-commerce & Marketplaces', 'APIs p\u00fablicas e privadas']
      : ['Government databases', 'Google Maps & LinkedIn', 'E-commerce & Marketplaces', 'Public & private APIs'],
    auto: lang === 'pt'
      ? ['Chatbots com IA (WhatsApp)', 'Fluxos n8n / Make', 'OCR e processamento de docs', 'Integra\u00e7\u00f5es CRM / ERP']
      : ['AI Chatbots (WhatsApp)', 'n8n / Make workflows', 'OCR & document processing', 'CRM / ERP integrations'],
    web: lang === 'pt'
      ? ['React + TypeScript', 'Performance 100/100', 'SEO otimizado', 'Design responsivo premium']
      : ['React + TypeScript', '100/100 Performance', 'Optimized SEO', 'Premium responsive design'],
    consult: lang === 'pt'
      ? ['Diagn\u00f3stico de processos', 'Roadmap de automa\u00e7\u00e3o', 'Sele\u00e7\u00e3o de ferramentas', 'Treinamento de equipe']
      : ['Process diagnostics', 'Automation roadmap', 'Tool selection', 'Team training'],
  };

  return (
    <Section id="servicos" className="py-24 sm:py-32 relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="reveal inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium tracking-wide mb-4">
            {t('services.tag')}
          </span>
          <h2 className="reveal reveal-delay-1 font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('services.title')}
          </h2>
          <p className="reveal reveal-delay-2 text-slate-400 max-w-[500px] mx-auto">
            {t('services.sub')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <ServiceCard icon={Database} title={t('svc.data.title')} desc={t('svc.data.desc')} features={features.data} delay={1} />
          <ServiceCard icon={Bot} title={t('svc.auto.title')} desc={t('svc.auto.desc')} features={features.auto} delay={2} />
          <ServiceCard icon={Globe} title={t('svc.web.title')} desc={t('svc.web.desc')} features={features.web} delay={3} />
          <ServiceCard icon={BrainCircuit} title={t('svc.consult.title')} desc={t('svc.consult.desc')} features={features.consult} delay={4} />
        </div>
      </div>
    </Section>
  );
}

/* ─── Metrics (Bento Grid) ─── */
function Metrics({ t }: { t: (k: any) => string }) {
  const metrics = [
    { value: '1.6M+', label: t('metrics.data'), icon: BarChart3 },
    { value: '200+', label: t('metrics.auto'), icon: Clock },
    { value: '99.9%', label: t('metrics.uptime'), icon: Shield },
    { value: '< 7d', label: t('metrics.speed'), icon: TrendingUp },
  ];

  return (
    <Section className="py-24 sm:py-32 relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="reveal inline-block px-3 py-1 rounded-full bg-emerald/10 text-emerald text-xs font-medium tracking-wide mb-4">
            {t('metrics.tag')}
          </span>
          <h2 className="reveal reveal-delay-1 font-display text-3xl sm:text-4xl font-bold text-white">
            {t('metrics.title')}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((m, i) => (
            <div key={m.label} className={`reveal reveal-delay-${i + 1} glass-light rounded-2xl p-6 text-center group bento-card`}>
              <m.icon size={24} className="text-accent-light mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2 font-display">{m.value}</div>
              <div className="text-sm text-slate-500">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── Process / How we work ─── */
function Process({ lang }: { lang: string }) {
  const steps = lang === 'pt' ? [
    { icon: Search, title: 'Discovery', desc: 'Entendemos seu neg\u00f3cio, desafios e objetivos.' },
    { icon: FileSpreadsheet, title: 'Proposta', desc: 'Apresentamos escopo, cronograma e investimento.' },
    { icon: Code2, title: 'Desenvolvimento', desc: 'Constru\u00edmos com sprints semanais e entregas cont\u00ednuas.' },
    { icon: Workflow, title: 'Entrega & Suporte', desc: 'Deploy, treinamento e manuten\u00e7\u00e3o cont\u00ednua.' },
  ] : [
    { icon: Search, title: 'Discovery', desc: 'We understand your business, challenges and goals.' },
    { icon: FileSpreadsheet, title: 'Proposal', desc: 'We present scope, timeline and investment.' },
    { icon: Code2, title: 'Development', desc: 'We build with weekly sprints and continuous delivery.' },
    { icon: Workflow, title: 'Delivery & Support', desc: 'Deploy, training and ongoing maintenance.' },
  ];

  return (
    <Section className="py-24 sm:py-32 bg-slate-900/30">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="reveal inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium tracking-wide mb-4">
            {lang === 'pt' ? 'Processo' : 'Process'}
          </span>
          <h2 className="reveal reveal-delay-1 font-display text-3xl sm:text-4xl font-bold text-white">
            {lang === 'pt' ? 'Como trabalhamos' : 'How we work'}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.title} className={`reveal reveal-delay-${i + 1} relative`}>
              <div className="glass-light rounded-2xl p-6 h-full bento-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                    {i + 1}
                  </div>
                  <step.icon size={18} className="text-accent-light" />
                </div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
              {i < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ChevronRight size={16} className="text-slate-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── About ─── */
function About({ t }: { t: (k: any) => string }) {
  return (
    <Section id="sobre" className="py-24 sm:py-32 relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="reveal inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium tracking-wide mb-4">
              {t('about.tag')}
            </span>
            <h2 className="reveal reveal-delay-1 font-display text-3xl sm:text-4xl font-bold text-white mb-6">
              {t('about.title')}
            </h2>
            <p className="reveal reveal-delay-2 text-slate-400 leading-relaxed mb-4">
              {t('about.p1')}
            </p>
            <p className="reveal reveal-delay-3 text-slate-400 leading-relaxed">
              {t('about.p2')}
            </p>
          </div>

          <div className="reveal reveal-delay-2 grid grid-cols-2 gap-4">
            {[
              { icon: Database, label: 'Data Engineering' },
              { icon: Bot, label: 'AI & Automation' },
              { icon: Globe, label: 'Web Development' },
              { icon: MessageSquare, label: 'Chatbots & NLP' },
            ].map((item) => (
              <div key={item.label} className="glass-light rounded-xl p-5 text-center bento-card">
                <item.icon size={28} className="text-accent-light mx-auto mb-3" />
                <span className="text-sm text-slate-300 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─── Cases / Portfolio ─── */
function Cases({ lang }: { lang: string }) {
  const cases = lang === 'pt' ? [
    {
      title: 'Base CNPJ \u2014 Regi\u00e3o Metropolitana de Curitiba',
      desc: 'Extra\u00e7\u00e3o e cruzamento de 1.6M+ registros da Receita Federal. Dados limpos com raz\u00e3o social, s\u00f3cios, telefone, regime tribut\u00e1rio e situa\u00e7\u00e3o cadastral.',
      tags: ['Python', 'Data Engineering', 'Receita Federal'],
      metric: '1.6M+ registros',
    },
    {
      title: 'Automa\u00e7\u00e3o Cont\u00e1bil com IA',
      desc: 'Sistema completo de prospec\u00e7\u00e3o, chatbot WhatsApp, BPO financeiro automatizado e dashboard em tempo real para escrit\u00f3rio de contabilidade.',
      tags: ['n8n', 'WhatsApp API', 'React', 'OpenAI'],
      metric: '70% menos trabalho manual',
    },
    {
      title: 'Sites de Alta Performance',
      desc: 'Desenvolvimento de sites institucionais com design exclusivo, Lighthouse 100/100, SEO otimizado e deploy autom\u00e1tico via Vercel.',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
      metric: '100/100 Lighthouse',
    },
  ] : [
    {
      title: 'CNPJ Database \u2014 Curitiba Metro Area',
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
    <Section id="cases" className="py-24 sm:py-32 bg-slate-900/30">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <span className="reveal inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium tracking-wide mb-4">
            {lang === 'pt' ? 'Portfolio' : 'Portfolio'}
          </span>
          <h2 className="reveal reveal-delay-1 font-display text-3xl sm:text-4xl font-bold text-white">
            Cases
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {cases.map((c, i) => (
            <div key={c.title} className={`reveal reveal-delay-${i + 1} glass-light rounded-2xl p-6 sm:p-8 bento-card flex flex-col`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-0.5 rounded-md bg-emerald/10 text-emerald text-xs font-semibold">
                  {c.metric}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{c.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-5 flex-1">{c.desc}</p>
              <div className="flex flex-wrap gap-2">
                {c.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-800/80 text-xs text-slate-500 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── CTA Section ─── */
function CtaSection({ t }: { t: (k: any) => string }) {
  return (
    <Section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-emerald/5 pointer-events-none" />
      <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
        <h2 className="reveal font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          {t('cta.title')}
        </h2>
        <p className="reveal reveal-delay-1 text-slate-400 max-w-[500px] mx-auto text-lg mb-10">
          {t('cta.sub')}
        </p>
        <a href="#contato" className="reveal reveal-delay-2 btn-cta inline-flex items-center gap-2 px-10 py-4 rounded-full text-white font-semibold text-lg animate-pulse-glow">
          {t('cta.btn')}
          <ArrowRight size={18} />
        </a>
      </div>
    </Section>
  );
}

/* ─── Contact ─── */
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
    const phone = '5541999999999'; // placeholder
    const text = `Ol\u00e1! Sou ${name}. ${msg}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <Section id="contato" className="py-24 sm:py-32 bg-slate-900/30">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <span className="reveal inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium tracking-wide mb-4">
              {lang === 'pt' ? 'Contato' : 'Contact'}
            </span>
            <h2 className="reveal reveal-delay-1 font-display text-3xl sm:text-4xl font-bold text-white mb-6">
              {lang === 'pt' ? 'Vamos conversar' : "Let's talk"}
            </h2>
            <p className="reveal reveal-delay-2 text-slate-400 leading-relaxed mb-8">
              {lang === 'pt'
                ? 'Envie uma mensagem ou entre em contato diretamente. Respondemos em at\u00e9 24 horas.'
                : 'Send a message or reach out directly. We respond within 24 hours.'}
            </p>

            <div className="reveal reveal-delay-3 space-y-4">
              <a href="mailto:contato@glock.dev" className="flex items-center gap-3 text-slate-400 hover:text-accent transition-colors">
                <Mail size={18} /> contato@glock.dev
              </a>
              <a href="tel:+5541999999999" className="flex items-center gap-3 text-slate-400 hover:text-accent transition-colors">
                <Phone size={18} /> +55 (41) 99999-9999
              </a>
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin size={18} /> Curitiba, PR \u2014 Brasil
              </div>
            </div>

            <div className="reveal reveal-delay-4 flex gap-4 mt-8">
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-400 hover:text-accent hover:border-accent/30 transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-400 hover:text-accent hover:border-accent/30 transition-all">
                <Linkedin size={18} />
              </a>
              <a href="https://github.com/baronglock" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-400 hover:text-accent hover:border-accent/30 transition-all">
                <Github size={18} />
              </a>
            </div>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="reveal reveal-delay-2 glass-light rounded-2xl p-6 sm:p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                {lang === 'pt' ? 'Nome' : 'Name'}
              </label>
              <input name="name" required className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-accent focus:outline-none transition-colors text-sm" placeholder={lang === 'pt' ? 'Seu nome' : 'Your name'} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-accent focus:outline-none transition-colors text-sm" placeholder={lang === 'pt' ? 'seu@email.com' : 'your@email.com'} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                {lang === 'pt' ? 'Mensagem' : 'Message'}
              </label>
              <textarea name="message" rows={4} required className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-600 focus:border-accent focus:outline-none transition-colors text-sm resize-none" placeholder={lang === 'pt' ? 'Conte-nos sobre seu projeto...' : 'Tell us about your project...'} />
            </div>
            <button type="submit" className="btn-cta w-full px-6 py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2">
              {sent
                ? (lang === 'pt' ? 'Redirecionando...' : 'Redirecting...')
                : (lang === 'pt' ? 'Enviar mensagem' : 'Send message')}
              {!sent && <ExternalLink size={16} />}
            </button>
          </form>
        </div>
      </div>
    </Section>
  );
}

/* ─── Footer ─── */
function Footer({ t, lang }: { t: (k: any) => string; lang: string }) {
  return (
    <footer className="border-t border-slate-800/50 py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <span className="text-xl font-bold text-white">Glock<span className="text-accent">.</span></span>
            <p className="text-sm text-slate-500 mt-3 leading-relaxed">
              {lang === 'pt' ? 'Automa\u00e7\u00e3o, Dados e IA' : 'Automation, Data & AI'}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3">{t('footer.services')}</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#servicos" className="hover:text-accent transition-colors">{t('svc.data.title')}</a></li>
              <li><a href="#servicos" className="hover:text-accent transition-colors">{t('svc.auto.title')}</a></li>
              <li><a href="#servicos" className="hover:text-accent transition-colors">{t('svc.web.title')}</a></li>
              <li><a href="#servicos" className="hover:text-accent transition-colors">{t('svc.consult.title')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3">{t('footer.company')}</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#sobre" className="hover:text-accent transition-colors">{t('nav.about')}</a></li>
              <li><a href="#cases" className="hover:text-accent transition-colors">Cases</a></li>
              <li><a href="#contato" className="hover:text-accent transition-colors">{t('nav.contact')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3">{t('footer.contact')}</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>contato@glock.dev</li>
              <li>Curitiba, PR</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Glock. {t('footer.rights')}
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-600 hover:text-accent transition-colors"><Instagram size={16} /></a>
            <a href="#" className="text-slate-600 hover:text-accent transition-colors"><Linkedin size={16} /></a>
            <a href="https://github.com/baronglock" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-accent transition-colors"><Github size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── App ─── */
export default function App() {
  const { lang, t, toggle } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
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
