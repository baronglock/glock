import {
  ArrowRight, CheckCircle2, Globe, Zap,
  UtensilsCrossed, Leaf, Stethoscope, Scissors, Shirt, Dog, Dumbbell, Briefcase,
} from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';

/* ── Data ── */
const nichos = [
  { icon: UtensilsCrossed, nome: 'Restaurantes & Delivery', desc: 'Cardápios digitais, pedidos via WhatsApp, fotos que abrem o apetite.', tags: ['Pizzaria', 'Hamburgueria', 'Cafeteria', 'Bar'], cor: '#dc2626' },
  { icon: Leaf, nome: 'Produtos Naturais', desc: 'Catálogo com filtros, blog de receitas, visual clean e sofisticado.', tags: ['Empório', 'Orgânicos', 'Suplementos', 'Vegano'], cor: '#16a34a' },
  { icon: Stethoscope, nome: 'Clínicas & Saúde', desc: 'Agendamento online, equipe médica, convênios. Confiança e profissionalismo.', tags: ['Odontologia', 'Estética', 'Fisioterapia', 'Psicologia'], cor: '#0ea5e9' },
  { icon: Scissors, nome: 'Barbearias & Salões', desc: 'Estilo, atitude e agendamento fácil. Galeria de trabalhos e preços.', tags: ['Barbearia', 'Salão', 'Cabeleireiro', 'Nail Designer'], cor: '#6b7280' },
  { icon: Shirt, nome: 'Moda & Vestuário', desc: 'Vitrine virtual elegante, lookbook, coleções, filtros por tamanho.', tags: ['Boutique', 'Streetwear', 'Fitness', 'Plus Size'], cor: '#7c3aed' },
  { icon: Dog, nome: 'Pet Shop & Veterinárias', desc: 'Serviços, galeria dos pets atendidos, agendamento de banho e tosa.', tags: ['Pet Shop', 'Veterinária', 'Banho e Tosa', 'Hotel Pet'], cor: '#f59e0b' },
  { icon: Dumbbell, nome: 'Academias & Personal', desc: 'Estrutura, modalidades, horários, equipe. Site que motiva a matrícula.', tags: ['Academia', 'CrossFit', 'Personal', 'Pilates'], cor: '#ef4444' },
  { icon: Briefcase, nome: 'Escritórios & Serviços', desc: 'Advogados, contadores, arquitetos. Credibilidade e portfólio profissional.', tags: ['Advocacia', 'Contabilidade', 'Arquitetura', 'Consultoria'], cor: '#1e40af' },
];

const planos = [
  {
    nome: 'Essencial',
    subtitulo: 'Presença online profissional',
    setup: 1497,
    mensal: 149.9,
    recursos: ['Página responsiva e otimizada', 'Design premium personalizado', 'Galeria de fotos profissional', 'Reviews do Google integrados', 'WhatsApp flutuante', 'Certificado SSL incluso', 'Hospedagem de alta performance', 'Formulário de contato', 'Painel administrativo básico'],
  },
  {
    nome: 'Profissional',
    subtitulo: 'Site completo com funcionalidades avançadas',
    setup: 2897,
    mensal: 249.9,
    destaque: true,
    badge: 'Mais Popular',
    recursos: ['Tudo do plano Essencial', 'Múltiplas seções e páginas', 'Cardápio/catálogo interativo', 'Carrinho de compras via WhatsApp', 'SEO avançado (sitemap, meta tags, schema)', 'Blog integrado', 'Google Maps interativo', 'Animações e transições premium', 'Modo claro/escuro', 'Painel administrativo completo', 'Suporte prioritário'],
  },
  {
    nome: 'Premium',
    subtitulo: 'E-commerce completo e integrações',
    setup: 4497,
    mensal: 349.9,
    badge: 'Completo',
    recursos: ['Tudo do plano Profissional', 'E-commerce completo', 'Pagamento PIX + Cartão', 'Área do cliente com login', 'Gestão de pedidos e estoque', 'Relatórios de vendas', 'Multi-idioma (PT/EN/ES)', 'Integrações (delivery, redes sociais)', 'Design 100% exclusivo'],
  },
];

const steps = [
  { n: '01', title: 'Briefing', desc: 'Entendemos seu negócio, público e objetivos. Definimos escopo e prazo.' },
  { n: '02', title: 'Design & Desenvolvimento', desc: 'Criamos o design exclusivo e desenvolvemos com tecnologia de ponta.' },
  { n: '03', title: 'Entrega & Suporte', desc: 'Publicamos, treinamos sua equipe e mantemos tudo funcionando.' },
];

/* ── Page ── */
export function WebsitesPage() {
  useLanguage();
  const { colors, theme } = useTheme();
  const ref = useReveal();
  const dk = theme === 'dark';

  return (
    <div ref={ref}>
      {/* ════ HERO ════ */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: '120px 0 80px' }}>
        {/* Subtle decorative lines */}
        <div style={{ position: 'absolute', left: 32, top: 120, width: 1, height: 160, background: `linear-gradient(to bottom, ${colors.brand}40, transparent)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 32, top: 180, width: 1, height: 120, background: `linear-gradient(to bottom, ${colors.gold}40, transparent)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: 24, top: '50%', width: 8, height: 8, border: `1px solid ${colors.brand}30`, transform: 'rotate(45deg)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} id="websites-hero-grid">
            <div>
              {/* Badge */}
              <div className="anim-fade-up" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px',
                background: dk ? 'rgba(13,148,136,0.08)' : 'rgba(13,148,136,0.06)',
                border: `1px solid ${dk ? 'rgba(13,148,136,0.2)' : 'rgba(13,148,136,0.15)'}`,
                fontSize: 13, color: colors.brand, marginBottom: 24,
              }}>
                <Zap size={14} /> Boutique digital em Curitiba
              </div>

              <h1 className="anim-fade-up" style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 300,
                lineHeight: 0.95, letterSpacing: '-0.03em',
                marginBottom: 24, animationDelay: '0.15s',
              }}>
                <span style={{ color: colors.white }}>Sites que</span>
                <br />
                <span style={{ fontStyle: 'italic', fontWeight: 400, color: colors.brand }}>convertem</span>
              </h1>

              <p className="anim-fade-up" style={{
                fontSize: 'clamp(1rem, 2vw, 1.125rem)', color: colors.textMuted, lineHeight: 1.7,
                maxWidth: 480, marginBottom: 40, animationDelay: '0.3s',
              }}>
                Tecnologia de ponta, design premium, entrega rápida.
                Transformamos negócios com presença digital de alto impacto.
              </p>

              <div className="anim-fade-up" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24, marginBottom: 48, animationDelay: '0.45s' }}>
                <a href="/#contato" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '14px 28px', background: dk ? '#fff' : '#0f172a',
                  color: dk ? '#0f172a' : '#fff', fontSize: 14, fontWeight: 500,
                  letterSpacing: '0.02em', textDecoration: 'none',
                  transition: 'all 0.3s', border: 'none', cursor: 'pointer',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = colors.brand; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = dk ? '#fff' : '#0f172a'; e.currentTarget.style.color = dk ? '#0f172a' : '#fff'; }}
                >
                  Fale conosco <ArrowRight size={16} />
                </a>
                <a href="#planos" style={{ fontSize: 14, color: colors.textMuted, textDecoration: 'none', transition: 'color 0.3s', letterSpacing: '0.02em' }}
                  onMouseEnter={e => e.currentTarget.style.color = colors.brand}
                  onMouseLeave={e => e.currentTarget.style.color = colors.textMuted}
                >
                  Ver planos e preços
                </a>
              </div>

              {/* Stats */}
              <div className="anim-fade-up" style={{
                display: 'flex', gap: 48, paddingTop: 32,
                borderTop: `1px solid ${colors.border}`,
                animationDelay: '0.6s',
              }}>
                {[{ v: '8+', l: 'Segmentos' }, { v: '100%', l: 'Personalizado' }, { v: '48h', l: 'Entrega' }].map(s => (
                  <div key={s.l}>
                    <div style={{ fontSize: 'clamp(1.5rem, 3vw, 1.75rem)', fontWeight: 300, color: colors.white }}>{s.v}</div>
                    <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.textDim, marginTop: 4 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Browser mockup */}
            <div className="anim-fade-up" style={{ animationDelay: '0.4s' }}>
              <div style={{ background: '#0a0a1a', border: `1px solid ${dk ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.15)'}`, boxShadow: `0 40px 80px ${colors.shadow}` }}>
                {/* Browser bar */}
                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${dk ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.1)'}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444aa' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#eab308aa' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55eaa' }} />
                  </div>
                  <div style={{ flex: 1, margin: '0 16px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Globe size={12} /> seunegocio.com.br
                  </div>
                </div>
                {/* Content */}
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.1em', fontWeight: 300 }}>LOGO</div>
                    <div style={{ display: 'flex', gap: 16 }}>
                      {[1, 2, 3].map(i => <div key={i} style={{ width: 40, height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }} />)}
                    </div>
                  </div>
                  <div style={{ padding: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', marginBottom: 12 }}>
                    <div style={{ width: 60, height: 3, background: `${colors.gold}80`, marginBottom: 12, borderRadius: 2 }} />
                    <div style={{ width: '75%', height: 14, background: 'rgba(255,255,255,0.7)', borderRadius: 2, marginBottom: 8 }} />
                    <div style={{ width: '50%', height: 14, background: 'rgba(255,255,255,0.35)', borderRadius: 2, marginBottom: 16 }} />
                    <div style={{ width: 90, height: 28, background: colors.brand, borderRadius: 2 }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ padding: 12, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ width: 28, height: 8, background: 'rgba(255,255,255,0.5)', borderRadius: 2, marginBottom: 4 }} />
                        <div style={{ width: 40, height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[1, 2].map(i => (
                      <div key={i} style={{ padding: 12, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ width: 20, height: 20, background: `${colors.gold}25`, borderRadius: 4, marginBottom: 8 }} />
                        <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.25)', borderRadius: 2, marginBottom: 4 }} />
                        <div style={{ width: '65%', height: 6, background: 'rgba(255,255,255,0.12)', borderRadius: 2 }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){#websites-hero-grid{grid-template-columns:1fr!important;}#websites-hero-grid>div:last-child{display:none;}}`}</style>
      </section>

      {/* ════ NICHOS ════ */}
      <section style={{ padding: '100px 0', background: colors.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{
              display: 'inline-block', padding: '4px 14px', fontSize: 11,
              letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500,
              color: colors.brand, background: dk ? 'rgba(13,148,136,0.08)' : 'rgba(13,148,136,0.06)',
              border: `1px solid ${dk ? 'rgba(13,148,136,0.15)' : 'rgba(13,148,136,0.1)'}`,
              marginBottom: 20,
            }}>Nichos</span>
            <h2 style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300,
              color: colors.white, lineHeight: 1.15, letterSpacing: '-0.02em',
            }}>
              Sites para cada <span style={{ fontStyle: 'italic', fontWeight: 400, color: colors.brand }}>segmento</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 16 }}>
            {nichos.map((n) => {
              const Icon = n.icon;
              return (
                <div key={n.nome} className="reveal" style={{
                  padding: 28, background: colors.glassCard, border: `1px solid ${colors.glassCardBorder}`,
                  backdropFilter: 'blur(8px)', transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)', cursor: 'default',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = colors.borderHover; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = colors.glassCardBorder; }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${n.cor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Icon size={20} style={{ color: n.cor }} />
                  </div>
                  <h3 style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1rem)', fontWeight: 600, color: colors.white, marginBottom: 8 }}>{n.nome}</h3>
                  <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.6, marginBottom: 16 }}>{n.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {n.tags.map(tag => (
                      <span key={tag} style={{
                        padding: '3px 10px', fontSize: 11, borderRadius: 9999,
                        background: colors.tagBg, border: `1px solid ${colors.tagBorder}`,
                        color: colors.textDim, fontWeight: 500,
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════ COMO FUNCIONA ════ */}
      <section style={{ padding: '100px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{
              display: 'inline-block', padding: '4px 14px', fontSize: 11,
              letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500,
              color: colors.brand, background: dk ? 'rgba(13,148,136,0.08)' : 'rgba(13,148,136,0.06)',
              border: `1px solid ${dk ? 'rgba(13,148,136,0.15)' : 'rgba(13,148,136,0.1)'}`,
              marginBottom: 20,
            }}>Processo</span>
            <h2 style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300,
              color: colors.white, lineHeight: 1.15, letterSpacing: '-0.02em',
            }}>
              Como <span style={{ fontStyle: 'italic', fontWeight: 400, color: colors.brand }}>funciona</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {steps.map((s) => (
              <div key={s.n} className="reveal" style={{
                padding: 36, background: colors.glassCard, border: `1px solid ${colors.glassCardBorder}`,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 16, right: 20, fontSize: 64, fontWeight: 200,
                  color: dk ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)',
                  fontFamily: "'Inter', system-ui, sans-serif", lineHeight: 1,
                }}>{s.n}</div>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: `${colors.brand}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: colors.brand, fontWeight: 700, fontSize: 14, marginBottom: 20,
                }}>{s.n}</div>
                <h3 style={{ fontSize: 'clamp(1rem, 1.8vw, 1.125rem)', fontWeight: 600, color: colors.white, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ PLANOS ════ */}
      <section id="planos" style={{ padding: '100px 0', background: colors.bgAlt }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{
              display: 'inline-block', padding: '4px 14px', fontSize: 11,
              letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500,
              color: colors.brand, background: dk ? 'rgba(13,148,136,0.08)' : 'rgba(13,148,136,0.06)',
              border: `1px solid ${dk ? 'rgba(13,148,136,0.15)' : 'rgba(13,148,136,0.1)'}`,
              marginBottom: 20,
            }}>Planos</span>
            <h2 style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300,
              color: colors.white, lineHeight: 1.15, letterSpacing: '-0.02em',
            }}>
              Investimento <span style={{ fontStyle: 'italic', fontWeight: 400, color: colors.brand }}>transparente</span>
            </h2>
            <p style={{ fontSize: 15, color: colors.textMuted, marginTop: 16, maxWidth: 500, margin: '16px auto 0' }}>
              Setup único + manutenção mensal. Sem surpresas, sem taxa escondida.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, alignItems: 'start' }}>
            {planos.map((p) => (
              <div key={p.nome} className="reveal" style={{
                padding: 36, background: colors.glassCard,
                border: p.destaque ? `2px solid ${colors.brand}` : `1px solid ${colors.glassCardBorder}`,
                position: 'relative', overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {p.badge && (
                  <div style={{
                    position: 'absolute', top: 16, right: 16, padding: '4px 12px',
                    background: p.destaque ? colors.brand : dk ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                    color: p.destaque ? '#fff' : colors.textMuted,
                    fontSize: 11, fontWeight: 600, letterSpacing: '0.05em',
                  }}>{p.badge}</div>
                )}
                <h3 style={{ fontSize: 'clamp(1.15rem, 2.2vw, 1.375rem)', fontWeight: 300, color: colors.white, marginBottom: 4, letterSpacing: '-0.01em' }}>{p.nome}</h3>
                <p style={{ fontSize: 13, color: colors.textDim, marginBottom: 24 }}>{p.subtitulo}</p>

                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: colors.textDim }}>Setup: </span>
                  <span style={{ fontSize: 'clamp(1.5rem, 3vw, 1.75rem)', fontWeight: 300, color: colors.white }}>R$ {p.setup.toLocaleString('pt-BR')}</span>
                </div>
                <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: `1px solid ${colors.border}` }}>
                  <span style={{ fontSize: 13, color: colors.textDim }}>Mensal: </span>
                  <span style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', fontWeight: 400, color: colors.brand }}>R$ {p.mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <span style={{ fontSize: 13, color: colors.textDim }}>/mês</span>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {p.recursos.map((r) => (
                    <li key={r} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: colors.textMuted, lineHeight: 1.5 }}>
                      <CheckCircle2 size={15} style={{ color: colors.brand, flexShrink: 0, marginTop: 2 }} />
                      {r}
                    </li>
                  ))}
                </ul>

                <a href="/#contato" style={{
                  display: 'block', textAlign: 'center', padding: '12px 24px',
                  background: p.destaque ? colors.brand : 'transparent',
                  color: p.destaque ? '#fff' : colors.white,
                  border: p.destaque ? 'none' : `1px solid ${colors.border}`,
                  fontSize: 14, fontWeight: 500, textDecoration: 'none',
                  transition: 'all 0.3s', letterSpacing: '0.02em',
                }}
                  onMouseEnter={e => { if (!p.destaque) { e.currentTarget.style.borderColor = colors.brand; e.currentTarget.style.color = colors.brand; } else { e.currentTarget.style.opacity = '0.9'; } }}
                  onMouseLeave={e => { if (!p.destaque) { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.white; } else { e.currentTarget.style.opacity = '1'; } }}
                >
                  Começar agora
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CTA ════ */}
      <section style={{ padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative */}
        <div style={{ position: 'absolute', left: '20%', top: '30%', width: 300, height: 300, background: `radial-gradient(circle, ${colors.orbBrand} 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', right: '15%', bottom: '20%', width: 250, height: 250, background: `radial-gradient(circle, ${colors.orbGold} 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none', filter: 'blur(60px)' }} />

        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <h2 className="reveal" style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300,
            color: colors.white, lineHeight: 1.15, letterSpacing: '-0.02em',
            marginBottom: 16,
          }}>
            Pronto para ter um site que <span style={{ fontStyle: 'italic', fontWeight: 400, color: colors.brand }}>funciona</span>?
          </h2>
          <p className="reveal rv-d1" style={{ fontSize: 'clamp(0.875rem, 1.6vw, 1rem)', color: colors.textMuted, lineHeight: 1.7, marginBottom: 40 }}>
            Converse com a gente. Em 48 horas você terá uma proposta personalizada para o seu negócio.
          </p>
          <a href="/#contato" className="btn-cta anim-pulse-glow reveal rv-d2" style={{ padding: '16px 40px', fontSize: 'clamp(0.875rem, 1.6vw, 1rem)' }}>
            Falar com especialista <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
