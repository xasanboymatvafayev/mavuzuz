import { Product, PromoCode, FAQ, Banner, SizeGuide, ContactInfo, StoreLocation } from './types.ts';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Oq Kelin Ko\'ylak "Zuhro"',
    description: 'Eksklyuziv qo\'lda tikilgan toshlar bilan bezatilgan shohona oq kelin ko\'ylagi.',
    longDescription: 'Ushbu ko\'ylak eng yuqori sifatli atlas va shifon matolaridan tikilgan. Har bir tosh va bezak mohir chevarlarimiz tomonidan qo\'lda mahkamlangan. Kelinlar uchun maxsus dizayn bo\'lib, u sizga unutilmas kun bag\'ishlaydi. Ko\'ylakning orqa qismi korset uslubida bo\'lib, barcha qomatlarga mos tushadi. Korsetning elastikligi tufayli u sizni noqulay his qildirmaydi.',
    price: 12000000,
    rentalPriceDay: 1500000,
    images: [
      'https://images.unsplash.com/photo-1594553323282-55962537a53f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1596459204919-c8a44411b20a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'sotuv',
    size: ['S', 'M', 'L', 'XL'],
    color: 'Oq',
    fabric: 'Satin, Shifon, Krujeva',
    season: 'Barcha fasllar',
    brand: 'Mavi Exclusive',
    available: true,
    rating: 4.9,
    reviewsCount: 24,
    createdAt: '2024-01-15T10:00:00Z',
    tags: ['kelin', 'to\'y', 'oq', 'premium', 'royal'],
    stock: 5,
    sku: 'SKU-001-ZUHRO',
    specifications: {
      length: '160cm',
      waist: '60-75cm',
      shoulders: '38cm',
      bust: '85-95cm',
      hips: '90-110cm',
      sleeve: '45cm'
    },
    careInstructions: 'Faqat quruq tozalash tavsiya etiladi. Dazmollashda ehtiyot bo\'ling.',
    materials: [{ material: 'Silk', percentage: 70 }, { material: 'Polyester', percentage: 30 }]
  },
  {
    id: '2',
    name: 'Kechki Moviy Shifon Ko\'ylak',
    description: 'Tantanali marosimlar uchun mo\'ljallangan yengil va havodor moviy rangli shifon ko\'ylak.',
    longDescription: 'Ushbu kechki ko\'ylak o\'zining yengilligi va nafisligi bilan ajralib turadi. Moviy rang quyosh nurlarida chiroyli jilolanadi. Ko\'ylakning astari tabiiy ipakdan bo\'lib, teriga yoqimli his bag\'ishlaydi. Tug\'ilgan kunlar, to\'ylar va boshqa tantanalar uchun ideal tanlov. U sizga o\'zgacha ko\'rinish beradi.',
    price: 4500000,
    rentalPriceDay: 500000,
    images: [
      'https://images.unsplash.com/photo-1518917232260-0e613b47e0ad?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1539109132381-31512bb3d4c1?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'prokat',
    size: ['M', 'L', 'XL', '2XL'],
    color: 'Moviy',
    fabric: 'Shifon, Ipak astar',
    season: 'Bahor-Yoz',
    brand: 'Mavi Evening',
    available: true,
    rating: 4.7,
    reviewsCount: 18,
    createdAt: '2024-02-10T14:30:00Z',
    tags: ['kechki', 'bazm', 'moviy', 'ijara', 'shifon'],
    stock: 2,
    sku: 'SKU-002-MOVIY',
    specifications: {
      length: '145cm',
      waist: '70-85cm',
      shoulders: '40cm',
      bust: '90-100cm',
      hips: '95-105cm',
      sleeve: '0cm'
    },
    careInstructions: 'Mashinada 30 darajada yuvish mumkin.',
    materials: [{ material: 'Chiffon', percentage: 100 }]
  },
  {
    id: '3',
    name: 'Qizil Baxmal Ko\'ylak',
    description: 'Qishki tantanalar uchun mo\'ljallangan, qalin va issiq qizil baxmal ko\'ylak.',
    longDescription: 'Baxmal matosining boy teksturasi bu ko\'ylakka o\'zgacha mahobat bag\'ishlaydi. Qora rangli bezaklar bilan uyg\'unlikda qizil rang juda yorqin ko\'rinadi. Ko\'ylak qishki bazmlar uchun eng yaxshi tanlov bo\'lib, ham chiroy, ham qulaylik beradi. Baxmal matosi issiqlikni yaxshi saqlaydi.',
    price: 8500000,
    rentalPriceDay: 850000,
    images: [
      'https://images.unsplash.com/photo-1539008835270-21788730302d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'prokat',
    size: ['S', 'M', 'L'],
    color: 'To\'q Qizil',
    fabric: 'Baxmal',
    season: 'Kuz-Qish',
    brand: 'Royal Mavi',
    available: true,
    rating: 4.8,
    reviewsCount: 32,
    createdAt: '2024-03-01T09:15:00Z',
    tags: ['baxmal', 'qizil', 'qishki', 'ijara', 'royal'],
    stock: 3,
    sku: 'SKU-003-REDVELVET',
    specifications: {
      length: '150cm',
      waist: '65-75cm',
      shoulders: '39cm',
      bust: '88-98cm',
      hips: '92-102cm',
      sleeve: '58cm'
    },
    careInstructions: 'Bug\'li dazmoldan foydalanmang.',
    materials: [{ material: 'Velvet', percentage: 90 }, { material: 'Elastane', percentage: 10 }]
  },
  {
    id: '4',
    name: 'Zumrad Yashil Silk Ko\'ylak',
    description: 'Tabiiy ipakdan tayyorlangan, klassik uslubdagi zumrad yashil ko\'ylak.',
    longDescription: 'Klassika hech qachon urfdan qolmaydi. Zumrad yashil rang barcha teri ranglariga mos tushadi. Tabiiy ipak matosi havoni yaxshi o\'tkazadi va tanani salqin tutadi. Oddiylik va hashamat uyg\'unligi. Siz bu ko\'ylakda o\'zingizni malikalardek his qilasiz.',
    price: 3200000,
    rentalPriceDay: 400000,
    images: [
      'https://images.unsplash.com/photo-1485231183945-fffde7cc051e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'sotuv',
    size: ['XS', 'S', 'M', 'L'],
    color: 'Zumrad Yashil',
    fabric: 'Tabiiy Ipak',
    season: 'Yoz',
    brand: 'Silk Mavi',
    available: true,
    rating: 4.9,
    reviewsCount: 15,
    createdAt: '2024-03-20T11:45:00Z',
    tags: ['ipak', 'yashil', 'yozgi', 'premium', 'silk'],
    stock: 8,
    sku: 'SKU-004-EMERALD',
    specifications: {
      length: '140cm',
      waist: '60-70cm',
      shoulders: '37cm',
      bust: '82-90cm',
      hips: '88-96cm',
      sleeve: '10cm'
    },
    careInstructions: 'Qo\'lda yuvish tavsiya etiladi.',
    materials: [{ material: 'Natural Silk', percentage: 100 }]
  },
  {
    id: '5',
    name: 'Pushti Kokteyl Ko\'ylagi',
    description: 'Qisqa pushti ko\'ylak, do\'stlar bilan uchrashuv yoki bitiruv kechasi uchun.',
    longDescription: 'Eng quvnoq va yosh uslubdagi ko\'ylagimiz. Pushti rangning nozik jilosi sizni davra markazida tutadi. Yengil tull matosi ko\'ylakka hajm va o\'zgacha ko\'rinish beradi. Bu ko\'ylak ayniqsa yozgi bazmlar uchun juda mos keladi.',
    price: 2500000,
    rentalPriceDay: 300000,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'prokat',
    size: ['S', 'M'],
    color: 'Pushti',
    fabric: 'Organza, Tull',
    season: 'Bahor',
    brand: 'Mavi Youth',
    available: true,
    rating: 4.6,
    reviewsCount: 41,
    createdAt: '2024-04-05T16:20:00Z',
    tags: ['pushti', 'kokteyl', 'bitiruv', 'ijara', 'tull'],
    stock: 4,
    sku: 'SKU-005-PINKCOCKTAIL',
    specifications: {
      length: '90cm',
      waist: '60-72cm',
      shoulders: '38cm',
      bust: '84-92cm',
      hips: '86-100cm',
      sleeve: '0cm'
    },
    careInstructions: 'Iliq suvda yuvilsin.',
    materials: [{ material: 'Nylon', percentage: 50 }, { material: 'Silk', percentage: 50 }]
  }
];

export const MOCK_PROMOS: PromoCode[] = [
  { code: 'MAVI2024', discountPercent: 10, expiryDate: '2024-12-31', minOrderAmount: 100000, isActive: true, usageLimit: 1000, currentUsage: 42, description: 'Yangi yil uchun maxsus chegirma' },
  { code: 'WELCOME', discountPercent: 15, expiryDate: '2024-06-30', minOrderAmount: 500000, isActive: true, usageLimit: 500, currentUsage: 120, description: 'Birinchi buyurtma uchun' },
  { code: 'SPRING', discountPercent: 20, expiryDate: '2024-05-31', minOrderAmount: 2000000, isActive: true, usageLimit: 200, currentUsage: 85, description: 'Bahorgi kolleksiya uchun' },
  { code: 'VIP', discountPercent: 25, expiryDate: '2025-01-01', minOrderAmount: 5000000, isActive: true, usageLimit: 100, currentUsage: 12, description: 'Doimiy mijozlar uchun' }
];

export const MOCK_FAQS: FAQ[] = [
  { id: 'f1', question: 'Dostavka bormi?', answer: 'Ha, O\'zbekiston bo\'ylab 24-48 soat ichida yetkazib beramiz. Toshkent shahri ichida 6 soatda yetkazish imkoni mavjud.', category: 'Xizmatlar', priority: 1 },
  { id: 'f2', question: 'Ijara muddati qancha?', answer: 'Odatda prokat 3 kunga beriladi. Muddati uzaytirish kelishilgan holda amalga oshiriladi. Har bir qo\'shimcha kun uchun alohida to\'lov bor.', category: 'Ijara', priority: 2 },
  { id: 'f3', question: 'Razmer tushmasa almashtirsa bo\'ladimi?', answer: 'Sotuvdagi tovarlar 3 kun ichida qaytarilishi yoki almashtirilishi mumkin. Buning uchun kiyim kiyilmagan bo\'lishi kerak.', category: 'Qaytarish', priority: 3 },
  { id: 'f4', question: 'To\'lov turlari qanaqa?', answer: 'Payme, Click yoki naqd pul ko\'rinishida qabul qilamiz. Terminal orqali to\'lash imkoniyati ham bor.', category: 'To\'lov', priority: 4 }
];

export const SIZE_GUIDES: SizeGuide[] = [
  {
    id: 'sg1',
    category: 'Ko\'ylaklar',
    sizes: [
      { label: 'XS', chest: '80-84cm', waist: '60-64cm', hips: '86-90cm', length: '135cm' },
      { label: 'S', chest: '84-88cm', waist: '64-68cm', hips: '90-94cm', length: '140cm' },
      { label: 'M', chest: '88-92cm', waist: '68-72cm', hips: '94-98cm', length: '145cm' },
      { label: 'L', chest: '92-96cm', waist: '72-76cm', hips: '98-102cm', length: '150cm' },
      { label: 'XL', chest: '96-100cm', waist: '76-80cm', hips: '102-106cm', length: '155cm' }
    ]
  }
];

export const CONTACT_DATA: ContactInfo = {
  telegram: '@maviboutique_admin',
  instagram: 'maviboutique_uz',
  facebook: 'maviboutique.official',
  website: 'maviboutique.uz',
  email: 'info@maviboutique.uz',
  supportPhone: '+998 90 123 45 67'
};

export const BANNERS: Banner[] = [
  { id: 'b1', imageUrl: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200', title: 'Yangi To\'plam', description: 'Bahorgi nafislik siz uchun!', buttonText: 'Katalogni ko\'rish', link: '#', isActive: true },
  { id: 'b2', imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=1200', title: 'Katta Chegirmalar', description: 'Prokat narxlari 30% gacha arzonlashdi!', buttonText: 'Chegirmalar', link: '#', isActive: true }
];

export const APP_NAME = 'MaviBoutique';
export const APP_VERSION = '2.8.0';
export const DEFAULT_CURRENCY = 'UZS';
export const TAX_RATE = 0.12;
export const FREE_SHIPPING_THRESHOLD = 10000000;
export const MIN_ORDER_VALUE = 100000;

export const CATEGORIES = [
  { id: 'sotuv', name: 'Sotuv', icon: 'Package' },
  { id: 'prokat', name: 'Prokat', icon: 'RotateCcw' },
  { id: 'new', name: 'Yangi', icon: 'Sparkles' },
  { id: 'sale', name: 'Chegirmalar', icon: 'Percent' },
  { id: 'exclusive', name: 'Eksklyuziv', icon: 'Crown' },
  { id: 'limited', name: 'Limited', icon: 'Gem' }
];

export const COLORS = ['Oq', 'Qora', 'Qizil', 'Moviy', 'Zumrad', 'Pushti', 'Tillarang', 'Kumush', 'Binafsha', 'Yashil'];

export const FABRICS = ['Satin', 'Shifon', 'Baxmal', 'Ipak', 'Krujeva', 'Organza', 'Krep', 'Tull', 'Paxta', 'Atlas'];

export const SEASONS = ['Bahor', 'Yoz', 'Kuz', 'Qish', 'Barcha fasllar'];

export const STORE_LOCATIONS: StoreLocation[] = [
  {
    id: 'loc1',
    lat: 41.3782,
    lon: 60.3642,
    name: 'Xiva Markaz',
    address: 'Xiva shahri, Gipermarket, 2-qavat',
    workingHours: '09:00 - 21:00',
    phone: '+998 91 234 56 78',
    managerName: 'Zulxumor Dadaeva',
    description: 'Bizning eng katta va asosiy filialimiz.'
  },
  {
    id: 'loc2',
    lat: 41.3110,
    lon: 69.2406,
    name: 'Toshkent Chilonzor',
    address: 'Toshkent shahri, Chilonzor, 5-kvartal',
    workingHours: '10:00 - 20:00',
    phone: '+998 90 987 65 43',
    managerName: 'Malika Axmedova',
    description: 'Poytaxtdagi shinam butigimiz.'
  }
];

export const SOCIAL_LINKS = [
  { name: 'Telegram', url: 'https://t.me/maviboutique_uz', icon: 'Send' },
  { name: 'Instagram', url: 'https://instagram.com/maviboutique_uz', icon: 'Instagram' },
  { name: 'YouTube', url: 'https://youtube.com/@maviboutique', icon: 'Youtube' },
  { name: 'TikTok', url: 'https://tiktok.com/@maviboutique', icon: 'Music' }
];

export const RECENT_SEARCHES = ['Kelin ko\'ylak', 'Kechki ko\'ylak', 'Qizil bazm ko\'ylagi', 'Pushti bitiruv', 'Ipak ko\'ylaklar'];

export const REVIEW_BADGES = ['A\'lo xizmat', 'Tez yetkazib berish', 'Sifatli mato', 'Hamyonbop narx', 'Nafis dizayn'];

export const LOG_LEVELS = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  DEBUG: 'debug'
};

export const MAX_CART_ITEMS = 15;
export const MAX_IMAGE_SIZE_MB = 10;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const ANALYTICS_CONFIG = {
  trackViews: true,
  trackClicks: true,
  trackPurchases: true,
  sampleRate: 1.0
};

export const UI_STRINGS = {
  loading: 'Yuklanmoqda...',
  error: 'Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.',
  noItems: 'Hech narsa topilmadi. Qidiruv so\'zini o\'zgartiring.',
  addToCart: 'Savatga qo\'shish',
  buyNow: 'Hozir sotib olish',
  checkout: 'Buyurtma berish',
  success: 'Muvaffaqiyatli yakunlandi!',
  cancel: 'Bekor qilish',
  save: 'Saqlash',
  edit: 'Tahrirlash',
  delete: 'O\'chirish',
  viewDetails: 'Batafsil ko\'rish'
};

export const ANIMATION_DURATIONS = {
  veryFast: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800
};

export const BREAKPOINTS = {
  xs: 320,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536
};

export const DEFAULT_PAGE_SIZE = 20;

export const LOCAL_STORAGE_KEYS = {
  CART: 'mavi_cart_v2',
  USER: 'mavi_user_profile',
  THEME: 'mavi_theme_pref',
  WISHLIST: 'mavi_wishlist_items',
  RECENT_SEARCH: 'mavi_recent_searches',
  AUTH_TOKEN: 'mavi_auth_token'
};

export const API_ENDPOINTS = {
  PRODUCTS: '/api/v1/products',
  ORDERS: '/api/v1/orders',
  USERS: '/api/v1/users',
  PROMOS: '/api/v1/promos',
  REVIEWS: '/api/v1/reviews',
  ANALYTICS: '/api/v1/analytics'
};

export const CURRENCY_FORMATTER = new Intl.NumberFormat('uz-UZ', {
  style: 'currency',
  currency: 'UZS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

export const DATE_FORMATTER = new Intl.DateTimeFormat('uz-UZ', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});

export const getPriceString = (price: number) => {
  return CURRENCY_FORMATTER.format(price).replace('UZS', 'so\'m');
};

export const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone: string) => {
  return /^\+998\d{9}$/.test(phone);
};

export const calculateDiscount = (price: number, percent: number) => {
  return (price * percent) / 100;
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const capitalize = (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncate = (str: string, length: number) => {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
};

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'sotuv': return 'Package';
    case 'prokat': return 'RotateCcw';
    case 'new': return 'Sparkles';
    case 'sale': return 'Percent';
    case 'exclusive': return 'Crown';
    case 'limited': return 'Gem';
    default: return 'Grid';
  }
};

export const calculateRentalPrice = (basePrice: number, days: number) => {
  let discount = 1;
  if (days >= 3 && days < 7) discount = 0.9;
  if (days >= 7) discount = 0.8;
  return basePrice * days * discount;
};

export const getRatingStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  return { fullStars, halfStar, emptyStars };
};

export const formatSKU = (id: string, category: string) => {
  return `MAVI-${category.toUpperCase()}-${id.toUpperCase()}`;
};

export const getSeasonLabel = (season: string) => {
  return SEASONS.includes(season) ? season : 'Barcha fasllar';
};