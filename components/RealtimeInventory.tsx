
import React, { useEffect, useState } from 'react';
import { supabase, getRealtimeProducts, updateProductStock, updateProductPrice, subscribeToProducts, DBProduct } from '../services/supabase';
import { Package, TrendingUp, DollarSign, RefreshCw, AlertTriangle, WifiOff } from 'lucide-react';
import { Button } from './Button';

export const RealtimeInventory: React.FC = () => {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    let subscription: any;

    const init = async () => {
      setLoading(true);
      const data = await getRealtimeProducts();
      
      if (data === null) {
         // Fallback to mock data if DB fails or table missing
         setIsDemoMode(true);
         setProducts([
          { id: '1', name: 'Arroz Branco 5kg', price: 25.90, stock: 100, category: 'Alimentos' },
          { id: '2', name: 'Feijão Carioca 1kg', price: 8.50, stock: 50, category: 'Alimentos' },
          { id: '3', name: 'Detergente Ipê', price: 2.99, stock: 200, category: 'Limpeza' },
          { id: '4', name: 'Café Regional', price: 18.00, stock: 30, category: 'Bebidas' },
         ]);
         // Do NOT subscribe if we are in demo mode (avoids schema error)
      } else {
         setIsDemoMode(false);
         setProducts(data);
         
         // Only subscribe if we successfully connected to the DB
         subscription = subscribeToProducts((payload) => {
            console.log('Realtime change received!', payload);
            setLastUpdate(new Date());
            
            if (payload.eventType === 'UPDATE') {
              setProducts((prev) => 
                prev.map((p) => p.id === payload.new.id ? { ...p, ...payload.new } : p)
              );
            } else if (payload.eventType === 'INSERT') {
              setProducts((prev) => [payload.new, ...prev]);
            } else if (payload.eventType === 'DELETE') {
              setProducts((prev) => prev.filter((p) => p.id !== payload.old.id));
            }
         });
      }
      setLoading(false);
    };

    init();

    return () => {
      // Safety check: ensure supabase exists before trying to access removeChannel
      if (subscription && supabase) supabase.removeChannel(subscription);
    };
  }, []);

  const handleStockChange = (id: string, current: number, change: number) => {
    const newVal = Math.max(0, current + change);
    if (!isDemoMode) {
        updateProductStock(id, newVal);
    }
    // Optimistic update
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newVal } : p));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
        <div>
          <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
            <RefreshCw className="animate-spin-slow text-indigo-600" size={20} />
            Estoque em Tempo Real
          </h2>
          <p className="text-sm text-indigo-700">
            Alterações aqui refletem instantaneamente no app do cliente.
          </p>
        </div>
        <div className="text-xs text-indigo-400 text-right">
            <div>Última atualização: {lastUpdate.toLocaleTimeString()}</div>
            {isDemoMode && <div className="text-yellow-600 font-bold flex items-center justify-end gap-1"><WifiOff size={10}/> Modo Demo</div>}
        </div>
      </div>

      <div className="p-0">
        {products.length === 0 && !loading && !isDemoMode ? (
            <div className="p-8 text-center text-gray-500">
                <AlertTriangle className="mx-auto mb-2 text-yellow-500" />
                <p>Nenhum produto encontrado no Banco de Dados Realtime.</p>
                <p className="text-xs mt-2">Certifique-se de ter rodado o script SQL no Supabase.</p>
            </div>
        ) : (
            <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Preço (R$)</th>
                <th className="px-6 py-4">Estoque (Un)</th>
                <th className="px-6 py-4 text-right">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                        {product.name}
                        <div className="text-xs text-gray-400 font-normal">{product.category}</div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <DollarSign size={14} className="text-gray-400"/>
                            <input 
                                type="number" 
                                className="w-20 border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={product.price}
                                onBlur={(e) => {
                                    if(!isDemoMode) updateProductPrice(product.id, parseFloat(e.target.value))
                                }}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, price: val } : p));
                                }}
                            />
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => handleStockChange(product.id, product.stock, -1)}
                                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors"
                            >-</button>
                            <span className={`font-mono font-bold w-8 text-center ${product.stock < 10 ? 'text-red-500' : 'text-gray-700'}`}>
                                {product.stock}
                            </span>
                            <button 
                                onClick={() => handleStockChange(product.id, product.stock, 1)}
                                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-green-100 hover:text-green-600 flex items-center justify-center transition-colors"
                            >+</button>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                        {product.stock > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                <TrendingUp size={12} /> Ativo
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                <Package size={12} /> Esgotado
                            </span>
                        )}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
      </div>
    </div>
  );
};
