
import { useState } from 'react'

type ModaMode = 'feminino' | 'masculino'
type CheckoutStep = 'cart' | 'delivery' | 'payment' | 'success'

const produtosFem = [
  { id: 1, nome: 'Vestido Midi Seda', preco: 1890, categoria: 'Vestidos', material: 'Seda pura', tamanhos: ['P', 'M', 'G'], cores: ['Preto', 'Nude'], popular: true },
  { id: 2, nome: 'Blazer Oversized', preco: 2450, categoria: 'Alfaiataria', material: 'La italiana', tamanhos: ['P', 'M', 'G'], cores: ['Camel', 'Preto'] },
  { id: 3, nome: 'Saia Plissada', preco: 1290, categoria: 'Saias', material: 'Crepe de chine', tamanhos: ['P', 'M', 'G', 'GG'], cores: ['Off-white', 'Preto'], popular: true },
  { id: 4, nome: 'Camisa Laco', preco: 890, categoria: 'Blusas', material: 'Seda', tamanhos: ['P', 'M', 'G'], cores: ['Branco', 'Rose'] },
  { id: 5, nome: 'Calca Palazzo', preco: 1590, categoria: 'Calcas', material: 'Viscose premium', tamanhos: ['36', '38', '40', '42'], cores: ['Preto', 'Off-white'] },
  { id: 6, nome: 'Trench Coat', preco: 3200, categoria: 'Casacos', material: 'Gabardine', tamanhos: ['P', 'M', 'G'], cores: ['Bege', 'Preto'], popular: true },
]

const produtosMasc = [
  { id: 1, nome: 'Terno Slim Fit', preco: 4500, categoria: 'Ternos', material: 'La fria 120s', tamanhos: ['48', '50', '52', '54'], cores: ['Preto', 'Azul Marinho'], popular: true },
  { id: 2, nome: 'Camisa Colarinho Italiano', preco: 590, categoria: 'Camisas', material: 'Algodao egipcio', tamanhos: ['2', '3', '4', '5'], cores: ['Branco', 'Azul Claro'] },
  { id: 3, nome: 'Blazer Desestruturado', preco: 2800, categoria: 'Blazers', material: 'Linho italiano', tamanhos: ['48', '50', '52'], cores: ['Bege', 'Azul'], popular: true },
  { id: 4, nome: 'Calca Chino', preco: 890, categoria: 'Calcas', material: 'Algodao premium', tamanhos: ['40', '42', '44', '46'], cores: ['Caqui', 'Preto'] },
  { id: 5, nome: 'Sapato Derby', preco: 1890, categoria: 'Calcados', material: 'Couro legitimo', tamanhos: ['39', '40', '41', '42', '43'], cores: ['Preto', 'Marrom'] },
  { id: 6, nome: 'Gravata Seda', preco: 390, categoria: 'Acessorios', material: 'Seda pura', tamanhos: ['Unico'], cores: ['Azul', 'Burgundy'], popular: true },
]

const reviews = [
  { nome: 'Isabela M.', texto: 'Qualidade excepcional. Cada peca e unica.', cargo: 'Arquiteta' },
  { nome: 'Roberto A.', texto: 'Atendimento premium e pecas impecaveis.', cargo: 'CEO' },
  { nome: 'Camila S.', texto: 'Minha loja favorita em Curitiba.', cargo: 'Medica' },
  { nome: 'Felipe S.', texto: 'Ternos sob medida de altissimo nivel.', cargo: 'Advogado' },
]

const pedidos = [
  { id: '#MB2847', data: '28/01/2024', items: 2, status: 'entregue', valor: 3180 },
  { id: '#MB2801', data: '15/01/2024', items: 1, status: 'entregue', valor: 1890 },
  { id: '#MB2756', data: '02/01/2024', items: 3, status: 'entregue', valor: 4770 },
]

export function LojaRoupasPremiumDemo({ demoConfig }: { demoConfig?: any }) {
  // Presentation mode - uses demoConfig prop
  const [mode, setMode] = useState<ModaMode>('feminino')
  const [cart, setCart] = useState<Array<{ produto: typeof produtosFem[0], tamanho: string, cor: string, qty: number }>>([])
  const [showCart, setShowCart] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart')
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix')
  const [showAccount, setShowAccount] = useState(false)
  const [accountTab, setAccountTab] = useState<'pedidos' | 'wishlist' | 'enderecos' | 'perfil'>('pedidos')
  const [selectedProduct, setSelectedProduct] = useState<typeof produtosFem[0] | null>(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')

  const isFeminino = mode === 'feminino'
  const defaultNome = isFeminino ? 'Maison Blanc' : 'NOIR'
  const nomeLoja = (demoConfig?.nome || defaultNome)
  const logoUrl = (demoConfig?.logo || null)
  const produtos = isFeminino ? produtosFem : produtosMasc
  const user = { name: isFeminino ? 'Isabella Costa' : 'Ricardo Mendes', points: 2450, level: 'Ouro' }

  const feminino = {
    bg: '#faf8f6', bgAlt: '#f5f0eb', bgCard: '#ffffff',
    accent: '#c9a87c', accentDark: '#8b7355',
    text: '#2d2a26', textMuted: '#6b6560', border: '#e8e0d8',
  }

  const masculino = {
    bg: '#0a0a0a', bgAlt: '#111111', bgCard: '#161616',
    accent: '#d4af37', accentDark: '#a88a2d',
    text: '#f5f5f5', textMuted: '#888888', border: '#2a2a2a',
  }

  const c = isFeminino ? feminino : masculino
  const categorias = ['Todos', ...Array.from(new Set(produtos.map(p => p.categoria)))]
  const filteredProducts = activeCategory === 'Todos' ? produtos : produtos.filter(p => p.categoria === activeCategory)

  const cartTotal = cart.reduce((sum, item) => sum + item.produto.preco * item.qty, 0)
  const discount = paymentMethod === 'pix' ? cartTotal * 0.1 : 0
  const finalTotal = cartTotal - discount

  const addToCart = () => {
    if (!selectedProduct || !selectedSize || !selectedColor) return
    const existing = cart.find(i => i.produto.id === selectedProduct.id && i.tamanho === selectedSize && i.cor === selectedColor)
    if (existing) {
      setCart(cart.map(i => i === existing ? { ...i, qty: i.qty + 1 } : i))
    } else {
      setCart([...cart, { produto: selectedProduct, tamanho: selectedSize, cor: selectedColor, qty: 1 }])
    }
    setSelectedProduct(null)
    setSelectedSize('')
    setSelectedColor('')
    setShowCart(true)
  }

  const processPayment = () => {
    setCheckoutStep('success')
    setTimeout(() => {
      setCheckoutStep('cart')
      setCart([])
      setShowCart(false)
    }, 4000)
  }

  return (
    <main className="min-h-screen transition-colors duration-500" style={{ backgroundColor: c.bg, color: c.text }}>
      {/* Toggle */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60]">
        <div className="flex" style={{ backgroundColor: isFeminino ? '#fff' : '#1a1a1a', border: `1px solid ${c.border}`, padding: '4px' }}>
          {[{ id: 'feminino' as ModaMode, label: 'Feminino' }, { id: 'masculino' as ModaMode, label: 'Masculino' }].map((opt) => (
            <button key={opt.id} onClick={() => { setMode(opt.id); setCart([]); setActiveCategory('Todos'); }} className="px-6 py-2 text-xs tracking-[0.2em] uppercase transition-all" style={{ backgroundColor: mode === opt.id ? c.accent : 'transparent', color: mode === opt.id ? (isFeminino ? '#fff' : '#0a0a0a') : c.textMuted }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="pt-20 pb-4 border-b sticky top-0 z-50" style={{ backgroundColor: c.bg, borderColor: c.border }}>
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex items-center justify-between">
            {logoUrl ? (
              <div className="flex items-center gap-3">
                <img src={logoUrl} alt={nomeLoja} className="w-10 h-10 object-contain" />
                <h1 className="text-2xl tracking-[0.3em] font-light" style={{ fontFamily: 'Georgia, serif' }}>{nomeLoja}</h1>
              </div>
            ) : isFeminino ? (
              <div className="text-center">
                <h1 className="text-2xl tracking-[0.3em] font-light" style={{ fontFamily: 'Georgia, serif' }}>{nomeLoja}</h1>
                <p className="text-[10px] tracking-[0.4em] uppercase" style={{ color: c.accent }}>E-Commerce Premium</p>
              </div>
            ) : (
              <div className="flex items-baseline gap-1">
                <h1 className="text-3xl font-bold tracking-tight">{nomeLoja}</h1>
                <span className="text-lg font-light" style={{ color: c.accent }}>& Co.</span>
              </div>
            )}

            <div className="hidden md:flex items-center gap-6">
              {['colecao', 'sobre'].map((item) => (
                <button key={item} onClick={() => document.getElementById(item)?.scrollIntoView({ behavior: 'smooth' })} className="text-xs tracking-[0.15em] uppercase" style={{ color: c.textMuted }}>
                  {item}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => setShowAccount(true)} className="hidden md:flex items-center gap-2 px-3 py-1.5" style={{ backgroundColor: c.accent + '15', border: `1px solid ${c.accent}30` }}>
                <svg className="w-4 h-4" style={{ color: c.accent }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                <span className="text-xs" style={{ color: c.accent }}>{user.points} pts</span>
              </button>
              <button onClick={() => setShowCart(true)} className="relative px-4 py-2 text-xs tracking-wide" style={{ backgroundColor: c.accent, color: isFeminino ? '#fff' : '#0a0a0a' }}>
                Sacola ({cart.reduce((s, i) => s + i.qty, 0)})
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20" style={{ backgroundColor: c.bgAlt }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: c.accent }}>{isFeminino ? 'Nova Colecao Primavera' : 'Alfaiataria de Excelencia'}</p>
          <h2 className={`text-4xl md:text-5xl mb-4 ${isFeminino ? 'font-light' : 'font-bold'}`} style={{ fontFamily: isFeminino ? 'Georgia, serif' : 'inherit' }}>
            {isFeminino ? 'Elegancia atemporal' : 'Estilo sem concessoes'}
          </h2>
          <p className="mb-8 max-w-lg mx-auto" style={{ color: c.textMuted }}>
            Compre online com PIX e ganhe 10% de desconto
          </p>
          <button onClick={() => document.getElementById('colecao')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 text-xs tracking-[0.15em] uppercase" style={{ backgroundColor: c.accent, color: isFeminino ? '#fff' : '#0a0a0a' }}>
            Ver Colecao
          </button>
        </div>
      </section>

      {/* Fidelidade */}
      <div className="py-4" style={{ backgroundColor: c.accent }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: isFeminino ? '#fff' : '#0a0a0a' }}>
              <svg className="w-6 h-6" style={{ color: c.accent }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
            </div>
            <div>
              <p style={{ color: isFeminino ? '#2d2a26' : '#0a0a0a' }} className="font-medium">{nomeLoja} {isFeminino ? 'Club' : 'Elite'} - Nivel {user.level}</p>
              <p style={{ color: isFeminino ? '#2d2a2699' : '#0a0a0a99' }} className="text-sm">R$ {Math.floor(user.points * 0.1)} em creditos disponiveis</p>
            </div>
          </div>
          <div className="flex items-center gap-6" style={{ color: isFeminino ? '#2d2a26' : '#0a0a0a' }}>
            <div className="text-center">
              <p className="text-2xl font-bold">{user.points}</p>
              <p className="text-xs opacity-70">Pontos</p>
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
            <span>4.9 - 328 avaliacoes</span>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {reviews.map((r, i) => (
              <div key={i} className="p-5" style={{ backgroundColor: c.bgCard, borderLeft: `2px solid ${c.accent}` }}>
                <p className={`text-sm mb-3 ${isFeminino ? 'italic' : ''}`} style={{ color: c.textMuted }}>"{r.texto}"</p>
                <p className="text-sm font-medium">{r.nome}</p>
                <p className="text-xs" style={{ color: c.accent }}>{r.cargo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Colecao */}
      <section id="colecao" className="py-20" style={{ backgroundColor: c.bgAlt }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: c.accent }}>Selecao</p>
            <h3 className={`text-3xl ${isFeminino ? 'font-light' : 'font-bold'}`} style={{ fontFamily: isFeminino ? 'Georgia, serif' : 'inherit' }}>
              {isFeminino ? 'Pecas em Destaque' : 'Produtos Selecionados'}
            </h3>
            <p className="text-sm mt-2" style={{ color: c.textMuted }}>PIX: 10% de desconto em toda a loja</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categorias.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className="px-4 py-2 text-xs tracking-wide border transition-all" style={{ backgroundColor: activeCategory === cat ? c.accent : 'transparent', color: activeCategory === cat ? (isFeminino ? '#fff' : '#0a0a0a') : c.textMuted, borderColor: activeCategory === cat ? c.accent : c.border }}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <div key={p.id} style={{ backgroundColor: c.bgCard, border: `1px solid ${c.border}` }}>
                <div className="aspect-[3/4] flex items-center justify-center relative" style={{ backgroundColor: isFeminino ? '#f0ebe5' : '#1a1a1a' }}>
                  {p.popular && <span className="absolute top-3 left-3 text-[9px] tracking-wider px-2 py-1" style={{ backgroundColor: c.accent, color: isFeminino ? '#fff' : '#0a0a0a' }}>DESTAQUE</span>}
                  <span className="text-xs" style={{ color: c.textMuted }}>Foto</span>
                </div>
                <div className="p-5">
                  <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: c.accent }}>{p.categoria}</p>
                  <h4 className={`text-base mb-1 ${isFeminino ? 'font-normal' : 'font-medium'}`}>{p.nome}</h4>
                  <p className="text-xs mb-3" style={{ color: c.textMuted }}>{p.material}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg">R$ {p.preco.toLocaleString('pt-BR')}</span>
                    <button onClick={() => { setSelectedProduct(p); setSelectedSize(''); setSelectedColor(''); }} className="text-xs tracking-wider px-4 py-2" style={{ backgroundColor: c.accent, color: isFeminino ? '#fff' : '#0a0a0a' }}>
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ borderColor: c.border, backgroundColor: c.bg }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          {logoUrl ? (
            <div className="flex items-center justify-center gap-3">
              <img src={logoUrl} alt={nomeLoja} className="w-8 h-8 object-contain" />
              <p className="text-lg tracking-[0.2em] font-light" style={{ fontFamily: 'Georgia, serif' }}>{nomeLoja}</p>
            </div>
          ) : isFeminino ? (
            <p className="text-lg tracking-[0.2em] font-light" style={{ fontFamily: 'Georgia, serif' }}>{nomeLoja}</p>
          ) : (
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-xl font-bold">{nomeLoja}</span>
              <span className="text-sm font-light" style={{ color: c.accent }}>& Co.</span>
            </div>
          )}
          <p className="text-xs mt-2" style={{ color: c.textMuted }}>Batel, Curitiba - PR | Desenvolvido por G & G Digital</p>
        </div>
      </footer>

      {/* Modal Produto */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ backgroundColor: c.bgCard, border: `1px solid ${c.border}` }}>
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 p-2" style={{ color: c.textMuted }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="p-6">
              <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: c.accent }}>{selectedProduct.categoria}</p>
              <h3 className={`text-xl mb-2 ${isFeminino ? 'font-light' : 'font-semibold'}`}>{selectedProduct.nome}</h3>
              <p className="text-sm mb-4" style={{ color: c.textMuted }}>{selectedProduct.material}</p>
              <p className="text-2xl mb-6" style={{ color: c.accent }}>R$ {selectedProduct.preco.toLocaleString('pt-BR')}</p>

              <div className="mb-4">
                <p className="text-xs tracking-wider uppercase mb-2" style={{ color: c.textMuted }}>Tamanho</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.tamanhos.map(t => (
                    <button key={t} onClick={() => setSelectedSize(t)} className="w-12 h-10 text-sm border transition-all" style={{ backgroundColor: selectedSize === t ? c.accent : 'transparent', color: selectedSize === t ? (isFeminino ? '#fff' : '#0a0a0a') : c.text, borderColor: selectedSize === t ? c.accent : c.border }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs tracking-wider uppercase mb-2" style={{ color: c.textMuted }}>Cor</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.cores.map(cor => (
                    <button key={cor} onClick={() => setSelectedColor(cor)} className="px-4 py-2 text-sm border transition-all" style={{ backgroundColor: selectedColor === cor ? c.accent : 'transparent', color: selectedColor === cor ? (isFeminino ? '#fff' : '#0a0a0a') : c.text, borderColor: selectedColor === cor ? c.accent : c.border }}>
                      {cor}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={addToCart} disabled={!selectedSize || !selectedColor} className="w-full py-3 text-sm tracking-wider uppercase disabled:opacity-50" style={{ backgroundColor: c.accent, color: isFeminino ? '#fff' : '#0a0a0a' }}>
                Adicionar a Sacola
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Carrinho/Checkout */}
      {showCart && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => { setShowCart(false); setCheckoutStep('cart'); }} />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col" style={{ backgroundColor: c.bgCard, border: `1px solid ${c.border}` }}>
            <div className="p-4 flex justify-between items-center" style={{ backgroundColor: c.accent }}>
              <h3 className="font-medium" style={{ color: isFeminino ? '#fff' : '#0a0a0a' }}>
                {checkoutStep === 'success' ? 'Pedido Confirmado!' : checkoutStep === 'cart' ? 'Sua Sacola' : checkoutStep === 'delivery' ? 'Entrega' : 'Pagamento'}
              </h3>
              <button onClick={() => { setShowCart(false); setCheckoutStep('cart'); }} style={{ color: isFeminino ? '#fff' : '#0a0a0a' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {checkoutStep === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h4 className="text-xl mb-2">Pagamento Confirmado!</h4>
                  <p style={{ color: c.textMuted }}>Voce recebera atualizacoes por WhatsApp</p>
                  <p className="text-sm mt-4" style={{ color: c.accent }}>+{Math.floor(cartTotal / 10)} pontos adicionados</p>
                </div>
              ) : checkoutStep === 'cart' ? (
                <>
                  {cart.length === 0 ? (
                    <p className="text-center py-8" style={{ color: c.textMuted }}>Sua sacola esta vazia</p>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item, i) => (
                        <div key={i} className="flex gap-4 pb-4 border-b" style={{ borderColor: c.border }}>
                          <div className="w-20 h-24 flex items-center justify-center" style={{ backgroundColor: isFeminino ? '#f0ebe5' : '#1a1a1a' }}>
                            <span className="text-xs" style={{ color: c.textMuted }}>Foto</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.produto.nome}</p>
                            <p className="text-xs" style={{ color: c.textMuted }}>{item.tamanho} | {item.cor}</p>
                            <p className="text-sm mt-1" style={{ color: c.accent }}>R$ {item.produto.preco.toLocaleString('pt-BR')}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button onClick={() => setCart(cart.map((c, idx) => idx === i ? { ...c, qty: Math.max(1, c.qty - 1) } : c))} className="w-6 h-6 border" style={{ borderColor: c.border }}>-</button>
                              <span className="text-sm">{item.qty}</span>
                              <button onClick={() => setCart(cart.map((c, idx) => idx === i ? { ...c, qty: c.qty + 1 } : c))} className="w-6 h-6 border" style={{ borderColor: c.border }}>+</button>
                              <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} className="ml-auto text-xs" style={{ color: c.textMuted }}>Remover</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {cart.length > 0 && (
                    <div className="mt-6">
                      <div className="flex justify-between mb-2">
                        <span style={{ color: c.textMuted }}>Subtotal</span>
                        <span>R$ {cartTotal.toLocaleString('pt-BR')}</span>
                      </div>
                      <button onClick={() => setCheckoutStep('delivery')} className="w-full py-3 text-sm tracking-wider uppercase mt-4" style={{ backgroundColor: c.accent, color: isFeminino ? '#fff' : '#0a0a0a' }}>
                        Continuar
                      </button>
                    </div>
                  )}
                </>
              ) : checkoutStep === 'delivery' ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs tracking-wider uppercase mb-2" style={{ color: c.textMuted }}>Nome completo</label>
                      <input type="text" defaultValue={user.name} className="w-full p-3 border text-sm" style={{ backgroundColor: 'transparent', borderColor: c.border, color: c.text }} />
                    </div>
                    <div>
                      <label className="block text-xs tracking-wider uppercase mb-2" style={{ color: c.textMuted }}>CEP</label>
                      <input type="text" placeholder="00000-000" className="w-full p-3 border text-sm" style={{ backgroundColor: 'transparent', borderColor: c.border, color: c.text }} />
                    </div>
                    <div>
                      <label className="block text-xs tracking-wider uppercase mb-2" style={{ color: c.textMuted }}>Endereco</label>
                      <input type="text" placeholder="Rua, numero" className="w-full p-3 border text-sm" style={{ backgroundColor: 'transparent', borderColor: c.border, color: c.text }} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs tracking-wider uppercase mb-2" style={{ color: c.textMuted }}>Cidade</label>
                        <input type="text" defaultValue="Curitiba" className="w-full p-3 border text-sm" style={{ backgroundColor: 'transparent', borderColor: c.border, color: c.text }} />
                      </div>
                      <div>
                        <label className="block text-xs tracking-wider uppercase mb-2" style={{ color: c.textMuted }}>Estado</label>
                        <input type="text" defaultValue="PR" className="w-full p-3 border text-sm" style={{ backgroundColor: 'transparent', borderColor: c.border, color: c.text }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <button onClick={() => setCheckoutStep('cart')} className="flex-1 py-3 text-sm border" style={{ borderColor: c.border, color: c.textMuted }}>Voltar</button>
                    <button onClick={() => setCheckoutStep('payment')} className="flex-1 py-3 text-sm" style={{ backgroundColor: c.accent, color: isFeminino ? '#fff' : '#0a0a0a' }}>Continuar</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {[{ id: 'pix', label: 'PIX', desc: '10% de desconto' }, { id: 'card', label: 'Cartao', desc: 'Credito ou Debito' }].map(m => (
                      <button key={m.id} onClick={() => setPaymentMethod(m.id as 'pix' | 'card')} className="w-full p-4 border text-left" style={{ borderColor: paymentMethod === m.id ? c.accent : c.border, backgroundColor: paymentMethod === m.id ? c.accent + '15' : 'transparent' }}>
                        <p className="font-medium text-sm">{m.label}</p>
                        <p className="text-xs" style={{ color: c.textMuted }}>{m.desc}</p>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'pix' && (
                    <div className="p-4 mb-6 text-center" style={{ backgroundColor: c.bgAlt }}>
                      <div className="w-32 h-32 mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: isFeminino ? '#fff' : '#222' }}>
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
                      <span style={{ color: c.textMuted }}>Subtotal</span>
                      <span>R$ {cartTotal.toLocaleString('pt-BR')}</span>
                    </div>
                    {paymentMethod === 'pix' && (
                      <div className="flex justify-between text-sm text-green-500 mb-1">
                        <span>Desconto PIX (10%)</span>
                        <span>- R$ {discount.toLocaleString('pt-BR')}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold mt-2">
                      <span>Total</span>
                      <span style={{ color: c.accent }}>R$ {finalTotal.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <button onClick={() => setCheckoutStep('delivery')} className="flex-1 py-3 text-sm border" style={{ borderColor: c.border, color: c.textMuted }}>Voltar</button>
                    <button onClick={processPayment} className="flex-1 py-3 text-sm" style={{ backgroundColor: c.accent, color: isFeminino ? '#fff' : '#0a0a0a' }}>Confirmar</button>
                  </div>
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
                <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: isFeminino ? '#fff' : '#0a0a0a' }}>
                  <span style={{ color: c.accent }}>{user.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium" style={{ color: isFeminino ? '#fff' : '#0a0a0a' }}>{user.name}</p>
                  <p className="text-xs" style={{ color: isFeminino ? '#ffffff99' : '#0a0a0a99' }}>{user.level} - {user.points} pts</p>
                </div>
              </div>
              <button onClick={() => setShowAccount(false)} style={{ color: isFeminino ? '#fff' : '#0a0a0a' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex border-b" style={{ borderColor: c.border }}>
              {[{ id: 'pedidos', label: 'Pedidos' }, { id: 'wishlist', label: 'Wishlist' }, { id: 'enderecos', label: 'Enderecos' }, { id: 'perfil', label: 'Perfil' }].map(t => (
                <button key={t.id} onClick={() => setAccountTab(t.id as typeof accountTab)} className="flex-1 p-3 text-xs tracking-wide" style={{ backgroundColor: accountTab === t.id ? c.accent : 'transparent', color: accountTab === t.id ? (isFeminino ? '#fff' : '#0a0a0a') : c.textMuted }}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {accountTab === 'pedidos' && (
                <div className="space-y-4">
                  {pedidos.map(p => (
                    <div key={p.id} className="p-4 border" style={{ borderColor: c.border }}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium">{p.id}</span>
                          <span className="text-xs ml-2" style={{ color: c.textMuted }}>{p.data}</span>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-900 text-green-300">Entregue</span>
                      </div>
                      <p className="text-sm" style={{ color: c.textMuted }}>{p.items} {p.items === 1 ? 'item' : 'itens'}</p>
                      <p className="font-medium mt-2" style={{ color: c.accent }}>R$ {p.valor.toLocaleString('pt-BR')}</p>
                    </div>
                  ))}
                </div>
              )}

              {accountTab === 'wishlist' && (
                <div className="text-center py-8">
                  <p style={{ color: c.textMuted }}>Sua wishlist esta vazia</p>
                </div>
              )}

              {accountTab === 'enderecos' && (
                <div className="p-4 border" style={{ borderColor: c.accent, backgroundColor: c.accent + '10' }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Casa</p>
                      <p className="text-sm" style={{ color: c.textMuted }}>Rua das Flores, 123</p>
                      <p className="text-sm" style={{ color: c.textMuted }}>Batel, Curitiba - PR</p>
                    </div>
                    <span className="text-xs px-2 py-1" style={{ backgroundColor: c.accent, color: isFeminino ? '#fff' : '#0a0a0a' }}>Principal</span>
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
                    <p className="font-medium">{nomeLoja} {isFeminino ? 'Club' : 'Elite'}</p>
                    <p className="text-sm" style={{ color: c.textMuted }}>Nivel: {user.level} ({user.points} pts)</p>
                    <p className="text-sm mt-1" style={{ color: c.accent }}>R$ {Math.floor(user.points * 0.1)} em creditos</p>
                  </div>
                  <button className="w-full py-3 text-sm" style={{ backgroundColor: c.accent, color: isFeminino ? '#fff' : '#0a0a0a' }}>Editar Perfil</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp */}
      <a href="https://wa.me/5541999998001" className="fixed bottom-6 right-6 w-14 h-14 flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50" style={{ backgroundColor: c.accent }}>
        <svg className="w-6 h-6" fill={isFeminino ? '#fff' : '#0a0a0a'} viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        </svg>
      </a>
    </main>
  )
}
