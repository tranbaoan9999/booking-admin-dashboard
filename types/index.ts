export interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  price: number;
  status: 'available' | 'occupied' | 'maintenance';
  amenities: string[];
}

export interface Booking {
  id: string;
  roomId: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  totalPrice: number;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  totalBookings: number;
  revenue: number;
}
