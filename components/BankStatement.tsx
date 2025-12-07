
import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, Clock, Download, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import axios from 'axios';

// Interfaces for Banking Data
interface Movement {
  id: string;
  type: 'cashback' | 'purchase' | 'payout' | 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  direction: 'in' | 'out';
  createdAt: string;
}

interface BankData {
  balance: number;
  movements: Movement[];
}

interface BankStatementProps {
  userToken?: string; // Optional if using context, but passed for flexibility
  onClose: () => void;
}

export const BankStatement: React.FC<BankStatementProps> = ({ userToken, onClose }) => {
  const [data, setData] = useState<BankData | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demo purposes if backend isn't reachable immediately
  const mockData: BankData = {
    balance: 1250.50,
    movements: [
      { id: '1', type: 'payout', amount: 15.00, description: 'Corrida #12345', direction: 'in', createdAt: new Date().toISOString() },
      { id: '2', type: 'payout', amount: 22.50, description: 'Corrida #12346', direction: 'in', createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: '3', type: 'withdrawal', amount: 100.00, description: 'Saque Pix', direction: 'out', createdAt: new Date(Date.now() - 86400000).toISOString() },
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userToken) {
          setData(mockData); // Use mock if no token
          setLoading(false);
          return;
      }
      try {
        const res = await axios.get('http://localhost:3000/api/banking/balance', {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch bank data, using mock", error);
        setData(mockData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userToken]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gray-900 p-6 text-white">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Mercafácil Bank</h2>
                    <p className="text-xs text-gray-500">Sistema Financeiro Integrado</p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white p-1">✕</button>
            </div>
            
            <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                    <Wallet size={24} />
                </div>
                <div>
                    <p className="text-xs text-gray-400">Saldo Disponível</p>
                    <h1 className="text-3xl font-bold">R$ {data?.balance.toFixed(2)}</h1>
                </div>
            </div>
            
            <div className="flex gap-2 mt-4">
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white border-none py-2 text-sm">
                    <ArrowUpRight size={16} className="mr-2" /> Sacar Pix
                </Button>
                <Button variant="outline" className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white py-2 text-sm">
                    <Download size={16} className="mr-2" /> Extrato
                </Button>
            </div>
        </div>

        {/* Transactions List */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 text-sm">Histórico de Transações</h3>
                <button onClick={() => setLoading(true)} className="text-gray-400 hover:text-gray-600">
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="space-y-3">
                {data?.movements.length === 0 ? (
                    <p className="text-center text-gray-400 py-8 text-sm">Nenhuma movimentação recente.</p>
                ) : (
                    data?.movements.map((mov) => (
                        <div key={mov.id} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${mov.direction === 'in' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {mov.direction === 'in' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900">{mov.description}</p>
                                    <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                        <Clock size={10} /> {new Date(mov.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className={`font-bold text-sm ${mov.direction === 'in' ? 'text-green-600' : 'text-gray-900'}`}>
                                {mov.direction === 'in' ? '+' : '-'} R$ {mov.amount.toFixed(2)}
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
