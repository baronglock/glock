
import { useState } from 'react'

type StyleMode = 'advocacia' | 'consultoria'
type BookingStep = 'area' | 'specialist' | 'datetime' | 'payment'

const areasAdv = [
  { id: 1, nome: 'Direito Societario', desc: 'Constituicao, fusoes, aquisicoes e governanca', preco: 500, tempo: '60 min', popular: true },
  { id: 2, nome: 'Contencioso Civel', desc: 'Representacao judicial em disputas complexas', preco: 450, tempo: '60 min' },
  { id: 3, nome: 'Tributario', desc: 'Planejamento fiscal e defesa administrativa', preco: 550, tempo: '60 min', popular: true },
  { id: 4, nome: 'Trabalhista', desc: 'Defesa em acoes trabalhistas e consultoria', preco: 400, tempo: '60 min' },
  { id: 5, nome: 'Contratos', desc: 'Elaboracao e revisao de contratos', preco: 350, tempo: '45 min' },
  { id: 6, nome: 'Compliance', desc: 'Adequacao regulatoria e governanca', preco: 600, tempo: '90 min' },
]

const areasCons = [
  { id: 1, nome: 'Estrategia Corporativa', desc: 'Definicao de posicionamento e crescimento', preco: 800, tempo: '90 min', popular: true },
  { id: 2, nome: 'M&A Advisory', desc: 'Assessoria em fusoes e aquisicoes', preco: 1200, tempo: '120 min', popular: true },
  { id: 3, nome: 'Reestruturacao', desc: 'Turnaround operacional e financeiro', preco: 900, tempo: '90 min' },
  { id: 4, nome: 'Due Diligence', desc: 'Analise profunda para decisao', preco: 1000, tempo: '120 min' },
  { id: 5, nome: 'Valuation', desc: 'Avaliacao de empresas e ativos', preco: 1500, tempo: '180 min' },
  { id: 6, nome: 'Business Plan', desc: 'Plano de negocios estrategico', preco: 700, tempo: '90 min' },
]

const advogados = [
  { id: 1, nome: 'Dr. Henrique Amaral', cargo: 'Socio Fundador', area: 'Societario', disponivel: true },
  { id: 2, nome: 'Dra. Lucia Braga', cargo: 'Socia', area: 'Tributario', disponivel: true },
  { id: 3, nome: 'Dr. Marcos Ribeiro', cargo: 'Associado Senior', area: 'Trabalhista', disponivel: true },
]

const consultores = [
  { id: 1, nome: 'Andre Carvalho', cargo: 'Managing Partner', area: 'Estrategia', disponivel: true },
  { id: 2, nome: 'Fernanda Lopes', cargo: 'Partner', area: 'M&A', disponivel: true },
  { id: 3, nome: 'Paulo Medeiros', cargo: 'Director', area: 'Financeiro', disponivel: false },
]

const reunioes = [
  { id: '#AB2847', data: '10/02/2024 14:00', profissional: 'Dr. Henrique Amaral', area: 'Societario', status: 'agendado', valor: 500 },
  { id: '#AB2801', data: '25/01/2024 10:00', profissional: 'Dra. Lucia Braga', area: 'Tributario', status: 'realizado', valor: 550 },
  { id: '#AB2756', data: '10/01/2024 15:30', profissional: 'Dr. Henrique Amaral', area: 'Contratos', status: 'realizado', valor: 350 },
]

const reviews = [
  { nome: 'Ricardo A.', texto: 'Profissionalismo impecavel. Resolveram questoes complexas com competencia.', cargo: 'Diretor Financeiro' },
  { nome: 'Marina C.', texto: 'Parceiros estrategicos ha mais de 10 anos. Confianca total.', cargo: 'CEO' },
  { nome: 'Carlos M.', texto: 'A assessoria foi instrumental no nosso processo de M&A.', cargo: 'Chairman' },
  { nome: 'Patricia S.', texto: 'Consultores de classe mundial. Metodologia rigorosa.', cargo: 'CFO' },
]

export function EscritorioPremiumDemo({ demoConfig }: { demoConfig?: any }) {
  const [mode, setMode] = useState<StyleMode>('advocacia')
  const [showBooking, setShowBooking] = useState(false)
  const [bookingStep, setBookingStep] = useState<BookingStep>('area')
  const [selectedArea, setSelectedArea] = useState<typeof areasAdv[0] | null>(null)
  const [selectedProfissional, setSelectedProfissional] = useState<typeof advogados[0] | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [accountTab, setAccountTab] = useState<'reunioes' | 'documentos' | 'perfil'>('reunioes')

  const isAdvocacia = mode === 'advocacia'

  // Presentation mode - uses demoConfig prop
  const nomeLoja = (demoConfig?.nome || isAdvocacia ? 'Amaral & Braga' : 'APEX')

  const areas = isAdvocacia ? areasAdv : areasCons
  const equipe = isAdvocacia ? advogados : consultores
  const user = { name: isAdvocacia ? 'Ricardo Almeida' : 'Carlos Mendes', points: 3200, level: 'Platina' }

  const advocacia = {
    bg: '#faf9f7', bgAlt: '#f3f0eb', bgCard: '#ffffff',
    accent: '#8b1a32', accentDark: '#6a1426',
    text: '#1a1816', textMuted: '#5c5650', border: '#e0d8d0',
  }

  const consultoria = {
    bg: '#0c0f14', bgAlt: '#11151c', bgCard: '#161b24',
    accent: '#5c9eff', accentDark: '#4080e0',
    text: '#f4f6f9', textMuted: '#8a95a8', border: '#252d3a',
  }

  const c = isAdvocacia ? advocacia : consultoria
  const horarios = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

  const discount = paymentMethod === 'pix' && selectedArea ? selectedArea.preco * 0.1 : 0
  const finalTotal = selectedArea ? selectedArea.preco - discount : 0

  const processBooking = () => {
    setBookingSuccess(true)
    setTimeout(() => {
      setBookingSuccess(false)
      setShowBooking(false)
      setBookingStep('area')
      setSelectedArea(null)
      setSelectedProfissional(null)
      setSelectedDate('')
      setSelectedTime('')
    }, 4000)
  }

  return (
    <main className="min-h-screen transition-colors duration-500" style={{ backgroundColor: c.bg, color: c.text }}>
      {/* Toggle */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60]">
        <div className="flex" style={{ backgroundColor: isAdvocacia ? '#fff' : '#11151c', border: `1px solid ${c.border}`, padding: '4px' }}>
          {[{ id: 'advocacia' as StyleMode, label: 'Advocacia' }, { id: 'consultoria' as StyleMode, label: 'Consultoria' }].map((opt) => (
            <button key={opt.id} onClick={() => setMode(opt.id)} className="px-6 py-2 text-xs tracking-[0.2em] uppercase transition-all" style={{ backgroundColor: mode === opt.id ? c.accent : 'transparent', color: mode === opt.id ? '#fff' : c.textMuted }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="pt-20 pb-4 border-b sticky top-0 z-50" style={{ backgroundColor: c.bg, borderColor: c.border }}>
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex items-center justify-between">
            {isAdvocacia ? (
              <div>
                <h1 className="text-2xl tracking-[0.1em] font-light" style={{ fontFamily: 'Georgia, serif' }}>{nomeLoja}</h1>
                <p className="text-[10px] tracking-[0.4em] uppercase" style={{ color: c.accent }}>Portal do Cliente</p>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{nomeLoja}</h1>
                <span className="text-sm font-light tracking-wide" style={{ color: c.accent }}>Client Portal</span>
              </div>
            )}

            <div className="hidden md:flex items-center gap-6">
              {['areas', 'equipe'].map((item) => (
                <button key={item} onClick={() => document.getElementById(item)?.scrollIntoView({ behavior: 'smooth' })} className="text-xs tracking-[0.15em] uppercase" style={{ color: c.textMuted }}>
                  {item === 'areas' ? (isAdvocacia ? 'Areas' : 'Servicos') : 'Equipe'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => setShowAccount(true)} className="hidden md:flex items-center gap-2 px-3 py-1.5" style={{ backgroundColor: c.accent + '15', border: `1px solid ${c.accent}30` }}>
                <svg className="w-4 h-4" style={{ color: c.accent }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                <span className="text-xs" style={{ color: c.accent }}>{user.points} pts</span>
              </button>
              <button onClick={() => setShowBooking(true)} className="px-4 py-2 text-xs tracking-wide" style={{ backgroundColor: c.accent, color: '#fff' }}>
                {isAdvocacia ? 'Agendar Reuniao' : 'Agendar Sessao'}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20" style={{ backgroundColor: c.bgAlt }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: c.accent }}>{isAdvocacia ? 'Desde 1992' : 'Strategic Advisory'}</p>
          <h2 className={`text-4xl md:text-5xl mb-4 ${isAdvocacia ? 'font-light' : 'font-bold'}`} style={{ fontFamily: isAdvocacia ? 'Georgia, serif' : 'inherit' }}>
            {isAdvocacia ? 'Tradicao e excelencia' : 'Resultados mensuraveis'}
          </h2>
          <p className="mb-8 max-w-lg mx-auto" style={{ color: c.textMuted }}>
            Agende online e pague com PIX (10% de desconto) ou cartao
          </p>
          <button onClick={() => setShowBooking(true)} className="px-8 py-4 text-xs tracking-[0.15em] uppercase" style={{ backgroundColor: c.accent, color: '#fff' }}>
            {isAdvocacia ? 'Agendar Consulta' : 'Agendar Sessao'}
          </button>
        </div>
      </section>

      {/* Fidelidade */}
      <div className="py-4" style={{ backgroundColor: c.accent }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: isAdvocacia ? '#fff' : '#0c0f14' }}>
              <svg className="w-6 h-6" style={{ color: c.accent }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
            </div>
            <div>
              <p className="font-medium" style={{ color: '#fff' }}>{isAdvocacia ? 'Cliente Premium' : 'APEX Elite'} - Nivel {user.level}</p>
              <p className="text-sm" style={{ color: '#ffffff99' }}>Atendimento prioritario e descontos exclusivos</p>
            </div>
          </div>
          <div className="text-center" style={{ color: '#fff' }}>
            <p className="text-2xl font-bold">{user.points}</p>
            <p className="text-xs opacity-70">Pontos</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="py-12" style={{ backgroundColor: c.bg }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {(isAdvocacia ? [
              { valor: '30+', label: 'Anos de experiencia' },
              { valor: '500+', label: 'Casos de sucesso' },
              { valor: '120+', label: 'Clientes ativos' },
            ] : [
              { valor: 'R$ 2B+', label: 'Transacoes assessoradas' },
              { valor: '80+', label: 'Projetos concluidos' },
              { valor: '95%', label: 'Recontratacao' },
            ]).map((stat, i) => (
              <div key={i}>
                <p className={`text-3xl md:text-4xl mb-2 ${isAdvocacia ? 'font-light' : 'font-bold'}`} style={{ color: c.accent, fontFamily: isAdvocacia ? 'Georgia, serif' : 'inherit' }}>
                  {stat.valor}
                </p>
                <p className="text-xs tracking-wide uppercase" style={{ color: c.textMuted }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-12" style={{ backgroundColor: c.bgAlt }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>5.0 - 89 avaliacoes</span>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {reviews.map((r, i) => (
              <div key={i} className="p-5" style={{ backgroundColor: c.bgCard, borderLeft: `2px solid ${c.accent}` }}>
                <p className={`text-sm mb-3 ${isAdvocacia ? 'italic' : ''}`} style={{ color: c.textMuted }}>"{r.texto}"</p>
                <p className="text-sm font-medium">{r.nome}</p>
                <p className="text-xs" style={{ color: c.accent }}>{r.cargo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas */}
      <section id="areas" className="py-20" style={{ backgroundColor: c.bg }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: c.accent }}>{isAdvocacia ? 'Expertise' : 'Servicos'}</p>
            <h3 className={`text-3xl ${isAdvocacia ? 'font-light' : 'font-bold'}`} style={{ fontFamily: isAdvocacia ? 'Georgia, serif' : 'inherit' }}>
              {isAdvocacia ? 'Areas de Atuacao' : 'O Que Fazemos'}
            </h3>
            <p className="text-sm mt-2" style={{ color: c.textMuted }}>PIX: 10% de desconto em todas as consultas</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {areas.map((a) => (
              <div key={a.id} className="p-6" style={{ backgroundColor: c.bgCard, borderLeft: `3px solid ${a.popular ? c.accent : c.border}` }}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`text-lg ${isAdvocacia ? 'font-normal' : 'font-semibold'}`} style={{ fontFamily: isAdvocacia ? 'Georgia, serif' : 'inherit' }}>{a.nome}</h4>
                      {a.popular && <span className="text-[9px] px-2 py-0.5" style={{ backgroundColor: c.accent, color: '#fff' }}>POPULAR</span>}
                    </div>
                    <p className="text-sm mb-2" style={{ color: c.textMuted }}>{a.desc}</p>
                    <p className="text-xs" style={{ color: c.accent }}>{a.tempo}</p>
                  </div>
                  <span className="text-xl ml-4" style={{ color: c.accent }}>R$ {a.preco}</span>
                </div>
                <button onClick={() => { setSelectedArea(a); setShowBooking(true); setBookingStep('specialist'); }} className="mt-4 w-full py-2 text-sm border transition-all" style={{ borderColor: c.accent, color: c.accent }}>
                  Agendar
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section id="equipe" className="py-20" style={{ backgroundColor: c.bgAlt }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: c.accent }}>{isAdvocacia ? 'Socios' : 'Lideranca'}</p>
            <h3 className={`text-3xl ${isAdvocacia ? 'font-light' : 'font-bold'}`} style={{ fontFamily: isAdvocacia ? 'Georgia, serif' : 'inherit' }}>
              Nossa Equipe
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {equipe.map((m) => (
              <div key={m.id} className={`text-center p-6 ${m.disponivel ? '' : 'opacity-50'}`} style={{ backgroundColor: c.bgCard, border: `1px solid ${c.border}` }}>
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center text-xl" style={{ backgroundColor: c.accent + '15', color: c.accent }}>
                  {m.nome.split(' ').filter(n => n.length > 2).map(n => n[0]).join('').slice(0, 2)}
                </div>
                <h4 className={`text-lg mb-1 ${isAdvocacia ? 'font-normal' : 'font-semibold'}`}>{m.nome}</h4>
                <p className="text-sm" style={{ color: c.accent }}>{m.cargo}</p>
                <p className="text-xs mt-1" style={{ color: c.textMuted }}>{m.area}</p>
                <p className="text-xs mt-2" style={{ color: m.disponivel ? '#22c55e' : '#ef4444' }}>
                  {m.disponivel ? 'Disponivel' : 'Indisponivel'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ borderColor: c.border, backgroundColor: c.bg }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          {isAdvocacia ? (
            <div>
              <p className="text-lg tracking-[0.1em] font-light" style={{ fontFamily: 'Georgia, serif' }}>{nomeLoja}</p>
              <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: c.accent }}>Advogados Associados</p>
            </div>
          ) : (
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-xl font-bold">{nomeLoja}</span>
              <span className="text-sm font-light" style={{ color: c.accent }}>Consultoria Estrategica</span>
            </div>
          )}
          <p className="text-xs mt-4" style={{ color: c.textMuted }}>Batel, Curitiba - PR | Desenvolvido por G & G Digital</p>
        </div>
      </footer>

      {/* Modal Agendamento */}
      {showBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => { setShowBooking(false); setBookingStep('area'); }} />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col" style={{ backgroundColor: c.bgCard, border: `1px solid ${c.border}` }}>
            <div className="p-4 flex justify-between items-center" style={{ backgroundColor: c.accent }}>
              <h3 className="font-medium text-white">
                {bookingSuccess ? 'Agendamento Confirmado!' : isAdvocacia ? 'Agendar Consulta' : 'Agendar Sessao'}
              </h3>
              <button onClick={() => { setShowBooking(false); setBookingStep('area'); }} className="text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {bookingSuccess ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h4 className="text-xl mb-2">Pagamento Confirmado!</h4>
                  <p style={{ color: c.textMuted }}>Confirmacao enviada por e-mail</p>
                  <div className="mt-6 p-4 text-left" style={{ backgroundColor: c.bgAlt }}>
                    <p className="text-sm" style={{ color: c.textMuted }}>Detalhes:</p>
                    <p>{selectedArea?.nome} com {selectedProfissional?.nome}</p>
                    <p className="text-sm" style={{ color: c.textMuted }}>{selectedDate} as {selectedTime}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Progress */}
                  <div className="flex justify-between mb-6">
                    {['area', 'specialist', 'datetime', 'payment'].map((s, i) => (
                      <div key={s} className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center text-sm" style={{ backgroundColor: ['specialist', 'datetime', 'payment'].indexOf(bookingStep) >= i || bookingStep === s ? c.accent : c.border, color: ['specialist', 'datetime', 'payment'].indexOf(bookingStep) >= i || bookingStep === s ? '#fff' : c.textMuted }}>
                          {i + 1}
                        </div>
                        {i < 3 && <div className="w-8 h-0.5" style={{ backgroundColor: ['specialist', 'datetime', 'payment'].indexOf(bookingStep) > i ? c.accent : c.border }} />}
                      </div>
                    ))}
                  </div>

                  {bookingStep === 'area' && (
                    <>
                      <h4 className="text-xs tracking-wider uppercase mb-4" style={{ color: c.accent }}>1. Escolha a Area</h4>
                      <div className="space-y-2">
                        {areas.map(a => (
                          <button key={a.id} onClick={() => { setSelectedArea(a); setBookingStep('specialist'); }} className="w-full p-4 border text-left" style={{ borderColor: c.border }}>
                            <div className="flex justify-between items-center">
                              <div>
                                <p>{a.nome}</p>
                                <p className="text-xs" style={{ color: c.textMuted }}>{a.tempo}</p>
                              </div>
                              <span style={{ color: c.accent }}>R$ {a.preco}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {bookingStep === 'specialist' && (
                    <>
                      <h4 className="text-xs tracking-wider uppercase mb-4" style={{ color: c.accent }}>2. Escolha o Profissional</h4>
                      <div className="space-y-2">
                        {equipe.filter(e => e.disponivel).map(e => (
                          <button key={e.id} onClick={() => { setSelectedProfissional(e); setBookingStep('datetime'); }} className="w-full p-4 border text-left" style={{ borderColor: c.border }}>
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: c.accent + '20', color: c.accent }}>
                                {e.nome.split(' ').filter(n => n.length > 2).map(n => n[0]).join('').slice(0, 2)}
                              </div>
                              <div>
                                <p className="font-medium">{e.nome}</p>
                                <p className="text-xs" style={{ color: c.textMuted }}>{e.cargo} - {e.area}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                      <button onClick={() => setBookingStep('area')} className="mt-4 text-sm" style={{ color: c.textMuted }}>Voltar</button>
                    </>
                  )}

                  {bookingStep === 'datetime' && (
                    <>
                      <h4 className="text-xs tracking-wider uppercase mb-4" style={{ color: c.accent }}>3. Data e Horario</h4>
                      <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-3 border mb-4" style={{ backgroundColor: 'transparent', borderColor: c.border, color: c.text }} />
                      {selectedDate && (
                        <div className="grid grid-cols-4 gap-2">
                          {horarios.map(h => (
                            <button key={h} onClick={() => { setSelectedTime(h); setBookingStep('payment'); }} className="p-2 text-sm border" style={{ backgroundColor: selectedTime === h ? c.accent : 'transparent', color: selectedTime === h ? '#fff' : c.text, borderColor: c.border }}>
                              {h}
                            </button>
                          ))}
                        </div>
                      )}
                      <button onClick={() => setBookingStep('specialist')} className="mt-4 text-sm" style={{ color: c.textMuted }}>Voltar</button>
                    </>
                  )}

                  {bookingStep === 'payment' && selectedArea && (
                    <>
                      <h4 className="text-xs tracking-wider uppercase mb-4" style={{ color: c.accent }}>4. Pagamento</h4>
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
                          <div className="w-32 h-32 mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: isAdvocacia ? '#fff' : '#222' }}>
                            <span className="text-xs" style={{ color: c.textMuted }}>QR Code PIX</span>
                          </div>
                          <button className="text-sm" style={{ color: c.accent }}>Copiar codigo PIX</button>
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
                          <span style={{ color: c.textMuted }}>{isAdvocacia ? 'Consulta' : 'Sessao'}</span>
                          <span>R$ {selectedArea.preco.toFixed(2)}</span>
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

                      <button onClick={processBooking} className="w-full py-3 mt-4 text-sm text-white" style={{ backgroundColor: c.accent }}>
                        Confirmar Pagamento
                      </button>
                      <button onClick={() => setBookingStep('datetime')} className="w-full mt-2 text-sm py-2" style={{ color: c.textMuted }}>Voltar</button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Conta */}
      {showAccount && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAccount(false)} />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col" style={{ backgroundColor: c.bgCard, border: `1px solid ${c.border}` }}>
            <div className="p-4 flex justify-between items-center" style={{ backgroundColor: c.accent }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: isAdvocacia ? '#fff' : '#0c0f14' }}>
                  <span style={{ color: c.accent }}>{user.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-white">{user.name}</p>
                  <p className="text-xs text-white/70">{user.level} - {user.points} pts</p>
                </div>
              </div>
              <button onClick={() => setShowAccount(false)} className="text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex border-b" style={{ borderColor: c.border }}>
              {[{ id: 'reunioes', label: isAdvocacia ? 'Consultas' : 'Sessoes' }, { id: 'documentos', label: 'Documentos' }, { id: 'perfil', label: 'Perfil' }].map(t => (
                <button key={t.id} onClick={() => setAccountTab(t.id as typeof accountTab)} className="flex-1 p-3 text-xs tracking-wide" style={{ backgroundColor: accountTab === t.id ? c.accent : 'transparent', color: accountTab === t.id ? '#fff' : c.textMuted }}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {accountTab === 'reunioes' && (
                <div className="space-y-4">
                  {reunioes.map(r => (
                    <div key={r.id} className="p-4 border" style={{ borderColor: c.border }}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium">{r.id}</span>
                          <span className="text-xs ml-2" style={{ color: c.textMuted }}>{r.data}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 ${r.status === 'agendado' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'}`}>
                          {r.status === 'agendado' ? 'Agendado' : 'Realizado'}
                        </span>
                      </div>
                      <p>{r.area}</p>
                      <p className="text-sm" style={{ color: c.textMuted }}>com {r.profissional}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="font-bold" style={{ color: c.accent }}>R$ {r.valor}</span>
                        {r.status === 'agendado' && <button className="text-xs border px-3 py-1" style={{ borderColor: c.border, color: c.textMuted }}>Reagendar</button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {accountTab === 'documentos' && (
                <div className="space-y-4">
                  <div className="p-4 border flex items-center gap-4" style={{ borderColor: c.border }}>
                    <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: c.accent + '20' }}>
                      <svg className="w-5 h-5" style={{ color: c.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Contrato de Prestacao</p>
                      <p className="text-xs" style={{ color: c.textMuted }}>Assinado em 15/01/2024</p>
                    </div>
                    <button className="text-xs" style={{ color: c.accent }}>Baixar</button>
                  </div>
                  <div className="p-4 border flex items-center gap-4" style={{ borderColor: c.border }}>
                    <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: c.accent + '20' }}>
                      <svg className="w-5 h-5" style={{ color: c.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Procuracao</p>
                      <p className="text-xs" style={{ color: c.textMuted }}>Assinado em 15/01/2024</p>
                    </div>
                    <button className="text-xs" style={{ color: c.accent }}>Baixar</button>
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
                    <p className="font-medium">{isAdvocacia ? 'Cliente Premium' : 'APEX Elite'}</p>
                    <p className="text-sm" style={{ color: c.textMuted }}>Nivel: {user.level} ({user.points} pts)</p>
                    <p className="text-sm mt-1" style={{ color: c.accent }}>Atendimento prioritario ativo</p>
                  </div>
                  <button className="w-full py-3 text-sm text-white" style={{ backgroundColor: c.accent }}>Editar Perfil</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp */}
      <a href="https://wa.me/5541998228800" className="fixed bottom-6 right-6 w-14 h-14 flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50" style={{ backgroundColor: c.accent }}>
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        </svg>
      </a>
    </main>
  )
}
