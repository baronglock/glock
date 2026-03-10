
import { useState } from 'react'

type StyleMode = 'academia' | 'estudio'
type ModalView = 'planos' | 'agendar' | 'conta'
type PaymentStep = 'plan' | 'payment' | 'success'

const planosAcademia = [
  { id: 'bronze', nome: 'BRONZE', preco: 89, recursos: ['Musculacao', 'Cardio', 'Vestiarios', 'Horario: 6h-22h'], popular: false },
  { id: 'gold', nome: 'GOLD', preco: 139, recursos: ['Tudo do Bronze', 'Funcional', 'Horario 5h-23h', 'Avaliacao fisica mensal'], popular: true },
  { id: 'platinum', nome: 'PLATINUM', preco: 199, recursos: ['Tudo do Gold', 'Personal 1x/sem', 'Suplementos 15% off', 'Acesso VIP 24h'], popular: false },
]

const planosEstudio = [
  { id: 'essencial', nome: 'ESSENCIAL', preco: 149, recursos: ['1 modalidade', '2x por semana', 'App de treinos', 'Avaliacao postural'], popular: false },
  { id: 'equilibrio', nome: 'EQUILIBRIO', preco: 229, recursos: ['2 modalidades', '4x por semana', 'Workshop mensal', 'Prioridade'], popular: true },
  { id: 'plenitude', nome: 'PLENITUDE', preco: 349, recursos: ['Todas modalidades', 'Ilimitado', 'Sessao particular/mes', 'Spa desconto'], popular: false },
]

const aulasAcademia = [
  { id: 1, nome: 'Spinning', horario: '06:00', instrutor: 'Ricardo', vagas: 3, dia: 'Seg a Sex' },
  { id: 2, nome: 'Funcional', horario: '07:00', instrutor: 'Fernanda', vagas: 5, dia: 'Seg/Qua/Sex' },
  { id: 3, nome: 'Core Training', horario: '12:00', instrutor: 'Bruno', vagas: 8, dia: 'Ter/Qui' },
  { id: 4, nome: 'HIIT', horario: '18:00', instrutor: 'Ricardo', vagas: 2, dia: 'Seg a Sex' },
  { id: 5, nome: 'Alongamento', horario: '19:00', instrutor: 'Fernanda', vagas: 10, dia: 'Seg/Qua/Sex' },
]

const aulasEstudio = [
  { id: 1, nome: 'Pilates Solo', horario: '07:00', instrutor: 'Camila', vagas: 4, dia: 'Seg/Qua/Sex' },
  { id: 2, nome: 'Yoga Vinyasa', horario: '08:00', instrutor: 'Lucas', vagas: 6, dia: 'Ter/Qui/Sab' },
  { id: 3, nome: 'Pilates Aparelhos', horario: '10:00', instrutor: 'Camila', vagas: 2, dia: 'Seg a Sex' },
  { id: 4, nome: 'Yoga Restaurativo', horario: '18:00', instrutor: 'Lucas', vagas: 8, dia: 'Ter/Qui' },
  { id: 5, nome: 'Funcional Leve', horario: '19:00', instrutor: 'Marina', vagas: 6, dia: 'Seg/Qua/Sex' },
]

const agendamentosUser = [
  { id: '#IT2847', aula: 'HIIT', data: '06/02/2024 18:00', instrutor: 'Ricardo', status: 'confirmado' },
  { id: '#IT2801', aula: 'Spinning', data: '05/02/2024 06:00', instrutor: 'Ricardo', status: 'confirmado' },
  { id: '#IT2756', aula: 'Funcional', data: '02/02/2024 07:00', instrutor: 'Fernanda', status: 'realizado' },
]

const reviews = [
  { nome: 'Carlos S.', texto: 'Ambiente focado em resultados. Evolui muito aqui.', tempo: '1 semana' },
  { nome: 'Ana P.', texto: 'Os instrutores realmente entendem. Recomendo!', tempo: '2 semanas' },
  { nome: 'Patricia M.', texto: 'Ambiente acolhedor e profissionais excelentes.', tempo: '1 mes' },
  { nome: 'Roberto C.', texto: 'Mudou minha vida. Melhor investimento!', tempo: '1 mes' },
]

export function AcademiaPremiumDemo({ demoConfig }: { demoConfig?: any }) {
  const [mode, setMode] = useState<StyleMode>('academia')
  const [showModal, setShowModal] = useState(false)
  const [modalView, setModalView] = useState<ModalView>('planos')
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('plan')
  const [selectedPlan, setSelectedPlan] = useState<typeof planosAcademia[0] | null>(null)
  const [selectedAula, setSelectedAula] = useState<typeof aulasAcademia[0] | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix')
  const [accountTab, setAccountTab] = useState<'agenda' | 'treinos' | 'perfil'>('agenda')

  const isAcademia = mode === 'academia'

  // Presentation mode - uses demoConfig prop
  const nomeLoja = (demoConfig?.nome || isAcademia ? 'Iron Temple' : 'Flow Studio')

  const planos = isAcademia ? planosAcademia : planosEstudio
  const aulas = isAcademia ? aulasAcademia : aulasEstudio
  const user = { name: isAcademia ? 'Ricardo Almeida' : 'Patricia Costa', plano: isAcademia ? 'GOLD' : 'EQUILIBRIO', points: 1850, treinos: 47 }

  const academia = {
    bg: '#0a0908', bgAlt: '#0f0e0c', bgCard: '#141210',
    accent: '#c9a227', accentDark: '#a68a1f',
    text: '#f5f0e1', textMuted: '#a39a7f', border: '#2a2720',
  }

  const estudio = {
    bg: '#0a1210', bgAlt: '#0c1614', bgCard: '#101a18',
    accent: '#2dd4bf', accentDark: '#14b8a6',
    text: '#f0fdfa', textMuted: '#7fcec2', border: '#1a3530',
  }

  const c = isAcademia ? academia : estudio
  const discount = paymentMethod === 'pix' && selectedPlan ? selectedPlan.preco * 0.1 : 0
  const finalTotal = selectedPlan ? selectedPlan.preco - discount : 0

  const processPayment = () => {
    setPaymentStep('success')
    setTimeout(() => {
      setPaymentStep('plan')
      setSelectedPlan(null)
      setShowModal(false)
    }, 4000)
  }

  const openModal = (view: ModalView) => {
    setModalView(view)
    setShowModal(true)
    setPaymentStep('plan')
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: c.bg, color: c.text }}>
      {/* Toggle */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60]">
        <div className="flex" style={{ backgroundColor: c.bgCard, border: `1px solid ${c.border}`, padding: '4px' }}>
          {[{ id: 'academia' as StyleMode, label: 'Academia' }, { id: 'estudio' as StyleMode, label: 'Estudio' }].map((opt) => (
            <button key={opt.id} onClick={() => setMode(opt.id)} className="px-6 py-2 text-xs tracking-[0.2em] uppercase transition-all" style={{ backgroundColor: mode === opt.id ? c.accent : 'transparent', color: mode === opt.id ? '#000' : c.textMuted }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="pt-20 pb-4 border-b sticky top-0 z-50" style={{ backgroundColor: c.bg, borderColor: c.border }}>
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex items-center justify-between">
            {isAcademia ? (
              <div>
                <h1 className="text-2xl font-bold tracking-wider" style={{ color: c.accent }}>{nomeLoja.toUpperCase()}</h1>
                <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: c.textMuted }}>Portal do Aluno</p>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl tracking-[0.2em] font-light" style={{ fontFamily: 'Georgia, serif' }}>{nomeLoja}</h1>
                <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: c.accent }}>Area do Membro</p>
              </div>
            )}

            <div className="hidden md:flex items-center gap-6">
              {['modalidades', 'planos', 'aulas'].map((item) => (
                <button key={item} onClick={() => document.getElementById(item)?.scrollIntoView({ behavior: 'smooth' })} className="text-xs tracking-[0.15em] uppercase" style={{ color: c.textMuted }}>
                  {item}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => openModal('conta')} className="hidden md:flex items-center gap-2 px-3 py-1.5" style={{ backgroundColor: c.accent + '20', border: `1px solid ${c.accent}40` }}>
                <span className="text-xs" style={{ color: c.accent }}>{user.treinos} treinos</span>
              </button>
              <button onClick={() => openModal('planos')} className="px-4 py-2 text-xs tracking-wide" style={{ backgroundColor: c.accent, color: '#000' }}>
                {isAcademia ? 'Ver Planos' : 'Assinar'}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20" style={{ backgroundColor: c.bgAlt }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: c.accent }}>
            {isAcademia ? 'Forca & Disciplina' : 'Movimento & Bem-Estar'}
          </p>
          <h2 className={`text-4xl md:text-5xl mb-4 ${isAcademia ? 'font-bold tracking-wider' : 'font-light'}`} style={{ fontFamily: isAcademia ? 'inherit' : 'Georgia, serif' }}>
            {isAcademia ? nomeLoja.toUpperCase() : nomeLoja}
          </h2>
          <p className="mb-8 max-w-lg mx-auto" style={{ color: c.textMuted }}>
            {isAcademia ? 'Estrutura completa para treinos de alta performance' : 'Espaco dedicado ao equilibrio entre corpo e mente'}
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => openModal('planos')} className="px-8 py-4 text-xs tracking-[0.15em] uppercase" style={{ backgroundColor: c.accent, color: '#000' }}>
              Ver Planos
            </button>
            <button onClick={() => openModal('agendar')} className="px-8 py-4 text-xs tracking-[0.15em] uppercase border" style={{ borderColor: c.accent, color: c.accent }}>
              Agendar Aula
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="py-4" style={{ backgroundColor: c.accent }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: '#000' }}>
              <span style={{ color: c.accent }} className="text-lg font-bold">{user.treinos}</span>
            </div>
            <div>
              <p className="font-medium" style={{ color: '#000' }}>Treinos este mes</p>
              <p className="text-sm" style={{ color: '#00000099' }}>Plano: {user.plano}</p>
            </div>
          </div>
          <div className="flex items-center gap-6" style={{ color: '#000' }}>
            <div className="text-center">
              <p className="text-2xl font-bold">{user.points}</p>
              <p className="text-xs opacity-70">Pontos</p>
            </div>
            <div className="h-10 w-px bg-black/20" />
            <div className="text-center">
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs opacity-70">Aulas agendadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="py-12" style={{ backgroundColor: c.bg }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>4.9 - 342 avaliacoes</span>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {reviews.map((r, i) => (
              <div key={i} className="p-5" style={{ backgroundColor: c.bgCard, borderLeft: `2px solid ${c.accent}` }}>
                <p className="text-sm mb-3" style={{ color: c.textMuted }}>"{r.texto}"</p>
                <p className="text-sm font-medium">{r.nome}</p>
                <p className="text-xs" style={{ color: c.textMuted }}>{r.tempo} atras</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos Preview */}
      <section id="planos" className="py-20" style={{ backgroundColor: c.bgAlt }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: c.accent }}>Invista em voce</p>
            <h3 className={`text-3xl ${isAcademia ? 'font-bold tracking-wider' : 'font-light'}`} style={{ fontFamily: isAcademia ? 'inherit' : 'Georgia, serif' }}>
              Nossos Planos
            </h3>
            <p className="text-sm mt-2" style={{ color: c.textMuted }}>PIX: 10% de desconto na primeira mensalidade</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {planos.map((p) => (
              <div key={p.id} className="p-6 text-center" style={{ backgroundColor: c.bgCard, border: p.popular ? `2px solid ${c.accent}` : `1px solid ${c.border}` }}>
                {p.popular && <span className="inline-block text-[9px] px-3 py-1 mb-4" style={{ backgroundColor: c.accent, color: '#000' }}>MAIS POPULAR</span>}
                <h4 className={`text-xl mb-2 ${isAcademia ? 'font-bold tracking-wider' : 'font-light'}`}>{p.nome}</h4>
                <p className="text-3xl font-light mb-1" style={{ color: c.accent }}>R$ {p.preco}</p>
                <p className="text-xs mb-6" style={{ color: c.textMuted }}>/mes</p>
                <div className="text-left space-y-2 mb-6">
                  {p.recursos.map((r, i) => (
                    <p key={i} className="text-sm"><span style={{ color: c.accent }}>&#10003;</span> {r}</p>
                  ))}
                </div>
                <button onClick={() => { setSelectedPlan(p); openModal('planos'); setPaymentStep('payment'); }} className="w-full py-3 text-sm" style={{ backgroundColor: p.popular ? c.accent : 'transparent', color: p.popular ? '#000' : c.accent, border: p.popular ? 'none' : `1px solid ${c.accent}` }}>
                  Assinar
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Aulas */}
      <section id="aulas" className="py-20" style={{ backgroundColor: c.bg }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: c.accent }}>{isAcademia ? 'Aulas Coletivas' : 'Agenda'}</p>
            <h3 className={`text-3xl ${isAcademia ? 'font-bold tracking-wider' : 'font-light'}`} style={{ fontFamily: isAcademia ? 'inherit' : 'Georgia, serif' }}>
              {isAcademia ? 'Grade de Aulas' : 'Proximas Sessoes'}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aulas.map((a) => (
              <div key={a.id} className="p-5" style={{ backgroundColor: c.bgCard, border: `1px solid ${c.border}` }}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{a.nome}</h4>
                    <p className="text-sm" style={{ color: c.textMuted }}>{a.instrutor}</p>
                  </div>
                  <span className="text-lg font-bold" style={{ color: c.accent }}>{a.horario}</span>
                </div>
                <p className="text-xs mb-3" style={{ color: c.textMuted }}>{a.dia}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: a.vagas <= 3 ? '#ef4444' : '#22c55e' }}>{a.vagas} vagas</span>
                  <button onClick={() => { setSelectedAula(a); openModal('agendar'); }} className="text-xs px-4 py-2 border" style={{ borderColor: c.accent, color: c.accent }}>
                    Agendar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ borderColor: c.border, backgroundColor: c.bgAlt }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          {isAcademia ? (
            <p className="text-xl font-bold tracking-wider" style={{ color: c.accent }}>{nomeLoja.toUpperCase()}</p>
          ) : (
            <p className="text-xl tracking-[0.2em] font-light" style={{ fontFamily: 'Georgia, serif' }}>{nomeLoja}</p>
          )}
          <p className="text-xs mt-2" style={{ color: c.textMuted }}>Batel, Curitiba - PR | Desenvolvido por G & G Digital</p>
        </div>
      </footer>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => { setShowModal(false); setPaymentStep('plan'); }} />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col" style={{ backgroundColor: c.bgCard, border: `1px solid ${c.border}` }}>
            <div className="p-4 flex justify-between items-center" style={{ backgroundColor: c.accent }}>
              <h3 className="font-medium text-black">
                {modalView === 'planos' ? (paymentStep === 'success' ? 'Assinatura Confirmada!' : 'Escolher Plano') : modalView === 'agendar' ? 'Agendar Aula' : 'Minha Conta'}
              </h3>
              <button onClick={() => { setShowModal(false); setPaymentStep('plan'); }} className="text-black">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {modalView === 'planos' && (
                <>
                  {paymentStep === 'success' ? (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <h4 className="text-xl mb-2">Bem-vindo ao {nomeLoja}!</h4>
                      <p style={{ color: c.textMuted }}>Plano {selectedPlan?.nome} ativado</p>
                    </div>
                  ) : paymentStep === 'plan' ? (
                    <div className="space-y-4">
                      {planos.map((p) => (
                        <button key={p.id} onClick={() => { setSelectedPlan(p); setPaymentStep('payment'); }} className="w-full p-4 border text-left" style={{ borderColor: p.popular ? c.accent : c.border, backgroundColor: p.popular ? c.accent + '10' : 'transparent' }}>
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{p.nome}</span>
                                {p.popular && <span className="text-[9px] px-2 py-0.5" style={{ backgroundColor: c.accent, color: '#000' }}>POPULAR</span>}
                              </div>
                              <p className="text-xs" style={{ color: c.textMuted }}>{p.recursos.slice(0, 2).join(' + ')}</p>
                            </div>
                            <span className="text-xl" style={{ color: c.accent }}>R$ {p.preco}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="mb-6 p-4" style={{ backgroundColor: c.bgAlt }}>
                        <p className="font-medium">Plano {selectedPlan?.nome}</p>
                        <p className="text-sm" style={{ color: c.textMuted }}>{selectedPlan?.recursos.join(' | ')}</p>
                      </div>

                      <div className="space-y-2 mb-6">
                        {[{ id: 'pix', label: 'PIX', desc: '10% de desconto' }, { id: 'card', label: 'Cartao', desc: 'Credito ou Debito' }].map(m => (
                          <button key={m.id} onClick={() => setPaymentMethod(m.id as 'pix' | 'card')} className="w-full p-4 border text-left" style={{ borderColor: paymentMethod === m.id ? c.accent : c.border, backgroundColor: paymentMethod === m.id ? c.accent + '15' : 'transparent' }}>
                            <p className="font-medium text-sm">{m.label}</p>
                            <p className="text-xs" style={{ color: c.textMuted }}>{m.desc}</p>
                          </button>
                        ))}
                      </div>

                      {paymentMethod === 'pix' && (
                        <div className="p-4 mb-6 text-center" style={{ backgroundColor: c.bgAlt }}>
                          <div className="w-32 h-32 mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: '#222' }}>
                            <span className="text-xs" style={{ color: c.textMuted }}>QR Code PIX</span>
                          </div>
                          <button className="text-sm" style={{ color: c.accent }}>Copiar codigo</button>
                        </div>
                      )}

                      {paymentMethod === 'card' && (
                        <div className="space-y-3 mb-6">
                          <input type="text" placeholder="Numero do cartao" className="w-full p-3 border text-sm" style={{ backgroundColor: 'transparent', borderColor: c.border, color: c.text }} />
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="MM/AA" className="w-full p-3 border text-sm" style={{ backgroundColor: 'transparent', borderColor: c.border, color: c.text }} />
                            <input type="text" placeholder="CVV" className="w-full p-3 border text-sm" style={{ backgroundColor: 'transparent', borderColor: c.border, color: c.text }} />
                          </div>
                        </div>
                      )}

                      <div className="border-t pt-4" style={{ borderColor: c.border }}>
                        <div className="flex justify-between text-sm mb-1">
                          <span style={{ color: c.textMuted }}>Mensalidade</span>
                          <span>R$ {selectedPlan?.preco.toFixed(2)}</span>
                        </div>
                        {paymentMethod === 'pix' && (
                          <div className="flex justify-between text-sm text-green-500 mb-1">
                            <span>Desconto PIX</span>
                            <span>- R$ {discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold mt-2">
                          <span>Total</span>
                          <span style={{ color: c.accent }}>R$ {finalTotal.toFixed(2)}</span>
                        </div>
                      </div>

                      <button onClick={processPayment} className="w-full py-3 mt-4 text-sm" style={{ backgroundColor: c.accent, color: '#000' }}>
                        Confirmar Assinatura
                      </button>
                      <button onClick={() => setPaymentStep('plan')} className="w-full mt-2 text-sm py-2" style={{ color: c.textMuted }}>Voltar</button>
                    </>
                  )}
                </>
              )}

              {modalView === 'agendar' && (
                <div className="space-y-4">
                  <p className="text-sm mb-4" style={{ color: c.textMuted }}>Selecione uma aula para agendar:</p>
                  {aulas.map((a) => (
                    <button key={a.id} onClick={() => setSelectedAula(a)} className="w-full p-4 border text-left" style={{ borderColor: selectedAula?.id === a.id ? c.accent : c.border, backgroundColor: selectedAula?.id === a.id ? c.accent + '10' : 'transparent' }}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{a.nome}</p>
                          <p className="text-xs" style={{ color: c.textMuted }}>{a.instrutor} - {a.dia}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold" style={{ color: c.accent }}>{a.horario}</p>
                          <p className="text-xs" style={{ color: a.vagas <= 3 ? '#ef4444' : '#22c55e' }}>{a.vagas} vagas</p>
                        </div>
                      </div>
                    </button>
                  ))}
                  {selectedAula && (
                    <button className="w-full py-3 mt-4 text-sm" style={{ backgroundColor: c.accent, color: '#000' }}>
                      Confirmar Agendamento
                    </button>
                  )}
                </div>
              )}

              {modalView === 'conta' && (
                <>
                  <div className="flex border-b mb-4" style={{ borderColor: c.border }}>
                    {[{ id: 'agenda', label: 'Agenda' }, { id: 'treinos', label: 'Treinos' }, { id: 'perfil', label: 'Perfil' }].map(t => (
                      <button key={t.id} onClick={() => setAccountTab(t.id as typeof accountTab)} className="flex-1 p-3 text-xs tracking-wide" style={{ backgroundColor: accountTab === t.id ? c.accent : 'transparent', color: accountTab === t.id ? '#000' : c.textMuted }}>
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {accountTab === 'agenda' && (
                    <div className="space-y-4">
                      {agendamentosUser.map(a => (
                        <div key={a.id} className="p-4 border" style={{ borderColor: c.border }}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-medium">{a.aula}</span>
                              <p className="text-xs" style={{ color: c.textMuted }}>{a.data}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 ${a.status === 'confirmado' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'}`}>
                              {a.status === 'confirmado' ? 'Confirmado' : 'Realizado'}
                            </span>
                          </div>
                          <p className="text-sm" style={{ color: c.textMuted }}>Instrutor: {a.instrutor}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {accountTab === 'treinos' && (
                    <div className="text-center py-8">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: c.accent + '20' }}>
                        <span className="text-3xl font-bold" style={{ color: c.accent }}>{user.treinos}</span>
                      </div>
                      <p className="font-medium">Treinos este mes</p>
                      <p className="text-sm" style={{ color: c.textMuted }}>Meta: 20 treinos</p>
                      <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ backgroundColor: c.border }}>
                        <div className="h-full" style={{ backgroundColor: c.accent, width: `${Math.min(100, (user.treinos / 20) * 100)}%` }} />
                      </div>
                    </div>
                  )}

                  {accountTab === 'perfil' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs tracking-wider uppercase mb-2" style={{ color: c.textMuted }}>Nome</label>
                        <input type="text" defaultValue={user.name} className="w-full p-3 border text-sm" style={{ backgroundColor: 'transparent', borderColor: c.border, color: c.text }} readOnly />
                      </div>
                      <div className="p-4" style={{ backgroundColor: c.accent + '15', border: `1px solid ${c.accent}30` }}>
                        <p className="font-medium">Plano {user.plano}</p>
                        <p className="text-sm" style={{ color: c.textMuted }}>{user.points} pontos acumulados</p>
                        <p className="text-sm mt-1" style={{ color: c.accent }}>Status: Ativo</p>
                      </div>
                      <button className="w-full py-3 text-sm" style={{ backgroundColor: c.accent, color: '#000' }}>Editar Perfil</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp */}
      <a href="https://wa.me/5541999997777" className="fixed bottom-6 right-6 w-14 h-14 flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50" style={{ backgroundColor: c.accent }}>
        <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        </svg>
      </a>
    </main>
  )
}
