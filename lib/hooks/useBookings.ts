import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsService } from '@/lib/api/services/bookings';

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: bookingsService.getAll,
  });
}

export function useBooking(id: number) {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: () => bookingsService.getById(id),
    enabled: !!id,
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingsService.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
