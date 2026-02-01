
import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Oq Kelin Ko\'ylak "Zuhro"',
    description: 'Eksklyuziv qo\'lda tikilgan toshlar bilan bezatilgan shohona oq kelin ko\'ylagi.',
    price: 12000000,
    images: [
      'https://images.unsplash.com/photo-1594553323282-55962537a53f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1596459204919-c8a44411b20a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'sotuv',
    size: ['S', 'M'],
    color: 'Oq',
    available: true
  },
  {
    id: '2',
    name: 'Kechki Moviy Shifon Ko\'ylak',
    description: 'Tantanali marosimlar uchun mo\'ljallangan yengil va havodor moviy rangli shifon ko\'ylak.',
    price: 450000,
    images: [
      'https://images.unsplash.com/photo-1518917232260-0e613b47e0ad?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1539109132381-31512bb3d4c1?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'prokat',
    size: ['M', 'L'],
    color: 'Moviy',
    available: true
  }
];
