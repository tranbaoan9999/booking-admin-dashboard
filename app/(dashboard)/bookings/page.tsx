'use client';

import { useBookings, useCancelBooking } from '@/lib/hooks/useBookings';
import { Booking } from '@/types';
import { BookingsTable } from '@/components/features/bookings/BookingsTable';
import { LoadingState } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Calendar } from 'lucide-react';

export default function BookingsPage() {
  const { data: bookings, isLoading, error, refetch } = useBookings();
  const cancelBooking = useCancelBooking();

  const handleView = (booking: Booking) => {
    console.log('View booking:', booking);
  };

  const handleEdit = (booking: Booking) => {
    console.log('Edit booking:', booking);
  };

  const handleCancel = async (booking: Booking) => {
    if (confirm(`Cancel booking #${booking.id} for ${booking.guest.name}?`)) {
      try {
        await cancelBooking.mutateAsync(booking.id);
      } catch (err) {
        console.error('Failed to cancel booking:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Booking Management
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          View and manage all guest bookings
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        {isLoading && <LoadingState message="Loading bookings…" />}

        {error && (
          <ErrorState
            message={error instanceof Error ? error.message : 'Failed to load bookings'}
            onRetry={refetch}
          />
        )}

        {!isLoading && !error && bookings && bookings.length === 0 && (
          <EmptyState
            icon={Calendar}
            title="No bookings yet"
            description="Bookings will appear here once guests start making reservations."
          />
        )}

        {!isLoading && !error && bookings && bookings.length > 0 && (
          <BookingsTable
            data={bookings}
            onView={handleView}
            onEdit={handleEdit}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}
