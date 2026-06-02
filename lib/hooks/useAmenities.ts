import { useQuery } from '@tanstack/react-query';
import { amenitiesService, roomTypesService } from '@/lib/api/services/amenities';

export function useAmenities() {
  return useQuery({
    queryKey: ['amenities'],
    queryFn: amenitiesService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRoomTypes() {
  return useQuery({
    queryKey: ['room-types'],
    queryFn: roomTypesService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}
