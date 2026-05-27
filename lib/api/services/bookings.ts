import { apiClient } from '../client';
import { Booking } from '@/types';

export const bookingsService = {
  getAll: () => apiClient.get<Booking[]>('/bookings'),

  getById: (id: string) => apiClient.get<Booking>(`/bookings/${id}`),

  create: (data: Omit<Booking, 'id'>) => apiClient.post<Booking>('/bookings', data),

  update: (id: string, data: Partial<Booking>) =>
    apiClient.put<Booking>(`/bookings/${id}`, data),

  delete: (id: string) => apiClient.delete(`/bookings/${id}`),
};
