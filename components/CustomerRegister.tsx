
import React, { useState } from 'react';
import { User, Mail, Lock, Phone, MapPin, CreditCard, ChevronRight, X, CheckCircle, Smartphone, Facebook, Chrome } from 'lucide-react';
import { Button } from './Button';
import { MUNICIPALITIES } from '../constants';
import { CustomerLevel } from '../types';

interface CustomerRegisterProps {
  onClose: () => void;
  onRegister: (data: any) => void;
}

export const CustomerRegister: React.FC<CustomerRegisterProps> = ({ onClose, onRegister }) => {
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    municipality: 'Boa Vista',
    cpf: ''
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const simulateSMS = () => {
    setIsVerifying(true);
    setTimeout(() => {
      alert("Código SMS simulado: 1234");
      setIsVerifying(false);
    }, 1500);
  };

  const verifyCode = () => {
    if (verificationCode === '1234') {
      handleNext();
    } else {
      alert("Código inválido (use 1234)");
    }
  };

  const handleFinalize = () => {
    onRegister({
      ...formData,
      id: `c${Date.now()}`,
      profile: {
        points: 0,
        level: 'Bronze',
        lifetimeSavings: 0,
        streakDays: 0,
        missions: [],
        weeklyPurchases: 0
      }
    });
    // The parent component handles closing or redirecting
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 relative text-white text-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 rounded-full p-1">
            <X size={20} />
          </button>
          <h2 className="text-2xl font-black tracking-tight mb-1">Junte-se ao Mercafácil! 🚀</h2>
          <p className="text-orange-100 text-sm">Cadastre-se em 2 minutos e ganhe benefícios.</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
              <div className="flex gap-2 mb-4 justify-center">
                <Button variant="outline" className="flex-1 text-blue-600 border-blue-200 bg-blue-50">
                   <Facebook size={18} className="mr-2" /> Facebook
                </Button>
                <Button variant="outline" className="flex-1 text-red-600 border-red-200 bg-red-50">
                   <Chrome size={18} className="mr-2" /> Google
                </Button>
              </div>
              <div className="relative flex items-center justify-center border-b border-gray-200 mb-4">
                 <span className="bg-white px-2 text-xs text-gray-400 absolute -bottom-2">ou use seu email</span>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Nome Completo</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="Ex: Maria Silva"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Senha</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={handleNext} className="w-full py-4 text-lg bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200 mt-4">
                Continuar <ChevronRight size={20} className="ml-2" />
              </Button>
            </div>
          )}

          {/* STEP 2: Phone Verification */}
          {step === 2 && (
             <div className="space-y-6 animate-in slide-in-from-right-8 duration-300 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-600">
                    <Smartphone size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Verifique seu Celular</h3>
                <p className="text-sm text-gray-500">Enviaremos um código SMS para confirmar sua conta e garantir sua segurança.</p>
                
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-center text-lg tracking-widest"
                    placeholder="(95) 99999-9999"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                {!isVerifying && verificationCode === '' ? (
                    <Button onClick={simulateSMS} disabled={formData.phone.length < 10} className="w-full">
                        Enviar Código SMS
                    </Button>
                ) : (
                    <div className="space-y-4 animate-in fade-in">
                        <input 
                            type="text"
                            maxLength={4}
                            className="w-full py-3 border-b-2 border-orange-500 text-center text-3xl font-mono tracking-[1em] focus:outline-none"
                            placeholder="0000"
                            value={verificationCode}
                            onChange={e => setVerificationCode(e.target.value)}
                        />
                        <Button onClick={verifyCode} className="w-full bg-green-600 hover:bg-green-700">
                            Confirmar Código
                        </Button>
                        <button onClick={() => setVerificationCode('')} className="text-xs text-gray-400 underline">Reenviar código</button>
                    </div>
                )}
                
                <button onClick={handleBack} className="text-gray-400 text-sm">Voltar</button>
             </div>
          )}

          {/* STEP 3: Address & CPF */}
          {step === 3 && (
            <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
              <h3 className="text-lg font-bold text-gray-800">Onde entregaremos? 📦</h3>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Município</label>
                <select 
                  className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                  value={formData.municipality}
                  onChange={e => setFormData({...formData, municipality: e.target.value})}
                >
                  {MUNICIPALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Endereço Completo</label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Rua, Número, Bairro"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center justify-between">
                    CPF (Opcional)
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 rounded">Para Cashback</span>
                </label>
                <div className="relative mt-1">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={e => setFormData({...formData, cpf: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={handleNext} className="w-full py-4 text-lg bg-orange-600 hover:bg-orange-700 mt-4">
                Finalizar Cadastro
              </Button>
            </div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
             <div className="text-center space-y-6 animate-in zoom-in duration-500 py-8">
                <div className="inline-block relative">
                    <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <CheckCircle className="relative text-green-500 w-24 h-24 mx-auto" />
                </div>
                
                <div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Bem-vindo! 🎉</h2>
                    <p className="text-gray-500">Seu cadastro foi realizado com sucesso.</p>
                </div>

                <div className="bg-gradient-to-br from-purple-100 to-indigo-100 border border-purple-200 p-6 rounded-2xl relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform">
                    <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">PRIMEIRA COMPRA</div>
                    <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">Seu Presente</p>
                    <div className="text-4xl font-black text-gray-900 mb-1">R$ 10,00</div>
                    <p className="text-sm text-gray-600">Cupom de Desconto</p>
                    <div className="mt-4 bg-white border-2 border-dashed border-purple-300 p-2 rounded-lg font-mono font-bold text-purple-700 tracking-widest select-all">
                        BEMVINDO10
                    </div>
                </div>

                <Button onClick={handleFinalize} className="w-full py-4 text-lg bg-green-600 hover:bg-green-700 shadow-xl shadow-green-200">
                    Começar a Comprar
                </Button>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};
