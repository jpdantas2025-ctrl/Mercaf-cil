import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function DriverForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [motorcyclePlate, setPlate] = useState('');
  const [vehicleType, setVehicleType] = useState('motorcycle');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return alert("Nome é obrigatório.");
    
    // Validate Phone (10 or 11 digits, numbers only)
    const phoneClean = phone.replace(/\D/g, '');
    if (phoneClean.length < 10 || phoneClean.length > 11) {
      return alert("Telefone inválido. Use formato com DDD (10 ou 11 dígitos).");
    }

    // Validate Plate (Old: AAA-1234 or Mercosul: AAA1A23)
    const plateRegex = /^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/i;
    const plateClean = motorcyclePlate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    if (!plateRegex.test(plateClean)) {
      return alert("Placa inválida. Formato esperado: ABC-1234 ou ABC1C34.");
    }

    try {
      await api.post('/drivers/register', { 
          name, 
          phone: phoneClean, 
          motorcyclePlate: plateClean,
          vehicleType
      });
      alert('Motorista cadastrado com sucesso!');
      navigate('/drivers');
    } catch (error) {
      alert('Erro ao cadastrar motorista. Verifique os dados.');
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Novo Motorista Parceiro</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Nome Completo *</label>
          <input 
            className="w-full border p-2 rounded" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Ex: João da Silva"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">Telefone (Login) *</label>
          <input 
            className="w-full border p-2 rounded" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            placeholder="Ex: 9599999999"
            required 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-gray-700 font-bold mb-2">Placa do Veículo *</label>
                <input 
                    className="w-full border p-2 rounded" 
                    value={motorcyclePlate} 
                    onChange={e => setPlate(e.target.value)} 
                    placeholder="Ex: NAX-1234"
                    required 
                />
            </div>
            <div>
                <label className="block text-gray-700 font-bold mb-2">Tipo de Veículo *</label>
                <select 
                    className="w-full border p-2 rounded"
                    value={vehicleType}
                    onChange={e => setVehicleType(e.target.value)}
                >
                    <option value="motorcycle">Motocicleta 🛵</option>
                    <option value="car">Carro 🚗</option>
                    <option value="bike">Bicicleta 🚲</option>
                    <option value="on_foot">A Pé 🚶</option>
                </select>
            </div>
        </div>

        <div className="pt-4">
            <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded font-bold w-full md:w-auto">
                Cadastrar Motorista
            </button>
        </div>
      </form>
    </div>
  );
}