import axios from 'axios';
import { User, UserListParams, UserListResponse, UserStatistics } from '../types';
import config from '../config';

const API_BASE_URL = config.apiBaseUrl;

export const createUser = async (userData: Partial<User> & { password: string }): Promise<User> => {
  const response = await axios.post(`${API_BASE_URL}/users`, userData);
  return response.data;
};

export const getAllUsers = async (params: UserListParams): Promise<UserListResponse> => {
  const { page, pageSize, search, role, sortField, sortOrder } = params;
  const response = await axios.get(`${API_BASE_URL}/users`, {
    params: {
      page,
      pageSize,
      search,
      role,
      sortField,
      sortOrder
    }
  });
  return response.data;
};

export const getUserStatistics = async (): Promise<UserStatistics> => {
  const response = await axios.get(`${API_BASE_URL}/users/statistics`);
  return response.data;
};

export const updateUser = async (id: string, userData: Partial<User> & { password?: string }): Promise<User> => {
  const response = await axios.patch(`${API_BASE_URL}/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/users/${id}`);
}; 