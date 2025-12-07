
import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Clock, Info, CheckCircle, X, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { CashbackTransaction } from '../types';

interface CashbackPanelProps {
  balance: number;
  history: CashbackTransaction[];
  userType: 'client' | 'driver' | 'vendor';
  onClose: () => void;
  onUseBalance?: () => void;
}

export const CashbackPanel: React.FC<CashbackPanelProps> = ({ balance, history, userType, onClose, onUseBalance }) => {
  
  const rules = {
    client: [
      "5% de volta em todas as compras.",
      "10% em produtos selecionados.",
      "Válido por 60 dias."
    ],
    driver: [
      "R$ 1,00 extra por entrega após atingir 10/semana.",
      "Bônus de R$ 10,00 por meta batida.",
      "Use para taxas ou saque via Pix."
    ],
    vendor: [
      "2% de cashback sobre vendas acima de R$ 1.000.",
      "Use para comprar destaque e anúncios.",
      "Abatimento automático de comissão."
    ]
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 rounded-full p-1 transition-colors">
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-lg">
                <Wallet size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-bold">Carteira Cashback</h2>
          </div>

          <div className="mb-2">
            <span className="text-sm opacity-90">Saldo Disponível</span>
            <div className="text-4xl font-black tracking-tight">R$ {balance.toFixed(2)}</div>
          </div>
          
          <div className="flex gap-2 mt-4">
             <Button 
                onClick={onUseBalance}
                disabled={balance <= 0}
                className="bg-white text-green-700 hover:bg-green-50 border-none font-bold shadow-sm flex-1"
             >
                Usar Agora
             </Button>
             <button className="bg-green-800/50 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                Regras
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
            
            {/* Rules Section */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
                <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
                    <Info size={16} className="text-blue-500" /> Como ganhar mais?
                </h3>
                <ul className="space-y-2">
                    {rules[userType].map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                            <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
                            {rule}
                        </li>
                    ))}
                </ul>
            </div>

            {/* History Section */}
            <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2">
                <Clock size={16} className="text-gray-400" /> Histórico de Movimentações
            </h3>

            <div className="space-y-3">
                {history.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <Wallet size={48} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm">Nenhuma movimentação ainda.</p>
                    </div>
                ) : (
                    history.slice().reverse().map((tx) => (
                        <div key={tx.id} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {tx.type === 'credit' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-gray-900">{tx.description}</div>
                                    <div className="text-[10px] text-gray-500">{tx.date}</div>
                                </div>
                            </div>
                            <div className={`font-bold text-sm ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                {tx.type === 'credit' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
