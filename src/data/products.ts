import { Product } from '../types';

export const PRODUCTS: Product[] = [
  { id: '1', name: 'Coffee',    price: 3.50,  category: 'Beverages', stock: 25 },
  { id: '2', name: 'Tea',       price: 2.50,  category: 'Beverages', stock: 4  },
  { id: '3', name: 'Sandwich',  price: 8.99,  category: 'Food',      stock: 12 },
  { id: '4', name: 'Burger',    price: 12.99, category: 'Food',      stock: 0  },
  { id: '5', name: 'Salad',     price: 9.99,  category: 'Food',      stock: 3  },
  { id: '6', name: 'Donut',     price: 2.99,  category: 'Pastries',  stock: 18 },
  { id: '7', name: 'Croissant', price: 3.99,  category: 'Pastries',  stock: 7  },
  { id: '8', name: 'Cookie',    price: 1.99,  category: 'Pastries',  stock: 30 },
];
