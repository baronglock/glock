import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, CheckCircle2, Shield, Zap } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { useReveal } from '../hooks/useReveal';

// Plan data mapped by service-plan ID
const plans: Record<string, { name: string; service: string; price: string; period: string; features: string[] }> = {
  // Extração de Dados
  'extracao-de-dados-pontual': { name: 'Pontual', service: 'Extração de Dados', price: 'R$ 497', period: 'por extração', features: ['Até 10.000 registros', 'Filtros por região e setor', 'Entrega em CSV/Excel', 'Dados de contato + CNPJ', 'Suporte por WhatsApp'] },
  'extracao-de-dados-recorrente': { name: 'Recorrente', service: 'Extração de Dados', price: 'R$ 897', period: '/mês', features: ['Até 50.000 registros/mês', 'Atualização automática mensal', 'Cruzamento de múltiplas fontes', 'Enriquecimento com sócios e CNAE', 'Entrega em CSV, Excel ou CRM', 'Suporte prioritário'] },
  'extracao-de-dados-enterprise': { name: 'Enterprise', service: 'Extração de Dados', price: 'Sob consulta', period: '', features: ['Volume ilimitado', 'API de acesso em tempo real', 'Integração direta com seu sistema', 'Dashboards de monitoramento', 'Gerente de conta dedicado', 'SLA de entrega garantido'] },
  // Automação
  'automacao-starter': { name: 'Starter', service: 'Automação de Processos', price: 'R$ 797', period: 'por automação', features: ['1 fluxo automatizado', 'Integração com até 2 sistemas', 'Documentação completa', 'Suporte por 30 dias', 'Treinamento básico'] },
  'automacao-growth': { name: 'Growth', service: 'Automação de Processos', price: 'R$ 1.497', period: '/mês', features: ['Até 5 fluxos automatizados', 'Integrações ilimitadas', 'Relatórios automáticos', 'Alertas por WhatsApp/email', 'Suporte prioritário', 'Manutenção mensal'] },
  'automacao-scale': { name: 'Scale', service: 'Automação de Processos', price: 'R$ 2.997', period: '/mês', features: ['Fluxos ilimitados', 'Dashboards de monitoramento', 'IA embarcada nos fluxos', 'Integrações customizadas', 'Gerente de conta dedicado', 'SLA de uptime 99.9%'] },
  // Chatbots
  'chatbots-basico': { name: 'Básico', service: 'Chatbots Inteligentes', price: 'R$ 997', period: 'setup + R$ 197/mês', features: ['Chatbot para WhatsApp ou site', 'Até 50 perguntas treinadas', 'Respostas automáticas 24/7', 'Escalação para humano', 'Relatórios mensais'] },
  'chatbots-inteligente': { name: 'Inteligente', service: 'Chatbots Inteligentes', price: 'R$ 1.997', period: 'setup + R$ 397/mês', features: ['Tudo do plano Básico', 'IA com RAG (base de conhecimento)', 'Qualificação automática de leads', 'Agendamento via Google Calendar', 'Integração com CRM', 'Multi-idioma PT/EN'] },
  'chatbots-autonomo': { name: 'Autônomo', service: 'Chatbots Inteligentes', price: 'R$ 3.497', period: 'setup + R$ 697/mês', features: ['Tudo do plano Inteligente', 'Vendas e pedidos pelo chat', 'Integração com pagamento (PIX)', 'Análise de sentimento', 'Dashboard em tempo real', 'Gerente de conta dedicado'] },
  // Sites
  'sites-essencial': { name: 'Essencial', service: 'Sites & Landing Pages', price: 'R$ 1.497', period: 'setup + R$ 149/mês', features: ['Página responsiva otimizada', 'Design premium personalizado', 'Galeria de fotos', 'WhatsApp flutuante', 'Certificado SSL', 'Hospedagem inclusa', 'Formulário de contato'] },
  'sites-profissional': { name: 'Profissional', service: 'Sites & Landing Pages', price: 'R$ 2.897', period: 'setup + R$ 249/mês', features: ['Tudo do Essencial', 'Múltiplas páginas', 'Cardápio/catálogo interativo', 'SEO avançado', 'Blog integrado', 'Google Maps', 'Modo claro/escuro'] },
  'sites-premium': { name: 'Premium', service: 'Sites & Landing Pages', price: 'R$ 4.497', period: 'setup + R$ 349/mês', features: ['Tudo do Profissional', 'E-commerce completo', 'Pagamento PIX + Cartão', 'Área do cliente', 'Gestão de pedidos', 'Multi-idioma', 'Design 100% exclusivo'] },
  // Dashboards
  'dashboards-operacional': { name: 'Operacional', service: 'Dashboards & BI', price: 'R$ 1.297', period: 'setup + R$ 197/mês', features: ['1 dashboard interativo', 'Até 3 fontes de dados', 'Atualização automática', 'Acesso mobile', 'Exportação em PDF', 'Suporte por WhatsApp'] },
  'dashboards-gerencial': { name: 'Gerencial', service: 'Dashboards & BI', price: 'R$ 2.497', period: 'setup + R$ 397/mês', features: ['Até 5 dashboards', 'Fontes ilimitadas', 'Alertas automáticos', 'KPIs personalizados', 'Relatórios agendados', 'Suporte prioritário'] },
  'dashboards-estrategico': { name: 'Estratégico', service: 'Dashboards & BI', price: 'R$ 4.997', period: 'setup + R$ 697/mês', features: ['Dashboards ilimitados', 'Análise preditiva com IA', 'Integração com BI tools', 'API de dados', 'White-label', 'Gerente de conta dedicado'] },
  // Consultoria
  'consultoria-ia-diagnostico': { name: 'Diagnóstico', service: 'Consultoria em IA', price: 'R$ 1.997', period: 'projeto', features: ['Diagnóstico operacional completo', 'Mapeamento de processos', 'Roadmap de IA priorizado', 'Análise de ROI estimado', 'Relatório executivo', 'Reunião de apresentação'] },
  'consultoria-ia-implementacao': { name: 'Implementação', service: 'Consultoria em IA', price: 'R$ 4.997', period: 'setup + R$ 497/mês', features: ['Tudo do Diagnóstico', 'Implementação de até 3 soluções de IA', 'Seleção e configuração de ferramentas', 'Integrações com sistemas existentes', 'Treinamento da equipe', 'Suporte e manutenção mensal contínua'] },
  'consultoria-ia-transformacao': { name: 'Transformação', service: 'Consultoria em IA', price: 'Sob consulta', period: '', features: ['Tudo do Implementação', 'Consultoria estratégica mensal', 'Implementações ilimitadas', 'Acesso a novas tecnologias', 'Gerente de inovação dedicado', 'KPIs e relatórios de impacto'] },
};

export function CheckoutPage() {
  const [params] = useSearchParams();
  const { colors } = useTheme();
  const { lang } = useLanguage();
  const ref = useReveal();
  const en = lang === 'en';

  const planId = params.get('plan') || '';
  const plan = plans[planId];

  if (!plan) {
    return (
      <div ref={ref} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 300, color: colors.white, marginBottom: 16 }}>
            {en ? 'Plan not found' : 'Plano não encontrado'}
          </h1>
          <Link to="/" style={{ color: colors.brand, textDecoration: 'none' }}>
            ← {en ? 'Back to home' : 'Voltar ao início'}
          </Link>
        </div>
      </div>
    );
  }

  const isConsulta = plan.price === 'Sob consulta' || plan.price === 'Custom';
  const whatsappMsg = encodeURIComponent(`Olá! Tenho interesse no plano ${plan.name} de ${plan.service}. Gostaria de mais informações.`);
  const whatsappLink = `https://wa.me/5541987991419?text=${whatsappMsg}`;

  return (
    <div ref={ref}>
      <Helmet>
        <title>{plan.name} — {plan.service} — Stauf.</title>
        <meta name="description" content={`Contrate o plano ${plan.name} de ${plan.service}`} />
      </Helmet>

      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 0 80px', position: 'relative' }}>
        {/* Background gradient */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.3, background: `radial-gradient(ellipse at 30% 40%, ${colors.brand}15, transparent 50%)` }} />

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <Link to="/" className="reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: colors.textDim, textDecoration: 'none', fontSize: 13, marginBottom: 40, transition: 'color 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.color = colors.brand}
            onMouseLeave={e => e.currentTarget.style.color = colors.textDim}>
            <ArrowLeft size={14} /> {en ? 'Back' : 'Voltar'}
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }} id="checkout-grid">

            {/* Left — Plan details */}
            <div className="reveal">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 14px', background: `${colors.brand}15`, border: `1px solid ${colors.brand}25`, fontSize: 11, color: colors.brand, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>
                {plan.service}
              </div>

              <h1 style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: colors.white, marginBottom: 8 }}>
                {en ? 'Plan' : 'Plano'} {plan.name}
              </h1>

              <div style={{ marginBottom: 32 }}>
                <span style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 600, color: colors.brand }}>{plan.price}</span>
                {plan.period && <span style={{ fontSize: 14, color: colors.textDim, marginLeft: 8 }}>{plan.period}</span>}
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: colors.textMuted, lineHeight: 1.6 }}>
                    <CheckCircle2 size={16} style={{ color: colors.brand, flexShrink: 0, marginTop: 3 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: colors.textDim }}>
                  <Shield size={14} style={{ color: colors.brand }} />
                  {en ? 'Secure payment' : 'Pagamento seguro'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: colors.textDim }}>
                  <Zap size={14} style={{ color: colors.brand }} />
                  {en ? 'Start in 48h' : 'Início em 48h'}
                </div>
              </div>
            </div>

            {/* Right — Action card */}
            <div className="reveal" style={{
              padding: 36, background: colors.glassCard, border: `1px solid ${colors.glassCardBorder}`,
              borderRadius: 16,
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: colors.white, marginBottom: 24 }}>
                {isConsulta
                  ? (en ? 'Request a quote' : 'Solicitar proposta')
                  : (en ? 'Start now' : 'Começar agora')}
              </h2>

              {isConsulta ? (
                <>
                  <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.7, marginBottom: 24 }}>
                    {en
                      ? 'This plan requires a custom proposal. Contact us to discuss your needs.'
                      : 'Este plano requer uma proposta personalizada. Entre em contato para discutirmos suas necessidades.'}
                  </p>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-cta" style={{ display: 'block', textAlign: 'center', padding: '14px 24px', fontSize: 15, width: '100%' }}>
                    {en ? 'Talk on WhatsApp' : 'Falar no WhatsApp'}
                  </a>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.7, marginBottom: 24 }}>
                    {en
                      ? 'Choose your preferred payment method. We will contact you within 24h to start.'
                      : 'Escolha a forma de pagamento. Entraremos em contato em até 24h para iniciar.'}
                  </p>

                  {/* Payment options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      padding: '14px 24px', background: '#25d366', color: '#fff',
                      fontSize: 15, fontWeight: 600, borderRadius: 12, textDecoration: 'none',
                      transition: 'opacity 0.3s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      {en ? 'Pay via WhatsApp (PIX)' : 'Pagar via WhatsApp (PIX)'}
                    </a>

                    <button
                      onClick={() => {
                        // TODO: Stripe Checkout session
                        window.open(whatsappLink, '_blank');
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        padding: '14px 24px', background: 'transparent',
                        border: `1px solid ${colors.border}`, color: colors.white,
                        fontSize: 15, fontWeight: 500, borderRadius: 12, cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = colors.brand; e.currentTarget.style.color = colors.brand; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.white; }}
                    >
                      {en ? 'Pay with Card (Stripe)' : 'Pagar com Cartão (Stripe)'}
                    </button>
                  </div>

                  <p style={{ fontSize: 11, color: colors.textDim, textAlign: 'center', lineHeight: 1.6 }}>
                    {en
                      ? 'By proceeding you agree to our terms of service and privacy policy.'
                      : 'Ao continuar você concorda com nossos termos de serviço e política de privacidade.'}
                  </p>
                </>
              )}
            </div>
          </div>

          <style>{`
            @media (max-width: 768px) { #checkout-grid { grid-template-columns: 1fr !important; } }
          `}</style>
        </div>
      </section>
    </div>
  );
}
