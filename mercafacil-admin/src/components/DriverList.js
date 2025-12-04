import React, { useEffect, useState } from 'react';
import api from '../api';
import { Bike, Car, Footprints, Plus, Ban, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DriverList() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = () => {
    // Chama rota de admin para ver todos
    api.get('/drivers').then(res => setDrivers(res.data)).catch(err => console.error(err));
  };

  const handleStatusChange = async (id, status) => {
      const action = status === 'available' ? 'Aprovar/Desbloquear' : 'Bloquear';
      if(!window.confirm(`Deseja ${action} este motorista?`)) return;
      try {
          await api.put(`/drivers/${id}/status`, { status });
          loadDrivers();
      } catch (error) {
          alert("Erro ao mudar status");
      }
  };

  const getVehicleIcon = (type) => {
      switch(type) {
          case 'car': return <Car size={16} />;
          case 'bike': return <Bike size={16} />;
          case 'walking': 
          case 'on_foot': return <Footprints size={16} />;
          default: return <Bike size={16} />;
      }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestão de Motoristas</h2>
        <Link to="/drivers/new" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Plus size={18}/> Novo Motorista
        </Link>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">Nome</th>
              <th className="p-4">Veículo</th>
              <th className="p-4">Telefone</th>
              <th className="p-4">Placa</th>
              <th className="p-4">Nível / Pontos</th>
              <th className="p-4">Status</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
                <tr>
                    <td colSpan="7" className="p-6 text-center text-gray-500">Nenhum motorista encontrado.</td>
                </tr>
            ) : (
                drivers.map(d => (
                <tr key={d.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{d.name || 'Sem nome'}</td>
                    <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-600 capitalize">
                            {getVehicleIcon(d.vehicleType)}
                            <span className="text-sm">{d.vehicleType === 'on_foot' ? 'A pé' : d.vehicleType}</span>
                        </div>
                    </td>
                    <td className="p-4">{d.phone}</td>
                    <td className="p-4 font-mono bg-gray-50 px-2 rounded w-fit text-sm">{d.motorcyclePlate}</td>
                    <td className="p-4">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold">{d.level}</span>
                            <span className="text-xs text-gray-500">{d.points} pts</span>
                        </div>
                    </td>
                    <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${
                            d.status === 'available' ? 'bg-green-100 text-green-800' : 
                            d.status === 'blocked' ? 'bg-red-100 text-red-800' : 
                            d.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                            {d.status === 'pending' ? 'Pendente' : d.status}
                        </span>
                    </td>
                    <td className="p-4 flex gap-2">
                        {d.status === 'blocked' ? (
                            <button onClick={() => handleStatusChange(d.id, 'available')} className="text-green-600 hover:bg-green-50 p-1 rounded" title="Desbloquear">
                                <Check size={18} />
                            </button>
                        ) : d.status === 'pending' ? (
                            <button onClick={() => handleStatusChange(d.id, 'available')} className="text-blue-600 hover:bg-blue-50 p-1 rounded" title="Aprovar Cadastro">
                                <Check size={18} />
                            </button>
                        ) : (
                            <button onClick={() => handleStatusChange(d.id, 'blocked')} className="text-red-600 hover:bg-red-50 p-1 rounded" title="Bloquear">
                                <Ban size={18} />
                            </button>
                        )}
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}