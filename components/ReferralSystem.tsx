
import React, { useState } from 'react';
import { Share2, Copy, Gift, Users, ChevronRight, X, MessageCircle, Facebook, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from './Button';
import { ReferralStats } from '../types';

type UserType = 'client' | 'driver' | 'vendor';

interface ReferralSystemProps {
  userType: UserType;
  referralData: ReferralStats;
  onClose: () => void;
}

export const ReferralSystem: React.FC<ReferralSystemProps> = ({ userType, referralData, onClose }) => {
  const [activeTab, setActiveTab] = useState<'invite' | 'history'>('invite');
  const [copied, setCopied] = useState(false);

  // Configuration based on User Type
  const config = {
    client: {
      color: 'bg-orange-600',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      title: 'Indique e Ganhe R$ 5,00',
      description: 'Convide amigos para o Mercafácil. Eles ganham R$ 10,00 na primeira compra e você ganha R$ 5,00 de crédito!',
      step1: 'Envie seu código para um amigo.',
      step2: 'Ele se cadastra e faz uma compra acima de R$ 20,00.',
      step3: 'Pronto! O crédito cai na sua hora.',
      rewardLabel: 'Crédito em Compras',
      limit: 'R$ 50,00 / mês',
      shareMessage: `Oi! Use meu código ${referralData.code} no Mercafácil e ganhe R$ 10,00 de desconto na sua primeira compra! Baixe agora: mercafacil.app.br`
    },
    driver: {
      color: 'bg-green-600',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600',
      title: 'Indique Parceiros: Ganhe R$ 20,00',
      description: 'Conhece alguém que quer entregar? Indique para o Mercafácil! Quando ele completar 5 entregas, vocês dois ganham.',
      step1: 'Compartilhe seu código com outro motorista.',
      step2: 'Ele se cadastra e completa 5 entregas.',
      step3: 'Você ganha R$ 20,00 e ele ganha R$ 25,00 de bônus!',
      rewardLabel: 'Bônus em Dinheiro',
      limit: 'Sem limite',
      shareMessage: `Vire entregador do Mercafácil e ganhe dinheiro extra! Use meu código ${referralData.code} e ganhe bônus após 5 entregas.`
    },
    vendor: {
      color: 'bg-purple-600',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      title: 'Expanda a Rede: Ganhe R$ 50,00',
      description: 'Indique outros mercados para a plataforma. Ganhe crédito de destaque quando eles começarem a vender.',
      step1: 'Indique um lojista parceiro.',
      step2: 'Ele ativa a loja e realiza a 1ª venda.',
      step3: 'Você ganha R$ 50 em crédito de anúncios e ele 5 vendas sem taxa.',
      rewardLabel: 'Crédito de Anúncio',
      limit: 'Sem limite',
      shareMessage: `Venda online com o Mercafácil! Cadastre seu mercado com meu código ${referralData.code} e ganhe isenção de taxas nas primeiras vendas.`
    }
  };

  const currentConfig = config[userType];

  const handleCopy = () => {
    navigator.clipboard.writeText(referralData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(currentConfig.shareMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={`${currentConfig.color} p-6 text-white relative text-center overflow-hidden`}>
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-50 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 rounded-full p-2 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
          
          <div className="absolute top-0 left-0 p-4 opacity-10 pointer-events-none">
             <Users size={120} />
          </div>

          <div className="relative z-10">
             <div className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-sm rounded-full mb-3 shadow-sm">
                <Gift size={32} className="text-white animate-bounce" />
             </div>
             <h2 className="text-2xl font-black mb-1">{currentConfig.title}</h2>
             <p className="text-white/90 text-sm max-w-xs mx-auto">{currentConfig.description}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
            <button 
                onClick={() => setActiveTab('invite')}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'invite' ? `${currentConfig.textColor} border-b-2 border-current` : 'text-gray-500 hover:bg-gray-50'}`}
            >
                Convidar
            </button>
            <button 
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'history' ? `${currentConfig.textColor} border-b-2 border-current` : 'text-gray-500 hover:bg-gray-50'}`}
            >
                Minhas Indicações ({referralData.inviteCount})
            </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
            
            {activeTab === 'invite' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    {/* Code Card */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Seu Código Exclusivo</p>
                        <div className="flex items-center gap-2 justify-center mb-4">
                            <div className="text-3xl font-mono font-black text-gray-800 tracking-widest border-2 border-dashed border-gray-200 px-4 py-2 rounded-lg bg-gray-50 select-all">
                                {referralData.code}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={handleCopy} variant="outline" className={`flex-1 ${copied ? 'bg-green-50 text-green-600 border-green-200' : ''}`}>
                                {copied ? <><CheckCircle size={18} className="mr-2"/> Copiado</> : <><Copy size={18} className="mr-2"/> Copiar Código</>}
                            </Button>
                            <Button onClick={handleWhatsAppShare} className="flex-1 bg-green-500 hover:bg-green-600 text-white border-none">
                                <MessageCircle size={18} className="mr-2" /> WhatsApp
                            </Button>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-800 text-sm">Como funciona?</h3>
                        <div className="flex gap-4 items-start">
                            <div className={`w-8 h-8 rounded-full ${currentConfig.lightColor} ${currentConfig.textColor} flex items-center justify-center font-bold text-sm shrink-0`}>1</div>
                            <p className="text-sm text-gray-600 pt-1">{currentConfig.step1}</p>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className={`w-8 h-8 rounded-full ${currentConfig.lightColor} ${currentConfig.textColor} flex items-center justify-center font-bold text-sm shrink-0`}>2</div>
                            <p className="text-sm text-gray-600 pt-1">{currentConfig.step2}</p>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className={`w-8 h-8 rounded-full ${currentConfig.lightColor} ${currentConfig.textColor} flex items-center justify-center font-bold text-sm shrink-0`}>3</div>
                            <p className="text-sm text-gray-600 pt-1">{currentConfig.step3}</p>
                        </div>
                    </div>

                    {/* Fraud Warning */}
                    <div className="flex items-start gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-xs text-yellow-800">
                        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                        <p>Para garantir a segurança, nosso sistema valida CPF e dispositivo. Autoindicações ou contas duplicadas não geram recompensa.</p>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm">
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Ganho Total</p>
                            <p className={`text-2xl font-black ${currentConfig.textColor}`}>R$ {referralData.totalEarnings.toFixed(2)}</p>
                        </div>
                        <div className={`p-3 rounded-full ${currentConfig.lightColor} ${currentConfig.textColor}`}>
                            <TrendingUp size={24} />
                        </div>
                    </div>

                    <h3 className="font-bold text-gray-800 text-sm mt-2">Histórico</h3>
                    
                    {referralData.history.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <Users size={40} className="mx-auto mb-2 opacity-20" />
                            <p>Você ainda não tem indicações.</p>
                            <Button variant="ghost" size="sm" onClick={() => setActiveTab('invite')} className="mt-2 text-blue-600">Convidar agora</Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {referralData.history.map(item => (
                                <div key={item.id} className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-gray-800">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {item.status === 'completed' ? 'Recebido' : 'Pendente'}
                                        </span>
                                        {item.status === 'completed' && (
                                            <p className={`text-xs font-bold mt-1 ${currentConfig.textColor}`}>+ R$ {item.rewardAmount.toFixed(2)}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
