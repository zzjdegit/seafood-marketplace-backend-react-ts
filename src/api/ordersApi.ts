import axios from 'axios';
import { Order, OrderListParams, OrderListResponse } from '../types';
import config from '../config';

const API_BASE_URL = config.apiBaseUrl;

export const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
  const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
  return response.data;
};

export const getAllOrders = async (params: OrderListParams): Promise<OrderListResponse> => {
  const { page, pageSize, search, status, sortField, sortOrder } = params;
  const response = await axios.get(`${API_BASE_URL}/orders`, {
    params: {
      page,
      pageSize,
      search,
      status,
      sortField,
      sortOrder
    }
  });
  return response.data;
};

export const updateOrder = async (id: string, orderData: Partial<Order>): Promise<Order> => {
  const response = await axios.patch(`${API_BASE_URL}/orders/${id}`, orderData);
  return response.data;
};

export const deleteOrder = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/orders/${id}`);
}; 