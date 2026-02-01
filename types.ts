export type Category = 'sotuv' | 'prokat' | 'new' | 'sale';
export type OrderStatus = 'pending' | 'confirmed' | 'cancelled' | 'shipped' | 'delivered';
export type UserRole = 'admin' | 'editor' | 'viewer';
export type PaymentMethod = 'cash' | 'card' | 'transfer';

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: Category;
  size: string[];
  color: string;
  fabric: string;
  season: string;
  brand: string;
  available: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  tags: string[];
  stock: number;
  specifications: {
    length: string;
    waist: string;
    shoulders: string;
  };
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  expiryDate: string;
  minOrderAmount: number;
  isActive: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface OrderData {
  orderId: string;
  userId: number;
  userName: string;
  items: { 
    id: string;
    name: string; 
    quantity: number; 
    price: number;
    subtotal: number;
  }[];
  total: number;
  discountAmount: number;
  finalTotal: number;
  type: 'delivery' | 'pickup';
  address?: string;
  phone: string;
  promoUsed?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
}

export interface StoreLocation {
  lat: number;
  lon: number;
  address: string;
  workingHours: string;
  phone: string;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  activeUsers: number;
  conversionRate: number;
  popularCategories: { name: string; value: number }[];
  recentActivity: { id: string; action: string; time: string }[];
}

export interface AppConfig {
  theme: 'light' | 'dark' | 'system';
  language: 'uz' | 'ru' | 'en';
  notificationsEnabled: boolean;
  currency: 'UZS' | 'USD';
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  link: string;
  title: string;
  description: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  addedAt: string;
}

export interface UserProfile {
  id: string;
  telegramId: number;
  fullName: string;
  phoneNumber: string;
  email?: string;
  totalSpent: number;
  ordersCount: number;
  loyaltyPoints: number;
  preferences: string[];
}

export interface InternalLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  metadata?: any;
}

export interface ShippingZone {
  name: string;
  cost: number;
  estimatedDays: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  status: 'success' | 'failed' | 'processing';
  method: PaymentMethod;
  date: string;
}

export interface SizeGuide {
  category: string;
  sizes: {
    label: string;
    chest: string;
    waist: string;
    hips: string;
  }[];
}

export interface ContactInfo {
  telegram: string;
  instagram: string;
  facebook: string;
  website: string;
  email: string;
  supportPhone: string;
}

export interface SystemHealth {
  status: 'healthy' | 'unstable' | 'down';
  version: string;
  lastUpdate: string;
  serverLocation: string;
}

export const emptyProduct: Product = {
  id: '',
  name: '',
  description: '',
  longDescription: '',
  price: 0,
  images: [],
  category: 'sotuv',
  size: [],
  color: '',
  fabric: '',
  season: '',
  brand: '',
  available: true,
  rating: 0,
  reviewsCount: 0,
  createdAt: new Date().toISOString(),
  tags: [],
  stock: 0,
  specifications: {
    length: '',
    waist: '',
    shoulders: ''
  }
};