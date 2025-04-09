import axios from 'axios';
import config from '../config';
import { Product, ProductStatistics, ProductListParams, ApiResponse } from '../types';

const BASE_URL = `${config.apiBaseUrl}/products`;

// 获取所有产品
export const getProducts = async (params: ProductListParams): Promise<ApiResponse<Product>> => {
    try {
        const response = await axios.get(BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// 获取单个产品详情
export const getProductById = async (id: string): Promise<Product> => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with id ${id}:`, error);
        throw error;
    }
};

// 创建新产品
export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    try {
        const response = await axios.post(BASE_URL, productData);
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

// 更新产品
export const updateProduct = async (id: string, productData: Partial<Omit<Product, 'id'>>): Promise<Product> => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, productData);
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

// 删除产品
export const deleteProduct = async (id: string): Promise<{ success: boolean }> => {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

// 搜索产品
export const searchProducts = async (query: string): Promise<Product[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/search`, {
            params: { q: query }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

// Get product statistics
export const getProductStatistics = async (): Promise<ProductStatistics> => {
    try {
        const response = await axios.get(`${BASE_URL}/statistics`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product statistics:', error);
        throw error;
    }
}; 