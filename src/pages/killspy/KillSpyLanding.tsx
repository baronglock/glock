import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mic, Camera, Wifi, MapPin, Keyboard, Eye, Download, ChevronRight, Lock, CheckCircle2, Search } from 'lucide-react';

/* ── Stauf palette with security twist ── */
const ks = {
  bg: '#0a0a0f',
  bgCard: '#0f1018',
  teal: '#2dd4bf',
  tealDim: 'rgba(45,212,191,0.12)',
  tealGlow: 'rgba(45,212,191,0.25)',
  red: '#ef4444',
  redDim: 'rgba(239,68,68,0.12)',
  redGlow: 'rgba(239,68,68,0.3)',
  green: '#22c55e',
  greenDim: 'rgba(34,197,94,0.12)',
  text: '#e8e8e8',
  muted: '#888',
  border: 'rgba(45,212,191,0.1)',
  mono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
  sans: "'Inter', system-ui, sans-serif",
};

/* ── Scroll reveal ── */
function Rv({ children, d = 0 }: { children: React.ReactNode; d?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: 0.05 });
    o.observe(el); return () => o.disconnect();
  }, []);
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? 'none' : 'translateY(20px)', transition: `all 0.6s ease ${d}ms` }}>{children}</div>;
}

/* ── Terminal typing animation ── */
function TerminalTyping() {
  const lines = [
    { text: '$ killspy --scan --deep', color: ks.teal, delay: 0 },
    { text: '[scanning] Verificando 847 processos...', color: ks.muted, delay: 1200 },
    { text: '[!] com.samsung.android.vocalassist — MIC ATIVO', color: ks.red, delay: 2400 },
    { text: '[!] com.instagram.android — CAM ATIVO em background', color: ks.red, delay: 3200 },
    { text: '[!] com.google.android.googlequicksearchbox — KEYLOGGER', color: ks.red, delay: 4000 },
    { text: '[RESULTADO] 47 ameaças detectadas', color: ks.red, delay: 5000 },
    { text: '$ killspy --protect --all', color: ks.teal, delay: 6200 },
    { text: '[✓] Todas as ameaças eliminadas. Dispositivo protegido.', color: ks.green, delay: 7400 },
  ];

  const [visibleLines, setVisibleLines] = useState(0);
  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    if (visibleLines >= lines.length) return;
    const timer = setTimeout(() => {
      setVisibleLines(v => v + 1);
      setTypedChars(0);
    }, lines[visibleLines]?.delay || 1000);
    return () => clearTimeout(timer);
  }, [visibleLines]);

  useEffect(() => {
    if (visibleLines === 0 || visibleLines > lines.length) return;
    const currentLine = lines[visibleLines - 1];
    if (typedChars >= currentLine.text.length) return;
    const timer = setTimeout(() => setTypedChars(c => c + 1), 20);
    return () => clearTimeout(timer);
  }, [typedChars, visibleLines]);

  return (
    <div style={{
      background: '#0d0d14', border: `1px solid ${ks.border}`, borderRadius: 12,
      padding: '20px 24px', fontFamily: ks.mono, fontSize: 13, lineHeight: 2,
      maxWidth: 600, width: '100%', boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)`,
      overflow: 'hidden',
    }}>
      {/* Terminal header */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
        <span style={{ fontSize: 11, color: ks.muted, marginLeft: 8 }}>killspy v2.1 — terminal</span>
      </div>
      {lines.slice(0, visibleLines).map((line, i) => {
        const isCurrentLine = i === visibleLines - 1;
        const displayText = isCurrentLine ? line.text.slice(0, typedChars) : line.text;
        return (
          <div key={i} style={{ color: line.color, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {displayText}
            {isCurrentLine && typedChars < line.text.length && <span style={{ animation: 'blink 0.8s infinite', color: ks.teal }}>▌</span>}
          </div>
        );
      })}
      {visibleLines === 0 && <span style={{ color: ks.teal, animation: 'blink 0.8s infinite' }}>▌</span>}
    </div>
  );
}

/* ── Threat Card ── */
function ThreatCard({ icon: Icon, title, desc, delay }: { icon: any; title: string; desc: string; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Rv d={delay}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{
          padding: '24px 20px', background: hovered ? `${ks.redDim}` : ks.bgCard,
          border: `1px solid ${hovered ? 'rgba(239,68,68,0.25)' : ks.border}`,
          borderRadius: 12, transition: 'all 0.3s', cursor: 'default',
          boxShadow: hovered ? `0 0 30px ${ks.redGlow}` : 'none',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: ks.redDim, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={20} color={ks.red} />
          </div>
          {/* Pulsing red dot */}
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: ks.red, boxShadow: `0 0 8px ${ks.redGlow}`, animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 11, fontFamily: ks.mono, color: ks.red, fontWeight: 600, letterSpacing: '0.05em' }}>ATIVO</span>
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: ks.text, marginBottom: 6 }}>{title}</h3>
        <p style={{ fontSize: 13, color: ks.muted, lineHeight: 1.7 }}>{desc}</p>
      </div>
    </Rv>
  );
}

/* ── Plan Card ── */
function PlanCard({ name, price, period, features, popular, cta, planType }: {
  name: string; price: string; period: string; features: string[]; popular?: boolean; cta: string; planType: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [showPayOpts, setShowPayOpts] = useState(false);

  const handlePay = async (mode: 'once' | 'recurring' | 'whatsapp') => {
    if (mode === 'whatsapp') {
      const prices: Record<string, string> = { S: 'R$18,50', M: 'R$37,90', A: 'R$379,99' };
      const msg = encodeURIComponent(`Oi! Quero adquirir o KillSpy ${name} por PIX (${prices[planType] || price})`);
      window.open(`https://wa.me/5541988242456?text=${msg}`, '_blank');
      return;
    }
    const { getSession, createCheckout } = await import('./killspy-api');
    const session = await getSession();
    if (!session) { window.location.href = '/conta/register'; return; }
    try { await createCheckout(planType as 'S' | 'M' | 'A', mode); } catch (e: any) { alert(e.message); }
  };

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        padding: popular ? 36 : 28, background: popular ? `${ks.tealDim}` : ks.bgCard,
        border: `1px solid ${popular ? `rgba(45,212,191,0.25)` : ks.border}`,
        borderRadius: 16, position: 'relative', display: 'flex', flexDirection: 'column', height: '100%',
        transform: popular ? 'scale(1.04)' : hovered ? 'translateY(-4px)' : 'none',
        boxShadow: popular ? `0 16px 48px ${ks.tealGlow}` : hovered ? `0 8px 32px rgba(0,0,0,0.3)` : 'none',
        transition: 'all 0.3s',
      }}>
      {popular && <span style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', padding: '5px 20px', background: ks.teal, color: ks.bg, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 20 }}>Mais popular</span>}
      <h3 style={{ fontSize: 18, fontWeight: 600, color: ks.text, marginBottom: 8 }}>{name}</h3>
      <div style={{ marginBottom: 4 }}>
        <span style={{ fontSize: 36, fontWeight: 800, color: popular ? ks.teal : ks.text }}>{price}</span>
      </div>
      <p style={{ fontSize: 12, color: ks.muted, marginBottom: 24 }}>{period}</p>
      <ul style={{ listStyle: 'none', padding: 0, flex: 1 }}>
        {features.map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', fontSize: 13, color: `${ks.text}cc`, borderTop: i > 0 ? `1px solid ${ks.border}` : 'none' }}>
            <CheckCircle2 size={14} color={ks.teal} />
            {f}
          </li>
        ))}
      </ul>
      {!showPayOpts ? (
        <button onClick={() => setShowPayOpts(true)} style={{
          display: 'block', width: '100%', padding: 14, marginTop: 20, textAlign: 'center',
          background: popular ? ks.teal : 'transparent', color: popular ? ks.bg : ks.teal,
          border: popular ? 'none' : `1px solid rgba(45,212,191,0.25)`, borderRadius: 10,
          fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', cursor: 'pointer',
          transition: 'all 0.3s', boxShadow: popular ? `0 4px 20px ${ks.tealGlow}` : 'none',
          boxSizing: 'border-box',
        }}>{cta}</button>
      ) : (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 10, color: ks.muted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 2 }}>Escolha como pagar:</span>
          <button onClick={() => handlePay('once')} style={{
            width: '100%', padding: 11, background: ks.tealDim, color: ks.teal,
            border: `1px solid rgba(45,212,191,0.2)`, borderRadius: 8,
            fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'left',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>PIX / Boleto / Cartão</span>
            <span style={{ fontSize: 10, color: ks.muted }}>pagamento único</span>
          </button>
          {planType !== 'S' && (
            <button onClick={() => handlePay('recurring')} style={{
              width: '100%', padding: 11, background: 'rgba(168,85,247,0.06)', color: '#a855f7',
              border: '1px solid rgba(168,85,247,0.15)', borderRadius: 8,
              fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'left',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>Cartão recorrente</span>
              <span style={{ fontSize: 10, color: ks.muted }}>cobra automático</span>
            </button>
          )}
          <button onClick={() => handlePay('whatsapp')} style={{
            width: '100%', padding: 11, background: 'rgba(37,211,102,0.06)', color: '#25d366',
            border: '1px solid rgba(37,211,102,0.15)', borderRadius: 8,
            fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'left',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>WhatsApp (PIX direto)</span>
            <span style={{ fontSize: 10, color: '#25d366' }}>~5% desconto</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   KILLSPY LANDING PAGE
   Stauf brand + security/hacker elements
   ════════════════════════════════════════════ */
export default function KillSpyLanding() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Pre-load Supabase session on page load + check auth
  useEffect(() => {
    import('./killspy-api').then(async (m) => {
      m.wakeUp();
      const session = await m.getSession();
      setIsLoggedIn(!!session);
    });
  }, []);

  const accountUrl = isLoggedIn ? '/conta/dashboard' : '/conta/register';

  return (
    <div style={{ background: ks.bg, color: ks.text, fontFamily: ks.sans, minHeight: '100vh' }}>

      {/* ═══ TEXTURE LAYERS — HD security/tech theme ═══ */}
      {/* Layer 1: Circuit board — tech/hardware feel, very subtle */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <img src="/texture-circuit.webp" alt="" loading="eager" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.06, mixBlendMode: 'screen', filter: 'saturate(0) contrast(1.3)' }} />
      </div>
      {/* Layer 2: Film grain — subtle organic texture */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'url(/texture-film-grain.webp)', backgroundRepeat: 'repeat', backgroundSize: '512px',
        opacity: 0.04, mixBlendMode: 'overlay' }} />

      {/* ═══ NAVBAR ═══ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '16px clamp(24px, 5vw, 64px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: `${ks.bg}e0`, backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${ks.border}`,
      }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none', lineHeight: 1 }}>
          <img src="/stauf-icon.png" alt="Stauf" width={22} height={22} style={{ objectFit: 'contain' }} />
          <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>TAUF<span style={{ color: ks.teal }}>.</span></span>
          <span style={{ color: ks.muted, fontSize: 11, margin: '0 4px' }}>›</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Shield size={15} color={ks.teal} />
            <span style={{ color: ks.text, fontSize: 14, fontWeight: 600 }}>KillSpy</span>
          </div>
        </Link>
        <div className="killspy-nav-links" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="#ameacas" style={{ color: ks.muted, textDecoration: 'none', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Ameaças</a>
          <a href="#protecao" style={{ color: ks.muted, textDecoration: 'none', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Proteção</a>
          <a href="#planos" style={{ color: ks.muted, textDecoration: 'none', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Planos</a>
          <a href={accountUrl} className="killspy-nav-download" style={{ padding: '8px 20px', background: ks.teal, color: ks.bg, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Download size={14} />
            Baixar APK
          </a>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '140px 32px 80px', position: 'relative' }}>
        {/* Teal glow */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '40%', height: '40%', background: `radial-gradient(circle, ${ks.tealGlow} 0%, transparent 50%)`, filter: 'blur(100px)', pointerEvents: 'none' }} />
        {/* Red glow accent */}
        <div style={{ position: 'absolute', top: '40%', right: '15%', width: '20%', height: '20%', background: `radial-gradient(circle, ${ks.redGlow} 0%, transparent 50%)`, filter: 'blur(80px)', pointerEvents: 'none', opacity: 0.3 }} />

        <div className="killspy-hero-grid" style={{ maxWidth: 1000, width: '100%', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 56, alignItems: 'center', position: 'relative', zIndex: 2 }}>
          {/* Left — text */}
          <div>
            {/* KillSpy logo */}
            <img src="/killspy-logo.png" alt="KillSpy" style={{ width: 72, height: 72, borderRadius: 16, marginBottom: 20, boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${ks.tealGlow}` }} />

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: ks.redDim, border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 20, marginBottom: 24 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: ks.red, animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: ks.red, letterSpacing: '0.06em' }}>47 ameaças detectadas no dispositivo médio</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-0.02em' }}>
              Seu celular<br />
              <span style={{ color: ks.red }}>escuta tudo</span><br />
              que você fala.
            </h1>

            <p style={{ fontSize: 16, color: ks.muted, lineHeight: 1.9, maxWidth: 460, marginBottom: 32 }}>
              Instagram, TikTok, Samsung, Google — todos acessando seu microfone e câmera em background. O <span style={{ color: ks.teal, fontWeight: 600 }}>KillSpy</span> detecta e elimina.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href={accountUrl} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '16px 32px', background: ks.teal, color: ks.bg, border: 'none', borderRadius: 10,
                fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 32px ${ks.tealGlow}`,
                transition: 'all 0.3s', textDecoration: 'none',
              }}>
                <Download size={18} />
                Começar grátis
              </a>
              <a href="#planos" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '16px 32px', background: 'transparent', color: ks.teal,
                border: `1px solid rgba(45,212,191,0.25)`, borderRadius: 10,
                fontSize: 14, fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
                transition: 'all 0.3s',
              }}>
                Ver Planos
                <ChevronRight size={16} />
              </a>
            </div>

            <p style={{ fontSize: 11, color: ks.muted, marginTop: 16 }}>Cadastre-se grátis. App disponível em breve para Android 11+.</p>
          </div>

          {/* Right — terminal */}
          <TerminalTyping />
        </div>
      </section>

      {/* ═══ THREATS ═══ */}
      <section id="ameacas" style={{ padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Rv><div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', color: ks.red, textTransform: 'uppercase' }}>Ameaças Reais</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, marginTop: 10, letterSpacing: '-0.02em' }}>
              O que está rodando no <span style={{ color: ks.red }}>seu celular</span> agora
            </h2>
            <p style={{ fontSize: 14, color: ks.muted, marginTop: 12, maxWidth: 500, margin: '12px auto 0' }}>
              Cada um desses processos foi encontrado em dispositivos reais durante nossos testes.
            </p>
          </div></Rv>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            <ThreatCard icon={Mic} title="Microfone em background" desc="Samsung, Google e redes sociais acessam seu microfone mesmo com a tela desligada." delay={0} />
            <ThreatCard icon={Camera} title="Câmera como sensor" desc="A câmera frontal é usada como sensor de luz. Seu rosto é capturado sem você saber." delay={80} />
            <ThreatCard icon={Keyboard} title="Keylogger nativo" desc="O teclado do Google registra tudo que você digita — senhas, mensagens, buscas." delay={160} />
            <ThreatCard icon={Wifi} title="Dados enviados em background" desc="Apps enviam pacotes para servidores desconhecidos mesmo quando você não está usando." delay={240} />
            <ThreatCard icon={MapPin} title="Localização 24h" desc="GPS ativo permanentemente. Seu histórico de localização é vendido para anunciantes." delay={320} />
            <ThreatCard icon={Eye} title="DSP sempre ligado" desc="Um chip dentro do celular fica escutando 24h esperando 'Ok Google'. Pra ouvir isso, escuta tudo." delay={400} />
          </div>

          {/* After threats — solution banner */}
          <Rv d={500}><div style={{
            marginTop: 40, padding: '24px 32px', borderRadius: 12,
            background: ks.greenDim, border: `1px solid rgba(34,197,94,0.2)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          }}>
            <Shield size={20} color={ks.green} />
            <span style={{ fontSize: 15, fontWeight: 600, color: ks.green }}>O KillSpy detecta e elimina todas essas ameaças em minutos.</span>
          </div></Rv>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="protecao" style={{ padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 64px)', background: '#0d0d14' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Rv><div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', color: ks.teal, textTransform: 'uppercase' }}>Como funciona</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, marginTop: 10 }}>Proteção em <span style={{ color: ks.teal }}>4 passos</span></h2>
          </div></Rv>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }} className="killspy-steps">
            {[
              { icon: Download, title: 'Baixe o APK', desc: 'Download grátis, sem cadastro. Instala em 30 segundos.' },
              { icon: Search, title: 'Scan grátis', desc: 'O app escaneia todos os processos do celular e mostra as ameaças.' },
              { icon: Eye, title: 'Veja as ameaças', desc: 'Lista completa: quem acessa mic, cam, teclado, rede, GPS.' },
              { icon: Shield, title: 'Ative a proteção', desc: 'Com a licença, o KillSpy elimina tudo e monitora em tempo real.' },
            ].map((step, i) => (
              <Rv key={i} d={i * 100}>
                <div style={{ textAlign: 'center', padding: 24 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 14, background: ks.tealDim,
                    border: `1px solid rgba(45,212,191,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}>
                    <step.icon size={24} color={ks.teal} />
                  </div>
                  <div style={{ fontFamily: ks.mono, fontSize: 11, color: ks.teal, marginBottom: 8 }}>0{i + 1}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: ks.text, marginBottom: 8 }}>{step.title}</h3>
                  <p style={{ fontSize: 13, color: ks.muted, lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </Rv>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW TO START — Criar conta + fluxo ═══ */}
      <section style={{ padding: 'clamp(60px, 8vw, 80px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Rv><div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', color: ks.teal, textTransform: 'uppercase' }}>Começar</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, marginTop: 10 }}>Como <span style={{ color: ks.teal }}>ativar</span> a proteção</h2>
          </div></Rv>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }} className="killspy-steps">
            {[
              { n: '01', title: 'Crie sua conta', desc: 'Cadastro gratuito no site. Leva 30 segundos.', icon: '◎' },
              { n: '02', title: 'Escolha seu plano', desc: 'Scan único, mensal ou anual. Pague com PIX ou cartão.', icon: '◇' },
              { n: '03', title: 'Receba sua chave', desc: 'A chave aparece no seu dashboard. Copie e cole no app.', icon: '◈' },
              { n: '04', title: 'Proteja seu celular', desc: 'O app desbloqueia e elimina todas as ameaças.', icon: '△' },
            ].map((s, i) => (
              <Rv key={i} d={i * 80}>
                <div style={{ padding: '28px 20px', background: ks.bgCard, border: `1px solid ${ks.border}`, borderTop: `2px solid ${ks.teal}`, textAlign: 'center' }}>
                  <span style={{ fontFamily: ks.mono, fontSize: 11, color: ks.teal }}>{s.n}</span>
                  <div style={{ fontSize: 24, color: ks.teal, margin: '12px 0', lineHeight: 1 }}>{s.icon}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: ks.text, marginBottom: 6 }}>{s.title}</h3>
                  <p style={{ fontSize: 12, color: ks.muted, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </Rv>
            ))}
          </div>

          <Rv d={400}><div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link to={accountUrl} style={{
              display: 'inline-block', padding: '14px 36px', background: ks.teal, color: ks.bg, border: 'none', borderRadius: 10,
              fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: `0 4px 20px ${ks.tealGlow}`,
            }}>Criar conta grátis</Link>
          </div></Rv>
        </div>
      </section>

      {/* ═══ PRICING — APP PLANS ═══ */}
      <section id="planos" style={{ padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 64px)', background: '#0d0d14' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Rv><div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', color: ks.teal, textTransform: 'uppercase' }}>Planos do App</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, marginTop: 10 }}>Proteja seu dispositivo</h2>
            <p style={{ fontSize: 14, color: ks.muted, marginTop: 12 }}>Scan gratuito. Pague só se quiser ativar a proteção.</p>
          </div></Rv>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, alignItems: 'stretch' }} className="killspy-plans">
            <Rv><PlanCard planType="S"
              name="Varredura" price="R$19,90" period="uso único (24h)"
              features={['1 scan completo', 'Limpeza + proteção por 24h', 'Relatório de ameaças', 'Suporte WhatsApp']}
              cta="Começar scan"
            /></Rv>
            <Rv d={100}><PlanCard planType="M"
              name="Premium Mensal" price="R$39,90" period="por mês"
              features={['Scans ilimitados', 'Proteção em tempo real', 'Frost Guard (mic/cam)', 'Monitor de processos', 'Alertas instantâneos', 'Suporte prioritário']}
              popular cta="Assinar agora"
            /></Rv>
            <Rv d={200}><PlanCard planType="A"
              name="Premium Anual" price="R$399,99" period="por ano (R$33,33/mês)"
              features={['Tudo do Premium Mensal', '16% de desconto', 'Proteção em tempo real', 'Frost Guard (mic/cam)', 'Monitor de processos', 'Suporte VIP']}
              cta="Economizar 16%"
            /></Rv>
          </div>
        </div>
      </section>

      {/* ═══ PROTEÇÃO MÁXIMA — presencial, abaixo dos planos ═══ */}
      <Rv><div style={{ maxWidth: 900, margin: '0 auto', padding: '40px clamp(24px, 5vw, 64px)' }}>
        <div style={{
          padding: '24px 28px', borderRadius: 12,
          background: ks.bgCard, border: `1px solid ${ks.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Lock size={18} color={ks.teal} />
            <div>
              <span style={{ fontSize: 13, fontWeight: 600, color: ks.text }}>Quer proteção 100%?</span>
              <p style={{ fontSize: 12, color: ks.muted, marginTop: 2 }}>Serviço presencial em Curitiba: Custom ROM (GrapheneOS ou LineageOS). Remove o Google completamente. Zero espionagem.</p>
            </div>
          </div>
          <span style={{ fontSize: 12, color: ks.teal, fontWeight: 600, whiteSpace: 'nowrap' }}>R$400 fixo →</span>
        </div>
      </div></Rv>

      {/* ═══ PROGRAMA DE INDICAÇÃO ═══ */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 64px)', background: '#0d0d14' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Rv><div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', color: ks.green, textTransform: 'uppercase' }}>Programa de Indicação</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, marginTop: 10 }}>
              Indique e <span style={{ color: ks.green }}>ganhe dinheiro</span>
            </h2>
            <p style={{ fontSize: 14, color: ks.muted, marginTop: 12, maxWidth: 500, margin: '12px auto 0' }}>
              Cada pessoa que assinar pelo seu link te dá comissão. O saldo acumula no seu dashboard e você saca via PIX.
            </p>
          </div></Rv>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="killspy-ref-grid">
            {/* Como funciona */}
            <Rv><div style={{ padding: 28, background: ks.bgCard, border: `1px solid ${ks.border}`, borderRadius: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: ks.text, marginBottom: 20 }}>Como funciona</h3>
              {[
                'Crie sua conta e receba seu link único de indicação',
                'Compartilhe com amigos, família, redes sociais',
                'Quem assinar pelo seu link ganha 20% de desconto',
                'Você recebe 30% de comissão de cada venda',
                'Acompanhe tudo no seu dashboard em tempo real',
                'Saque a qualquer momento via PIX (mín. R$20)',
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderTop: i > 0 ? `1px solid ${ks.border}` : 'none' }}>
                  <span style={{ fontFamily: ks.mono, fontSize: 11, color: ks.green, marginTop: 2, flexShrink: 0 }}>0{i + 1}</span>
                  <span style={{ fontSize: 13, color: `${ks.text}cc` }}>{step}</span>
                </div>
              ))}
            </div></Rv>

            {/* Quanto você ganha */}
            <Rv d={150}><div style={{ padding: 28, background: ks.bgCard, border: `1px solid ${ks.border}`, borderRadius: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: ks.text, marginBottom: 20 }}>Quanto você ganha</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { plan: 'Scan Único', price: 'R$19,90', you: 'R$6,00', color: ks.teal },
                  { plan: 'Premium Mensal', price: 'R$39,90', you: 'R$12,00', color: ks.green },
                  { plan: 'Premium Anual', price: 'R$399,99', you: 'R$120,00', color: ks.green },
                ].map((row, i) => (
                  <div key={i} style={{
                    padding: '16px 18px', background: `${row.color}08`, border: `1px solid ${row.color}15`,
                    borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: ks.text }}>{row.plan}</div>
                      <div style={{ fontSize: 11, color: ks.muted }}>Preço: {row.price}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: row.color }}>{row.you}</div>
                      <div style={{ fontSize: 10, color: ks.muted }}>por indicação</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: '12px 16px', background: ks.greenDim, borderRadius: 8, textAlign: 'center' }}>
                <span style={{ fontSize: 12, color: ks.green, fontWeight: 600 }}>10 indicações no plano anual = R$1.200 no seu bolso</span>
              </div>
            </div></Rv>
          </div>

          <Rv d={300}><div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link to={accountUrl} style={{
              display: 'inline-block', padding: '14px 36px', background: ks.green, color: '#000', border: 'none', borderRadius: 10,
              fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: `0 4px 20px rgba(34,197,94,0.25)`,
            }}>Criar conta e começar a indicar</Link>
          </div></Rv>
        </div>
      </section>

      {/* ═══ FEAR STAT ═══ */}
      <div style={{ padding: '24px clamp(24px, 5vw, 64px)', background: ks.redDim, borderTop: `1px solid rgba(239,68,68,0.15)`, borderBottom: `1px solid rgba(239,68,68,0.15)` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: ks.red, fontWeight: 500 }}>
            "Pra ouvir 'Ok Google', ele precisa escutar <strong>tudo</strong> o tempo <strong>todo</strong>. É como ter um funcionário escondido no canto da sala ouvindo tudo que você fala."
          </p>
        </div>
      </div>

      {/* ═══ FAQ ═══ */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 650, margin: '0 auto' }}>
          <Rv><div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', color: ks.teal, textTransform: 'uppercase' }}>FAQ</span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, marginTop: 10 }}>Perguntas frequentes</h2>
          </div></Rv>

          {[
            { q: 'O app precisa de internet?', a: 'Não. Roda 100% offline no seu celular. Nenhum dado sai do dispositivo.' },
            { q: 'Funciona em iPhone?', a: 'Não, apenas Android 11 ou superior. O iOS não permite o nível de acesso necessário para eliminar ameaças. Para Android abaixo de 11, oferecemos serviço presencial.' },
            { q: 'Modo avião não resolve?', a: 'Modo avião desliga a internet, mas o microfone e câmera continuam gravando e armazenando. Quando você desligar, enviam tudo de uma vez.' },
            { q: 'Como recebo a chave de licença?', a: 'No seu dashboard após o pagamento. Também enviamos por email. Basta digitar a chave no app.' },
            { q: 'Posso usar em mais de 1 celular?', a: '1 chave = 1 dispositivo. Para múltiplos celulares, entre em contato para desconto de volume.' },
            { q: 'A proteção sobrevive reinício?', a: 'Sim. As configurações de segurança aplicadas pelo KillSpy sobrevivem reinícios. Só atualizações do sistema podem resetar algumas configurações.' },
          ].map((item, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${ks.border}` }}>
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{
                width: '100%', padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: ks.text, textAlign: 'left' }}>{item.q}</span>
                <span style={{ color: ks.teal, fontSize: 18, transition: 'transform 0.3s', transform: faqOpen === i ? 'rotate(45deg)' : 'none', flexShrink: 0, marginLeft: 16 }}>+</span>
              </button>
              <div style={{ maxHeight: faqOpen === i ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
                <p style={{ fontSize: 13, color: ks.muted, lineHeight: 1.8, paddingBottom: 20 }}>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) clamp(24px, 5vw, 64px)', background: '#0d0d14', textAlign: 'center' }}>
        <Rv>
          <Shield size={48} color={ks.teal} style={{ margin: '0 auto 20px', opacity: 0.8 }} />
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, marginBottom: 16 }}>
            Descubra o que está rodando<br />no <span style={{ color: ks.red }}>seu celular</span>.
          </h2>
          <p style={{ fontSize: 15, color: ks.muted, marginBottom: 32, maxWidth: 450, margin: '0 auto 32px' }}>
            Crie sua conta agora e seja o primeiro a testar quando lançar.
          </p>
          <a href={accountUrl} style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '18px 44px', background: ks.teal, color: ks.bg, border: 'none', borderRadius: 12,
            fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 40px ${ks.tealGlow}`,
            transition: 'all 0.3s', textDecoration: 'none',
          }}>
            <Download size={20} />
            Criar conta grátis
          </a>
        </Rv>
      </section>

      {/* ═══ FOOTER ═══ */}
      {/* ═══ BANNER FIXO — Conheça outros produtos (acompanha scroll) ═══ */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999,
        padding: '10px 24px',
        background: `${ks.bg}f5`, backdropFilter: 'blur(16px)',
        borderTop: `1px solid ${ks.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <img src="/stauf-icon.png" alt="S" width={16} height={16} style={{ objectFit: 'contain' }} />
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: '#fff' }}>TAUF<span style={{ color: ks.teal }}>.</span></span>
          </span>
          <span className="killspy-banner-text" style={{ color: ks.muted, fontSize: 11 }}>Sites, automação, chatbots, dashboards e mais</span>
        </div>
        <Link to="/" style={{
          padding: '6px 18px', background: ks.teal, color: ks.bg, borderRadius: 8,
          fontSize: 11, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.03em',
          transition: 'all 0.2s',
        }}>Conheça nossos serviços →</Link>
      </div>

      <footer style={{ padding: '24px clamp(24px, 5vw, 64px) 56px', borderTop: `1px solid ${ks.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <img src="/stauf-icon.png" alt="S" width={16} height={16} style={{ objectFit: 'contain' }} />
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: '#fff' }}>TAUF<span style={{ color: ks.teal }}>.</span></span>
          </span>
          <span style={{ color: ks.muted, fontSize: 11 }}>KillSpy — Mobile Privacy Shield</span>
        </div>
        <Link to="/" style={{ color: ks.muted, fontSize: 11, textDecoration: 'none' }}>← Voltar ao site principal</Link>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @media(max-width:900px){
          .killspy-hero-grid{grid-template-columns:1fr!important;gap:32px!important}
          .killspy-plans{grid-template-columns:1fr!important}
          .killspy-ref-grid{grid-template-columns:1fr!important}
        }
        @media(max-width:768px){
          .killspy-nav-links{display:none!important}
          .killspy-nav-download{display:none!important}
          .killspy-steps{grid-template-columns:1fr 1fr!important}
          .killspy-banner-text{display:none!important}
          section{padding-left:16px!important;padding-right:16px!important}
          h1{font-size:1.8rem!important;line-height:1.2!important}
          h2{font-size:1.3rem!important}
          nav{padding:10px 16px!important}
        }
        @media(max-width:480px){
          .killspy-steps{grid-template-columns:1fr!important}
          h1{font-size:1.5rem!important}
          h2{font-size:1.1rem!important}
        }
      `}</style>
    </div>
  );
}
