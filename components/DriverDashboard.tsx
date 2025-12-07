
import React, { useState } from 'react';
import { Bike, CheckCircle, MapPin, Package, Clock, Car, Footprints, Trophy, Camera, Navigation, Star, TrendingUp, AlertTriangle, ChevronRight, Zap, Target, Users, Map, Wallet, Filter } from 'lucide-react';
import { Button } from './Button';
import { Driver, Order, VehicleType, DriverLevel } from '../types';
import { ReviewModal } from './ReviewModal';

interface DriverDashboardProps {
  driver: Driver;
  availableOrders: Order[];
  onAcceptOrder: (orderId: string) => void;
  onDeliverOrder: (orderId: string) => void;
  currentOrderId?: string;
  orders: Order[];
  allDrivers: Driver[];
  onReferralClick: () => void;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({
  driver,
  availableOrders,
  onAcceptOrder,
  onDeliverOrder,
  currentOrderId,
  orders,
  allDrivers,
  onReferralClick
}) => {
  const [activeTab, setActiveTab] = useState<'work' | 'history'>('work');
  const [isFinishing, setIsFinishing] = useState(false);
  const [proofPhoto, setProofPhoto] = useState<string | null>(null);
  const [radius, setRadius] = useState(5); // km
  
  // Review state for driver
  const [showReview, setShowReview] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);

  const currentOrder = orders.find(o => o.id === currentOrderId);
  
  // Filter by distance/radius and municipality
  const filteredOrders = availableOrders.filter(o => 
    o.municipality === driver.municipality && 
    (o.distanceKm || 0) <= radius
  );

  const calculateEstimate = (distanceKm: number, vehicle: VehicleType) => {
    let base = 0;
    let rate = 0;

    switch (vehicle) {
        case 'motorcycle': base = 4.00; rate = 1.20; break;
        case 'car': base = 6.00; rate = 1.50; break;
        case 'bike': base = 3.00; rate = 0.80; break;
        case 'walking': base = 2.00; rate = 0.50; break;
    }
    
    const dist = Math.max(1, distanceKm);
    let total = base + (dist * rate);
    
    // Level Multiplier (Display only)
    if(driver.level === 'Prata') total *= 1.05;
    if(driver.level === 'Ouro') total *= 1.05;
    if(driver.level === 'Platina') total *= 1.10;

    return Math.round(total * 100) / 100;
  };

  const handleFinishDelivery = () => {
      if(!currentOrder) return;
      if(!proofPhoto) {
          alert("Tire uma foto do pacote para comprovar a entrega.");
          return;
      }
      
      const orderId = currentOrder.id;
      onDeliverOrder(orderId);
      setIsFinishing(false);
      setProofPhoto(null);
      
      // Trigger review modal for driver to rate customer/market
      setCompletedOrderId(orderId);
      setShowReview(true);
  };

  const handleSubmitReview = (rating: number, comment: string) => {
      // In a real app, send to API with orderId
      console.log(`Driver reviewed order ${completedOrderId}: ${rating} stars. "${comment}"`);
      setShowReview(false);
      setCompletedOrderId(null);
  };

  const getVehicleIcon = (type: VehicleType, size: number = 20) => {
    switch(type) {
        case 'car': return <Car size={size} />;
        case 'bike': return <Bike size={size} />;
        case 'walking': return <Footprints size={size} />;
        default: return <Bike size={size} />;
    }
  };

  const getLevelColor = (level: DriverLevel) => {
      switch(level) {
          case 'Bronze': return 'from-orange-700 to-orange-900';
          case 'Prata': return 'from-gray-400 to-gray-600';
          case 'Ouro': return 'from-yellow-500 to-yellow-700';
          case 'Platina': return 'from-cyan-500 to-blue-700';
      }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* 1. GAMIFIED HERO HEADER */}
      <div className={`bg-gradient-to-r ${getLevelColor(driver.level)} text-white rounded-3xl p-6 shadow-xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-6 opacity-10">
            <Trophy size={180} />
        </div>
        
        {/* Top Row: Identification */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/50">
                    {getVehicleIcon(driver.vehicleType, 28)}
                </div>
                <div>
                    <h2 className="font-bold text-xl">{driver.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-white/90">
                        <span className="bg-black/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider text-xs">
                            {driver.level}
                        </span>
                        <div className="flex items-center gap-1">
                            <Star size={14} className="text-yellow-300 fill-yellow-300" />
                            <span>{driver.rating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-black/20 p-4 rounded-xl backdrop-blur-sm text-center min-w-[140px]">
                <p className="text-xs text-white/70 uppercase tracking-wider mb-1">Saldo Atual</p>
                <p className="text-2xl font-black">R$ {driver.earnings.toFixed(2)}</p>
            </div>
        </div>

        {/* Level Progress */}
        <div className="bg-black/20 rounded-xl p-4 border border-white/10 relative overflow-hidden">
            <div className="flex justify-between items-center mb-2 text-xs font-bold uppercase tracking-wide">
                <span>Progresso Próximo Nível</span>
                <span>{driver.deliveriesCompleted} / 50 Entregas</span>
            </div>
            <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden">
                <div 
                    className="bg-white h-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                    style={{width: `${Math.min((driver.deliveriesCompleted / 50) * 100, 100)}%`}}
                ></div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-white/60">
                <span>Nível Atual: {driver.level}</span>
                <span>Meta: Platina (50 Entregas)</span>
            </div>
        </div>
      </div>

      {/* 2. MAIN TABS */}
      <div className="flex p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
        <button 
            onClick={() => setActiveTab('work')} 
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'work' ? 'bg-gray-100 text-gray-900 shadow-inner' : 'text-gray-500 hover:text-gray-700'}`}
        >
            <Map size={18} /> Painel de Entregas
        </button>
        <button 
            onClick={() => setActiveTab('history')} 
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'history' ? 'bg-gray-100 text-gray-900 shadow-inner' : 'text-gray-500 hover:text-gray-700'}`}
        >
            <Wallet size={18} /> Extrato & Ganhos
        </button>
      </div>

      {activeTab === 'work' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            
            {/* Active Order Card */}
            {currentOrder && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 shadow-sm relative overflow-hidden animate-pulse-slow">
                    <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl shadow-sm">
                        EM ROTA
                    </div>
                    
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-bold text-xl text-gray-900">Pedido #{currentOrder.id.slice(-4)}</h3>
                            <div className="text-sm text-green-700 mt-1 flex items-center gap-1 font-medium">
                                <TrendingUp size={16} /> Ganhos Estimados: 
                                <span className="font-black text-xl ml-1">R$ {calculateEstimate(currentOrder.distanceKm || 2, driver.vehicleType).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mb-6 bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                        <div className="flex items-start gap-4 relative">
                            <div className="flex flex-col items-center">
                                <div className="w-4 h-4 bg-blue-500 rounded-full ring-4 ring-blue-100"></div>
                                <div className="w-0.5 h-10 bg-gray-300 my-1"></div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Coleta</p>
                                <p className="font-bold text-gray-900 text-lg">Mercado Central</p>
                                <p className="text-xs text-gray-500">Rua Principal, 123</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <div className="w-4 h-4 bg-orange-500 rounded-full ring-4 ring-orange-100 shrink-0"></div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Entrega</p>
                                <p className="font-bold text-gray-900 text-lg">{currentOrder.customerName}</p>
                                <p className="text-sm text-gray-600">{currentOrder.municipality} - {currentOrder.distanceKm}km</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                         <Button className="flex-1 bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 py-3" onClick={() => window.open(`https://maps.google.com/?q=${currentOrder.municipality}`, '_blank')}>
                            <Navigation size={20} className="mr-2"/> Rota GPS
                        </Button>
                        <Button 
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 py-3" 
                            onClick={() => setIsFinishing(true)}
                        >
                            Finalizar Entrega <ChevronRight size={20} />
                        </Button>
                    </div>
                </div>
            )}

            {/* Filter & Available Orders */}
            {!currentOrder && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Package size={20} className="text-orange-600" />
                            Disponíveis ({filteredOrders.length})
                        </h3>
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                            <Filter size={14} className="text-gray-400" />
                            <span className="text-xs text-gray-600 font-medium">Raio: {radius} km</span>
                            <input 
                                type="range" 
                                min="1" max="20" 
                                value={radius} 
                                onChange={(e) => setRadius(Number(e.target.value))}
                                className="w-20 accent-orange-600 cursor-pointer" 
                            />
                        </div>
                    </div>
                    
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                             <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                <Clock className="text-orange-400" size={40} />
                             </div>
                             <h4 className="text-gray-900 font-bold">Procurando entregas...</h4>
                             <p className="text-sm text-gray-500 mt-1 px-8">Nenhum pedido encontrado num raio de {radius}km em {driver.municipality}. Aumente o raio ou aguarde.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredOrders.map(order => {
                                const earning = calculateEstimate(order.distanceKm || 2, driver.vehicleType);
                                const isHighPay = earning > 10.00;
                                
                                return (
                                    <div key={order.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                        {isHighPay && <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-3 py-1 rounded-bl-lg">ALTA DEMANDA</div>}
                                        
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-4">
                                                <div className="bg-gray-100 p-3 rounded-xl h-fit">
                                                    <Package size={24} className="text-gray-600" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-gray-900 text-lg">R$ {earning.toFixed(2)}</h4>
                                                        {order.deliveryType === 'express' && (
                                                            <Zap size={14} className="text-orange-500 fill-orange-500" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                        <MapPin size={12} /> {order.distanceKm} km • {order.items.length} itens
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {order.municipality} • Bairro Centro
                                                    </p>
                                                </div>
                                            </div>
                                            <Button 
                                                className="bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-lg font-bold text-sm shadow-lg transform group-hover:scale-105 transition-transform" 
                                                onClick={() => onAcceptOrder(order.id)}
                                            >
                                                Aceitar
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
      )}
      
      {/* HISTORY TAB */}
      {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in fade-in">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 text-lg">
                  <TrendingUp className="text-green-600" /> Resumo Financeiro
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                      <p className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">Ganhos Hoje</p>
                      <p className="text-2xl font-black text-green-700">R$ {(driver.earnings * 0.15).toFixed(2)}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Total Semana</p>
                      <p className="text-2xl font-black text-blue-700">R$ {driver.earnings.toFixed(2)}</p>
                  </div>
              </div>

              <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Últimas Atividades</h4>
                  {(driver.earningsHistory || []).slice().reverse().map((entry, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                              <div className="bg-green-100 p-2 rounded-full text-green-600">
                                  <CheckCircle size={16} />
                              </div>
                              <div>
                                  <p className="font-bold text-sm text-gray-900">{entry.type}</p>
                                  <p className="text-xs text-gray-500">{entry.date}</p>
                              </div>
                          </div>
                          <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded text-sm">+ R$ {entry.amount.toFixed(2)}</span>
                      </div>
                  ))}
                  {(!driver.earningsHistory || driver.earningsHistory.length === 0) && (
                      <p className="text-center text-gray-400 text-sm py-8 italic">Você ainda não realizou entregas.</p>
                  )}
              </div>
          </div>
      )}

      {/* Finish Delivery Modal */}
      {isFinishing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                        <Camera size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Comprovante de Entrega</h3>
                    <p className="text-gray-500 text-sm mb-6">Para liberar seu pagamento, tire uma foto do pacote entregue.</p>
                    
                    <div 
                        onClick={() => setProofPhoto("https://placehold.co/400x300/e2e8f0/94a3b8?text=Foto+Comprovante")}
                        className={`border-2 border-dashed rounded-xl aspect-video flex flex-col items-center justify-center cursor-pointer transition-colors mb-6 relative overflow-hidden group ${proofPhoto ? 'border-green-500' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
                    >
                        {proofPhoto ? (
                            <>
                                <img src={proofPhoto} className="absolute inset-0 w-full h-full object-cover" alt="Proof" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                    <CheckCircle className="text-white" size={48} />
                                </div>
                            </>
                        ) : (
                            <>
                                <Camera size={32} className="text-gray-400 mb-2" />
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Tocar para fotografar</span>
                            </>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setIsFinishing(false)}>Cancelar</Button>
                        <Button 
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-md" 
                            disabled={!proofPhoto}
                            onClick={handleFinishDelivery}
                        >
                            Confirmar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Driver Review Modal */}
      {showReview && (
          <ReviewModal 
            isOpen={showReview}
            onClose={() => setShowReview(false)}
            onSubmit={handleSubmitReview}
            targetName="Cliente / Mercado"
            targetRole="Cliente"
          />
      )}
    </div>
  );
};
