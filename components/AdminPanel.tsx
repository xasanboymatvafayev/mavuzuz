import React, { useState } from 'react';
import { X, Plus, Trash2, Tag, Edit2, Lock, Image as ImageIcon, HardDrive, Cloud, AlertCircle, RefreshCw } from 'lucide-react';
import { Product, PromoCode, Category } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  setProducts: (newProducts: Product[]) => void;
  promoCodes: PromoCode[];
  setPromoCodes: React.Dispatch<React.SetStateAction<PromoCode[]>>;
  storageType: 'cloud' | 'local';
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, products, setProducts, promoCodes, setPromoCodes, storageType }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'promos'>('products');
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ category: 'sotuv', size: ['M'], available: true, images: [] });
  const [newPromo, setNewPromo] = useState<PromoCode>({ 
    code: '', 
    discountPercent: 0,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    minOrderAmount: 0,
    isActive: true,
    usageLimit: 1000,
    currentUsage: 0,
    description: 'Manual added promo'
  });

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'vercel1') {
      setIsAuthenticated(true);
    } else {
      alert("Noto'g'ri parol!");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewProduct(prev => ({
            ...prev,
            images: [...(prev.images || []), reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || (newProduct.images?.length === 0)) {
      alert("Ma'lumotlarni to'liq kiriting (kamida 1 ta rasm)");
      return;
    }
    const p: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProduct.name!,
      description: newProduct.description || '',
      longDescription: newProduct.description || '',
      price: Number(newProduct.price),
      images: newProduct.images || [],
      category: newProduct.category as Category,
      size: newProduct.size || ['M'],
      color: newProduct.color || 'Standart',
      fabric: 'Standart',
      season: 'Barcha fasllar',
      brand: 'Mavi Exclusive',
      available: true,
      rating: 5,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
      tags: [],
      stock: 10,
      sku: `MAVI-${Date.now()}`,
      careInstructions: 'Quruq tozalash',
      materials: [{ material: 'Unknown', percentage: 100 }],
      specifications: {
        length: 'N/A',
        waist: 'N/A',
        shoulders: 'N/A',
        bust: 'N/A',
        hips: 'N/A',
        sleeve: 'N/A'
      }
    };
    setProducts([p, ...products]);
    setNewProduct({ category: 'sotuv', size: ['M'], available: true, images: [] });
    alert("Kiyim katalogga qo'shildi!");
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Lock className="text-blue-600" size={32} />
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">Admin Kirish</h2>
            <p className="text-slate-500 text-sm mb-6">Boshqaruv paneli uchun parolni kiriting</p>
            <form onSubmit={handleLogin} className="w-full space-y-4">
              <input 
                type="password" 
                placeholder="Parol" 
                className="w-full p-4 bg-slate-100 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-100 transition-all font-bold tracking-widest text-center"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
              />
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all">
                Kirish
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex flex-col">
            <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Edit2 size={18} className="text-blue-600" /> Admin Panel
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              {storageType === 'cloud' ? (
                <span className="text-[8px] font-black uppercase text-blue-600 flex items-center gap-1 bg-blue-50 px-1.5 py-0.5 rounded">
                  <Cloud size={8} /> Telegram Cloud Sync Yoqilgan
                </span>
              ) : (
                <span className="text-[8px] font-black uppercase text-orange-600 flex items-center gap-1 bg-orange-50 px-1.5 py-0.5 rounded">
                  <HardDrive size={8} /> Local Storage (Faqat shu brauzerda)
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
        </div>

        {storageType === 'local' && (
          <div className="mx-4 mt-4 p-3 bg-orange-50 border border-orange-100 rounded-xl flex gap-3 items-start animate-pulse">
            <AlertCircle size={16} className="text-orange-600 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-orange-700 font-medium leading-tight">
              Siz hozirda oddiy brauzerda (noutbukda) ishlayapsiz. Qo'shgan kiyimlaringiz boshqa foydalanuvchilarga (va telefoningizga) ko'rinishi uchun ularni Telegram ilovasi ichida turib qo'shishingiz tavsiya etiladi.
            </p>
          </div>
        )}

        <div className="flex bg-slate-100 p-1 m-4 rounded-xl">
          <button onClick={() => setActiveTab('products')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'products' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>Katalog</button>
          <button onClick={() => setActiveTab('promos')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'promos' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>Promokodlar</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
          {activeTab === 'products' ? (
            <>
              <div className="bg-slate-50 p-5 rounded-2xl space-y-4 border border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yangi kiyim qo'shish</h3>
                
                <div className="grid grid-cols-4 gap-2">
                  {newProduct.images?.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-white">
                      <img src={img} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setNewProduct(prev => ({ ...prev, images: prev.images?.filter((_, idx) => idx !== i) }))}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg shadow-lg"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-400 cursor-pointer transition-colors bg-white">
                    <ImageIcon size={20} />
                    <span className="text-[8px] font-black uppercase mt-1">Rasm</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>

                <input 
                  type="text" placeholder="Kiyim nomi" className="w-full p-3.5 rounded-xl bg-white border border-slate-100 outline-none text-sm font-bold"
                  value={newProduct.name || ''} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
                <textarea 
                  placeholder="Kiyim haqida qisqacha tavsif" className="w-full p-3.5 rounded-xl bg-white border border-slate-100 outline-none text-sm min-h-[80px] font-medium"
                  value={newProduct.description || ''} onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                />
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="number" placeholder="Narxi" className="w-full p-3.5 rounded-xl bg-white border border-slate-100 outline-none text-sm font-bold"
                      value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">UZS</span>
                  </div>
                  <select 
                    className="p-3.5 rounded-xl bg-white border border-slate-100 outline-none text-sm font-bold"
                    value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})}
                  >
                    <option value="sotuv">Sotuv</option>
                    <option value="prokat">Prokat</option>
                    <option value="new">Yangi</option>
                  </select>
                </div>
                <button onClick={handleAddProduct} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all">
                  <Plus size={18} /> Katalogga Qo'shish
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hozirgi katalog ({products.length})</h4>
                  <button onClick={() => {if(confirm("Barcha kiyimlarni o'chirishni xohlaysizmi?")) setProducts([])}} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600">Hammasini o'chirish</button>
                </div>
                {products.length === 0 ? (
                  <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                    <p className="text-xs text-slate-400 italic font-medium">Katalog bo'sh. Kiyim qo'shing.</p>
                  </div>
                ) : (
                  products.map(p => (
                    <div key={p.id} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-100 transition-colors">
                      <img src={p.images[0]} className="w-14 h-14 object-cover rounded-xl shadow-sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-800 truncate">{p.name}</p>
                        <p className="text-[10px] text-blue-600 font-black">{p.price.toLocaleString()} so'm</p>
                        <span className="text-[8px] bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded font-black uppercase">{p.category}</span>
                      </div>
                      <button onClick={() => setProducts(products.filter(x => x.id !== p.id))} className="text-slate-300 p-3 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="bg-emerald-50 p-5 rounded-2xl space-y-3 border border-emerald-100">
                <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Yangi promokod</h3>
                <input 
                  type="text" placeholder="KOD (masalan: MAVI25)" className="w-full p-3.5 rounded-xl border-none outline-none text-sm uppercase font-mono font-bold placeholder:text-emerald-300"
                  value={newPromo.code} onChange={e => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})}
                />
                <input 
                  type="number" placeholder="Chegirma %" className="w-full p-3.5 rounded-xl border-none outline-none text-sm font-bold"
                  value={newPromo.discountPercent || ''} onChange={e => setNewPromo({...newPromo, discountPercent: Number(e.target.value)})}
                />
                <button onClick={() => { setPromoCodes([...promoCodes, newPromo]); setNewPromo({code:'', discountPercent:0, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), minOrderAmount: 0, isActive: true, usageLimit: 1000, currentUsage: 0, description: 'Manual added promo'}); }} className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-100 active:scale-95 transition-all">Promokodni Faollashtirish</button>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mavjud promokodlar</h4>
                {promoCodes.map(pc => (
                  <div key={pc.code} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-mono font-black text-xs">%</div>
                      <div>
                        <p className="font-mono font-black text-sm text-slate-800 tracking-wider">{pc.code}</p>
                        <p className="text-[10px] text-emerald-600 font-black">-{pc.discountPercent}% Chegirma</p>
                      </div>
                    </div>
                    <button onClick={() => setPromoCodes(promoCodes.filter(x => x.code !== pc.code))} className="text-slate-200 p-2 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-50 border-t">
           <button onClick={() => window.location.reload()} className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-center gap-2 hover:bg-slate-100 transition-all">
             <RefreshCw size={12} /> Ma'lumotlarni Yangilash
           </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;