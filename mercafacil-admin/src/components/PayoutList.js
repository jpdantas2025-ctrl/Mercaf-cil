import React, { useEffect, useState } from 'react';
import { DollarSign } from 'lucide-react';
// import api from '../api';

export default function PayoutList() {
  // Mock data as backend endpoint for "All Payouts" isn't strictly defined in MVP
  const [payouts] = useState([
    { id: 1, driver: 'Carlos Motoboy', amountDriver: 5.50, amountMarket: 45.00, platformFee: 5.50, date: '2023-10-27', status: 'pending' },
    { id: 2, driver: 'Ana Entregas', amountDriver: 8.00, amountMarket: 72.00, platformFee: 8.00, date: '2023-10-27', status: 'paid' },
  ]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Financeiro & Repasses</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm">Total Mercados</h3>
            <p className="text-2xl font-bold">R$ 117.00</p>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm">Comissão Entregadores</h3>
            <p className="text-2xl font-bold">R$ 13.50</p>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-orange-500">
            <h3 className="text-gray-500 text-sm">Receita Plataforma</h3>
            <p className="text-2xl font-bold">R$ 13.50</p>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Entregador</th>
              <th className="p-4">Mercado (80%)</th>
              <th className="p-4">Motorista (10%)</th>
              <th className="p-4">Plataforma (10%)</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map(p => (
              <tr key={p.id} className="border-b">
                <td className="p-4">#{p.id}</td>
                <td className="p-4">{p.driver}</td>
                <td className="p-4">R$ {p.amountMarket.toFixed(2)}</td>
                <td className="p-4 text-blue-600 font-bold">R$ {p.amountDriver.toFixed(2)}</td>
                <td className="p-4 text-green-600 font-bold">R$ {p.platformFee.toFixed(2)}</td>
                <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${p.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {p.status}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}