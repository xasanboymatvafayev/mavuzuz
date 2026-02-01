import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { 
  ShoppingCart, Search, MessageSquare, Package, RotateCcw, X, Plus, Settings, 
  ShieldCheck, MapPin, ChevronLeft, ChevronRight, Heart, Share2, Star, 
  Truck, Info, Bell, Menu, Grid, List, Filter, ArrowUp, Zap, Sparkles, Percent
} from 'lucide-react';
import { Category, Product, CartItem, PromoCode, OrderData, StoreLocation } from './types.ts';
import { 
  MOCK_PRODUCTS, MOCK_PROMOS, CATEGORIES, STORE_LOCATIONS, 
  getPriceString, generateId, APP_NAME, APP_VERSION 
} from './constants.tsx';
import ProductCard from './components/ProductCard.tsx';
import Cart from './components/Cart.tsx';
import AIStylist from './components/AIStylist.tsx';
import AdminPanel from './components/AdminPanel.tsx';

declare global {
  interface Window {
    Telegram: any;
  }
}

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(MOCK_PROMOS);
  const [activeCategory, setActiveCategory] = useState<Category>('sotuv');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoaded, setIsLoaded] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'info' | 'success'} | null>(null);
  const [activeFilter, setActiveFilter] = useState<{priceRange: [number, number], color?: string}>({
    priceRange: [0, 20000000]
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.MainButton.setText('SAVATNI KO\'RISH');
      tg.MainButton.onClick(() => setIsCartOpen(true));
      if (cartItems.length > 0) {
        tg.MainButton.show();
      } else {
        tg.MainButton.hide();
      }
    }
    
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [cartItems]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = p.price >= activeFilter.priceRange[0] && p.price <= activeFilter.priceRange[1];
      const matchesColor = !activeFilter.color || p.color === activeFilter.color;
      return matchesCategory && matchesSearch && matchesPrice && matchesColor;
    });
  }, [activeCategory, searchQuery, products, activeFilter]);

  const addToCart = useCallback((product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { 
        ...product, 
        quantity: 1, 
        selectedSize: product.size[0] || 'M', 
        selectedColor: product.color 
      }];
    });
    
    showNotification(`${product.name} savatga qo'shildi`, 'success');
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
  }, []);

  const showNotification = (message: string, type: 'info' | 'success' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async (product: Product) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href
        });
      } catch (err) {
        console.error('Sharing failed', err);
      }
    } else {
      alert('Ulashish funksiyasi brauzeringizda mavjud emas');
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <div className="w-24 h-24 relative mb-6">
          <div className="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-blue-600 font-bold">M</div>
        </div>
        <h2 className="font-serif text-2xl font-bold text-slate-900 animate-pulse">{APP_NAME}</h2>
        <p className="text-slate-400 text-sm mt-2 tracking-widest uppercase">Elegance Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl relative transition-opacity duration-500 overflow-x-hidden">
      {notification && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 ${notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}`}>
          <Zap size={18} />
          <span className="text-sm font-bold">{notification.message}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-50 px-4 py-4 flex items-center justify-between shadow-sm">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-extrabold text-blue-950 tracking-tight leading-none">{APP_NAME}</h1>
            <span className="text-[10px] bg-blue-900 text-white px-1.5 py-0.5 rounded font-black">PRO</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 w-fit rounded-full group cursor-pointer hover:bg-blue-100 transition-colors">
             <MapPin size={8} className="text-blue-600" />
             <span className="text-[9px] uppercase tracking-wider text-blue-600 font-bold">{STORE_LOCATIONS[0].address}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            className={`p-2.5 rounded-xl transition-all ${isAdmin ? 'bg-orange-100 text-orange-600 shadow-inner scale-95' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
          >
            <Settings size={18} />
          </button>
          {isAdmin && (
            <button onClick={() => setIsAdminOpen(true)} className="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg active:scale-90 transition-all animate-pulse">
              <ShieldCheck size={18} />
            </button>
          )}
          <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 rounded-xl bg-blue-50 text-blue-900 shadow-sm active:scale-90 transition-all border border-blue-100 group">
            <ShoppingCart size={20} className="group-hover:rotate-12 transition-transform" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">
                {cartItems.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="px-4 py-6">
        <div className="mb-8 overflow-hidden rounded-3xl relative h-40 group cursor-pointer">
          <img src="https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 to-transparent p-6 flex flex-col justify-center">
            <span className="text-[10px] text-blue-200 font-black uppercase tracking-[0.3em] mb-2">New Season</span>
            <h2 className="text-2xl font-serif font-bold text-white mb-1">Mavi 2024 Collection</h2>
            <p className="text-blue-100/70 text-xs mb-4">Har bir lahza uchun nafislik</p>
            <button className="w-fit bg-white text-blue-950 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Hozir ko'rish</button>
          </div>
        </div>

        <div className="bg-slate-100 rounded-2xl p-1.5 flex mb-6 shadow-inner">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as Category)} 
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex flex-col items-center gap-1.5 ${activeCategory === cat.id ? 'bg-white text-blue-900 shadow-lg' : 'text-slate-400'}`}
            >
              <div className="p-1.5 bg-slate-50 rounded-lg">
                {cat.id === 'sotuv' && <Package size={14} />}
                {cat.id === 'prokat' && <RotateCcw size={14} />}
                {cat.id === 'new' && <Sparkles size={14} />}
                {cat.id === 'sale' && <Percent size={14} />}
              </div>
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Qidiruv..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-4 focus:ring-blue-50 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-colors">
            {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
          </button>
          <button className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-colors">
            <Filter size={20} />
          </button>
        </div>

        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 gap-4' : 'grid-cols-1 gap-4'}`}>
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAdd={() => addToCart(product)}
              onClick={() => { setSelectedProduct(product); setCurrentImgIndex(0); }}
              viewMode={viewMode}
              isWishlisted={wishlist.includes(product.id)}
              onWishlist={() => toggleWishlist(product.id)}
            />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-24 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 group cursor-help">
                <Search size={32} className="text-slate-200 group-hover:scale-125 transition-transform" />
              </div>
              <h4 className="text-slate-900 font-bold mb-1">Hech narsa topilmadi</h4>
              <p className="text-slate-400 text-xs px-12">Qidiruv parametrlarini o'zgartirib ko'ring yoki katalogimizni boshidan ko'zdan kechiring.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('sotuv'); }}
                className="mt-6 text-blue-600 text-xs font-black uppercase tracking-widest border-b-2 border-blue-100 pb-1"
              >
                Filterni tozalash
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 px-6 pb-12 bg-slate-50 py-10">
        <div className="flex items-center gap-3 mb-6">
          <Truck className="text-blue-600" size={20} />
          <h3 className="font-bold text-slate-900">Bepul Yetkazib Berish</h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          10 million so'mdan yuqori buyurtmalar uchun O'zbekistonning barcha nuqtalariga mutlaqo bepul yetkazib beramiz. 
          Sizning nafisligingiz biz uchun birinchi o'rinda.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1">Markaz</h4>
            <p className="text-xs font-bold text-slate-800">Xiva Gipermarket</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1">Filial</h4>
            <p className="text-xs font-bold text-slate-800">Toshkent Siti</p>
          </div>
        </div>
      </div>

      <button onClick={() => setIsAIOpen(true)} className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-2xl shadow-blue-300 flex items-center justify-center z-50 hover:bg-blue-700 transition-all active:scale-95 group">
        <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span>
      </button>

      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-28 right-8 w-12 h-12 bg-white text-slate-800 rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-slate-50 transition-all animate-in fade-in zoom-in duration-300 border border-slate-100"
        >
          <ArrowUp size={20} />
        </button>
      )}

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        promoCodes={promoCodes}
        onRemove={(id) => {
          setCartItems(prev => prev.filter(x => x.id !== id));
          showNotification("Mahsulot savatdan o'chirildi");
        }}
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

      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] overflow-hidden animate-in slide-in-from-bottom duration-500 max-h-[95vh] flex flex-col shadow-2xl">
            <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden group">
              <img src={selectedProduct.images[currentImgIndex]} className="w-full h-full object-cover transition-all duration-700 ease-in-out" />
              
              <div className="absolute top-6 left-6 flex gap-2">
                <button 
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className={`p-3 rounded-2xl backdrop-blur-md transition-all ${wishlist.includes(selectedProduct.id) ? 'bg-red-500 text-white' : 'bg-black/20 text-white'}`}
                >
                  <Heart size={20} fill={wishlist.includes(selectedProduct.id) ? 'currentColor' : 'none'} />
                </button>
                <button 
                  onClick={() => handleShare(selectedProduct)}
                  className="p-3 bg-black/20 backdrop-blur-md rounded-2xl text-white hover:bg-black/40 transition-all"
                >
                  <Share2 size={20} />
                </button>
              </div>

              {selectedProduct.images.length > 1 && (
                <>
                  <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/10 hover:bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all scale-0 group-hover:scale-100"><ChevronLeft size={28}/></button>
                  <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/10 hover:bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all scale-0 group-hover:scale-100"><ChevronRight size={28}/></button>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/10 backdrop-blur-md rounded-full">
                    {selectedProduct.images.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${currentImgIndex === i ? 'w-8 bg-white' : 'w-1.5 bg-white/50'}`} />
                    ))}
                  </div>
                </>
              )}
              
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 bg-black/20 hover:bg-black/40 backdrop-blur-md p-2.5 rounded-full text-white transition-all"><X size={24} /></button>
            </div>
            
            <div className="p-8 pb-12 overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 pr-4">
                   <div className="flex items-center gap-1.5 mb-2">
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-2 py-0.5 rounded shadow-sm">{selectedProduct.category}</span>
                     <div className="flex items-center text-orange-400 gap-0.5 ml-2">
                        <Star size={10} fill="currentColor" />
                        <span className="text-[10px] font-bold">{selectedProduct.rating}</span>
                     </div>
                   </div>
                   <h3 className="font-serif text-3xl font-extrabold text-slate-900 leading-tight mb-1">{selectedProduct.name}</h3>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{selectedProduct.color} • {selectedProduct.fabric}</span>
                </div>
                <div className="text-right">
                   <div className="text-2xl font-black text-blue-900 leading-none">{getPriceString(selectedProduct.price)}</div>
                   <div className="text-[9px] text-blue-300 font-black uppercase mt-1">UZS / VALYUTA</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-8">
                <div className="bg-slate-50 p-3 rounded-2xl flex flex-col items-center border border-slate-100">
                  <span className="text-[8px] uppercase font-black text-slate-400 mb-1">Brend</span>
                  <span className="text-[10px] font-bold text-slate-700">{selectedProduct.brand}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl flex flex-col items-center border border-slate-100">
                  <span className="text-[8px] uppercase font-black text-slate-400 mb-1">Mavsum</span>
                  <span className="text-[10px] font-bold text-slate-700">{selectedProduct.season}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl flex flex-col items-center border border-slate-100">
                  <span className="text-[8px] uppercase font-black text-slate-400 mb-1">Holat</span>
                  <span className="text-[10px] font-bold text-emerald-600">{selectedProduct.available ? 'Mavjud' : 'Sotilgan'}</span>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Info size={14} className="text-blue-600" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">Tavsif</h4>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{selectedProduct.longDescription}</p>
              </div>

              <div className="mb-10">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 mb-4">O'lcham Tanlang</h4>
                <div className="flex gap-3">
                  {selectedProduct.size.map(sz => (
                    <button key={sz} className="w-12 h-12 rounded-2xl border-2 border-slate-100 flex items-center justify-center font-bold text-sm text-slate-700 hover:border-blue-600 hover:text-blue-600 transition-all active:scale-90">
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4 sticky bottom-0 bg-white pt-4 border-t border-slate-50">
                <button 
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="flex-1 bg-blue-950 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                >
                  <ShoppingCart size={20} className="group-hover:translate-x-1 transition-transform" /> Savatga Qo'shish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <footer className="mt-auto py-12 px-6 bg-blue-950 text-white flex flex-col items-center">
        <h2 className="font-serif text-3xl font-bold mb-2">{APP_NAME}</h2>
        <p className="text-blue-200/50 text-xs mb-8 tracking-widest uppercase">Premium Fashion Experience</p>
        <div className="flex gap-6 mb-10">
          <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"><Share2 size={18} /></div>
          <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"><Bell size={18} /></div>
          <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"><ShieldCheck size={18} /></div>
        </div>
        <p className="text-[10px] text-blue-200/30 text-center font-medium">
          &copy; 2024 MaviBoutique. Barcha huquqlar himoyalangan.<br/>
          Dizayn va ishlab chiqish: Mavi Creative Team • v{APP_VERSION}
        </p>
      </footer>
      <div className="h-14" />
    </div>
  );
};

export default App;