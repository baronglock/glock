
import { useState } from 'react'

const servicos = [
  { id: 1, nome: 'Corte Signature', desc: 'Corte personalizado + consultoria de estilo', preco: 85, tempo: '45 min', categoria: 'Cortes', popular: true },
  { id: 2, nome: 'Barba Sculpting', desc: 'Modelagem precisa + produtos premium', preco: 65, tempo: '30 min', categoria: 'Barba' },
  { id: 3, nome: 'Hot Towel Shave', desc: 'Barbear classico com toalhas quentes e oleos', preco: 95, tempo: '45 min', categoria: 'Barba', popular: true },
  { id: 4, nome: 'Corte + Barba VIP', desc: 'Experiencia completa com bebida inclusa', preco: 140, tempo: '75 min', categoria: 'Combos' },
  { id: 5, nome: 'Tratamento Capilar', desc: 'Hidratacao profunda + massagem craniana', preco: 120, tempo: '60 min', categoria: 'Tratamentos' },
  { id: 6, nome: 'Pigmentacao Barba', desc: 'Cobertura de falhas com pigmento natural', preco: 150, tempo: '45 min', categoria: 'Tratamentos' },
]

const barbeiros = [
  { id: 1, nome: 'Marcus Silva', especialidade: 'Cortes Classicos', rating: 4.9, disponivel: true },
  { id: 2, nome: 'Rafael Costa', especialidade: 'Barbas & Shaving', rating: 4.8, disponivel: true },
  { id: 3, nome: 'Diego Martins', especialidade: 'Degrades & Fades', rating: 4.9, disponivel: false },
  { id: 4, nome: 'Bruno Almeida', especialidade: 'Estilos Modernos', rating: 4.7, disponivel: true },
]

const assinaturas = [
  { id: 'basic', nome: 'Gentleman', cortes: 2, extras: [], preco: 140, economia: 15 },
  { id: 'pro', nome: 'Executive', cortes: 4, extras: ['Barba mensal', 'Bebidas'], preco: 260, economia: 20, popular: true },
  { id: 'vip', nome: 'VIP Club', cortes: 'Ilimitados', extras: ['Barba ilimitada', 'Tratamentos', 'Prioridade'], preco: 450, economia: 30 },
]

const appointments = [
  { id: '#B2847', data: '05/02/2024 15:00', barbeiro: 'Marcus Silva', servico: 'Corte Signature', status: 'agendado', valor: 85 },
  { id: '#B2801', data: '20/01/2024 10:30', barbeiro: 'Rafael Costa', servico: 'Hot Towel Shave', status: 'realizado', valor: 95 },
  { id: '#B2756', data: '05/01/2024 14:00', barbeiro: 'Marcus Silva', servico: 'Corte + Barba VIP', status: 'realizado', valor: 140 },
]

const reviews = [
  { nome: 'Fernando A.', texto: 'Melhor barbearia de Curitiba. Atendimento premium.', tempo: '1 semana' },
  { nome: 'Ricardo M.', texto: 'Marcus e um artista! Meu corte nunca ficou tao bom.', tempo: '2 semanas' },
  { nome: 'Gustavo L.', texto: 'Assinatura Executive vale cada centavo.', tempo: '1 mes' },
  { nome: 'Pedro H.', texto: 'Hot towel shave e uma experiencia incrivel.', tempo: '1 mes' },
]

type BookingStep = 'service' | 'barber' | 'datetime' | 'payment'

export function BarbeariaPremiumDemo({ demoConfig }: { demoConfig?: any }) {
  // Presentation mode - uses demoConfig prop
  const nomeLoja = (demoConfig?.nome || "The Gent's Club")
  const iniciais = (demoConfig?.nome || "The Gent's Club").split(' ').map((w:string) => w[0]).join('').slice(0,2)
  const logoUrl = (demoConfig?.logo || null)

  const [activeCategory, setActiveCategory] = useState('Todos')
  const [showBooking, setShowBooking] = useState(false)
  const [bookingStep, setBookingStep] = useState<BookingStep>('service')
  const [selectedService, setSelectedService] = useState<typeof servicos[0] | null>(null)
  const [selectedBarbeiro, setSelectedBarbeiro] = useState<typeof barbeiros[0] | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [showAssinaturas, setShowAssinaturas] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [accountTab, setAccountTab] = useState<'agendamentos' | 'assinatura' | 'perfil'>('agendamentos')

  const user = { name: 'Carlos Mendes', points: 1250, level: 'Ouro', nextLevel: 250 }

  const categorias = ['Todos', 'Cortes', 'Barba', 'Combos', 'Tratamentos']
  const horarios = ['09:00', '09:45', '10:30', '11:15', '14:00', '14:45', '15:30', '16:15', '17:00', '17:45', '18:30', '19:15']

  const filteredServices = activeCategory === 'Todos' ? servicos : servicos.filter(s => s.categoria === activeCategory)
  const discount = paymentMethod === 'pix' && selectedService ? selectedService.preco * 0.1 : 0
  const finalTotal = selectedService ? selectedService.preco - discount : 0

  const processBooking = () => {
    setBookingSuccess(true)
    setTimeout(() => {
      setBookingSuccess(false)
      setShowBooking(false)
      setBookingStep('service')
      setSelectedService(null)
      setSelectedBarbeiro(null)
      setSelectedDate('')
      setSelectedTime('')
    }, 3500)
  }

  return (
    <main className="bg-[#1a1a1a] min-h-screen text-[#f5f2ed]" style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}>
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="bgPattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M15 0L30 15L15 30L0 15L15 0z" fill="none" stroke="#c4a35a" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bgPattern)" />
        </svg>
      </div>

      {/* Header */}
      <header className="bg-black border-b border-[#c4a35a]/30 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-[#c4a35a] flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt={nomeLoja} className="w-full h-full object-contain p-1" />
              ) : (
                <span className="text-[#c4a35a] text-lg tracking-wider">{iniciais}</span>
              )}
            </div>
            <div>
              <span className="text-[#f5f2ed] text-xl tracking-[0.15em]">{nomeLoja}</span>
              <span className="block text-[#c4a35a] text-[9px] tracking-[0.2em] -mt-1">E-COMMERCE PREMIUM</span>
            </div>
          </div>

          <nav className="hidden md:flex gap-6">
            {['inicio', 'servicos', 'equipe'].map(item => (
              <button key={item} onClick={() => document.getElementById(item)?.scrollIntoView({ behavior: 'smooth' })} className="text-sm capitalize tracking-wide text-[#8a8a8a] hover:text-[#f5f2ed]">
                {item}
              </button>
            ))}
            <button onClick={() => setShowAssinaturas(true)} className="text-sm tracking-wide text-[#8a8a8a] hover:text-[#f5f2ed]">
              assinaturas
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={() => setShowAccount(true)} className="hidden md:flex items-center gap-2 bg-[#c4a35a]/10 border border-[#c4a35a]/30 px-3 py-1.5">
              <svg className="w-4 h-4 text-[#c4a35a]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <span className="text-[#c4a35a] text-xs">{user.points} pts</span>
            </button>
            <button onClick={() => setShowBooking(true)} className="bg-[#c4a35a] text-black px-4 py-2 text-sm tracking-wide hover:bg-[#d4b36a]">
              Agendar Online
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="inicio" className="relative h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#1a1a1a] to-[#1a1a1a]" />
        <div className="relative text-center px-4 z-10">
          <div className="w-28 h-28 mx-auto mb-8 border-2 border-[#c4a35a] flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt={nomeLoja} className="w-full h-full object-contain p-2" />
            ) : (
              <span className="text-[#c4a35a] text-4xl tracking-[0.2em]">{iniciais}</span>
            )}
          </div>
          <p className="text-[#c4a35a] text-sm tracking-[0.4em] uppercase mb-4">DESDE 2018</p>
          <h1 className="text-[#f5f2ed] text-5xl md:text-7xl tracking-wide mb-2">{nomeLoja}</h1>
          <p className="text-[#8a8a8a] text-lg max-w-md mx-auto mb-10">
            Agende online e pague com PIX ou cartao
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => setShowBooking(true)} className="bg-[#c4a35a] text-black px-10 py-4 tracking-wide hover:bg-[#d4b36a]">
              Agendar Agora
            </button>
            <button onClick={() => setShowAssinaturas(true)} className="border border-[#c4a35a] text-[#c4a35a] px-10 py-4 tracking-wide hover:bg-[#c4a35a]/10">
              Clube de Assinaturas
            </button>
          </div>
        </div>
      </section>

      {/* Fidelidade */}
      <div className="bg-gradient-to-r from-[#c4a35a] via-[#d4b36a] to-[#c4a35a] py-4">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black flex items-center justify-center">
              <svg className="w-6 h-6 text-[#c4a35a]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <div>
              <p className="text-black font-medium">Programa {nomeLoja} - Nivel {user.level}</p>
              <p className="text-black/70 text-sm">Faltam {user.nextLevel} pts para Platina</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-black">
            <div className="text-center">
              <p className="text-2xl font-bold">{user.points}</p>
              <p className="text-xs opacity-70">Pontos</p>
            </div>
            <div className="h-10 w-px bg-black/20" />
            <div className="text-center">
              <p className="text-2xl font-bold">R$ {Math.floor(user.points * 0.08)}</p>
              <p className="text-xs opacity-70">Em creditos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="py-16 bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-[#f5f2ed]">4.9 - 456 avaliacoes</span>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {reviews.map((r, i) => (
              <div key={i} className="p-5 bg-[#1a1a1a] border-l-2 border-[#c4a35a]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#c4a35a] flex items-center justify-center text-black text-sm font-bold">{r.nome.charAt(0)}</div>
                  <div>
                    <p className="text-[#f5f2ed] text-sm">{r.nome}</p>
                    <p className="text-[#8a8a8a] text-xs">{r.tempo}</p>
                  </div>
                </div>
                <p className="text-[#8a8a8a] text-sm">{r.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicos */}
      <section id="servicos" className="py-20 bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[#c4a35a] text-[10px] tracking-[0.3em] uppercase mb-2">Nossos Servicos</p>
            <h3 className="text-[#f5f2ed] text-4xl tracking-wide">Menu de Servicos</h3>
            <p className="text-[#8a8a8a] mt-2">Agende e pague online com PIX (10% off) ou cartao</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categorias.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 text-sm tracking-wide border ${activeCategory === cat ? 'bg-[#c4a35a] text-black border-[#c4a35a]' : 'bg-transparent text-[#8a8a8a] border-[#c4a35a]/30 hover:border-[#c4a35a]'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredServices.map((s) => (
              <div key={s.id} className={`bg-[#0f0f0f] p-6 border-l-2 ${s.popular ? 'border-l-[#c4a35a]' : 'border-l-[#4a3728]'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[#f5f2ed] text-lg">{s.nome}</h4>
                      {s.popular && <span className="text-[9px] bg-[#c4a35a] text-black px-2 py-0.5">POPULAR</span>}
                    </div>
                    <p className="text-[#8a8a8a] text-sm mb-2">{s.desc}</p>
                    <p className="text-[#c4a35a]/70 text-xs">{s.tempo}</p>
                  </div>
                  <span className="text-[#c4a35a] text-xl ml-4">R$ {s.preco}</span>
                </div>
                <button onClick={() => { setSelectedService(s); setShowBooking(true); setBookingStep('barber'); }} className="mt-4 w-full py-2 border border-[#c4a35a]/50 text-[#c4a35a] text-sm hover:bg-[#c4a35a] hover:text-black transition-colors">
                  Agendar
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section id="equipe" className="py-20 bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[#c4a35a] text-[10px] tracking-[0.3em] uppercase mb-2">Profissionais</p>
            <h3 className="text-[#f5f2ed] text-4xl tracking-wide">Nossa Equipe</h3>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {barbeiros.map((b) => (
              <div key={b.id} className={`bg-[#1a1a1a] p-6 text-center border ${b.disponivel ? 'border-[#c4a35a]/30' : 'border-[#333] opacity-60'}`}>
                <div className="w-20 h-20 mx-auto mb-4 bg-[#c4a35a]/10 flex items-center justify-center">
                  <span className="text-[#c4a35a] text-2xl">{b.nome.charAt(0)}</span>
                </div>
                <h4 className="text-[#f5f2ed] font-medium mb-1">{b.nome}</h4>
                <p className="text-[#8a8a8a] text-sm mb-2">{b.especialidade}</p>
                <div className="flex items-center justify-center gap-1 mb-3">
                  <span className="text-[#c4a35a]">&#9733;</span>
                  <span className="text-[#f5f2ed] text-sm">{b.rating}</span>
                </div>
                <span className={`text-xs ${b.disponivel ? 'text-green-500' : 'text-red-400'}`}>
                  {b.disponivel ? 'Disponivel' : 'Indisponivel'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-[#c4a35a]/20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 border border-[#c4a35a] flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt={nomeLoja} className="w-full h-full object-contain p-2" />
            ) : (
              <span className="text-[#c4a35a] text-xl tracking-wider">{iniciais}</span>
            )}
          </div>
          <p className="text-[#8a8a8a] text-sm mb-6">{nomeLoja} - Barbearia Premium</p>
          <p className="text-[#5a5a5a] text-xs">© 2024 - Desenvolvido pela G & G Digital</p>
        </div>
      </footer>

      {/* Modal Assinaturas */}
      {showAssinaturas && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowAssinaturas(false)} />
          <div className="relative w-full max-w-4xl bg-[#1a1a1a] border border-[#c4a35a]/30 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowAssinaturas(false)} className="absolute top-4 right-4 text-[#8a8a8a] hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="p-8">
              <div className="text-center mb-8">
                <p className="text-[#c4a35a] text-[10px] tracking-[0.3em] uppercase mb-2">Clube Exclusivo</p>
                <h3 className="text-[#f5f2ed] text-3xl tracking-wide">Assinaturas {nomeLoja}</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {assinaturas.map((p) => (
                  <div key={p.id} className={`p-6 border text-center ${p.popular ? 'border-[#c4a35a] bg-[#c4a35a]/5' : 'border-[#333]'}`}>
                    {p.popular && <span className="inline-block bg-[#c4a35a] text-black text-[9px] px-3 py-1 mb-4">MAIS POPULAR</span>}
                    <h4 className="text-[#f5f2ed] text-xl mb-2">{p.nome}</h4>
                    <p className="text-[#c4a35a] text-3xl font-light mb-1">R$ {p.preco}</p>
                    <p className="text-[#8a8a8a] text-xs mb-4">/mes - {p.economia}% economia</p>
                    <div className="text-left space-y-2 mb-6">
                      <p className="text-[#f5f2ed] text-sm"><span className="text-[#c4a35a]">&#10003;</span> {typeof p.cortes === 'number' ? `${p.cortes} cortes/mes` : 'Cortes ilimitados'}</p>
                      {p.extras.map((e, i) => <p key={i} className="text-[#f5f2ed] text-sm"><span className="text-[#c4a35a]">&#10003;</span> {e}</p>)}
                    </div>
                    <button className={`w-full py-3 ${p.popular ? 'bg-[#c4a35a] text-black' : 'border border-[#c4a35a] text-[#c4a35a]'}`}>Assinar</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Agendamento com Pagamento */}
      {showBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowBooking(false)} />
          <div className="relative w-full max-w-lg bg-[#1a1a1a] border border-[#c4a35a]/30 max-h-[90vh] overflow-y-auto">
            <div className="bg-[#c4a35a] p-4 flex justify-between items-center">
              <h3 className="text-black font-medium">{bookingSuccess ? 'Agendamento Confirmado!' : 'Agendar Servico'}</h3>
              <button onClick={() => setShowBooking(false)} className="text-black/70 hover:text-black">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6">
              {bookingSuccess ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h4 className="text-xl text-[#f5f2ed] mb-2">Pagamento Confirmado!</h4>
                  <p className="text-[#8a8a8a]">Confirmacao enviada por WhatsApp</p>
                  <div className="mt-6 p-4 bg-[#0f0f0f] text-left">
                    <p className="text-[#8a8a8a] text-sm">Detalhes:</p>
                    <p className="text-[#f5f2ed]">{selectedService?.nome} com {selectedBarbeiro?.nome}</p>
                    <p className="text-[#8a8a8a] text-sm">{selectedDate} as {selectedTime}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Progress */}
                  <div className="flex justify-between mb-6">
                    {['service', 'barber', 'datetime', 'payment'].map((s, i) => (
                      <div key={s} className="flex items-center">
                        <div className={`w-8 h-8 flex items-center justify-center text-sm ${['barber', 'datetime', 'payment'].indexOf(bookingStep) >= i || bookingStep === s ? 'bg-[#c4a35a] text-black' : 'bg-[#333] text-[#8a8a8a]'}`}>{i + 1}</div>
                        {i < 3 && <div className={`w-8 h-0.5 ${['barber', 'datetime', 'payment'].indexOf(bookingStep) > i ? 'bg-[#c4a35a]' : 'bg-[#333]'}`} />}
                      </div>
                    ))}
                  </div>

                  {bookingStep === 'service' && (
                    <>
                      <h4 className="text-[#c4a35a] text-xs tracking-wider uppercase mb-4">1. Escolha o Servico</h4>
                      <div className="space-y-2">
                        {servicos.slice(0, 6).map(s => (
                          <button key={s.id} onClick={() => { setSelectedService(s); setBookingStep('barber'); }} className="w-full p-4 border border-[#333] text-left hover:border-[#c4a35a] flex justify-between items-center">
                            <div>
                              <p className="text-[#f5f2ed]">{s.nome}</p>
                              <p className="text-[#8a8a8a] text-xs">{s.tempo}</p>
                            </div>
                            <span className="text-[#c4a35a]">R$ {s.preco}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {bookingStep === 'barber' && (
                    <>
                      <h4 className="text-[#c4a35a] text-xs tracking-wider uppercase mb-4">2. Escolha o Profissional</h4>
                      <div className="space-y-2">
                        {barbeiros.filter(b => b.disponivel).map(b => (
                          <button key={b.id} onClick={() => { setSelectedBarbeiro(b); setBookingStep('datetime'); }} className="w-full p-4 border border-[#333] text-left hover:border-[#c4a35a] flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#c4a35a]/10 flex items-center justify-center"><span className="text-[#c4a35a]">{b.nome.charAt(0)}</span></div>
                            <div>
                              <p className="text-[#f5f2ed]">{b.nome}</p>
                              <p className="text-[#8a8a8a] text-xs">{b.especialidade}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                      <button onClick={() => setBookingStep('service')} className="mt-4 text-[#8a8a8a] text-sm">Voltar</button>
                    </>
                  )}

                  {bookingStep === 'datetime' && (
                    <>
                      <h4 className="text-[#c4a35a] text-xs tracking-wider uppercase mb-4">3. Data e Horario</h4>
                      <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-3 bg-[#0f0f0f] border border-[#333] text-[#f5f2ed] mb-4" />
                      {selectedDate && (
                        <div className="grid grid-cols-4 gap-2">
                          {horarios.map(h => (
                            <button key={h} onClick={() => { setSelectedTime(h); setBookingStep('payment'); }} className={`p-2 text-sm border ${selectedTime === h ? 'bg-[#c4a35a] text-black border-[#c4a35a]' : 'border-[#333] text-[#f5f2ed] hover:border-[#c4a35a]'}`}>{h}</button>
                          ))}
                        </div>
                      )}
                      <button onClick={() => setBookingStep('barber')} className="mt-4 text-[#8a8a8a] text-sm">Voltar</button>
                    </>
                  )}

                  {bookingStep === 'payment' && selectedService && (
                    <>
                      <h4 className="text-[#c4a35a] text-xs tracking-wider uppercase mb-4">4. Pagamento</h4>
                      <div className="space-y-2 mb-6">
                        {[{ id: 'pix', label: 'PIX', desc: '10% de desconto' }, { id: 'card', label: 'Cartao', desc: 'Credito ou Debito' }].map(m => (
                          <button key={m.id} onClick={() => setPaymentMethod(m.id as 'pix' | 'card')} className={`w-full p-4 border text-left ${paymentMethod === m.id ? 'border-[#c4a35a] bg-[#c4a35a]/10' : 'border-[#333]'}`}>
                            <p className="text-[#f5f2ed]">{m.label}</p>
                            <p className="text-[#8a8a8a] text-xs">{m.desc}</p>
                          </button>
                        ))}
                      </div>

                      {paymentMethod === 'pix' && (
                        <div className="mb-6 p-4 bg-[#0f0f0f] text-center">
                          <div className="w-32 h-32 mx-auto bg-[#333] flex items-center justify-center mb-2"><span className="text-xs text-[#8a8a8a]">QR Code</span></div>
                          <button className="text-[#c4a35a] text-sm">Copiar chave PIX</button>
                        </div>
                      )}

                      {paymentMethod === 'card' && (
                        <div className="space-y-3 mb-6">
                          <input type="text" placeholder="Numero do cartao" className="w-full p-3 bg-[#0f0f0f] border border-[#333] text-[#f5f2ed]" />
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="MM/AA" className="w-full p-3 bg-[#0f0f0f] border border-[#333] text-[#f5f2ed]" />
                            <input type="text" placeholder="CVV" className="w-full p-3 bg-[#0f0f0f] border border-[#333] text-[#f5f2ed]" />
                          </div>
                        </div>
                      )}

                      <div className="border-t border-[#333] pt-4 mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#8a8a8a]">Servico</span>
                          <span className="text-[#f5f2ed]">R$ {selectedService.preco.toFixed(2)}</span>
                        </div>
                        {paymentMethod === 'pix' && (
                          <div className="flex justify-between text-sm text-green-500 mb-1">
                            <span>Desconto PIX</span>
                            <span>- R$ {discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold mt-2">
                          <span className="text-[#f5f2ed]">Total</span>
                          <span className="text-[#c4a35a]">R$ {finalTotal.toFixed(2)}</span>
                        </div>
                      </div>

                      <button onClick={processBooking} className="w-full py-3 bg-[#c4a35a] text-black hover:bg-[#d4b36a]">
                        Confirmar Pagamento
                      </button>
                      <button onClick={() => setBookingStep('datetime')} className="w-full mt-2 text-[#8a8a8a] text-sm py-2">Voltar</button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Minha Conta */}
      {showAccount && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowAccount(false)} />
          <div className="relative w-full max-w-lg bg-[#1a1a1a] border border-[#c4a35a]/30 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-[#c4a35a] p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black flex items-center justify-center"><span className="text-[#c4a35a]">{user.name.charAt(0)}</span></div>
                <div>
                  <p className="text-black font-medium">{user.name}</p>
                  <p className="text-black/70 text-xs">{user.level} - {user.points} pts</p>
                </div>
              </div>
              <button onClick={() => setShowAccount(false)} className="text-black/70 hover:text-black">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex border-b border-[#333]">
              {[{ id: 'agendamentos', label: 'Agendamentos' }, { id: 'assinatura', label: 'Assinatura' }, { id: 'perfil', label: 'Perfil' }].map(t => (
                <button key={t.id} onClick={() => setAccountTab(t.id as typeof accountTab)} className={`flex-1 p-3 text-sm ${accountTab === t.id ? 'bg-[#c4a35a] text-black' : 'text-[#8a8a8a]'}`}>{t.label}</button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {accountTab === 'agendamentos' && (
                <div className="space-y-4">
                  {appointments.map(a => (
                    <div key={a.id} className="bg-[#0f0f0f] border border-[#333] p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-[#f5f2ed]">{a.id}</span>
                          <span className="text-[#8a8a8a] text-sm ml-2">{a.data}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 ${a.status === 'agendado' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'}`}>{a.status === 'agendado' ? 'Agendado' : 'Realizado'}</span>
                      </div>
                      <p className="text-[#f5f2ed]">{a.servico}</p>
                      <p className="text-[#8a8a8a] text-sm">com {a.barbeiro}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-[#c4a35a] font-bold">R$ {a.valor}</span>
                        {a.status === 'agendado' && <button className="text-sm border border-[#333] px-3 py-1 text-[#8a8a8a]">Cancelar</button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {accountTab === 'assinatura' && (
                <div className="p-4 border border-[#c4a35a] bg-[#c4a35a]/5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[#f5f2ed] font-medium">Executive</span>
                      <p className="text-[#8a8a8a] text-sm">4 cortes + Barba mensal</p>
                    </div>
                    <span className="text-xs bg-[#c4a35a] text-black px-2 py-1">Ativa</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#c4a35a] font-bold">R$ 260/mes</span>
                    <span className="text-[#8a8a8a] text-sm">Renova: 15/02</span>
                  </div>
                </div>
              )}

              {accountTab === 'perfil' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#8a8a8a] mb-1">Nome</label>
                    <input type="text" value={user.name} readOnly className="w-full p-3 bg-[#0f0f0f] border border-[#333] text-[#f5f2ed]" />
                  </div>
                  <div className="p-4 bg-[#c4a35a]/10 border border-[#c4a35a]/30">
                    <p className="text-[#f5f2ed] font-medium">Programa {nomeLoja}</p>
                    <p className="text-[#8a8a8a] text-sm">Nivel: {user.level} ({user.points} pts)</p>
                    <p className="text-[#c4a35a] text-sm">Faltam {user.nextLevel} pts para Platina</p>
                  </div>
                  <button className="w-full py-3 bg-[#c4a35a] text-black">Editar Perfil</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp */}
      <a href="https://wa.me/5541999888777" className="fixed bottom-6 right-6 w-14 h-14 bg-[#c4a35a] flex items-center justify-center shadow-lg hover:bg-[#d4b36a] z-50">
        <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </main>
  )
}
