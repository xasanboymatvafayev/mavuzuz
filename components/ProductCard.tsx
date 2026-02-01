
import React from 'react';
import { Plus, RotateCcw, Package, Layers, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: () => void;
  onClick: () => void;
  // Added missing props required by App.tsx
  viewMode: 'grid' | 'list';
  isWishlisted: boolean;
  onWishlist: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAdd, 
  onClick,
  viewMode,
  isWishlisted,
  onWishlist
}) => {
  const isList = viewMode === 'list';

  return (
    <div 
      className={`group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-blue-100 transition-all cursor-pointer shadow-sm hover:shadow-md ${isList ? 'flex h-32' : 'flex flex-col'}`}
      onClick={onClick}
    >
      <div className={`relative ${isList ? 'w-32' : 'aspect-[4/5]'} overflow-hidden`}>
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2 right-2 flex justify-between">
          <div className="flex gap-1">
             {product.images.length > 1 && (
               <span className="bg-black/40 backdrop-blur-md text-white text-[9px] px-1.5 py-0.5 rounded-md flex items-center gap-1">
                 <Layers size={10} /> {product.images.length}
               </span>
             )}
          </div>
          {/* Wishlist toggle button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onWishlist();
            }}
            className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${isWishlisted ? 'bg-red-500 text-white' : 'bg-black/20 text-white hover:bg-black/40'}`}
          >
            <Heart size={12} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      <div className={`p-3 flex flex-col flex-1 min-w-0 ${isList ? 'justify-center' : ''}`}>
        <div className="mb-1">
          {product.category === 'prokat' ? (
            <span className="bg-blue-600/90 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter flex items-center gap-1 w-fit">
              <RotateCcw size={10} /> Prokat
            </span>
          ) : (
            <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter flex items-center gap-1 w-fit">
              <Package size={10} /> Sotuv
            </span>
          )}
        </div>
        <h3 className="text-sm font-semibold text-slate-800 truncate mb-1">{product.name}</h3>
        {!isList && <p className="text-[10px] text-slate-500 line-clamp-1 mb-2 leading-tight">{product.description}</p>}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs font-bold text-blue-700">{product.price.toLocaleString()} so'm</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
