
import React, { useState } from 'react';
import { Store, User, FileText, MapPin, CheckCircle, ChevronRight, X, Phone, Mail, Clock, Truck } from 'lucide-react';
import { Button } from './Button';
import { MUNICIPALITIES } from '../constants';
import { Vendor, VendorLevel } from '../types';

interface VendorRegisterProps {
  onClose: () => void;
  onRegister: (vendor: Vendor) => void;
}

export const VendorRegister: React.FC<VendorRegisterProps> = ({ onClose, onRegister }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    cnpj: '',
    cpf: '',
    email: '',
    phone: '',
    address: '',
    municipality: 'Boa Vista',
    hours: '',
    deliveryType: 'platform', // platform, own, hybrid
    contractAccepted: false
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = () => {
    const newVendor: Vendor = {
        id: `v${Date.now()}`,
        name: formData.name,
        ownerName: formData.ownerName,
        cnpj: formData.cnpj,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        municipality: formData.municipality as any,
        deliveryType: formData.deliveryType as any,
        profile: {
            level: 'Bronze',
            points: 0,
            ordersMonth: 0,
            rating: 5.0, // New vendors start high
            engagementScore: 100,
            activeBenefits: ['Acesso ao Painel Básico']
        }
    };
    onRegister(newVendor);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-700 to-orange-500 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
            <X size={24} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Store size={32} className="text-white" />
            <h2 className="text-2xl font-bold">Parceiro Mercafácil</h2>
          </div>
          <p className="text-orange-100 text-sm">Cadastre seu supermercado e comece a vender em Roraima.</p>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6 px-2">
             {[1, 2, 3, 4].map(s => (
                 <div key={s} className="flex flex-col items-center gap-2 relative z-10">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-white text-orange-600' : 'bg-orange-800 text-orange-400'}`}>
                         {step > s ? <CheckCircle size={16} /> : s}
                     </div>
                     <span className={`text-[10px] font-medium ${step >= s ? 'text-white' : 'text-orange-300'}`}>
                        {s === 1 && 'Dados'}
                        {s === 2 && 'Local'}
                        {s === 3 && 'Operação'}
                        {s === 4 && 'Contrato'}
                     </span>
                 </div>
             ))}
             {/* Line */}
             <div className="absolute top-[5.5rem] left-10 right-10 h-0.5 bg-orange-800 -z-0">
                 <div className="h-full bg-white transition-all duration-300" style={{width: `${((step-1)/3)*100}%`}}></div>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 overflow-y-auto flex-1 bg-gray-50">
            
            {/* Step 1: Basic Info */}
            {step === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                    <h3 className="font-bold text-gray-800 text-lg border-b pb-2">Dados do Estabelecimento</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Nome Fantasia</label>
                            <input className="w-full p-2 border rounded-lg" placeholder="Ex: Supermercado Central" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">CNPJ</label>
                            <input className="w-full p-2 border rounded-lg" placeholder="00.000.000/0001-00" value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Nome do Responsável</label>
                            <input className="w-full p-2 border rounded-lg" placeholder="Nome completo" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">CPF do Responsável</label>
                            <input className="w-full p-2 border rounded-lg" placeholder="000.000.000-00" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Email Corporativo</label>
                            <input className="w-full p-2 border rounded-lg" type="email" placeholder="loja@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">WhatsApp / Telefone</label>
                            <input className="w-full p-2 border rounded-lg" placeholder="(95) 99999-9999" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
                <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                    <h3 className="font-bold text-gray-800 text-lg border-b pb-2">Localização</h3>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-sm text-yellow-800 flex gap-2">
                        <MapPin size={16} /> O Mercafácil usa sua localização para calcular o frete automaticamente.
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Endereço Completo</label>
                        <input className="w-full p-2 border rounded-lg" placeholder="Av. Principal, 123, Centro" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Município</label>
                        <select className="w-full p-2 border rounded-lg bg-white" value={formData.municipality} onChange={e => setFormData({...formData, municipality: e.target.value})}>
                            {MUNICIPALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                </div>
            )}

            {/* Step 3: Operations */}
            {step === 3 && (
                <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                    <h3 className="font-bold text-gray-800 text-lg border-b pb-2">Operação</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Horário de Funcionamento</label>
                        <input className="w-full p-2 border rounded-lg" placeholder="Ex: Seg-Sáb 08h às 20h" value={formData.hours} onChange={e => setFormData({...formData, hours: e.target.value})} />
                    </div>
                    
                    <label className="block text-sm font-medium text-gray-600 mb-2">Modelo de Entrega</label>
                    <div className="grid grid-cols-1 gap-3">
                        <div 
                            onClick={() => setFormData({...formData, deliveryType: 'platform'})}
                            className={`p-4 border-2 rounded-xl cursor-pointer flex items-center gap-4 transition-all ${formData.deliveryType === 'platform' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <div className="bg-orange-100 p-2 rounded-full text-orange-600"><Truck size={20}/></div>
                            <div>
                                <div className="font-bold text-gray-800">Entregadores Mercafácil</div>
                                <div className="text-xs text-gray-500">Nossa rede de parceiros faz a entrega.</div>
                            </div>
                        </div>
                        <div 
                            onClick={() => setFormData({...formData, deliveryType: 'own'})}
                            className={`p-4 border-2 rounded-xl cursor-pointer flex items-center gap-4 transition-all ${formData.deliveryType === 'own' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Store size={20}/></div>
                            <div>
                                <div className="font-bold text-gray-800">Entrega Própria</div>
                                <div className="text-xs text-gray-500">Você usa seus motoboys. Taxa menor.</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 4: Contract */}
            {step === 4 && (
                <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                    <h3 className="font-bold text-gray-800 text-lg border-b pb-2">Contrato de Parceria</h3>
                    
                    <div className="h-48 overflow-y-auto p-4 bg-white border rounded-lg text-xs text-gray-600 space-y-2">
                        <p><strong>CLÁUSULA 1:</strong> O Mercafácil atua como intermediador de vendas...</p>
                        <p><strong>CLÁUSULA 2:</strong> A comissão sobre vendas realizadas é de 10% + taxas...</p>
                        <p><strong>CLÁUSULA 3:</strong> O repasse será realizado semanalmente via PIX...</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    </div>

                    <div className="flex items-center gap-2 p-4 bg-white rounded-lg border border-gray-200">
                        <input 
                            type="checkbox" 
                            id="contract" 
                            className="w-5 h-5 accent-orange-600"
                            checked={formData.contractAccepted}
                            onChange={e => setFormData({...formData, contractAccepted: e.target.checked})}
                        />
                        <label htmlFor="contract" className="text-sm font-medium cursor-pointer">
                            Li e concordo com os Termos de Uso e Contrato de Parceria.
                        </label>
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-white flex justify-between">
            {step > 1 ? (
                <Button variant="outline" onClick={handleBack}>Voltar</Button>
            ) : (
                <div></div>
            )}
            
            {step < 4 ? (
                <Button onClick={handleNext}>Continuar <ChevronRight size={16}/></Button>
            ) : (
                <Button onClick={handleSubmit} disabled={!formData.contractAccepted}>Finalizar Cadastro</Button>
            )}
        </div>

      </div>
    </div>
  );
};
