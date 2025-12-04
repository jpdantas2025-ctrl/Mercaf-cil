import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { Plus, Trash, MapPin } from 'lucide-react';

export default function MarketList() {
  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    loadMarkets();
  }, []);

  const loadMarkets = async () => {
    try {
      const res = await api.get('/markets');
      setMarkets(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Excluir mercado?")) return;
    try {
      await api.delete(`/markets/${id}`);
      loadMarkets();
    } catch (error) {
      alert("Erro ao excluir");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mercados Parceiros</h2>
        <Link to="/markets/new" className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={18}/> Novo Mercado
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {markets.map(m => (
          <div key={m.id} className="bg-white p-4 rounded shadow border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">{m.name}</h3>
            <div className="flex items-center text-gray-500 mt-2">
              <MapPin size={16} className="mr-1"/>
              <span>{m.Municipality?.name}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{m.address}</p>
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => handleDelete(m.id)} 
                className="text-red-500 hover:bg-red-50 p-2 rounded"
              >
                <Trash size={18}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}