import React, { useState } from 'react';
import { Bike, CheckCircle, MapPin, DollarSign, Package, Clock, Car, Footprints, Trophy, Medal, Crown } from 'lucide-react';
import { Button } from './Button';
import { Driver, Order, VehicleType, DriverLevel } from '../types';

interface DriverDashboardProps {
  driver: Driver;
  availableOrders: Order[];
  onAcceptOrder: (orderId: string) => void;
  onDeliverOrder: (orderId: string) => void;
  currentOrderId?: string;
  orders: Order[]; // Full list to find current order
  allDrivers: Driver[]; // For Leaderboard
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({
  driver,
  availableOrders,
  onAcceptOrder,
  onDeliverOrder,
  currentOrderId,
  orders,
  allDrivers
}) => {
  const [activeTab, setActiveTab] = useState<'work' | 'ranking'>('work');
  const currentOrder = orders.find(o => o.id === currentOrderId);

  // Filter available orders by driver's municipality
  const localOrders = availableOrders.filter(o => o.municipality === driver.municipality);

  const getVehicleIcon = (type: VehicleType, size: number = 20) => {
    switch(type) {
        case 'car': return <Car size={size} />;
        case 'bike': return <Bike size={size} />;
        case 'walking': return <Footprints size={size} />;
        default: return <Bike size={size} />; // Motorcycle fallback
    }
  };

  const getLevelColor = (level: DriverLevel) => {
    switch(level) {
        case 'Platina': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
        case 'Ouro': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'Prata': return 'bg-gray-100 text-gray-700 border-gray-200';
        default: return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  const getPointsToNextLevel = (points: number) => {
    if(points >= 600) return 0; // Max level
    if(points >= 300) return 600 - points;
    if(points >= 100) return 300 - points;
    return 100 - points;
  };

  const nextLevelName = (points: number) => {
    if(points >= 600) return 'Max';
    if(points >= 300) return 'Platina';
    if(points >= 100) return 'Ouro';
    return 'Prata';
  };

  const sortedDrivers = [...allDrivers].sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-6">
      {/* Driver Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 relative">
            {getVehicleIcon(driver.vehicleType, 32)}
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white text-xs font-bold ${
                driver.level === 'Platina' ? 'bg-cyan-500 text-white' : 
                driver.level === 'Ouro' ? 'bg-yellow-400 text-white' : 
                driver.level === 'Prata' ? 'bg-gray-400 text-white' : 'bg-orange-400 text-white'
            }`}>
                {driver.level[0]}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{driver.name}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${driver.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {driver.status === 'available' ? 'Disponível' : 'Em Rota'}
              </span>
              <span>•</span>
              <MapPin size={14} />
              <span>{driver.municipality}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
            <div className={`px-4 py-2 rounded-xl border flex flex-col items-center min-w-[100px] ${getLevelColor(driver.level)}`}>
                <p className="text-xs font-medium uppercase tracking-wide">Nível</p>
                <p className="text-xl font-bold">{driver.level}</p>
            </div>
            <div className="bg-green-50 px-6 py-2 rounded-xl border border-green-100 flex flex-col items-center min-w-[100px]">
                <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Ganhos</p>
                <p className="text-xl font-bold text-green-700">R$ {driver.earnings.toFixed(2)}</p>
            </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex justify-between items-end mb-2">
            <div>
                <span className="text-sm font-bold text-gray-700">{driver.points} pts</span>
                <span className="text-xs text-gray-500 ml-1">(Total)</span>
            </div>
            <div className="text-xs text-gray-500">
                {getPointsToNextLevel(driver.points) > 0 
                 ? `Faltam ${getPointsToNextLevel(driver.points)} pts para ${nextLevelName(driver.points)}` 
                 : 'Nível Máximo Alcançado!'}
            </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-orange-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min((driver.points % 300) / 3, 100)}%` }}></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
            onClick={() => setActiveTab('work')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'work' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
            Minhas Entregas
        </button>
        <button 
            onClick={() => setActiveTab('ranking')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'ranking' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
            Ranking & Prêmios
        </button>
      </div>

      {activeTab === 'work' ? (
        <>
            {/* Active Order */}
            {currentOrder && (
                <div className="bg-orange-50 rounded-xl border border-orange-200 p-6 animate-pulse-slow">
                <h3 className="font-bold text-orange-800 mb-4 flex items-center gap-2">
                    <Clock size={20} />
                    Pedido em Andamento
                </h3>
                <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                    <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-lg">#{currentOrder.id.slice(-4)}</span>
                    <span className="text-green-600 font-bold">R$ {currentOrder.commission.driver.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600 mb-1">Cliente: {currentOrder.customerName}</p>
                    <p className="text-gray-500 text-sm mb-3">{currentOrder.items.length} itens • Total: R$ {currentOrder.total.toFixed(2)}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                    <MapPin size={16} />
                    <span>Distância: {currentOrder.distanceKm} km • Tempo Estimado: {currentOrder.estimatedDeliveryTime} min</span>
                    </div>
                </div>
                <Button 
                    onClick={() => onDeliverOrder(currentOrder.id)} 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                >
                    <CheckCircle className="mr-2" />
                    Confirmar Entrega
                </Button>
                </div>
            )}

            {/* Available Orders List */}
            {!currentOrder && (
                <div>
                <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                    <Package size={20} />
                    Pedidos Disponíveis em {driver.municipality}
                </h3>
                
                {localOrders.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center text-gray-500 border border-gray-100 border-dashed">
                    <p>Nenhum pedido aguardando entrega no momento.</p>
                    <p className="text-sm mt-2">Fique atento, novas entregas aparecem aqui.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                    {localOrders.map(order => (
                        <div key={order.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900">Pedido #{order.id.slice(-4)}</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                {new Date(order.createdAt).toLocaleTimeString()}
                            </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                            {order.items.map(i => i.name).join(', ').slice(0, 50)}...
                            </p>
                            <div className="flex items-center gap-4 text-sm mt-2">
                            <span className="text-green-600 font-bold flex items-center gap-1">
                                <DollarSign size={14} />
                                Ganho: R$ {order.commission.driver.toFixed(2)}
                            </span>
                            <span className="text-gray-400">|</span>
                            <span>{order.distanceKm} km (aprox. {order.estimatedDeliveryTime} min)</span>
                            </div>
                        </div>
                        <Button onClick={() => onAcceptOrder(order.id)}>
                            Aceitar Entrega
                        </Button>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            )}
        </>
      ) : (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center gap-3">
                    <div className="bg-orange-200 p-2 rounded-full text-orange-700"><Trophy size={20}/></div>
                    <div>
                        <p className="text-xs text-orange-800 uppercase font-bold">Prêmio Ouro</p>
                        <p className="text-sm">Bônus de R$ 50,00</p>
                    </div>
                </div>
                <div className="bg-cyan-50 border border-cyan-100 p-4 rounded-xl flex items-center gap-3">
                    <div className="bg-cyan-200 p-2 rounded-full text-cyan-700"><Crown size={20}/></div>
                    <div>
                        <p className="text-xs text-cyan-800 uppercase font-bold">Prêmio Platina</p>
                        <p className="text-sm">Kit Mercafácil VIP</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 font-bold text-gray-800">Top Entregadores (Geral)</div>
                <div className="divide-y divide-gray-100">
                    {sortedDrivers.map((d, index) => (
                        <div key={d.id} className={`p-4 flex items-center justify-between ${d.id === driver.id ? 'bg-orange-50' : ''}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                    index === 1 ? 'bg-gray-100 text-gray-700' :
                                    index === 2 ? 'bg-orange-100 text-orange-800' : 'text-gray-500'
                                }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <p className={`font-medium ${d.id === driver.id ? 'text-orange-700' : 'text-gray-900'}`}>
                                        {d.name} {d.id === driver.id && '(Você)'}
                                    </p>
                                    <p className="text-xs text-gray-500">{d.municipality} • {d.level}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-900">{d.points} pts</p>
                                <div className="text-xs text-gray-400 flex items-center justify-end gap-1">
                                    {getVehicleIcon(d.vehicleType, 12)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};