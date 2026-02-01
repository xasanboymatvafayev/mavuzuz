
import React, { useState } from 'react';
import { X, Plus, Trash2, Tag, Edit2, Lock, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { Product, PromoCode, Category } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  promoCodes: PromoCode[];
  setPromoCodes: React.Dispatch<React.SetStateAction<PromoCode[]>>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, products, setProducts, promoCodes, setPromoCodes }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'promos'>('products');
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ category: 'sotuv', size: ['M'], available: true, images: [] });
  // Fixed missing properties for PromoCode initialization
  const [newPromo, setNewPromo] = useState<PromoCode>({ 
    code: '', 
    discountPercent: 0,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    minOrderAmount: 0,
    isActive: true
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
    // Fixed missing mandatory properties for Product
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
      specifications: {
        length: 'N/A',
        waist: 'N/A',
        shoulders: 'N/A'
      }
    };
    setProducts([p, ...products]);
    setNewProduct({ category: 'sotuv', size: ['M'], available: true, images: [] });
    alert("Mahsulot qo'shildi!");
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
                className="w-full p-4 bg-slate-100 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
              />
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200">
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
          <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <Edit2 size={20} className="text-blue-600" /> Admin Panel
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
        </div>

        <div className="flex bg-slate-100 p-1 m-4 rounded-xl">
          <button onClick={() => setActiveTab('products')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'products' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>Katalog</button>
          <button onClick={() => setActiveTab('promos')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'promos' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>Promokodlar</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
          {activeTab === 'products' ? (
            <>
              <div className="bg-slate-50 p-5 rounded-2xl space-y-4 border border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Yangi kiyim qo'shish</h3>
                
                {/* Image Upload Area */}
                <div className="grid grid-cols-4 gap-2">
                  {newProduct.images?.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                      <img src={img} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setNewProduct(prev => ({ ...prev, images: prev.images?.filter((_, idx) => idx !== i) }))}
                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-400 cursor-pointer transition-colors">
                    <ImageIcon size={20} />
                    <span className="text-[10px] mt-1">Qo'shish</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>

                <input 
                  type="text" placeholder="Kiyim nomi" className="w-full p-3 rounded-xl bg-white border border-slate-100 outline-none text-sm"
                  value={newProduct.name || ''} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
                <textarea 
                  placeholder="Tavsif" className="w-full p-3 rounded-xl bg-white border border-slate-100 outline-none text-sm min-h-[80px]"
                  value={newProduct.description || ''} onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                />
                <div className="flex gap-2">
                  <input 
                    type="number" placeholder="Narxi" className="flex-1 p-3 rounded-xl bg-white border border-slate-100 outline-none text-sm"
                    value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                  />
                  <select 
                    className="p-3 rounded-xl bg-white border border-slate-100 outline-none text-sm"
                    value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})}
                  >
                    <option value="sotuv">Sotuv</option>
                    <option value="prokat">Prokat</option>
                  </select>
                </div>
                <button onClick={handleAddProduct} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all">
                  <Plus size={18} /> Katalogga Qo'shish
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase ml-1">Mavjud katalog ({products.length})</h4>
                {products.map(p => (
                  <div key={p.id} className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <img src={p.images[0]} className="w-14 h-14 object-cover rounded-xl" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{p.name}</p>
                      <p className="text-xs text-blue-600 font-medium">{p.price.toLocaleString()} so'm</p>
                    </div>
                    <button onClick={() => setProducts(products.filter(x => x.id !== p.id))} className="text-red-400 p-3 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="bg-emerald-50 p-5 rounded-2xl space-y-3 border border-emerald-100">
                <h3 className="text-xs font-bold text-emerald-600 uppercase">Yangi promokod</h3>
                <input 
                  type="text" placeholder="KOD (masalan: MAVI20)" className="w-full p-3 rounded-xl border-none outline-none text-sm uppercase font-mono"
                  value={newPromo.code} onChange={e => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})}
                />
                <input 
                  type="number" placeholder="Chegirma %" className="w-full p-3 rounded-xl border-none outline-none text-sm"
                  value={newPromo.discountPercent || ''} onChange={e => setNewPromo({...newPromo, discountPercent: Number(e.target.value)})}
                />
                <button onClick={() => { setPromoCodes([...promoCodes, newPromo]); setNewPromo({code:'', discountPercent:0, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), minOrderAmount: 0, isActive: true}); }} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">Qo'shish</button>
              </div>

              <div className="space-y-2">
                {promoCodes.map(pc => (
                  <div key={pc.code} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-mono font-bold">%</div>
                      <div>
                        <p className="font-mono font-bold text-sm">{pc.code}</p>
                        <p className="text-[10px] text-emerald-500">-{pc.discountPercent}% Chegirma</p>
                      </div>
                    </div>
                    <button onClick={() => setPromoCodes(promoCodes.filter(x => x.code !== pc.code))} className="text-slate-300 p-2"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
