
import React, { useState } from 'react';
import { Sparkles, ChevronRight, X, User, ShoppingCart, MapPin, Search } from 'lucide-react';
import { Button } from './Button';

interface OnboardingProps {
  onClose: () => void;
}

export const OnboardingTutorial: React.FC<OnboardingProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Bem-vindo ao Mercafácil! 🚀",
      text: "Eu sou a IA do Mercafácil e vou te mostrar como economizar tempo e dinheiro em Roraima.",
      icon: <Sparkles size={48} className="text-yellow-400" />
    },
    {
      title: "Escolha seu Município",
      text: "Atendemos os 15 municípios. Selecione onde você está no topo da tela para ver os mercados da sua região.",
      icon: <MapPin size={48} className="text-red-500" />
    },
    {
      title: "Compare e Compre",
      text: "Busque produtos e nós comparamos os preços entre os mercados. Use as 'Listas Inteligentes' para organizar compras mensais.",
      icon: <Search size={48} className="text-blue-500" />
    },
    {
      title: "Ganhe Cashback",
      text: "Cada compra gera pontos e dinheiro de volta. Fique de olho nas ofertas relâmpago!",
      icon: <ShoppingCart size={48} className="text-green-500" />
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden relative text-center p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <div className="mb-6 flex justify-center">
          <div className="bg-gray-100 p-6 rounded-full animate-bounce-slow">
            {steps[step].icon}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">{steps[step].title}</h2>
        <p className="text-gray-500 mb-8 min-h-[80px]">{steps[step].text}</p>

        <div className="flex gap-2 justify-center mb-6">
          {steps.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-orange-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        <Button onClick={handleNext} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl shadow-lg shadow-orange-200">
          {step === steps.length - 1 ? "Começar Agora" : "Próximo"}
        </Button>
      </div>
    </div>
  );
};
