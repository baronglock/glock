import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, CheckCircle2, Shield, Zap } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { useReveal } from '../hooks/useReveal';

// Plan data mapped by service-plan ID
const plans: Record<string, { name: string; service: string; price: string; period: string; features: {t:string;d:string}[] }> = {
  // Extração de Dados
  'extracao-de-dados-pontual': { name: 'Pontual', service: 'Extração de Dados', price: 'R$ 497', period: 'por extração', features: [
      {t: 'Até 10.000 registros', d: 'Base segmentada por região, setor e porte — pronta pra uso imediato.'},
      {t: 'Filtros personalizados', d: 'Escolha exatamente o perfil de empresa que quer atingir.'},
      {t: 'Entrega em CSV/Excel', d: 'Arquivo limpo e organizado, pronto pra importar no CRM ou planilha.'},
      {t: 'Dados completos', d: 'Telefone, WhatsApp, email, sócios, CNAE e situação fiscal em cada registro.'},
      {t: 'Suporte por WhatsApp', d: 'Tire dúvidas e peça ajustes direto pelo chat.'}
    ] },
  'extracao-de-dados-recorrente': { name: 'Recorrente', service: 'Extração de Dados', price: 'R$ 897', period: '/mês', features: [
      {t: '50.000 registros/mês', d: 'Base renovada mensalmente com os dados mais recentes do mercado.'},
      {t: 'Atualização automática', d: 'Sem precisar pedir — todo mês os dados frescos chegam pra você.'},
      {t: 'Cruzamento de fontes', d: 'Receita Federal, Google Maps, redes sociais — tudo num registro só.'},
      {t: 'Enriquecimento completo', d: 'Sócios, CNAE, capital social, telefone fixo e celular inclusos.'},
      {t: 'Entrega flexível', d: 'CSV, Excel ou direto no seu CRM — como preferir.'},
      {t: 'Suporte prioritário', d: 'Resposta em até 2h por WhatsApp ou email.'}
    ] },
  'extracao-de-dados-enterprise': { name: 'Enterprise', service: 'Extração de Dados', price: 'Sob consulta', period: '', features: [
      {t: 'Volume ilimitado', d: 'Sem teto de registros — escala conforme sua operação cresce.'},
      {t: 'API em tempo real', d: 'Acesse dados programaticamente, integrado ao seu sistema.'},
      {t: 'Integração direta', d: 'Conectamos com seu ERP, CRM ou plataforma de vendas.'},
      {t: 'Dashboards', d: 'Acompanhe volume, qualidade e uso dos dados em tempo real.'},
      {t: 'Gerente dedicado', d: 'Um profissional exclusivo cuidando da sua conta.'},
      {t: 'SLA garantido', d: 'Contrato com prazos de entrega e uptime definidos.'}
    ] },
  // Automação
  'automacao-starter': { name: 'Starter', service: 'Automação de Processos', price: 'R$ 797', period: 'por automação', features: [
      {t: '1 fluxo automatizado', d: 'Escolha o processo mais repetitivo e eliminamos o trabalho manual.'},
      {t: '2 sistemas integrados', d: 'Conectamos as ferramentas que você já usa — Sheets, WhatsApp, email.'},
      {t: 'Documentação completa', d: 'Manual de operação pra sua equipe ter autonomia total.'},
      {t: '30 dias de suporte', d: 'Ajustes e correções inclusos no primeiro mês.'},
      {t: 'Treinamento', d: 'Ensinamos sua equipe a usar e monitorar a automação.'}
    ] },
  'automacao-growth': { name: 'Growth', service: 'Automação de Processos', price: 'R$ 1.497', period: '/mês', features: [
      {t: 'Até 5 fluxos', d: 'Automatize vendas, financeiro, atendimento, relatórios — tudo ao mesmo tempo.'},
      {t: 'Integrações ilimitadas', d: 'Conecte quantos sistemas precisar — ERPs, CRMs, bancos, APIs.'},
      {t: 'Relatórios automáticos', d: 'Receba prontos por email ou WhatsApp sem fazer nada.'},
      {t: 'Alertas inteligentes', d: 'Notificação instantânea quando algo precisa de atenção humana.'},
      {t: 'Suporte prioritário', d: 'Resposta em até 2h. Problemas críticos resolvidos no mesmo dia.'},
      {t: 'Manutenção mensal', d: 'Otimizamos seus fluxos continuamente pra máxima eficiência.'}
    ] },
  'automacao-scale': { name: 'Scale', service: 'Automação de Processos', price: 'R$ 2.997', period: '/mês', features: [
      {t: 'Fluxos ilimitados', d: 'Automatize tudo sem limite de processos ou complexidade.'},
      {t: 'Dashboards ao vivo', d: 'Status de todas as automações em tempo real num painel visual.'},
      {t: 'IA embarcada', d: 'Inteligência artificial dentro dos fluxos pra decisões automáticas.'},
      {t: 'Integrações customizadas', d: 'APIs exclusivas, webhooks e conectores sob medida.'},
      {t: 'Gerente dedicado', d: 'Um profissional exclusivo cuidando da sua operação.'},
      {t: 'SLA 99.9%', d: 'Garantia contratual de disponibilidade dos sistemas.'}
    ] },
  // Chatbots
  'chatbots-basico': { name: 'Básico', service: 'Chatbots Inteligentes', price: 'R$ 997', period: 'setup + R$ 197/mês', features: [
      {t: 'WhatsApp ou site', d: 'Bot funcionando no canal que seus clientes mais usam.'},
      {t: '50 perguntas treinadas', d: 'Respostas precisas sobre serviços, preços, horários e localização.'},
      {t: 'Atendimento 24/7', d: 'Clientes atendidos a qualquer hora, sem filas e sem espera.'},
      {t: 'Escalação humana', d: 'Quando o bot não resolve, transfere pra você com todo o contexto.'},
      {t: 'Relatórios mensais', d: 'Quantas pessoas atendidas e quais as dúvidas mais comuns.'}
    ] },
  'chatbots-inteligente': { name: 'Inteligente', service: 'Chatbots Inteligentes', price: 'R$ 1.997', period: 'setup + R$ 397/mês', features: [
      {t: 'Tudo do Básico +', d: 'Todas as funcionalidades do plano anterior incluídas.'},
      {t: 'IA com RAG', d: 'Bot treinado com seus documentos — respostas contextualizadas e precisas.'},
      {t: 'Qualificação de leads', d: 'Identifica perfil do cliente e classifica por prioridade automaticamente.'},
      {t: 'Agendamento automático', d: 'Marca reuniões no Google Calendar sem troca de mensagens.'},
      {t: 'Integração CRM', d: 'Leads capturados vão direto pro seu sistema de vendas.'},
      {t: 'Multi-idioma', d: 'Atende em português e inglês automaticamente.'}
    ] },
  'chatbots-autonomo': { name: 'Autônomo', service: 'Chatbots Inteligentes', price: 'R$ 3.497', period: 'setup + R$ 697/mês', features: [
      {t: 'Tudo do Inteligente +', d: 'Todas as funcionalidades dos planos anteriores incluídas.'},
      {t: 'Vendas pelo chat', d: 'Apresenta produtos, tira dúvidas e fecha pedidos sozinho.'},
      {t: 'Pagamento PIX', d: 'Aceita pagamento direto no chat — venda completa na conversa.'},
      {t: 'Análise de sentimento', d: 'Detecta insatisfação e escala pra humano antes do cliente desistir.'},
      {t: 'Dashboard ao vivo', d: 'Conversas, vendas e métricas em tempo real.'},
      {t: 'Gerente dedicado', d: 'Profissional exclusivo otimizando seu bot continuamente.'}
    ] },
  // Sites
  'sites-essencial': { name: 'Essencial', service: 'Sites & Landing Pages', price: 'R$ 1.497', period: 'setup + R$ 149/mês', features: [
      {t: 'Site responsivo', d: 'Funciona perfeitamente no celular, tablet e computador.'},
      {t: 'Design premium', d: 'Layout exclusivo criado do zero, alinhado com sua marca.'},
      {t: 'Galeria de fotos', d: 'Mostre seus produtos, espaço e equipe em alta qualidade.'},
      {t: 'WhatsApp flutuante', d: 'Um clique e o cliente fala com você direto.'},
      {t: 'SSL + Hospedagem', d: 'Segurança e servidor inclusos sem custo extra.'},
      {t: 'Formulário de contato', d: 'Capture leads com nome, telefone e mensagem.'}
    ] },
  'sites-profissional': { name: 'Profissional', service: 'Sites & Landing Pages', price: 'R$ 2.897', period: 'setup + R$ 249/mês', features: [
      {t: 'Tudo do Essencial +', d: 'Todas as funcionalidades do plano anterior incluídas.'},
      {t: 'Múltiplas páginas', d: 'Sobre, serviços, galeria, depoimentos, blog — completo.'},
      {t: 'Cardápio/catálogo', d: 'Menu interativo com filtros e pedido via WhatsApp.'},
      {t: 'SEO avançado', d: 'Otimizado pra aparecer nas primeiras posições do Google.'},
      {t: 'Blog integrado', d: 'Publique conteúdo e atraia clientes organicamente.'},
      {t: 'Modo claro/escuro', d: 'Experiência premium que se adapta ao visitante.'}
    ] },
  'sites-premium': { name: 'Premium', service: 'Sites & Landing Pages', price: 'R$ 4.497', period: 'setup + R$ 349/mês', features: [
      {t: 'Tudo do Profissional +', d: 'Todas as funcionalidades dos planos anteriores.'},
      {t: 'E-commerce completo', d: 'Loja virtual com carrinho, checkout e gestão de pedidos.'},
      {t: 'PIX + Cartão', d: 'Pagamentos online com as principais formas do Brasil.'},
      {t: 'Área do cliente', d: 'Login exclusivo pra acompanhar pedidos e histórico.'},
      {t: 'Gestão de pedidos', d: 'Painel pra gerenciar vendas, estoque e entregas.'},
      {t: 'Design 100% exclusivo', d: 'Nenhum outro site no mundo terá o mesmo visual.'}
    ] },
  // Dashboards
  'dashboards-operacional': { name: 'Operacional', service: 'Dashboards & BI', price: 'R$ 1.297', period: 'setup + R$ 197/mês', features: [
      {t: '1 dashboard', d: 'Painel visual com os indicadores mais importantes do negócio.'},
      {t: '3 fontes de dados', d: 'Conecte planilhas, banco de dados ou sistemas que já usa.'},
      {t: 'Atualização automática', d: 'Dados sempre frescos sem atualizar manualmente.'},
      {t: 'Acesso mobile', d: 'Consulte números de qualquer lugar, no celular ou tablet.'},
      {t: 'Exportação PDF', d: 'Relatórios formatados pra apresentações e reuniões.'},
      {t: 'Suporte WhatsApp', d: 'Tire dúvidas e peça ajustes direto pelo chat.'}
    ] },
  'dashboards-gerencial': { name: 'Gerencial', service: 'Dashboards & BI', price: 'R$ 2.497', period: 'setup + R$ 397/mês', features: [
      {t: 'Até 5 dashboards', d: 'Vendas, financeiro, operações, marketing — cada área com seu painel.'},
      {t: 'Fontes ilimitadas', d: 'Conecte todos os sistemas — ERPs, planilhas, bancos, APIs.'},
      {t: 'Alertas automáticos', d: 'Notificação quando indicadores saírem da faixa esperada.'},
      {t: 'KPIs personalizados', d: 'Indicadores sob medida pro que importa no seu negócio.'},
      {t: 'Relatórios agendados', d: 'Receba por email semanalmente ou mensalmente sem pedir.'},
      {t: 'Suporte prioritário', d: 'Resposta em até 2h e ajustes rápidos.'}
    ] },
  'dashboards-estrategico': { name: 'Estratégico', service: 'Dashboards & BI', price: 'R$ 4.997', period: 'setup + R$ 697/mês', features: [
      {t: 'Dashboards ilimitados', d: 'Crie quantos painéis precisar pra cada área.'},
      {t: 'IA preditiva', d: 'Previsões de vendas, churn e tendências baseadas em dados.'},
      {t: 'Integração BI', d: 'Conecte com Power BI, Metabase, Looker ou qualquer ferramenta.'},
      {t: 'API de dados', d: 'Acesso programático aos indicadores pra sistemas externos.'},
      {t: 'White-label', d: 'Dashboards com sua marca — apresente como seu produto.'},
      {t: 'Gerente dedicado', d: 'Profissional exclusivo evoluindo seus dashboards.'}
    ] },
  // Consultoria
  'consultoria-ia-diagnostico': { name: 'Diagnóstico', service: 'Consultoria em IA', price: 'R$ 1.997', period: 'projeto', features: [
      {t: 'Diagnóstico operacional', d: 'Mapeamos toda operação e identificamos gargalos.'},
      {t: 'Mapeamento de processos', d: 'Documentação visual de como cada fluxo funciona hoje.'},
      {t: 'Roadmap de IA', d: 'Plano priorizado do que automatizar primeiro pro maior retorno.'},
      {t: 'Análise de ROI', d: 'Estimativa de quanto economiza/ganha com cada implementação.'},
      {t: 'Relatório executivo', d: 'Documento profissional pra apresentar pro board ou sócios.'},
      {t: 'Reunião de apresentação', d: 'Apresentamos conclusões e respondemos todas as dúvidas.'}
    ] },
  'consultoria-ia-implementacao': { name: 'Implementação', service: 'Consultoria em IA', price: 'R$ 4.997', period: 'setup + R$ 497/mês', features: [
      {t: 'Tudo do Diagnóstico +', d: 'Diagnóstico completo incluído antes de implementar.'},
      {t: '3 soluções de IA', d: 'Chatbot, automação e dashboard — ou o que fizer mais sentido.'},
      {t: 'Seleção de ferramentas', d: 'Melhores tecnologias pro seu caso, sem viés de fornecedor.'},
      {t: 'Integrações', d: 'Conectamos IA aos sistemas que você já usa.'},
      {t: 'Treinamento', d: 'Sua equipe aprende a operar com autonomia.'},
      {t: 'Suporte mensal', d: 'Manutenção, ajustes e evolução todo mês.'}
    ] },
  'consultoria-ia-transformacao': { name: 'Transformação', service: 'Consultoria em IA', price: 'Sob consulta', period: '', features: [
      {t: 'Tudo do Implementação +', d: 'Todas as funcionalidades dos planos anteriores.'},
      {t: 'Consultoria estratégica', d: 'Reuniões mensais alinhando IA com objetivos de negócio.'},
      {t: 'Implementações ilimitadas', d: 'Sem limite — automatize tudo que fizer sentido.'},
      {t: 'Novas tecnologias', d: 'Primeiro a testar e implementar novidades do mercado.'},
      {t: 'Gerente de inovação', d: 'Profissional exclusivo pensando em como IA faz você crescer.'},
      {t: 'KPIs de impacto', d: 'Métricas claras do retorno real de cada implementação.'}
    ] },
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
                {plan.features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, lineHeight: 1.6 }}>
                    <CheckCircle2 size={16} style={{ color: colors.brand, flexShrink: 0, marginTop: 3 }} />
                    <div>
                      <span style={{ color: colors.white, fontWeight: 600 }}>{f.t}</span>
                      <span style={{ color: colors.textDim }}> — {f.d}</span>
                    </div>
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
