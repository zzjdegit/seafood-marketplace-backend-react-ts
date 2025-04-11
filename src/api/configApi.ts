import axios from 'axios';
import type { ConfigQueryParams, ConfigResponse, GovernanceData, DeliveryData } from '../types/config';
import config from '../config';

const BASE_URL = `${config.apiBaseUrl}/config`;

export const getConfigList = async (params: ConfigQueryParams): Promise<ConfigResponse> => {
  const response = await axios.get(`${BASE_URL}/list`, { params });
  return response.data;
};

export const getGovernanceData = async (): Promise<GovernanceData> => {
  const response = await axios.get(`${BASE_URL}/governance`);
  return response.data;
};

export const getDeliveryData = async (): Promise<DeliveryData> => {
  const response = await axios.get(`${BASE_URL}/delivery`);
  return response.data;
};

export const exportConfigData = async (params: ConfigQueryParams): Promise<Blob> => {
  const response = await axios.get(`${BASE_URL}/export`, {
    params,
    responseType: 'blob'
  });
  return response.data;
}; 