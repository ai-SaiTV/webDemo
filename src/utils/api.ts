import axios from 'axios';
import { API_BASE_URL } from './constants';

export const createApiClient = (apiKey: string) => {
  return axios.create({                                 //创建 axios 实例
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });
};