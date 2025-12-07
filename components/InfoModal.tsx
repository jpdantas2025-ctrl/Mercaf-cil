import React from 'react';
import { X, Info, Shield, Users, Zap } from 'lucide-react';

export type InfoModalType = 'about' | 'privacy' | 'affiliates' | 'flash' | null;

interface InfoModalProps {
  type: InfoModalType;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const content = {
    about: {
      title: 'Sobre o Mercafácil',
      icon: <Info className="text-blue-500" size={24} />,
      body: (
        <div className="space-y-4 text-gray-600">
          <p>
            O <strong>Mercafácil</strong> é o maior marketplace de supermercados de Roraima, nascido com o propósito de conectar a tecnologia à tradição do comércio local.
          </p>
          <p>
            Atendemos <strong>Boa Vista e os 14 municípios do interior</strong>, garantindo que produtos frescos, itens de mercearia e utilidades cheguem à sua porta com rapidez e segurança.
          </p>
          <h4 className="font-bold text-gray-800">Nossa Missão</h4>
          <p>Simplificar a vida dos roraimenses através da tecnologia, fomentando a economia local e gerando oportunidades para entregadores e pequenos comerciantes.</p>
        </div>
      )
    },
    privacy: {
      title: 'Políticas de Privacidade',
      icon: <Shield className="text-green-500" size={24} />,
      body: (
        <div className="space-y-4 text-gray-600">
          <p>
            No Mercafácil, a segurança dos seus dados é inegociável. Estamos em total conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li><strong>Coleta de Dados:</strong> Apenas o necessário para processar seu pedido e entrega.</li>
            <li><strong>Pagamentos Seguros:</strong> Transações processadas por gateways criptografados. Não armazenamos números de cartão.</li>
            <li><strong>Compartilhamento:</strong> Seus dados de entrega são compartilhados apenas com o motorista parceiro durante o pedido ativo.</li>
          </ul>
          <p className="text-xs mt-4">Para solicitar a exclusão dos seus dados, entre em contato com nosso suporte.</p>
        </div>
      )
    },
    affiliates: {
      title: 'Programa de Afiliados',
      icon: <Users className="text-purple-500" size={24} />,
      body: (
        <div className="space-y-4 text-gray-600">
          <p>
            Transforme sua influência em renda extra! O <strong>Programa de Afiliados Mercafácil</strong> é feito para criadores de conteúdo, líderes comunitários e quem ama indicar coisas boas.
          </p>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h4 className="font-bold text-purple-800 mb-2">Como funciona?</h4>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Cadastre-se gratuitamente no menu "Minha Conta".</li>
              <li>Receba seu link exclusivo de indicação.</li>
              <li>Ganhe <strong>R$ 10,00</strong> a cada novo cliente que fizer a primeira compra pelo seu link.</li>
            </ol>
          </div>
        </div>
      )
    },
    flash: {
      title: 'Ofertas Relâmpago',
      icon: <Zap className="text-yellow-500" size={24} />,
      body: (
        <div className="space-y-4 text-gray-600">
          <p>
            As <strong>Ofertas Relâmpago</strong> são promoções agressivas com estoque limitado e duração curta (geralmente 4h ou 6h).
          </p>
          <div className="flex items-center gap-3 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <Zap className="text-yellow-600" />
            <p className="text-sm text-yellow-800 font-bold">Descontos de até 60%!</p>
          </div>
          <p className="mt-4 font-semibold">Regras:</p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Limite de unidades por CPF para garantir que todos aproveitem.</li>
            <li>O item deve ser finalizado no checkout antes que o tempo acabe. Colocar no carrinho não reserva o produto.</li>
          </ul>
        </div>
      )
    }
  };

  const current = content[type];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 relative">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full shadow-sm">
              {current.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{current.title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {current.body}
          <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
            <button onClick={onClose} className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors">
              Entendi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};