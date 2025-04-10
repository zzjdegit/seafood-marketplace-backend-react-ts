import axios from 'axios';
import config from '../config';
import { Order, OrderListParams, OrderStatistics } from '../types';

const BASE_URL = `${config.apiBaseUrl}/orders`;

export const getOrders = async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    sortField?: string;
    sortOrder?: string;
}): Promise<{ data: Order[]; total: number }> => {
    try {
        const { page = 1, pageSize = 10, search = '', status = '', sortField = 'createdAt', sortOrder = '1' } = params;
        
        // Build query parameters
        const queryParams = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
            search,
            status,
            sortField,
            sortOrder
        });

        const response = await axios.get(`${BASE_URL}?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getOrderStatistics = async (): Promise<OrderStatistics> => {
  try {
    const response = await axios.get(`${BASE_URL}/statistics`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrder = async (orderData: Omit<Order, 'id' | 'totalPrice' | 'createdAt'>): Promise<Order> => {
  try {
    const response = await axios.post(BASE_URL, orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateOrder = async (id: string, orderData: Partial<Order>): Promise<Order> => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, orderData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteOrder = async (id: string): Promise<{ success: boolean }> => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 