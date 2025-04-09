import axios from 'axios';
import config from '../config';
import { Order, OrderStatistics, OrderListParams, ApiResponse } from '../types';

const BASE_URL = `${config.apiBaseUrl}/orders`;

export const getOrders = async (params: OrderListParams): Promise<ApiResponse<Order>> => {
  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrderStatistics = async (): Promise<OrderStatistics> => {
  try {
    const response = await axios.get(`${BASE_URL}/statistics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    throw error;
  }
};

export const createOrder = async (orderData: Omit<Order, 'id' | 'totalPrice' | 'createdAt'>): Promise<Order> => {
  try {
    const response = await axios.post(BASE_URL, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrder = async (id: string, orderData: Partial<Omit<Order, 'id' | 'createdAt'>>): Promise<Order> => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

export const deleteOrder = async (id: string): Promise<{ success: boolean }> => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}; 