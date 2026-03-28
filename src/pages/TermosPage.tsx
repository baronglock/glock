import { Helmet } from 'react-helmet-async';
import { useTheme } from '../hooks/useTheme';
import { useReveal } from '../hooks/useReveal';

export function TermosPage() {
  const { colors } = useTheme();
  const ref = useReveal();

  const h2: React.CSSProperties = { fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', fontWeight: 600, color: colors.white, marginTop: 40, marginBottom: 12 };
  const p: React.CSSProperties = { fontSize: 14, color: colors.textMuted, lineHeight: 1.8, marginBottom: 16 };
  const li: React.CSSProperties = { fontSize: 14, color: colors.textMuted, lineHeight: 1.8, marginBottom: 8, paddingLeft: 8 };

  return (
    <div ref={ref}>
      <Helmet>
        <title>Termos de Uso — Stauf.</title>
        <meta name="description" content="Termos de uso da Stauf. Condições para utilização dos nossos serviços e produtos digitais." />
      </Helmet>

      <section style={{ padding: '140px 0 80px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
          <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, color: colors.brand, background: `${colors.brand}15`, border: `1px solid ${colors.brand}25`, marginBottom: 20 }}>
            TERMOS
          </span>
          <h1 className="reveal" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, color: colors.white, marginBottom: 16 }}>
            Termos de Uso
          </h1>
          <p className="reveal" style={{ fontSize: 13, color: colors.textDim }}>
            Última atualização: 28 de março de 2026
          </p>

          <div className="reveal" style={{ marginTop: 32, borderTop: `1px solid ${colors.border}`, paddingTop: 32 }}>
            <h2 style={h2}>1. Aceitação dos Termos</h2>
            <p style={p}>
              Ao acessar e utilizar os serviços da <strong style={{ color: colors.white }}>Stauf.</strong> — incluindo o site stauf.com.br, o aplicativo KillSpy e quaisquer outros produtos digitais — você concorda integralmente com estes Termos de Uso. Caso não concorde, interrompa o uso imediatamente.
            </p>

            <h2 style={h2}>2. Uso Aceitável</h2>
            <p style={p}>Ao utilizar nossos serviços, você se compromete a:</p>
            <ul style={{ listStyle: 'disc', paddingLeft: 24 }}>
              <li style={li}>Não utilizar os serviços para fins ilícitos, fraudulentos ou que violem direitos de terceiros</li>
              <li style={li}>Não tentar acessar sistemas, dados ou contas sem autorização</li>
              <li style={li}>Não distribuir malware, spam ou conteúdo malicioso através dos nossos serviços</li>
              <li style={li}>Não realizar engenharia reversa, descompilar ou modificar nossos softwares sem autorização expressa</li>
              <li style={li}>Fornecer informações verdadeiras e atualizadas ao criar contas ou contratar serviços</li>
              <li style={li}>Manter a confidencialidade das suas credenciais de acesso</li>
            </ul>
            <p style={p}>
              O descumprimento dessas condições pode resultar na suspensão ou encerramento da sua conta, sem aviso prévio e sem direito a reembolso.
            </p>

            <h2 style={h2}>3. Propriedade Intelectual</h2>
            <p style={p}>
              Todo o conteúdo disponibilizado nos serviços da Stauf. — incluindo, mas não se limitando a, código-fonte, design, textos, logotipos, ícones, imagens e marcas — é de propriedade exclusiva da <strong style={{ color: colors.white }}>Stauf.</strong> ou de seus licenciadores, protegido pelas leis brasileiras de propriedade intelectual (Lei 9.609/98, Lei 9.610/98).
            </p>
            <p style={p}>
              É proibida a reprodução, distribuição, modificação ou uso comercial de qualquer material sem autorização prévia e por escrito.
            </p>
            <p style={p}>
              Os sites, chatbots e automações desenvolvidos sob contrato para clientes são de propriedade do cliente contratante, conforme especificado no contrato de prestação de serviços.
            </p>

            <h2 style={h2}>4. Serviços e Disponibilidade</h2>
            <p style={p}>
              A Stauf. se esforça para manter seus serviços disponíveis 24/7, mas não garante disponibilidade ininterrupta. Manutenções programadas, atualizações e eventos fora do nosso controle podem causar indisponibilidades temporárias.
            </p>
            <p style={p}>
              Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer serviço, com aviso prévio razoável quando possível.
            </p>

            <h2 style={h2}>5. Limitação de Responsabilidade</h2>
            <p style={p}>
              A Stauf. não se responsabiliza por:
            </p>
            <ul style={{ listStyle: 'disc', paddingLeft: 24 }}>
              <li style={li}>Danos indiretos, incidentais, especiais ou consequenciais decorrentes do uso ou impossibilidade de uso dos serviços</li>
              <li style={li}>Perda de dados, lucros cessantes ou interrupção de negócios</li>
              <li style={li}>Conteúdo gerado por inteligência artificial que possa conter imprecisões</li>
              <li style={li}>Ações de terceiros que utilizem nossos serviços de forma indevida</li>
              <li style={li}>Indisponibilidade de serviços de terceiros integrados (APIs, provedores de hospedagem, etc.)</li>
            </ul>
            <p style={p}>
              Em qualquer caso, a responsabilidade total da Stauf. fica limitada ao valor pago pelo cliente nos últimos 12 meses pelo serviço específico que originou a reclamação.
            </p>

            <h2 style={h2}>6. Política de Reembolso</h2>
            <p style={p}>
              <strong style={{ color: colors.white }}>Serviços de desenvolvimento</strong> (sites, chatbots, automações): O reembolso segue o cronograma de entregas definido no contrato. Etapas já entregues e aprovadas não são reembolsáveis. Em caso de cancelamento antecipado, o cliente paga proporcionalmente ao trabalho realizado.
            </p>
            <p style={p}>
              <strong style={{ color: colors.white }}>KillSpy (produto digital)</strong>: Por se tratar de produto digital com entrega imediata, <strong style={{ color: colors.white }}>não há reembolso após a ativação da chave de licença</strong>, conforme o Art. 49, §1º do Código de Defesa do Consumidor aplicado a produtos digitais. Antes da ativação, o reembolso pode ser solicitado em até 7 dias corridos da compra.
            </p>
            <p style={p}>
              <strong style={{ color: colors.white }}>Assinaturas</strong>: Podem ser canceladas a qualquer momento. O acesso permanece ativo até o fim do período já pago. Não há reembolso proporcional do período restante.
            </p>

            <h2 style={h2}>7. Proteção de Dados e LGPD</h2>
            <p style={p}>
              A Stauf. trata dados pessoais em conformidade com a <strong style={{ color: colors.white }}>Lei Geral de Proteção de Dados (Lei 13.709/2018)</strong>. Para detalhes completos sobre coleta, uso e proteção dos seus dados, consulte nossa <a href="/privacidade" style={{ color: colors.brand, textDecoration: 'underline' }}>Política de Privacidade</a>.
            </p>
            <p style={p}>
              Ao utilizar nossos serviços, você consente com o tratamento dos seus dados conforme descrito na Política de Privacidade, para as finalidades ali especificadas.
            </p>

            <h2 style={h2}>8. Conta de Usuário</h2>
            <p style={p}>
              Para acessar determinados serviços (como o KillSpy), é necessário criar uma conta. Você é responsável por manter a segurança das suas credenciais e por todas as atividades realizadas com a sua conta.
            </p>
            <p style={p}>
              A Stauf. reserva-se o direito de suspender ou encerrar contas que violem estes termos, apresentem atividade suspeita ou permaneçam inativas por mais de 12 meses.
            </p>

            <h2 style={h2}>9. Comunicações</h2>
            <p style={p}>
              Ao criar uma conta ou entrar em contato conosco, você concorda em receber comunicações relacionadas ao serviço contratado (confirmações, atualizações de segurança, avisos importantes). Comunicações promocionais só são enviadas com consentimento explícito e podem ser canceladas a qualquer momento.
            </p>

            <h2 style={h2}>10. Alterações nos Termos</h2>
            <p style={p}>
              Estes termos podem ser atualizados periodicamente. Alterações significativas serão comunicadas por email ou aviso no site. O uso continuado dos serviços após a publicação das alterações constitui aceitação dos novos termos.
            </p>

            <h2 style={h2}>11. Legislação Aplicável e Foro</h2>
            <p style={p}>
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de <strong style={{ color: colors.white }}>Curitiba, Estado do Paraná</strong>, para dirimir quaisquer controvérsias decorrentes destes termos, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
            </p>

            <h2 style={h2}>12. Contato</h2>
            <p style={p}>
              Em caso de dúvidas sobre estes Termos de Uso, entre em contato:<br />
              <strong style={{ color: colors.white }}>Email:</strong> contato@stauf.com.br<br />
              <strong style={{ color: colors.white }}>WhatsApp:</strong> +55 (41) 98799-1419
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
