export interface ConfigItem {
  _id: string;
  id: string;
  name: string;
  marchBaseline: number;
  marchWarning: string;
  aprilBaseline: number;
  aprilWarning: string;
  totalDelivery: number;
  upgradeDeliveryStatus: string;
  lastDeliveryTime: string;
  deliveryStatus: string;
  effectiveTime: string;
}

export interface ConfigStatistics {
  totalConfigs: number;
  normalConfigs: number;
  warningConfigs: number;
  errorConfigs: number;
  deliveryCount: number;
  deliveryRate: number;
  upgradeRate: number;
  monthlyChange: {
    configs: number;
    delivery: number;
    upgrade: number;
  };
}

export interface ConfigQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}

export interface ConfigResponse {
  data: ConfigItem[];
  total: number;
  statistics: ConfigStatistics;
}

export interface GovernanceData {
  normal: number;
  warning: number;
  error: number;
  others: number;
}

export interface DeliveryData {
  delivered: number;
  delivering: number;
  undelivered: number;
  others: number;
} 