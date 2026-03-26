import { useState, useCallback, useContext, createContext } from 'react';

export type Lang = 'pt' | 'en';

const STORAGE_KEY = 'stauf-lang';

const translations = {
  // Nav
  'nav.services': { pt: 'Serviços', en: 'Services' },
  'nav.about': { pt: 'Sobre', en: 'About' },
  'nav.cases': { pt: 'Cases', en: 'Cases' },
  'nav.contact': { pt: 'Contato', en: 'Contact' },

  // Hero
  'hero.title1': { pt: 'Seu negócio no piloto automático.', en: 'Your business on autopilot.' },
  'hero.title2': { pt: 'IA que trabalha pra você.', en: 'AI that works for you.' },
  'hero.sub': {
    pt: 'Sites, automações, chatbots e sistemas sob medida. A IA cuida do operacional — você foca no que importa.',
    en: 'Websites, automations, chatbots and custom systems. AI handles the operations — you focus on what matters.',
  },
  'hero.cta': { pt: 'Fale conosco', en: 'Get in touch' },
  'hero.cta2': { pt: 'Ver serviços', en: 'View services' },

  // Services
  'services.tag': { pt: 'O que fazemos', en: 'What we do' },
  'services.title': { pt: 'Soluções completas para seu negócio', en: 'Complete solutions for your business' },
  'services.sub': {
    pt: 'Cada projeto é único. Combinamos tecnologia de ponta com estratégia de negócio para entregar resultados reais.',
    en: 'Every project is unique. We combine cutting-edge technology with business strategy to deliver real results.',
  },

  // Service cards
  'svc.data.title': { pt: 'Extração de Dados', en: 'Data Extraction' },
  'svc.data.desc': {
    pt: 'Coletamos e estruturamos dados de qualquer fonte pública ou privada. Bases limpas e organizadas, prontas para tomada de decisão.',
    en: 'We collect and structure data from any public or private source. Clean, organized databases ready for decision-making.',
  },
  'svc.auto.title': { pt: 'Automação de Processos', en: 'Process Automation' },
  'svc.auto.desc': {
    pt: 'Automatizamos tarefas repetitivas e fluxos de trabalho inteiros. Menos trabalho manual, mais eficiência operacional.',
    en: 'We automate repetitive tasks and entire workflows. Less manual work, more operational efficiency.',
  },
  'svc.chat.title': { pt: 'Chatbots Inteligentes', en: 'Smart Chatbots' },
  'svc.chat.desc': {
    pt: 'Assistentes virtuais com IA para WhatsApp, sites e redes sociais. Atendimento 24h que entende e resolve.',
    en: 'AI-powered virtual assistants for WhatsApp, websites and social media. 24/7 support that understands and resolves.',
  },
  'svc.web.title': { pt: 'Sites & Landing Pages', en: 'Websites & Landing Pages' },
  'svc.web.desc': {
    pt: 'Sites institucionais e landing pages com design exclusivo, velocidade máxima e otimizados para conversão.',
    en: 'Institutional sites and landing pages with exclusive design, maximum speed and optimized for conversion.',
  },
  'svc.bi.title': { pt: 'Dashboards & BI', en: 'Dashboards & BI' },
  'svc.bi.desc': {
    pt: 'Painéis visuais em tempo real para acompanhar métricas, vendas, operações e KPIs do seu negócio.',
    en: 'Real-time visual panels to track metrics, sales, operations and KPIs of your business.',
  },
  'svc.consult.title': { pt: 'Consultoria em IA', en: 'AI Consulting' },
  'svc.consult.desc': {
    pt: 'Diagnóstico de processos e implementação de soluções de inteligência artificial personalizadas para sua operação.',
    en: 'Process diagnostics and implementation of customized artificial intelligence solutions for your operation.',
  },
  'svc.security.title': { pt: 'Segurança Mobile', en: 'Mobile Security' },
  'svc.security.desc': {
    pt: 'KillSpy — app próprio que detecta e elimina espionagem no celular. Protege microfone, câmera e dados em tempo real.',
    en: 'KillSpy — proprietary app that detects and eliminates phone spyware. Protects microphone, camera and data in real time.',
  },

  // Metrics
  'metrics.tag': { pt: 'Resultados', en: 'Results' },
  'metrics.title': { pt: 'Números que falam', en: 'Numbers that speak' },
  'metrics.data': { pt: 'Registros processados', en: 'Records processed' },
  'metrics.auto': { pt: 'Horas economizadas/mês', en: 'Hours saved/month' },
  'metrics.uptime': { pt: 'Uptime garantido', en: 'Guaranteed uptime' },
  'metrics.speed': { pt: 'Tempo de entrega', en: 'Delivery time' },

  // About
  'about.tag': { pt: 'Sobre', en: 'About' },
  'about.title': { pt: 'Tecnologia com propósito', en: 'Technology with purpose' },
  'about.p1': {
    pt: 'A Stauf. nasceu da convicção de que tecnologia de ponta não precisa ser exclusividade de grandes corporações. Combinamos inteligência artificial, engenharia de dados e design de alta performance para entregar soluções que realmente transformam negócios.',
    en: 'Stauf. was born from the conviction that cutting-edge technology shouldn\'t be exclusive to large corporations. We combine artificial intelligence, data engineering, and high-performance design to deliver solutions that truly transform businesses.',
  },
  'about.p2': {
    pt: 'Com experiência em automação de processos que geraram milhões em economia para grandes empresas, trazemos o mesmo nível de excelência para o seu negócio — independente do tamanho.',
    en: 'With experience in process automation that generated millions in savings for large companies, we bring the same level of excellence to your business — regardless of size.',
  },

  // CTA Section
  'cta.title': { pt: 'Pronto para transformar seu negócio?', en: 'Ready to transform your business?' },
  'cta.sub': {
    pt: 'Conte-nos seu desafio. Vamos encontrar a solução ideal juntos.',
    en: 'Tell us your challenge. Let\'s find the ideal solution together.',
  },
  'cta.btn': { pt: 'Iniciar conversa', en: 'Start conversation' },

  // Footer
  'footer.rights': { pt: 'Todos os direitos reservados.', en: 'All rights reserved.' },
  'footer.services': { pt: 'Serviços', en: 'Services' },
  'footer.company': { pt: 'Empresa', en: 'Company' },
  'footer.contact': { pt: 'Contato', en: 'Contact' },
} as const;

type TranslationKey = keyof typeof translations;

function getStoredLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'en' || v === 'pt') return v;
  } catch {}
  return 'pt';
}

/* ── Context (single source of truth for entire app) ── */
const LangContext = createContext<{
  lang: Lang;
  t: (key: TranslationKey) => string;
  toggle: () => void;
} | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(getStoredLang);

  const t = useCallback(
    (key: TranslationKey) => translations[key]?.[lang] ?? key,
    [lang]
  );

  const toggle = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === 'pt' ? 'en' : 'pt';
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      return next;
    });
  }, []);

  return (
    <LangContext.Provider value={{ lang, t, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LangContext);
  if (ctx) return ctx;

  /* Fallback (should never happen if LanguageProvider wraps the app) */
  const [lang, setLang] = useState<Lang>(getStoredLang);
  const t = useCallback(
    (key: TranslationKey) => translations[key]?.[lang] ?? key,
    [lang]
  );
  const toggle = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === 'pt' ? 'en' : 'pt';
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      return next;
    });
  }, []);
  return { lang, t, toggle };
}
