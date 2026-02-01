
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  ShoppingCart, Search, MessageSquare, Package, RotateCcw, X, Plus, Settings, 
  ShieldCheck, MapPin, ChevronLeft, ChevronRight, Heart, Share2, Star, 
  Truck, Info, ArrowUp, Zap, Sparkles, Percent, History, TrendingUp, Award, 
  HelpCircle, Phone, Globe, Instagram, Send, CheckCircle2, Clock, Wallet, Gift,
  Database, HardDrive, Cloud
} from 'lucide-react';
import { Category, Product, CartItem, PromoCode } from './types.ts';
import { 
  MOCK_PRODUCTS, MOCK_PROMOS, CATEGORIES, STORE_LOCATIONS, 
  getPriceString, APP_NAME, APP_VERSION
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
  const [products, setProducts] = useState<Product[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [storageType, setStorageType] = useState<'cloud' | 'local'>('local');
  
  // App state
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
  const [notification, setNotification] = useState<{message: string, type: 'info' | 'success'} | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'reviews' | 'locations'>('catalog');

  // Markaziy saqlash funksiyasi
  const saveToCloud = (key: string, data: any) => {
    const stringData = JSON.stringify(data);
    if (window.Telegram?.WebApp?.CloudStorage) {
      window.Telegram.WebApp.CloudStorage.setItem(key, stringData, (err: any) => {
        if (err) console.error('Cloud Sync Error:', err);
      });
    }
    localStorage.setItem(key, stringData);
  };

  useEffect(() => {
    const loadData = async () => {
      const isTG = !!window.Telegram?.WebApp?.CloudStorage;
      setStorageType(isTG ? 'cloud' : 'local');

      if (isTG) {
        // Telegram muhitida
        window.Telegram.WebApp.CloudStorage.getItem('mavi_initialized', (err: any, init: string) => {
          if (!err && init === 'true') {
            window.Telegram.WebApp.CloudStorage.getItem('mavi_products', (err2: any, val: string) => {
              setProducts(!err2 && val ? JSON.parse(val) : []);
              setIsLoaded(true);
            });
          } else {
            // Birinchi marta kirish
            setProducts(MOCK_PRODUCTS);
            saveToCloud('mavi_products', MOCK_PRODUCTS);
            saveToCloud('mavi_initialized', 'true');
            setIsLoaded(true);
          }
        });
      } else {
        // Oddiy brauzerda
        const init = localStorage.getItem('mavi_initialized');
        if (init === 'true') {
          const saved = localStorage.getItem('mavi_products');
          setProducts(saved ? JSON.parse(saved) : []);
        } else {
          setProducts(MOCK_PRODUCTS);
          localStorage.setItem('mavi_products', JSON.stringify(MOCK_PRODUCTS));
          localStorage.setItem('mavi_initialized', 'true');
        }
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  const updateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveToCloud('mavi_products', newProducts);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, products]);

  const addToCart = useCallback((product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, selectedSize: 'M', selectedColor: product.color }];
    });
    showNotification(`${product.name} savatga qo'shildi`, 'success');
  }, []);

  const showNotification = (message: string, type: 'info' | 'success' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  if (!isLoaded) return (
    <div className="h-screen flex flex-col items-center justify-center bg-blue-50">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-serif text-blue-900 font-bold animate-pulse tracking-widest uppercase text-xs">MaviBoutique yuklanmoqda...</p>
    </div>
  );

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-x-hidden pb-20">
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full bg-blue-700 text-white shadow-2xl animate-in slide-in-from-top duration-300 text-xs font-bold">
          {notification.message}
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b p-5 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="font-serif text-xl font-black text-blue-950">{APP_NAME}</h1>
          <div className="flex items-center gap-1">
            <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Premium Quality</span>
            {/* Fix: Wrapped Lucide icons in spans to provide tooltips since the 'title' prop is not supported directly by the icon components */}
            {storageType === 'local' && <span title="Local Storage"><HardDrive size={8} className="text-orange-400" /></span>}
            {storageType === 'cloud' && <span title="Cloud Sync Active"><Cloud size={8} className="text-blue-400" /></span>}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsAdmin(!isAdmin)} className={`p-2.5 rounded-xl transition-all ${isAdmin ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>
            <Settings size={18} />
          </button>
          {isAdmin && <button onClick={() => setIsAdminOpen(true)} className="p-2.5 bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-100"><ShieldCheck size={18} /></button>}
          <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 bg-blue-50 text-blue-900 rounded-xl hover:bg-blue-100 transition-colors">
            <ShoppingCart size={20} />
            {cartItems.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">{cartItems.length}</span>}
          </button>
        </div>
      </header>

      <div className="p-5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
          {CATEGORIES.slice(0, 4).map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCategory(cat.id as Category)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat.id ? 'bg-blue-950 text-white shadow-xl scale-105' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="text" placeholder="Kiyimlar bo'yicha qidiruv..." 
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 gap-5' : 'grid-cols-1 gap-5'}`}>
          {filteredProducts.map(p => (
            <ProductCard 
              key={p.id} product={p} 
              onAdd={() => addToCart(p)} 
              onClick={() => { setSelectedProduct(p); setCurrentImgIndex(0); }}
              viewMode={viewMode}
              isWishlisted={wishlist.includes(p.id)}
              onWishlist={() => setWishlist(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-32 text-center animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
              <Package size={24} className="text-slate-200" />
            </div>
            <h4 className="text-slate-900 font-bold mb-1">Hech narsa topilmadi</h4>
            <p className="text-slate-400 text-xs">Siz qidirayotgan kiyim hozircha mavjud emas.</p>
          </div>
        )}
      </div>

      <button onClick={() => setIsAIOpen(true)} className="fixed bottom-8 right-6 w-16 h-16 bg-blue-700 text-white rounded-2xl shadow-2xl flex items-center justify-center z-50 hover:bg-blue-800 transition-all active:scale-90 shadow-blue-200">
        <MessageSquare size={26} />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span>
      </button>

      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        products={products} 
        setProducts={updateProducts}
        promoCodes={promoCodes}
        setPromoCodes={setPromoCodes}
        storageType={storageType}
      />

      <Cart 
        isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} 
        items={cartItems} promoCodes={promoCodes}
        onRemove={(id) => setCartItems(prev => prev.filter(x => x.id !== id))}
        onUpdateQty={(id, d) => setCartItems(prev => prev.map(x => x.id === id ? {...x, quantity: Math.max(1, x.quantity+d)} : x))}
      />

      <AIStylist isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white w-full rounded-t-[40px] sm:rounded-[40px] p-0 overflow-hidden animate-in slide-in-from-bottom duration-500 max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="relative aspect-[4/5] bg-slate-100">
              <img src={selectedProduct.images[currentImgIndex]} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 bg-white/80 backdrop-blur-md p-2 rounded-full text-slate-900 shadow-xl"><X size={20}/></button>
              
              {selectedProduct.images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 p-2 bg-black/20 backdrop-blur-sm rounded-full">
                  {selectedProduct.images.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all ${currentImgIndex === i ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`} />
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-8 overflow-y-auto no-scrollbar flex-1">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-serif font-black text-slate-900 tracking-tight leading-none">{selectedProduct.name}</h2>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-2 py-1 rounded uppercase">{selectedProduct.category}</span>
              </div>
              
              <div className="flex items-center gap-2 mb-6">
                <p className="text-blue-900 font-black text-2xl tracking-tighter">{getPriceString(selectedProduct.price)}</p>
                {selectedProduct.category === 'prokat' && <p className="text-slate-400 text-xs">/ kuniga</p>}
              </div>

              <div className="flex gap-4 mb-8">
                <div className="flex-1 bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                  <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">O'lcham</p>
                  <p className="text-xs font-bold text-slate-700">{selectedProduct.size.join(', ')}</p>
                </div>
                <div className="flex-1 bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                  <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Rangi</p>
                  <p className="text-xs font-bold text-slate-700">{selectedProduct.color}</p>
                </div>
              </div>

              <div className="mb-10">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2">
                  <Info size={14} className="text-blue-600" /> Batafsil Ma'lumot
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{selectedProduct.longDescription}</p>
              </div>

              <button 
                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                <ShoppingCart size={20} /> Savatga Qo'shish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
