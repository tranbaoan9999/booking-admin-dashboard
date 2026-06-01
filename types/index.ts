export interface RoomType {
  id: number;
  name: string;
  maxCapacity: number;
  price: number;
}

export interface Room {
  id: number;
  roomNumber: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  roomType: RoomType;
  amenities: string[];
  imageUrls: string[];
}

export interface RoomsApiResponse {
  success: boolean;
  data: Room[];
  timestamp: string;
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
