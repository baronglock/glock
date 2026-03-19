import { Helmet } from 'react-helmet-async';
import { useTheme } from '../hooks/useTheme';
import { useReveal } from '../hooks/useReveal';

export function PrivacyPage() {
  const { colors } = useTheme();
  const ref = useReveal();

  const h2: React.CSSProperties = { fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', fontWeight: 600, color: colors.white, marginTop: 40, marginBottom: 12 };
  const p: React.CSSProperties = { fontSize: 14, color: colors.textMuted, lineHeight: 1.8, marginBottom: 16 };
  const li: React.CSSProperties = { fontSize: 14, color: colors.textMuted, lineHeight: 1.8, marginBottom: 8, paddingLeft: 8 };

  return (
    <div ref={ref}>
      <Helmet>
        <title>Política de Privacidade — Stauf.</title>
        <meta name="description" content="Política de privacidade da Stauf. Saiba como tratamos seus dados pessoais conforme a LGPD." />
      </Helmet>

      <section style={{ padding: '140px 0 80px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
          <span className="reveal" style={{ display: 'inline-block', padding: '4px 14px', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, color: colors.brand, background: `${colors.brand}15`, border: `1px solid ${colors.brand}25`, marginBottom: 20 }}>
            LGPD
          </span>
          <h1 className="reveal" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 300, color: colors.white, marginBottom: 16 }}>
            Política de Privacidade
          </h1>
          <p className="reveal" style={{ fontSize: 13, color: colors.textDim }}>
            Última atualização: 19 de março de 2026
          </p>

          <div className="reveal" style={{ marginTop: 32, borderTop: `1px solid ${colors.border}`, paddingTop: 32 }}>
            <h2 style={h2}>1. Quem somos</h2>
            <p style={p}>
              A <strong style={{ color: colors.white }}>Stauf.</strong> é uma empresa de tecnologia sediada em Curitiba, PR, especializada em automação com inteligência artificial, desenvolvimento web e consultoria em IA. Nosso site é <strong style={{ color: colors.white }}>stauf.com.br</strong>.
            </p>
            <p style={p}>
              Responsável pelo tratamento de dados: Gabriel Felipe Farias Glock<br />
              Contato: contato@stauf.com.br | +55 (41) 98799-1419
            </p>

            <h2 style={h2}>2. Dados que coletamos</h2>
            <p style={p}>Coletamos apenas dados fornecidos voluntariamente por você:</p>
            <ul style={{ listStyle: 'disc', paddingLeft: 24 }}>
              <li style={li}>Nome, WhatsApp e mensagem enviados pelo formulário de contato</li>
              <li style={li}>Dados de navegação básicos (cookies essenciais para funcionamento do site)</li>
            </ul>
            <p style={p}><strong style={{ color: colors.white }}>Não coletamos</strong> dados sensíveis, dados de localização, nem utilizamos rastreadores de terceiros (Google Analytics, Meta Pixel, etc.).</p>

            <h2 style={h2}>3. Finalidade do tratamento</h2>
            <p style={p}>Seus dados são utilizados exclusivamente para:</p>
            <ul style={{ listStyle: 'disc', paddingLeft: 24 }}>
              <li style={li}>Responder solicitações de contato</li>
              <li style={li}>Enviar propostas comerciais solicitadas</li>
              <li style={li}>Salvar preferências de tema (claro/escuro) e idioma</li>
            </ul>

            <h2 style={h2}>4. Base legal (LGPD Art. 7º)</h2>
            <p style={p}>
              O tratamento dos seus dados se baseia no <strong style={{ color: colors.white }}>consentimento</strong> (formulário de contato) e no <strong style={{ color: colors.white }}>legítimo interesse</strong> (cookies essenciais de preferência).
            </p>

            <h2 style={h2}>5. Compartilhamento de dados</h2>
            <p style={p}>
              <strong style={{ color: colors.white }}>Não compartilhamos, vendemos ou alugamos</strong> seus dados pessoais com terceiros. Os dados de contato são recebidos exclusivamente via WhatsApp e tratados internamente.
            </p>

            <h2 style={h2}>6. Retenção de dados</h2>
            <p style={p}>
              Dados de contato são mantidos pelo período necessário para atendimento da solicitação. Preferências de tema e idioma ficam armazenadas localmente no seu navegador (localStorage) e podem ser apagadas a qualquer momento limpando os dados do navegador.
            </p>

            <h2 style={h2}>7. Seus direitos (LGPD Art. 18)</h2>
            <p style={p}>Você tem direito a:</p>
            <ul style={{ listStyle: 'disc', paddingLeft: 24 }}>
              <li style={li}>Confirmar a existência de tratamento dos seus dados</li>
              <li style={li}>Acessar seus dados</li>
              <li style={li}>Corrigir dados incompletos ou desatualizados</li>
              <li style={li}>Solicitar a eliminação dos seus dados</li>
              <li style={li}>Revogar consentimento a qualquer momento</li>
            </ul>
            <p style={p}>
              Para exercer qualquer desses direitos, entre em contato pelo email <strong style={{ color: colors.white }}>contato@stauf.com.br</strong>. Respondemos em até <strong style={{ color: colors.white }}>15 dias úteis</strong>.
            </p>

            <h2 style={h2}>8. Cookies</h2>
            <p style={p}>
              Utilizamos apenas <strong style={{ color: colors.white }}>cookies essenciais</strong> (localStorage) para salvar suas preferências de tema e idioma. Não utilizamos cookies de rastreamento, analytics ou publicidade.
            </p>

            <h2 style={h2}>9. Segurança</h2>
            <p style={p}>
              Adotamos medidas técnicas de segurança como HTTPS (TLS), headers de proteção (CSP, HSTS, X-Frame-Options) e boas práticas de desenvolvimento para proteger seus dados contra acesso não autorizado.
            </p>

            <h2 style={h2}>10. Alterações</h2>
            <p style={p}>
              Esta política pode ser atualizada periodicamente. A data da última atualização está indicada no topo desta página. Recomendamos a consulta periódica.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
