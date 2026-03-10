/* ── Demo configs ──
   Each entry = one personalized demo site.
   To add a new demo: add an entry here, deploy, send the link.
   URL: /demo/{slug}
*/

export interface DemoConfig {
  slug: string;
  nicho: 'restaurante' | 'clinica' | 'barbearia' | 'pet-shop' | 'academia' | 'escritorio' | 'moda' | 'produtos-naturais';
  nome: string;
  cidade: string;
  telefone: string;
  tagline: string;
  /* Brand colors — pick from the business's logo/Instagram */
  color: string;       // primary
  colorDark: string;   // darker shade
  /* Optional: logo URL (hosted image or Instagram profile pic) */
  logo?: string;
  /* Optional: hero background image URL */
  heroBg?: string;
  /* Optional: gallery photos (URLs) */
  fotos?: { url: string; label: string }[];
  /* Optional: custom features override */
  features?: { title: string; desc: string }[];
  /* Optional: real reviews */
  reviews?: { name: string; text: string; stars?: number }[];
  /* Optional: custom CTA text */
  ctaText?: string;
  /* Optional: Instagram handle (without @) */
  instagram?: string;
  /* Optional: extra info shown in hero */
  heroExtra?: string;
}

/* ══════════════════════════════════════
   ACTIVE DEMOS
   ══════════════════════════════════════ */

export const demos: DemoConfig[] = [
  // ── Example (remove after real ones are added) ──
  {
    slug: 'exemplo-pizzaria',
    nicho: 'restaurante',
    nome: 'Pizzaria Napolitana',
    cidade: 'Curitiba',
    telefone: '(41) 99999-1234',
    tagline: 'A verdadeira pizza napolitana em Curitiba.',
    color: '#dc2626',
    colorDark: '#991b1b',
    instagram: 'pizzarianapolitana',
    ctaText: 'Peça agora',
    heroExtra: 'Delivery • Salão • Retirada',
    reviews: [
      { name: 'João M.', text: 'Melhor pizza de Curitiba, sem dúvida! Massa perfeita.', stars: 5 },
      { name: 'Carla S.', text: 'Ambiente incrível e atendimento nota 10.', stars: 5 },
      { name: 'Pedro R.', text: 'Delivery rápido e pizza chegou quentinha. Recomendo!', stars: 5 },
    ],
  },
];

/* Helper: find demo by slug */
export function getDemo(slug: string): DemoConfig | undefined {
  return demos.find(d => d.slug === slug);
}
