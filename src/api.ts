import { CartItem, GoodsMovement, Product, Transaction, User } from './types';

const API_BASE = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/').replace(/\/+$/, '');
// eslint-disable-next-line no-console
console.log('[api] API_BASE =', API_BASE);
const TOKEN_KEY = 'pos-fe-vc-api-token';

export function isBackendConfigured() {
  return API_BASE.length > 0;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: User['role'];
}

export interface ApiProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface ApiTransactionItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ApiTransaction {
  id: number;
  cashier_id: number;
  total: number;
  payment_method: Transaction['paymentMethod'];
  paid_amount: number;
  change_amount: number;
  notes: string;
  items: ApiTransactionItem[];
  created_at: string;
}

export interface ApiGoodsMovement {
  id: number;
  type: GoodsMovement['type'];
  product_id: number;
  product_name: string;
  quantity: number;
  date: string;
  notes: string;
  created_at: string;
}

export interface AuthResult {
  token: string;
  user: ApiUser;
}

// Login using a Google ID token. If a backend is configured, forward the ID token
// to the backend for verification and exchange; otherwise parse the ID token
// client-side and return a minimal AuthResult.
export async function loginWithGoogle(idToken: string) {
  if (isBackendConfigured()) {
    const data = await request<AuthResult>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
    });
    return data;
  }

  // Parse JWT payload (base64url) to extract email/name
  function parseJwtPayload(token: string) {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(atob(payload).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  const p = parseJwtPayload(idToken) as any;
  const user: ApiUser = {
    id: p?.sub ? Number(String(p.sub).slice(0, 9)) : 0,
    name: p?.name || p?.email || 'Google User',
    email: p?.email || 'unknown@example.com',
    role: 'cashier',
  };

  return { token: idToken, user } as AuthResult;
}

function buildUrl(path: string) {
  if (!API_BASE) {
    throw new Error('Backend API base URL is not configured. Set REACT_APP_API_BASE_URL to use backend mode.');
  }
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function authHeaders(): Record<string, string> {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeaders(),
    ...(init.headers as Record<string, string> || {}),
  };

  const response = await fetch(buildUrl(path), {
    ...init,
    headers,
  });

  // Handle empty response bodies (204 No Content or empty string)
  const text = await response.text();
  if (!text) {
    if (!response.ok) {
      throw new Error(response.statusText || 'API request failed');
    }
    // No content but OK — return null as any to allow callers to handle absence of data
    return null as any as T;
  }

  let payload: any;
  try {
    payload = JSON.parse(text);
  } catch (err) {
    if (!response.ok) {
      throw new Error(response.statusText || 'API request failed');
    }
    return null as any as T;
  }

  if (!response.ok || payload?.success === false) {
    const message = payload?.message || response.statusText || 'API request failed';
    throw new Error(message);
  }

  // Some endpoints return { data: ... } and some return the payload directly
  return (payload.data ?? payload) as T;
}

function parseProduct(product: ApiProduct): Product {
  return {
    id: String(product.id),
    name: product.name,
    category: product.category,
    price: product.price,
    stock: product.stock,
  };
}

function parseTransactionItem(item: ApiTransactionItem): CartItem {
  return {
    product: {
      id: String(item.product_id),
      name: item.product_name,
      price: item.price,
      category: '',
      stock: 0,
    },
    quantity: item.quantity,
  };
}

function parseTransaction(tx: ApiTransaction): Transaction {
  return {
    id: String(tx.id),
    items: (tx.items ?? []).map(parseTransactionItem),
    total: tx.total,
    paymentMethod: tx.payment_method,
    timestamp: new Date(tx.created_at),
  };
}

function parseGoodsMovement(m: ApiGoodsMovement): GoodsMovement {
  return {
    id: String(m.id),
    type: m.type,
    productId: String(m.product_id),
    productName: m.product_name,
    quantity: m.quantity,
    date: new Date(m.date),
    notes: m.notes,
  };
}

export async function login(email: string, password: string) {
  return request<AuthResult>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function me() {
  return request<ApiUser>('/auth/me', { method: 'GET' });
}

export async function listProducts() {
  const data = await request<ApiProduct[]>('/products?limit=100');
  return (data ?? []).map(parseProduct);
}

export async function createProduct(product: Omit<Product, 'id'>) {
  const data = await request<ApiProduct>('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
  return parseProduct(data);
}

export async function updateProduct(product: Product) {
  const data = await request<ApiProduct>(`/products/${product.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
    }),
  });
  return parseProduct(data);
}

export async function deleteProduct(id: string) {
  return request<null>(`/products/${id}`, {
    method: 'DELETE',
  });
}

export async function listTransactions() {
  const data = await request<ApiTransaction[]>('/transactions?limit=100');
  return (data ?? []).map(parseTransaction);
}

export async function checkoutTransaction(items: CartItem[], paymentMethod: 'cash' | 'card') {
  const payload = {
    items: items.map(item => ({
      product_id: Number(item.product.id),
      quantity: item.quantity,
    })),
    payment_method: paymentMethod,
    paid_amount: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    notes: '',
  };
  const data = await request<ApiTransaction>('/transactions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return parseTransaction(data);
}

export async function listGoodsMovements() {
  const data = await request<ApiGoodsMovement[]>('/goods-movements?limit=100');
  return (data ?? []).map(parseGoodsMovement);
}

export async function createGoodsMovement(
  type: GoodsMovement['type'],
  productId: string,
  quantity: number,
  date: Date,
  notes: string,
) {
  const payload = {
    type,
    product_id: Number(productId),
    quantity,
    date: date.toISOString(),
    notes,
  };
  const data = await request<ApiGoodsMovement>('/goods-movements', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return parseGoodsMovement(data);
}

export async function fetchProductById(id: string) {
  const data = await request<ApiProduct>(`/products/${id}`, { method: 'GET' });
  return parseProduct(data);
}

export async function fetchTransactions() {
  return listTransactions();
}

export async function authToken() {
  return getStoredToken();
}
