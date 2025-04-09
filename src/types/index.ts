// API Response types
export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// List Parameter types
export interface ListParams {
  page: number;
  pageSize: number;
  search?: string;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend' | null;
}

// User types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface UserListParams extends ListParams {
  role?: 'admin' | 'user';
}

export interface UserStatistics {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

export interface ProductListParams extends ListParams {
  category?: string;
}

export interface ProductStatistics {
  totalProducts: number;
  totalStock: number;
  averagePrice: number;
}

// Order types
export interface Order {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface OrderListParams extends ListParams {
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';
}

export interface OrderStatistics {
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

// Remove duplicate interfaces
// export interface PaginatedResponse<T> {
//   items: T[];
//   total: number;
// }

// export interface PaginationParams {
//   page: number;
//   pageSize: number;
//   searchText?: string;
// }