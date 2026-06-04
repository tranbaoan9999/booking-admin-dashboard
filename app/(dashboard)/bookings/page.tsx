'use client';

import { useState, useMemo } from 'react';
import { useBookings, useCancelBooking } from '@/lib/hooks/useBookings';
import { Booking } from '@/types';
import { BookingsTable } from '@/components/features/bookings/BookingsTable';
import { BookingDrawer } from '@/components/features/bookings/BookingDrawer';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Calendar, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DateFilter {
  checkIn: string;
  checkOut: string;
}

const EMPTY_FILTER: DateFilter = { checkIn: '', checkOut: '' };

function DateInput({
  id,
  label,
  value,
  onChange,
  min,
  max,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  min?: string;
  max?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </label>
      <div className="relative">
        <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          id={id}
          type="date"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2.5 text-sm text-gray-900',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'dark:border-gray-700 dark:bg-gray-900 dark:text-white',
            'dark:[color-scheme:dark]',
          )}
        />
      </div>
    </div>
  );
}

export default function BookingsPage() {
  const { data: bookings, isLoading, error, refetch } = useBookings();
  const cancelBooking = useCancelBooking();

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [draft, setDraft] = useState<DateFilter>(EMPTY_FILTER);
  const [applied, setApplied] = useState<DateFilter>(EMPTY_FILTER);

  const isFiltered = applied.checkIn !== '' || applied.checkOut !== '';

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter((b) => {
      if (applied.checkIn  && b.checkIn  < applied.checkIn)  return false;
      if (applied.checkOut && b.checkOut > applied.checkOut) return false;
      return true;
    });
  }, [bookings, applied]);

  const handleSearch = () => setApplied({ ...draft });

  const handleClear = () => {
    setDraft(EMPTY_FILTER);
    setApplied(EMPTY_FILTER);
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

  const displayBookings = isFiltered ? filteredBookings : (bookings ?? []);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Booking Management
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          View and manage all guest bookings
        </p>
      </div>

      {/* Filter bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="grid grid-cols-1 gap-4 flex-1 sm:grid-cols-2">
            <DateInput
              id="filter-check-in"
              label="Check-in from"
              value={draft.checkIn}
              onChange={(v) => setDraft((d) => ({ ...d, checkIn: v }))}
              max={draft.checkOut || undefined}
            />
            <DateInput
              id="filter-checkout"
              label="Check-out until"
              value={draft.checkOut}
              onChange={(v) => setDraft((d) => ({ ...d, checkOut: v }))}
              min={draft.checkIn || undefined}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={handleSearch}
              disabled={draft.checkIn === '' && draft.checkOut === ''}
              className="gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
            {isFiltered && (
              <Button variant="secondary" onClick={handleClear} className="gap-2">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {isFiltered && (
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Showing{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {filteredBookings.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {bookings?.length ?? 0}
            </span>{' '}
            booking{bookings?.length !== 1 ? 's' : ''} matching your filter.
          </p>
        )}
      </div>

      {/* Table card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        {isLoading && <LoadingState message="Loading bookings…" />}

        {error && (
          <ErrorState
            message={error instanceof Error ? error.message : 'Failed to load bookings'}
            onRetry={refetch}
          />
        )}

        {!isLoading && !error && displayBookings.length === 0 && (
          <EmptyState
            icon={Calendar}
            title={isFiltered ? 'No bookings match your filter' : 'No bookings yet'}
            description={
              isFiltered
                ? 'Try adjusting the date range or clear the filter to see all bookings.'
                : 'Bookings will appear here once guests start making reservations.'
            }
            action={isFiltered ? { label: 'Clear filter', onClick: handleClear } : undefined}
          />
        )}

        {!isLoading && !error && displayBookings.length > 0 && (
          <BookingsTable
            data={displayBookings}
            onRowClick={setSelectedBooking}
            onEdit={(booking) => console.log('Edit booking:', booking)}
            onCancel={handleCancel}
          />
        )}
      </div>

      <BookingDrawer
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
}
