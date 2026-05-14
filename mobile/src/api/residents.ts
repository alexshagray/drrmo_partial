import axios from 'axios';

const API = 'http://192.168.254.112:8000/api';

export interface Resident {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  birth_date: string;
  gender: string;
  civil_status: string;
  address: string;
  barangay: string;
  zone_sitio: string | null;
  contact_number: string;
  email: string | null;
  emergency_contact_name: string | null;
  emergency_contact_number: string | null;
  emergency_contact_relationship: string | null;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
}

export const searchResidents = (query: string) =>
  axios.get<Resident[]>(`${API}/residents/search?query=${query}`);
