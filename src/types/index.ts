export type UserRole = 'admin' | 'cashier';

export interface User {
  username: string;
  role:     UserRole;
}

export interface Product {
  id:       string;
  name:     string;
  price:    number;
  category: string;
  stock:    number;
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

export type GoodsMovementType = 'in' | 'out';

export interface GoodsMovement {
  id:          string;
  type:        GoodsMovementType;
  productId:   string;
  productName: string;
  quantity:    number;
  date:        Date;
  notes:       string;
}