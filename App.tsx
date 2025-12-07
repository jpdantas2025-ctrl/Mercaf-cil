
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { ChatAssistant } from './components/ChatAssistant';
import { ViewState, Product, CartItem, Municipality, Order, Driver, DriverLevel, VehicleType, DeliveryType, SmartList, GamificationProfile, CustomerLevel, Customer, Vendor, ReferralStats, CashbackTransaction } from './types';
import { MOCK_PRODUCTS, CATEGORIES, MOCK_DRIVERS, MUNICIPALITIES, MOCK_MISSIONS } from './constants';
import { Star, Truck, ShieldCheck, Zap, Plus, MapPin, ShoppingCart, Sparkles, ChefHat, Loader2, WifiOff, X, User, Store, Bike, Ticket, Gift, ArrowRight, ArrowLeft, Copy, Tag, RefreshCw, Wallet, Leaf, Play, Clock, Share2, List, Heart, RotateCcw, ShoppingBag, Trophy, Search, Smile, ClipboardList, Repeat, ChevronRight, Beef, Carrot, Beer, SprayCan, Milk, Croissant } from 'lucide-react';
import { Button } from './components/Button';
import { VendorTools } from './components/VendorTools';
import { RealtimeInventory } from './components/RealtimeInventory';
import { DriverDashboard } from './components/DriverDashboard';
import { VendorDashboard } from './components/VendorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { generateRecipeFromIngredients } from './services/geminiService';
import { getCheapestToday } from './services/api';
import { HelpModal } from './components/HelpModal';
import { GamificationHub } from './components/Gamification';
import { InfoModal, InfoModalType } from './components/InfoModal';
import { DriverRegister } from './components/DriverRegister';
import { CustomerRegister } from './components/CustomerRegister';
import { VendorRegister } from './components/VendorRegister';
import { ReferralSystem } from './components/ReferralSystem';
import { CashbackPanel } from './components/CashbackPanel';
import { SmartLists } from './components/SmartLists';
import { ReviewModal } from './components/ReviewModal';
import { OnboardingTutorial } from './components/OnboardingTutorial';
import { CategoryFilter } from './components/CategoryFilter';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('Boa Vista');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isDriverRegisterOpen, setIsDriverRegisterOpen] = useState(false);
  const [isCustomerRegisterOpen, setIsCustomerRegisterOpen] = useState(false);
  const [isVendorRegisterOpen, setIsVendorRegisterOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isClubModalOpen, setIsClubModalOpen] = useState(false);
  const [isLuckyWheelOpen, setIsLuckyWheelOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isCashbackModalOpen, setIsCashbackModalOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<InfoModalType>(null);
  
  // Tutorial State
  const [showTutorial, setShowTutorial] = useState(true);

  // Substitution Preference
  const [subPreference, setSubPreference] = useState<'substitute' | 'refund' | 'contact'>('substitute');

  // Review Modal State
  const [reviewModalConfig, setReviewModalConfig] = useState<{
    isOpen: boolean;
    orderId: string;
    step: 'driver' | 'market'; // Clients review driver then market
    targetName: string;
  }>({ isOpen: false, orderId: '', step: 'driver', targetName: '' });

  // Advanced Features State
  const [cashbackBalance, setCashbackBalance] = useState(12.50);
  const [cashbackHistory, setCashbackHistory] = useState<CashbackTransaction[]>([
      { id: '1', date: '20/10/2023', amount: 2.50, type: 'credit', description: 'Compra #1234' },
      { id: '2', date: '22/10/2023', amount: 5.00, type: 'credit', description: 'Indicação Premiada' },
      { id: '3', date: '25/10/2023', amount: 5.00, type: 'credit', description: 'Promoção Cashback 5%' }
  ]);
  const [savedLists, setSavedLists] = useState<SmartList[]>([]);
  const [nutriMode, setNutriMode] = useState(false);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('standard');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  
  // Gamification State
  const [userProfile, setUserProfile] = useState<GamificationProfile>({
      points: 240,
      level: 'Bronze',
      lifetimeSavings: 45.90,
      streakDays: 3,
      missions: MOCK_MISSIONS,
      weeklyPurchases: 1
  });
  const [currentUser, setCurrentUser] = useState<Customer | null>(null);
  const [currentVendor, setCurrentVendor] = useState<Vendor | null>(null);
  
  const [showGamificationHub, setShowGamificationHub] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Real Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Mock Backend State
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [currentDriverId, setCurrentDriverId] = useState<string>('d1'); 

  // Referral Data
  const [referralStats, setReferralStats] = useState<ReferralStats>({
      code: 'JOAO123',
      totalEarnings: 15.00,
      inviteCount: 3,
      history: [
          { id: 'r1', name: 'Maria Silva', status: 'completed', date: '25/10/2023', rewardAmount: 5.00 },
          { id: 'r2', name: 'Pedro Santos', status: 'pending', date: '26/10/2023', rewardAmount: 0 },
          { id: 'r3', name: 'Ana Costa', status: 'completed', date: '20/10/2023', rewardAmount: 10.00 }
      ]
  });

  const calculateCustomerLevel = (points: number): CustomerLevel => {
      if (points >= 3000) return 'Platina';
      if (points >= 1500) return 'Ouro';
      if (points >= 500) return 'Prata';
      return 'Bronze';
  };

  const addNotification = (msg: string) => {
      setNotifications(prev => [msg, ...prev]);
      setTimeout(() => {
          setNotifications(prev => prev.filter(n => n !== msg));
      }, 5000);
  };

  // Logic for upgrading driver level based on deliveries
  const determineDriverLevel = (deliveries: number, rating: number): DriverLevel => {
    if (deliveries >= 50 && rating >= 4.8) return 'Platina';
    if (deliveries >= 30) return 'Ouro';
    if (deliveries >= 15 && rating >= 4.5) return 'Prata';
    return 'Bronze';
  };

  const calculateETA = (distanceKm: number, vehicle: VehicleType): number => {
    let speedKmH = 50; 
    if (vehicle === 'car') speedKmH = 40;
    if (vehicle === 'bike') speedKmH = 15;
    if (vehicle === 'walking') speedKmH = 5;
    return Math.ceil((distanceKm / speedKmH) * 60) + 5; 
  };

  useEffect(() => {
    setUserProfile(prev => ({
        ...prev,
        level: calculateCustomerLevel(prev.points)
    }));
  }, [userProfile.points]);

  useEffect(() => {
     if(currentUser) {
         setTimeout(() => addNotification("🎉 Bem-vindo! Seu cupom de R$10 expira em 2h"), 2000);
         setTimeout(() => addNotification("📦 Produtos da sua última compra estão em promoção"), 15000);
     }
     if(currentVendor) {
         setTimeout(() => addNotification("📈 Seu catálogo está desatualizado. Atualize para ganhar destaque!"), 3000);
     }
  }, [currentUser, currentVendor]);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setLoadingProducts(true);
        const data = await getCheapestToday();
        
        const mappedProducts: Product[] = data.map((p: any) => ({
            id: String(p.id),
            name: p.name,
            price: p.effectivePrice,
            originalPrice: p.price > p.effectivePrice ? p.price : undefined,
            image: p.image || `https://placehold.co/400x400/orange/white?text=${encodeURIComponent(p.name)}`,
            category: p.category,
            store: p.Market?.name || 'Mercado Parceiro',
            rating: 4.5 + (Math.random() * 0.5),
            sold: Math.floor(Math.random() * 500),
            description: `Produto ofertado por ${p.Market?.name || 'Mercado Parceiro'}`,
            municipality: p.Market?.Municipality?.name || 'Boa Vista',
            stock: p.stock,
            isHealthy: p.category === 'Hortifruti' || p.category === 'Saudável'
        }));

        setProducts(mappedProducts);
        setIsDemoMode(false);
      } catch (error) {
        console.log("Backend not reachable (Demo Mode Active). Using Mock Data.");
        const enhancedMock = MOCK_PRODUCTS.map(p => ({
            ...p,
            isHealthy: ['Hortifruti', 'Legumes', 'Frutas'].includes(p.category) || p.name.includes('Frango'),
            isDiscountHunt: Math.random() > 0.8
        }));
        setProducts(enhancedMock);
        setIsDemoMode(true);
        // We do not treat this as a critical error to avoid blocking the UI
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
    addNotification(`"${product.name}" adicionado ao carrinho!`);
  };

  const handleSaveSmartList = (name: string, items: CartItem[]) => {
      const newList: SmartList = {
          id: Date.now().toString(),
          name,
          items,
          type: 'manual',
          timesPurchased: 0,
          totalSaved: 0,
          createdAt: new Date()
      };
      setSavedLists(prev => [...prev, newList]);
      addNotification(`Lista "${name}" salva com sucesso!`);
  };

  const handleDeleteSmartList = (id: string) => {
      setSavedLists(prev => prev.filter(l => l.id !== id));
      addNotification("Lista excluída.");
  };

  const loadList = (list: SmartList) => {
    if (window.confirm(`Substituir carrinho atual pela lista "${list.name}"?`)) {
        setCart(list.items);
        setCurrentView(ViewState.CART);
        addNotification(`Lista "${list.name}" carregada no carrinho!`);
    }
  };

  const handleCheckout = (useCashback: boolean) => {
    if (cart.length === 0) return;
    
    const distance = parseFloat((Math.random() * 8 + 1).toFixed(1)); 
    let estimatedTime = calculateETA(distance, 'motorcycle'); 

    let shippingCost = 0;
    if (deliveryType === 'express') {
        shippingCost = 15.00;
        estimatedTime = 30; 
    } else if (deliveryType === 'scheduled') {
        shippingCost = 5.00;
    }

    let total = cart.reduce((a, b) => a + (b.price * b.quantity), 0) + shippingCost;
    
    let discount = 0;
    if (useCashback) {
        discount = Math.min(total, cashbackBalance);
        
        setCashbackHistory(prev => [...prev, {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString(),
            amount: discount,
            type: 'debit',
            description: 'Desconto em Compra'
        }]);

        setCashbackBalance(prev => prev - discount);
        total -= discount;
    }

    const earnedCashback = total * 0.05;
    if (earnedCashback > 0) {
        setCashbackBalance(prev => prev + earnedCashback);
        setCashbackHistory(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            date: new Date().toLocaleDateString(),
            amount: earnedCashback,
            type: 'credit',
            description: 'Cashback 5% Compra'
        }]);
        addNotification(`Você ganhou R$ ${earnedCashback.toFixed(2)} de volta!`);
    }

    const basePoints = Math.floor(total); 
    const isFirstPurchase = orders.length === 0;
    const bonusPoints = isFirstPurchase ? 100 : 0;
    const totalPointsEarned = basePoints + bonusPoints;

    setUserProfile(prev => ({
        ...prev,
        points: prev.points + totalPointsEarned,
        weeklyPurchases: (prev.weeklyPurchases || 0) + 1,
        missions: prev.missions.map(m => {
            if (m.type === 'spend') return { ...m, current: m.current + total };
            if (m.type === 'order_count') return { ...m, current: m.current + 1 };
            return m;
        })
    }));

    const newOrder: Order = {
      id: Date.now().toString(),
      items: [...cart],
      total,
      status: 'pending',
      municipality: selectedMunicipality,
      customerName: currentUser?.name || 'Cliente Visitante',
      createdAt: new Date(),
      commission: {
        driver: total * 0.10,
        platform: total * 0.10,
        store: total * 0.80
      },
      distanceKm: distance,
      estimatedDeliveryTime: estimatedTime,
      deliveryType,
      substitutionPreference: subPreference,
      reviewedByClient: false,
      reviewedByDriver: false
    };

    setOrders(prev => [...prev, newOrder]);
    setCart([]);
    
    setTimeout(() => {
        setIsLuckyWheelOpen(true);
    }, 1000);
  };

  const handleAcceptOrder = (orderId: string) => {
    const driver = drivers.find(d => d.id === currentDriverId);
    if(!driver) return;
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'accepted', driverId: currentDriverId } : o));
    setDrivers(prev => prev.map(d => d.id === currentDriverId ? { ...d, status: 'busy', currentOrderId: orderId } : d));
  };

  const handleDeliverOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    const driver = drivers.find(d => d.id === currentDriverId);
    if (!order || !driver) return;
    
    // --- DYNAMIC PRICING LOGIC ---
    let base = 0;
    let rate = 0;
    
    // 1. Base per modality
    switch(driver.vehicleType) {
        case 'walking': base = 2.00; rate = 0.50; break;
        case 'bike': base = 3.00; rate = 0.80; break;
        case 'motorcycle': base = 4.00; rate = 1.20; break;
        case 'car': base = 6.00; rate = 1.50; break;
    }
    
    const dist = Math.max(1, order.distanceKm || 1);
    let subTotal = base + (dist * rate);

    // 2. Level Multiplier
    let multiplier = 1;
    if (driver.level === 'Prata') multiplier = 1.05;
    if (driver.level === 'Ouro') multiplier = 1.05; // Priority benefit mostly
    if (driver.level === 'Platina') multiplier = 1.10;

    // 3. Peak Hour Bonus (Simulated)
    const isPeakHour = Math.random() > 0.7; 
    const peakBonus = isPeakHour ? 2.00 : 0;
    
    const finalEarnings = (subTotal * multiplier) + peakBonus;

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'delivered' } : o));
    setDrivers(prev => prev.map(d => {
        if(d.id === currentDriverId) {
            const newCompleted = d.deliveriesCompleted + 1;
            const newPoints = d.points + 10;
            
            // Recalculate Level
            const newLevel = determineDriverLevel(newCompleted, d.rating);
            if (newLevel !== d.level) {
                addNotification(`🎉 Parabéns! Você subiu para nível ${newLevel}!`);
            }

            const newWeeklyCurrent = d.weeklyGoal.current + 1;
            if (newWeeklyCurrent === d.weeklyGoal.target) {
                addNotification(`🎯 Meta da Semana atingida! Bônus de R$ ${d.weeklyGoal.reward} liberado!`);
            }

            return { 
                ...d, 
                status: 'available', 
                currentOrderId: undefined, 
                earnings: d.earnings + finalEarnings + (newWeeklyCurrent === d.weeklyGoal.target ? d.weeklyGoal.reward : 0), 
                points: newPoints, 
                level: newLevel,
                deliveriesCompleted: newCompleted,
                weeklyGoal: { ...d.weeklyGoal, current: newWeeklyCurrent },
                earningsHistory: [...(d.earningsHistory || []), { date: new Date().toLocaleTimeString(), amount: finalEarnings, type: 'Entrega' }]
            };
        }
        return d;
    }));
    
    addNotification(`Entrega finalizada! Você ganhou R$ ${finalEarnings.toFixed(2)}`);
    if(isPeakHour) addNotification("🔥 Bônus de Horário de Pico aplicado (+R$ 2,00)");
  };
  
  const handleDriverRegister = (newDriver: Driver) => {
      setDrivers(prev => [...prev, newDriver]);
      setCurrentDriverId(newDriver.id);
      setCurrentView(ViewState.DRIVER);
      setIsDriverRegisterOpen(false);
      addNotification("Cadastro enviado! Bem-vindo ao time.");
  };

  const handleCustomerRegister = (newCustomer: Customer) => {
      setCurrentUser(newCustomer);
      setUserProfile(newCustomer.profile);
      setIsCustomerRegisterOpen(false);
      addNotification(`Olá, ${newCustomer.name.split(' ')[0]}! Cadastro realizado.`);
  };

  const handleVendorRegister = (newVendor: Vendor) => {
      setCurrentVendor(newVendor);
      setIsVendorRegisterOpen(false);
      setCurrentView(ViewState.VENDOR);
      addNotification(`Bem-vindo, ${newVendor.name}! Seu painel está pronto.`);
  };

  // Review Handling
  const triggerClientReview = (order: Order) => {
    // 1. Rate Driver first
    const driver = drivers.find(d => d.id === order.driverId);
    setReviewModalConfig({
        isOpen: true,
        orderId: order.id,
        step: 'driver',
        targetName: driver ? driver.name : 'Motorista'
    });
  };

  const handleSubmitReview = (rating: number, comment: string) => {
    // Logic for step 1 (Driver) and Step 2 (Market)
    if (reviewModalConfig.step === 'driver') {
        addNotification("Avaliação do motorista enviada!");
        // Proceed to rate market
        const order = orders.find(o => o.id === reviewModalConfig.orderId);
        setReviewModalConfig({
            isOpen: true,
            orderId: reviewModalConfig.orderId,
            step: 'market',
            targetName: order?.items[0]?.store || 'Mercado'
        });
    } else {
        addNotification("Avaliação do mercado enviada! Obrigado.");
        setReviewModalConfig({ ...reviewModalConfig, isOpen: false });
        // Mark order as reviewed
        setOrders(prev => prev.map(o => o.id === reviewModalConfig.orderId ? { ...o, reviewedByClient: true } : o));
    }
  };

  const filterProducts = (category: string = 'Todos') => {
    return products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              product.store.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLoc = product.municipality ? product.municipality === selectedMunicipality : true;
        const matchesNutri = nutriMode ? product.isHealthy : true;
        const matchesCategory = category === 'Todos' || product.category === category;
        
        return matchesSearch && matchesLoc && matchesNutri && matchesCategory;
    });
  };

  const LuckyWheelModal = () => {
    const [spinning, setSpinning] = useState(false);
    const [prize, setPrize] = useState<string | null>(null);
    const wheelRef = useRef<HTMLDivElement>(null);

    const spin = () => {
        if (spinning || prize) return;
        setSpinning(true);
        const randomDeg = Math.floor(Math.random() * 360) + 1440; 
        
        if (wheelRef.current) {
            wheelRef.current.style.transform = `rotate(${randomDeg}deg)`;
        }

        setTimeout(() => {
            setSpinning(false);
            const prizes = ['Frete Grátis', 'R$ 5,00 de Cashback', 'Cupom 10% OFF', 'R$ 5 de Desconto', 'Cupom de Fim de Semana', 'Tente Novamente'];
            const won = prizes[Math.floor(Math.random() * prizes.length)];
            setPrize(won);
            
            if (won.includes('Cashback') || won.includes('Desconto')) {
                setCashbackBalance(prev => prev + 5); 
                setCashbackHistory(prev => [...prev, {
                    id: Date.now().toString(),
                    date: new Date().toLocaleDateString(),
                    amount: 5,
                    type: 'credit',
                    description: 'Prêmio Roda da Sorte'
                }]);
                addNotification(`Parabéns! Você ganhou ${won}`);
            }
        }, 3000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden text-center relative">
                <button 
                  onClick={() => setIsLuckyWheelOpen(false)} 
                  className="absolute top-2 right-2 text-white/80 hover:text-white z-20"
                >
                    <X size={24} />
                </button>
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                    <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                        <Gift className="animate-bounce" /> Roda da Sorte
                    </h2>
                    <p className="text-purple-100 text-sm">Gire para ganhar prêmios!</p>
                </div>
                
                <div className="p-8 flex flex-col items-center overflow-hidden">
                    {!prize ? (
                        <div className="relative w-64 h-64 mb-6">
                            <div 
                                ref={wheelRef}
                                className="w-full h-full rounded-full border-8 border-purple-200 bg-[conic-gradient(#fca5a5_0deg_60deg,#fbbf24_60deg_120deg,#34d399_120deg_180deg,#60a5fa_180deg_240deg,#a78bfa_240deg_300deg,#f472b6_300deg_360deg)] transition-transform duration-[3000ms] cubic-bezier(0.25, 0.1, 0.25, 1) shadow-xl"
                                style={{ transform: 'rotate(0deg)' }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white rounded-full shadow-lg z-10 flex items-center justify-center text-purple-600 font-bold">
                                        MF
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 text-purple-800 text-5xl drop-shadow-md">▼</div>
                        </div>
                    ) : (
                        <div className="mb-6 animate-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 border-4 border-green-200">
                                <Ticket size={48} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Parabéns!</h3>
                            <p className="text-xl text-purple-600 font-bold">{prize}</p>
                            <p className="text-sm text-gray-500 mt-2">O prêmio foi adicionado à sua carteira.</p>
                        </div>
                    )}

                    {!prize ? (
                        <Button onClick={spin} disabled={spinning} className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg h-12 shadow-lg">
                            {spinning ? 'Girando...' : 'GIRAR AGORA'}
                        </Button>
                    ) : (
                        <Button onClick={() => setIsLuckyWheelOpen(false)} className="w-full">
                            Continuar Comprando
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
  };

  const OrdersListView = () => (
      <div className="space-y-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900">Meus Pedidos</h2>
          {orders.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200">
                  <ClipboardList size={40} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">Você ainda não fez pedidos.</p>
              </div>
          ) : (
              orders.slice().reverse().map(order => (
                  <div key={order.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <h3 className="font-bold text-lg">Pedido #{order.id.slice(-6)}</h3>
                              <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                              {order.status === 'delivered' ? 'Entregue' : order.status}
                          </span>
                      </div>
                      <div className="border-t border-b border-gray-100 py-3 mb-4 space-y-2">
                          {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-gray-700">{item.quantity}x {item.name}</span>
                                  <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                          ))}
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">Total: R$ {order.total.toFixed(2)}</span>
                          {order.status === 'delivered' && !order.reviewedByClient && (
                              <Button size="sm" onClick={() => triggerClientReview(order)} className="bg-yellow-500 hover:bg-yellow-600 text-white border-none">
                                  <Star size={16} className="mr-2" fill="white" /> Avaliar
                              </Button>
                          )}
                      </div>
                  </div>
              ))
          )}
      </div>
  );

  // Helper function to render a product row (aisle)
  const renderProductRow = (title: string, category: string, icon?: React.ReactNode) => {
      const items = filterProducts(category);
      if (items.length === 0) return null;

      return (
          <section key={category} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                      {icon} {title}
                  </h3>
                  <button 
                    onClick={() => setActiveCategory(category)}
                    className="text-orange-600 text-sm font-medium hover:underline flex items-center"
                  >
                      Ver todos <ChevronRight size={16} />
                  </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {items.slice(0, 6).map(product => (
                      <ProductCard key={product.id} product={product} />
                  ))}
              </div>
          </section>
      );
  };

  // Icon mapping for categories
  const getCategoryIcon = (catName: string) => {
      switch(catName) {
          case 'Hortifruti': return <Carrot className="text-green-500" />;
          case 'Açougue': return <Beef className="text-red-500" />;
          case 'Bebidas': return <Beer className="text-yellow-500" />;
          case 'Limpeza': return <SprayCan className="text-blue-500" />;
          case 'Mercearia': return <ShoppingBag className="text-orange-500" />;
          case 'Laticínios': return <Milk className="text-cyan-500" />;
          case 'Padaria': return <Croissant className="text-amber-600" />;
          case 'Ofertas Relâmpago': return <Zap className="text-yellow-500 fill-yellow-500" />;
          default: return <Tag className="text-gray-500" />;
      }
  };

  // Home View
  const HomeView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* NEW HERO BANNER */}
      <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-red-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 opacity-10">
              <Sparkles size={300} />
          </div>
          
          <div className="relative z-10">
              <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-4 tracking-wider border border-white/30">
                  CONECTANDO OPORTUNIDADES
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                  Mercafácil: <br className="hidden md:block"/>
                  <span className="text-yellow-300">Todo Mundo Ganha!</span>
              </h1>
              
              <p className="text-lg md:text-xl text-orange-50 font-medium mb-8 max-w-2xl">
                  Onde comprar é fácil, vender é rápido e entregar gera renda.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg"><ShoppingBag size={20} className="text-white"/></div>
                      <div className="text-sm">
                          <span className="block font-bold">Você</span>
                          <span className="text-orange-100 text-xs">Compra com conforto e economia</span>
                      </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg"><Store size={20} className="text-white"/></div>
                      <div className="text-sm">
                          <span className="block font-bold">Mercado</span>
                          <span className="text-orange-100 text-xs">Vende mais e aparece</span>
                      </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg"><Bike size={20} className="text-white"/></div>
                      <div className="text-sm">
                          <span className="block font-bold">Entregador</span>
                          <span className="text-orange-100 text-xs">Tem renda e dignidade</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Category Nav Bar */}
      <CategoryFilter 
        categories={CATEGORIES} 
        activeCategory={activeCategory} 
        onSelectCategory={setActiveCategory}
        getIcon={getCategoryIcon}
      />

      {/* Gamification Banner */}
      <div 
        onClick={() => setShowGamificationHub(true)}
        className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg cursor-pointer transform hover:scale-[1.01] transition-all relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <Trophy size={140} />
        </div>
        <div className="relative z-10 flex justify-between items-center">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-0.5 rounded uppercase">Nível {userProfile.level}</span>
                    <span className="text-sm text-gray-300">{userProfile.points} pontos</span>
                </div>
                <h2 className="text-2xl font-bold mb-1">Clube Mercafácil</h2>
                <p className="text-gray-400 text-sm">Toque para ver suas missões e recompensas.</p>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
                <ChevronRight className="text-white" />
            </div>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div onClick={() => setIsReferralModalOpen(true)} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow hover:border-green-200 group">
            <div className="bg-green-100 p-3 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors"><Share2 size={24}/></div>
            <div><h3 className="font-bold text-sm text-gray-800">Indique e Ganhe</h3><p className="text-xs text-green-600">R$ 5,00 por amigo</p></div>
         </div>
         <div onClick={() => setCurrentView(ViewState.LISTS)} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow hover:border-purple-200 group">
            <div className="bg-purple-100 p-3 rounded-full text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors"><List size={24}/></div>
            <div><h3 className="font-bold text-sm text-gray-800">Listas Inteligentes</h3><p className="text-xs text-purple-600">IA sugere compras</p></div>
         </div>
         <div onClick={() => setIsCashbackModalOpen(true)} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow hover:border-blue-200 group">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Wallet size={24}/></div>
            <div><h3 className="font-bold text-sm text-gray-800">Carteira Cashback</h3><p className="text-xs text-blue-600">Saldo: R$ {cashbackBalance.toFixed(2)}</p></div>
         </div>
         <div onClick={() => setCurrentView(ViewState.CART)} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow hover:border-orange-200 group">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors"><ClipboardList size={24}/></div>
            <div><h3 className="font-bold text-sm text-gray-800">Meus Pedidos</h3><p className="text-xs text-orange-600">Rastreio e Histórico</p></div>
         </div>
      </div>
      
      {/* Product Display Logic */}
      <section>
        <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-gray-800">
                {activeCategory === 'Todos' ? `Destaques em ${selectedMunicipality}` : activeCategory}
            </h2>
            <div className="flex gap-2">
                <button onClick={() => setNutriMode(!nutriMode)} className={`text-xs px-3 py-1 rounded-full border ${nutriMode ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white text-gray-500 border-gray-200'}`}>
                    🥗 Modo Saudável
                </button>
            </div>
        </div>
        
        {loadingProducts ? (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-orange-600" size={40} />
            </div>
        ) : (
            <>
                {/* If searching or specific category selected, show grid */}
                {(searchQuery || activeCategory !== 'Todos') ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {filterProducts(activeCategory).map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    /* If 'Todos' and no search, show Aisles (Rows by Category) */
                    <div className="space-y-10">
                        {/* 1. Ofertas Relâmpago First */}
                        {renderProductRow('Ofertas Relâmpago', 'Ofertas Relâmpago', <Zap className="text-yellow-500 fill-yellow-500" />)}
                        
                        {/* 2. Then other categories */}
                        {CATEGORIES.filter(c => c.name !== 'Ofertas Relâmpago').map(cat => (
                            renderProductRow(cat.name, cat.name, getCategoryIcon(cat.name))
                        ))}
                    </div>
                )}
            </>
        )}
      </section>
    </div>
  );

  const CartView = () => {
      const subtotal = cart.reduce((a, b) => a + (b.price * b.quantity), 0);
      return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900">Carrinho de Compras</h2>
                <button 
                    onClick={() => setCurrentView(ViewState.HOME)}
                    className="text-orange-600 font-bold text-sm hover:underline flex items-center gap-1"
                >
                    <ArrowLeft size={18} /> Continuar Comprando
                </button>
            </div>
            
            {cart.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-300">
                        <ShoppingBag size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Seu carrinho está vazio</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Explore nossos corredores virtuais e aproveite as melhores ofertas de Roraima!</p>
                    <Button onClick={() => setCurrentView(ViewState.HOME)} size="lg" className="shadow-xl shadow-orange-100">
                        Ir para as Compras
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                <img src={item.image} className="w-24 h-24 object-cover rounded-lg bg-gray-50 border border-gray-100" alt={item.name} />
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                                            <span className="font-bold text-lg text-gray-900">R$ {(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <Store size={10}/> {item.store}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                            <button 
                                                className="w-7 h-7 bg-white rounded-md text-gray-600 flex items-center justify-center hover:text-orange-600 shadow-sm border border-gray-100 disabled:opacity-50"
                                                onClick={() => setCart(prev => prev.map(i => i.id === item.id ? {...i, quantity: Math.max(0, i.quantity - 1)} : i).filter(i => i.quantity > 0))}
                                            >-</button>
                                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                            <button 
                                                className="w-7 h-7 bg-white rounded-md text-gray-600 flex items-center justify-center hover:text-green-600 shadow-sm border border-gray-100"
                                                onClick={() => addToCart(item)}
                                            >+</button>
                                        </div>
                                        <p className="text-xs text-gray-400">Unit: R$ {item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary & Substitution Preference */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
                            <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Resumo do Pedido</h3>
                            <div className="space-y-3 text-sm mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({cart.length} itens)</span>
                                    <span>R$ {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Entrega estimada</span>
                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">Calculado no checkout</span>
                                </div>
                                <div className="flex justify-between font-black text-xl text-gray-900 pt-2 border-t border-gray-100">
                                    <span>Total</span>
                                    <span>R$ {subtotal.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            {/* SUBSTITUTION LOGIC UI */}
                            <div className="mb-6 bg-orange-50 p-4 rounded-xl border border-orange-100">
                                <p className="text-xs font-bold text-orange-800 mb-3 flex items-center gap-1">
                                    <Repeat size={14}/> Se faltar algum produto?
                                </p>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 text-xs text-gray-700 cursor-pointer hover:bg-white/50 p-1 rounded transition-colors">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${subPreference === 'substitute' ? 'border-orange-600 bg-orange-600' : 'border-gray-300 bg-white'}`}>
                                            {subPreference === 'substitute' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                        </div>
                                        <input type="radio" name="sub" checked={subPreference === 'substitute'} onChange={() => setSubPreference('substitute')} className="hidden" />
                                        Substituir por similar
                                    </label>
                                    <label className="flex items-center gap-3 text-xs text-gray-700 cursor-pointer hover:bg-white/50 p-1 rounded transition-colors">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${subPreference === 'refund' ? 'border-orange-600 bg-orange-600' : 'border-gray-300 bg-white'}`}>
                                            {subPreference === 'refund' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                        </div>
                                        <input type="radio" name="sub" checked={subPreference === 'refund'} onChange={() => setSubPreference('refund')} className="hidden" />
                                        Reembolsar item
                                    </label>
                                    <label className="flex items-center gap-3 text-xs text-gray-700 cursor-pointer hover:bg-white/50 p-1 rounded transition-colors">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${subPreference === 'contact' ? 'border-orange-600 bg-orange-600' : 'border-gray-300 bg-white'}`}>
                                            {subPreference === 'contact' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                        </div>
                                        <input type="radio" name="sub" checked={subPreference === 'contact'} onChange={() => setSubPreference('contact')} className="hidden" />
                                        Me ligar para decidir
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button onClick={() => handleCheckout(false)} className="w-full py-3 text-base shadow-lg shadow-orange-200">
                                    Ir para Pagamento
                                </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={() => setCurrentView(ViewState.HOME)} 
                                    className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-orange-600"
                                >
                                    Continuar Comprando
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      )
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div className="bg-white rounded-lg shadow-sm border p-3">
        <div className="relative">
            <img src={product.image} className="w-full h-32 object-cover rounded mb-2" alt={product.name}/>
            {product.isDiscountHunt && (
                <div className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded animate-pulse">OFERTA</div>
            )}
        </div>
        <h3 className="font-bold text-sm truncate">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-1">{product.store}</p>
        <div className="flex justify-between items-center">
            <p className="text-orange-600 font-bold">R$ {product.price.toFixed(2)}</p>
            <Button size="sm" onClick={() => addToCart(product)} className="px-2 py-1 h-auto text-xs">Add</Button>
        </div>
    </div>
  );

  const RegisterModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
            <button onClick={() => setIsRegisterModalOpen(false)} className="absolute top-4 right-4 text-gray-400"><X size={20}/></button>
            <h2 className="text-2xl font-bold mb-6 text-center">Cadastro</h2>
            <div className="space-y-3">
                <Button onClick={() => { setIsRegisterModalOpen(false); setIsCustomerRegisterOpen(true); }} className="w-full">Cliente</Button>
                <Button onClick={() => { setIsRegisterModalOpen(false); setIsDriverRegisterOpen(true); }} className="w-full">Entregador</Button>
                <Button onClick={() => { setIsRegisterModalOpen(false); setIsVendorRegisterOpen(true); }} className="w-full">Lojista</Button>
            </div>
        </div>
    </div>
  );

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
      onHelpClick={() => setIsHelpModalOpen(true)}
      onFooterLinkClick={(link) => setInfoModalType(link as InfoModalType)}
    >
      <div className="fixed top-24 right-4 z-50 space-y-2 pointer-events-none">
          {notifications.map((note, i) => (
              <div key={i} className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right-10 fade-in duration-300 pointer-events-auto">
                  <Smile size={16} className="text-yellow-400" /> {note}
              </div>
          ))}
      </div>

      {currentView === ViewState.HOME && <HomeView />}
      {currentView === ViewState.CART && <CartView />} 
      
      {currentView === ViewState.VENDOR && (currentVendor ? <VendorDashboard vendor={currentVendor} /> : <div className="text-center py-20 space-y-4"><h3 className="text-xl">Área do Lojista</h3><Button onClick={()=>setIsVendorRegisterOpen(true)}>Cadastrar / Login Lojista</Button></div>)}
      
      {currentView === ViewState.DRIVER && (
        <DriverDashboard 
          driver={drivers.find(d => d.id === currentDriverId) || drivers[0]}
          availableOrders={orders.filter(o => o.status === 'pending')}
          onAcceptOrder={handleAcceptOrder}
          onDeliverOrder={handleDeliverOrder}
          currentOrderId={drivers.find(d => d.id === currentDriverId)?.currentOrderId}
          orders={orders}
          allDrivers={drivers}
          onReferralClick={() => setIsReferralModalOpen(true)}
        />
      )}
      
      {currentView === ViewState.ADMIN && <AdminDashboard orders={orders} totalPayouts={0} products={products} drivers={drivers} onAddProduct={()=>{}} onUpdateProduct={()=>{}} onDeleteProduct={()=>{}} />}
      
      {currentView === ViewState.LISTS && <SmartLists savedLists={savedLists} onLoadList={loadList} onSaveList={handleSaveSmartList} onDeleteList={handleDeleteSmartList} currentCart={cart} onBack={() => setCurrentView(ViewState.HOME)} />}
      
      {/* Modals & Components */}
      <ReviewModal 
        isOpen={reviewModalConfig.isOpen}
        onClose={() => setReviewModalConfig({ ...reviewModalConfig, isOpen: false })}
        onSubmit={handleSubmitReview}
        targetName={reviewModalConfig.targetName}
        targetRole={reviewModalConfig.step === 'driver' ? 'Motorista' : 'Mercado'}
      />

      {isRegisterModalOpen && <RegisterModal />}
      {isDriverRegisterOpen && <DriverRegister onClose={() => setIsDriverRegisterOpen(false)} onRegister={handleDriverRegister} />}
      {isCustomerRegisterOpen && <CustomerRegister onClose={() => setIsCustomerRegisterOpen(false)} onRegister={handleCustomerRegister} />}
      {isVendorRegisterOpen && <VendorRegister onClose={() => setIsVendorRegisterOpen(false)} onRegister={handleVendorRegister} />}
      {isLuckyWheelOpen && <LuckyWheelModal />}
      {showGamificationHub && <GamificationHub profile={userProfile} onClose={() => setShowGamificationHub(false)} />}
      {isReferralModalOpen && <ReferralSystem userType={currentView === ViewState.DRIVER ? 'driver' : currentView === ViewState.VENDOR ? 'vendor' : 'client'} referralData={referralStats} onClose={() => setIsReferralModalOpen(false)} />}
      {isCashbackModalOpen && <CashbackPanel balance={cashbackBalance} history={cashbackHistory} userType="client" onClose={() => setIsCashbackModalOpen(false)} />}
      {infoModalType && <InfoModal type={infoModalType} onClose={() => setInfoModalType(null)} />}
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
      
      {/* Onboarding Tutorial - Shows only if state is true (simulating first visit) */}
      {showTutorial && <OnboardingTutorial onClose={() => setShowTutorial(false)} />}
      
      <ChatAssistant />
    </Layout>
  );
};

export default App;
