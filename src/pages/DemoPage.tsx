import { useParams, Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import {
  Phone, MapPin, Clock, Star, ArrowRight, ChevronRight,
  UtensilsCrossed, Stethoscope, Scissors, Dog, Dumbbell, Briefcase, Leaf, Shirt,
  Menu as MenuIcon, Instagram, Facebook, MessageCircle, CheckCircle2, Sparkles,
  Calendar, Users, Award, Heart,
} from 'lucide-react';
import { getDemo } from './demos';

/* ── Niche defaults ── */
interface NicheDefaults {
  icon: any;
  color: string;
  colorDark: string;
  sections: string[];
  features: { title: string; desc: string; icon: any }[];
  gallery: string[];
  ctaText: string;
  tagline: string;
}

const nicheDefaults: Record<string, NicheDefaults> = {
  restaurante: {
    icon: UtensilsCrossed, color: '#dc2626', colorDark: '#991b1b',
    sections: ['Cardápio', 'Sobre', 'Avaliações', 'Contato'],
    features: [
      { icon: UtensilsCrossed, title: 'Cardápio Digital', desc: 'Menu completo com fotos e preços atualizados em tempo real.' },
      { icon: Clock, title: 'Pedidos via WhatsApp', desc: 'Peça pelo WhatsApp com cardápio interativo e entrega rastreável.' },
      { icon: Star, title: 'Avaliações Google', desc: 'Reviews de clientes reais integrados diretamente no site.' },
      { icon: MapPin, title: 'Localização e Horários', desc: 'Mapa interativo, rotas e horários sempre atualizados.' },
    ],
    gallery: ['Pratos exclusivos', 'Ambiente aconchegante', 'Drinks artesanais', 'Delivery premium', 'Sobremesas', 'Salão VIP'],
    ctaText: 'Faça sua reserva', tagline: 'Sabor que conquista, experiência que encanta.',
  },
  clinica: {
    icon: Stethoscope, color: '#0ea5e9', colorDark: '#0369a1',
    sections: ['Especialidades', 'Equipe', 'Convênios', 'Agendar'],
    features: [
      { icon: Calendar, title: 'Agendamento Online', desc: 'Marque sua consulta online, 24h por dia, sem filas.' },
      { icon: Users, title: 'Equipe Especializada', desc: 'Profissionais com anos de experiência e formação de excelência.' },
      { icon: Award, title: 'Convênios Aceitos', desc: 'Atendemos os principais planos de saúde do mercado.' },
      { icon: Heart, title: 'Atendimento Humanizado', desc: 'Ambiente acolhedor e atendimento centrado no paciente.' },
    ],
    gallery: ['Consultórios modernos', 'Equipamentos de última geração', 'Sala de espera', 'Recepção', 'Área infantil', 'Estacionamento'],
    ctaText: 'Agendar consulta', tagline: 'Cuidado profissional com tecnologia de ponta.',
  },
  barbearia: {
    icon: Scissors, color: '#78716c', colorDark: '#44403c',
    sections: ['Serviços', 'Galeria', 'Equipe', 'Agendar'],
    features: [
      { icon: Scissors, title: 'Cortes Premium', desc: 'Do clássico ao moderno, cortes que definem seu estilo.' },
      { icon: Calendar, title: 'Agendamento Fácil', desc: 'Agende pelo WhatsApp ou pelo site em segundos.' },
      { icon: Star, title: 'Barba & Tratamentos', desc: 'Barba esculpida, hidratação, pigmentação e mais.' },
      { icon: Award, title: 'Ambiente Exclusivo', desc: 'Cerveja gelada, som ambiente e Wi-Fi grátis.' },
    ],
    gallery: ['Corte degradê', 'Barba alinhada', 'Nosso espaço', 'Produtos premium', 'Equipe', 'Happy hour'],
    ctaText: 'Agendar horário', tagline: 'Estilo, atitude e corte impecável.',
  },
  'pet-shop': {
    icon: Dog, color: '#f59e0b', colorDark: '#b45309',
    sections: ['Serviços', 'Galeria', 'Produtos', 'Contato'],
    features: [
      { icon: Heart, title: 'Banho & Tosa', desc: 'Banho relaxante, tosa higiênica e estética com carinho.' },
      { icon: Stethoscope, title: 'Veterinária', desc: 'Consultas, vacinas e exames com profissionais especializados.' },
      { icon: Star, title: 'Hotel Pet', desc: 'Hospedagem com câmeras ao vivo para você acompanhar.' },
      { icon: Award, title: 'Produtos Premium', desc: 'Rações, brinquedos e acessórios das melhores marcas.' },
    ],
    gallery: ['Banho relaxante', 'Tosa criativa', 'Nosso espaço', 'Hotel Pet', 'Área de lazer', 'Petiscos'],
    ctaText: 'Agendar banho', tagline: 'Seu pet merece o melhor cuidado.',
  },
  academia: {
    icon: Dumbbell, color: '#ef4444', colorDark: '#b91c1c',
    sections: ['Modalidades', 'Estrutura', 'Planos', 'Matrícula'],
    features: [
      { icon: Dumbbell, title: 'Musculação Completa', desc: 'Equipamentos de última geração e área ampla.' },
      { icon: Users, title: 'Aulas Coletivas', desc: 'CrossFit, spinning, yoga, funcional, dança e mais.' },
      { icon: Award, title: 'Personal Trainer', desc: 'Treinos personalizados com acompanhamento profissional.' },
      { icon: Heart, title: 'Avaliação Física', desc: 'Bioimpedância, teste de VO2 e planejamento individualizado.' },
    ],
    gallery: ['Sala de musculação', 'CrossFit box', 'Aulas coletivas', 'Vestiários', 'Área funcional', 'Recepção'],
    ctaText: 'Fazer matrícula', tagline: 'Supere seus limites. Transforme seu corpo.',
  },
  escritorio: {
    icon: Briefcase, color: '#2563eb', colorDark: '#1e40af',
    sections: ['Serviços', 'Equipe', 'Cases', 'Contato'],
    features: [
      { icon: Briefcase, title: 'Atendimento Personalizado', desc: 'Cada cliente é único. Soluções sob medida para seu caso.' },
      { icon: Users, title: 'Equipe Qualificada', desc: 'Profissionais com anos de experiência no mercado.' },
      { icon: Award, title: 'Resultados Comprovados', desc: 'Centenas de clientes satisfeitos e cases de sucesso.' },
      { icon: CheckCircle2, title: 'Tecnologia & Agilidade', desc: 'Processos digitais para mais eficiência e transparência.' },
    ],
    gallery: ['Nosso escritório', 'Sala de reuniões', 'Equipe', 'Atendimento', 'Eventos', 'Certificações'],
    ctaText: 'Falar com especialista', tagline: 'Soluções profissionais com excelência.',
  },
  moda: {
    icon: Shirt, color: '#7c3aed', colorDark: '#5b21b6',
    sections: ['Coleção', 'Sobre', 'Lookbook', 'Comprar'],
    features: [
      { icon: Shirt, title: 'Coleção Exclusiva', desc: 'Peças selecionadas com design atual e qualidade premium.' },
      { icon: Sparkles, title: 'Novidades Semanais', desc: 'Novas peças toda semana para você sempre estar na moda.' },
      { icon: Heart, title: 'Atendimento VIP', desc: 'Consultoria de estilo personalizada pelo WhatsApp.' },
      { icon: Award, title: 'Entrega Rápida', desc: 'Envio para todo Brasil com rastreamento em tempo real.' },
    ],
    gallery: ['Nova coleção', 'Streetwear', 'Acessórios', 'Lookbook', 'Bastidores', 'Desfiles'],
    ctaText: 'Ver coleção', tagline: 'Vista-se com estilo. Encontre sua identidade.',
  },
  'produtos-naturais': {
    icon: Leaf, color: '#16a34a', colorDark: '#15803d',
    sections: ['Produtos', 'Blog', 'Sobre', 'Comprar'],
    features: [
      { icon: Leaf, title: 'Produtos Naturais', desc: '100% naturais, orgânicos e sem conservantes artificiais.' },
      { icon: Heart, title: 'Saúde & Bem-estar', desc: 'Suplementos, chás, grãos e superalimentos para sua saúde.' },
      { icon: CheckCircle2, title: 'Qualidade Certificada', desc: 'Produtos com selo orgânico e certificação ANVISA.' },
      { icon: Award, title: 'Consultoria Nutricional', desc: 'Orientação personalizada para seus objetivos de saúde.' },
    ],
    gallery: ['Grãos & sementes', 'Chás naturais', 'Suplementos', 'Orgânicos', 'Nossa loja', 'Receitas'],
    ctaText: 'Ver produtos', tagline: 'Saúde e bem-estar com produtos naturais.',
  },
};


/* ── 404 Demo ── */
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

/* ── Main Component ── */
export function DemoPage() {
  const { slug } = useParams<{ slug: string }>();
  const ref = useRef<HTMLDivElement>(null);

  const demo = getDemo(slug || '');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    el.querySelectorAll('.reveal').forEach(c => obs.observe(c));
    return () => obs.disconnect();
  }, [demo]);

  if (!demo) return <DemoNotFound />;

  const nd = nicheDefaults[demo.nicho] || nicheDefaults.restaurante;
  const Icon = nd.icon;
  const color = demo.color || nd.color;
  const tagline = demo.tagline || nd.tagline;
  const ctaText = demo.ctaText || nd.ctaText;
  const sections = nd.sections;
  const features = demo.features
    ? demo.features.map((f, i) => ({ ...f, icon: nd.features[i]?.icon || Star }))
    : nd.features;
  const reviews = demo.reviews || [
    { name: 'Maria S.', text: 'Atendimento excelente! Super recomendo.', stars: 5 },
    { name: 'Carlos R.', text: 'Profissionais de altíssima qualidade. Voltarei com certeza.', stars: 5 },
    { name: 'Ana P.', text: 'Melhor experiência que já tive. Nota 10!', stars: 5 },
  ];
  const gallery = demo.fotos || nd.gallery.map(label => ({ url: '', label }));

  const whatsappMsg = encodeURIComponent(`Olá! Vi a demonstração do site para ${demo.nome} e tenho interesse em saber mais.`);
  const whatsappLink = `https://wa.me/5541987991419?text=${whatsappMsg}`;

  return (
    <div ref={ref} style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e2e8f0', fontFamily: "'Inter', system-ui, sans-serif", width: '100%' }}>

      {/* ═══ GLOCK BANNER ═══ */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(37,99,235,0.15)',
        padding: '8px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Sparkles size={14} style={{ color: '#60a5fa' }} />
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            Demo por{' '}
            <Link to="/" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Glock.</Link>
            {' '}— seu site pode ficar assim
          </span>
        </div>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 16px', background: '#2563eb', color: '#fff',
          fontSize: 12, fontWeight: 500, textDecoration: 'none',
          borderRadius: 4, transition: 'opacity 0.3s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Quero o meu <ArrowRight size={12} />
        </a>
      </div>

      {/* ═══ MOCK NAVBAR ═══ */}
      <nav style={{
        position: 'fixed', top: 36, left: 0, right: 0, zIndex: 90,
        background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {demo.logo ? (
              <img src={demo.logo} alt={demo.nome} style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} style={{ color }} />
              </div>
            )}
            <span style={{ fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>{demo.nome}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }} className="demo-nav-links">
            {sections.map(s => (
              <span key={s} style={{ fontSize: 13, color: '#94a3b8', cursor: 'default' }}>{s}</span>
            ))}
            <span style={{ padding: '8px 18px', background: color, color: '#fff', fontSize: 13, fontWeight: 500, borderRadius: 4, cursor: 'default' }}>
              {ctaText}
            </span>
          </div>
          <div className="demo-nav-burger" style={{ display: 'none' }}>
            <MenuIcon size={22} style={{ color: '#94a3b8' }} />
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        paddingTop: 96, position: 'relative', overflow: 'hidden',
      }}>
        {/* Hero bg image */}
        {demo.heroBg && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${demo.heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0.15,
          }} />
        )}
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 30% 20%, ${color}15 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, ${color}08 0%, transparent 50%)`,
        }} />
        <div style={{ position: 'absolute', left: 32, top: 160, width: 1, height: 200, background: `linear-gradient(to bottom, ${color}50, transparent)`, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', width: '100%', position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: 700 }}>
            {/* City badge */}
            <div className="anim-fade-up" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
              background: `${color}12`, border: `1px solid ${color}25`,
              fontSize: 12, color, marginBottom: 28,
            }}>
              <MapPin size={13} /> {demo.cidade}
              {demo.heroExtra && <><span style={{ opacity: 0.4 }}>|</span> {demo.heroExtra}</>}
            </div>

            <h1 className="anim-fade-up" style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 300,
              lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: 24,
              animationDelay: '0.15s',
            }}>
              <span style={{ color: '#fff' }}>Bem-vindo ao{' '}</span>
              <br />
              <span style={{ color, fontWeight: 500 }}>{demo.nome}</span>
            </h1>

            <p className="anim-fade-up" style={{
              fontSize: 18, color: '#94a3b8', lineHeight: 1.7, maxWidth: 520,
              marginBottom: 36, animationDelay: '0.3s',
            }}>
              {tagline}
            </p>

            <div className="anim-fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 48, animationDelay: '0.45s' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', background: color, color: '#fff',
                fontSize: 14, fontWeight: 500, borderRadius: 4, cursor: 'default',
              }}>
                {ctaText} <ArrowRight size={16} />
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0',
                fontSize: 14, fontWeight: 400, borderRadius: 4, cursor: 'default',
              }}>
                <Phone size={14} /> {demo.telefone}
              </span>
            </div>

            {/* Quick stats */}
            <div className="anim-fade-up" style={{
              display: 'flex', gap: 40, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)',
              animationDelay: '0.6s',
            }}>
              {[
                { v: '4.9', l: 'Google', icon: Star },
                { v: '500+', l: 'Clientes', icon: Users },
                { v: '5+', l: 'Anos', icon: Award },
              ].map(s => (
                <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <s.icon size={16} style={{ color }} />
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 500, color: '#fff' }}>{s.v}</div>
                    <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section style={{ padding: '100px 0', background: 'rgba(16,16,24,0.4)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{
              display: 'inline-block', padding: '4px 14px', fontSize: 11,
              letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500,
              color, background: `${color}10`, border: `1px solid ${color}20`, marginBottom: 20,
            }}>Diferenciais</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              Por que escolher o{' '}<span style={{ fontWeight: 500, color }}>{demo.nome}</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
            {features.map((f, i) => {
              const FIcon = f.icon;
              return (
                <div key={i} className="reveal" style={{
                  padding: 28, background: 'rgba(20,20,30,0.6)', border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${color}30`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <FIcon size={20} style={{ color }} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ GALLERY ═══ */}
      <section style={{ padding: '100px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{
              display: 'inline-block', padding: '4px 14px', fontSize: 11,
              letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500,
              color, background: `${color}10`, border: `1px solid ${color}20`, marginBottom: 20,
            }}>Galeria</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              Conheça nosso <span style={{ fontWeight: 500, color }}>espaço</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
            {gallery.map((item, i) => {
              const hasImage = typeof item === 'object' && item.url;
              const label = typeof item === 'object' ? item.label : item;
              const url = typeof item === 'object' ? item.url : '';
              return (
                <div key={i} className="reveal" style={{
                  aspectRatio: i < 2 ? '4/3' : '1',
                  background: hasImage ? undefined : `linear-gradient(135deg, ${color}08, ${color}15)`,
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', position: 'relative',
                  gridColumn: i === 0 ? 'span 2' : undefined,
                }}>
                  {hasImage ? (
                    <>
                      <img src={url} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 12px 10px', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                        <p style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>{label}</p>
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: 16 }}>
                      <Icon size={24} style={{ color: `${color}60`, marginBottom: 8 }} />
                      <p style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{label}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ REVIEWS ═══ */}
      <section style={{ padding: '100px 0', background: 'rgba(16,16,24,0.4)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{
              display: 'inline-block', padding: '4px 14px', fontSize: 11,
              letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500,
              color, background: `${color}10`, border: `1px solid ${color}20`, marginBottom: 20,
            }}>Avaliações</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              O que dizem nossos <span style={{ fontWeight: 500, color }}>clientes</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {reviews.map((r, i) => (
              <div key={i} className="reveal" style={{
                padding: 28, background: 'rgba(20,20,30,0.6)', border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {Array.from({ length: r.stars || 5 }).map((_, s) => <Star key={s} size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />)}
                </div>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>"{r.text}"</p>
                <p style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section style={{ padding: '100px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              Visite o <span style={{ fontWeight: 500, color }}>{demo.nome}</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {/* Map */}
            <div className="reveal" style={{
              aspectRatio: '16/10', background: 'rgba(20,20,30,0.8)',
              border: '1px solid rgba(255,255,255,0.06)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${color}05, ${color}10)` }} />
              <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
                <MapPin size={32} style={{ color, marginBottom: 12 }} />
                <p style={{ fontSize: 14, color: '#94a3b8' }}>{demo.cidade}, PR</p>
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Google Maps integrado</p>
              </div>
            </div>

            {/* Info */}
            <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: Phone, label: 'Telefone', value: demo.telefone },
                { icon: MapPin, label: 'Endereço', value: `${demo.cidade}, PR` },
                { icon: Clock, label: 'Horário', value: 'Seg-Sex: 8h-18h | Sáb: 8h-12h' },
                ...(demo.instagram ? [{ icon: Instagram, label: 'Instagram', value: `@${demo.instagram}` }] : []),
              ].map((c, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: 20,
                  background: 'rgba(20,20,30,0.6)', border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <c.icon size={18} style={{ color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>{c.label}</div>
                    <div style={{ fontSize: 14, color: '#e2e8f0' }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MOCK FOOTER ═══ */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '48px 0 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 32, marginBottom: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                {demo.logo ? (
                  <img src={demo.logo} alt="" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={15} style={{ color }} />
                  </div>
                )}
                <span style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{demo.nome}</span>
              </div>
              <p style={{ fontSize: 13, color: '#64748b', maxWidth: 260 }}>{tagline}</p>
            </div>
            <div style={{ display: 'flex', gap: 32 }}>
              <div>
                <h4 style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Navegação</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {sections.map(s => <span key={s} style={{ fontSize: 13, color: '#64748b', cursor: 'default' }}>{s}</span>)}
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Social</h4>
                <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                  {[Instagram, Facebook, MessageCircle].map((SIcon, i) => (
                    <SIcon key={i} size={16} style={{ color: '#64748b' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }}>
            <p style={{ fontSize: 12, color: '#475569' }}>&copy; {new Date().getFullYear()} {demo.nome}. Todos os direitos reservados.</p>
            <p style={{ fontSize: 12, color: '#475569' }}>{demo.cidade}, PR</p>
          </div>
        </div>
      </footer>

      {/* ═══ GLOCK CTA BOTTOM ═══ */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a1a, #0f0f1e)',
        borderTop: '1px solid rgba(37,99,235,0.2)',
        padding: '48px 24px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 900, fontSize: 20, letterSpacing: '-0.04em' }}>
              <span style={{ color: '#2563eb' }}>G</span>
              <span style={{ color: '#2563eb', fontWeight: 300 }}>lock</span>
              <span style={{ color: '#60a5fa' }}>.</span>
            </span>
          </div>
          <p style={{ fontSize: 22, fontWeight: 300, color: '#fff', marginBottom: 8, letterSpacing: '-0.02em' }}>
            Gostou desse site?
          </p>
          <p style={{ fontSize: 15, color: '#94a3b8', marginBottom: 32, lineHeight: 1.7 }}>
            Este é um <strong style={{ color: '#e2e8f0' }}>demo personalizado</strong> criado pela Glock.
            <br />Podemos fazer o site real do <strong style={{ color }}>{demo.nome}</strong> — com domínio próprio, SEO e tudo mais.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', background: '#2563eb', color: '#fff',
              fontSize: 14, fontWeight: 600, textDecoration: 'none',
              borderRadius: 9999, transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(37,99,235,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <MessageCircle size={16} /> Quero meu site
            </a>
            <Link to="/servicos/sites" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', border: '1px solid rgba(37,99,235,0.3)', color: '#60a5fa',
              fontSize: 14, fontWeight: 500, textDecoration: 'none',
              borderRadius: 9999, transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.3)'; e.currentTarget.style.color = '#60a5fa'; }}
            >
              Ver planos <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ═══ FLOATING WHATSAPP ═══ */}
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 90,
        width: 56, height: 56, borderRadius: '50%',
        background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37,211,102,0.4)', transition: 'transform 0.3s',
        textDecoration: 'none',
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageCircle size={24} style={{ color: '#fff' }} />
      </a>

      {/* ═══ RESPONSIVE CSS ═══ */}
      <style>{`
        @media(max-width:768px){
          .demo-nav-links{display:none!important;}
          .demo-nav-burger{display:flex!important;}
        }
      `}</style>
    </div>
  );
}
