import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function ProductForm() {
  const [markets, setMarkets] = useState([]);
  const [formData, setFormData] = useState({
    name: '', category: 'Alimentos', price: '', stock: '', marketId: '', promoPrice: '', promoUntil: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/markets').then(res => {
      setMarkets(res.data);
      if(res.data.length > 0) setFormData(f => ({ ...f, marketId: res.data[0].id }));
    });
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nome do produto é obrigatório.";
    if (!formData.marketId) newErrors.marketId = "Selecione um mercado.";
    
    const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock);

    if (!formData.price || isNaN(price) || price <= 0) newErrors.price = "Preço deve ser um valor positivo.";
    if (!formData.stock || isNaN(stock) || stock < 0) newErrors.stock = "Estoque não pode ser negativo.";

    if (formData.promoPrice) {
      const promo = parseFloat(formData.promoPrice);
      if (isNaN(promo) || promo <= 0) newErrors.promoPrice = "Preço promocional inválido.";
      else if (promo >= price) newErrors.promoPrice = "Preço promocional deve ser menor que o preço original.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await api.post('/products', formData);
      alert('Produto cadastrado!');
      navigate('/products');
    } catch (error) {
      alert('Erro ao cadastrar: ' + (error.response?.data?.error || 'Falha no servidor'));
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Cadastrar Produto</h2>
      
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          <p className="font-bold">Por favor, corrija os erros abaixo:</p>
          <ul className="list-disc list-inside">
            {Object.values(errors).map((err, idx) => <li key={idx}>{err}</li>)}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="block text-sm font-bold">Mercado *</label>
          <select 
            className={`w-full border p-2 rounded ${errors.marketId ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.marketId} 
            onChange={e => setFormData({...formData, marketId: e.target.value})}
          >
            {markets.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          {errors.marketId && <p className="text-red-500 text-xs mt-1">{errors.marketId}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold">Nome *</label>
                <input 
                  className={`w-full border p-2 rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
                <input 
                  type="number" step="0.01" 
                  className={`w-full border p-2 rounded ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: e.target.value})} 
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
                <label className="block text-sm font-bold">Estoque *</label>
                <input 
                  type="number" 
                  className={`w-full border p-2 rounded ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.stock} 
                  onChange={e => setFormData({...formData, stock: e.target.value})} 
                />
                {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
            </div>
        </div>

        <div className="p-4 bg-orange-50 border border-orange-100 rounded">
            <h3 className="font-bold text-orange-800 mb-2">Promoção (Opcional)</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm">Preço Promo</label>
                    <input 
                      type="number" step="0.01" 
                      className={`w-full border p-2 rounded ${errors.promoPrice ? 'border-red-500' : 'border-gray-300'}`}
                      value={formData.promoPrice} 
                      onChange={e => setFormData({...formData, promoPrice: e.target.value})} 
                    />
                    {errors.promoPrice && <p className="text-red-500 text-xs mt-1">{errors.promoPrice}</p>}
                </div>
                <div>
                    <label className="block text-sm">Válido Até</label>
                    <input type="date" className="w-full border p-2 rounded" value={formData.promoUntil} onChange={e => setFormData({...formData, promoUntil: e.target.value})} />
                </div>
            </div>
        </div>

        <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded w-full font-bold hover:bg-orange-700 transition-colors">
          Salvar Produto
        </button>
      </form>
    </div>
  );
}