
import { useState } from 'react'

type Mode = 'petshop' | 'veterinaria'
type AnimalTab = 'caes' | 'gatos' | 'passaros'

// ============ DADOS PET SHOP ============
const petshopData = {
  nome: 'Patitas Premium',
  tagline: 'Pet Boutique & Spa de Luxo',
  slogan: 'Experiência VIP para seu melhor amigo',
  sobre: 'O Patitas Premium é referência em cuidados pet de alto padrão. Com mais de 15 anos de experiência, oferecemos serviços exclusivos, produtos importados e um programa de fidelidade que recompensa você e seu pet.',
  telefone: '(41) 3333-9001',
  whatsapp: '5541999999001',
  email: 'vip@patitas.com.br',
  endereco: 'Rua Bispo Dom José, 2495',
  bairro: 'Batel, Curitiba - PR',
  horarios: ['Seg a Sex: 7h - 21h', 'Sábado: 8h - 20h', 'Domingo: 9h - 18h'],
  rating: '5.0',
  totalReviews: '847',
}

const equipePetshop = [
  { nome: 'Carolina Santos', cargo: 'Groomer Master Internacional', especializacao: 'Certificada pela World Dog Show', foto: '/demos/pet-shop/team-1.jpg' },
  { nome: 'Fernanda Lima', cargo: 'Especialista em Raças', especializacao: '15 anos com Poodles e Shih-tzus', foto: '/demos/pet-shop/team-2.jpg' },
  { nome: 'Marina Costa', cargo: 'Terapeuta Pet Spa', especializacao: 'Aromaterapia e massagem relaxante', foto: '/demos/pet-shop/team-3.jpg' },
]

const servicosPetshop = [
  { nome: 'Banho Signature', desc: 'Shampoo francês, ozônio, secagem com argan', preco: '150', tempo: '1h30', destaque: false },
  { nome: 'Tosa Artística Premium', desc: 'Corte exclusivo por groomer internacional', preco: '280', tempo: '2h30', destaque: true },
  { nome: 'Spa Day VIP', desc: 'Banho, tosa, hidratação, massagem, aromaterapia', preco: '450', tempo: '4h', destaque: true },
  { nome: 'Hotel 5 Estrelas', desc: 'Suíte privativa com câmera e room service', preco: '280', tempo: 'diária', destaque: false },
  { nome: 'Day Care Premium', desc: 'Socialização, atividades e snacks gourmet', preco: '180', tempo: 'diária', destaque: false },
  { nome: 'Transporte VIP', desc: 'Busca e entrega em veículo climatizado', preco: '80', tempo: '---', destaque: false },
  { nome: 'Pacote Mensal Platinum', desc: '4 banhos + 2 tosas + spa mensal', preco: '890', tempo: 'mês', destaque: true },
  { nome: 'Personal Groomer', desc: 'Profissional dedicado exclusivo', preco: '500', tempo: 'sessão', destaque: false },
]

const produtosPetshop = {
  caes: [
    { categoria: 'Rações Super Premium Importadas', itens: [
      { nome: 'Orijen Original', info: '11.4kg', preco: '589' },
      { nome: 'Acana Pacifica', info: '11.4kg', preco: '529' },
      { nome: 'Royal Canin Veterinary', info: '10kg', preco: '449' },
      { nome: 'N&D Quinoa Digestion', info: '10.1kg', preco: '489' },
    ]},
    { categoria: 'Petiscos Gourmet', itens: [
      { nome: 'Ziwi Peak Treats', info: '85g', preco: '89' },
      { nome: 'The Honest Kitchen', info: '113g', preco: '75' },
      { nome: 'Wellness Core Jerky', info: '113g', preco: '68' },
    ]},
    { categoria: 'Acessórios de Luxo', itens: [
      { nome: 'Coleira Hermès Pet', info: 'M/G', preco: '890' },
      { nome: 'Cama Cloud Nine', info: 'Ortopédica', preco: '1.290' },
      { nome: 'Bebedouro Fonte Inox', info: '3L', preco: '389' },
    ]},
  ],
  gatos: [
    { categoria: 'Rações Super Premium', itens: [
      { nome: 'Orijen Cat & Kitten', info: '5.4kg', preco: '489' },
      { nome: 'Acana Indoor Entrée', info: '4.5kg', preco: '429' },
      { nome: 'Royal Canin Renal', info: '4kg', preco: '389' },
    ]},
    { categoria: 'Petiscos Premium', itens: [
      { nome: 'Feline Greenies', info: '140g', preco: '65' },
      { nome: 'Temptations Gourmet', info: '180g', preco: '45' },
    ]},
    { categoria: 'Móveis e Acessórios', itens: [
      { nome: 'Árvore Gato Designer', info: '2m', preco: '1.890' },
      { nome: 'Fonte Cerâmica Artesanal', info: '2.5L', preco: '450' },
      { nome: 'Caixa Sanitária Automática', info: 'Smart', preco: '2.490' },
    ]},
  ],
  passaros: [
    { categoria: 'Alimentação Premium', itens: [
      { nome: 'Zupreem FruitBlend', info: '900g', preco: '189' },
      { nome: 'Harrison\'s Bird Foods', info: '450g', preco: '220' },
      { nome: 'Tropican Lifetime', info: '820g', preco: '165' },
    ]},
    { categoria: 'Viveiros e Acessórios', itens: [
      { nome: 'Viveiro Vision L12', info: 'Grande', preco: '1.890' },
      { nome: 'Poleiro Java Natural', info: 'Kit 3pç', preco: '280' },
      { nome: 'Brinquedos Foraging Kit', info: '5 peças', preco: '189' },
    ]},
  ],
}

const planosFidelidade = [
  { nome: 'Gold', preco: '199', beneficios: ['4 banhos/mês', '1 tosa/mês', '10% em produtos', 'Pontos em dobro'], cor: '#C4A35A' },
  { nome: 'Platinum', preco: '399', beneficios: ['Banhos ilimitados', '2 tosas/mês', '20% em produtos', 'Pontos em triplo', 'Spa mensal', 'Prioridade no hotel'], cor: '#A8A9AD', destaque: true },
  { nome: 'Diamond', preco: '699', beneficios: ['Tudo ilimitado', '30% em produtos', 'Pontos 5x', 'Personal groomer', 'Transporte grátis', 'Acesso VIP 24h'], cor: '#B9F2FF' },
]

const reviewsPetshop = [
  { nome: 'Mariana Ferreira', pet: 'Thor (Golden)', texto: 'Experiência incomparável! O spa deixou meu Thor irreconhecível de tão lindo. Atendimento digno de 5 estrelas.', nota: 5, tempo: '3 dias' },
  { nome: 'Roberto Almeida', pet: 'Luna (Poodle)', texto: 'O programa Platinum vale cada centavo. Luna ama vir aqui, e os pontos já renderam vários mimos!', nota: 5, tempo: '1 semana' },
  { nome: 'Patricia Souza', pet: 'Nina e Bob', texto: 'Cliente Diamond há 2 anos. O personal groomer conhece cada detalhe dos meus pets. Impecável!', nota: 5, tempo: '2 semanas' },
  { nome: 'Carlos Eduardo', pet: 'Max (Bulldog)', texto: 'O hotel 5 estrelas é incrível! Recebi atualizações por vídeo a cada hora. Max estava em casa!', nota: 5, tempo: '3 semanas' },
]

// ============ DADOS VETERINARIA ============
const vetData = {
  nome: 'Vida Pet Premium',
  tagline: 'Centro Veterinário de Excelência',
  slogan: 'Medicina veterinária de alto nível',
  sobre: 'O Vida Pet Premium é um centro de referência em medicina veterinária, com UTI 24h, centro cirúrgico de última geração, especialistas renomados e programa de saúde preventiva.',
  telefone: '(41) 3333-9002',
  whatsapp: '5541999999002',
  email: 'premium@vidapet.com.br',
  endereco: 'Av. Silva Jardim, 1980',
  bairro: 'Água Verde, Curitiba - PR',
  horarios: ['Plantão 24 horas', 'Consultas: 7h - 22h', 'Emergência: sempre'],
  rating: '5.0',
  totalReviews: '1.234',
}

const equipeVet = [
  { nome: 'Dra. Fernanda Lima', cargo: 'Diretora Clínica - CRMV 12345', especializacao: 'Cirurgia de alta complexidade', foto: '/demos/pet-shop/vet-team-1.jpg' },
  { nome: 'Dr. Ricardo Alves', cargo: 'Cardiologista - CRMV 23456', especializacao: 'Ecocardiografia e hemodinâmica', foto: '/demos/pet-shop/vet-team-2.jpg' },
  { nome: 'Dra. Camila Rocha', cargo: 'Oncologista - CRMV 34567', especializacao: 'Quimioterapia e imunoterapia', foto: '/demos/pet-shop/vet-team-3.jpg' },
]

const servicosVet = [
  { nome: 'Consulta Especialista', desc: 'Avaliação com médico especializado', preco: '350', tempo: '1h', destaque: true },
  { nome: 'Check-up Executive', desc: 'Exames completos + imagem + relatório', preco: '890', tempo: '3h', destaque: true },
  { nome: 'Emergência VIP 24h', desc: 'Atendimento prioritário imediato', preco: '450', tempo: '---', destaque: false },
  { nome: 'Cirurgia de Alta Complexidade', desc: 'Centro cirúrgico com UTI', preco: 'Sob consulta', tempo: 'Variável', destaque: false },
  { nome: 'UTI 24 horas', desc: 'Monitoramento contínuo especializado', preco: '980', tempo: 'diária', destaque: false },
  { nome: 'Quimioterapia', desc: 'Protocolo oncológico personalizado', preco: 'Sob consulta', tempo: 'sessão', destaque: false },
  { nome: 'Reabilitação e Fisio', desc: 'Hidroterapia, laser, acupuntura', preco: '280', tempo: 'sessão', destaque: false },
  { nome: 'Telemedicina Premium', desc: 'Consulta online com especialista', preco: '180', tempo: '30min', destaque: true },
]

const especialidadesVet = {
  caes: [
    { categoria: 'Clínica Geral', itens: [
      { nome: 'Check-up Anual Completo', info: 'Exames + vacinas', preco: '590' },
      { nome: 'Protocolo Vacinal Premium', info: 'Importadas', preco: '380' },
      { nome: 'Perfil Geriátrico', info: 'Acima 7 anos', preco: '780' },
    ]},
    { categoria: 'Cirurgias', itens: [
      { nome: 'Castração Laparoscópica', info: 'Minimamente invasiva', preco: '1.890' },
      { nome: 'Ortopedia TPLO', info: 'Ligamento cruzado', preco: '4.500' },
      { nome: 'Oncológica', info: 'Tumores complexos', preco: 'Sob consulta' },
    ]},
  ],
  gatos: [
    { categoria: 'Felinos', itens: [
      { nome: 'Check-up Felino Completo', info: 'Específico gatos', preco: '490' },
      { nome: 'Perfil Renal Avançado', info: 'Prevenção DRC', preco: '380' },
      { nome: 'Destartarização', info: 'Com RX dental', preco: '890' },
    ]},
  ],
  passaros: [
    { categoria: 'Aves e Exóticos', itens: [
      { nome: 'Consulta Especialista Aves', info: 'Silvestre/doméstico', preco: '280' },
      { nome: 'Sexagem por DNA', info: 'Resultado 5 dias', preco: '180' },
      { nome: 'Check-up Exóticos', info: 'Répteis, roedores', preco: '350' },
    ]},
  ],
}

const planosVet = [
  { nome: 'Care Plus', preco: '299', beneficios: ['2 consultas/mês', 'Vacinas inclusas', '15% em exames', 'Emergência prioritária'], cor: '#4A9079' },
  { nome: 'Health Pro', preco: '549', beneficios: ['Consultas ilimitadas', 'Check-up semestral', '25% em tudo', 'Telemedicina 24h', 'Emergência VIP'], cor: '#2D5A4A', destaque: true },
  { nome: 'Total Care', preco: '899', beneficios: ['Tudo ilimitado', 'Check-up trimestral', '40% em tudo', 'Internação coberta', 'Cirurgias 50% off'], cor: '#1B4D3E' },
]

const reviewsVet = [
  { nome: 'Fernanda Almeida', pet: 'Mel (SRD)', texto: 'A Dra. Fernanda salvou minha Mel numa emergência às 3h da manhã. Equipe excepcional, estrutura de primeiro mundo!', nota: 5, tempo: '1 semana' },
  { nome: 'Marcos Oliveira', pet: 'Thor (Golden)', texto: 'A cirurgia TPLO foi um sucesso! Recuperação perfeita com a fisioterapia daqui. Não troco por nada.', nota: 5, tempo: '2 semanas' },
  { nome: 'Juliana Costa', pet: 'Luna (Persa)', texto: 'O plano Health Pro é fantástico. Luna faz acompanhamento renal e nunca tivemos problema. Prevenção de verdade!', nota: 5, tempo: '3 semanas' },
]

// ============ DADOS DO USUÁRIO (mock) ============
const userData = {
  nome: 'Juliana Costa',
  nivel: 'Platinum',
  pontos: 4.850,
  creditos: 388,
}

export function PetShopPremiumDemo({ demoConfig }: { demoConfig?: any }) {
  const [mode, setMode] = useState<Mode>('petshop')
  const [animalTab, setAnimalTab] = useState<AnimalTab>('caes')
  const [showBooking, setShowBooking] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [showProductsDropdown, setShowProductsDropdown] = useState(false)

  const isPetshop = mode === 'petshop'
  const data = isPetshop ? petshopData : vetData
  const equipe = isPetshop ? equipePetshop : equipeVet
  const servicos = isPetshop ? servicosPetshop : servicosVet
  const reviews = isPetshop ? reviewsPetshop : reviewsVet
  const planos = isPetshop ? planosFidelidade : planosVet
  // Presentation mode - uses demoConfig prop
  const nomeExibicao = (demoConfig?.nome || data.nome)

  const getProdutos = () => {
    if (isPetshop) {
      return produtosPetshop[animalTab] || []
    } else {
      return especialidadesVet[animalTab] || []
    }
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const scrollToProducts = (animal: AnimalTab) => {
    setAnimalTab(animal)
    setShowProductsDropdown(false)
    setTimeout(() => {
      document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  // Paletas de cores
  const colors = isPetshop ? {
    primary: '#8B5A2B',
    primaryLight: '#D4A574',
    bg: '#FAF8F5',
    bgAlt: '#F5F0E8',
    bgDark: '#2C2418',
    text: '#2C2418',
    textMuted: '#8B7355',
    accent: '#C9A86C',
    border: '#E8E0D4',
  } : {
    primary: '#1B4D3E',
    primaryLight: '#4A9079',
    bg: '#F5FAF8',
    bgAlt: '#E8F3EF',
    bgDark: '#0D2A23',
    text: '#1B2D28',
    textMuted: '#5A7A6F',
    accent: '#6BAF9A',
    border: '#D0E4DC',
  }

  // Icones
  const DogIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5M14 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5M8 14v.5M16 14v.5M11.25 16.25h1.5L12 17l-.75-.75z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.42 11.247A13.152 13.152 0 004 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0112 5c.78 0 1.5.108 2.161.306" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  const CatIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 5c-1.895 0-3.667.504-5.083 1.368M12 5c1.895 0 3.667.504 5.083 1.368M12 5V3m-5.083 3.368C5.228 7.486 4 9.554 4 12c0 4.418 3.582 8 8 8s8-3.582 8-8c0-2.446-1.228-4.514-2.917-5.632m-10.166 0L3 3m14.083 3.368L21 3M9 14c.5.5 1.5 1 3 1s2.5-.5 3-1m-5-2.5v.5m4-.5v.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  const BirdIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 7c0-2.21-1.79-4-4-4S8 4.79 8 7c0 .74.21 1.43.56 2.02M12 3v2m4 2c1.1 0 2.12.4 2.91 1.07M8 7c-1.1 0-2.12.4-2.91 1.07" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.09 8.07C3.81 9.31 3 11.12 3 13c0 4.42 4.03 8 9 8s9-3.58 9-8c0-1.88-.81-3.69-2.09-4.93M9 13h.01M15 13h.01M10 17s.9 1 2 1 2-1 2-1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  const StarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )

  const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  const animalTabs = isPetshop
    ? [
        { id: 'caes' as AnimalTab, label: 'Cães', icon: DogIcon },
        { id: 'gatos' as AnimalTab, label: 'Gatos', icon: CatIcon },
        { id: 'passaros' as AnimalTab, label: 'Pássaros', icon: BirdIcon },
      ]
    : [
        { id: 'caes' as AnimalTab, label: 'Cães', icon: DogIcon },
        { id: 'gatos' as AnimalTab, label: 'Felinos', icon: CatIcon },
        { id: 'passaros' as AnimalTab, label: 'Exóticos', icon: BirdIcon },
      ]

  return (
    <main className="min-h-screen" style={{ backgroundColor: colors.bg }}>
      {/* Toggle Mode - Fixo no topo */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="flex shadow-lg" style={{ backgroundColor: colors.bgDark }}>
          {[
            { id: 'petshop' as Mode, label: 'Pet Shop' },
            { id: 'veterinaria' as Mode, label: 'Veterinária' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => { setMode(opt.id); setAnimalTab('caes'); }}
              className="px-6 py-2.5 text-sm font-medium transition-all"
              style={{
                backgroundColor: mode === opt.id ? colors.primaryLight : 'transparent',
                color: mode === opt.id ? colors.bgDark : colors.primaryLight,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <header style={{ backgroundColor: colors.bgDark }} className="pt-16 pb-3 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-light tracking-tight" style={{ color: colors.primaryLight }}>
              {nomeExibicao}
            </span>
            <span className="text-xs px-2 py-1 font-semibold" style={{ backgroundColor: colors.accent, color: colors.bgDark }}>
              {userData.nivel}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollTo('servicos')} className="text-sm transition-colors hover:opacity-70" style={{ color: colors.primaryLight }}>Serviços</button>
            <button onClick={() => scrollTo('planos')} className="text-sm transition-colors hover:opacity-70" style={{ color: colors.primaryLight }}>Planos</button>
            <button onClick={() => scrollTo('equipe')} className="text-sm transition-colors hover:opacity-70" style={{ color: colors.primaryLight }}>Equipe</button>

            {/* Dropdown Produtos */}
            <div
              className="relative"
              onMouseEnter={() => setShowProductsDropdown(true)}
              onMouseLeave={() => setShowProductsDropdown(false)}
            >
              <button
                className="flex items-center gap-1 text-sm transition-colors hover:opacity-70 py-2"
                style={{ color: colors.primaryLight }}
              >
                {isPetshop ? 'Loja' : 'Especialidades'}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`transition-transform duration-200 ${showProductsDropdown ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div
                className={`absolute top-full left-0 pt-1 min-w-[180px] z-50 transition-all duration-200 ${
                  showProductsDropdown
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-2'
                }`}
              >
                <div
                  className="py-2 shadow-lg"
                  style={{ backgroundColor: colors.bgDark, border: `1px solid ${colors.primary}40` }}
                >
                  {animalTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => scrollToProducts(tab.id)}
                      className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors hover:opacity-70"
                      style={{ color: colors.primaryLight }}
                    >
                      <tab.icon />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => scrollTo('galeria')} className="text-sm transition-colors hover:opacity-70" style={{ color: colors.primaryLight }}>Galeria</button>
            <button onClick={() => scrollTo('avaliacoes')} className="text-sm transition-colors hover:opacity-70" style={{ color: colors.primaryLight }}>Avaliações</button>

            {/* Pontos */}
            <button
              onClick={() => setShowAccount(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm"
              style={{ backgroundColor: colors.accent, color: colors.bgDark }}
            >
              <StarIcon />
              <span className="font-semibold">{userData.pontos.toLocaleString()}</span>
            </button>
          </nav>

          <button
            onClick={() => setShowBooking(true)}
            className="px-5 py-2 text-sm font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: colors.primaryLight, color: colors.bgDark }}
          >
            {isPetshop ? 'Agendar VIP' : 'Agendar'}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img
          src={isPetshop ? '/demos/pet-shop/banner-petshop.jpg' : '/demos/pet-shop/banner-vet.jpg'}
          alt={nomeExibicao}
          
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${colors.bgDark}ee 0%, ${colors.bgDark}aa 50%, ${colors.bgDark}44 100%)` }} />

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-4 w-full">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs px-3 py-1 font-semibold uppercase tracking-wider" style={{ backgroundColor: colors.accent, color: colors.bgDark }}>
                  Premium
                </span>
                <span className="text-xs px-3 py-1 font-semibold" style={{ backgroundColor: colors.primaryLight, color: colors.bgDark }}>
                  {userData.pontos.toLocaleString()} pontos
                </span>
              </div>
              <p className="text-sm uppercase tracking-widest mb-3" style={{ color: colors.primaryLight }}>
                {data.tagline}
              </p>
              <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
                {data.nome}
              </h1>
              <p className="text-xl mb-6" style={{ color: colors.primaryLight }}>
                {data.slogan}
              </p>
              <div className="flex items-center gap-3 mb-8">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-white font-semibold text-lg">{data.rating}</span>
                <span style={{ color: colors.primaryLight }}>({data.totalReviews} avaliações)</span>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowBooking(true)}
                  className="px-8 py-4 text-sm font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: colors.primaryLight, color: colors.bgDark }}
                >
                  {isPetshop ? 'Agendar VIP' : 'Marcar Consulta'}
                </button>
                <button
                  onClick={() => scrollTo('planos')}
                  className="px-8 py-4 text-sm font-semibold border-2 transition-all hover:bg-white/10"
                  style={{ borderColor: colors.primaryLight, color: colors.primaryLight }}
                >
                  Ver Planos
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barra de Fidelidade */}
      <section className="py-4" style={{ backgroundColor: colors.accent }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-white/20">
                <StarIcon />
              </div>
              <div style={{ color: colors.bgDark }}>
                <p className="font-bold">Programa {isPetshop ? 'Patitas Club' : 'Vida Care'}</p>
                <p className="text-sm opacity-80">Olá, {userData.nome} | Nível {userData.nivel}</p>
              </div>
            </div>
            <div className="flex gap-8">
              <div className="text-center" style={{ color: colors.bgDark }}>
                <p className="text-2xl font-bold">{userData.pontos.toLocaleString()}</p>
                <p className="text-xs opacity-70">Pontos</p>
              </div>
              <div className="text-center" style={{ color: colors.bgDark }}>
                <p className="text-2xl font-bold">R$ {userData.creditos}</p>
                <p className="text-xs opacity-70">Créditos</p>
              </div>
              <div className="text-center" style={{ color: colors.bgDark }}>
                <p className="text-2xl font-bold">3x</p>
                <p className="text-xs opacity-70">Pontos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest" style={{ color: colors.primary }}>
              {isPetshop ? 'Serviços Premium' : 'Atendimentos'}
            </span>
            <h2 className="text-3xl mt-2 font-light" style={{ color: colors.text }}>
              {isPetshop ? 'Experiências Exclusivas' : 'Medicina de Excelência'}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {servicos.map((s, i) => (
              <div
                key={i}
                className="p-5 flex flex-col relative"
                style={{
                  backgroundColor: colors.bg,
                  border: s.destaque ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
                }}
              >
                {s.destaque && (
                  <span className="absolute -top-3 left-4 px-2 py-1 text-[10px] uppercase font-semibold" style={{ backgroundColor: colors.primary, color: '#fff' }}>
                    Destaque
                  </span>
                )}
                <h3 className="font-semibold mb-1" style={{ color: colors.text }}>{s.nome}</h3>
                <p className="text-xs mb-3 flex-1" style={{ color: colors.textMuted }}>{s.desc}</p>
                <div className="flex justify-between items-end">
                  <span className="text-lg font-semibold" style={{ color: colors.primary }}>
                    {s.preco.includes('consulta') ? s.preco : `R$ ${s.preco}`}
                  </span>
                  <span className="text-xs" style={{ color: colors.textMuted }}>{s.tempo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-16 px-4" style={{ backgroundColor: colors.bgAlt }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest" style={{ color: colors.primary }}>
              {isPetshop ? 'Patitas Club' : 'Vida Care'}
            </span>
            <h2 className="text-3xl mt-2 font-light" style={{ color: colors.text }}>
              Planos de Fidelidade
            </h2>
            <p className="mt-2 text-sm" style={{ color: colors.textMuted }}>
              Acumule pontos, ganhe descontos e benefícios exclusivos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {planos.map((p, i) => (
              <div
                key={i}
                className="p-6 relative"
                style={{
                  backgroundColor: colors.bg,
                  border: p.destaque ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
                }}
              >
                {p.destaque && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold" style={{ backgroundColor: colors.primary, color: '#fff' }}>
                    Mais Popular
                  </span>
                )}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.cor }} />
                  <h3 className="text-xl font-semibold" style={{ color: colors.text }}>{p.nome}</h3>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-light" style={{ color: colors.primary }}>R$ {p.preco}</span>
                  <span className="text-sm" style={{ color: colors.textMuted }}>/mês</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {p.beneficios.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm" style={{ color: colors.textMuted }}>
                      <span style={{ color: colors.primary }}><CheckIcon /></span>
                      {b}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-3 text-sm font-semibold transition-all hover:opacity-90"
                  style={{
                    backgroundColor: p.destaque ? colors.primary : 'transparent',
                    color: p.destaque ? '#fff' : colors.primary,
                    border: p.destaque ? 'none' : `1px solid ${colors.primary}`,
                  }}
                >
                  Assinar {p.nome}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section id="equipe" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest" style={{ color: colors.primary }}>
              Nossa Equipe
            </span>
            <h2 className="text-3xl mt-2 font-light" style={{ color: colors.text }}>
              Profissionais de Elite
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {equipe.map((p, i) => (
              <div key={i} className="text-center" style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}>
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={p.foto}
                    alt={p.nome}
                    
                    className="object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold" style={{ color: colors.text }}>{p.nome}</h3>
                  <p className="text-sm font-medium" style={{ color: colors.primary }}>{p.cargo}</p>
                  <p className="text-xs mt-1" style={{ color: colors.textMuted }}>{p.especializacao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Produtos / Especialidades */}
      <section id="produtos" className="py-16 px-4" style={{ backgroundColor: colors.bgAlt }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest" style={{ color: colors.primary }}>
              {isPetshop ? 'Loja Premium' : 'Especialidades'}
            </span>
            <h2 className="text-3xl mt-2 font-light" style={{ color: colors.text }}>
              {isPetshop ? 'Produtos Importados' : 'Atendimento Especializado'}
            </h2>
          </div>

          {/* Tabs de animais */}
          <div className="flex justify-center gap-2 mb-10">
            {animalTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAnimalTab(tab.id)}
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all"
                style={{
                  backgroundColor: animalTab === tab.id ? colors.primary : colors.bg,
                  color: animalTab === tab.id ? '#fff' : colors.textMuted,
                  border: `1px solid ${animalTab === tab.id ? colors.primary : colors.border}`,
                }}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Produtos */}
          <div className="space-y-8">
            {getProdutos().map((cat, i) => (
              <div key={i}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.primary }}>
                  {cat.categoria}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cat.itens.map((item, j) => (
                    <div
                      key={j}
                      className="p-4 flex justify-between items-center"
                      style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}
                    >
                      <div>
                        <p className="font-medium" style={{ color: colors.text }}>{item.nome}</p>
                        <p className="text-sm" style={{ color: colors.textMuted }}>{item.info}</p>
                      </div>
                      <span className="font-semibold whitespace-nowrap ml-4" style={{ color: colors.primary }}>
                        {item.preco.includes('consulta') ? item.preco : `R$ ${item.preco}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section id="galeria" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest" style={{ color: colors.primary }}>
              Galeria
            </span>
            <h2 className="text-3xl mt-2 font-light" style={{ color: colors.text }}>
              {isPetshop ? 'Nosso Espaço' : 'Nossa Estrutura'}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-square relative overflow-hidden group">
                <img
                  src={isPetshop ? `/demos/pet-shop/gallery-${i}.jpg` : `/demos/pet-shop/vet-gallery-${i}.jpg`}
                  alt={`Galeria ${i}`}
                  
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="avaliacoes" className="py-16 px-4" style={{ backgroundColor: colors.bgAlt }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium" style={{ color: colors.text }}>
                Avaliações do Google
              </span>
            </div>
            <div className="flex items-center justify-center gap-1">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm" style={{ color: colors.textMuted }}>
                {data.rating} ({data.totalReviews} avaliações)
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reviews.map((review, i) => (
              <div
                key={i}
                className="p-5"
                style={{ backgroundColor: colors.bg, borderLeft: `4px solid ${colors.primary}` }}
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: review.nota }).map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm mb-4" style={{ color: colors.textMuted }}>
                  "{review.texto}"
                </p>
                <div>
                  <p className="font-medium text-sm" style={{ color: colors.text }}>{review.nome}</p>
                  <p className="text-xs" style={{ color: colors.primary }}>{review.pet}</p>
                  <p className="text-xs mt-1" style={{ color: colors.accent }}>há {review.tempo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-16 px-4" style={{ backgroundColor: colors.bgDark }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest" style={{ color: colors.primaryLight }}>
              Contato
            </span>
            <h2 className="text-3xl mt-2 font-light text-white">
              Visite-nos
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center mb-10">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: colors.primaryLight }}>Endereço</p>
              <p className="text-sm text-white/80">{data.endereco}</p>
              <p className="text-sm text-white/60">{data.bairro}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: colors.primaryLight }}>Horário</p>
              {data.horarios.map((h, i) => (
                <p key={i} className="text-sm text-white/80">{h}</p>
              ))}
            </div>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: colors.primaryLight }}>Contato</p>
              <p className="text-sm text-white/80">{data.telefone}</p>
              <p className="text-sm text-white/60">{data.email}</p>
            </div>
          </div>

          <div className="text-center">
            <a
              href={`https://wa.me/${data.whatsapp}`}
              className="inline-flex items-center gap-3 px-10 py-4 text-sm font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: '#25D366', color: '#fff' }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
              Fale com um Consultor VIP
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-6 text-center"
        style={{ backgroundColor: colors.bgDark, borderTop: `1px solid ${colors.primary}30` }}
      >
        <p style={{ color: colors.primaryLight }}>{data.nome} - {data.bairro.split(',')[0]}</p>
        <p className="text-xs mt-1" style={{ color: colors.primaryLight, opacity: 0.6 }}>
          Desenvolvido por G&G Digital
        </p>
      </footer>

      {/* WhatsApp Float */}
      <a
        href={`https://wa.me/${data.whatsapp}`}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-40"
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        </svg>
      </a>

      {/* Modal Agendamento */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowBooking(false)} />
          <div className="relative w-full max-w-md p-8 shadow-2xl" style={{ backgroundColor: colors.bg }}>
            <button
              onClick={() => setShowBooking(false)}
              className="absolute top-4 right-4 text-2xl"
              style={{ color: colors.textMuted }}
            >
              ×
            </button>
            <h3 className="text-2xl font-light mb-2" style={{ color: colors.text }}>Agendamento VIP</h3>
            <p className="text-sm mb-6" style={{ color: colors.textMuted }}>
              {isPetshop ? 'Agende banho, tosa ou spa para seu pet' : 'Agende consulta ou exame'}
            </p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Seu nome"
                className="w-full px-4 py-3 text-sm border outline-none focus:border-current"
                style={{ borderColor: colors.border, color: colors.text }}
              />
              <input
                type="text"
                placeholder="Nome do pet"
                className="w-full px-4 py-3 text-sm border outline-none focus:border-current"
                style={{ borderColor: colors.border, color: colors.text }}
              />
              <input
                type="tel"
                placeholder="WhatsApp"
                className="w-full px-4 py-3 text-sm border outline-none focus:border-current"
                style={{ borderColor: colors.border, color: colors.text }}
              />
              <select
                className="w-full px-4 py-3 text-sm border outline-none"
                style={{ borderColor: colors.border, color: colors.text }}
              >
                <option>Selecione o serviço</option>
                {servicos.map((s, i) => (
                  <option key={i}>{s.nome} - R$ {s.preco}</option>
                ))}
              </select>
              <a
                href={`https://wa.me/${data.whatsapp}?text=Olá! Gostaria de agendar um serviço.`}
                className="block w-full py-4 text-center text-sm font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: colors.primary, color: '#fff' }}
              >
                Enviar pelo WhatsApp
              </a>
            </div>
            <p className="text-xs text-center mt-4" style={{ color: colors.textMuted }}>
              Clientes {userData.nivel} ganham pontos em triplo!
            </p>
          </div>
        </div>
      )}

      {/* Modal Conta */}
      {showAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAccount(false)} />
          <div className="relative w-full max-w-md shadow-2xl overflow-hidden" style={{ backgroundColor: colors.bg }}>
            <div className="p-6" style={{ backgroundColor: colors.primary }}>
              <button
                onClick={() => setShowAccount(false)}
                className="absolute top-4 right-4 text-2xl text-white/80 hover:text-white"
              >
                ×
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: colors.primaryLight, color: colors.bgDark }}>
                  {userData.nome.charAt(0)}
                </div>
                <div className="text-white">
                  <p className="font-bold text-lg">{userData.nome}</p>
                  <p className="text-sm opacity-80">Membro {userData.nivel}</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4" style={{ backgroundColor: colors.bgAlt }}>
                  <p className="text-2xl font-bold" style={{ color: colors.primary }}>{userData.pontos.toLocaleString()}</p>
                  <p className="text-xs" style={{ color: colors.textMuted }}>Pontos</p>
                </div>
                <div className="text-center p-4" style={{ backgroundColor: colors.bgAlt }}>
                  <p className="text-2xl font-bold" style={{ color: colors.primary }}>R$ {userData.creditos}</p>
                  <p className="text-xs" style={{ color: colors.textMuted }}>Créditos</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-4" style={{ backgroundColor: colors.bgAlt }}>
                  <p className="font-semibold text-sm" style={{ color: colors.text }}>Próximo nível: Diamond</p>
                  <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
                    <div className="h-full w-3/4 rounded-full" style={{ backgroundColor: colors.primary }} />
                  </div>
                  <p className="text-xs mt-1" style={{ color: colors.textMuted }}>Faltam 1.150 pontos</p>
                </div>
                <button
                  className="w-full py-3 text-sm font-semibold"
                  style={{ backgroundColor: colors.primary, color: '#fff' }}
                >
                  Resgatar Prêmios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
