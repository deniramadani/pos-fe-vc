export type UserRole = 'admin' | 'cashier';

export interface User {
  username: string;
  role:     UserRole;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: Date;
  paymentMethod: 'cash' | 'card';
}