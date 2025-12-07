
import React, { useState } from 'react';
import { List, ShoppingCart, Plus, Sparkles, TrendingUp, ArrowRight, Store, Search, Trash2, Clock, CheckCircle, ShoppingBag } from 'lucide-react';
import { SmartList, CartItem, Product, StoreProfile } from '../types';
import { Button } from './Button';
import { MOCK_SMART_LISTS, STORES } from '../constants';

interface SmartListsProps {
  savedLists: SmartList[];
  onLoadList: (list: SmartList) => void;
  onSaveList: (name: string, items: CartItem[]) => void;
  onDeleteList: (id: string) => void;
  currentCart: CartItem[];
  onBack: () => void;
}

export const SmartLists: React.FC<SmartListsProps> = ({ 
  savedLists, 
  onLoadList, 
  onSaveList, 
  onDeleteList, 
  currentCart,
  onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'my_lists' | 'ai_suggestions'>('my_lists');
  const [selectedList, setSelectedList] = useState<SmartList | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');

  // Combine user lists with mock AI lists for the view
  const allLists = activeTab === 'my_lists' ? savedLists : MOCK_SMART_LISTS;

  const handleCreateList = () => {
    if (newListName.trim() && currentCart.length > 0) {
      onSaveList(newListName, currentCart);
      setNewListName('');
      setShowCreateModal(false);
      setActiveTab('my_lists');
    }
  };

  const calculateListTotal = (items: CartItem[]) => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  // Simulated Market Comparison
  const getCheapestMarket = (list: SmartList) => {
    const listTotal = calculateListTotal(list.items);
    
    // Simulate other markets having different prices (+/- 10%)
    const comparisons = STORES.map(store => {
      // Deterministic "random" based on store name length to keep it consistent for demo
      const variance = (store.name.length % 5) - 2; // -2% to +2% rough variance base
      const multiplier = 1 + (variance / 100); 
      const marketTotal = listTotal * multiplier;
      
      return {
        store,
        total: marketTotal,
        diff: marketTotal - listTotal
      };
    }).sort((a, b) => a.total - b.total);

    return comparisons;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <List className="text-orange-600" /> Minhas Listas Inteligentes
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Organize suas compras, compare preços e economize tempo.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>Voltar</Button>
          <Button 
            onClick={() => setShowCreateModal(true)} 
            disabled={currentCart.length === 0}
            className={currentCart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <Plus size={18} className="mr-2" /> Salvar Carrinho Atual
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: List Menu */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm h-fit">
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => { setActiveTab('my_lists'); setSelectedList(null); }}
              className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'my_lists' ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-500' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Minhas Listas
            </button>
            <button 
              onClick={() => { setActiveTab('ai_suggestions'); setSelectedList(null); }}
              className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'ai_suggestions' ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-500' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Sparkles size={14} className="inline mr-1" /> Sugestões IA
            </button>
          </div>

          <div className="p-2 space-y-2 max-h-[600px] overflow-y-auto">
            {allLists.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <ShoppingBag size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">Nenhuma lista encontrada.</p>
              </div>
            ) : (
              allLists.map(list => (
                <div 
                  key={list.id}
                  onClick={() => setSelectedList(list)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedList?.id === list.id ? 'bg-gray-50 border-orange-200 ring-1 ring-orange-200' : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900">{list.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{list.items.length} itens • R$ {calculateListTotal(list.items).toFixed(2)}</p>
                    </div>
                    {list.type === 'ai_suggestion' ? (
                      <Sparkles size={16} className="text-purple-500" />
                    ) : (
                      <Clock size={16} className="text-gray-400" />
                    )}
                  </div>
                  
                  {list.type === 'history' && list.timesPurchased > 2 && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 text-[10px] font-bold">
                      <TrendingUp size={10} /> Compra Recorrente
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Detail View */}
        <div className="lg:col-span-2 space-y-6">
          {selectedList ? (
            <>
              {/* List Details Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <ShoppingBag size={120} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-black text-gray-900">{selectedList.name}</h2>
                        {selectedList.type === 'ai_suggestion' && (
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                            <Sparkles size={12} /> Sugerido por IA
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm">Criada em {newListName || new Date().toLocaleDateString()}</p>
                    </div>
                    
                    {selectedList.type === 'manual' && (
                      <button 
                        onClick={() => {
                          if(window.confirm('Tem certeza que deseja excluir esta lista?')) {
                            onDeleteList(selectedList.id);
                            setSelectedList(null);
                          }
                        }}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                        title="Excluir Lista"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>

                  {/* Items Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {selectedList.items.map(item => (
                      <div key={item.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <img src={item.image} alt="" className="w-10 h-10 rounded object-cover bg-white" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.quantity}x R$ {item.price.toFixed(2)}</p>
                        </div>
                        <div className="font-bold text-sm text-gray-700">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Total Estimado</p>
                      <p className="text-2xl font-black text-gray-900">R$ {calculateListTotal(selectedList.items).toFixed(2)}</p>
                    </div>
                    <Button 
                      onClick={() => onLoadList(selectedList)}
                      className="bg-green-600 hover:bg-green-700 text-white px-8"
                    >
                      Comprar Tudo <ShoppingCart size={18} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Market Comparison Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Store size={20} /> Comparador de Preços
                </h3>
                
                <div className="space-y-3">
                  {getCheapestMarket(selectedList).map((comp, idx) => (
                    <div key={idx} className={`p-4 rounded-xl flex justify-between items-center ${idx === 0 ? 'bg-white border-2 border-green-400 shadow-md transform scale-[1.02]' : 'bg-white/50 border border-blue-100'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${idx === 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {idx + 1}º
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{comp.store.name}</p>
                          <p className="text-xs text-gray-500">{comp.store.location}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`font-black text-lg ${idx === 0 ? 'text-green-600' : 'text-gray-700'}`}>
                          R$ {comp.total.toFixed(2)}
                        </p>
                        {idx === 0 ? (
                          <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Melhor Preço
                          </span>
                        ) : (
                          <span className="text-xs text-red-500 font-medium">
                            + R$ {(comp.total - getCheapestMarket(selectedList)[0].total).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-blue-600 flex items-center justify-center gap-1">
                    <CheckCircle size={12} /> Economia de até R$ {(getCheapestMarket(selectedList)[2].total - getCheapestMarket(selectedList)[0].total).toFixed(2)} escolhendo o mercado certo.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-12 text-gray-400">
              <Search size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">Selecione uma lista ao lado</p>
              <p className="text-sm">Veja detalhes, compare preços e compre com 1 clique.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Salvar Nova Lista</h3>
            <p className="text-sm text-gray-500 mb-4">
              Os {currentCart.length} itens do seu carrinho atual serão salvos nesta lista.
            </p>
            
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome da Lista</label>
            <input 
              autoFocus
              type="text" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none mb-6"
              placeholder="Ex: Compras do Mês, Churrasco..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>Cancelar</Button>
              <Button className="flex-1" onClick={handleCreateList} disabled={!newListName.trim()}>Salvar</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
