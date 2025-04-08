export interface Order {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  status: 'pending' | 'completed' | 'canceled';
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderListParams {
  page: number;
  pageSize: number;
  search: string;
  status?: 'pending' | 'completed' | 'canceled';
  sortField?: string;
  sortOrder?: 'ascend' | 'descend' | null;
}

export interface OrderListResponse {
  data: Order[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: 'Fish' | 'Shellfish' | 'Other';
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductListParams {
  page: number;
  pageSize: number;
  search: string;
  category?: string;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend' | null;
}

export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserListParams {
  page: number;
  pageSize: number;
  search: string;
  role?: string;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend' | null;
}

export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
}