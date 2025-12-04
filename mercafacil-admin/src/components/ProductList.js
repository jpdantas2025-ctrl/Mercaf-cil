import React, { useEffect, useState } from 'react';
import api from '../api';
import { Trash, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductList() {
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/markets').then(res => {
      setMarkets(res.data);
      if(res.data.length > 0) setSelectedMarket(res.data[0].id);
    });
  }, []);

  useEffect(() => {
    if(selectedMarket) {
      loadProducts(selectedMarket);
    }
  }, [selectedMarket]);

  const loadProducts = async (id) => {
    const res = await api.get(`/products/market/${id}`);
    setProducts(res.data);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Excluir produto?")) return;
    await api.delete(`/products/${id}`);
    loadProducts(selectedMarket);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestão de Produtos</h2>
        <Link to="/products/new" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={18} /> Adicionar Produto
        </Link>
      </div>

      <div className="mb-6">
        <label className="font-bold mr-2">Selecione o Mercado:</label>
        <select 
          className="border p-2 rounded" 
          value={selectedMarket} 
          onChange={e => setSelectedMarket(e.target.value)}
        >
          {markets.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">Nome</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Preço</th>
              <th className="p-4">Estoque</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{p.name}</td>
                <td className="p-4">{p.category}</td>
                <td className="p-4">
                   R$ {p.price.toFixed(2)} 
                   {p.promoPrice && <span className="text-red-500 text-xs ml-2">(Promo R$ {p.promoPrice})</span>}
                </td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(p.id)} className="text-red-500"><Trash size={18}/></button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">Nenhum produto neste mercado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}