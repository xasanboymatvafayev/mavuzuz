
export type Category = 'sotuv' | 'prokat';
export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[]; // Massivga o'zgartirildi
  category: Category;
  size: string[];
  color: string;
  available: boolean;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface OrderData {
  userId: number;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  type: 'delivery' | 'pickup';
  promoUsed?: string;
}
