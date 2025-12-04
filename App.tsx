import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ChatAssistant } from './components/ChatAssistant';
import { ViewState, Product, CartItem, Municipality, Order, Driver, DriverLevel, VehicleType } from './types';
import { MOCK_PRODUCTS, CATEGORIES, MOCK_DRIVERS, MUNICIPALITIES } from './constants';
import { Star, Truck, ShieldCheck, Zap, Plus, MapPin, ShoppingCart, Sparkles, ChefHat, Loader2, WifiOff, X, User, Store, Bike } from 'lucide-react';
import { Button } from './components/Button';
import { VendorTools } from './components/VendorTools';
import { DriverDashboard } from './components/DriverDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { generateRecipeFromIngredients } from './services/geminiService';
import { getCheapestToday } from './services/api';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('Boa Vista');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  
  // Real Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Mock Backend State (for features not yet connected)
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);
  // Simulate currently logged in driver (hardcoded to first available or create one for the selected municipality)
  const currentDriverId = 'd1'; 

  // Helper: Calculate Level based on points
  const calculateLevel = (points: number): DriverLevel => {
    if (points >= 600) return 'Platina';
    if (points >= 300) return 'Ouro';
    if (points >= 100) return 'Prata';
    return 'Bronze';
  };

  // Helper: Calculate ETA based on distance and vehicle
  const calculateETA = (distanceKm: number, vehicle: VehicleType): number => {
    let speedKmH = 50; // default moto
    if (vehicle === 'car') speedKmH = 40;
    if (vehicle === 'bike') speedKmH = 15;
    if (vehicle === 'walking') speedKmH = 5;

    // Time = (Distance / Speed) * 60 minutes + 5 min prep time
    return Math.ceil((distanceKm / speedKmH) * 60) + 5; 
  };

  // Fetch Products from Backend on Load
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setLoadingProducts(true);
        const data = await getCheapestToday();
        
        // Map backend response to frontend Product type
        const mappedProducts: Product[] = data.map((p: any) => ({
            id: String(p.id),
            name: p.name,
            price: p.effectivePrice,
            originalPrice: p.price > p.effectivePrice ? p.price : undefined,
            image: p.image || `https://placehold.co/400x400/orange/white?text=${encodeURIComponent(p.name)}`,
            category: p.category,
            store: p.Market?.name || 'Mercado Parceiro',
            rating: 4.5 + (Math.random() * 0.5), // Mock rating
            sold: Math.floor(Math.random() * 500), // Mock sold count
            description: `Produto ofertado por ${p.Market?.name || 'Mercado Parceiro'}`,
            municipality: p.Market?.Municipality?.name || 'Boa Vista',
            stock: p.stock
        }));

        setProducts(mappedProducts);
        setIsDemoMode(false);
      } catch (error) {
        console.warn("Backend not detected, switching to Demo Mode with Mock Data.");
        setProducts(MOCK_PRODUCTS);
        setIsDemoMode(true);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchRealData();
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Checkout Logic -> Creates Order
  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Simulate logistics calculation
    const distance = parseFloat((Math.random() * 8 + 1).toFixed(1)); // Random distance 1-9 km
    // Assume motorcycle speed for initial estimate before assignment
    const estimatedTime = calculateETA(distance, 'motorcycle'); 

    const total = cart.reduce((a, b) => a + (b.price * b.quantity), 0);
    const newOrder: Order = {
      id: Date.now().toString(),
      items: [...cart],
      total,
      status: 'pending',
      municipality: selectedMunicipality,
      customerName: 'Cliente Visitante',
      createdAt: new Date(),
      commission: {
        driver: total * 0.10,
        platform: total * 0.10,
        store: total * 0.80
      },
      distanceKm: distance,
      estimatedDeliveryTime: estimatedTime
    };

    setOrders(prev => [...prev, newOrder]);
    setCart([]);
    alert(`Pedido realizado! Distância: ${distance}km. Tempo estimado: ${estimatedTime} min.`);
    // Auto switch to driver view to simulate flow for demo purposes if user wants
    // setCurrentView(ViewState.DRIVER); 
  };

  // Driver Logic
  const handleAcceptOrder = (orderId: string) => {
    const driver = drivers.find(d => d.id === currentDriverId);
    if(!driver) return;

    // Recalculate ETA based on THIS driver's vehicle
    const order = orders.find(o => o.id === orderId);
    let realEta = order?.estimatedDeliveryTime || 30;
    if(order?.distanceKm) {
        realEta = calculateETA(order.distanceKm, driver.vehicleType);
    }

    setOrders(prev => prev.map(o => o.id === orderId ? { 
        ...o, 
        status: 'accepted', 
        driverId: currentDriverId,
        estimatedDeliveryTime: realEta
    } : o));
    
    setDrivers(prev => prev.map(d => d.id === currentDriverId ? { ...d, status: 'busy', currentOrderId: orderId } : d));
  };

  const handleDeliverOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'delivered' } : o));
    
    // Update Driver: Points, Level, Earnings
    setDrivers(prev => prev.map(d => {
        if(d.id === currentDriverId) {
            const newPoints = d.points + 10; // 10 points per delivery
            return {
                ...d,
                status: 'available',
                currentOrderId: undefined,
                earnings: d.earnings + order.commission.driver,
                points: newPoints,
                level: calculateLevel(newPoints)
            };
        }
        return d;
    }));

    alert(`Entrega confirmada! +10 Pontos. Ganho: R$ ${order.commission.driver.toFixed(2)}.`);
  };

  // Product CRUD Handlers (Updates local state for Admin view simulation)
  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const product: Product = { 
      ...newProduct, 
      id: Date.now().toString(),
      rating: 0,
      sold: 0
    };
    setProducts(prev => [...prev, product]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  // Filter products based on search query AND municipality
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.store.toLowerCase().includes(searchQuery.toLowerCase());
    // For demo: if product has specific municipality, filter. If not (generic), show in all.
    // In real app, products are strictly linked to store location.
    const matchesLoc = product.municipality ? product.municipality === selectedMunicipality : true;
    
    return matchesSearch && matchesLoc; // Simplified for demo as mock products don't map perfectly to all municipalities
  });

  const getDriverById = (id: string) => drivers.find(d => d.id === id) || drivers[0];

  const handleRegisterChoice = (type: 'client' | 'driver' | 'vendor') => {
    setIsRegisterModalOpen(false);
    if(type === 'client') {
        // Logic for client registration (e.g. open another modal or redirect)
        alert('Redirecionando para Cadastro de Cliente...');
    } else if(type === 'driver') {
        setCurrentView(ViewState.DRIVER);
    } else if(type === 'vendor') {
        setCurrentView(ViewState.VENDOR);
    }
  };

  // --- Sub-components ---

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden group flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.originalPrice && (
          <div className="absolute top-2 right-2 bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <div className="text-xs text-gray-500 mb-1 truncate">{product.store}</div>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 flex-1">{product.name}</h3>
        
        <div className="mt-auto">
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-orange-600 font-bold text-lg">R$ {product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-gray-400 text-xs line-through">R$ {product.originalPrice.toFixed(2)}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <span>{product.sold} vendidos</span>
          </div>
          
          <Button 
            onClick={() => addToCart(product)} 
            variant="outline" 
            size="sm" 
            className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );

  const RegisterModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 relative">
            <button 
                onClick={() => setIsRegisterModalOpen(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
                <X size={20} />
            </button>
            <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo ao Mercafácil</h2>
                <p className="text-gray-500 mb-8">Como você deseja fazer parte da nossa plataforma?</p>
                
                <div className="space-y-4">
                    <button 
                        onClick={() => handleRegisterChoice('client')}
                        className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group"
                    >
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-200">
                            <User size={24} />
                        </div>
                        <div className="ml-4 text-left">
                            <h3 className="font-bold text-gray-900 group-hover:text-orange-700">Sou Cliente</h3>
                            <p className="text-xs text-gray-500">Quero comprar produtos</p>
                        </div>
                    </button>

                    <button 
                        onClick={() => handleRegisterChoice('driver')}
                        className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group"
                    >
                        <div className="bg-green-100 p-3 rounded-full text-green-600 group-hover:bg-green-200">
                            <Bike size={24} />
                        </div>
                        <div className="ml-4 text-left">
                            <h3 className="font-bold text-gray-900 group-hover:text-orange-700">Sou Entregador</h3>
                            <p className="text-xs text-gray-500">Quero fazer entregas e ganhar renda</p>
                        </div>
                    </button>

                    <button 
                        onClick={() => handleRegisterChoice('vendor')}
                        className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group"
                    >
                        <div className="bg-purple-100 p-3 rounded-full text-purple-600 group-hover:bg-purple-200">
                            <Store size={24} />
                        </div>
                        <div className="ml-4 text-left">
                            <h3 className="font-bold text-gray-900 group-hover:text-orange-700">Sou Lojista</h3>
                            <p className="text-xs text-gray-500">Quero vender meus produtos</p>
                        </div>
                    </button>
                </div>
            </div>
            <div className="bg-gray-50 p-4 text-center text-xs text-gray-500">
                Já tem uma conta? <button className="text-orange-600 font-bold hover:underline">Faça Login</button>
            </div>
        </div>
    </div>
  );

  const HomeView = () => (
    <div className="space-y-8">
      {/* Demo Mode Indicator */}
      {isDemoMode && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-sm flex items-center gap-3">
          <WifiOff className="text-yellow-600" size={24} />
          <div>
            <h4 className="font-bold text-yellow-800 text-sm">Modo de Demonstração (Backend Offline)</h4>
            <p className="text-yellow-700 text-xs">O servidor não foi detectado. Exibindo dados de exemplo para navegação.</p>
          </div>
        </div>
      )}

      {/* Banner - Only show if no search */}
      {!searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-8 text-white relative overflow-hidden flex flex-col justify-center min-h-[200px] md:min-h-[280px]">
            <div className="relative z-10 max-w-lg">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm w-fit px-3 py-1 rounded-full text-xs font-medium mb-4">
                <Truck size={14} />
                <span>Entrega Grátis em {selectedMunicipality}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Feira Fresca <br/> na Sua Porta</h2>
              <p className="mb-6 opacity-90 text-sm md:text-base">Legumes, frutas e produtos regionais com descontos de até 40% hoje.</p>
              <Button className="bg-white text-orange-600 hover:bg-gray-100 border-none">Comprar Agora</Button>
            </div>
            <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4">
              <ShoppingBagIcon size={300} />
            </div>
          </div>
          
          <div className="hidden md:flex flex-col gap-4">
            <div className="flex-1 bg-yellow-50 rounded-xl p-6 border border-yellow-100 flex flex-col justify-center">
              <h3 className="font-bold text-yellow-800 text-lg mb-1">Clube Mercafácil</h3>
              <p className="text-sm text-yellow-700 mb-3">Cupons exclusivos toda semana.</p>
              <span className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Acessar</span>
            </div>
            <div className="flex-1 bg-teal-50 rounded-xl p-6 border border-teal-100 flex flex-col justify-center">
               <h3 className="font-bold text-teal-800 text-lg mb-1">Rastrear Pedido</h3>
               <p className="text-sm text-teal-700 mb-3">Acompanhe seu motoboy em tempo real.</p>
               <MapPin className="text-teal-600" />
            </div>
          </div>
        </div>
      )}

      {/* Categories - Only show if no search */}
      {!searchQuery && (
        <section>
          <h2 className="font-bold text-lg mb-4 text-gray-800">Categorias</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => setSearchQuery(cat.name === 'Ofertas Relâmpago' ? '' : cat.name)}>
                <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 group-hover:border-orange-500 group-hover:text-orange-500 transition-colors shadow-sm">
                  <IconByName name={cat.icon} />
                </div>
                <span className="text-xs font-medium text-gray-600 text-center">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Flash Sale Bar - Only show if no search */}
      {!searchQuery && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-orange-600 font-bold italic text-lg">
              <Zap className="fill-orange-600" />
              OFERTAS RELÂMPAGO
            </div>
            <div className="hidden sm:flex gap-1 text-white text-xs font-bold">
              <span className="bg-gray-900 px-1.5 py-1 rounded">02</span>
              <span className="text-gray-900 self-center">:</span>
              <span className="bg-gray-900 px-1.5 py-1 rounded">15</span>
              <span className="text-gray-900 self-center">:</span>
              <span className="bg-gray-900 px-1.5 py-1 rounded">40</span>
            </div>
          </div>
          <a href="#" className="text-orange-600 text-sm font-medium hover:underline">Ver tudo &gt;</a>
        </div>
      )}

      {/* Product Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-800">
            {searchQuery ? `Resultados para "${searchQuery}"` : `Descobertas do Dia em ${selectedMunicipality}`}
          </h2>
          {searchQuery && (
             <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>Limpar busca</Button>
          )}
        </div>
        
        {loadingProducts ? (
           <div className="flex justify-center items-center py-20">
             <Loader2 className="animate-spin text-orange-500" size={32} />
           </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-2 text-lg">Nenhum produto encontrado para "{searchQuery}" em {selectedMunicipality}.</p>
            <p className="text-sm">Tente buscar por termos mais genéricos ou mude o município.</p>
          </div>
        )}
      </section>
    </div>
  );

  const CartView = () => {
    const [recipe, setRecipe] = useState<string | null>(null);
    const [loadingRecipe, setLoadingRecipe] = useState(false);

    const handleGenerateRecipe = async () => {
      setLoadingRecipe(true);
      const ingredients = cart.map(item => item.name);
      const result = await generateRecipeFromIngredients(ingredients);
      setRecipe(result);
      setLoadingRecipe(false);
    };

    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Seu Carrinho</h2>
        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500">Seu carrinho está vazio.</p>
            <Button onClick={() => setCurrentView(ViewState.HOME)} className="mt-4">
              Ir às compras
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-4 bg-white p-4 rounded-lg border border-gray-200">
                  <img src={item.image} className="w-20 h-20 object-cover rounded-md" alt={item.name} />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.store}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-orange-600">R$ {item.price.toFixed(2)}</span>
                      <div className="flex items-center border rounded">
                        <button className="px-2 text-gray-500">-</button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <button className="px-2 text-gray-500">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* AI Recipe Feature */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 mt-6">
                <div className="flex items-center gap-3 mb-3">
                  <ChefHat className="text-orange-600" size={24} />
                  <h3 className="font-bold text-orange-800">Chef IA Mercafácil</h3>
                </div>
                <p className="text-sm text-orange-700 mb-4">
                  Não sabe o que cozinhar com esses itens? Nossa IA cria uma receita exclusiva para você agora mesmo!
                </p>
                
                {!recipe ? (
                  <Button 
                    onClick={handleGenerateRecipe} 
                    disabled={loadingRecipe}
                    className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto"
                  >
                    {loadingRecipe ? (
                      <><Loader2 className="animate-spin mr-2" /> Criando Receita...</>
                    ) : (
                      <><Sparkles className="mr-2" size={16} /> Gerar Receita com estes Itens</>
                    )}
                  </Button>
                ) : (
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-200 animate-in fade-in slide-in-from-bottom-2">
                    <div className="prose prose-sm prose-orange max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-gray-700">{recipe}</pre>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setRecipe(null)} className="mt-4 text-orange-600">
                      Gerar Outra
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl h-fit border border-gray-200">
              <h3 className="font-bold text-lg mb-4">Resumo do Pedido</h3>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>R$ {cart.reduce((a, b) => a + (b.price * b.quantity), 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4 text-sm">
                <span className="text-gray-600">Frete ({selectedMunicipality})</span>
                <span className="text-green-600">Grátis</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span className="text-orange-600">R$ {cart.reduce((a, b) => a + (b.price * b.quantity), 0).toFixed(2)}</span>
              </div>
              <Button className="w-full py-3" onClick={handleCheckout}>
                Pagar com PIX
              </Button>
              <div className="mt-4 flex items-center gap-2 justify-center text-xs text-gray-500">
                <ShieldCheck size={14} className="text-green-500" />
                Compra Garantida Mercafácil
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout 
      setView={setCurrentView} 
      currentView={currentView} 
      cartCount={cart.reduce((a,b) => a + b.quantity, 0)}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedMunicipality={selectedMunicipality}
      onMunicipalityChange={setSelectedMunicipality}
      onRegisterClick={() => setIsRegisterModalOpen(true)}
    >
      {currentView === ViewState.HOME && <HomeView />}
      {currentView === ViewState.VENDOR && <VendorTools />}
      {currentView === ViewState.CART && <CartView />}
      {currentView === ViewState.DRIVER && (
        <DriverDashboard 
          driver={getDriverById(currentDriverId)}
          availableOrders={orders.filter(o => o.status === 'pending')}
          onAcceptOrder={handleAcceptOrder}
          onDeliverOrder={handleDeliverOrder}
          currentOrderId={getDriverById(currentDriverId).currentOrderId}
          orders={orders}
          allDrivers={drivers} // Pass all drivers for leaderboard
        />
      )}
      {currentView === ViewState.ADMIN && (
        <AdminDashboard 
          orders={orders} 
          totalPayouts={0} 
          products={products}
          drivers={drivers}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      )}
      
      {isRegisterModalOpen && <RegisterModal />}
      <ChatAssistant />
    </Layout>
  );
};

// Helper for dynamic icons
const IconByName: React.FC<{name: string}> = ({ name }) => {
    // A simplified map for this demo
    const icons: any = {
        'zap': <Zap size={24} />,
        'shopping-bag': <ShoppingCart size={24} />,
        'beef': <div className="font-bold text-xl">🥩</div>,
        'carrot': <div className="font-bold text-xl">🥕</div>,
        'beer': <div className="font-bold text-xl">🍺</div>,
        'sparkles': <Sparkles size={24} />,
    };
    return icons[name] || <ShoppingCart />;
};

const ShoppingBagIcon = ({size}: {size:number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 6V4H8V6M4 6H20L21 21H3L4 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)

export default App;