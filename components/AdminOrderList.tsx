import React, { useState } from 'react';
import { Order } from '../types';
import { Search, Filter, CheckCircle, Clock, Truck, XCircle, MapPin } from 'lucide-react';

interface AdminOrderListProps {
  orders: Order[];
}

export const AdminOrderList: React.FC<AdminOrderListProps> = ({ orders }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = 
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.municipality.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Entregue</span>;
      case 'delivering': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Truck size={12}/> Em Rota</span>;
      case 'accepted': return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12}/> Aceito</span>;
      case 'pending': return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12}/> Pendente</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 text-lg">Histórico de Pedidos</h3>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Buscar cliente ou ID..." 
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="relative">
                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select 
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full appearance-none bg-white cursor-pointer"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">Todos os Status</option>
                    <option value="pending">Pendentes</option>
                    <option value="accepted">Aceitos</option>
                    <option value="delivering">Em Rota</option>
                    <option value="delivered">Entregues</option>
                </select>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">ID / Data</th>
                <th className="px-6 py-4">Cliente / Local</th>
                <th className="px-6 py-4">Itens</th>
                <th className="px-6 py-4">Valor Total</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                        Nenhum pedido encontrado com os filtros atuais.
                    </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">#{order.id.slice(-6)}</div>
                        <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin size={10} /> {order.municipality}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                        {order.items.length} itens
                        <div className="text-xs text-gray-400 truncate max-w-[150px]">
                            {order.items.map(i => i.name).join(', ')}
                        </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-orange-600">
                        R$ {order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                    </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};