
import React, { useState } from 'react';
import { Star, X, MessageSquare, ThumbsUp } from 'lucide-react';
import { Button } from './Button';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  targetName: string; // Who are we reviewing? (e.g. "Mercado Central" or "João Entregador")
  targetRole: 'Motorista' | 'Mercado' | 'Cliente';
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit, targetName, targetRole }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, comment);
    // Reset for next time
    setRating(0);
    setComment('');
  };

  const getRatingLabel = () => {
    switch (hoverRating || rating) {
      case 1: return 'Ruim';
      case 2: return 'Razoável';
      case 3: return 'Bom';
      case 4: return 'Muito Bom';
      case 5: return 'Excelente!';
      default: return 'Toque para avaliar';
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600">
            <Star size={32} fill="currentColor" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-1">Avaliar {targetRole}</h3>
          <p className="text-gray-500 text-sm mb-6">Como foi sua experiência com <strong>{targetName}</strong>?</p>

          {/* Stars */}
          <div className="flex justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star 
                  size={36} 
                  className={`${(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-100'}`} 
                />
              </button>
            ))}
          </div>
          <p className="text-sm font-medium text-yellow-600 mb-6 min-h-[20px]">{getRatingLabel()}</p>

          {/* Comment */}
          <div className="relative mb-6">
            <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 pl-10 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none bg-gray-50"
              placeholder="Escreva um comentário (opcional)..."
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={rating === 0} 
            className="w-full py-3 bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar Avaliação
          </Button>
        </div>
      </div>
    </div>
  );
};
