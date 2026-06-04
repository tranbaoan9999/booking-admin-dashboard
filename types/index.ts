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

export interface BookingGuest {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface BookingRoom {
  id: number;
  roomNumber: string;
  roomType: RoomType;
}

export interface Booking {
  id: number;
  checkIn: string;
  checkOut: string;
  numberOfGuests: number;
  room: BookingRoom;
  guest: BookingGuest;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'CHECKED_IN' | 'CHECKED_OUT';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingsApiResponse {
  success: boolean;
  data: Booking[];
  timestamp: string;
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
