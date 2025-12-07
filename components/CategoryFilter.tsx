
import React from 'react';
import { Store } from 'lucide-react';

interface CategoryFilterProps {
  categories: { name: string; icon: string }[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  getIcon: (categoryName: string) => React.ReactNode;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, activeCategory, onSelectCategory, getIcon }) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar items-center">
      {/* 'Todos' Option */}
      <button 
        onClick={() => onSelectCategory('Todos')}
        className={`flex flex-col items-center min-w-[85px] p-3 rounded-2xl transition-all duration-300 border ${
          activeCategory === 'Todos' 
            ? 'bg-orange-600 text-white shadow-lg transform scale-105 border-orange-600' 
            : 'bg-white text-gray-500 border-gray-100 hover:border-orange-200 hover:shadow-md'
        }`}
      >
        <div className={`p-2 rounded-full mb-1 ${activeCategory === 'Todos' ? 'bg-white/20' : 'bg-gray-50'}`}>
            <Store size={20} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wide">Todos</span>
      </button>

      {/* Dynamic Categories */}
      {categories.map(cat => (
        <button 
          key={cat.name}
          onClick={() => onSelectCategory(cat.name)}
          className={`flex flex-col items-center min-w-[85px] p-3 rounded-2xl transition-all duration-300 border ${
            activeCategory === cat.name 
              ? 'bg-orange-600 text-white shadow-lg transform scale-105 border-orange-600' 
              : 'bg-white text-gray-500 border-gray-100 hover:border-orange-200 hover:shadow-md'
          }`}
        >
          <div className={`p-2 rounded-full mb-1 ${activeCategory === cat.name ? 'bg-white/20' : 'bg-gray-50'}`}>
            {getIcon(cat.name)}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wide truncate w-full text-center">{cat.name}</span>
        </button>
      ))}
    </div>
  );
};
