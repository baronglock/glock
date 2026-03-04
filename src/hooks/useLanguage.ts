import { useState, useCallback } from 'react';

export type Lang = 'pt' | 'en';

const translations = {
  // Nav
  'nav.services': { pt: 'Servi\u00e7os', en: 'Services' },
  'nav.about': { pt: 'Sobre', en: 'About' },
  'nav.cases': { pt: 'Cases', en: 'Cases' },
  'nav.contact': { pt: 'Contato', en: 'Contact' },

  // Hero
  'hero.tag': { pt: 'Automa\u00e7\u00e3o, Dados e IA', en: 'Automation, Data & AI' },
  'hero.title1': { pt: 'Transformamos dados', en: 'We turn data' },
  'hero.title2': { pt: 'em vantagem competitiva.', en: 'into competitive advantage.' },
  'hero.sub': {
    pt: 'Extra\u00e7\u00e3o de dados, automa\u00e7\u00e3o inteligente, sites de alta performance e consultoria em IA para empresas que querem liderar.',
    en: 'Data extraction, intelligent automation, high-performance websites and AI consulting for companies that want to lead.',
  },
  'hero.cta': { pt: 'Fale conosco', en: 'Get in touch' },
  'hero.cta2': { pt: 'Ver servi\u00e7os', en: 'View services' },

  // Services
  'services.tag': { pt: 'O que fazemos', en: 'What we do' },
  'services.title': { pt: 'Solu\u00e7\u00f5es sob medida', en: 'Tailored solutions' },
  'services.sub': {
    pt: 'Cada projeto \u00e9 \u00fanico. Combinamos tecnologia de ponta com estrat\u00e9gia de neg\u00f3cio.',
    en: 'Every project is unique. We combine cutting-edge technology with business strategy.',
  },

  // Service cards
  'svc.data.title': { pt: 'Extra\u00e7\u00e3o de Dados', en: 'Data Extraction' },
  'svc.data.desc': {
    pt: 'Coletamos e estruturamos dados de qualquer fonte: Receita Federal, Google Maps, LinkedIn, e-commerce, APIs p\u00fablicas. Base limpa, pronta para decis\u00f5es.',
    en: 'We collect and structure data from any source: government databases, Google Maps, LinkedIn, e-commerce, public APIs. Clean data, ready for decisions.',
  },
  'svc.auto.title': { pt: 'Automa\u00e7\u00e3o com IA', en: 'AI Automation' },
  'svc.auto.desc': {
    pt: 'Chatbots inteligentes, fluxos automatizados, OCR, integra\u00e7\u00f5es com WhatsApp, CRM e ERPs. Sua opera\u00e7\u00e3o no piloto autom\u00e1tico.',
    en: 'Smart chatbots, automated workflows, OCR, integrations with WhatsApp, CRM and ERPs. Your operation on autopilot.',
  },
  'svc.web.title': { pt: 'Sites Premium', en: 'Premium Websites' },
  'svc.web.desc': {
    pt: 'Sites institucionais e landing pages de alta performance. Design exclusivo, SEO otimizado, velocidade m\u00e1xima. Zero templates gen\u00e9ricos.',
    en: 'Institutional sites and high-performance landing pages. Exclusive design, optimized SEO, maximum speed. Zero generic templates.',
  },
  'svc.consult.title': { pt: 'Consultoria em IA', en: 'AI Consulting' },
  'svc.consult.desc': {
    pt: 'Diagn\u00f3stico de processos, identifica\u00e7\u00e3o de oportunidades de automa\u00e7\u00e3o e implementa\u00e7\u00e3o de solu\u00e7\u00f5es de intelig\u00eancia artificial sob medida.',
    en: 'Process diagnostics, automation opportunity identification, and implementation of tailored artificial intelligence solutions.',
  },

  // Metrics
  'metrics.tag': { pt: 'Resultados', en: 'Results' },
  'metrics.title': { pt: 'N\u00fameros que falam', en: 'Numbers that speak' },
  'metrics.data': { pt: 'Registros processados', en: 'Records processed' },
  'metrics.auto': { pt: 'Horas economizadas/m\u00eas', en: 'Hours saved/month' },
  'metrics.uptime': { pt: 'Uptime garantido', en: 'Guaranteed uptime' },
  'metrics.speed': { pt: 'Tempo de entrega', en: 'Delivery time' },

  // About
  'about.tag': { pt: 'Sobre', en: 'About' },
  'about.title': { pt: 'Tecnologia com prop\u00f3sito', en: 'Technology with purpose' },
  'about.p1': {
    pt: 'A Glock. nasceu da convic\u00e7\u00e3o de que tecnologia de ponta n\u00e3o precisa ser exclusividade de grandes corpora\u00e7\u00f5es. Combinamos intelig\u00eancia artificial, engenharia de dados e design de alta performance para entregar solu\u00e7\u00f5es que realmente transformam neg\u00f3cios.',
    en: 'Glock. was born from the conviction that cutting-edge technology shouldn\'t be exclusive to large corporations. We combine artificial intelligence, data engineering, and high-performance design to deliver solutions that truly transform businesses.',
  },
  'about.p2': {
    pt: 'Com experi\u00eancia em automa\u00e7\u00e3o de processos que geraram milh\u00f5es em economia para grandes empresas, trazemos o mesmo n\u00edvel de excel\u00eancia para o seu neg\u00f3cio.',
    en: 'With experience in process automation that generated millions in savings for large companies, we bring the same level of excellence to your business.',
  },

  // CTA Section
  'cta.title': { pt: 'Pronto para transformar seu neg\u00f3cio?', en: 'Ready to transform your business?' },
  'cta.sub': {
    pt: 'Conte-nos seu desafio. Vamos encontrar a solu\u00e7\u00e3o ideal juntos.',
    en: 'Tell us your challenge. Let\'s find the ideal solution together.',
  },
  'cta.btn': { pt: 'Iniciar conversa', en: 'Start conversation' },

  // Footer
  'footer.rights': { pt: 'Todos os direitos reservados.', en: 'All rights reserved.' },
  'footer.services': { pt: 'Servi\u00e7os', en: 'Services' },
  'footer.company': { pt: 'Empresa', en: 'Company' },
  'footer.contact': { pt: 'Contato', en: 'Contact' },
} as const;

type TranslationKey = keyof typeof translations;

export function useLanguage() {
  const [lang, setLang] = useState<Lang>('pt');

  const t = useCallback(
    (key: TranslationKey) => translations[key]?.[lang] ?? key,
    [lang]
  );

  const toggle = useCallback(() => {
    setLang((prev) => (prev === 'pt' ? 'en' : 'pt'));
  }, []);

  return { lang, t, toggle };
}
