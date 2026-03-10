
import { useState } from 'react'

// Dados premium do emporio
const produtos = [
  { id: 1, nome: 'Oleo de Rosa Mosqueta Bio', desc: 'Prensado a frio, certificacao ECOCERT, 30ml', preco: 98, categoria: 'Oleos', origem: 'Chile', organico: true, imagem: true, estoque: 12 },
  { id: 2, nome: 'Cha Pu-erh Vintage 20 Anos', desc: 'Folhas fermentadas, edicao limitada, 100g', preco: 245, categoria: 'Chas', origem: 'Yunnan, China', organico: false, imagem: true, estoque: 5, raro: true },
  { id: 3, nome: 'Maca Negra Gelatinizada', desc: 'Po premium, alta concentracao, 250g', preco: 128, categoria: 'Superfoods', origem: 'Peru', organico: true, imagem: true, estoque: 18 },
  { id: 4, nome: 'Spirulina Havaiana Premium', desc: 'Tablets organicos, 300 unidades', preco: 185, categoria: 'Superfoods', origem: 'Hawaii', organico: true, imagem: true, estoque: 8 },
  { id: 5, nome: 'Mel de Melato da Bracatinga', desc: 'Colheita sazonal 2024, 500g', preco: 145, categoria: 'Meis', origem: 'Santa Catarina', organico: true, imagem: true, estoque: 3, raro: true },
  { id: 6, nome: 'Azeite Biodinamico Extra Virgem', desc: 'Acidez 0.1%, primeira prensagem, 500ml', preco: 118, categoria: 'Oleos', origem: 'Portugal', organico: true, imagem: true, estoque: 15 },
  { id: 7, nome: 'Cacau Criollo Cru', desc: 'Nao alcalinizado, 100% puro, 300g', preco: 95, categoria: 'Superfoods', origem: 'Equador', organico: true, imagem: true, estoque: 20 },
  { id: 8, nome: 'Kombucha Artesanal Hibisco', desc: 'Fermentacao natural 30 dias, 750ml', preco: 38, categoria: 'Bebidas', origem: 'Brasil', organico: true, imagem: true, estoque: 25 },
  { id: 9, nome: 'Ashwagandha KSM-66', desc: 'Extrato padronizado, 60 capsulas', preco: 165, categoria: 'Superfoods', origem: 'India', organico: true, imagem: true, estoque: 10 },
  { id: 10, nome: 'Oleo de Argan Marroquino', desc: 'Prensado a frio, uso cosmetico/culinario, 50ml', preco: 135, categoria: 'Oleos', origem: 'Marrocos', organico: true, imagem: true, estoque: 7, raro: true },
]

const assinaturas = [
  { id: 'essencial', nome: 'Box Essencial', desc: '4 produtos selecionados por mes', preco: 189, economia: 15, produtos: 4 },
  { id: 'premium', nome: 'Box Premium', desc: '6 produtos + 2 lancamentos exclusivos', preco: 329, economia: 20, produtos: 8, popular: true },
  { id: 'gourmet', nome: 'Box Gourmet', desc: '10 produtos + consultoria nutricional', preco: 489, economia: 25, produtos: 10 },
]

const reviews = [
  { nome: 'Marina C.', avatar: 'M', nota: 5, texto: 'A curadoria e impecavel! Cada produto e uma descoberta. Sou assinante ha 6 meses.', tempo: '1 semana' },
  { nome: 'Paulo R.', avatar: 'P', nota: 5, texto: 'Melhor emporio de Curitiba. O cha Pu-erh e excepcional, vale cada centavo.', tempo: '2 semanas' },
  { nome: 'Carla S.', avatar: 'C', nota: 5, texto: 'Atendimento especializado e produtos de altissima qualidade.', tempo: '1 mes' },
  { nome: 'Roberto M.', avatar: 'R', nota: 5, texto: 'O programa de pontos e otimo! Ja troquei por varios descontos.', tempo: '1 mes' },
]

type CartItem = { id: number; nome: string; preco: number; quantidade: number }
type User = { name: string; email: string; points: number; level: 'Semente' | 'Broto' | 'Botanico' | 'Mestre'; nextLevel: number }
type OrderStatus = 'preparing' | 'shipped' | 'delivered'
type Order = { id: string; date: string; items: string[]; total: number; status: OrderStatus }

export function ProdutosNaturaisPremiumDemo({ demoConfig }: { demoConfig?: any }) {
  // Presentation mode - uses demoConfig prop
  const nomeLoja = (demoConfig?.nome || 'Raizes Emporio Botanico')
  const logoUrl = (demoConfig?.logo || null)

  const [activeCategory, setActiveCategory] = useState('Todos')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('inicio')
  const [showAssinaturas, setShowAssinaturas] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [accountTab, setAccountTab] = useState<'orders' | 'profile' | 'addresses' | 'subscriptions'>('orders')
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'delivery' | 'payment'>('cart')
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix')
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery')
  const [orderSuccess, setOrderSuccess] = useState(false)

  const [user] = useState<User>({
    name: 'Ana Oliveira',
    email: 'ana@email.com',
    points: 1850,
    level: 'Botanico',
    nextLevel: 150
  })

  const [orders] = useState<Order[]>([
    { id: '#PN2847', date: '28/01/2024', items: ['Oleo de Rosa Mosqueta', 'Maca Negra'], total: 226, status: 'delivered' },
    { id: '#PN2801', date: '15/01/2024', items: ['Cha Pu-erh Vintage', 'Spirulina'], total: 430, status: 'delivered' },
    { id: '#PN2756', date: '02/01/2024', items: ['Box Premium - Janeiro'], total: 329, status: 'delivered' },
  ])

  const categorias = ['Todos', 'Oleos', 'Chas', 'Superfoods', 'Meis', 'Bebidas']

  const filteredProducts = activeCategory === 'Todos'
    ? produtos
    : produtos.filter(p => p.categoria === activeCategory)

  const addToCart = (item: typeof produtos[0]) => {
    if (item.estoque <= 0) return
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
  const deliveryFee = deliveryType === 'delivery' ? 12 : 0
  const discount = paymentMethod === 'pix' ? totalPrice * 0.1 : 0
  const finalTotal = totalPrice + deliveryFee - discount
  const pointsToEarn = Math.floor(totalPrice / 5)

  const processPayment = () => {
    setOrderSuccess(true)
    setTimeout(() => {
      setOrderSuccess(false)
      setCart([])
      setIsCartOpen(false)
      setCheckoutStep('cart')
    }, 4000)
  }

  return (
    <main className="bg-[#f7f5f0] min-h-screen" style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}>
      {/* Header Premium */}
      <header className="bg-[#2c3e2d] border-b-2 border-[#8b7355] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={nomeLoja} className="w-8 h-8 object-contain" />
            ) : (
              <svg className="w-8 h-8 text-[#c4a77d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L12 6M12 6C9 6 6 8 6 12C6 16 9 22 12 22C15 22 18 16 18 12C18 8 15 6 12 6Z" />
                <path d="M8 12C8 12 10 14 12 14C14 14 16 12 16 12" />
              </svg>
            )}
            <div>
              <span className="text-[#f7f5f0] text-xl tracking-[0.15em]">{nomeLoja.split(' ')[0]?.toUpperCase()}</span>
              <span className="hidden sm:block text-[#c4a77d] text-[10px] tracking-[0.2em] -mt-1">E-COMMERCE PREMIUM</span>
            </div>
          </div>

          <nav className="hidden md:flex gap-6">
            {['inicio', 'catalogo', 'assinaturas', 'contato'].map(item => (
              <button
                key={item}
                onClick={() => {
                  setActiveNav(item)
                  if (item === 'assinaturas') setShowAssinaturas(true)
                  else document.getElementById(item)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`text-sm capitalize tracking-wide transition-colors ${
                  activeNav === item ? 'text-[#c4a77d]' : 'text-[#8b9b8c] hover:text-[#f7f5f0]'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Conta */}
            <button
              onClick={() => setShowAccountModal(true)}
              className="hidden md:flex items-center gap-2 bg-[#c4a77d]/20 border border-[#c4a77d]/40 px-3 py-1.5 hover:bg-[#c4a77d]/30 transition-colors"
            >
              <svg className="w-4 h-4 text-[#c4a77d]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <span className="text-[#c4a77d] text-xs">{user.points} pts</span>
              <span className="text-[#8b9b8c] text-xs">|</span>
              <span className="text-[#f7f5f0] text-xs">{user.level}</span>
            </button>

            {/* Carrinho */}
            <button onClick={() => { setIsCartOpen(true); setCheckoutStep('cart'); }} className="relative text-[#c4a77d] hover:text-[#f7f5f0] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#c4a77d] text-[#2c3e2d] text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="inicio" className="bg-[#2c3e2d] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="botanical" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="20" fill="none" stroke="#c4a77d" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#botanical)"/>
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative text-center">
          <div className="w-24 h-24 mx-auto mb-6 border border-[#c4a77d]/40 rounded-full flex items-center justify-center">
            <span className="text-[#c4a77d] text-xs tracking-wider">DESDE<br/><span className="text-xl text-[#f7f5f0]">2015</span></span>
          </div>
          <p className="text-[#c4a77d] text-[10px] tracking-[0.4em] uppercase mb-4">Curitiba - Parana</p>
          <h1 className="text-[#f7f5f0] text-5xl md:text-6xl font-light tracking-wide mb-2">{nomeLoja.split(' ')[0]}</h1>
          <h2 className="text-[#c4a77d] text-2xl md:text-3xl font-light mb-6">{nomeLoja.split(' ').slice(1).join(' ')} Premium</h2>
          <p className="text-[#8b9b8c] text-lg max-w-lg mx-auto mb-10">
            Compre online e receba em casa ou retire na loja
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#catalogo" className="bg-[#c4a77d] text-[#2c3e2d] px-8 py-4 hover:bg-[#d4b78d] transition-all tracking-wide">
              Comprar Agora
            </a>
            <button onClick={() => setShowAssinaturas(true)} className="border border-[#c4a77d]/50 text-[#c4a77d] px-8 py-4 hover:bg-[#c4a77d]/10 transition-all tracking-wide">
              Clube de Assinaturas
            </button>
          </div>
        </div>
      </section>

      {/* Faixa Fidelidade */}
      <div className="bg-[#c4a77d] py-4">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#2c3e2d] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[#c4a77d]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <div>
              <p className="text-[#2c3e2d] font-medium">Programa {nomeLoja.split(' ')[0]} - Nivel {user.level}</p>
              <p className="text-[#2c3e2d]/70 text-sm">Faltam {user.nextLevel} pts para Mestre Botanico</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-[#2c3e2d]">
            <div className="text-center">
              <p className="text-2xl font-bold">{user.points}</p>
              <p className="text-xs opacity-70">Pontos</p>
            </div>
            <div className="h-10 w-px bg-[#2c3e2d]/20" />
            <div className="text-center">
              <p className="text-2xl font-bold">R$ {(user.points * 0.05).toFixed(0)}</p>
              <p className="text-xs opacity-70">Em creditos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-[#2c3e2d]">4.9 - 234 avaliacoes</span>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {reviews.map((review, i) => (
              <div key={i} className="p-5 bg-[#f7f5f0] border-l-2 border-[#8b7355]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#2c3e2d] rounded-full flex items-center justify-center text-[#c4a77d] text-sm">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="text-[#2c3e2d] text-sm">{review.nome}</p>
                    <p className="text-[#8b9b8c] text-xs">{review.tempo}</p>
                  </div>
                </div>
                <p className="text-[#5a6b5a] text-sm">{review.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogo Premium */}
      <section id="catalogo" className="py-20 bg-[#f7f5f0]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[#8b7355] text-[10px] tracking-[0.3em] uppercase mb-2">Curadoria</p>
            <h3 className="text-[#2c3e2d] text-4xl font-light tracking-wide">Nosso Catalogo</h3>
            <p className="text-[#5a6b5a] mt-2">Adicione ao carrinho e finalize com pagamento online</p>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm tracking-wide transition-all border ${
                  activeCategory === cat
                    ? 'bg-[#2c3e2d] text-[#c4a77d] border-[#2c3e2d]'
                    : 'bg-white text-[#5a6b5a] border-[#2c3e2d]/20 hover:border-[#8b7355]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((item) => {
              const qty = getItemQuantity(item.id)
              return (
                <div key={item.id} className={`bg-white p-5 border-l-2 transition-all ${
                  qty > 0 ? 'border-l-[#c4a77d] shadow-lg' : 'border-l-[#8b7355] hover:shadow-md'
                } ${item.raro ? 'ring-1 ring-[#c4a77d]/30' : ''}`}>
                  {/* Imagem */}
                  <div className="aspect-square bg-[#2c3e2d]/5 mb-4 flex items-center justify-center relative">
                    <span className="text-[#8b7355]/30 text-sm">Foto</span>
                    {item.raro && (
                      <span className="absolute top-2 left-2 bg-[#c4a77d] text-[#2c3e2d] text-[9px] px-2 py-1 tracking-wider">
                        RARO
                      </span>
                    )}
                    {item.organico && (
                      <span className="absolute top-2 right-2 bg-[#2c3e2d] text-[#c4a77d] text-[9px] px-2 py-1 tracking-wider">
                        ORGANICO
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[#2c3e2d] font-medium">{item.nome}</h4>
                    <span className="text-[#2c3e2d] text-lg ml-2">R$ {item.preco}</span>
                  </div>

                  <p className="text-[#8b9b8c] text-sm mb-1">{item.desc}</p>
                  <p className="text-[#8b7355] text-xs mb-3">Origem: {item.origem}</p>

                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${item.estoque <= 5 ? 'text-amber-600' : 'text-[#8b9b8c]'}`}>
                      {item.estoque <= 5 ? `Apenas ${item.estoque} em estoque` : `${item.estoque} disponiveis`}
                    </span>

                    {qty > 0 ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 border border-[#2c3e2d]/20 text-[#2c3e2d] flex items-center justify-center hover:bg-[#2c3e2d]/5">-</button>
                        <span className="w-6 text-center text-[#2c3e2d]">{qty}</span>
                        <button onClick={() => addToCart(item)} className="w-8 h-8 bg-[#2c3e2d] text-[#c4a77d] flex items-center justify-center hover:bg-[#3d4f3d]">+</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        disabled={item.estoque <= 0}
                        className="px-4 py-2 border border-[#2c3e2d]/20 text-[#2c3e2d] text-sm tracking-wide hover:bg-[#2c3e2d] hover:text-[#c4a77d] transition-colors disabled:opacity-50"
                      >
                        Adicionar
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-20 bg-[#2c3e2d]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-[#f7f5f0]">
              <p className="text-[#c4a77d] text-[10px] tracking-[0.3em] uppercase mb-2">Visite-nos</p>
              <h3 className="text-3xl font-light tracking-wide mb-8">Nosso Espaco</h3>

              <div className="space-y-6">
                <div className="p-6 bg-[#1f2f1f] border-l-2 border-[#c4a77d]">
                  <p className="text-[#c4a77d] text-xs tracking-wider uppercase mb-2">Endereco</p>
                  <p className="text-[#8b9b8c]">Rua Trajano Reis, 280<br/>Sao Francisco, Curitiba - PR</p>
                </div>
                <div className="p-6 bg-[#1f2f1f] border-l-2 border-[#c4a77d]">
                  <p className="text-[#c4a77d] text-xs tracking-wider uppercase mb-2">Horario</p>
                  <p className="text-[#8b9b8c]">Segunda a Sexta: 9h as 19h<br/>Sabado: 9h as 15h</p>
                </div>
                <div className="p-6 bg-[#1f2f1f] border-l-2 border-[#c4a77d]">
                  <p className="text-[#c4a77d] text-xs tracking-wider uppercase mb-2">Contato</p>
                  <p className="text-[#f7f5f0]">(41) 3030-1515</p>
                  <p className="text-[#8b9b8c]">ola@raizesemporio.com.br</p>
                </div>
              </div>
            </div>

            <div className="bg-[#f7f5f0] p-8">
              <p className="text-[#8b7355] text-[10px] tracking-[0.3em] uppercase mb-2">Mensagem</p>
              <h4 className="text-[#2c3e2d] text-xl font-light tracking-wide mb-6">Entre em Contato</h4>
              <form className="space-y-4">
                <input type="text" placeholder="Nome" className="w-full px-4 py-3 border border-[#2c3e2d]/20 bg-white focus:border-[#8b7355] outline-none" />
                <input type="email" placeholder="E-mail" className="w-full px-4 py-3 border border-[#2c3e2d]/20 bg-white focus:border-[#8b7355] outline-none" />
                <textarea rows={4} placeholder="Mensagem" className="w-full px-4 py-3 border border-[#2c3e2d]/20 bg-white focus:border-[#8b7355] outline-none resize-none" />
                <button type="button" className="w-full py-3 bg-[#2c3e2d] text-[#c4a77d] tracking-wide hover:bg-[#3d4f3d] transition-colors">
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1f2f1f] text-[#8b9b8c] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                {logoUrl ? (
                  <img src={logoUrl} alt={nomeLoja} className="w-6 h-6 object-contain" />
                ) : (
                  <svg className="w-6 h-6 text-[#c4a77d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L12 6M12 6C9 6 6 8 6 12C6 16 9 22 12 22C15 22 18 16 18 12C18 8 15 6 12 6Z" />
                  </svg>
                )}
                <span className="text-[#f7f5f0] tracking-[0.15em]">{nomeLoja.split(' ')[0]?.toUpperCase()}</span>
              </div>
              <p className="text-sm">E-commerce premium com pagamento online. Compre e receba em casa!</p>
            </div>
            <div>
              <h5 className="text-[#f7f5f0] text-sm uppercase tracking-wider mb-4">Pagamento</h5>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-[#2c3e2d] text-xs">PIX</span>
                <span className="px-2 py-1 bg-[#2c3e2d] text-xs">Cartao</span>
                <span className="px-2 py-1 bg-[#2c3e2d] text-xs">Visa</span>
                <span className="px-2 py-1 bg-[#2c3e2d] text-xs">Master</span>
              </div>
            </div>
            <div>
              <h5 className="text-[#f7f5f0] text-sm uppercase tracking-wider mb-4">Entregas</h5>
              <ul className="space-y-2 text-sm">
                <li>Curitiba: 1-2 dias</li>
                <li>Regiao Metropolitana: 2-3 dias</li>
                <li>Brasil: 5-10 dias</li>
              </ul>
            </div>
            <div>
              <h5 className="text-[#f7f5f0] text-sm uppercase tracking-wider mb-4">Fidelidade</h5>
              <p className="text-sm mb-2">Programa {nomeLoja.split(' ')[0]}</p>
              <p className="text-xs">Acumule pontos e ganhe descontos exclusivos.</p>
            </div>
          </div>
          <div className="border-t border-[#2c3e2d] pt-8 text-center text-sm">
            <p>&#169; 2024 {nomeLoja} - Curitiba, PR</p>
            <p className="text-xs mt-2 text-[#5a6b5a]">Desenvolvido pela G & G Digital</p>
          </div>
        </div>
      </footer>

      {/* Modal Assinaturas */}
      {showAssinaturas && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAssinaturas(false)} />
          <div className="relative w-full max-w-4xl bg-[#f7f5f0] max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowAssinaturas(false)} className="absolute top-4 right-4 text-[#8b9b8c] hover:text-[#2c3e2d]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8">
              <div className="text-center mb-8">
                <p className="text-[#8b7355] text-[10px] tracking-[0.3em] uppercase mb-2">Clube Exclusivo</p>
                <h3 className="text-[#2c3e2d] text-3xl font-light">Assinaturas {nomeLoja.split(' ')[0]}</h3>
                <p className="text-[#5a6b5a] mt-2">Receba produtos selecionados todo mes</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {assinaturas.map((box) => (
                  <div key={box.id} className={`p-6 border text-center ${
                    box.popular ? 'border-[#c4a77d] bg-white ring-2 ring-[#c4a77d]/30' : 'border-[#2c3e2d]/20 bg-white'
                  }`}>
                    {box.popular && (
                      <span className="inline-block bg-[#c4a77d] text-[#2c3e2d] text-[9px] px-3 py-1 tracking-wider mb-4">
                        MAIS POPULAR
                      </span>
                    )}
                    <h4 className="text-[#2c3e2d] text-xl mb-2">{box.nome}</h4>
                    <p className="text-[#5a6b5a] text-sm mb-4">{box.desc}</p>
                    <p className="text-[#c4a77d] text-3xl font-light mb-1">R$ {box.preco}</p>
                    <p className="text-[#8b9b8c] text-xs mb-4">/mes - Economia de {box.economia}%</p>
                    <p className="text-[#5a6b5a] text-sm mb-6">{box.produtos} produtos por mes</p>
                    <button className={`w-full py-3 transition-colors ${
                      box.popular
                        ? 'bg-[#c4a77d] text-[#2c3e2d] hover:bg-[#d4b78d]'
                        : 'border border-[#2c3e2d] text-[#2c3e2d] hover:bg-[#2c3e2d] hover:text-[#c4a77d]'
                    }`}>
                      Assinar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Carrinho / Checkout */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-[#f7f5f0] h-full overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="sticky top-0 bg-[#2c3e2d] p-4 flex justify-between items-center z-10">
              <div className="flex items-center gap-4">
                {checkoutStep !== 'cart' && !orderSuccess && (
                  <button onClick={() => setCheckoutStep(checkoutStep === 'payment' ? 'delivery' : 'cart')} className="text-[#8b9b8c] hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <h3 className="text-[#c4a77d] text-lg tracking-wide">
                  {orderSuccess ? 'Pedido Confirmado!' : checkoutStep === 'cart' ? 'Seu Carrinho' : checkoutStep === 'delivery' ? 'Entrega' : 'Pagamento'}
                </h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="text-[#8b9b8c] hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress Steps */}
            {!orderSuccess && cart.length > 0 && (
              <div className="px-4 py-3 bg-white border-b border-[#2c3e2d]/10">
                <div className="flex justify-between items-center">
                  {['cart', 'delivery', 'payment'].map((step, i) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        checkoutStep === step || ['delivery', 'payment'].indexOf(checkoutStep) >= i
                          ? 'bg-[#c4a77d] text-[#2c3e2d]'
                          : 'bg-[#2c3e2d]/10 text-[#8b9b8c]'
                      }`}>
                        {i + 1}
                      </div>
                      {i < 2 && <div className={`w-12 h-0.5 ${['delivery', 'payment'].indexOf(checkoutStep) > i ? 'bg-[#c4a77d]' : 'bg-[#2c3e2d]/10'}`} />}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1 text-xs text-[#8b9b8c]">
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
                  <h4 className="text-2xl text-[#2c3e2d] mb-2">Pedido Confirmado!</h4>
                  <p className="text-[#5a6b5a] mb-2">+{pointsToEarn} pontos adicionados</p>
                  <div className="bg-[#2c3e2d] p-4 mt-4 text-left">
                    <p className="text-[#c4a77d] text-sm mb-2">Previsao de entrega:</p>
                    <p className="text-white text-lg font-bold">{deliveryType === 'delivery' ? '2-3 dias uteis' : 'Disponivel para retirada'}</p>
                    <p className="text-[#8b9b8c] text-xs mt-2">Acompanhe pelo e-mail</p>
                  </div>
                </div>
              ) : cart.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-[#c4a77d]/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-[#5a6b5a]">Carrinho vazio</p>
                </div>
              ) : checkoutStep === 'cart' ? (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-white border border-[#2c3e2d]/10">
                        <div>
                          <p className="text-[#2c3e2d] font-medium">{item.nome}</p>
                          <p className="text-[#8b9b8c] text-sm">R$ {item.preco.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 border border-[#2c3e2d]/20 text-[#2c3e2d] flex items-center justify-center">-</button>
                          <span className="w-6 text-center">{item.quantidade}</span>
                          <button onClick={() => addToCart(produtos.find(p => p.id === item.id)!)} className="w-7 h-7 bg-[#2c3e2d] text-[#c4a77d] flex items-center justify-center">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#2c3e2d]/20 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#5a6b5a]">Subtotal</span>
                      <span className="text-[#2c3e2d] text-xl font-bold">R$ {totalPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-[#8b7355] text-sm mb-4">+{pointsToEarn} pontos neste pedido</p>
                    <button onClick={() => setCheckoutStep('delivery')} className="w-full py-4 bg-[#2c3e2d] text-[#c4a77d] hover:bg-[#3d4f3d] transition-colors">
                      Continuar
                    </button>
                  </div>
                </>
              ) : checkoutStep === 'delivery' ? (
                <>
                  <h4 className="text-[#2c3e2d] font-medium mb-4">Tipo de Entrega</h4>
                  <div className="space-y-3 mb-6">
                    {[
                      { id: 'delivery', label: 'Entrega', desc: 'Receba em casa (R$ 12,00)', icon: (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-4M16 2h4v4m0-4L8 14" />
                        </svg>
                      )},
                      { id: 'pickup', label: 'Retirada na Loja', desc: 'Retire gratis em Curitiba', icon: (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      )},
                    ].map(option => (
                      <button
                        key={option.id}
                        onClick={() => setDeliveryType(option.id as 'delivery' | 'pickup')}
                        className={`w-full p-4 border text-left flex items-center gap-4 transition-all ${
                          deliveryType === option.id ? 'border-[#c4a77d] bg-[#c4a77d]/10' : 'border-[#2c3e2d]/20'
                        }`}
                      >
                        <div className={deliveryType === option.id ? 'text-[#c4a77d]' : 'text-[#8b9b8c]'}>
                          {option.icon}
                        </div>
                        <div>
                          <p className="text-[#2c3e2d] font-medium">{option.label}</p>
                          <p className="text-[#5a6b5a] text-sm">{option.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {deliveryType === 'delivery' && (
                    <div className="space-y-4 mb-6">
                      <h4 className="text-[#2c3e2d] font-medium">Endereco de Entrega</h4>
                      <div className="p-4 border border-[#c4a77d] bg-[#c4a77d]/5">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[#2c3e2d] font-medium">Casa</p>
                            <p className="text-[#5a6b5a] text-sm">Rua das Palmeiras, 789 - Apto 12</p>
                            <p className="text-[#8b9b8c] text-xs">Agua Verde, Curitiba - PR</p>
                          </div>
                          <span className="text-xs bg-[#c4a77d] text-[#2c3e2d] px-2 py-1">Principal</span>
                        </div>
                      </div>
                      <button className="w-full p-3 border-2 border-dashed border-[#c4a77d]/30 text-[#c4a77d] text-sm hover:border-[#c4a77d] transition-colors">
                        + Adicionar novo endereco
                      </button>
                    </div>
                  )}

                  <button onClick={() => setCheckoutStep('payment')} className="w-full py-4 bg-[#2c3e2d] text-[#c4a77d] hover:bg-[#3d4f3d] transition-colors">
                    Continuar para Pagamento
                  </button>
                </>
              ) : checkoutStep === 'payment' ? (
                <>
                  <h4 className="text-[#2c3e2d] font-medium mb-4">Forma de Pagamento</h4>

                  <div className="space-y-3 mb-6">
                    {[
                      { id: 'pix', label: 'PIX', desc: '10% de desconto', icon: (
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
                          paymentMethod === method.id ? 'border-[#c4a77d] bg-[#c4a77d]/10' : 'border-[#2c3e2d]/20'
                        }`}
                      >
                        <div className={paymentMethod === method.id ? 'text-[#c4a77d]' : 'text-[#8b9b8c]'}>
                          {method.icon}
                        </div>
                        <div>
                          <p className="text-[#2c3e2d] font-medium">{method.label}</p>
                          <p className="text-[#5a6b5a] text-sm">{method.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4 mb-6">
                      <input type="text" placeholder="Numero do cartao" className="w-full px-4 py-3 border border-[#2c3e2d]/20 focus:border-[#c4a77d] outline-none" />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="MM/AA" className="w-full px-4 py-3 border border-[#2c3e2d]/20 focus:border-[#c4a77d] outline-none" />
                        <input type="text" placeholder="CVV" className="w-full px-4 py-3 border border-[#2c3e2d]/20 focus:border-[#c4a77d] outline-none" />
                      </div>
                      <input type="text" placeholder="Nome no cartao" className="w-full px-4 py-3 border border-[#2c3e2d]/20 focus:border-[#c4a77d] outline-none" />
                    </div>
                  )}

                  {paymentMethod === 'pix' && (
                    <div className="mb-6 p-4 bg-white border border-[#2c3e2d]/20 text-center">
                      <div className="w-32 h-32 mx-auto bg-[#2c3e2d]/5 flex items-center justify-center mb-4">
                        <span className="text-xs text-[#8b9b8c]">QR Code PIX</span>
                      </div>
                      <p className="text-[#2c3e2d] font-medium">Escaneie o QR Code</p>
                      <p className="text-[#5a6b5a] text-sm">ou copie a chave PIX</p>
                      <button className="mt-2 text-[#c4a77d] text-sm underline">Copiar chave</button>
                    </div>
                  )}

                  {/* Resumo */}
                  <div className="border-t border-[#2c3e2d]/20 pt-4 mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5a6b5a]">Subtotal</span>
                      <span className="text-[#2c3e2d]">R$ {totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5a6b5a]">Taxa de entrega</span>
                      <span className="text-[#2c3e2d]">{deliveryFee > 0 ? `R$ ${deliveryFee.toFixed(2)}` : 'Gratis'}</span>
                    </div>
                    {paymentMethod === 'pix' && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Desconto PIX (10%)</span>
                        <span>- R$ {discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#2c3e2d]/20">
                      <span className="text-[#2c3e2d]">Total</span>
                      <span className="text-[#c4a77d]">R$ {finalTotal.toFixed(2)}</span>
                    </div>
                    <p className="text-[#8b7355] text-sm">+{pointsToEarn} pontos neste pedido</p>
                  </div>

                  <button onClick={processPayment} className="w-full py-4 bg-[#2c3e2d] text-[#c4a77d] hover:bg-[#3d4f3d] transition-colors">
                    {paymentMethod === 'pix' ? 'Confirmar Pagamento' : `Pagar R$ ${finalTotal.toFixed(2)}`}
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Modal Minha Conta */}
      {showAccountModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAccountModal(false)} />
          <div className="relative w-full max-w-lg bg-[#f7f5f0] shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-[#2c3e2d] p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#c4a77d] rounded-full flex items-center justify-center text-[#2c3e2d] text-xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[#f7f5f0] font-medium">Ola, {user.name.split(' ')[0]}!</p>
                  <p className="text-[#8b9b8c] text-sm">Nivel {user.level} - {user.points} pontos</p>
                </div>
              </div>
              <button onClick={() => setShowAccountModal(false)} className="text-[#8b9b8c] hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#2c3e2d]/10">
              {[
                { id: 'orders', label: 'Pedidos' },
                { id: 'subscriptions', label: 'Assinaturas' },
                { id: 'profile', label: 'Perfil' },
                { id: 'addresses', label: 'Enderecos' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setAccountTab(tab.id as typeof accountTab)}
                  className={`flex-1 p-3 text-sm transition-colors ${
                    accountTab === tab.id ? 'bg-[#2c3e2d] text-[#c4a77d]' : 'text-[#5a6b5a] hover:bg-[#c4a77d]/10'
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
                    <div key={order.id} className="bg-white border border-[#2c3e2d]/10 p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-[#2c3e2d] font-medium">{order.id}</span>
                          <span className="text-[#8b9b8c] text-sm ml-3">{order.date}</span>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1">Entregue</span>
                      </div>
                      <p className="text-[#5a6b5a] text-sm mb-3">{order.items.join(', ')}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[#c4a77d] font-bold">R$ {order.total.toFixed(2)}</span>
                        <button className="text-sm text-[#2c3e2d] border border-[#2c3e2d] px-4 py-1 hover:bg-[#2c3e2d] hover:text-[#c4a77d] transition-colors">
                          Pedir novamente
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {accountTab === 'subscriptions' && (
                <div className="space-y-4">
                  <div className="p-4 border border-[#c4a77d] bg-[#c4a77d]/5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-[#2c3e2d] font-medium">Box Premium</span>
                        <p className="text-[#5a6b5a] text-sm">6 produtos + 2 lancamentos</p>
                      </div>
                      <span className="text-xs bg-[#c4a77d] text-[#2c3e2d] px-2 py-1">Ativa</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#c4a77d] font-bold">R$ 329/mes</span>
                      <span className="text-[#8b9b8c] text-sm">Proxima: 15/02</span>
                    </div>
                  </div>
                  <button className="w-full p-3 border-2 border-dashed border-[#c4a77d]/30 text-[#c4a77d] text-sm hover:border-[#c4a77d] transition-colors">
                    + Adicionar outra assinatura
                  </button>
                </div>
              )}

              {accountTab === 'profile' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#5a6b5a] mb-2">Nome</label>
                    <input type="text" value={user.name} readOnly className="w-full px-4 py-3 border border-[#2c3e2d]/20 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#5a6b5a] mb-2">E-mail</label>
                    <input type="email" value={user.email} readOnly className="w-full px-4 py-3 border border-[#2c3e2d]/20 bg-white" />
                  </div>
                  <div className="p-4 bg-[#c4a77d]/10 border border-[#c4a77d]/30">
                    <p className="text-[#2c3e2d] font-medium mb-1">Programa {nomeLoja.split(' ')[0]}</p>
                    <p className="text-[#5a6b5a] text-sm">Nivel: {user.level} ({user.points} pontos)</p>
                    <p className="text-[#8b7355] text-sm">Faltam {user.nextLevel} pts para Mestre Botanico</p>
                  </div>
                  <button className="w-full py-3 bg-[#2c3e2d] text-[#c4a77d] hover:bg-[#3d4f3d] transition-colors">
                    Editar Perfil
                  </button>
                </div>
              )}

              {accountTab === 'addresses' && (
                <div className="space-y-4">
                  <div className="p-4 border border-[#c4a77d] bg-[#c4a77d]/5">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[#2c3e2d] font-medium">Casa</span>
                      <span className="text-xs bg-[#c4a77d] text-[#2c3e2d] px-2 py-1">Principal</span>
                    </div>
                    <p className="text-[#5a6b5a] text-sm">Rua das Palmeiras, 789 - Apto 12</p>
                    <p className="text-[#8b9b8c] text-sm">Agua Verde, Curitiba - PR</p>
                  </div>
                  <button className="w-full p-3 border-2 border-dashed border-[#c4a77d]/30 text-[#c4a77d] text-sm hover:border-[#c4a77d] transition-colors">
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
          className="fixed bottom-6 right-6 bg-[#2c3e2d] text-[#c4a77d] px-6 py-3 shadow-lg hover:bg-[#3d4f3d] transition-all z-50 flex items-center gap-2 md:hidden border border-[#c4a77d]/30"
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
        <a href="https://wa.me/5541999777666" className="fixed bottom-5 right-5 w-12 h-12 bg-[#2c3e2d] border border-[#c4a77d]/30 rounded-full flex items-center justify-center shadow-lg hover:bg-[#3d4f3d] transition-colors z-50">
          <svg className="w-5 h-5 text-[#c4a77d]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      )}
    </main>
  )
}
