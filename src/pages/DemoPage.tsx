import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { getDemo } from './demos';

/* ── Lazy-load niche templates ── */
import { RestaurantePremiumDemo } from './templates/RestauranteDemo';
import { BarbeariaPremiumDemo } from './templates/BarbeariaDemo';
import { ClinicaPremiumDemo } from './templates/ClinicaDemo';
import { AcademiaPremiumDemo } from './templates/AcademiaDemo';
import { PetShopPremiumDemo } from './templates/PetShopDemo';
import { EscritorioPremiumDemo } from './templates/EscritorioDemo';
import { LojaRoupasPremiumDemo } from './templates/LojaRoupasDemo';
import { ProdutosNaturaisPremiumDemo } from './templates/ProdutosNaturaisDemo';

const templateMap: Record<string, React.ComponentType<{ demoConfig?: any }>> = {
  restaurante: RestaurantePremiumDemo,
  barbearia: BarbeariaPremiumDemo,
  clinica: ClinicaPremiumDemo,
  academia: AcademiaPremiumDemo,
  'pet-shop': PetShopPremiumDemo,
  escritorio: EscritorioPremiumDemo,
  'loja-roupas': LojaRoupasPremiumDemo,
  moda: LojaRoupasPremiumDemo,
  'produtos-naturais': ProdutosNaturaisPremiumDemo,
};

/* ── 404 ── */
function DemoNotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <h1 style={{ fontSize: 48, fontWeight: 300, color: '#fff', marginBottom: 16 }}>Demo não encontrado</h1>
        <p style={{ color: '#94a3b8', marginBottom: 32 }}>Este link pode ter expirado ou o demo ainda não foi criado.</p>
        <Link to="/" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>← Voltar ao início</Link>
      </div>
    </div>
  );
}

/* ── Main ── */
export function DemoPage() {
  const { slug } = useParams<{ slug: string }>();
  const demo = getDemo(slug || '');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  if (!demo) return <DemoNotFound />;

  const Template = templateMap[demo.nicho];
  if (!Template) return <DemoNotFound />;

  return <Template demoConfig={demo} />;
}
