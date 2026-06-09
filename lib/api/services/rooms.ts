import { RoomsApiResponse, Room } from '@/types';
import { API_BASE_URL } from '@/lib/api/client';

export interface CreateRoomPayload {
  roomNumber: string;
  status: Room['status'];
  roomType: { id: number };
  amenities: number[];
  imageUrls: string[];
}

export const roomsService = {
  getAll: async (): Promise<Room[]> => {
    const response = await fetch(`${API_BASE_URL}/rooms`);
    if (!response.ok) {
      throw new Error('Failed to fetch rooms');
    }
    const data: RoomsApiResponse = await response.json();
    return data.data;
  },

  getById: async (id: number): Promise<Room> => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch room');
    }
    const data = await response.json();
    return data.data;
  },

  create: async (data: CreateRoomPayload): Promise<Room> => {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create room');
    }
    const result = await response.json();
    return result.data;
  },

  update: async (id: number, data: Partial<Room>): Promise<Room> => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update room');
    }
    const result = await response.json();
    return result.data;
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete room');
    }
  },
};
