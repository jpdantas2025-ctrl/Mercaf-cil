
import React, { useState, useRef } from 'react';
import { ShoppingCart, Search, MapPin, Store, Home, Mic, MicOff, Bike, LayoutDashboard, UserPlus, LogIn, HelpCircle } from 'lucide-react';
import { ViewState, Municipality } from '../types';
import { MUNICIPALITIES } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  setView: (view: ViewState) => void;
  currentView: ViewState;
  cartCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedMunicipality: string;
  onMunicipalityChange: (muni: string) => void;
  onRegisterClick: () => void;
  onHelpClick: () => void;
  onFooterLinkClick: (link: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  setView, 
  currentView, 
  cartCount,
  searchQuery,
  onSearchChange,
  selectedMunicipality,
  onMunicipalityChange,
  onRegisterClick,
  onHelpClick,
  onFooterLinkClick
}) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onSearchChange(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } else {
      alert("Seu navegador não suporta reconhecimento de voz.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-orange-600 shadow-md text-white">
        <div className="container mx-auto px-4">
          {/* Top Bar - Quick Links */}
          <div className="flex justify-between items-center text-xs py-1 border-b border-orange-500/30 text-orange-50">
            <div className="flex gap-4">
              <button onClick={() => setView(ViewState.VENDOR)} className="hover:text-white transition-colors">Área do Lojista</button>
              <button onClick={() => setView(ViewState.DRIVER)} className="hover:text-white transition-colors">Área do Entregador</button>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setView(ViewState.ADMIN)} className="hover:text-white transition-colors flex items-center gap-1">
                <LayoutDashboard size={12}/> Admin
              </button>
            </div>
          </div>

          {/* Main Navbar */}
          <div className="py-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer self-start sm:self-auto hover:opacity-90 transition-opacity"
              onClick={() => setView(ViewState.HOME)}
            >
              <img 
                src="https://placehold.co/100x100/ffffff/ea580c?text=MF" 
                alt="Mercafácil Logo" 
                className="w-10 h-10 rounded-lg object-contain"
              />
              <div>
                <h1 className="font-bold text-xl leading-none">Mercafácil</h1>
                <span className="text-[10px] opacity-90 block tracking-wider">RORAIMA</span>
              </div>
            </div>

            {/* Municipality Selector */}
            <div className="relative group w-full sm:w-auto">
              <div className="flex items-center gap-1 bg-orange-700/50 px-3 py-2 rounded-lg cursor-pointer hover:bg-orange-700 transition-colors text-sm border border-orange-500/30">
                <MapPin size={16} />
                <span className="font-medium truncate max-w-[120px]">{selectedMunicipality}</span>
              </div>
              <select 
                className="absolute inset-0 opacity-0 cursor-pointer"
                value={selectedMunicipality}
                onChange={(e) => onMunicipalityChange(e.target.value)}
              >
                {MUNICIPALITIES.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Search Bar */}
            <div className="flex-1 relative w-full">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={isListening ? "Ouvindo..." : `Buscar produtos em ${selectedMunicipality}...`}
                className={`w-full pl-4 pr-24 py-2.5 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-800 shadow-sm transition-colors ${isListening ? 'bg-orange-50 ring-2 ring-orange-500 placeholder-orange-500' : 'bg-white'}`}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button 
                  onClick={toggleListening}
                  className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse scale-110' : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'}`}
                  title={isListening ? "Parar de ouvir" : "Buscar por voz"}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                <button className="p-1.5 bg-orange-600 rounded-md hover:bg-orange-700 transition-colors">
                  <Search size={16} className="text-white" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto">
              
              {/* Help Button */}
              <button 
                onClick={onHelpClick}
                className="p-2 text-orange-100 hover:text-white hover:bg-orange-700 rounded-full transition-colors"
                title="Central de Ajuda"
              >
                <HelpCircle size={24} />
              </button>

              {/* Register / Sign In Buttons */}
              <button 
                onClick={onRegisterClick}
                className="hidden sm:flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-orange-50 transition-colors shadow-sm"
              >
                <UserPlus size={16} />
                Cadastre-se
              </button>

              <button 
                onClick={() => setView(ViewState.CART)}
                className="relative p-2.5 bg-orange-700/50 hover:bg-orange-700 rounded-lg transition-colors"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-orange-600 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-orange-600">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 mb-20 md:mb-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-sm mt-12 hidden md:block">
        <div className="container mx-auto px-4 grid grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-white font-bold mb-4">ATENDIMENTO</h3>
            <ul className="space-y-2">
              <li><button onClick={onHelpClick} className="hover:text-white">Central de Ajuda</button></li>
              <li><button onClick={onHelpClick} className="hover:text-white">Como Comprar</button></li>
              <li><button onClick={onHelpClick} className="hover:text-white">Métodos de Pagamento</button></li>
              <li><button onClick={onHelpClick} className="hover:text-white">Garantia Mercafácil</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">SOBRE</h3>
            <ul className="space-y-2">
              <li><button onClick={() => onFooterLinkClick('about')} className="hover:text-white">Sobre o Mercafácil</button></li>
              <li><button onClick={() => onFooterLinkClick('privacy')} className="hover:text-white">Políticas de Privacidade</button></li>
              <li><button onClick={() => onFooterLinkClick('affiliates')} className="hover:text-white">Programa de Afiliados</button></li>
              <li><button onClick={() => onFooterLinkClick('flash')} className="hover:text-white">Ofertas Relâmpago</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">PAGAMENTO</h3>
            <div className="flex gap-2 flex-wrap">
              <div className="bg-white p-1 rounded w-10 h-6"></div>
              <div className="bg-white p-1 rounded w-10 h-6"></div>
              <div className="bg-white p-1 rounded w-10 h-6"></div>
              <div className="bg-white p-1 rounded w-10 h-6"></div>
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">SIGA-NOS</h3>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">📷</div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">📘</div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">🐦</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-base text-gray-500 mb-2">© 2025 Mercafácil Roraima. Todos os direitos reservados.</p>
          <div className="mt-4 inline-block px-6 py-2 border border-gray-700 rounded-full bg-gray-800/50">
            <span className="text-gray-400">Desenvolvido por </span>
            <span className="text-orange-500 font-bold">João Paulo Silva Dantas</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 pb-safe z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <button 
          onClick={() => setView(ViewState.HOME)}
          className={`flex flex-col items-center gap-1 ${currentView === ViewState.HOME ? 'text-orange-600' : 'text-gray-400'}`}
        >
          <Home size={20} />
          <span className="text-[10px]">Início</span>
        </button>
        <button 
          onClick={() => setView(ViewState.VENDOR)}
          className={`flex flex-col items-center gap-1 ${currentView === ViewState.VENDOR ? 'text-orange-600' : 'text-gray-400'}`}
        >
          <Store size={20} />
          <span className="text-[10px]">Loja</span>
        </button>
        {/* Mobile Registration/Login shortcut */}
        <button 
          onClick={onRegisterClick}
          className="flex flex-col items-center gap-1 text-gray-400 -mt-6"
        >
          <div className="bg-orange-600 text-white p-3 rounded-full shadow-lg border-4 border-gray-50">
            <UserPlus size={24} />
          </div>
          <span className="text-[10px] font-bold text-orange-600">Entrar</span>
        </button>
        <button 
          onClick={() => setView(ViewState.DRIVER)}
          className={`flex flex-col items-center gap-1 ${currentView === ViewState.DRIVER ? 'text-orange-600' : 'text-gray-400'}`}
        >
          <Bike size={20} />
          <span className="text-[10px]">Entregas</span>
        </button>
        <button 
          onClick={onHelpClick}
          className="flex flex-col items-center gap-1 text-gray-400"
        >
          <HelpCircle size={20} />
          <span className="text-[10px]">Ajuda</span>
        </button>
      </div>
    </div>
  );
};
