import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

// Hardcoded for demo, ideally fetched from API
const MUNICIPALITIES = [
  { id: 1, name: "Boa Vista" },
  { id: 2, name: "Pacaraima" },
  { id: 3, name: "Bonfim" },
  { id: 12, name: "Rorainópolis" }
];

export default function MarketForm() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [municipalityId, setMunicipalityId] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validação de Nome
    if (!name.trim()) {
      setError("O nome do estabelecimento é obrigatório.");
      return;
    }
    
    // Validação de Endereço
    if (!address.trim()) {
      setError("O endereço é obrigatório.");
      return;
    }

    try {
      await api.post('/markets', { name, address, municipalityId });
      alert('Mercado criado!');
      navigate('/markets');
    } catch (error) {
      setError('Erro ao criar mercado. Tente novamente.');
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Novo Mercado</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div>
          <label className="block text-gray-700 font-bold mb-2">Nome do Estabelecimento *</label>
          <input 
            className={`w-full border p-2 rounded ${error && !name.trim() ? 'border-red-500' : 'border-gray-300'}`}
            value={name} 
            onChange={e => {
                setName(e.target.value);
                if (error) setError(''); // Limpa erro ao digitar
            }} 
            placeholder="Ex: Supermercado Central"
          />
          {error && !name.trim() && <p className="text-red-500 text-xs mt-1">O nome é obrigatório.</p>}
        </div>
        
        <div>
          <label className="block text-gray-700 font-bold mb-2">Endereço Completo *</label>
          <input 
            className={`w-full border p-2 rounded ${error && !address.trim() ? 'border-red-500' : 'border-gray-300'}`}
            value={address} 
            onChange={e => {
                setAddress(e.target.value);
                if (error) setError('');
            }} 
            placeholder="Rua, Número, Bairro"
          />
          {error && !address.trim() && <p className="text-red-500 text-xs mt-1">O endereço é obrigatório.</p>}
        </div>
        
        <div>
          <label className="block text-gray-700 font-bold mb-2">Município</label>
          <select className="w-full border p-2 rounded" value={municipalityId} onChange={e => setMunicipalityId(e.target.value)}>
            {MUNICIPALITIES.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        
        <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors">
            Salvar Mercado
        </button>
      </form>
    </div>
  );
}