
import React, { useState } from 'react';
import { X, BookOpen, Truck, Store, ShieldCheck, CreditCard, HelpCircle, MessageCircle, Mail, Phone, Search, ChevronRight, UserPlus, MapPin, ShoppingBag, CheckCircle, Star, Zap, Lock, RotateCcw, PackageX, Headphones } from 'lucide-react';
import { Button } from './Button';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'overview' | 'client' | 'payments' | 'guarantee' | 'driver' | 'vendor' | 'admin';

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Início', icon: <HelpCircle size={18} /> },
    { id: 'client', label: 'Sou Cliente', icon: <BookOpen size={18} /> },
    { id: 'payments', label: 'Pagamentos', icon: <CreditCard size={18} /> },
    { id: 'guarantee', label: 'Garantia', icon: <ShieldCheck size={18} /> },
    { id: 'driver', label: 'Sou Entregador', icon: <Truck size={18} /> },
    { id: 'vendor', label: 'Sou Mercado', icon: <Store size={18} /> },
    { id: 'admin', label: 'Admin', icon: <Lock size={18} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] md:h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-orange-600 p-6 text-white flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <HelpCircle className="text-orange-200" />
              Central de Ajuda Mercafácil
            </h2>
            <p className="text-orange-100 mt-1 text-sm">
              Tudo o que você precisa saber para comprar, vender e entregar em Roraima.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs & Content Container */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar Tabs (Desktop) / Top Tabs (Mobile) */}
          <div className="hidden md:flex flex-col w-64 bg-gray-50 border-r border-gray-200 shrink-0 overflow-y-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-3 p-4 text-sm font-medium transition-colors text-left border-l-4 ${
                  activeTab === tab.id 
                    ? 'bg-white text-orange-600 border-orange-600 shadow-sm' 
                    : 'text-gray-600 border-transparent hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto bg-white p-6 md:p-8 scroll-smooth">
            
            {/* Mobile Tabs */}
            <div className="md:hidden flex overflow-x-auto gap-2 mb-6 pb-2 border-b border-gray-100 no-scrollbar">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* OVERVIEW TAB (LANDING) */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                {/* Welcome Search */}
                <div className="text-center max-w-lg mx-auto mb-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Olá! Como podemos te ajudar hoje?</h3>
                  <p className="text-gray-500 mb-6 text-sm">Busque por dúvidas sobre pedidos, pagamentos ou entregas.</p>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="Ex: Como rastrear meu pedido?" 
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* Quick Links Grid */}
                <div>
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen size={18} className="text-orange-600" />
                    Tópicos Populares
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div 
                      onClick={() => setActiveTab('payments')}
                      className="p-4 rounded-xl border border-gray-100 bg-orange-50/50 hover:bg-orange-50 hover:border-orange-200 transition-all cursor-pointer group"
                    >
                      <CreditCard className="text-orange-600 mb-3 group-hover:scale-110 transition-transform" />
                      <h5 className="font-bold text-gray-900 text-sm mb-1">Pagamentos</h5>
                      <p className="text-xs text-gray-600">PIX, cartões e prazos.</p>
                    </div>
                    <div 
                      onClick={() => setActiveTab('guarantee')}
                      className="p-4 rounded-xl border border-gray-100 bg-green-50/50 hover:bg-green-50 hover:border-green-200 transition-all cursor-pointer group"
                    >
                      <ShieldCheck className="text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                      <h5 className="font-bold text-gray-900 text-sm mb-1">Garantia</h5>
                      <p className="text-xs text-gray-600">Segurança em cada pedido.</p>
                    </div>
                    <div 
                      onClick={() => setActiveTab('client')}
                      className="p-4 rounded-xl border border-gray-100 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer group"
                    >
                      <Truck className="text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                      <h5 className="font-bold text-gray-900 text-sm mb-1">Entregas</h5>
                      <p className="text-xs text-gray-600">Prazos e áreas em Roraima.</p>
                    </div>
                  </div>
                </div>

                {/* Support Channels */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-4">Ainda precisa de ajuda?</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Button variant="outline" className="bg-white justify-start gap-3 h-auto py-3">
                      <div className="bg-green-100 p-2 rounded-full text-green-600"><MessageCircle size={18} /></div>
                      <div className="text-left">
                        <div className="font-bold text-sm text-gray-900">Chat Online</div>
                        <div className="text-xs text-gray-500">7h às 22h</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="bg-white justify-start gap-3 h-auto py-3">
                      <div className="bg-green-100 p-2 rounded-full text-green-600"><Phone size={18} /></div>
                      <div className="text-left">
                        <div className="font-bold text-sm text-gray-900">WhatsApp</div>
                        <div className="text-xs text-gray-500">Respostas rápidas</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="bg-white justify-start gap-3 h-auto py-3">
                      <div className="bg-orange-100 p-2 rounded-full text-orange-600"><Mail size={18} /></div>
                      <div className="text-left">
                        <div className="font-bold text-sm text-gray-900">Email</div>
                        <div className="text-xs text-gray-500">ajuda@mercafacil.rr</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* PAYMENTS TAB */}
            {activeTab === 'payments' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                <div className="border-b pb-4 mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">Métodos de Pagamento</h3>
                    <p className="text-gray-600 mt-1">Transparência e segurança em cada transação.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <h4 className="font-bold text-green-800 flex items-center gap-2 mb-3">
                      <Zap className="fill-green-600" size={20}/>
                      Pix (Aprovação Imediata)
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      O método mais rápido. Copie o código ou escaneie o QR Code no final do pedido. O pagamento é confirmado em segundos e seu pedido é liberado na hora.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-3">
                      <CreditCard size={20}/>
                      Cartões de Crédito e Débito
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Aceitamos as principais bandeiras (Visa, Mastercard, Elo, Hipercard). Para sua segurança, a análise pode levar alguns minutos.
                      <br/><span className="text-xs text-blue-600 font-semibold mt-2 block">* No momento, aceitamos apenas um cartão por pedido.</span>
                    </p>
                  </div>
                </div>

                <HelpSection number="!" title="Segurança Blindada" icon={<Lock size={18}/>}>
                  <p>Sua tranquilidade é nossa prioridade. Utilizamos <strong>criptografia de ponta a ponta</strong>. Seus dados de cartão nunca ficam salvos em nossos servidores e são processados diretamente pelo banco.</p>
                </HelpSection>

                <HelpSection number="?" title="Confirmação de Pagamento" icon={<CheckCircle size={18}/>}>
                  <p>
                    <strong>Pix:</strong> Instantâneo.<br/>
                    <strong>Cartão:</strong> Geralmente em segundos, mas pode levar alguns minutos dependendo da operadora do cartão.
                  </p>
                </HelpSection>

                <HelpSection number="$" title="Reembolsos e Estornos" icon={<RotateCcw size={18}/>}>
                  <p>Teve algum problema com o produto? Sem burocracia. Se o pedido for cancelado ou houver algum item em falta, o <strong>estorno é automático</strong>: volta para sua conta (Pix) ou como crédito na fatura (Cartão).</p>
                </HelpSection>
              </div>
            )}

            {/* GUARANTEE TAB */}
            {activeTab === 'guarantee' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                <div className="border-b pb-4 mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">Garantia Mercafácil</h3>
                    <p className="text-gray-600 mt-1">Sua compra protegida do início ao fim.</p>
                </div>

                <div className="bg-green-50 p-6 rounded-xl border border-green-200 mb-8 flex flex-col md:flex-row items-center gap-6">
                  <div className="bg-white p-4 rounded-full shadow-sm text-green-600">
                    <ShieldCheck size={48} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-green-800 mb-2">Compra Garantida</h4>
                    <p className="text-green-700 text-sm">
                      Seu dinheiro está seguro conosco. Só liberamos o pagamento ao mercado após a confirmação de que você recebeu tudo certo. Se algo der errado, <strong>devolvemos seu dinheiro</strong>.
                    </p>
                  </div>
                </div>

                <HelpSection number="1" title="Receba seu pedido ou seu dinheiro de volta" icon={<Truck size={18}/>}>
                  <p>Seu pedido não chegou? Atrasou muito além do previsto? Nós monitoramos tudo. Se a entrega não acontecer, o estorno é garantido. Simples assim, sem letras miúdas.</p>
                </HelpSection>

                <HelpSection number="2" title="Proteção contra erros e danos" icon={<PackageX size={18}/>}>
                  <p>O produto veio errado, estragado ou amassado? Não se preocupe! Tire uma foto e abra uma reclamação no app na hora. A gente analisa e providencia a troca ou o reembolso do item.</p>
                </HelpSection>

                <HelpSection number="3" title="Política de Reembolso Ágil" icon={<RotateCcw size={18}/>}>
                  <p>Problemas acontecem, mas a solução tem que ser rápida. Em caso de cancelamento ou erro confirmado, o valor volta para você rapidamente (Pix na conta ou estorno no cartão).</p>
                </HelpSection>

                <HelpSection number="4" title="Canal de Resolução" icon={<Headphones size={18}/>}>
                  <p>Teve um imprevisto? Nossa equipe de suporte age como intermediadora entre você e o mercado para garantir seus direitos. Estamos disponíveis via Chat e WhatsApp para resolver qualquer pendência.</p>
                </HelpSection>
              </div>
            )}

            {/* CLIENT TAB */}
            {activeTab === 'client' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                <div className="border-b pb-4 mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">Como Comprar no Mercafácil</h3>
                    <p className="text-gray-600 mt-1">Guia rápido para encher o carrinho e receber em casa.</p>
                </div>
                
                <HelpSection number="1" title="Crie sua conta rapidinho" icon={<UserPlus size={18}/>}>
                  <p>Baixe o app ou acesse o site. Clique em <strong>"Cadastre-se"</strong> e preencha seus dados. É só nome, email e senha. Assim você tem acesso a promoções e histórico de pedidos.</p>
                </HelpSection>

                <HelpSection number="2" title="Onde você está?" icon={<MapPin size={18}/>}>
                  <p>Antes de começar, selecione o seu <strong>município</strong> no topo da tela. O Mercafácil atende os 15 municípios de Roraima, e queremos mostrar apenas o que chega até você.</p>
                </HelpSection>

                <HelpSection number="3" title="Encontre o que precisa" icon={<Search size={18}/>}>
                  <p>Navegue pelas <strong>categorias</strong> (Açougue, Limpeza, Bebidas) ou digite o nome do produto na busca. Fique de olho na etiqueta <strong>"Oferta Relâmpago"</strong> para economizar!</p>
                </HelpSection>

                <HelpSection number="4" title="Encha o carrinho" icon={<ShoppingBag size={18}/>}>
                  <p>Gostou de algo? Clique em <strong>"Adicionar"</strong>. Você pode conferir todos os itens clicando no ícone do carrinho no canto superior. Lá você ajusta quantidades ou remove itens.</p>
                </HelpSection>

                <HelpSection number="5" title="Pagamento e Entrega" icon={<CreditCard size={18}/>}>
                  <p>Na hora de fechar, escolha como quer pagar (<strong>PIX ou Cartão</strong>). O sistema calcula o frete automaticamente pela distância. A entrega pode ser de moto, carro, bike ou até a pé!</p>
                </HelpSection>

                <HelpSection number="6" title="Acompanhe tudo" icon={<Truck size={18}/>}>
                  <p>Pedido feito? Relaxe! Você recebe notificações a cada etapa: <strong>Confirmado → Em Rota → Entregue</strong>. Dá para ver onde o entregador está.</p>
                </HelpSection>

                <HelpSection number="7" title="Avalie a experiência" icon={<Star size={18}/>}>
                  <p>Chegou certinho? Dê <strong>5 estrelas</strong> para o entregador e para o mercado. Sua opinião ajuda a manter a qualidade lá em cima!</p>
                </HelpSection>
              </div>
            )}

            {/* DRIVER TAB */}
            {activeTab === 'driver' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                <h3 className="text-2xl font-bold text-gray-900 border-b pb-4">Parceiro Entregador</h3>
                
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-6">
                  <h4 className="font-bold text-orange-800 flex items-center gap-2 mb-2">
                    <Truck size={18}/>
                    Modalidades Flexíveis
                  </h4>
                  <p className="text-sm text-orange-700">
                    No Mercafácil, você pode entregar de <strong>Moto, Carro, Bicicleta ou até a Pé</strong> (para curtas distâncias). O importante é agilidade!
                  </p>
                </div>

                <HelpSection number="1" title="Cadastro e Aprovação">
                  <p>Cadastre-se no app "Mercafácil Entregador". Envie seus documentos. Nossa equipe valida seu perfil em até 24h para garantir segurança.</p>
                </HelpSection>

                <HelpSection number="2" title="Ganhos e Níveis">
                  <p>Ganhe por entrega realizada + gorjetas. Acumule pontos para subir de nível (Bronze → Platina). Níveis mais altos têm prioridade e bônus exclusivos.</p>
                </HelpSection>
              </div>
            )}

            {/* VENDOR TAB */}
            {activeTab === 'vendor' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                <h3 className="text-2xl font-bold text-gray-900 border-b pb-4">Supermercados Parceiros</h3>
                
                <HelpSection number="1" title="Digitalize seu Estoque">
                  <p>Use nossa ferramenta de IA para cadastrar produtos apenas tirando uma foto. O Mercafácil reconhece o item e sugere preço e descrição.</p>
                </HelpSection>

                <HelpSection number="2" title="Gestão de Pedidos">
                  <p>Receba pedidos em tempo real no Painel do Lojista. Aceite, separe e despache para o entregador parceiro que chegará em minutos.</p>
                </HelpSection>
              </div>
            )}

            {/* ADMIN TAB */}
            {activeTab === 'admin' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                <h3 className="text-2xl font-bold text-gray-900 border-b pb-4">Administração</h3>
                <p className="text-gray-600">Acesso restrito para gestão da plataforma, moderação de usuários e controle financeiro.</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-4 border rounded bg-gray-50">
                        <div className="font-bold text-gray-700">Aprovar Parceiros</div>
                        <div className="text-xs text-gray-500">Validar documentos de mercados e drivers.</div>
                    </div>
                    <div className="p-4 border rounded bg-gray-50">
                        <div className="font-bold text-gray-700">Financeiro</div>
                        <div className="text-xs text-gray-500">Gerir repasses e comissões (10/10/80).</div>
                    </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Sub-component for Tutorial Sections
const HelpSection: React.FC<{number: string, title: string, children: React.ReactNode, icon?: React.ReactNode}> = ({ number, title, children, icon }) => (
  <div className="flex gap-4 group">
    <div className="shrink-0 w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-colors">
      {icon ? icon : number}
    </div>
    <div>
      <h4 className="font-bold text-gray-900 text-lg mb-1 flex items-center gap-2">
        {title}
        <ChevronRight size={16} className="text-gray-300 group-hover:text-orange-500 transition-colors" />
      </h4>
      <div className="text-gray-600 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);
