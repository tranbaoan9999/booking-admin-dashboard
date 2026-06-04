import { Booking, BookingsApiResponse } from '@/types';

const API_BASE_URL = 'https://booking-api-gg1w.onrender.com/api/v1';

export const bookingsService = {
  getAll: async (): Promise<Booking[]> => {
    const response = await fetch(`${API_BASE_URL}/bookings`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    const data: BookingsApiResponse = await response.json();
    return data.data;
  },

  getById: async (id: number): Promise<Booking> => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`);
    if (!response.ok) throw new Error('Failed to fetch booking');
    const data = await response.json();
    return data.data;
  },

  updateStatus: async (id: number, status: Booking['status']): Promise<Booking> => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update booking status');
    const data = await response.json();
    return data.data;
  },

  cancel: async (id: number): Promise<Booking> => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to cancel booking');
    const data = await response.json();
    return data.data;
  },
};
