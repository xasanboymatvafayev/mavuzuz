import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { 
  ShoppingCart, Search, MessageSquare, Package, RotateCcw, X, Plus, Settings, 
  ShieldCheck, MapPin, ChevronLeft, ChevronRight, Heart, Share2, Star, 
  Truck, Info, Bell, Menu, Grid, List, Filter, ArrowUp, Zap, Sparkles, Percent,
  Eye, History, TrendingUp, Award, HelpCircle, Phone, Globe, Instagram, Send,
  Camera, CheckCircle2, Clock, Wallet, Trash, Gift
} from 'lucide-react';
import { Category, Product, CartItem, PromoCode, OrderData, StoreLocation, Review } from './types.ts';
import { 
  MOCK_PRODUCTS, MOCK_PROMOS, CATEGORIES, STORE_LOCATIONS, 
  getPriceString, generateId, APP_NAME, APP_VERSION, UI_STRINGS 
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
    priceRange: [0, 50000000]
  });
  const [activeTab, setActiveTab] = useState<'catalog' | 'reviews' | 'locations'>('catalog');
  const [recentViews, setRecentViews] = useState<string[]>([]);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.MainButton.setText('SAVATGA O\'TISH');
      tg.MainButton.onClick(() => setIsCartOpen(true));
      if (cartItems.length > 0) {
        tg.MainButton.show();
      } else {
        tg.MainButton.hide();
      }
    }
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
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
                           p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
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
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
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
    setTimeout(() => setNotification(null), 3500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentImgIndex(0);
    setRecentViews(prev => {
      const filtered = prev.filter(id => id !== product.id);
      return [product.id, ...filtered].slice(0, 5);
    });
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
        showNotification('Ulashishda xatolik yuz berdi');
      }
    } else {
      showNotification('Brauzeringiz ulashishni qo\'llab-quvvatlamaydi');
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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-12">
        <div className="w-32 h-32 relative mb-8">
          <div className="absolute inset-0 border-8 border-blue-100 rounded-full"></div>
          <div className="absolute inset-0 border-8 border-blue-700 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-blue-700 font-black text-3xl font-serif">MB</div>
        </div>
        <div className="text-center">
          <h2 className="font-serif text-3xl font-black text-slate-900 mb-2 tracking-tight">{APP_NAME}</h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-1 w-12 bg-blue-700 rounded-full"></span>
            <span className="h-1 w-4 bg-blue-300 rounded-full"></span>
            <span className="h-1 w-1 bg-blue-100 rounded-full"></span>
          </div>
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] animate-pulse">Sifat va Nafislik...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-2xl relative transition-all duration-700 overflow-x-hidden">
      {notification && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-12 duration-500 ${notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-blue-700 text-white'}`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} /> : <Zap size={20} />}
          <span className="text-sm font-black tracking-tight">{notification.message}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-50 px-5 py-5 flex items-center justify-between shadow-sm">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-2xl font-black text-blue-950 tracking-tighter leading-none">{APP_NAME}</h1>
            <div className="flex h-5 w-10 items-center justify-center rounded-full bg-blue-950 text-[8px] font-black text-white">PRO</div>
          </div>
          <button onClick={() => setActiveTab('locations')} className="mt-1.5 flex items-center gap-2 px-2.5 py-1 bg-blue-50/50 hover:bg-blue-100 transition-colors w-fit rounded-full group">
             <MapPin size={10} className="text-blue-700 group-hover:scale-110 transition-transform" />
             <span className="text-[10px] uppercase tracking-widest text-blue-700 font-black">{STORE_LOCATIONS[0].name}</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            className={`p-3 rounded-2xl transition-all ${isAdmin ? 'bg-orange-100 text-orange-600 shadow-inner scale-95' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
          >
            <Settings size={20} />
          </button>
          {isAdmin && (
            <button onClick={() => setIsAdminOpen(true)} className="p-3 rounded-2xl bg-blue-700 text-white shadow-xl active:scale-90 transition-all hover:bg-blue-800">
              <ShieldCheck size={20} />
            </button>
          )}
          <button onClick={() => setIsCartOpen(true)} className="relative p-3 rounded-2xl bg-blue-50 text-blue-950 shadow-sm active:scale-90 transition-all border border-blue-100/50 group">
            <ShoppingCart size={22} className="group-hover:rotate-6 transition-transform" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-bounce">
                {cartItems.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="px-5 py-6">
        <div className="flex gap-4 mb-8 overflow-x-auto no-scrollbar pb-2">
          <button onClick={() => setActiveTab('catalog')} className={`flex-shrink-0 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'catalog' ? 'bg-blue-950 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>Katalog</button>
          <button onClick={() => setActiveTab('reviews')} className={`flex-shrink-0 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'reviews' ? 'bg-blue-950 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>Sharhlar</button>
          <button onClick={() => setActiveTab('locations')} className={`flex-shrink-0 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'locations' ? 'bg-blue-950 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>Filiallar</button>
        </div>

        {activeTab === 'catalog' && (
          <>
            <div className="mb-10 overflow-hidden rounded-[40px] relative h-56 group cursor-pointer shadow-2xl">
              <img src="https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-950/40 to-transparent p-8 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-1 bg-white rounded-full"></span>
                  <span className="text-[10px] text-blue-100 font-black uppercase tracking-[0.4em]">New Season 2024</span>
                </div>
                <h2 className="text-3xl font-serif font-black text-white mb-2 leading-tight">Mavi Royal<br/>Collection</h2>
                <p className="text-blue-100/80 text-xs mb-6 font-medium max-w-[220px]">Har bir lahza uchun nafis va shohona obrazlar yaratish vaqti keldi.</p>
                <button className="w-fit bg-white text-blue-950 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all hover:bg-blue-50">To'plamni ko'rish</button>
              </div>
              <div className="absolute top-6 right-6 p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <TrendingUp size={24} className="text-white animate-pulse" />
              </div>
            </div>

            <div className="bg-slate-100/80 p-2 rounded-3xl flex mb-8 shadow-inner border border-slate-200/50">
              {CATEGORIES.slice(0, 4).map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as Category)} 
                  className={`flex-1 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex flex-col items-center gap-2.5 ${activeCategory === cat.id ? 'bg-white text-blue-950 shadow-xl scale-100' : 'text-slate-400 hover:text-slate-600 scale-95'}`}
                >
                  <div className={`p-2.5 rounded-xl transition-all duration-500 ${activeCategory === cat.id ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-300'}`}>
                    {cat.id === 'sotuv' && <Package size={18} />}
                    {cat.id === 'prokat' && <RotateCcw size={18} />}
                    {cat.id === 'new' && <Sparkles size={18} />}
                    {cat.id === 'sale' && <Percent size={18} />}
                  </div>
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex gap-3 mb-8">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="text"
                  placeholder="Qidiruv..."
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-[24px] py-5 pl-14 pr-6 text-sm focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all outline-none font-medium placeholder:text-slate-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="p-5 bg-slate-50/50 border border-slate-100 rounded-[24px] text-slate-400 hover:text-blue-700 transition-all hover:bg-white active:scale-90">
                {viewMode === 'grid' ? <List size={22} /> : <Grid size={22} />}
              </button>
            </div>

            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 gap-5' : 'grid-cols-1 gap-6'}`}>
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAdd={() => addToCart(product)}
                  onClick={() => handleProductSelect(product)}
                  viewMode={viewMode}
                  isWishlisted={wishlist.includes(product.id)}
                  onWishlist={() => toggleWishlist(product.id)}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-32 text-center animate-in fade-in duration-700">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100 group">
                  <Search size={40} className="text-slate-200 group-hover:scale-125 transition-transform duration-500" />
                </div>
                <h4 className="text-slate-900 font-black text-lg mb-2">Ma'lumot topilmadi</h4>
                <p className="text-slate-400 text-xs px-16 font-medium leading-relaxed">Siz qidirayotgan mahsulot hozirda bizning katalogimizda mavjud emas yoki qidiruv so'zi xato kiritilgan.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setActiveCategory('sotuv'); }}
                  className="mt-10 px-8 py-3 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors"
                >
                  Barcha kiyimlarga qaytish
                </button>
              </div>
            )}
            
            {recentViews.length > 0 && (
              <div className="mt-20">
                <div className="flex items-center justify-between mb-6 px-1">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <History size={16} className="text-blue-600" /> Oxirgi ko'rilganlar
                  </h3>
                  <button onClick={() => setRecentViews([])} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">Tozalash</button>
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                  {recentViews.map(id => {
                    const product = products.find(p => p.id === id);
                    if (!product) return null;
                    return (
                      <div key={id} onClick={() => handleProductSelect(product)} className="flex-shrink-0 w-24 group cursor-pointer">
                        <div className="aspect-square rounded-2xl overflow-hidden mb-2 border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
                          <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-800 truncate px-1">{product.name}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'reviews' && (
          <div className="py-4 animate-in slide-in-from-right duration-500">
            <div className="bg-blue-950 rounded-[40px] p-8 text-white mb-10 shadow-2xl relative overflow-hidden">
               <div className="relative z-10">
                 <div className="flex items-center gap-1.5 mb-4">
                   {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="white" className="text-white" />)}
                 </div>
                 <h2 className="text-3xl font-serif font-black mb-2 tracking-tight">Mijozlarimiz Bahosi</h2>
                 <p className="text-blue-200/80 text-xs font-medium max-w-[200px] mb-6">Minglab mamnun mijozlarimizning samimiy fikrlari bilan tanishing.</p>
                 <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-black">4.9</div>
                      <div className="text-[8px] uppercase font-black text-blue-300 tracking-widest">O'rtacha baho</div>
                    </div>
                    <div className="h-10 w-[1px] bg-blue-800"></div>
                    <div className="text-center">
                      <div className="text-3xl font-black">1.2k</div>
                      <div className="text-[8px] uppercase font-black text-blue-300 tracking-widest">Sharhlar soni</div>
                    </div>
                 </div>
               </div>
               <Award size={120} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
            </div>

            <div className="space-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 font-black text-sm">A</div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">Aziza Karimova</h4>
                        <div className="flex items-center gap-1 mt-1 text-orange-400">
                           <Star size={10} fill="currentColor" />
                           <Star size={10} fill="currentColor" />
                           <Star size={10} fill="currentColor" />
                           <Star size={10} fill="currentColor" />
                           <Star size={10} fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">2 kun avval</span>
                  </div>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed mb-4 italic">"Ko'ylak sifati kutganimdan ham a'lo chiqdi! Kelin ko'ylagi ijaraga oldim, barchasi ideal holatda edi. Rahmat!"</p>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[8px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                      <CheckCircle2 size={10} className="text-emerald-500" /> Tasdiqlangan mijoz
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-5 bg-white border-2 border-slate-100 rounded-[24px] text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-95">Sharh qoldirish</button>
          </div>
        )}

        {activeTab === 'locations' && (
          <div className="py-4 animate-in slide-in-from-left duration-500">
            <h2 className="text-2xl font-serif font-black text-slate-900 mb-8 tracking-tight px-1">Bizning Butiklarimiz</h2>
            <div className="space-y-8">
              {STORE_LOCATIONS.map(loc => (
                <div key={loc.id} className="group cursor-pointer">
                  <div className="relative h-56 rounded-[40px] overflow-hidden mb-6 shadow-xl border border-slate-100">
                    <img src={loc.id === 'loc1' ? 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800' : 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                    <div className="absolute top-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl">
                       <MapPin size={24} className="text-blue-700" />
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/50">
                       <h3 className="text-lg font-black text-slate-900 mb-1">{loc.name}</h3>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                         <MapPin size={10} /> {loc.address}
                       </p>
                    </div>
                  </div>
                  <div className="px-4 grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100/50 hover:bg-blue-50 transition-colors">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Clock size={14} className="text-blue-600" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Ish vaqti</span>
                      </div>
                      <p className="text-xs font-black text-slate-700 tracking-tight">{loc.workingHours}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100/50 hover:bg-blue-50 transition-colors">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Phone size={14} className="text-blue-600" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Bog'lanish</span>
                      </div>
                      <p className="text-xs font-black text-slate-700 tracking-tight">{loc.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-16 bg-blue-50/50 p-10 rounded-[48px] border border-blue-100/30 text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-300">
                <HelpCircle size={36} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Savollaringiz bormi?</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8 px-4">Bizning jamoamiz haftada 7 kun davomida sizga yordam berishga tayyor. Hoziroq bog'laning!</p>
              <button className="w-full bg-blue-700 text-white py-5 rounded-[24px] text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-all">Support bilan bog'lanish</button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 px-5 pb-16 bg-slate-50 py-16 border-t border-slate-100 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-blue-700 text-white rounded-2xl shadow-xl">
               <Truck size={24} />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 tracking-tight">VIP Yetkazib Berish</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Premium Xizmat</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-10 font-medium">
            MaviBoutique mijozlari uchun maxsus yetkazib berish xizmati. 10 million so'mdan yuqori xaridlar uchun O'zbekistonning barcha nuqtalariga mutlaqo bepul va xavfsiz yetkazib beramiz. Kiyimlaringiz maxsus g'iloflarda va ideal holatda yetib boradi.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500">
              <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <Wallet size={20} />
              </div>
              <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Qulay To'lov</h4>
              <p className="text-xs font-black text-slate-900">Naqd yoki Karta</p>
            </div>
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <Gift size={20} />
              </div>
              <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Bonuslar</h4>
              <p className="text-xs font-black text-slate-900">Loyalty Tizimi</p>
            </div>
          </div>
        </div>
        <Sparkles size={200} className="absolute -bottom-20 -left-20 text-blue-100/50" />
      </div>

      <button onClick={() => setIsAIOpen(true)} className="fixed bottom-8 right-8 w-18 h-18 sm:w-20 sm:h-20 bg-blue-700 text-white rounded-[28px] shadow-[0_20px_50px_rgba(29,78,216,0.3)] flex items-center justify-center z-50 hover:bg-blue-800 transition-all active:scale-90 group animate-in zoom-in duration-500">
        <MessageSquare size={32} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full animate-pulse shadow-lg"></span>
      </button>

      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-32 right-8 w-14 h-14 bg-white/80 backdrop-blur-md text-slate-900 rounded-full shadow-2xl flex items-center justify-center z-50 hover:bg-white transition-all animate-in fade-in zoom-in duration-500 border border-slate-100"
        >
          <ArrowUp size={24} />
        </button>
      )}

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        promoCodes={promoCodes}
        onRemove={(id) => {
          setCartItems(prev => prev.filter(x => x.id !== id));
          showNotification("Savatdan o'chirildi");
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
          <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-md transition-all duration-700" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-md bg-white rounded-t-[56px] sm:rounded-[56px] overflow-hidden animate-in slide-in-from-bottom duration-700 max-h-[96vh] flex flex-col shadow-[0_-20px_80px_rgba(0,0,0,0.4)]">
            <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden group">
              <img src={selectedProduct.images[currentImgIndex]} className="w-full h-full object-cover transition-all duration-1000 ease-in-out" />
              
              <div className="absolute top-8 left-8 flex gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(selectedProduct.id); }}
                  className={`p-4 rounded-3xl backdrop-blur-xl transition-all shadow-xl ${wishlist.includes(selectedProduct.id) ? 'bg-red-600 text-white' : 'bg-white/90 text-slate-900 hover:bg-white'}`}
                >
                  <Heart size={22} fill={wishlist.includes(selectedProduct.id) ? 'currentColor' : 'none'} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleShare(selectedProduct); }}
                  className="p-4 bg-white/90 backdrop-blur-xl rounded-3xl text-slate-900 hover:bg-white transition-all shadow-xl"
                >
                  <Share2 size={22} />
                </button>
              </div>

              {selectedProduct.images.length > 1 && (
                <>
                  <button onClick={prevImg} className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center text-slate-900 transition-all hover:bg-white shadow-2xl active:scale-90"><ChevronLeft size={32}/></button>
                  <button onClick={nextImg} className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center text-slate-900 transition-all hover:bg-white shadow-2xl active:scale-90"><ChevronRight size={32}/></button>
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 p-3 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl border border-white/20">
                    {selectedProduct.images.map((_, i) => (
                      <div key={i} className={`h-2 rounded-full transition-all duration-500 ${currentImgIndex === i ? 'w-10 bg-blue-700' : 'w-2 bg-slate-200'}`} />
                    ))}
                  </div>
                </>
              )}
              
              <button onClick={() => setSelectedProduct(null)} className="absolute top-8 right-8 bg-white/90 hover:bg-white backdrop-blur-xl p-3.5 rounded-full text-slate-900 transition-all shadow-xl active:scale-90"><X size={26} /></button>
            </div>
            
            <div className="p-10 pb-14 overflow-y-auto no-scrollbar flex-1 bg-white">
              <div className="flex justify-between items-start mb-8">
                <div className="flex-1 pr-6">
                   <div className="flex items-center gap-2.5 mb-3">
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-700 bg-blue-50 px-3 py-1 rounded-lg shadow-sm">{selectedProduct.category}</span>
                     <div className="flex items-center text-orange-400 gap-1 ml-2">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-black">{selectedProduct.rating}</span>
                        <span className="text-[10px] text-slate-300 ml-1">({selectedProduct.reviewsCount})</span>
                     </div>
                   </div>
                   <h3 className="font-serif text-3xl font-black text-slate-900 leading-[1.1] mb-2 tracking-tight">{selectedProduct.name}</h3>
                   <div className="flex items-center gap-3">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{selectedProduct.color}</span>
                     <span className="h-1 w-1 bg-slate-200 rounded-full"></span>
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{selectedProduct.fabric}</span>
                   </div>
                </div>
                <div className="text-right">
                   <div className="text-3xl font-black text-blue-900 tracking-tighter leading-none">{getPriceString(selectedProduct.price)}</div>
                   <div className="text-[9px] text-blue-300 font-black uppercase mt-2 tracking-widest">Sotuv Narxi</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-10">
                <div className="bg-slate-50/50 p-4 rounded-3xl flex flex-col items-center border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                  <span className="text-[8px] uppercase font-black text-slate-300 mb-1 tracking-widest">Brend</span>
                  <span className="text-[10px] font-black text-slate-700">{selectedProduct.brand}</span>
                </div>
                <div className="bg-slate-50/50 p-4 rounded-3xl flex flex-col items-center border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                  <span className="text-[8px] uppercase font-black text-slate-300 mb-1 tracking-widest">Mavsum</span>
                  <span className="text-[10px] font-black text-slate-700">{selectedProduct.season}</span>
                </div>
                <div className="bg-slate-50/50 p-4 rounded-3xl flex flex-col items-center border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                  <span className="text-[8px] uppercase font-black text-slate-300 mb-1 tracking-widest">Holat</span>
                  <span className="text-[10px] font-black text-emerald-600">Mavjud</span>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-blue-50 rounded-lg text-blue-700"><Info size={14} /></div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Mahsulot Tavsifi</h4>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{selectedProduct.longDescription}</p>
              </div>

              <div className="mb-12">
                <div className="flex items-center justify-between mb-5">
                   <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">O'lchamlar</h4>
                   <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-0.5">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedProduct.size.map(sz => (
                    <button key={sz} className="min-w-[60px] h-[60px] rounded-3xl border-2 border-slate-50 bg-slate-50/50 flex items-center justify-center font-black text-sm text-slate-700 hover:border-blue-700 hover:text-blue-700 hover:bg-white hover:shadow-xl transition-all active:scale-90">
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4 sticky bottom-0 bg-white/95 backdrop-blur-md pt-6 border-t border-slate-50 mt-4">
                <button 
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="flex-1 bg-blue-950 text-white py-6 rounded-[32px] font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(29,78,216,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 group"
                >
                  <ShoppingCart size={22} className="group-hover:translate-x-1 transition-transform" /> Savatga Qo'shish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto py-20 px-8 bg-blue-950 text-white flex flex-col items-center relative overflow-hidden">
        <div className="relative z-10 text-center">
          <h2 className="font-serif text-4xl font-black mb-3 tracking-tighter">{APP_NAME}</h2>
          <div className="flex items-center justify-center gap-2 mb-10">
            <span className="h-[1px] w-8 bg-blue-800"></span>
            <p className="text-blue-200/40 text-[9px] tracking-[0.5em] uppercase font-black">Nafislik ramzi</p>
            <span className="h-[1px] w-8 bg-blue-800"></span>
          </div>
          <div className="flex gap-4 mb-14">
            <div className="w-14 h-14 bg-white/5 rounded-[20px] flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer group hover:scale-110"><Instagram size={22} className="group-hover:rotate-12 transition-transform" /></div>
            <div className="w-14 h-14 bg-white/5 rounded-[20px] flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer group hover:scale-110"><Send size={22} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /></div>
            <div className="w-14 h-14 bg-white/5 rounded-[20px] flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer group hover:scale-110"><Globe size={22} className="group-hover:scale-110 transition-transform" /></div>
          </div>
          <div className="grid grid-cols-2 gap-y-6 gap-x-12 text-left mb-16">
            <div>
              <h4 className="text-[10px] font-black uppercase text-blue-300 tracking-[0.2em] mb-3">Bo'limlar</h4>
              <ul className="space-y-2 text-[10px] text-blue-200/50 font-black uppercase tracking-widest">
                <li className="hover:text-white cursor-pointer transition-colors">Yangi to'plam</li>
                <li className="hover:text-white cursor-pointer transition-colors">Sotuv</li>
                <li className="hover:text-white cursor-pointer transition-colors">Prokat</li>
                <li className="hover:text-white cursor-pointer transition-colors">Chegirmalar</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase text-blue-300 tracking-[0.2em] mb-3">Ma'lumot</h4>
              <ul className="space-y-2 text-[10px] text-blue-200/50 font-black uppercase tracking-widest">
                <li className="hover:text-white cursor-pointer transition-colors">Biz haqimizda</li>
                <li className="hover:text-white cursor-pointer transition-colors">Dostavka</li>
                <li className="hover:text-white cursor-pointer transition-colors">To'lovlar</li>
                <li className="hover:text-white cursor-pointer transition-colors">FAQ</li>
              </ul>
            </div>
          </div>
          <p className="text-[10px] text-blue-200/20 font-black tracking-[0.2em] uppercase leading-loose">
            &copy; 2024 MaviBoutique. Barcha huquqlar himoyalangan.<br/>
            Dizayn: Mavi Creative Lab • Versiya {APP_VERSION}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-800/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </footer>
      <div className="h-16" />
    </div>
  );
};

export default App;