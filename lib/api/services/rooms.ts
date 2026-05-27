import { apiClient } from '../client';
import { Room } from '@/types';

export const roomsService = {
  getAll: () => apiClient.get<Room[]>('/rooms'),

  getById: (id: string) => apiClient.get<Room>(`/rooms/${id}`),

  create: (data: Omit<Room, 'id'>) => apiClient.post<Room>('/rooms', data),

  update: (id: string, data: Partial<Room>) =>
    apiClient.put<Room>(`/rooms/${id}`, data),

  delete: (id: string) => apiClient.delete(`/rooms/${id}`),
};
