import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Clock, Shield, CheckCircle2 } from 'lucide-react';
import { getSession, getProfile, supabase } from './killspy-api';

const ks = {
  bg: '#0a0a0f', bgCard: '#0f1018', teal: '#2dd4bf', tealDim: 'rgba(45,212,191,0.12)',
  tealGlow: 'rgba(45,212,191,0.25)', green: '#22c55e', greenDim: 'rgba(34,197,94,0.08)',
  amber: '#f59e0b', amberDim: 'rgba(245,158,11,0.08)',
  text: '#e8e8e8', muted: '#888', border: 'rgba(45,212,191,0.1)',
  mono: "'JetBrains Mono','Fira Code',monospace", sans: "'Inter',system-ui,sans-serif",
};

const PIX_KEY = 'gabrielglock636@gmail.com';
const PIX_NAME = 'Gabriel Glock — Stauf.';

const PLANS: Record<string, { name: string; price: number; label: string; days: number }> = {
  S: { name: 'Limpeza', price: 18.50, label: 'Limpeza (1 dia)', days: 1 },
  M: { name: 'Premium Mensal', price: 37.90, label: 'Premium Mensal', days: 30 },
  A: { name: 'Premium Anual', price: 379.99, label: 'Premium Anual', days: 365 },
};

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: copied ? ks.greenDim : ks.tealDim, border: `1px solid ${copied ? 'rgba(34,197,94,0.2)' : ks.border}`, borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: copied ? ks.green : ks.teal, transition: 'all 0.2s', width: '100%', justifyContent: 'center' }}>
      {copied ? <><Check size={15} /> Copiado!</> : <><Copy size={15} /> Copiar código PIX</>}
    </button>
  );
}

export default function KillSpyPix() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planType = searchParams.get('plan') || 'M';
  const plan = PLANS[planType] || PLANS.M;

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const session = await getSession();
    if (!session) { navigate('/conta/login'); return; }
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    const p = await getProfile();
    setProfile(p);
    setLoading(false);
  };

  const handlePaid = async () => {
    if (!user || !profile) return;

    // Registrar pedido pendente na tabela payments (status = 'pending_pix')
    await supabase.from('payments').insert({
      user_id: user.id,
      amount: plan.price,
      plan_type: planType,
      status: 'pending_pix',
      stripe_payment_id: `pix_${Date.now()}`,
      referred_by: profile.referred_by || '',
      commission_amount: profile.referred_by ? plan.price * 0.30 : 0,
    });

    setSent(true);
  };

  if (loading) return (
    <div style={{ background: ks.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: `3px solid ${ks.border}`, borderTopColor: ks.teal, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // Tela de confirmação após "Já paguei"
  if (sent) return (
    <div style={{ background: ks.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ks.sans, padding: 24 }}>
      <div style={{ maxWidth: 420, textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: ks.amberDim, border: `2px solid ${ks.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Clock size={28} color={ks.amber} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: ks.text, marginBottom: 10 }}>Pagamento em análise</h2>
        <p style={{ fontSize: 14, color: ks.muted, marginBottom: 8, lineHeight: 1.7 }}>
          Recebemos sua confirmação! Assim que verificarmos o pagamento, sua chave de licença será gerada automaticamente no seu dashboard.
        </p>
        <p style={{ fontSize: 13, color: ks.muted, marginBottom: 28 }}>
          Prazo: geralmente em <strong style={{ color: ks.teal }}>menos de 1 hora</strong> em horário comercial.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/conta/dashboard" style={{ padding: '12px 28px', background: ks.teal, color: ks.bg, borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Ir pro dashboard</Link>
          <a href="https://wa.me/5541988242456?text=Oi! Acabei de fazer o PIX do plano KillSpy. Meu email: " style={{ padding: '12px 28px', background: 'rgba(37,211,102,0.1)', color: '#25d366', border: '1px solid rgba(37,211,102,0.2)', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Confirmar no WhatsApp</a>
        </div>
      </div>
    </div>
  );

  // Gerar payload PIX (EMV simplified — copia e cola)
  const pixPayload = `${PIX_KEY}`;

  return (
    <div style={{ background: ks.bg, minHeight: '100vh', fontFamily: ks.sans, color: ks.text, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0M-10 10L10 -10M30 50L50 30' stroke='%232dd4bf' stroke-width='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: '40px' }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 2 }}>

        <Link to="/killspy#planos" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: ks.muted, textDecoration: 'none', fontSize: 13, marginBottom: 28 }}>
          <ArrowLeft size={14} /> Voltar aos planos
        </Link>

        <div style={{
          padding: 32, background: ks.bgCard, border: `1px solid ${ks.border}`, borderRadius: 16,
          boxShadow: `0 16px 48px rgba(0,0,0,0.3), 0 0 40px ${ks.tealGlow}`,
        }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
              <img src="/killspy-logo.png" alt="KS" style={{ width: 32, height: 32, borderRadius: 8 }} />
              <Shield size={16} color={ks.teal} />
              <span style={{ fontSize: 16, fontWeight: 700 }}>KillSpy</span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Pagamento via PIX</h1>
            <p style={{ fontSize: 12, color: ks.muted }}>~5% mais barato que cartão</p>
          </div>

          {/* Plano selecionado */}
          <div style={{ padding: '16px 18px', background: ks.tealDim, border: `1px solid rgba(45,212,191,0.15)`, borderRadius: 10, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{plan.label}</div>
              <div style={{ fontSize: 11, color: ks.muted }}>{plan.days} dia{plan.days > 1 ? 's' : ''} de proteção</div>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: ks.teal }}>
              R${plan.price.toFixed(2).replace('.', ',')}
            </div>
          </div>

          {/* QR Code area */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ padding: 20, background: '#fff', borderRadius: 12, display: 'inline-block', marginBottom: 16 }}>
              {/* QR Code via API */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(PIX_KEY)}&bgcolor=ffffff&color=000000`}
                alt="QR Code PIX"
                style={{ width: 200, height: 200, display: 'block' }}
              />
            </div>
            <p style={{ fontSize: 11, color: ks.muted }}>Escaneie com o app do seu banco</p>
          </div>

          {/* Dados PIX */}
          <div style={{ padding: '16px 18px', background: ks.bg, borderRadius: 10, border: `1px solid ${ks.border}`, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: ks.muted }}>Chave PIX (email)</span>
            </div>
            <div style={{ fontFamily: ks.mono, fontSize: 13, color: ks.teal, wordBreak: 'break-all', marginBottom: 12 }}>
              {PIX_KEY}
            </div>
            <CopyBtn text={PIX_KEY} />
          </div>

          <div style={{ padding: '12px 18px', background: ks.bg, borderRadius: 10, border: `1px solid ${ks.border}`, marginBottom: 24, fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: ks.muted }}>Destinatário</span>
              <span style={{ color: ks.text, fontWeight: 500 }}>{PIX_NAME}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: ks.muted }}>Valor exato</span>
              <span style={{ color: ks.teal, fontWeight: 700 }}>R$ {plan.price.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          {/* Instruções */}
          <div style={{ padding: '14px 18px', background: ks.amberDim, borderRadius: 10, border: `1px solid ${ks.amber}20`, marginBottom: 24, fontSize: 12, color: ks.amber, lineHeight: 1.7 }}>
            <strong>Importante:</strong> envie o valor exato de R$ {plan.price.toFixed(2).replace('.', ',')} para que possamos identificar seu pagamento automaticamente.
          </div>

          {/* Botão "Já paguei" */}
          <button onClick={handlePaid} style={{
            width: '100%', padding: 16, background: ks.green, color: '#000', border: 'none',
            borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
            boxShadow: `0 4px 20px rgba(34,197,94,0.25)`, transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <CheckCircle2 size={18} /> Já fiz o PIX
          </button>

          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: ks.muted }}>
            Após confirmação, sua chave será gerada em até 1 hora.
          </p>
        </div>
      </div>
    </div>
  );
}
