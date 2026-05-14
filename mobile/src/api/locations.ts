import axios from 'axios';

const API_BASE_URL = 'http://192.168.254.112:8000';
const API = `${API_BASE_URL}/api`;

export interface Location {
  id: number;
  user_id: number;
  latitude: number;
  longitude: number;
  address: string | null;
  captured_at: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  locations?: T;
  location?: T;
}

export const getLocations = (userId?: string) =>
  axios.get<ApiResponse<Location[]>>(`${API}/locations`, {
    params: userId ? { user_id: userId } : {}
  });

export const getLocation = (id: string) =>
  axios.get<ApiResponse<Location>>(`${API}/locations/${id}`);

export const createLocation = (data: { latitude: number; longitude: number; address?: string; user_id?: number }) =>
  axios.post<ApiResponse<Location>>(`${API}/locations`, data);
