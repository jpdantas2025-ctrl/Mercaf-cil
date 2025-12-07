
import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Target, ArrowUpRight, PieChart, Users, Truck, Store, Calculator, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from './Button';

export const FinancialDashboard: React.FC = () => {
  // State for Goal Management
  const [annualGoal, setAnnualGoal] = useState(1000000); // R$ 1 Million
  const [currentRevenue, setCurrentRevenue] = useState(245800.50);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(String(annualGoal));

  // State for Simulator
  const [simOrderValue, setSimOrderValue] = useState(100);
  const [simDeliveryFee, setSimDeliveryFee] = useState(10);
  const [vendorCommissionRate, setVendorCommissionRate] = useState(8); // 8%
  const [driverCommissionRate, setDriverCommissionRate] = useState(10); // 10%

  const progress = (currentRevenue / annualGoal) * 100;

  // Mock Revenue Streams
  const streams = [
    {
      source: 'Logistas (B2B)',
      amount: 145000,
      icon: <Store className="text-purple-600" />,
      color: 'bg-purple-100',
      items: ['Comissão de Vendas (8%)', 'Taxa de Ativação', 'Planos de Destaque']
    },
    {
      source: 'Clientes (B2C)',
      amount: 65800,
      icon: <Users className="text-blue-600" />,
      color: 'bg-blue-100',
      items: ['Taxa de Serviço', 'Anúncios Patrocinados', 'Assinatura Prime']
    },
    {
      source: 'Entregadores',
      amount: 35000,
      icon: <Truck className="text-green-600" />,
      color: 'bg-green-100',
      items: ['Taxa de Plataforma (10%)', 'Boosts de Prioridade', 'Taxa de Cadastro']
    }
  ];

  const handleSaveGoal = () => {
    const val = parseFloat(tempGoal);
    if (!isNaN(val) && val > 0) {
      setAnnualGoal(val);
      setIsEditingGoal(false);
    }
  };

  // Logic Simulator Calculation
  const simVendorPay = simOrderValue - (simOrderValue * (vendorCommissionRate / 100));
  const simDriverPay = simDeliveryFee - (simDeliveryFee * (driverCommissionRate / 100));
  const simPlatformRevenue = (simOrderValue * (vendorCommissionRate / 100)) + (simDeliveryFee * (driverCommissionRate / 100));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Goal Section */}
      <div className="bg-gray-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Target size={200} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="w-full md:w-2/3">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Meta Anual de Lucro</h2>
            
            {isEditingGoal ? (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold">R$</span>
                <input 
                  type="number" 
                  value={tempGoal} 
                  onChange={(e) => setTempGoal(e.target.value)}
                  className="bg-gray-800 text-white text-4xl font-black border-b-2 border-orange-500 focus:outline-none w-64"
                  autoFocus
                />
                <Button size="sm" onClick={handleSaveGoal}>Salvar</Button>
              </div>
            ) : (
              <div className="flex items-center gap-4 mb-2 cursor-pointer group" onClick={() => setIsEditingGoal(true)}>
                <h1 className="text-5xl font-black text-white">R$ {annualGoal.toLocaleString()}</h1>
                <div className="bg-gray-800 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs">Editar Meta</span>
                </div>
              </div>
            )}

            <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden mt-4">
              <div 
                className="bg-gradient-to-r from-orange-500 to-yellow-400 h-full transition-all duration-1000 relative" 
                style={{width: `${progress}%`}}
              >
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <span>Atual: R$ {currentRevenue.toLocaleString()} ({progress.toFixed(1)}%)</span>
              <span>Falta: R$ {(annualGoal - currentRevenue).toLocaleString()}</span>
            </div>
          </div>

          <div className="text-right">
             <div className="bg-green-500/20 border border-green-500/30 p-4 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 text-green-400 font-bold mb-1">
                   <ArrowUpRight /> +18%
                </div>
                <p className="text-xs text-green-100">Crescimento vs. Mês Anterior</p>
             </div>
          </div>
        </div>
      </div>

      {/* Revenue Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {streams.map((stream, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stream.color}`}>
                {stream.icon}
              </div>
              <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {((stream.amount / currentRevenue) * 100).toFixed(0)}% do Total
              </span>
            </div>
            <h3 className="text-gray-500 font-medium text-sm">{stream.source}</h3>
            <p className="text-2xl font-bold text-gray-900 mb-4">R$ {stream.amount.toLocaleString()}</p>
            <div className="space-y-2">
              {stream.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Unit Economics Simulator */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <Calculator className="text-orange-600" />
            <h3 className="font-bold text-lg text-gray-800">Simulador de Ganhos por Pedido</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Valor do Pedido (R$)</label>
              <input 
                type="number" 
                value={simOrderValue} 
                onChange={(e) => setSimOrderValue(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Taxa Entrega (R$)</label>
              <input 
                type="number" 
                value={simDeliveryFee} 
                onChange={(e) => setSimDeliveryFee(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
            <div className="flex justify-between items-center text-sm">
              <span className="text-purple-700 font-medium">Logista Recebe (92%)</span>
              <span className="font-bold">R$ {simVendorPay.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-green-700 font-medium">Entregador Recebe (90% da taxa)</span>
              <span className="font-bold">R$ {simDriverPay.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex justify-between items-center">
              <span className="text-orange-600 font-bold flex items-center gap-2">
                <img src="/favicon.ico" className="w-4 h-4 rounded-full bg-orange-100" alt="" />
                Lucro Mercafácil
              </span>
              <span className="text-xl font-black text-orange-600">R$ {simPlatformRevenue.toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-gray-400 text-right mt-1">
              (8% sobre produto + 10% sobre entrega)
            </p>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="text-indigo-600 fill-indigo-200" />
            <h3 className="font-bold text-lg text-indigo-900">Estratégias Recomendadas (IA)</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-400">
              <h4 className="font-bold text-gray-800 text-sm flex justify-between">
                Aumentar Base de Logistas
                <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Prioridade Alta</span>
              </h4>
              <p className="text-xs text-gray-600 mt-1 mb-2">
                A meta anual depende de mais 20 mercados ativos. Sua taxa de conversão está baixa.
              </p>
              <Button size="sm" variant="outline" className="w-full justify-between text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                Ativar: "30 dias sem comissão" <CheckCircle size={14}/>
              </Button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-400">
              <h4 className="font-bold text-gray-800 text-sm flex justify-between">
                Retenção de Entregadores
                <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Oportunidade</span>
              </h4>
              <p className="text-xs text-gray-600 mt-1 mb-2">
                Chuva prevista para o fim de semana. Risco de falta de entregadores.
              </p>
              <Button size="sm" variant="outline" className="w-full justify-between text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                Criar Campanha: "Boost +R$2/km" <CheckCircle size={14}/>
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
