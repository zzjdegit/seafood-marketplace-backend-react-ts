export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum OrderStatusCN {
  PENDING = '待处理',
  PROCESSING = '处理中',
  COMPLETED = '已完成',
  CANCELLED = '已取消'
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock'
}

export enum ProductStatusCN {
  ACTIVE = '在售',
  INACTIVE = '下架',
  OUT_OF_STOCK = '缺货'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export enum UserStatusCN {
  ACTIVE = '活跃',
  INACTIVE = '未激活',
  SUSPENDED = '已停用'
}

export enum Category {
  FISH = 'Fish',
  SHELLFISH = 'Shellfish',
  OTHER = 'Other'
}

export const CategoryCN = {
  [Category.FISH]: '鱼类',
  [Category.SHELLFISH]: '贝类',
  [Category.OTHER]: '其他'
} as const;

export enum Role {
    ADMIN = 'admin',
    USER = 'user'
}

export enum RoleCN {
    ADMIN = '管理员',
    USER = '普通用户'
}

// Helper function to get Chinese status
export const getStatusCN = (status: string, type: 'order' | 'product' | 'user'): string => {
  switch (type) {
    case 'order':
      return OrderStatusCN[status as keyof typeof OrderStatusCN] || status;
    case 'product':
      return ProductStatusCN[status as keyof typeof ProductStatusCN] || status;
    case 'user':
      return UserStatusCN[status as keyof typeof UserStatusCN] || status;
    default:
      return status;
  }
}; 