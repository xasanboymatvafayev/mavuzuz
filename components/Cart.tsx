
import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, Tag, Truck, Store } from 'lucide-react';
import { CartItem, PromoCode } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  promoCodes: PromoCode[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, promoCodes, onRemove, onUpdateQty }) => {
  const [promoInput, setPromoInput] = useState('');
  const [activePromo, setActivePromo] = useState<PromoCode | null>(null);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('pickup');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = activePromo ? (subtotal * activePromo.discountPercent / 100) : 0;
  const total = subtotal - discount;

  const applyPromo = () => {
    const promo = promoCodes.find(p => p.code === promoInput.toUpperCase());
    if (promo) {
      setActivePromo(promo);
      setPromoInput('');
    } else {
      alert("Noto'g'ri promokod!");
    }
  };

  const handleOrder = () => {
    if (window.Telegram?.WebApp) {
      const orderData = {
        userId: window.Telegram.WebApp.initDataUnsafe?.user?.id,
        items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
        total: total,
        type: orderType,
        promoUsed: activePromo?.code
      };
      window.Telegram.WebApp.sendData(JSON.stringify(orderData));
      onClose();
    } else {
      alert("Telegram orqali buyurtma bering!");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[320px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-blue-600" />
            <h2 className="font-bold text-lg">Savat</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {items.map(item => (
            <div key={item.id} className="flex gap-3 bg-slate-50 p-3 rounded-xl">
              {/* Fix: changed item.image to item.images[0] as Product uses images array */}
              <img src={item.images[0]} className="w-16 h-20 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold truncate">{item.name}</h4>
                <p className="text-xs text-blue-600 font-bold">{item.price.toLocaleString()} so'm</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 bg-white border px-1 py-0.5 rounded">
                    <button onClick={() => onUpdateQty(item.id, -1)}><Minus size={12} /></button>
                    <span className="text-xs font-bold">{item.quantity}</span>
                    <button onClick={() => onUpdateQty(item.id, 1)}><Plus size={12} /></button>
                  </div>
                  <button onClick={() => onRemove(item.id)} className="text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}

          {items.length > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex gap-2">
                <button onClick={() => setOrderType('pickup')} className={`flex-1 p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 ${orderType === 'pickup' ? 'bg-blue-50 border-blue-600 text-blue-600' : 'border-slate-100 text-slate-400'}`}>
                  <Store size={16} /> Olib ketish
                </button>
                <button onClick={() => setOrderType('delivery')} className={`flex-1 p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 ${orderType === 'delivery' ? 'bg-blue-50 border-blue-600 text-blue-600' : 'border-slate-100 text-slate-400'}`}>
                  <Truck size={16} /> Dostavka
                </button>
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" placeholder="Promokod" className="flex-1 p-2 bg-slate-50 border-none rounded-lg text-sm"
                  value={promoInput} onChange={e => setPromoInput(e.target.value)}
                />
                <button onClick={applyPromo} className="bg-slate-900 text-white px-4 rounded-lg text-xs font-bold">OK</button>
              </div>
              {activePromo && <p className="text-[10px] text-emerald-600 font-bold italic">Promokod qo'llandi: -{activePromo.discountPercent}%</p>}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t bg-slate-50 space-y-3">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Oraliq jami:</span>
              <span>{subtotal.toLocaleString()} so'm</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs text-emerald-600 font-bold">
                <span>Chegirma:</span>
                <span>-{discount.toLocaleString()} so'm</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="font-medium">Jami:</span>
              <span className="text-xl font-bold text-blue-900">{total.toLocaleString()} so'm</span>
            </div>
            <button onClick={handleOrder} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-100">
              Buyurtma Berish
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
