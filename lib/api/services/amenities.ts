const API_BASE_URL = 'https://booking-api-gg1w.onrender.com/api/v1';

export interface AmenityOption {
  id: number;
  name: string;
}

export interface RoomTypeOption {
  id: number;
  name: string;
  maxCapacity: number;
  price: number;
}

export const amenitiesService = {
  getAll: async (): Promise<AmenityOption[]> => {
    const response = await fetch(`${API_BASE_URL}/amenities`);
    if (!response.ok) throw new Error('Failed to fetch amenities');
    const data = await response.json();
    return data.data ?? data;
  },
};

export const roomTypesService = {
  getAll: async (): Promise<RoomTypeOption[]> => {
    const response = await fetch(`${API_BASE_URL}/room-types`);
    if (!response.ok) throw new Error('Failed to fetch room types');
    const data = await response.json();
    return data.data ?? data;
  },
};
