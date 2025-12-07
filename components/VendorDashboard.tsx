
import React, { useState } from 'react';
import { LayoutDashboard, ShoppingBag, Wand2, Medal, TrendingUp, Star, AlertCircle, CheckCircle, Info, ChevronRight, Zap, Users, Megaphone, Mail, Send } from 'lucide-react';
import { Vendor } from '../types';
import { VendorTools } from './VendorTools';
import { RealtimeInventory } from './RealtimeInventory';
import { Button } from './Button';

interface VendorDashboardProps {
  vendor: Vendor;
  onReferralClick?: () => void;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({ vendor, onReferralClick }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'studio' | 'marketing'>('overview');

  const getLevelColor = (level: string) => {
      switch(level) {
          case 'Bronze': return 'from-orange-700 to-orange-900';
          case 'Prata': return 'from-gray-400 to-gray-600';
          case 'Ouro': return 'from-yellow-500 to-yellow-700';
          case 'Platina': return 'from-emerald-500 to-teal-700';
          default: return 'from-gray-500 to-gray-700';
      }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Dashboard Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{vendor.name}</h1>
                <p className="text-gray-500 flex items-center gap-2">
                    CNPJ: {vendor.cnpj} • <span className="text-green-600 font-medium flex items-center gap-1"><CheckCircle size={14}/> Loja Verificada</span>
                </p>
            </div>
            
            <div className="flex gap-4">
                {/* Referral Promo */}
                <div 
                    onClick={onReferralClick}
                    className="p-4 rounded-xl bg-purple-600 text-white cursor-pointer hover:bg-purple-700 transition-colors shadow-lg flex flex-col justify-center min-w-[150px]"
                >
                    <div className="flex items-center gap-2 mb-1">
                        <Users size={16} />
                        <span className="text-xs font-bold uppercase">Indique e Ganhe</span>
                    </div>
                    <div className="font-black text-lg">R$ 50,00</div>
                    <div className="text-[10px] opacity-80">Crédito de Anúncio</div>
                </div>

                {/* Level Card */}
                <div className={`p-4 rounded-xl text-white bg-gradient-to-r ${getLevelColor(vendor.profile.level)} shadow-lg min-w-[200px]`}>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold uppercase opacity-80">Nível Atual</span>
                        <Medal size={20} className="text-white" />
                    </div>
                    <div className="text-2xl font-black tracking-widest">{vendor.profile.level}</div>
                    <div className="mt-2 text-xs flex justify-between">
                        <span>{vendor.profile.points} pts</span>
                        <span>Meta: {vendor.profile.level === 'Platina' ? 'MAX' : vendor.profile.points + 500}</span>
                    </div>
                    <div className="w-full bg-black/20 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-white h-full" style={{width: '60%'}}></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mt-8 border-b border-gray-100 pb-1 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-t-lg font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === 'overview' ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-500' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <LayoutDashboard size={18} /> Visão Geral
            </button>
            <button 
                onClick={() => setActiveTab('catalog')}
                className={`px-4 py-2 rounded-t-lg font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === 'catalog' ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-500' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <ShoppingBag size={18} /> Catálogo & Estoque
            </button>
            <button 
                onClick={() => setActiveTab('studio')}
                className={`px-4 py-2 rounded-t-lg font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === 'studio' ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-500' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <Wand2 size={18} /> Estúdio IA
            </button>
            <button 
                onClick={() => setActiveTab('marketing')}
                className={`px-4 py-2 rounded-t-lg font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === 'marketing' ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-500' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <Megaphone size={18} /> Marketing
            </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      
      {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between mb-2">
                          <span className="text-gray-500 text-sm">Vendas Hoje</span>
                          <TrendingUp size={20} className="text-green-500" />
                      </div>
                      <div className="text-2xl font-bold">R$ 1.240,50</div>
                      <div className="text-xs text-green-600 mt-1">+12% vs ontem</div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between mb-2">
                          <span className="text-gray-500 text-sm">Pedidos Mês</span>
                          <ShoppingBag size={20} className="text-blue-500" />
                      </div>
                      <div className="text-2xl font-bold">{vendor.profile.ordersMonth}</div>
                      <div className="text-xs text-gray-400 mt-1">Meta para Prata: 50</div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between mb-2">
                          <span className="text-gray-500 text-sm">Avaliação</span>
                          <Star size={20} className="text-yellow-500 fill-yellow-500" />
                      </div>
                      <div className="text-2xl font-bold">{vendor.profile.rating.toFixed(1)}</div>
                      <div className="text-xs text-gray-400 mt-1">Excelente!</div>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between mb-2">
                          <span className="text-gray-500 text-sm">Engajamento</span>
                          <Zap size={20} className="text-purple-500" />
                      </div>
                      <div className="text-2xl font-bold">{vendor.profile.engagementScore}</div>
                      <div className="text-xs text-purple-600 mt-1">Nível Alto</div>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Gamification Missions */}
                  <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Medal className="text-orange-500" /> Missões & Benefícios
                      </h3>
                      <div className="space-y-4">
                          <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                              <div className="flex items-center gap-3">
                                  <div className="bg-blue-100 p-2 rounded-full text-blue-600"><ShoppingBag size={18}/></div>
                                  <div>
                                      <h4 className="font-bold text-sm">Atualizar Catálogo Semanal</h4>
                                      <p className="text-xs text-gray-500">Ganhe destaque gratuito por 7 dias</p>
                                  </div>
                              </div>
                              <Button size="sm" variant="outline">Atualizar</Button>
                          </div>
                          
                          <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
                              <div className="flex items-center gap-3">
                                  <div className="bg-green-100 p-2 rounded-full text-green-600"><Star size={18}/></div>
                                  <div>
                                      <h4 className="font-bold text-sm">Manter Nota 4.8+</h4>
                                      <p className="text-xs text-gray-500">Selo "Mercado 5 Estrelas" ativo</p>
                                  </div>
                              </div>
                              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">ATIVO</span>
                          </div>

                          <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer opacity-70">
                              <div className="flex items-center gap-3">
                                  <div className="bg-gray-100 p-2 rounded-full text-gray-500"><TrendingUp size={18}/></div>
                                  <div>
                                      <h4 className="font-bold text-sm">Atingir 50 Pedidos/mês</h4>
                                      <p className="text-xs text-gray-500">Desbloqueia Plano Profissional</p>
                                  </div>
                              </div>
                              <div className="text-xs font-bold text-gray-400">12/50</div>
                          </div>
                      </div>
                  </div>

                  {/* Smart Notifications */}
                  <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                      <h3 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
                          <AlertCircle size={20} /> Avisos Importantes
                      </h3>
                      <div className="space-y-3">
                          <div className="bg-white p-3 rounded-lg shadow-sm border border-orange-100 text-sm">
                              <p className="text-gray-800 font-medium mb-1">Catálogo Desatualizado</p>
                              <p className="text-gray-600 text-xs">Seus produtos não são atualizados há 5 dias. Atualize para ganhar visibilidade.</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg shadow-sm border border-orange-100 text-sm">
                              <p className="text-gray-800 font-medium mb-1">Subiu de Nível!</p>
                              <p className="text-gray-600 text-xs">Parabéns! Você está a 5 vendas do nível Prata.</p>
                          </div>
                          <Button className="w-full mt-2" size="sm">Ver Todas</Button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'catalog' && (
          <div className="animate-in fade-in">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 flex items-start gap-3">
                  <Info className="text-blue-600 shrink-0 mt-1" size={20} />
                  <div>
                      <h4 className="font-bold text-blue-900">Gerenciamento em Tempo Real</h4>
                      <p className="text-sm text-blue-700">Qualquer alteração de preço ou estoque feita abaixo é refletida instantaneamente no aplicativo dos clientes.</p>
                  </div>
              </div>
              <RealtimeInventory />
          </div>
      )}

      {activeTab === 'studio' && (
          <div className="animate-in fade-in">
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mb-6 flex items-start gap-3">
                  <Wand2 className="text-purple-600 shrink-0 mt-1" size={20} />
                  <div>
                      <h4 className="font-bold text-purple-900">Estúdio de Criação IA</h4>
                      <p className="text-sm text-purple-700">Tire uma foto do produto e nossa IA cria a descrição, categoriza e sugere o preço ideal para vender mais rápido. Use também o gerador de vídeo.</p>
                  </div>
              </div>
              <VendorTools />
          </div>
      )}

      {activeTab === 'marketing' && (
          <div className="animate-in fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Mail className="text-blue-600" /> Nova Campanha
                  </h3>
                  <div className="space-y-4">
                      <div>
                          <label className="text-sm font-medium text-gray-700">Título da Campanha</label>
                          <input className="w-full border rounded p-2" placeholder="Ex: Ofertas de Fim de Semana" />
                      </div>
                      <div>
                          <label className="text-sm font-medium text-gray-700">Público Alvo</label>
                          <select className="w-full border rounded p-2 bg-white">
                              <option>Todos os Clientes</option>
                              <option>Clientes que não compram há 30 dias</option>
                              <option>Clientes VIP (Ouro+)</option>
                          </select>
                      </div>
                      <div>
                          <label className="text-sm font-medium text-gray-700">Mensagem (Email/Notificação)</label>
                          <textarea className="w-full border rounded p-2 h-24" placeholder="Escreva sua mensagem promocional..." />
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          <Send size={16} className="mr-2" /> Enviar Campanha
                      </Button>
                  </div>
              </div>

              <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                      <h4 className="font-bold text-green-900 mb-1">Dica de Marketing</h4>
                      <p className="text-sm text-green-700">Campanhas enviadas nas sextas-feiras às 17h têm 40% mais conversão.</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                      <h3 className="font-bold text-lg mb-4">Histórico de Campanhas</h3>
                      <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                              <div>
                                  <div className="font-medium">Ofertas Relâmpago</div>
                                  <div className="text-xs text-gray-500">Enviado em 25/10</div>
                              </div>
                              <div className="text-right">
                                  <div className="font-bold text-green-600">15% Conv.</div>
                                  <div className="text-xs text-gray-500">300 cliques</div>
                              </div>
                          </div>
                          <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                              <div>
                                  <div className="font-medium">Saldão de Estoque</div>
                                  <div className="text-xs text-gray-500">Enviado em 20/10</div>
                              </div>
                              <div className="text-right">
                                  <div className="font-bold text-green-600">8% Conv.</div>
                                  <div className="text-xs text-gray-500">120 cliques</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};
