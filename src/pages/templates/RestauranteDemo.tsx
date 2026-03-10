
import { useState } from 'react'

// Dados completos do restaurante premium
const menuItems = [
  { id: 1, nome: 'Lasanha alla Nonna', desc: 'Receita original da familia, massa fresca feita diariamente, molho de tomate San Marzano', preco: 58, categoria: 'Massas', imagem: true, destaque: true, calorias: 520, tempo: '25 min' },
  { id: 2, nome: 'Ossobuco alla Milanese', desc: 'Cozido lentamente por 4 horas com risoto de acafrao importado', preco: 89, categoria: 'Carnes', imagem: true, destaque: true, calorias: 680, tempo: '30 min' },
  { id: 3, nome: 'Spaghetti alla Carbonara', desc: 'Guanciale importado, ovos caipiras, pecorino romano DOP', preco: 52, categoria: 'Massas', imagem: true, calorias: 450, tempo: '15 min' },
  { id: 4, nome: 'Risotto ai Funghi Porcini', desc: 'Arroz arborio, cogumelos porcini frescos, parmigiano reggiano 24 meses', preco: 62, categoria: 'Risotos', imagem: true, calorias: 420, tempo: '20 min' },
  { id: 5, nome: 'Saltimbocca alla Romana', desc: 'Vitela com presunto de Parma e salvia, ao vinho branco', preco: 78, categoria: 'Carnes', imagem: true, calorias: 380, tempo: '18 min' },
  { id: 6, nome: 'Gnocchi al Pesto', desc: 'Nhoque de batata artesanal, pesto genoves fresco, pinoli tostados', preco: 48, categoria: 'Massas', imagem: true, calorias: 390, tempo: '12 min' },
  { id: 7, nome: 'Tiramisu della Casa', desc: 'Biscoitos savoiardi, mascarpone italiano, cafe espresso', preco: 28, categoria: 'Sobremesas', imagem: true, destaque: true, calorias: 320, tempo: '5 min' },
  { id: 8, nome: 'Panna Cotta ai Frutti', desc: 'Creme de baunilha bourbon com calda de frutas vermelhas', preco: 24, categoria: 'Sobremesas', imagem: true, calorias: 280, tempo: '5 min' },
  { id: 9, nome: 'Filetto al Tartufo', desc: 'File mignon com creme de trufas negras e batatas ao murro', preco: 145, categoria: 'Carnes', imagem: true, destaque: true, calorias: 720, tempo: '25 min' },
  { id: 10, nome: 'Ravioli di Aragosta', desc: 'Massa recheada com lagosta, molho de tomate fresco e manjericao', preco: 98, categoria: 'Massas', imagem: true, calorias: 480, tempo: '18 min' },
]

const googleReviews = [
  { nome: 'Maria Silva', nota: 5, texto: 'Melhor lasanha de Curitiba! Ambiente acolhedor, vou sempre com a familia.', tempo: '2 semanas' },
  { nome: 'Joao Pereira', nota: 5, texto: 'Comida italiana autentica. O ossobuco e divino! Sommelier excelente.', tempo: '1 mes' },
  { nome: 'Ana Costa', nota: 5, texto: 'Lugar maravilhoso para jantar em casal. Ambiente romantico e comida perfeita.', tempo: '1 mes' },
  { nome: 'Carlos M.', nota: 5, texto: 'Fiz minha reserva pelo site e foi muito pratico. Sistema de pontos e otimo!', tempo: '2 meses' },
]

const chefsSpecials = [
  { nome: 'Menu Degustacao', desc: '7 pratos harmonizados com vinhos', preco: 320, pessoas: 1 },
  { nome: 'Jantar Romantico', desc: 'Entrada + prato + sobremesa + vinho para casal', preco: 450, pessoas: 2 },
  { nome: 'Festa in Famiglia', desc: 'Menu especial para 6 pessoas com entrada compartilhada', preco: 890, pessoas: 6 },
]

type CartItem = {
  id: number
  nome: string
  preco: number
  quantidade: number
}

type User = {
  name: string
  email: string
  points: number
  level: 'Bronze' | 'Prata' | 'Ouro' | 'Diamante'
  nextLevel: number
}

type OrderStatus = 'preparing' | 'ready' | 'delivered'

type Order = {
  id: string
  date: string
  items: string[]
  total: number
  status: OrderStatus
}

export function RestaurantePremiumDemo({ demoConfig }: { demoConfig?: any }) {
  // Presentation mode - uses demoConfig prop
  const nomeRestaurante = (demoConfig?.nome || 'Trattoria Nonna Rosa')
  const nomeAbreviado = (demoConfig?.nome || 'Nonna Rosa')
  const iniciais = ((demoConfig?.nome || 'Nonna Rosa').split(' ').map((w:string) => w[0]).join('').slice(0,2))
  const logoUrl = (demoConfig?.logo || null)

  const [activeTab, setActiveTab] = useState('Todos')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('inicio')
  const [isLoggedIn] = useState(true)
  const [, setShowCheckout] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'delivery' | 'payment' | 'confirmation'>('cart')
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('card')
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [accountTab, setAccountTab] = useState<'orders' | 'profile' | 'addresses'>('orders')
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery')

  const [user] = useState<User>({
    name: 'Maria Santos',
    email: 'maria@email.com',
    points: 2480,
    level: 'Ouro',
    nextLevel: 520
  })

  const [orders] = useState<Order[]>([
    { id: '#1892', date: '30/01/2024', items: ['Lasanha alla Nonna', 'Tiramisu'], total: 86, status: 'delivered' },
    { id: '#1845', date: '22/01/2024', items: ['Ossobuco alla Milanese', 'Panna Cotta'], total: 113, status: 'delivered' },
    { id: '#1798', date: '15/01/2024', items: ['Filetto al Tartufo'], total: 145, status: 'delivered' },
  ])

  const categorias = ['Todos', 'Massas', 'Carnes', 'Risotos', 'Sobremesas']

  const filteredItems = activeTab === 'Todos'
    ? menuItems
    : menuItems.filter(item => item.categoria === activeTab)

  const addToCart = (item: typeof menuItems[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantidade: i.quantidade + 1 } : i)
      }
      return [...prev, { id: item.id, nome: item.nome, preco: item.preco, quantidade: 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id)
      if (existing && existing.quantidade > 1) {
        return prev.map(i => i.id === id ? { ...i, quantidade: i.quantidade - 1 } : i)
      }
      return prev.filter(i => i.id !== id)
    })
  }

  const getItemQuantity = (id: number) => cart.find(i => i.id === id)?.quantidade || 0

  const totalItems = cart.reduce((acc, item) => acc + item.quantidade, 0)
  const totalPrice = cart.reduce((acc, item) => acc + (item.preco * item.quantidade), 0)
  const deliveryFee = deliveryType === 'delivery' ? 8 : 0
  const discount = paymentMethod === 'pix' ? totalPrice * 0.05 : 0
  const finalTotal = totalPrice + deliveryFee - discount
  const pointsToEarn = Math.floor(totalPrice / 10)

  const processPayment = () => {
    setOrderSuccess(true)
    setTimeout(() => {
      setOrderSuccess(false)
      setCart([])
      setShowCheckout(false)
      setCheckoutStep('cart')
    }, 4000)
  }

  const bgColor = darkMode ? 'bg-[#1a0f0a]' : 'bg-[#f5f0e8]'
  const textColor = darkMode ? 'text-[#f5f0e8]' : 'text-[#2c1810]'
  const cardBg = darkMode ? 'bg-[#2c1810]' : 'bg-white'

  return (
    <main className={`${bgColor} min-h-screen font-serif transition-colors duration-500`}>
      {/* Header Premium */}
      <header className="bg-[#2c1810] py-3 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-[#d4a574] rounded-full flex items-center justify-center">
              {logoUrl ? (
                <img src={logoUrl} alt={nomeAbreviado} className="h-8 w-8 object-contain rounded-full" />
              ) : (
                <span className="text-[#d4a574] text-lg">{iniciais}</span>
              )}
            </div>
            <div>
              <span className="text-[#f5f0e8] text-lg italic">{nomeAbreviado}</span>
              <span className="text-[#d4a574] text-xs block">E-Commerce Premium</span>
            </div>
          </div>

          <nav className="hidden md:flex gap-6">
            {['inicio', 'cardapio', 'especiais', 'contato'].map(item => (
              <button
                key={item}
                onClick={() => {
                  setActiveNav(item)
                  document.getElementById(item)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`text-sm capitalize transition-colors ${
                  activeNav === item ? 'text-[#d4a574]' : 'text-[#a89080] hover:text-[#d4a574]'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-[#a89080] hover:text-[#d4a574] transition-colors"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
              )}
            </button>

            {/* Conta */}
            {isLoggedIn && (
              <button
                onClick={() => setShowAccountModal(true)}
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#d4a574] to-[#c49464] px-3 py-1.5 rounded-full"
              >
                <svg className="w-4 h-4 text-[#2c1810]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                <span className="text-[#2c1810] text-xs font-bold">{user.points} pts</span>
              </button>
            )}

            {/* Carrinho */}
            <button
              onClick={() => { setIsCartOpen(true); setShowCheckout(false); setCheckoutStep('cart'); }}
              className="relative text-[#d4a574] hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#d4a574] text-[#2c1810] text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Premium */}
      <section id="inicio" className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#2c1810]" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23d4a574'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative text-center px-4 z-10">
          <div className="w-32 h-32 mx-auto mb-8 border-2 border-[#d4a574] rounded-full flex items-center justify-center">
            {logoUrl ? (
              <img src={logoUrl} alt={nomeRestaurante} className="h-24 w-24 object-contain" />
            ) : (
              <span className="text-[#d4a574] text-6xl">{iniciais}</span>
            )}
          </div>
          <p className="text-[#d4a574] text-sm tracking-[0.3em] uppercase mb-4">LOJA VIRTUAL - EST. 1978</p>
          <h1 className="text-[#f5f0e8] text-5xl md:text-7xl mb-2">{nomeRestaurante}</h1>
          <p className="text-[#a89080] text-xl max-w-lg mx-auto mb-10">
            Peca online e receba em casa ou retire na loja
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#cardapio" className="bg-[#d4a574] text-[#2c1810] px-10 py-4 hover:bg-[#c49464] transition-all hover:scale-105 tracking-wide">
              Fazer Pedido
            </a>
            <a href="#especiais" className="border-2 border-[#d4a574] text-[#d4a574] px-10 py-4 hover:bg-[#d4a574] hover:text-[#2c1810] transition-all">
              Menu Degustacao
            </a>
          </div>
        </div>
      </section>

      {/* Faixa de Fidelidade */}
      {isLoggedIn && (
        <div className="bg-gradient-to-r from-[#d4a574] via-[#c49464] to-[#d4a574] py-4">
          <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#2c1810] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#d4a574]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div>
                <p className="text-[#2c1810] font-bold">Programa Famiglia - Nivel {user.level}</p>
                <p className="text-[#2c1810]/70 text-sm">Faltam {user.nextLevel} pontos para o proximo nivel</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-[#2c1810] text-2xl font-bold">{user.points}</p>
                <p className="text-[#2c1810]/70 text-xs">Pontos</p>
              </div>
              <div className="h-10 w-px bg-[#2c1810]/20" />
              <div className="text-center">
                <p className="text-[#2c1810] text-2xl font-bold">R$ {(user.points * 0.1).toFixed(0)}</p>
                <p className="text-[#2c1810]/70 text-xs">Em descontos</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      <section className={`py-16 ${cardBg}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className={`${textColor} text-xl font-medium`}>4.9 - 312 avaliacoes</span>
            </div>
            <div className="flex justify-center gap-1">
              {[1,2,3,4,5].map(i => (
                <span key={i} className="text-yellow-500 text-2xl">&#9733;</span>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {googleReviews.map((review, i) => (
              <div key={i} className={`p-5 ${darkMode ? 'bg-[#1a0f0a]' : 'bg-[#f5f0e8]'} border-l-4 border-[#d4a574]`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#d4a574] rounded-full flex items-center justify-center text-[#2c1810] font-bold">
                    {review.nome.charAt(0)}
                  </div>
                  <div>
                    <span className={`${textColor} font-medium block text-sm`}>{review.nome}</span>
                    <span className="text-[#a89080] text-xs">{review.tempo}</span>
                  </div>
                </div>
                <p className="text-[#8a7a6a] text-sm">{review.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cardapio Premium */}
      <section id="cardapio" className={`py-20 ${bgColor}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#d4a574] text-sm tracking-widest uppercase">Cardapio</span>
            <h3 className={`${textColor} text-4xl mt-2`}>Especialidades da Casa</h3>
            <p className="text-[#8a7a6a] mt-2">Adicione ao carrinho e finalize com pagamento online</p>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2 text-sm transition-all ${
                  activeTab === cat
                    ? 'bg-[#2c1810] text-[#d4a574]'
                    : `${cardBg} ${textColor} hover:bg-[#2c1810]/10`
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid com fotos */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredItems.map((item) => {
              const qty = getItemQuantity(item.id)
              return (
                <div
                  key={item.id}
                  className={`${cardBg} flex gap-4 p-4 border transition-all group ${
                    qty > 0 ? 'border-[#d4a574]' : 'border-[#d4a574]/20 hover:border-[#d4a574]'
                  } ${item.destaque ? 'ring-2 ring-[#d4a574]/30' : ''}`}
                >
                  {/* Imagem do prato */}
                  <div className="w-28 h-28 flex-shrink-0 relative overflow-hidden bg-[#2c1810]/10">
                    <img
                      src={`/demos/restaurante/dish-${item.id}.jpg`}
                      alt={item.nome}
                      
                      className="object-cover"
                    />
                    {item.destaque && (
                      <span className="absolute top-1 left-1 bg-[#d4a574] text-[#2c1810] text-[10px] px-2 py-0.5 z-10">
                        Chef
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`${textColor} font-medium group-hover:text-[#d4a574] transition-colors`}>{item.nome}</h4>
                        <p className="text-[#8a7a6a] text-sm mt-1">{item.desc}</p>
                      </div>
                      <span className="text-[#d4a574] text-lg font-medium ml-4">R$ {item.preco}</span>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-[#a89080]">
                      <span>{item.calorias} kcal</span>
                      <span>|</span>
                      <span>{item.tempo}</span>
                    </div>

                    <div className="mt-auto pt-3 flex justify-end">
                      {qty > 0 ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 bg-[#2c1810] text-[#d4a574] flex items-center justify-center">-</button>
                          <span className={`w-6 text-center ${textColor}`}>{qty}</span>
                          <button onClick={() => addToCart(item)} className="w-8 h-8 bg-[#d4a574] text-[#2c1810] flex items-center justify-center">+</button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(item)} className="px-4 py-2 bg-[#d4a574] text-[#2c1810] text-sm hover:bg-[#c49464] transition-colors">
                          Adicionar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Menu Especiais do Chef */}
      <section id="especiais" className={`py-20 ${cardBg}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#d4a574] text-sm tracking-widest uppercase">Experiencias</span>
            <h3 className={`${textColor} text-4xl mt-2`}>Menus Especiais</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {chefsSpecials.map((menu, i) => (
              <div key={i} className={`${darkMode ? 'bg-[#1a0f0a]' : 'bg-[#f5f0e8]'} p-8 border border-[#d4a574]/20 hover:border-[#d4a574] transition-all text-center`}>
                <div className="w-16 h-16 mx-auto mb-4 bg-[#d4a574] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#2c1810]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className={`${textColor} text-xl mb-2`}>{menu.nome}</h4>
                <p className="text-[#8a7a6a] text-sm mb-4">{menu.desc}</p>
                <p className="text-[#d4a574] text-2xl font-bold mb-1">R$ {menu.preco}</p>
                <p className="text-[#a89080] text-xs">{menu.pessoas === 1 ? 'por pessoa' : `para ${menu.pessoas} pessoas`}</p>
                <button className="mt-6 w-full py-3 border border-[#d4a574] text-[#d4a574] hover:bg-[#d4a574] hover:text-[#2c1810] transition-colors">
                  Adicionar ao Carrinho
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className={`py-20 ${bgColor}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <span className="text-[#d4a574] text-sm tracking-widest uppercase">Visite-nos</span>
              <h3 className={`${textColor} text-4xl mt-2 mb-8`}>Faca sua Reserva</h3>

              <div className="space-y-6">
                <div className={`p-6 ${darkMode ? 'bg-[#2c1810]' : 'bg-white'} border-l-4 border-[#d4a574]`}>
                  <p className="text-[#d4a574] font-medium mb-2">Endereco</p>
                  <p className="text-[#8a7a6a]">Rua das Flores, 456<br/>Santa Felicidade, Curitiba - PR</p>
                </div>
                <div className={`p-6 ${darkMode ? 'bg-[#2c1810]' : 'bg-white'} border-l-4 border-[#d4a574]`}>
                  <p className="text-[#d4a574] font-medium mb-2">Horario</p>
                  <p className="text-[#8a7a6a]">Terca a Domingo<br/>12h as 15h | 19h as 23h</p>
                </div>
                <div className={`p-6 ${darkMode ? 'bg-[#2c1810]' : 'bg-white'} border-l-4 border-[#d4a574]`}>
                  <p className="text-[#d4a574] font-medium mb-2">Reservas</p>
                  <p className="text-[#8a7a6a]">(41) 3322-1100<br/>WhatsApp: (41) 99999-9999</p>
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-[#2c1810]' : 'bg-white'} p-8`}>
              <h4 className={`${textColor} text-xl mb-6`}>Reserve sua Mesa</h4>
              <form className="space-y-4">
                <input type="text" placeholder="Nome completo" className={`w-full px-4 py-3 border border-[#d4a574]/30 bg-transparent ${textColor} focus:border-[#d4a574] outline-none`} />
                <div className="grid grid-cols-2 gap-4">
                  <input type="date" className={`w-full px-4 py-3 border border-[#d4a574]/30 bg-transparent ${textColor} focus:border-[#d4a574] outline-none`} />
                  <select className={`w-full px-4 py-3 border border-[#d4a574]/30 bg-transparent ${textColor} focus:border-[#d4a574] outline-none`}>
                    <option>19:00</option>
                    <option>20:00</option>
                    <option>21:00</option>
                  </select>
                </div>
                <select className={`w-full px-4 py-3 border border-[#d4a574]/30 bg-transparent ${textColor} focus:border-[#d4a574] outline-none`}>
                  <option>2 pessoas</option>
                  <option>4 pessoas</option>
                  <option>6 pessoas</option>
                  <option>Mais de 6</option>
                </select>
                <button type="button" className="w-full py-4 bg-[#2c1810] text-[#d4a574] hover:bg-[#1a0f0a] transition-colors">
                  Solicitar Reserva
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a0f0a] text-[#a89080] py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-[#d4a574] text-lg italic mb-4">{nomeAbreviado}</h4>
              <p className="text-sm">E-commerce premium com pagamento online. Peca e receba em casa!</p>
            </div>
            <div>
              <h5 className="text-[#f5f0e8] text-sm uppercase tracking-wider mb-4">Pagamento</h5>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-[#2c1810] text-xs">PIX</span>
                <span className="px-2 py-1 bg-[#2c1810] text-xs">Cartao</span>
                <span className="px-2 py-1 bg-[#2c1810] text-xs">Visa</span>
                <span className="px-2 py-1 bg-[#2c1810] text-xs">Master</span>
              </div>
            </div>
            <div>
              <h5 className="text-[#f5f0e8] text-sm uppercase tracking-wider mb-4">Horario Delivery</h5>
              <ul className="space-y-2 text-sm">
                <li>Terca - Sexta: 19h-22h</li>
                <li>Sabado: 12h-15h, 19h-23h</li>
                <li>Domingo: 12h-16h</li>
              </ul>
            </div>
            <div>
              <h5 className="text-[#f5f0e8] text-sm uppercase tracking-wider mb-4">Fidelidade</h5>
              <p className="text-sm mb-2">Programa Famiglia</p>
              <p className="text-xs">Acumule pontos e ganhe descontos exclusivos.</p>
            </div>
          </div>
          <div className="border-t border-[#2c1810] pt-8 text-center text-sm">
            <p>&#169; 2024 {nomeRestaurante} - Curitiba, PR</p>
            <p className="text-xs mt-2 text-[#5c4a3a]">Desenvolvido pela G & G Digital</p>
          </div>
        </div>
      </footer>

      {/* Modal Carrinho / Checkout Completo */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-[#f5f0e8] h-full overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="sticky top-0 bg-[#2c1810] p-4 flex justify-between items-center z-10">
              <div className="flex items-center gap-4">
                {checkoutStep !== 'cart' && !orderSuccess && (
                  <button onClick={() => setCheckoutStep(checkoutStep === 'payment' ? 'delivery' : 'cart')} className="text-[#a89080] hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <h3 className="text-[#d4a574] text-lg">
                  {orderSuccess ? 'Pedido Confirmado!' : checkoutStep === 'cart' ? 'Seu Carrinho' : checkoutStep === 'delivery' ? 'Entrega' : checkoutStep === 'payment' ? 'Pagamento' : 'Confirmacao'}
                </h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="text-[#a89080] hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress Steps */}
            {!orderSuccess && cart.length > 0 && (
              <div className="px-4 py-3 bg-white border-b border-[#d4a574]/20">
                <div className="flex justify-between items-center">
                  {['cart', 'delivery', 'payment'].map((step, i) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        checkoutStep === step || ['delivery', 'payment'].indexOf(checkoutStep) >= i
                          ? 'bg-[#d4a574] text-[#2c1810]'
                          : 'bg-[#e5e0d8] text-[#a89080]'
                      }`}>
                        {i + 1}
                      </div>
                      {i < 2 && <div className={`w-12 h-0.5 ${['delivery', 'payment'].indexOf(checkoutStep) > i ? 'bg-[#d4a574]' : 'bg-[#e5e0d8]'}`} />}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1 text-xs text-[#a89080]">
                  <span>Carrinho</span>
                  <span>Entrega</span>
                  <span>Pagamento</span>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              {orderSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-2xl text-[#2c1810] mb-2">Pedido #1893 Confirmado!</h4>
                  <p className="text-[#8a7a6a] mb-4">Voce ganhou +{pointsToEarn} pontos</p>
                  <div className="bg-[#2c1810] p-4 rounded-lg text-left">
                    <p className="text-[#d4a574] text-sm mb-2">Previsao de entrega:</p>
                    <p className="text-white text-lg font-bold">45-60 minutos</p>
                    <p className="text-[#a89080] text-xs mt-2">Acompanhe pelo WhatsApp</p>
                  </div>
                </div>
              ) : cart.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-[#d4a574]/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-[#5c4a3a]">Carrinho vazio</p>
                </div>
              ) : checkoutStep === 'cart' ? (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-white border border-[#d4a574]/20">
                        <div>
                          <p className="text-[#2c1810] font-medium">{item.nome}</p>
                          <p className="text-[#a89080] text-sm">R$ {item.preco.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 bg-[#2c1810] text-[#d4a574] flex items-center justify-center">-</button>
                          <span className="w-6 text-center">{item.quantidade}</span>
                          <button onClick={() => addToCart({ id: item.id, nome: item.nome, preco: item.preco, desc: '', categoria: '', imagem: false, calorias: 0, tempo: '' })} className="w-7 h-7 bg-[#d4a574] text-[#2c1810] flex items-center justify-center">+</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#d4a574]/30 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[#5c4a3a]">Subtotal</span>
                      <span className="text-[#2c1810] font-bold">R$ {totalPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-[#d4a574] text-sm mb-4">+{pointsToEarn} pontos neste pedido</p>
                    <button
                      onClick={() => setCheckoutStep('delivery')}
                      className="w-full py-4 bg-[#2c1810] text-[#d4a574] hover:bg-[#1a0f0a] transition-colors"
                    >
                      Continuar
                    </button>
                  </div>
                </>
              ) : checkoutStep === 'delivery' ? (
                <>
                  <h4 className="text-[#2c1810] font-medium mb-4">Tipo de Entrega</h4>
                  <div className="space-y-3 mb-6">
                    {[
                      { id: 'delivery', label: 'Delivery', desc: 'Receba em casa (R$ 8,00)', icon: '🚗' },
                      { id: 'pickup', label: 'Retirada', desc: 'Retire na loja (Gratis)', icon: '🏪' },
                    ].map(option => (
                      <button
                        key={option.id}
                        onClick={() => setDeliveryType(option.id as 'delivery' | 'pickup')}
                        className={`w-full p-4 border text-left flex items-center gap-4 transition-all ${
                          deliveryType === option.id ? 'border-[#d4a574] bg-[#d4a574]/10' : 'border-[#d4a574]/20'
                        }`}
                      >
                        <span className="text-2xl">{option.icon}</span>
                        <div>
                          <p className="text-[#2c1810] font-medium">{option.label}</p>
                          <p className="text-[#8a7a6a] text-sm">{option.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {deliveryType === 'delivery' && (
                    <div className="space-y-4 mb-6">
                      <h4 className="text-[#2c1810] font-medium">Endereco de Entrega</h4>
                      <div className="p-4 border border-[#d4a574] bg-[#d4a574]/5">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[#2c1810] font-medium">Casa</p>
                            <p className="text-[#8a7a6a] text-sm">Rua das Flores, 123 - Apto 45</p>
                            <p className="text-[#a89080] text-xs">Centro, Curitiba - PR</p>
                          </div>
                          <span className="text-xs bg-[#d4a574] text-[#2c1810] px-2 py-1">Principal</span>
                        </div>
                      </div>
                      <button className="w-full p-3 border-2 border-dashed border-[#d4a574]/30 text-[#d4a574] text-sm hover:border-[#d4a574] transition-colors">
                        + Adicionar novo endereco
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setCheckoutStep('payment')}
                    className="w-full py-4 bg-[#2c1810] text-[#d4a574] hover:bg-[#1a0f0a] transition-colors"
                  >
                    Continuar para Pagamento
                  </button>
                </>
              ) : checkoutStep === 'payment' ? (
                <>
                  <h4 className="text-[#2c1810] font-medium mb-4">Forma de Pagamento</h4>

                  <div className="space-y-3 mb-6">
                    {[
                      { id: 'pix', label: 'PIX', desc: '5% de desconto', icon: (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M15.45 16.52l-3.01-3.01c-.11-.11-.24-.13-.31-.13s-.2.02-.31.13l-3.01 3.01c-.97.97-2.56.97-3.54 0l-.71-.71 3.72-3.72c.39-.39 1.02-.39 1.41 0l3.01 3.01c.2.2.51.2.71 0l3.01-3.01c.39-.39 1.02-.39 1.41 0l3.72 3.72-.71.71c-.97.97-2.56.97-3.54 0l-.85-.85.85.85z"/>
                          <path d="M8.46 7.48l3.01 3.01c.11.11.24.13.31.13s.2-.02.31-.13l3.01-3.01c.97-.97 2.56-.97 3.54 0l.71.71-3.72 3.72c-.39.39-1.02.39-1.41 0l-3.01-3.01c-.2-.2-.51-.2-.71 0l-3.01 3.01c-.39.39-1.02.39-1.41 0L2.36 8.19l.71-.71c.97-.97 2.56-.97 3.54 0l1.85 1.85-1.85-1.85z"/>
                        </svg>
                      )},
                      { id: 'card', label: 'Cartao de Credito', desc: 'Visa, Master, Elo', icon: (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      )},
                    ].map(method => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as 'pix' | 'card')}
                        className={`w-full p-4 border text-left flex items-center gap-4 transition-all ${
                          paymentMethod === method.id ? 'border-[#d4a574] bg-[#d4a574]/10' : 'border-[#d4a574]/20'
                        }`}
                      >
                        <div className={`${paymentMethod === method.id ? 'text-[#d4a574]' : 'text-[#a89080]'}`}>
                          {method.icon}
                        </div>
                        <div>
                          <p className="text-[#2c1810] font-medium">{method.label}</p>
                          <p className="text-[#8a7a6a] text-sm">{method.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4 mb-6">
                      <input type="text" placeholder="Numero do cartao" className="w-full px-4 py-3 border border-[#d4a574]/30 focus:border-[#d4a574] outline-none" />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="MM/AA" className="w-full px-4 py-3 border border-[#d4a574]/30 focus:border-[#d4a574] outline-none" />
                        <input type="text" placeholder="CVV" className="w-full px-4 py-3 border border-[#d4a574]/30 focus:border-[#d4a574] outline-none" />
                      </div>
                      <input type="text" placeholder="Nome no cartao" className="w-full px-4 py-3 border border-[#d4a574]/30 focus:border-[#d4a574] outline-none" />
                    </div>
                  )}

                  {paymentMethod === 'pix' && (
                    <div className="mb-6 p-4 bg-white border border-[#d4a574]/20 text-center">
                      <div className="w-32 h-32 mx-auto bg-[#2c1810]/10 flex items-center justify-center mb-4">
                        <span className="text-xs text-[#a89080]">QR Code PIX</span>
                      </div>
                      <p className="text-[#2c1810] font-medium">Escaneie o QR Code</p>
                      <p className="text-[#8a7a6a] text-sm">ou copie a chave PIX</p>
                      <button className="mt-2 text-[#d4a574] text-sm underline">Copiar chave</button>
                    </div>
                  )}

                  {/* Resumo */}
                  <div className="border-t border-[#d4a574]/20 pt-4 mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8a7a6a]">Subtotal</span>
                      <span className="text-[#2c1810]">R$ {totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8a7a6a]">Taxa de entrega</span>
                      <span className="text-[#2c1810]">{deliveryFee > 0 ? `R$ ${deliveryFee.toFixed(2)}` : 'Gratis'}</span>
                    </div>
                    {paymentMethod === 'pix' && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Desconto PIX (5%)</span>
                        <span>- R$ {discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#d4a574]/20">
                      <span className="text-[#2c1810]">Total</span>
                      <span className="text-[#d4a574]">R$ {finalTotal.toFixed(2)}</span>
                    </div>
                    <p className="text-[#d4a574] text-sm">+{pointsToEarn} pontos neste pedido</p>
                  </div>

                  <button
                    onClick={processPayment}
                    className="w-full py-4 bg-[#2c1810] text-[#d4a574] hover:bg-[#1a0f0a] transition-colors"
                  >
                    {paymentMethod === 'pix' ? 'Confirmar Pagamento' : 'Pagar R$ ' + finalTotal.toFixed(2)}
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Modal Minha Conta */}
      {showAccountModal && isLoggedIn && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAccountModal(false)} />
          <div className="relative w-full max-w-lg bg-[#f5f0e8] shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-[#2c1810] p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#d4a574] rounded-full flex items-center justify-center text-[#2c1810] text-xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[#f5f0e8] font-medium">Ola, {user.name.split(' ')[0]}!</p>
                  <p className="text-[#a89080] text-sm">Nivel {user.level} - {user.points} pontos</p>
                </div>
              </div>
              <button onClick={() => setShowAccountModal(false)} className="text-[#a89080] hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#d4a574]/20">
              {[
                { id: 'orders', label: 'Meus Pedidos' },
                { id: 'profile', label: 'Perfil' },
                { id: 'addresses', label: 'Enderecos' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setAccountTab(tab.id as typeof accountTab)}
                  className={`flex-1 p-3 text-sm transition-colors ${
                    accountTab === tab.id ? 'bg-[#2c1810] text-[#d4a574]' : 'text-[#5c4a3a] hover:bg-[#d4a574]/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {accountTab === 'orders' && (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white border border-[#d4a574]/20 p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-[#2c1810] font-medium">{order.id}</span>
                          <span className="text-[#a89080] text-sm ml-3">{order.date}</span>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Entregue</span>
                      </div>
                      <p className="text-[#5c4a3a] text-sm mb-3">{order.items.join(', ')}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[#d4a574] font-bold">R$ {order.total.toFixed(2)}</span>
                        <button className="text-sm text-[#2c1810] border border-[#2c1810] px-4 py-1 hover:bg-[#2c1810] hover:text-[#d4a574] transition-colors">
                          Pedir novamente
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {accountTab === 'profile' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#5c4a3a] mb-2">Nome</label>
                    <input type="text" value={user.name} readOnly className="w-full px-4 py-3 border border-[#d4a574]/30 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#5c4a3a] mb-2">E-mail</label>
                    <input type="email" value={user.email} readOnly className="w-full px-4 py-3 border border-[#d4a574]/30 bg-white" />
                  </div>
                  <button className="w-full py-3 bg-[#2c1810] text-[#d4a574] hover:bg-[#1a0f0a] transition-colors">
                    Editar Perfil
                  </button>
                </div>
              )}

              {accountTab === 'addresses' && (
                <div className="space-y-4">
                  <div className="p-4 border border-[#d4a574] bg-[#d4a574]/5">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[#2c1810] font-medium">Casa</span>
                      <span className="text-xs bg-[#d4a574] text-[#2c1810] px-2 py-1">Principal</span>
                    </div>
                    <p className="text-[#5c4a3a] text-sm">Rua das Flores, 123 - Apto 45</p>
                    <p className="text-[#a89080] text-sm">Centro, Curitiba - PR</p>
                  </div>
                  <button className="w-full p-3 border-2 border-dashed border-[#d4a574]/30 text-[#d4a574] text-sm hover:border-[#d4a574] transition-colors">
                    + Adicionar novo endereco
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Carrinho Flutuante Mobile */}
      {totalItems > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 bg-[#d4a574] text-[#2c1810] px-6 py-3 shadow-lg hover:bg-[#c49464] transition-all z-50 flex items-center gap-2 md:hidden"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{totalItems} itens</span>
          <span>-</span>
          <span>R$ {totalPrice.toFixed(2)}</span>
        </button>
      )}

      {/* WhatsApp Float */}
      {totalItems === 0 && (
        <a
          href="https://wa.me/5541999999999"
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
        >
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      )}
    </main>
  )
}
