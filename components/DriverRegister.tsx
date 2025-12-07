import React, { useState } from 'react';
import { Bike, Car, Footprints, Camera, ChevronRight, CheckCircle, CreditCard, User, Upload, ShieldCheck, X, FileText, Smartphone, MapPin } from 'lucide-react';
import { Button } from './Button';
import { VehicleType } from '../types';
import { MUNICIPALITIES } from '../constants';

interface DriverRegisterProps {
  onClose: () => void;
  onRegister: (data: any) => void;
}

export const DriverRegister: React.FC<DriverRegisterProps> = ({ onClose, onRegister }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    phone: '',
    municipality: 'Boa Vista',
    vehicleType: 'motorcycle' as VehicleType,
    pixKey: '',
    docType: 'cnh', // cnh or rg
    docsUploaded: false
  });

  const vehicleOptions = [
    { type: 'walking', label: 'A Pé', base: 2.00, km: 0.50, maxDist: '1.5 km', reqs: ['Documento', 'Selfie', 'Local'], icon: <Footprints size={24} /> },
    { type: 'bike', label: 'Bicicleta', base: 3.00, km: 0.80, maxDist: '4 km', reqs: ['Documento', 'Selfie', 'Foto Bike'], icon: <Bike size={24} /> },
    { type: 'motorcycle', label: 'Moto', base: 4.00, km: 1.20, maxDist: '10 km', reqs: ['CNH A', 'Selfie', 'Foto Moto', 'Placa'], icon: <Bike size={24} /> },
    { type: 'car', label: 'Carro', base: 6.00, km: 1.50, maxDist: '20 km', reqs: ['CNH B', 'CRLV', 'Foto Carro', 'Selfie'], icon: <Car size={24} /> },
  ];

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = () => {
    // Simulate API call
    onRegister({
      ...formData,
      id: `d${Date.now()}`,
      status: 'offline', // Starts offline pending approval
      earnings: 0,
      points: 0,
      level: 'Bronze',
      rating: 5.0,
      deliveriesCompleted: 0,
      weeklyGoal: { target: 10, current: 0, reward: 20, expiresIn: '7 dias' }
    });
    onClose();
    alert("Cadastro enviado para análise! Você será notificado em breve.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <X size={24} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-green-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-green-400">Cadastro Parceiro</span>
          </div>
          <h2 className="text-2xl font-bold">Seja um Entregador</h2>
          <p className="text-gray-400 text-sm">Passo {step} de 4</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 h-1 mt-4 rounded-full overflow-hidden">
            <div 
              className="bg-green-500 h-full transition-all duration-300" 
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
          
          {/* STEP 1: Vehicle Selection */}
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
              <h3 className="text-lg font-bold text-gray-800">Escolha sua Modalidade</h3>
              <p className="text-sm text-gray-500 mb-2">Selecione como você fará as entregas. Isso define seus ganhos.</p>
              
              <div className="grid grid-cols-1 gap-3">
                {vehicleOptions.map((opt) => (
                  <div 
                    key={opt.type}
                    onClick={() => setFormData({...formData, vehicleType: opt.type as VehicleType})}
                    className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col transition-all relative overflow-hidden ${
                      formData.vehicleType === opt.type 
                        ? 'border-green-500 bg-white shadow-md' 
                        : 'border-transparent bg-white hover:bg-gray-100 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${formData.vehicleType === opt.type ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {opt.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{opt.label}</h4>
                                <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Max {opt.maxDist}</span>
                            </div>
                        </div>
                        {formData.vehicleType === opt.type && <CheckCircle className="text-green-600" size={24} />}
                    </div>
                    
                    <div className="text-xs text-gray-500 pl-1">
                        <p><strong>Ganhos:</strong> Base R$ {opt.base.toFixed(2)} + R$ {opt.km.toFixed(2)}/km</p>
                        <p className="mt-1 flex gap-1 flex-wrap">
                            <strong className="text-gray-400">Exige:</strong>
                            {opt.reqs.map(r => (
                                <span key={r} className="bg-gray-100 px-1.5 rounded text-[10px]">{r}</span>
                            ))}
                        </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Personal Data */}
          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
              <h3 className="text-lg font-bold text-gray-800">Dados Pessoais</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Ex: João Silva"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={e => setFormData({...formData, cpf: e.target.value})}
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                    type="tel" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="(95) 99999-9999"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade Base</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white"
                    value={formData.municipality}
                    onChange={e => setFormData({...formData, municipality: e.target.value})}
                    >
                    {MUNICIPALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Documents */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
              <h3 className="text-lg font-bold text-gray-800">Envio de Documentos</h3>
              <p className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                A modalidade <strong>{formData.vehicleType.toUpperCase()}</strong> exige os seguintes documentos:
              </p>

              <div className="grid grid-cols-2 gap-4">
                 <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer bg-white">
                    <Camera className="text-gray-400 mb-2" size={32} />
                    <span className="text-xs font-bold text-gray-600">Selfie de Rosto</span>
                    <span className="text-[10px] text-gray-400">Boa iluminação</span>
                 </div>
                 
                 <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer bg-white">
                    <Upload className="text-gray-400 mb-2" size={32} />
                    <span className="text-xs font-bold text-gray-600">
                        {(formData.vehicleType === 'motorcycle' || formData.vehicleType === 'car') ? 'CNH (Frente)' : 'RG / CPF'}
                    </span>
                    <span className="text-[10px] text-gray-400">Legível</span>
                 </div>

                 {(formData.vehicleType === 'motorcycle' || formData.vehicleType === 'bike' || formData.vehicleType === 'car') && (
                   <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer bg-white col-span-2">
                      <Camera className="text-gray-400 mb-2" size={32} />
                      <span className="text-xs font-bold text-gray-600">Foto do Veículo</span>
                      <span className="text-[10px] text-gray-400">Mostrando placa/estado</span>
                   </div>
                 )}

                 {formData.vehicleType === 'car' && (
                   <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer bg-white col-span-2">
                      <FileText className="text-gray-400 mb-2" size={32} />
                      <span className="text-xs font-bold text-gray-600">CRLV Atualizado</span>
                      <span className="text-[10px] text-gray-400">Documento do Carro</span>
                   </div>
                 )}
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                <input 
                    type="checkbox" 
                    id="docs" 
                    className="w-5 h-5 accent-green-600"
                    checked={formData.docsUploaded}
                    onChange={e => setFormData({...formData, docsUploaded: e.target.checked})}
                />
                <label htmlFor="docs" className="text-sm text-gray-700">Declaro que os documentos são originais e verdadeiros.</label>
              </div>
            </div>
          )}

          {/* STEP 4: Bank Info */}
          {step === 4 && (
             <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                <h3 className="text-lg font-bold text-gray-800">Dados de Recebimento</h3>
                <p className="text-sm text-gray-500">Seus ganhos serão transferidos automaticamente via Pix.</p>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chave Pix</label>
                    <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" size={18} />
                        <input 
                            type="text" 
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="CPF, Email ou Telefone"
                            value={formData.pixKey}
                            onChange={e => setFormData({...formData, pixKey: e.target.value})}
                        />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 text-right">Verifique se a chave está correta.</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-xs border border-blue-100">
                    <strong>Como funciona o pagamento?</strong><br/>
                    O repasse é feito semanalmente (toda terça-feira) ou você pode solicitar saques diários (taxa R$ 1,50).
                </div>

                <div className="text-xs text-gray-500 mt-4 text-center">
                    Ao clicar em finalizar, você aceita os <a href="#" className="text-green-600 underline font-bold">Termos de Uso</a> do Mercafácil Entregador.
                </div>
             </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 flex gap-4 bg-white">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Voltar
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={handleNext} className="flex-1 bg-gray-900 text-white hover:bg-gray-800">
              Continuar <ChevronRight size={16} className="ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!formData.docsUploaded || !formData.pixKey} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
              Finalizar Cadastro
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};