import React from 'react';
import { Trophy, Star, Gift, Crown, TrendingUp, Target, ChevronRight, Lock, Award, Users, ShoppingBag, Truck, CheckCircle } from 'lucide-react';
import { GamificationProfile, CustomerLevel } from '../types';

interface GamificationProps {
  profile: GamificationProfile;
  onClose: () => void;
}

export const GamificationHub: React.FC<GamificationProps> = ({ profile, onClose }) => {
  
  const getLevelIcon = (level: CustomerLevel) => {
    switch(level) {
        case 'Bronze': return <Star size={24} />;
        case 'Prata': return <Award size={24} />;
        case 'Ouro': return <Crown size={24} />;
        case 'Platina': return <Trophy size={24} />;
    }
  };

  const getLevelColor = (level: CustomerLevel) => {
      switch(level) {
          case 'Bronze': return 'text-orange-700 bg-orange-100';
          case 'Prata': return 'text-gray-700 bg-gray-200';
          case 'Ouro': return 'text-yellow-700 bg-yellow-100';
          case 'Platina': return 'text-cyan-700 bg-cyan-100';
      }
  };

  const getNextLevel = (current: CustomerLevel) => {
      if (current === 'Bronze') return { name: 'Prata', target: 500 };
      if (current === 'Prata') return { name: 'Ouro', target: 1500 };
      if (current === 'Ouro') return { name: 'Platina', target: 3000 };
      return null;
  };

  const next = getNextLevel(profile.level);
  const progress = next ? Math.min((profile.points / next.target) * 100, 100) : 100;

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col md:flex-row animate-in fade-in duration-300">
        
        {/* Sidebar / Header Mobile */}
        <div className="bg-gray-900 text-white p-6 md:w-1/4 flex flex-col justify-between shrink-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
                <Crown size={200} />
            </div>
            
            <div className="relative z-10">
                <button onClick={onClose} className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                    <ChevronRight className="rotate-180" size={20} /> Voltar para Loja
                </button>
                
                <div className="flex flex-col items-center text-center mb-8">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ring-4 ring-white/10 ${getLevelColor(profile.level)}`}>
                        {getLevelIcon(profile.level)}
                    </div>
                    <h2 className="text-3xl font-black tracking-tight">{profile.level}</h2>
                    <p className="text-gray-400 text-sm mt-1">Nível Atual</p>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
                    <div className="flex justify-between text-sm mb-2 font-medium">
                        <span className="text-yellow-400">{profile.points} pts</span>
                        <span className="text-gray-500">{next ? next.target : 'MAX'} pts</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-3 overflow-hidden">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(234,179,8,0.5)]" style={{ width: `${progress}%` }}></div>
                    </div>
                    {next ? (
                        <p className="text-xs text-center text-gray-400">
                            Faltam <span className="text-white font-bold">{next.target - profile.points} pts</span> para o nível {next.name}
                        </p>
                    ) : (
                        <p className="text-xs text-center font-bold text-yellow-400">Você é uma lenda do Mercafácil!</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-3 rounded-lg text-center">
                        <TrendingUp size={20} className="mx-auto mb-1 text-green-400" />
                        <div className="text-lg font-bold">R$ {profile.lifetimeSavings.toFixed(0)}</div>
                        <div className="text-[10px] text-gray-500 uppercase">Economizados</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg text-center">
                        <ShoppingBag size={20} className="mx-auto mb-1 text-blue-400" />
                        <div className="text-lg font-bold">{profile.weeklyPurchases || 0}/3</div>
                        <div className="text-[10px] text-gray-500 uppercase">Compras Semana</div>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 text-center text-[10px] text-gray-600 relative z-10">
                Clube Mercafácil • Fidelidade
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-gray-50">
            
            {/* Automatic Benefits Table */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <Gift className="text-purple-600" size={24} />
                    <h3 className="text-2xl font-bold text-gray-800">Benefícios do Nível</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <BenefitCard 
                        title="Cupom Boas-vindas" 
                        desc="R$ 10,00 na 1ª compra"
                        active={true}
                        icon={<Star />}
                        color="bg-purple-100 text-purple-700"
                    />
                    <BenefitCard 
                        title="Frete Grátis" 
                        desc="Compre 3x na semana"
                        active={(profile.weeklyPurchases || 0) >= 3}
                        progress={(profile.weeklyPurchases || 0) / 3}
                        progressLabel={`${profile.weeklyPurchases || 0}/3 compras`}
                        icon={<Truck />}
                        color="bg-blue-100 text-blue-700"
                    />
                    <BenefitCard 
                        title="Cashback 5%" 
                        desc="Em combos promocionais"
                        active={profile.level !== 'Bronze'}
                        icon={<TrendingUp />}
                        color="bg-green-100 text-green-700"
                        lockLabel="Nível Prata+"
                    />
                    <BenefitCard 
                        title="Ofertas VIP" 
                        desc="Acesso antecipado"
                        active={profile.level === 'Ouro' || profile.level === 'Platina'}
                        icon={<Crown />}
                        color="bg-yellow-100 text-yellow-700"
                        lockLabel="Nível Ouro+"
                    />
                </div>
            </section>

            {/* Missions Section */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <Target className="text-orange-600" size={24} />
                    <h3 className="text-2xl font-bold text-gray-800">Missões Ativas</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {profile.missions.map(mission => (
                        <div key={mission.id} className={`p-5 rounded-xl border ${mission.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow`}>
                            {mission.completed && (
                                <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold z-10">
                                    CONCLUÍDA
                                </div>
                            )}
                            <div className="flex justify-between items-start mb-3">
                                <div className={`p-3 rounded-xl ${mission.completed ? 'bg-green-200 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {mission.icon === 'store' && <Gift size={20} />}
                                    {mission.icon === 'star' && <Star size={20} />}
                                    {mission.icon === 'wallet' && <TrendingUp size={20} />}
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-black text-orange-600">+{mission.reward} pts</span>
                                </div>
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1">{mission.title}</h4>
                            <p className="text-xs text-gray-500 mb-4 h-8">{mission.description}</p>
                            
                            <div className="w-full bg-gray-100 rounded-full h-2 mb-1 overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${mission.completed ? 'bg-green-500' : 'bg-orange-500'}`} 
                                    style={{ width: `${Math.min((mission.current / mission.target) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <div className="text-[10px] text-gray-400 text-right font-medium">
                                {mission.current} / {mission.target}
                            </div>
                        </div>
                    ))}
                    
                    {/* Static Referral Mission */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-20 transform rotate-12 group-hover:scale-110 transition-transform">
                            <Users size={80} />
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                             <div className="bg-white/20 p-2 rounded-lg"><Users size={20} /></div>
                             <span className="font-bold text-sm bg-white/20 px-2 py-0.5 rounded text-white">R$ 5,00 Crédito</span>
                        </div>
                        <h4 className="font-bold text-lg mb-1">Indique um Amigo</h4>
                        <p className="text-indigo-100 text-xs mb-4 max-w-[80%]">Ganhe crédito quando ele fizer a 1ª compra.</p>
                        <button className="bg-white text-indigo-600 text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                            Copiar Link
                        </button>
                    </div>
                </div>
            </section>

        </div>
    </div>
  );
};

interface BenefitCardProps {
    title: string;
    desc: string;
    active: boolean;
    icon: React.ReactNode;
    color: string;
    progress?: number;
    progressLabel?: string;
    lockLabel?: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ title, desc, active, icon, color, progress, progressLabel, lockLabel }) => (
    <div className={`p-5 rounded-xl border flex flex-col justify-between h-full transition-all ${active ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-100 border-gray-200 grayscale opacity-70'}`}>
        <div>
            <div className="flex justify-between items-start mb-3">
                <div className={`p-3 rounded-xl ${active ? color : 'bg-gray-200 text-gray-500'}`}>
                    {active ? icon : <Lock size={20} />}
                </div>
                {!active && lockLabel && (
                    <span className="text-[10px] font-bold bg-gray-200 text-gray-500 px-2 py-1 rounded uppercase">{lockLabel}</span>
                )}
            </div>
            <h4 className="font-bold text-gray-800 mb-1">{title}</h4>
            <p className="text-xs text-gray-500 mb-3">{desc}</p>
        </div>
        
        {progress !== undefined && (
            <div className="mt-2">
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1 overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: `${progress * 100}%` }}></div>
                </div>
                <div className="text-[10px] text-gray-400 text-right">{progressLabel}</div>
            </div>
        )}
        
        {active && progress === undefined && (
             <div className="text-[10px] text-green-600 font-bold flex items-center gap-1 mt-2">
                 <CheckCircle size={12} /> ATIVO
             </div>
        )}
    </div>
);