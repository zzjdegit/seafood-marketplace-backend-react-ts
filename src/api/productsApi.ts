import axios from 'axios';
import { 
    Product, 
    ProductListResponse, 
    ProductListParams 
} from '../types/index';
import config from '../config';

const API_BASE_URL = config.apiBaseUrl;

// 获取所有产品
export const getAllProducts = async ({
    page,
    pageSize,
    search,
    category,
    sortField,
    sortOrder
}: ProductListParams): Promise<ProductListResponse> => {
    try {
        // Convert sortOrder to backend format
        const apiParams = {
            page,
            pageSize,
            search,
            category,
            sortField,
            sortOrder: sortOrder === 'ascend' ? 'asc' : sortOrder === 'descend' ? 'desc' : 'desc'
        };

        const response = await axios.get(`${API_BASE_URL}/products`, {
            params: apiParams,
        });
        // Map MongoDB _id to id for frontend
        const mappedData = response.data.data.map((product: any) => ({
            ...product,
            id: product._id,
        }));
        return {
            ...response.data,
            data: mappedData,
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// 获取单个产品详情
export const getProductById = async (id: string): Promise<Product> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/products/${id}`);
        return {
            ...response.data,
            id: response.data._id,
        };
    } catch (error) {
        console.error(`Error fetching product with id ${id}:`, error);
        throw error;
    }
};

// 创建新产品
export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/products`, product);
        return {
            ...response.data,
            id: response.data._id,
        };
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

// 更新产品
export const updateProduct = async (id: string, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/products/${id}`, product);
        return {
            ...response.data,
            id: response.data._id,
        };
    } catch (error) {
        console.error(`Error updating product with id ${id}:`, error);
        throw error;
    }
};

// 删除产品
export const deleteProduct = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${API_BASE_URL}/products/${id}`);
    } catch (error) {
        console.error(`Error deleting product with id ${id}:`, error);
        throw error;
    }
};

// 搜索产品
export const searchProducts = async (query: string): Promise<Product[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/products/search`, {
            params: { q: query }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
}; 