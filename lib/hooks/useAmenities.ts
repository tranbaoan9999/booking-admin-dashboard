import { useQuery } from '@tanstack/react-query';
import { amenitiesService, roomTypesService } from '@/lib/api/services/amenities';

export function useAmenities() {
  return useQuery({
    queryKey: ['amenities'],
    queryFn: amenitiesService.getAll,
    staleTime: Infinity
  });
}

export function useRoomTypes() {
  return useQuery({
    queryKey: ['room-types'],
    queryFn: roomTypesService.getAll,
    staleTime: Infinity
  });
}
