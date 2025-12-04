import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function ProductForm() {
  const [markets, setMarkets] = useState([]);
  const [formData, setFormData] = useState({
    name: '', category: 'Alimentos', price: '', stock: '', marketId: '', promoPrice: '', promoUntil: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/markets').then(res => {
      setMarkets(res.data);
      if(res.data.length > 0) setFormData(f => ({ ...f, marketId: res.data[0].id }));
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return alert("Nome do produto é obrigatório.");
    if (!formData.marketId) return alert("Selecione um mercado.");
    
    const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock);

    if (isNaN(price) || price <= 0) return alert("Preço deve ser um valor positivo.");
    if (isNaN(stock) || stock < 0) return alert("Estoque não pode ser negativo.");

    if (formData.promoPrice) {
      const promo = parseFloat(formData.promoPrice);
      if (isNaN(promo) || promo <= 0) return alert("Preço promocional inválido.");
      if (promo >= price) return alert("Preço promocional deve ser menor que o preço original.");
    }

    try {
      await api.post('/products', formData);
      alert('Produto cadastrado!');
      navigate('/products');
    } catch (error) {
      alert('Erro ao cadastrar');
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Cadastrar Produto</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="block text-sm font-bold">Mercado *</label>
          <select 
            className="w-full border p-2 rounded" 
            value={formData.marketId} 
            onChange={e => setFormData({...formData, marketId: e.target.value})}
          >
            {markets.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold">Nome *</label>
                <input className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div>
                <label className="block text-sm font-bold">Categoria</label>
                <select className="w-full border p-2 rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option>Alimentos</option>
                    <option>Bebidas</option>
                    <option>Limpeza</option>
                    <option>Higiene</option>
                    <option>Hortifruti</option>
                    <option>Açougue</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold">Preço (R$) *</label>
                <input type="number" step="0.01" className="w-full border p-2 rounded" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
            </div>
            <div>
                <label className="block text-sm font-bold">Estoque *</label>
                <input type="number" className="w-full border p-2 rounded" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
            </div>
        </div>

        <div className="p-4 bg-orange-50 border border-orange-100 rounded">
            <h3 className="font-bold text-orange-800 mb-2">Promoção (Opcional)</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm">Preço Promo</label>
                    <input type="number" step="0.01" className="w-full border p-2 rounded" value={formData.promoPrice} onChange={e => setFormData({...formData, promoPrice: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm">Válido Até</label>
                    <input type="date" className="w-full border p-2 rounded" value={formData.promoUntil} onChange={e => setFormData({...formData, promoUntil: e.target.value})} />
                </div>
            </div>
        </div>

        <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded w-full font-bold">Salvar Produto</button>
      </form>
    </div>
  );
}