
import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Search, MessageSquare, Package, RotateCcw, X, Plus, Settings, ShieldCheck, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Category, Product, CartItem, PromoCode } from './types';
import { MOCK_PRODUCTS } from './constants';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import AIStylist from './components/AIStylist';
import AdminPanel from './components/AdminPanel';

declare global {
  interface Window {
    Telegram: any;
  }
}

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([{ code: 'MAVI2024', discountPercent: 10 }]);
  
  const [activeCategory, setActiveCategory] = useState<Category>('sotuv');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.category === activeCategory && 
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [activeCategory, searchQuery, products]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
  };

  const nextImg = () => {
    if (selectedProduct) {
      setCurrentImgIndex((prev) => (prev + 1) % selectedProduct.images.length);
    }
  };

  const prevImg = () => {
    if (selectedProduct) {
      setCurrentImgIndex((prev) => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length);
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl relative">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-50 px-4 py-4 flex items-center justify-between shadow-sm">
        <div className="flex flex-col">
          <h1 className="font-serif text-2xl font-extrabold text-blue-950 tracking-tight leading-none">MaviBoutique</h1>
          <div className="mt-1 flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 w-fit rounded-full">
             <MapPin size={8} className="text-blue-600" />
             <span className="text-[9px] uppercase tracking-wider text-blue-600 font-bold">Xiva, Gipermarket 2-qavat</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            className={`p-2.5 rounded-xl transition-all ${isAdmin ? 'bg-orange-100 text-orange-600 shadow-inner' : 'bg-slate-50 text-slate-400'}`}
          >
            <Settings size={18} />
          </button>
          {isAdmin && (
            <button onClick={() => setIsAdminOpen(true)} className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg active:scale-90 transition-all">
              <ShieldCheck size={18} />
            </button>
          )}
          <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 rounded-xl bg-blue-50 text-blue-900 shadow-sm active:scale-90 transition-all border border-blue-100">
            <ShoppingCart size={20} />
            {cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {cartItems.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="px-4 py-6">
        <div className="bg-slate-100 rounded-2xl p-1.5 flex mb-6 shadow-inner">
          <button onClick={() => setActiveCategory('sotuv')} className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeCategory === 'sotuv' ? 'bg-white text-blue-900 shadow-lg' : 'text-slate-400'}`}>
            <Package size={14} /> Sotuv
          </button>
          <button onClick={() => setActiveCategory('prokat')} className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeCategory === 'prokat' ? 'bg-white text-blue-900 shadow-lg' : 'text-slate-400'}`}>
            <RotateCcw size={14} /> Prokat
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Kiyimlarni qidirish..."
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 pl-12 pr-4 text-sm focus:ring-4 focus:ring-blue-50 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAdd={() => addToCart(product)}
              onClick={() => { setSelectedProduct(product); setCurrentImgIndex(0); }}
            />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-2 py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-slate-200" />
              </div>
              <p className="text-slate-400 text-sm font-medium">Hech narsa topilmadi...</p>
            </div>
          )}
        </div>
      </div>

      <button onClick={() => setIsAIOpen(true)} className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-2xl shadow-blue-300 flex items-center justify-center z-50 hover:bg-blue-700 transition-all active:scale-95 group">
        <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span>
      </button>

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        promoCodes={promoCodes}
        onRemove={(id) => setCartItems(prev => prev.filter(x => x.id !== id))}
        onUpdateQty={(id, d) => setCartItems(prev => prev.map(x => x.id === id ? {...x, quantity: Math.max(1, x.quantity+d)} : x))}
      />

      <AIStylist isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
      
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)}
        products={products}
        setProducts={setProducts}
        promoCodes={promoCodes}
        setPromoCodes={setPromoCodes}
      />

      {/* Product Detail Modal / Ruletka */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] overflow-hidden animate-in slide-in-from-bottom duration-500 max-h-[95vh] flex flex-col shadow-2xl">
            <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden">
              <img src={selectedProduct.images[currentImgIndex]} className="w-full h-full object-cover transition-all duration-700 ease-in-out" />
              
              {selectedProduct.images.length > 1 && (
                <>
                  <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/10 hover:bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"><ChevronLeft size={28}/></button>
                  <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/10 hover:bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"><ChevronRight size={28}/></button>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/20 backdrop-blur-md rounded-full">
                    {selectedProduct.images.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${currentImgIndex === i ? 'w-8 bg-white' : 'w-1.5 bg-white/50'}`} />
                    ))}
                  </div>
                </>
              )}
              
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 bg-black/20 hover:bg-black/40 backdrop-blur-md p-2.5 rounded-full text-white transition-all"><X size={24} /></button>
            </div>
            
            <div className="p-8 pb-12">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 pr-4">
                   <h3 className="font-serif text-3xl font-extrabold text-slate-900 leading-tight mb-2">{selectedProduct.name}</h3>
                   <div className="flex items-center gap-2">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{selectedProduct.category}</span>
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{selectedProduct.color}</span>
                   </div>
                </div>
                <div className="text-right">
                   <div className="text-2xl font-black text-blue-900 leading-none">{selectedProduct.price.toLocaleString()}</div>
                   <div className="text-[9px] text-blue-300 font-black uppercase mt-1">SO'M / UZS</div>
                </div>
              </div>
              
              <p className="text-slate-500 text-sm mb-10 leading-relaxed font-medium">{selectedProduct.description}</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="flex-1 bg-blue-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={20} /> Savatga Qo'shish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="h-14" />
    </div>
  );
};

export default App;
