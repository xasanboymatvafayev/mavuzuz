export type Category = 'sotuv' | 'prokat' | 'new' | 'sale' | 'exclusive' | 'limited' | 'accessories';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type UserRole = 'admin' | 'editor' | 'viewer' | 'manager' | 'support';
export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'terminal' | 'installment';
export type FabricType = 'silk' | 'velvet' | 'chiffon' | 'satin' | 'lace' | 'cotton' | 'organza' | 'crepe';

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  discountPrice?: number;
  rentalPriceDay?: number;
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
  sku: string;
  specifications: {
    length: string;
    waist: string;
    shoulders: string;
    bust: string;
    hips: string;
    sleeve: string;
  };
  careInstructions: string;
  materials: {
    material: string;
    percentage: number;
  }[];
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  expiryDate: string;
  minOrderAmount: number;
  isActive: boolean;
  usageLimit: number;
  currentUsage: number;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  rentalDays?: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  id: string;
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
    category: string;
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
  updatedAt: string;
}

export interface StoreLocation {
  id: string;
  lat: number;
  lon: number;
  name: string;
  address: string;
  workingHours: string;
  phone: string;
  managerName: string;
  description: string;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  activeUsers: number;
  conversionRate: number;
  averageOrderValue: number;
  revenueGrowth: number;
  popularCategories: { name: string; value: number }[];
  recentActivity: { id: string; action: string; time: string; user: string }[];
}

export interface AppConfig {
  theme: 'light' | 'dark' | 'system';
  language: 'uz' | 'ru' | 'en';
  notificationsEnabled: boolean;
  currency: 'UZS' | 'USD';
  autoRefresh: boolean;
  animations: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
  isVerified: boolean;
  likes: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  priority: number;
}

export interface Banner {
  id: string;
  imageUrl: string;
  link: string;
  title: string;
  description: string;
  buttonText: string;
  isActive: boolean;
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
  tier: 'silver' | 'gold' | 'platinum';
  preferences: string[];
  birthday?: string;
}

export interface InternalLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  userId?: string;
  metadata?: any;
}

export interface SizeGuide {
  id: string;
  category: string;
  sizes: {
    label: string;
    chest: string;
    waist: string;
    hips: string;
    length: string;
  }[];
}

export interface AnalyticsEvent {
  id: string;
  type: string;
  targetId: string;
  userId: string;
  timestamp: string;
  data: any;
}

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'processing' | 'refunded';
  method: PaymentMethod;
  date: string;
  reference?: string;
}

export interface StoreInventory {
  productId: string;
  locationId: string;
  quantity: number;
  lastRestocked: string;
}

export interface SupportTicket {
  id: string;
  userId: number;
  subject: string;
  message: string;
  status: 'open' | 'closed' | 'in_progress';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  closedAt?: string;
}

/**
 * Added missing ContactInfo interface to satisfy imports in constants.tsx
 */
export interface ContactInfo {
  telegram: string;
  instagram: string;
  facebook: string;
  website: string;
  email: string;
  supportPhone: string;
}