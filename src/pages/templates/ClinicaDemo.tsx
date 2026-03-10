
import { useState } from 'react'

type ClinicType = 'medica' | 'odonto'
type BookingStep = 'specialty' | 'doctor' | 'datetime' | 'payment' | 'confirmation'

const doctors = {
  medica: [
    { id: 1, nome: 'Dra. Ana Souza', especialidade: 'Cardiologia', crm: '12345-PR', valor: 350, foto: true },
    { id: 2, nome: 'Dr. Carlos Lima', especialidade: 'Clínica Geral', crm: '23456-PR', valor: 250, foto: true },
    { id: 3, nome: 'Dra. Beatriz Ramos', especialidade: 'Dermatologia', crm: '34567-PR', valor: 300, foto: true },
    { id: 4, nome: 'Dr. Eduardo Ferreira', especialidade: 'Ortopedia', crm: '45678-PR', valor: 400, foto: true },
  ],
  odonto: [
    { id: 1, nome: 'Dr. Marcos Oliveira', especialidade: 'Ortodontia', cro: '12345-PR', valor: 280, foto: true },
    { id: 2, nome: 'Dra. Julia Mendes', especialidade: 'Implantes', cro: '23456-PR', valor: 350, foto: true },
    { id: 3, nome: 'Dr. Roberto Alves', especialidade: 'Estética Dental', cro: '34567-PR', valor: 320, foto: true },
    { id: 4, nome: 'Dra. Patricia Costa', especialidade: 'Clínica Geral', cro: '45678-PR', valor: 200, foto: true },
  ],
}

const appointments = [
  { id: '#C2847', data: '05/02/2024 14:00', medico: 'Dra. Ana Souza', especialidade: 'Cardiologia', status: 'agendada', valor: 350 },
  { id: '#C2801', data: '15/01/2024 10:30', medico: 'Dr. Carlos Lima', especialidade: 'Clínica Geral', status: 'realizada', valor: 250 },
  { id: '#C2756', data: '02/01/2024 09:00', medico: 'Dra. Beatriz Ramos', especialidade: 'Dermatologia', status: 'realizada', valor: 300 },
]

const exams = [
  { id: 'EX001', nome: 'Hemograma Completo', data: '10/01/2024', status: 'disponivel' },
  { id: 'EX002', nome: 'Eletrocardiograma', data: '15/01/2024', status: 'disponivel' },
  { id: 'EX003', nome: 'Raio-X Torax', data: '02/02/2024', status: 'em_analise' },
]

export function ClinicaPremiumDemo({ demoConfig }: { demoConfig?: any }) {
  // Presentation mode - uses demoConfig prop
  const logoUrl = (demoConfig?.logo || null)

  const [clinicType, setClinicType] = useState<ClinicType>('medica')
  const [isDark, setIsDark] = useState(false)
  const [activeTab, setActiveTab] = useState<'site' | 'portal'>('site')
  const [showBooking, setShowBooking] = useState(false)
  const [bookingStep, setBookingStep] = useState<BookingStep>('specialty')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState<{ id: number; nome: string; especialidade: string; valor: number } | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [portalTab, setPortalTab] = useState<'consultas' | 'exames' | 'perfil'>('consultas')

  const clinicData = {
    medica: {
      nome: 'Vitalis',
      tagline: 'Clínica Médica Premium',
      cor: { primary: '#0d6efd', accent: '#e8f4fd' },
      especialidades: ['Clínica Geral', 'Cardiologia', 'Dermatologia', 'Ginecologia', 'Ortopedia', 'Pediatria'],
    },
    odonto: {
      nome: 'Oris',
      tagline: 'Odontologia Premium',
      cor: { primary: '#10b981', accent: '#ecfdf5' },
      especialidades: ['Clínica Geral', 'Ortodontia', 'Implantes', 'Estética Dental', 'Endodontia', 'Periodontia'],
    },
  }

  const data = clinicData[clinicType]
  const nomeLoja = (demoConfig?.nome || data.nome)
  const iniciais = ((data.nome).split(' ').map((w:string) => w[0]).join('').slice(0,2))
  const primaryColor = data.cor.primary
  const accentBg = data.cor.accent

  const theme = {
    bg: isDark ? 'bg-[#0f0f0f]' : 'bg-white',
    bgAlt: isDark ? 'bg-[#1a1a1a]' : 'bg-[#f8f9fa]',
    bgCard: isDark ? 'bg-[#1a1a1a]' : 'bg-white',
    text: isDark ? 'text-white' : 'text-[#1a1a1a]',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-600',
    border: isDark ? 'border-gray-800' : 'border-gray-200',
  }

  const availableDoctors = doctors[clinicType].filter(d => !selectedSpecialty || d.especialidade === selectedSpecialty)
  const discount = paymentMethod === 'pix' && selectedDoctor ? selectedDoctor.valor * 0.1 : 0
  const finalTotal = selectedDoctor ? selectedDoctor.valor - discount : 0

  const processBooking = () => {
    setBookingSuccess(true)
    setTimeout(() => {
      setBookingSuccess(false)
      setShowBooking(false)
      setBookingStep('specialty')
      setSelectedDoctor(null)
      setSelectedSpecialty('')
    }, 4000)
  }

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} transition-colors`}>
      {/* Type Toggle */}
      <div className={`fixed top-0 left-0 right-0 z-[60] ${isDark ? 'bg-[#0a0a0a]' : 'bg-gray-100'} border-b ${theme.border}`}>
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center gap-2">
          <button
            onClick={() => setClinicType('medica')}
            className={`px-5 py-2.5 text-sm font-medium transition-all ${
              clinicType === 'medica' ? 'bg-[#0d6efd] text-white' : `${isDark ? 'bg-gray-800' : 'bg-white'} ${theme.textMuted}`
            }`}
          >
            Clinica Medica
          </button>
          <button
            onClick={() => setClinicType('odonto')}
            className={`px-5 py-2.5 text-sm font-medium transition-all ${
              clinicType === 'odonto' ? 'bg-[#10b981] text-white' : `${isDark ? 'bg-gray-800' : 'bg-white'} ${theme.textMuted}`
            }`}
          >
            Odontologia
          </button>
        </div>
      </div>

      {/* Header */}
      <header className={`fixed top-[50px] left-0 right-0 z-50 ${theme.bg} border-b ${theme.border}`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center overflow-hidden" style={{ backgroundColor: primaryColor }}>
              {logoUrl ? (
                <img src={logoUrl} alt={nomeLoja} className="w-full h-full object-contain p-1" />
              ) : (
                <span className="text-white font-bold text-lg">{iniciais}</span>
              )}
            </div>
            <div>
              <span className={`font-semibold text-lg ${theme.text}`}>{nomeLoja}</span>
              <span className={`block text-xs ${theme.textMuted}`}>{data.tagline}</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => setActiveTab('site')} className={`text-sm ${activeTab === 'site' ? 'font-medium' : theme.textMuted}`} style={{ color: activeTab === 'site' ? primaryColor : undefined }}>
              Inicio
            </button>
            <button onClick={() => setActiveTab('portal')} className={`text-sm ${activeTab === 'portal' ? 'font-medium' : theme.textMuted}`} style={{ color: activeTab === 'portal' ? primaryColor : undefined }}>
              Area do Paciente
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setIsDark(!isDark)} className={`p-2 border ${theme.border}`}>
              <svg className="w-5 h-5" style={{ color: primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={isDark ? "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" : "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"} />
              </svg>
            </button>
            <button onClick={() => setShowBooking(true)} className="px-4 py-2 text-white text-sm font-medium" style={{ backgroundColor: primaryColor }}>
              Agendar Online
            </button>
          </div>
        </div>
      </header>

      {activeTab === 'site' ? (
        <>
          {/* Hero */}
          <section className="pt-[130px] min-h-[80vh] flex items-center">
            <div className="max-w-6xl mx-auto px-4">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-8" style={{ backgroundColor: accentBg }}>
                  <span className="text-xs font-medium" style={{ color: primaryColor }}>Agendamento Online com Pagamento</span>
                </div>
                <h1 className="mb-6">
                  <span className={`block text-5xl font-light ${theme.text}`}>{nomeLoja}</span>
                  <span className="block text-3xl font-bold mt-2" style={{ color: primaryColor }}>
                    {clinicType === 'medica' ? 'Medicina de excelencia' : 'Sorrisos perfeitos'}
                  </span>
                </h1>
                <p className={`text-lg ${theme.textMuted} mb-10`}>
                  Agende sua consulta online, escolha seu especialista e pague com PIX ou cartao. Receba confirmacao imediata.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => setShowBooking(true)} className="px-8 py-4 text-white text-sm font-medium" style={{ backgroundColor: primaryColor }}>
                    Agendar Agora
                  </button>
                  <button onClick={() => setActiveTab('portal')} className={`px-8 py-4 border ${theme.border} text-sm ${theme.text}`}>
                    Acessar Minha Conta
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Especialistas */}
          <section className={`py-24 ${theme.bgAlt}`}>
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <p className="text-sm font-medium mb-4" style={{ color: primaryColor }}>Nossa equipe</p>
                <h2 className={`text-4xl font-light ${theme.text}`}>Especialistas</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {doctors[clinicType].map((doc) => (
                  <div key={doc.id} className={`${theme.bgCard} border ${theme.border} p-6 text-center`}>
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: accentBg }}>
                      <span className="text-2xl font-bold" style={{ color: primaryColor }}>{doc.nome.charAt(0)}</span>
                    </div>
                    <h3 className={`font-medium ${theme.text}`}>{doc.nome}</h3>
                    <p className="text-sm" style={{ color: primaryColor }}>{doc.especialidade}</p>
                    <p className={`text-xs ${theme.textMuted} mt-1`}>{clinicType === 'medica' ? `CRM ${(doc as any).crm}` : `CRO ${(doc as any).cro}`}</p>
                    <p className={`text-lg font-bold mt-3 ${theme.text}`}>R$ {doc.valor}</p>
                    <button onClick={() => { setSelectedDoctor(doc); setShowBooking(true); setBookingStep('datetime'); }} className="mt-4 w-full py-2 text-sm border" style={{ borderColor: primaryColor, color: primaryColor }}>
                      Agendar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Diferenciais */}
          <section className="py-24">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-16">
                <p className="text-sm font-medium mb-4" style={{ color: primaryColor }}>Vantagens</p>
                <h2 className={`text-4xl font-light ${theme.text}`}>Por que escolher a {nomeLoja}?</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { titulo: 'Agendamento Online', desc: 'Marque sua consulta 24h' },
                  { titulo: 'Pagamento Digital', desc: 'PIX com 10% de desconto' },
                  { titulo: 'Portal do Paciente', desc: 'Exames e historico online' },
                  { titulo: 'Confirmacao Imediata', desc: 'Receba por e-mail e SMS' },
                ].map((item) => (
                  <div key={item.titulo} className={`p-6 ${theme.bgCard} border ${theme.border} text-center`}>
                    <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: accentBg }}>
                      <svg className="w-7 h-7" style={{ color: primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className={`font-medium ${theme.text} mb-1`}>{item.titulo}</h3>
                    <p className={`text-sm ${theme.textMuted}`}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        /* Portal do Paciente */
        <section className="pt-[130px] min-h-screen pb-20">
          <div className="max-w-4xl mx-auto px-4">
            {!isLoggedIn ? (
              <div className={`max-w-md mx-auto ${theme.bgCard} border ${theme.border} p-8 mt-12`}>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full" style={{ backgroundColor: accentBg }}>
                    <svg className="w-8 h-8" style={{ color: primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className={`font-medium ${theme.text}`}>Acesse sua conta</h3>
                </div>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }}>
                  <input type="text" placeholder="CPF" className={`w-full px-4 py-3 border ${theme.border} ${theme.bg} ${theme.text}`} />
                  <input type="password" placeholder="Senha" className={`w-full px-4 py-3 border ${theme.border} ${theme.bg} ${theme.text}`} />
                  <button type="submit" className="w-full py-3 text-white text-sm font-medium" style={{ backgroundColor: primaryColor }}>
                    Entrar
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8 mt-8">
                  <div>
                    <h2 className={`text-2xl font-light ${theme.text}`}>Ola, Maria!</h2>
                    <p className={theme.textMuted}>Bem-vinda ao seu portal</p>
                  </div>
                  <button onClick={() => setShowBooking(true)} className="px-4 py-2 text-white text-sm" style={{ backgroundColor: primaryColor }}>
                    Nova Consulta
                  </button>
                </div>

                {/* Tabs */}
                <div className={`flex border-b ${theme.border} mb-6`}>
                  {[
                    { id: 'consultas', label: 'Minhas Consultas' },
                    { id: 'exames', label: 'Exames' },
                    { id: 'perfil', label: 'Meu Perfil' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setPortalTab(tab.id as typeof portalTab)}
                      className={`px-6 py-3 text-sm ${portalTab === tab.id ? 'border-b-2 font-medium' : theme.textMuted}`}
                      style={{ borderColor: portalTab === tab.id ? primaryColor : 'transparent', color: portalTab === tab.id ? primaryColor : undefined }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {portalTab === 'consultas' && (
                  <div className="space-y-4">
                    {appointments.map((apt) => (
                      <div key={apt.id} className={`${theme.bgCard} border ${theme.border} p-4`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className={`font-medium ${theme.text}`}>{apt.id}</span>
                            <span className={`ml-3 ${theme.textMuted} text-sm`}>{apt.data}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 ${apt.status === 'agendada' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {apt.status === 'agendada' ? 'Agendada' : 'Realizada'}
                          </span>
                        </div>
                        <p className={theme.text}>{apt.medico}</p>
                        <p className={`text-sm ${theme.textMuted}`}>{apt.especialidade}</p>
                        <div className="flex justify-between items-center mt-3">
                          <span style={{ color: primaryColor }} className="font-bold">R$ {apt.valor}</span>
                          {apt.status === 'agendada' && (
                            <button className={`text-sm border px-3 py-1 ${theme.border} ${theme.textMuted}`}>Cancelar</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {portalTab === 'exames' && (
                  <div className="space-y-4">
                    {exams.map((exam) => (
                      <div key={exam.id} className={`${theme.bgCard} border ${theme.border} p-4 flex justify-between items-center`}>
                        <div>
                          <p className={`font-medium ${theme.text}`}>{exam.nome}</p>
                          <p className={`text-sm ${theme.textMuted}`}>{exam.data}</p>
                        </div>
                        {exam.status === 'disponivel' ? (
                          <button className="px-4 py-2 text-sm text-white" style={{ backgroundColor: primaryColor }}>Baixar PDF</button>
                        ) : (
                          <span className={`text-sm ${theme.textMuted}`}>Em analise</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {portalTab === 'perfil' && (
                  <div className={`${theme.bgCard} border ${theme.border} p-6`}>
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm ${theme.textMuted} mb-1`}>Nome</label>
                        <input type="text" value="Maria Santos" readOnly className={`w-full px-4 py-3 border ${theme.border} ${theme.bg}`} />
                      </div>
                      <div>
                        <label className={`block text-sm ${theme.textMuted} mb-1`}>E-mail</label>
                        <input type="email" value="maria@email.com" readOnly className={`w-full px-4 py-3 border ${theme.border} ${theme.bg}`} />
                      </div>
                      <div>
                        <label className={`block text-sm ${theme.textMuted} mb-1`}>CPF</label>
                        <input type="text" value="***.***.***-00" readOnly className={`w-full px-4 py-3 border ${theme.border} ${theme.bg}`} />
                      </div>
                      <button className="w-full py-3 text-white text-sm" style={{ backgroundColor: primaryColor }}>Editar Perfil</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={`py-8 border-t ${theme.border}`}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className={`text-sm ${theme.textMuted}`}>© 2024 {nomeLoja}. Desenvolvido pela G & G Digital</p>
        </div>
      </footer>

      {/* Modal Agendamento */}
      {showBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowBooking(false)} />
          <div className={`relative w-full max-w-lg ${theme.bgCard} shadow-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: theme.border, backgroundColor: primaryColor }}>
              <h3 className="text-white font-medium">
                {bookingSuccess ? 'Agendamento Confirmado!' : `Agendar ${clinicType === 'medica' ? 'Consulta' : 'Atendimento'}`}
              </h3>
              <button onClick={() => setShowBooking(false)} className="text-white/80 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {bookingSuccess ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: accentBg }}>
                    <svg className="w-10 h-10" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className={`text-xl ${theme.text} mb-2`}>Consulta Agendada!</h4>
                  <p className={theme.textMuted}>Confirmacao enviada para seu e-mail</p>
                  <div className={`mt-6 p-4 ${theme.bgAlt} text-left`}>
                    <p className={`text-sm ${theme.textMuted}`}>Detalhes:</p>
                    <p className={theme.text}>{selectedDoctor?.nome}</p>
                    <p className={`text-sm ${theme.textMuted}`}>{selectedDate} as {selectedTime}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Steps */}
                  {!selectedDoctor && bookingStep === 'specialty' && (
                    <>
                      <h4 className={`font-medium ${theme.text} mb-4`}>Escolha a especialidade</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {data.especialidades.map((esp) => (
                          <button
                            key={esp}
                            onClick={() => { setSelectedSpecialty(esp); setBookingStep('doctor'); }}
                            className={`p-4 border text-left text-sm ${theme.border} ${theme.text} hover:border-current`}
                            style={{ borderColor: selectedSpecialty === esp ? primaryColor : undefined }}
                          >
                            {esp}
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {bookingStep === 'doctor' && (
                    <>
                      <h4 className={`font-medium ${theme.text} mb-4`}>Escolha o especialista</h4>
                      <div className="space-y-3">
                        {availableDoctors.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => { setSelectedDoctor(doc); setBookingStep('datetime'); }}
                            className={`w-full p-4 border text-left flex items-center gap-4 ${theme.border}`}
                          >
                            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: accentBg }}>
                              <span style={{ color: primaryColor }} className="font-bold">{doc.nome.charAt(0)}</span>
                            </div>
                            <div className="flex-1">
                              <p className={theme.text}>{doc.nome}</p>
                              <p className={`text-sm ${theme.textMuted}`}>{doc.especialidade}</p>
                            </div>
                            <span style={{ color: primaryColor }} className="font-bold">R$ {doc.valor}</span>
                          </button>
                        ))}
                      </div>
                      <button onClick={() => { setBookingStep('specialty'); setSelectedSpecialty(''); }} className={`mt-4 text-sm ${theme.textMuted}`}>
                        Voltar
                      </button>
                    </>
                  )}

                  {bookingStep === 'datetime' && selectedDoctor && (
                    <>
                      <div className={`mb-6 p-4 ${theme.bgAlt} flex items-center gap-4`}>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: accentBg }}>
                          <span style={{ color: primaryColor }} className="font-bold">{selectedDoctor.nome.charAt(0)}</span>
                        </div>
                        <div>
                          <p className={theme.text}>{selectedDoctor.nome}</p>
                          <p className={`text-sm ${theme.textMuted}`}>{selectedDoctor.especialidade}</p>
                        </div>
                      </div>

                      <h4 className={`font-medium ${theme.text} mb-4`}>Data e Horario</h4>
                      <div className="space-y-4">
                        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className={`w-full px-4 py-3 border ${theme.border} ${theme.bg} ${theme.text}`} />
                        <div className="grid grid-cols-4 gap-2">
                          {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`py-2 text-sm border ${selectedTime === time ? 'text-white' : theme.text}`}
                              style={{ backgroundColor: selectedTime === time ? primaryColor : 'transparent', borderColor: selectedTime === time ? primaryColor : theme.border }}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => setBookingStep('payment')}
                        disabled={!selectedDate || !selectedTime}
                        className="w-full mt-6 py-3 text-white disabled:opacity-50"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Continuar
                      </button>
                      <button onClick={() => setBookingStep('doctor')} className={`w-full mt-2 py-2 text-sm ${theme.textMuted}`}>Voltar</button>
                    </>
                  )}

                  {bookingStep === 'payment' && selectedDoctor && (
                    <>
                      <h4 className={`font-medium ${theme.text} mb-4`}>Pagamento</h4>
                      <div className="space-y-3 mb-6">
                        {[
                          { id: 'pix', label: 'PIX', desc: '10% de desconto' },
                          { id: 'card', label: 'Cartao', desc: 'Credito ou Debito' },
                        ].map((method) => (
                          <button
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id as 'pix' | 'card')}
                            className={`w-full p-4 border text-left ${paymentMethod === method.id ? 'border-current' : theme.border}`}
                            style={{ borderColor: paymentMethod === method.id ? primaryColor : undefined }}
                          >
                            <p className={theme.text}>{method.label}</p>
                            <p className={`text-sm ${theme.textMuted}`}>{method.desc}</p>
                          </button>
                        ))}
                      </div>

                      {paymentMethod === 'pix' && (
                        <div className={`mb-6 p-4 ${theme.bgAlt} text-center`}>
                          <div className="w-32 h-32 mx-auto bg-gray-200 flex items-center justify-center mb-2">
                            <span className="text-xs text-gray-500">QR Code</span>
                          </div>
                          <button className="text-sm" style={{ color: primaryColor }}>Copiar chave PIX</button>
                        </div>
                      )}

                      {paymentMethod === 'card' && (
                        <div className="space-y-3 mb-6">
                          <input type="text" placeholder="Numero do cartao" className={`w-full px-4 py-3 border ${theme.border} ${theme.bg}`} />
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="MM/AA" className={`w-full px-4 py-3 border ${theme.border} ${theme.bg}`} />
                            <input type="text" placeholder="CVV" className={`w-full px-4 py-3 border ${theme.border} ${theme.bg}`} />
                          </div>
                        </div>
                      )}

                      <div className={`border-t pt-4 mb-4 ${theme.border}`}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className={theme.textMuted}>Consulta</span>
                          <span className={theme.text}>R$ {selectedDoctor.valor.toFixed(2)}</span>
                        </div>
                        {paymentMethod === 'pix' && (
                          <div className="flex justify-between text-sm text-green-600 mb-1">
                            <span>Desconto PIX</span>
                            <span>- R$ {discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold mt-2">
                          <span className={theme.text}>Total</span>
                          <span style={{ color: primaryColor }}>R$ {finalTotal.toFixed(2)}</span>
                        </div>
                      </div>

                      <button onClick={processBooking} className="w-full py-3 text-white" style={{ backgroundColor: primaryColor }}>
                        Confirmar Agendamento
                      </button>
                      <button onClick={() => setBookingStep('datetime')} className={`w-full mt-2 py-2 text-sm ${theme.textMuted}`}>Voltar</button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Float */}
      <a href="https://wa.me/5551999999999" className="fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center shadow-lg" style={{ backgroundColor: primaryColor }}>
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  )
}
