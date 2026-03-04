import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Github } from 'lucide-react';

export function Footer({ t, lang, colors }: any) {
  return (
    <footer style={{ borderTop: `1px solid ${colors.border}`, padding: '48px 0', width: '100%' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 40 }}>
          <div>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: colors.white }}>Glock<span style={{ color: colors.brand }}>.</span></span>
            </Link>
            <p style={{ fontSize: 13, color: colors.textDim, marginTop: 12, lineHeight: 1.6 }}>{lang === 'pt' ? 'Automação, Dados e IA' : 'Automation, Data & AI'}</p>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('footer.services')}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: t('svc.data.title'), to: '/servicos/extracao-de-dados' },
                { label: t('svc.auto.title'), to: '/servicos/automacao' },
                { label: t('svc.web.title'), to: '/servicos/sites' },
                { label: t('svc.consult.title'), to: '/servicos/consultoria-ia' },
              ].map((s) => (
                <li key={s.to}><Link to={s.to} style={{ fontSize: 14, color: colors.textDim, textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.color = colors.brand} onMouseLeave={e => e.currentTarget.style.color = colors.textDim}>{s.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('footer.company')}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><a href="/#sobre" style={{ fontSize: 14, color: colors.textDim, textDecoration: 'none' }}>{t('nav.about')}</a></li>
              <li><a href="/#cases" style={{ fontSize: 14, color: colors.textDim, textDecoration: 'none' }}>Cases</a></li>
              <li><a href="/#contato" style={{ fontSize: 14, color: colors.textDim, textDecoration: 'none' }}>{t('nav.contact')}</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('footer.contact')}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: colors.textDim }}>
              <li>+55 (41) 98799-1419</li>
              <li>contato@glock.dev</li>
              <li>Curitiba, PR</li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 32, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <p style={{ fontSize: 12, color: colors.footerBorder }}>&copy; {new Date().getFullYear()} Glock. {t('footer.rights')}</p>
          <div style={{ display: 'flex', gap: 16 }}>
            {[Instagram, Linkedin, Github].map((Icon, i) => (
              <a key={i} href={i === 2 ? 'https://github.com/baronglock' : '#'} target={i === 2 ? '_blank' : undefined} rel="noopener noreferrer"
                style={{ color: colors.footerBorder, transition: 'color 0.3s', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = colors.brand} onMouseLeave={e => e.currentTarget.style.color = colors.footerBorder}>
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
