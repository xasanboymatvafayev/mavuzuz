import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  ShoppingCart, Search, MessageSquare, Package, RotateCcw, X, Plus, Settings, 
  ShieldCheck, MapPin, ChevronLeft, ChevronRight, Heart, Share2, Star, 
  Truck, Info, ArrowUp, Zap, Sparkles, Percent, History, TrendingUp, Award, 
  HelpCircle, Phone, Globe, Instagram, Send, CheckCircle2, Clock, Wallet, Gift
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
  const [recentViews, setRecentViews] = useState<string[]>([]);

  // CloudStorage orqali saqlash
  const saveToCloud = (key: string, data: any) => {
    const stringData = JSON.stringify(data);
    if (window.Telegram?.WebApp?.CloudStorage) {
      window.Telegram.WebApp.CloudStorage.setItem(key, stringData, (err: any) => {
        if (err) console.error('Cloud Error:', err);
      });
    }
    localStorage.setItem(key, stringData);
  };

  useEffect(() => {
    const loadData = async () => {
      // Telegram CloudStorage'dan yuklash
      if (window.Telegram?.WebApp?.CloudStorage) {
        window.Telegram.WebApp.CloudStorage.getKeys((err: any, keys: string[]) => {
          if (!err && keys.includes('mavi_products')) {
            window.Telegram.WebApp.CloudStorage.getItem('mavi_products', (err2: any, value: string) => {
              if (!err2 && value) {
                try {
                  const parsed = JSON.parse(value);
                  // Agar baza bo'sh bo'lmasa, uni ishlatamiz
                  setProducts(parsed);
                } catch (e) {
                  setProducts(MOCK_PRODUCTS);
                }
              } else {
                setProducts(MOCK_PRODUCTS);
              }
              setIsLoaded(true);
            });
          } else {
            // Birinchi marta kirayotgan bo'lsa mock ma'lumotlarni yuklaymiz va saqlaymiz
            setProducts(MOCK_PRODUCTS);
            saveToCloud('mavi_products', MOCK_PRODUCTS);
            setIsLoaded(true);
          }
        });
      } else {
        const saved = localStorage.getItem('mavi_products');
        setProducts(saved ? JSON.parse(saved) : MOCK_PRODUCTS);
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

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const showNotification = (message: string, type: 'info' | 'success' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  if (!isLoaded) return <div className="h-screen flex items-center justify-center font-black text-blue-700 animate-pulse">MAVIBOUTIQUE...</div>;

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-x-hidden pb-20">
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full bg-blue-700 text-white shadow-2xl animate-bounce text-xs font-bold">
          {notification.message}
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b p-5 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl font-black text-blue-950">{APP_NAME}</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Premium Quality</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsAdmin(!isAdmin)} className={`p-2 rounded-xl ${isAdmin ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
            <Settings size={18} />
          </button>
          {isAdmin && <button onClick={() => setIsAdminOpen(true)} className="p-2 bg-blue-700 text-white rounded-xl"><ShieldCheck size={18} /></button>}
          <button onClick={() => setIsCartOpen(true)} className="relative p-2 bg-blue-50 text-blue-900 rounded-xl">
            <ShoppingCart size={20} />
            {cartItems.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full">{cartItems.length}</span>}
          </button>
        </div>
      </header>

      <div className="p-5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
          {CATEGORIES.slice(0, 4).map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCategory(cat.id as Category)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat.id ? 'bg-blue-950 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="text" placeholder="Qidiruv..." 
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 gap-4' : 'grid-cols-1 gap-4'}`}>
          {filteredProducts.map(p => (
            <ProductCard 
              key={p.id} product={p} 
              onAdd={() => addToCart(p)} 
              onClick={() => { setSelectedProduct(p); setCurrentImgIndex(0); }}
              viewMode={viewMode}
              isWishlisted={wishlist.includes(p.id)}
              onWishlist={() => toggleWishlist(p.id)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center text-slate-400 text-sm italic">Hozircha kiyimlar yo'q...</div>
        )}
      </div>

      <button onClick={() => setIsAIOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-blue-700 text-white rounded-2xl shadow-2xl flex items-center justify-center z-50">
        <MessageSquare size={24} />
      </button>

      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        products={products} 
        setProducts={updateProducts}
        promoCodes={promoCodes}
        setPromoCodes={setPromoCodes}
      />

      <Cart 
        isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} 
        items={cartItems} promoCodes={promoCodes}
        onRemove={(id) => setCartItems(prev => prev.filter(x => x.id !== id))}
        onUpdateQty={(id, d) => setCartItems(prev => prev.map(x => x.id === id ? {...x, quantity: Math.max(1, x.quantity+d)} : x))}
      />

      <AIStylist isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white w-full rounded-t-[40px] p-8 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-6">
              <img src={selectedProduct.images[currentImgIndex]} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 bg-white/80 p-2 rounded-full"><X size={20}/></button>
            </div>
            <h2 className="text-2xl font-serif font-bold mb-2">{selectedProduct.name}</h2>
            <p className="text-blue-700 font-black text-xl mb-4">{getPriceString(selectedProduct.price)}</p>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">{selectedProduct.longDescription}</p>
            <button 
              onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
              className="w-full bg-blue-900 text-white py-4 rounded-2xl font-bold shadow-xl"
            >
              Savatga Qo'shish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
