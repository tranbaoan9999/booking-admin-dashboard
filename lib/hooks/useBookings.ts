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

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: import('@/types').Booking['status'] }) =>
      bookingsService.updateStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.setQueryData(['bookings', updated.id], updated);
    },
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
